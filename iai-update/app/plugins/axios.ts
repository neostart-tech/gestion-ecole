import { defineNuxtPlugin } from '#app';
import config from '../../config';
import * as axios from 'axios'

const base_url = config.app_local ? config.app_dev_url : config.app_prod_url;

export default defineNuxtPlugin((nuxtApp) => {
    axios.default.defaults.baseURL = base_url;

    axios.default.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // L'espace candidat a son propre token/login, distincts du staff :
                // ne pas toucher à ses identifiants ni le rediriger vers le login staff.
                // "/candidat" est un préfixe de "/candidatures" (pages staff) : il faut
                // exiger un "/" après pour ne pas confondre les deux espaces.
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
        },
    };
});
