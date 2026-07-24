import { defineStore } from "pinia";
import axios from "axios";

export const useGalerieStore = defineStore("galerie", {
  state: () => ({
    albums: [],
    photos: [],
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

    async fetchAlbums() {
      this.isLoading = true;
      try {
        const response = await axios.get("/galerie/albums", this.authHeaders());
        this.albums = response.data.data;
        return this.albums;
      } catch (error) {
        console.error("Erreur chargement des albums:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAlbumById(id) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/galerie/albums/${id}`, this.authHeaders());
        return response.data.data;
      } catch (error) {
        console.error("Erreur chargement album:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPhotos(albumId) {
      this.isLoading = true;
      try {
        const response = await axios.get(`/galerie/photos?album=${albumId}`, this.authHeaders());
        this.photos = response.data.data;
        return this.photos;
      } catch (error) {
        console.error("Erreur chargement des photos:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addAlbum(formData) {
      this.isLoading = true;
      try {
        const response = await axios.post("/galerie/albums", formData, this.authHeaders());
        await this.fetchAlbums();
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async updateAlbum(id, formData) {
      this.isLoading = true;
      try {
        // Laravel trick for PUT with FormData
        if (formData instanceof FormData && !formData.has('_method')) {
          formData.append('_method', 'PUT');
        }
        const response = await axios.post(`/galerie/albums/${id}`, formData, this.authHeaders());
        await this.fetchAlbums();
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAlbum(id) {
      this.isLoading = true;
      try {
        await axios.delete(`/galerie/albums/${id}`, this.authHeaders());
        this.albums = this.albums.filter((a) => a.id !== id);
      } finally {
        this.isLoading = false;
      }
    },

    async addPhotos(formData) {
      this.isLoading = true;
      try {
        const response = await axios.post("/galerie/photos", formData, this.authHeaders());
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePhoto(id, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(`/galerie/photos/${id}`, payload, this.authHeaders());
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePhoto(id) {
      this.isLoading = true;
      try {
        await axios.delete(`/galerie/photos/${id}`, this.authHeaders());
        this.photos = this.photos.filter((p) => p.id !== id);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
