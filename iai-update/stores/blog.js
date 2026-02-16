// stores/blog.js
import { defineStore } from "pinia";
import axios from "axios";

export const useBlogStore = defineStore("blog", {
  state: () => ({
    blogs: [],
    blog: null,
    isLoading: false,
  }),


  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      };
    },

    multipartHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      };
    },

    async fetchBlogs() {
      this.isLoading = true;
      try {
       

        const response = await axios.get("/publications", {
          ...this.authHeaders(),
        });
          this.blogs = response.data.data || response.data;
       

        return response.data;
      } catch (error) {
        console.error("Erreur chargement des blogs:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchBlog(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/publications/${id}`,
          this.authHeaders()
        );
        
        this.blog = response.data.data || response.data;
        return this.blog;
      } catch (error) {
        console.error(`Erreur chargement du blog ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createBlog(formData) {
      this.isLoading = true;
      try {
        if (!(formData instanceof FormData)) {
          console.error("formData n'est pas une instance de FormData");
          throw new Error("Les données doivent être au format FormData");
        }

        const response = await axios.post(
          "/publications/nouveau",
          formData,
          this.multipartHeaders()
        );

        const newBlog = response.data.data || response.data;
        this.blogs = [newBlog, ...this.blogs];

        return newBlog;
      } catch (error) {
        console.error("Erreur création du blog:", error);
        
        // Afficher les erreurs de validation
        if (error.response?.data?.errors) {
          console.error("Erreurs de validation:", error.response.data.errors);
        }
        
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateBlog(id, formData) {
      this.isLoading = true;
      try {
        if (!(formData instanceof FormData)) {
          console.error("formData n'est pas une instance de FormData");
          throw new Error("Les données doivent être au format FormData");
        }

        formData.append('_method', 'PUT');

        const response = await axios.post(
          `/publications/${id}/modifier`,
          formData,
          this.multipartHeaders()
        );

        const updatedBlog = response.data.data || response.data;
        const index = this.blogs.findIndex(b => b.id === id);
        if (index !== -1) {
          this.blogs[index] = updatedBlog;
        }

        if (this.blog && this.blog.id === id) {
          this.blog = updatedBlog;
        }

        return updatedBlog;
      } catch (error) {
        console.error(`Erreur mise à jour du blog ${id}:`, error);
        if (error.response?.data?.errors) {
          console.error("Erreurs de validation:", error.response.data.errors);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteBlog(id) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `/publications/${id}`,
          this.authHeaders()
        );

        this.blogs = this.blogs.filter(b => b.id !== id);

        if (this.blog && this.blog.id === id) {
          this.blog = null;
        }

        return response.data;
      } catch (error) {
        console.error(`Erreur suppression du blog ${id}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async publishBlog(blog) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/publications/${blog}/togglestatus`,
          null,
          this.authHeaders()
        );
        return response.data;
      } catch (error) {
        console.error(`Erreur publication du blog ${blog}:`, error);
        throw error;
      } finally {
        this.isLoading = false;
      }a
    },
   
  },
});