import { defineStore } from "pinia";
import axios from "axios";

export const useLiveKitStore = defineStore("livekit", {
  state: () => ({
    tokenData: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token") || localStorage.getItem("candidat-token");

      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

    async fetchRoomToken(roomName) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "/livekit/token",
          { room_name: roomName },
          this.authHeaders()
        );

        this.tokenData = response.data;
        return response.data;
      } catch (err) {
        console.error("Erreur génération token LiveKit:", err);
        this.error = err.response?.data?.message || err.message || "Erreur d'accès à la visioconférence.";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
