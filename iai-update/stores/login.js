import axios from "axios";
import { useState } from "#app";

export const useLoginStore = defineStore("login", {
  state: () => ({
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
    async loginUser(credentials) {
      this.isLoading = true;
      try {
        const url = credentials.rememberMe
          ? "/espace-etudiant/me-connecter"
          : "/login";

        const response = await axios.post(url, credentials);
        this.isLoading = false;
        localStorage.setItem("gest-ecole-token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const userState = useState("user");
        userState.value = response.data.user;
        return response.data;
      } catch (error) {
        this.isLoading = false;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;

      try {
        const response = await axios.post("/logout");

        localStorage.removeItem("gest-ecole-token");
        localStorage.removeItem("user");
        return response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async forgetPassword(credentials) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/mot-de-passe-oublie/store",
          credentials,
        );
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async resetPassword(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post("/reset-password/store", payload);
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async changePassword(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/change-password",
          payload,
          this.authHeaders(),
        );
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    isAuthenticated() {
      if (!process.client) return true;
      return !!localStorage.getItem("gest-ecole-token");
    },

    async fetchUser() {
      try {
        const response = await axios.get("/user", this.authHeaders());
        localStorage.setItem("user", JSON.stringify(response.data));
        const userState = useState("user");
        userState.value = response.data;
        return response.data;
      } catch (error) {
        console.error("Erreur rafraîchissement utilisateur:", error);
        throw error;
      }
    },
  },
});
