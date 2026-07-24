import { defineStore } from "pinia";
import axios from "axios";

export const useSyllabusStore = defineStore("syllabus", {
  state: () => ({
    etudiantSyllabuses: null,
    enseignantSyllabuses: null,
    currentSyllabus: null,
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

    async fetchEtudiantSyllabuses() {
      this.isLoading = true;
      try {
        // Appel de la nouvelle route dédiée qui filtre par filière/niveau
        const response = await axios.get("/espace-etudiant/syllabuses", this.authHeaders());
        
        // La structure retournée par l'API est déjà { semestres: { ... } }
        this.etudiantSyllabuses = response.data;
        return this.etudiantSyllabuses;
      } catch (error) {
        console.error("Erreur lors du chargement des syllabuses étudiant:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEnseignantSyllabuses() {
      this.isLoading = true;
      try {
        const response = await axios.get("/presence/get-my-course", this.authHeaders());
        
        // Transformer les cours en UVs uniques (matières) pour le syllabus
        const uniqueUvs = [];
        const uvIds = new Set();
        
        response.data.forEach(cours => {
          if (cours.uv && !uvIds.has(cours.uv.id)) {
            uvIds.add(cours.uv.id);
            
            // On enrichit l'UV avec les données du cours (filière, niveau, semestre)
            const uv = { 
              ...cours.uv,
              filiere: cours.filiere || cours.uv.filiere,
              niveau: cours.niveau || cours.uv.niveau,
              periode: cours.periode || cours.uv.periode
            };
            
            uniqueUvs.push(uv);
          }
        });
        
        this.enseignantSyllabuses = uniqueUvs;
        return uniqueUvs;
      } catch (error) {
        console.error("Erreur lors du chargement des syllabuses enseignant:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSyllabusDetail(slug) {
      // Réinitialiser le syllabus courant pour éviter d'afficher d'anciennes données
      this.currentSyllabus = null;
      
      // 1. Chercher d'abord dans les données déjà chargées (si présentes)
      const findInList = (list) => {
        if (!list) return null;
        // Si c'est un objet avec une clé 'semestres' (cas étudiant)
        if (list.semestres) {
          for (const s in list.semestres) {
            const found = list.semestres[s].find(uv => uv.slug === slug);
            if (found) return found;
          }
          return null;
        }
        // Si c'est une liste simple (cas enseignant)
        return Array.isArray(list) ? list.find(item => item.slug === slug) : null;
      };
      
      const existingUv = findInList(this.enseignantSyllabuses) || findInList(this.etudiantSyllabuses);
      
      // Si on a l'UV en local, on peut l'utiliser pour l'affichage immédiat (optimiste)
      // mais on DOIT quand même charger les détails complets via l'API
      if (existingUv) {
        this.currentSyllabus = {
          uv: existingUv,
          syllabus: existingUv.syllabus || null
        };
        // Si on a déjà les champs détaillés (cas rare où on revient sur la page), on peut s'arrêter
        if (existingUv.syllabus && existingUv.syllabus.description) {
           return this.currentSyllabus;
        }
      }

      // 2. Faire l'appel API pour les détails complets (nécessaire car la liste est partielle)
      this.isLoading = true;
      try {
        const response = await axios.get(`/syllabuses/${slug}`, this.authHeaders());
        this.currentSyllabus = response.data;
        return response.data;
      } catch (error) {
        console.error("Erreur lors du chargement du détail du syllabus:", error);
        
        // Si erreur 500 ou 404, on prépare un objet vide pour permettre la création
        if (error.response?.status === 500 || error.response?.status === 404) {
          this.currentSyllabus = {
            uv: { nom: slug.replace(/-/g, ' ').toUpperCase(), slug: slug },
            syllabus: null
          };
          return this.currentSyllabus;
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveSyllabus(slug, data) {
      this.isLoading = true;
      try {
        const response = await axios.post(`/syllabuses/${slug}`, data, this.authHeaders());
        
        // Mise à jour locale pour refléter le changement instantanément
        if (this.currentSyllabus && this.currentSyllabus.uv.slug === slug) {
          this.currentSyllabus.syllabus = response.data.syllabus;
        }

        if (this.enseignantSyllabuses) {
          const uvIndex = this.enseignantSyllabuses.findIndex(uv => uv.slug === slug);
          if (uvIndex !== -1) {
            this.enseignantSyllabuses[uvIndex].syllabus = response.data.syllabus;
          }
        }
        
        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du syllabus:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async uploadAttachment(slug, formData) {
      this.isLoading = true;
      try {
        // Combiner authHeaders avec les en-têtes multipart
        const config = this.authHeaders();
        config.headers['Content-Type'] = 'multipart/form-data';
        
        const response = await axios.post(`/syllabuses/${slug}/upload-attachment`, formData, config);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'upload du fichier:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
