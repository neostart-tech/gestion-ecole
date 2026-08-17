import { defineStore } from "pinia";
import axios from "axios";

export const useUvStore = defineStore("uv", {
  state: () => ({
    uvs: [],
    teacherMatieres: [],
    uv:{},
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
    async fetchUv() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/unites-de-valeur/liste",
          this.authHeaders()
        );

        this.uvs = response.data.data;
        return this.uvs;
      } catch (error) {
        console.error("Erreur chargement des unités des matieres:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTeacherMatieres() {
      this.isLoading = true;
      try {
        // Premier essai : Endpoint presence/get-my-course (contient filiere et periode)
        const resPresence = await axios.get("/presence/get-my-course", this.authHeaders()).catch(() => null);
        const coursList = Array.isArray(resPresence?.data) 
          ? resPresence.data 
          : (Array.isArray(resPresence?.data?.data) ? resPresence.data.data : []);

        const uniqueUvs = [];
        const uvIds = new Set();

        coursList.forEach(cours => {
          const uvObj = cours.uv || cours;
          if (uvObj && (uvObj.id || uvObj.nom)) {
            const idKey = uvObj.id || uvObj.nom;
            if (!uvIds.has(idKey)) {
              uvIds.add(idKey);
              const uv = { 
                ...uvObj,
                filiere: cours.filiere || uvObj.filiere || cours.filiere_nom,
                niveau: cours.niveau || uvObj.niveau || cours.niveau_nom,
                periode: cours.periode || uvObj.periode || cours.semestre || cours.periode_nom
              };
              uniqueUvs.push(uv);
            }
          }
        });

        if (uniqueUvs.length > 0) {
          this.teacherMatieres = uniqueUvs;
          return this.teacherMatieres;
        }

        // Deuxième essai : /livekit/teacher-matieres
        const response = await axios.get(
          "/livekit/teacher-matieres",
          this.authHeaders()
        );

        const data = response.data?.data ?? response.data;
        this.teacherMatieres = Array.isArray(data) ? data : [];
        
        if (this.teacherMatieres.length === 0) {
          await this.fetchUv();
          this.teacherMatieres = this.uvs;
        }

        return this.teacherMatieres;
      } catch (error) {
        console.error("Erreur lors de la récupération des matières enseignant:", error);
        try {
          await this.fetchUv();
          this.teacherMatieres = this.uvs;
        } catch (e) {
          this.teacherMatieres = [];
        }
        return this.teacherMatieres;
      } finally {
        this.isLoading = false;
      }
    },

    //  async getUe(id) {
    //   this.isLoading = true;
    //   try {
    //     const response = await axios.get(
    //       `/unites-d-enseignement/${id}/a-propos`,
    //       this.authHeaders()
    //     );

    //     this.ue = response.data.data;
    //   } catch (error) {
    //     console.error("Erreur chargement de l'unité d'enseignement:", error);
    //     throw error;
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },

 
    async addUv(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/unites-de-valeur/ajouter-une-matiere",
          payload,
          this.authHeaders()
        );

        this.uvs.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

   
    async deleteUv(uv) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/unites-de-valeur/${uv}/supprimer`,
          this.authHeaders()
        );

        this.uvs = this.uvs.filter(
          (f) => f.id !== uv
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updateUv(id, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/unites-de-valeur/${id}/modifier`,
          payload,
          this.authHeaders()
        );

        const index = this.uvs.findIndex(
          (f) => f.id === id
        );

        if (index !== -1) {
          this.uvs[index] = response.data.data ?? response.data;
        }

        return response.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
