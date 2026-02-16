import { defineStore } from "pinia";
import axios from "axios";

export const useParametreStore = defineStore("parametre", {
  state: () => ({
    parametres: [],        
    isLoading: false,      
    error: null,           
    lastUpdated: null,  
  }),

  getters: {
    parametresByKey: (state) => {
      return state.parametres.reduce((acc, param) => {
        // Garder la clé originale sans modification
        acc[param.key] = param;
        return acc;
      }, {});
    },

    getParamValue: (state) => (key) => {
      const param = state.parametres.find(p => p.key === key);
      return param ? param.value : null;
    },

    getSelectOptions: (state) => (key) => {
      const param = state.parametres.find(p => p.key === key);
      if (!param || param.type !== 'select' || !param.options) return [];
      
      return param.options.split(',').map(option => {
        const [value, label] = option.split('|');
        return {
          value: value.trim(),
          label: label ? label.trim() : value.trim()
        };
      }).filter(opt => opt.value);
    },
  },

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

    async fetchParametres() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          "/parametre/configuration",
          this.authHeaders()
        );

        if (response.data && response.data.data) {
          this.parametres = response.data.data;
        } else if (Array.isArray(response.data)) {
          this.parametres = response.data;
        } else {
          console.error("Format de réponse inattendu:", response.data);
          this.parametres = [];
        }
        
        this.lastUpdated = new Date().toISOString();
        return response.data;
      } catch (error) {
        console.error("Erreur chargement:", error);
        this.error = error.response?.data?.message || "Erreur de chargement";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateParametres(formData) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const data = new FormData();
        data.append('_method', 'PUT');
        
        // Ajouter toutes les valeurs
        Object.entries(formData).forEach(([key, value]) => {
          if (key === '_delete_files') return;
          
          if (value instanceof File) {
            data.append(`config_value[${key}]`, value);
          } else if (value !== null && value !== undefined) {
            // Important: pour les booléens, on envoie toujours 1 ou 0
            if (typeof value === 'boolean') {
              data.append(`config_value[${key}]`, value ? '1' : '0');
            } else {
              data.append(`config_value[${key}]`, String(value));
            }
          }
        });

        // Ajouter les fichiers à supprimer
        if (formData._delete_files) {
          Object.entries(formData._delete_files).forEach(([key, shouldDelete]) => {
            if (shouldDelete) {
              data.append(`delete_file[${key}]`, '1');
            }
          });
        }

        console.log('Envoi des données:', Object.fromEntries(data));

        const response = await axios.post(
          "/parametre/parametre/modification",
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("gest-ecole-token")}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Réponse reçue:', response.data);

        if (response.data && response.data.data) {
          this.parametres = response.data.data;
        } else if (Array.isArray(response.data)) {
          this.parametres = response.data;
        }

        this.lastUpdated = new Date().toISOString();
        return response.data;
      } catch (error) {
        console.error("Erreur mise à jour:", error);
        console.error("Détails de l'erreur:", error.response?.data);
        this.error = error.response?.data?.message || "Erreur de mise à jour";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});