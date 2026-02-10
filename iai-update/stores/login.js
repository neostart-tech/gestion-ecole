import axios from "axios";

export const useLoginStore = defineStore("login", {
  state: () => ({
    isLoading: false,
  }),
  actions: {
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
        return response.data;
      } catch (error) {
        this.isLoading = false;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      localStorage.removeItem("gest-ecole-token");
      localStorage.removeItem("user");
    },

    isAuthenticated() {
      if (!process.client) return true;
      return !!localStorage.getItem("gest-ecole-token");
    },
  },
});
