import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useProspectStore = defineStore('prospect', {
    state: () => ({
        prospects: [],
        prospect: null,
        loading: false,
        error: null,
        unreadCount: 0,
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

        async fetchProspects() {
            this.loading = true;
            this.error = null;
            try {
                const { $axios } = useNuxtApp();
                const response = await $axios.get('/prospects', this.authHeaders());
                this.prospects = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Erreur lors du chargement des prospects';
            } finally {
                this.loading = false;
            }
        },

        async countUnread() {
            try {
                const { $axios } = useNuxtApp();
                const response = await $axios.get('/prospects/count-unread', this.authHeaders());
                this.unreadCount = response.data.count;
            } catch (error) {
                console.error(error);
            }
        },

        async toggleStatus(id) {
            this.loading = true;
            try {
                const { $axios } = useNuxtApp();
                const response = await $axios.patch(`/prospects/${id}/toggle-status`, {}, this.authHeaders());
                
                // Mettre à jour l'élément dans la liste locale
                const index = this.prospects.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.prospects[index] = response.data.data;
                }
                
                await this.countUnread();
                
                useNuxtApp().$toast.success('Statut mis à jour');
                return response.data;
            } catch (error) {
                useNuxtApp().$toast.error('Erreur lors de la mise à jour');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteProspect(id) {
            try {
                const { $axios } = useNuxtApp();
                await $axios.delete(`/prospects/${id}`, this.authHeaders());
                this.prospects = this.prospects.filter(p => p.id !== id);
                await this.countUnread();
                useNuxtApp().$toast.success('Prospect supprimé');
            } catch (error) {
                useNuxtApp().$toast.error('Erreur lors de la suppression');
                throw error;
            }
        }
    }
});
