
import { defineStore } from "pinia";
import axios from "axios";

export const useRoleStore = defineStore("role", {
  state: () => ({
    roles: [],
    availablePermissions: [],
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

    async fetchRoles() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          "/roles/liste",
          this.authHeaders()
        );

        this.roles = response.data.data;
      } catch (error) {
        console.error("Erreur chargement roles:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRole(roleSlug) {
      const response = await axios.get(
        `/roles/${roleSlug}/a-propos`,
        this.authHeaders()
      );

      const role = response.data.data ?? response.data;
      this.replaceRoleInState(roleSlug, role);
      return role;
    },

    async fetchAvailablePermissions() {
      const response = await axios.get(
        "/roles/permissions-disponibles",
        this.authHeaders()
      );

      this.availablePermissions = response.data.data;
      return this.availablePermissions;
    },

    async addRole(payload) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/roles/ajouter-un-role",
          payload,
          this.authHeaders()
        );

        this.roles.push(response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async updateRole(roleSlug, payload) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/roles/${roleSlug}/modifier`,
          payload,
          this.authHeaders()
        );

        this.replaceRoleInState(roleSlug, response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async syncRolePermissions(roleSlug, permissionIds) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/roles/${roleSlug}/permissions`,
          { permissions: permissionIds },
          this.authHeaders()
        );

        this.replaceRoleInState(roleSlug, response.data.data ?? response.data);
        return response.data;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteRole(roleSlug) {
      this.isLoading = true;
      try {
        await axios.delete(
          `/roles/${roleSlug}/supprimer`,
          this.authHeaders()
        );

        this.roles = this.roles.filter((r) => r.slug !== roleSlug);
      } finally {
        this.isLoading = false;
      }
    },

    replaceRoleInState(roleSlug, updatedRole) {
      const index = this.roles.findIndex((r) => r.slug === roleSlug);
      if (index !== -1) {
        this.roles[index] = updatedRole;
      }
    },
  },
});
