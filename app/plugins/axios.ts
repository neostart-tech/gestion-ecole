import { defineNuxtPlugin } from '#app';
import config from '../../config';
import * as axios from 'axios'

const base_url = config.app_local ? config.app_dev_url : config.app_prod_url;

export default defineNuxtPlugin((nuxtApp) => {
    axios.default.defaults.baseURL = base_url;

    axios.default.interceptors.request.use((reqConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('gest-ecole-token');
            if (token) {
                reqConfig.headers = reqConfig.headers || {};
                reqConfig.headers.Authorization = `Bearer ${token}`;
            }
        }
        return reqConfig;
    });

    axios.default.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const path = window.location.pathname;
                if (path === '/candidat' || path.startsWith('/candidat/')) {
                    localStorage.removeItem('candidat-token');
                    localStorage.removeItem('candidat-user');
                    navigateTo('/candidat/login');
                    return Promise.reject(error);
                }

                localStorage.removeItem('gest-ecole-token');
                localStorage.removeItem('user');
                navigateTo('/login');
            }
            return Promise.reject(error);
        }
    );

    return {
        provide: {
            axios: axios.default,
            api: axios.default,
        },
    };
});
