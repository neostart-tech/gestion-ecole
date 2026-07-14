import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    enseignants: [],
    surveillants: [],
    programmes: [],
    surveillant: null,
    enseignant: null,
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    nombreEnseignant: (state) => state.enseignants.length,
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

    async fetchUsersEnseignant() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/users/liste-des-enseignants",
          this.authHeaders(),
        );
        this.enseignants = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des enseignants:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUsersSurveillant() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/users/liste-des-suveillants",
          this.authHeaders(),
        );
        this.surveillants = response.data.data; // Correction: surveillants au lieu de enseignants
      } catch (error) {
        console.error("Erreur chargement des surveillants:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async userDisplayCalendar(user) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/users/${user}/emploi-du-temps`,
          this.authHeaders(),
        );
        this.programmes = response.data.data;
      } catch (error) {
        console.error("Erreur chargement du programme:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUsers() {
      this.isLoading = true;
      try {
        const response = await axios.get("/users/liste", this.authHeaders());
        this.users = response.data.data;
      } catch (error) {
        console.error("Erreur chargement des utilisateurs:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUser(slug) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/users/${slug}/show`, this.authHeaders());
        this.user= response.data.data;
      } catch (error) {
        console.error("Erreur chargement des utilisateurs:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Méthode pour ajouter un utilisateur avec FormData (pour les fichiers)
    async addUserWithFiles(formData) {
      this.isLoading = true;
      this.error = null;

      try {
        // Configurer les headers pour FormData
        const token = localStorage.getItem("gest-ecole-token");
        const headers = {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        };

        const response = await axios.post(
          "/users/create-enseignant",
          formData,
          {
            headers,
          },
        );

        if (response.data?.data) {
          this.users.unshift(response.data.data);
          this.enseignants.unshift(response.data.data);
        }

        return response.data;
      } catch (error) {
        console.error("Erreur ajout enseignant:", error);
        this.error = error.response?.data?.message || error.message;

        // Gérer les erreurs de validation
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors;
          const errorMessage = Object.values(validationErrors)
            .flat()
            .join("\n");
          throw new Error(errorMessage);
        }

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Méthode alternative pour ajouter un utilisateur sans fichiers
    async addUser(payload) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post(
          "/users/create",
          payload,
          this.authHeaders(),
        );

        if (response.data?.data) {
          this.users.unshift(response.data.data);
        }

        return response.data;
      } catch (error) {
        console.error("Erreur ajout utilisateur:", error);
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addEnseignant(payload) {
      this.isLoading = true;
      this.error = null;

      try {
        // Vérifier si c'est un FormData (pour les fichiers) ou un objet simple
        let response;

        if (payload instanceof FormData) {
          // Si c'est un FormData, configurer les headers correctement
          const token = localStorage.getItem("gest-ecole-token");
          const headers = {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          };

          response = await axios.post("/users/create-enseignant", payload, {
            headers,
          });
        } else {
          // Si c'est un objet simple
          response = await axios.post(
            "/users/create-enseignant",
            payload,
            this.authHeaders(),
          );
        }

        if (response.data?.data) {
          this.users.unshift(response.data.data);
          this.enseignants.unshift(response.data.data);
        }

        return response.data;
      } catch (error) {
        console.error("Erreur ajout enseignant:", error);
        this.error = error.response?.data?.message || error.message;

        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors;
          const errorMessage = Object.values(validationErrors)
            .flat()
            .join("\n");
          throw new Error(errorMessage);
        }

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateUser(slug, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/users/${slug}/update`,
          updatedData,
          this.authHeaders(),
        );
        const index = this.users.findIndex((u) => u.slug === slug);

        if (index !== -1) {
          this.users[index] = response.data.data ?? response.data;
        }
        return response.data;
      } catch (error) {
        console.error("Erreur mise à jour:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateUserEnseignant(slug, updatedData) {
  this.isLoading = true;
  try {
    let response;
    
    // Vérifier si c'est un FormData (pour les fichiers)
    if (updatedData instanceof FormData) {
      const token = localStorage.getItem("gest-ecole-token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      };
      
      console.log("Envoi FormData pour mise à jour:", slug);
      
      response = await axios.post(
        `/users/${slug}/update-enseignant?_method=PUT`,
        updatedData,
        { headers }
      );
    } else {
      // Pour les données simples (sans fichiers)
      response = await axios.put(
        `/users/${id}/update-enseignant`,
        updatedData,
        this.authHeaders(),
      );
    }
    
    const index = this.users.findIndex((u) => u.slug === slug);
    if (index !== -1) {
      this.users[index] = response.data.data ?? response.data;
    }
    
    const enseignantIndex = this.enseignants.findIndex((u) => u.slug === slug);
    if (enseignantIndex !== -1) {
      this.enseignants[enseignantIndex] = response.data.data ?? response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour enseignant:", error);
    throw error;
  } finally {
    this.isLoading = false;
  }
},

async updateFiscalite(slug, updatedData) {
  this.isLoading = true;
  try {
    const token = localStorage.getItem("gest-ecole-token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    };
    
    // On utilise POST avec _method=PUT pour supporter les fichiers
    const response = await axios.post(
      `/users/${slug}/update-fiscalite?_method=PUT`,
      updatedData,
      { headers }
    );

    // Mettre à jour l'utilisateur dans le state si présent
    if (this.user && this.user.slug === slug) {
      this.user = response.data.data ?? response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour fiscalité:", error);
    throw error;
    } finally {
      this.isLoading = false;
    }
  },

  async fetchFiscalite() {
    const token = localStorage.getItem("gest-ecole-token");
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    };
    
    const response = await axios.get("/user/fiscalite", { headers });
    return response.data;
  },

    async deleteUser(slug) {
      this.isLoading = true;
      try {
        await axios.delete(`/users/${slug}/delete`, this.authHeaders());
        this.users = this.users.filter((u) => u.slug !== slug);
        this.enseignants = this.enseignants.filter((u) => u.slug !== slug);
        this.surveillants = this.surveillants.filter((u) => u.slug !== slug);
      } catch (error) {
        console.error("Erreur suppression utilisateur :", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async EditUser(slug) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/users/${slug}/edit`,
          this.authHeaders(),
        );
        this.user = response.data.data;
        return response.data;
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async importUsers(formData) {
      this.isLoading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("gest-ecole-token");
        const headers = {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        };

        const response = await axios.post("/users/import", formData, {
          headers,
        });

        return response.data;
      } catch (error) {
        console.error("Erreur import:", error);
        this.error = error.response?.data?.message || error.message;

        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors;
          const errorMessage = Object.values(validationErrors)
            .flat()
            .join(", ");
          throw new Error(errorMessage);
        }

        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
