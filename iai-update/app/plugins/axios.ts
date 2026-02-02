import { defineNuxtPlugin } from '#app';
import config from '../../config';
import * as axios from 'axios'

const base_url = config.app_local ? config.app_dev_url : config.app_prod_url;

export default defineNuxtPlugin(() => {
    axios.default.defaults.baseURL = base_url;

    return {
        provide: {
            axios: axios.default,
        },
    };
});
