// plugins/echo.client.ts
import { defineNuxtPlugin } from '#app'
import config from '~~/config'


export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    import('laravel-echo').then(({ default: Echo }) => {
      import('pusher-js').then((Pusher) => {
        window.Pusher = Pusher.default || Pusher

        // Récupérer le token et le formater correctement
        let token = localStorage.getItem('gest-ecole-token')
        
        
        // Nettoyer le token (enlever les guillemets s'ils existent)
        if (token) {
          try {
            // Si le token est stocké avec des guillemets, les enlever
            token = token.replace(/^"(.*)"$/, '$1')
          } catch (e) {
            console.error('Erreur de nettoyage du token:', e)
          }
        }

       
        
        // Utiliser global pour l'URL de l'API
        const apiUrl = config.app_local ? config.app_dev_url : config.app_prod_url
                // Utiliser global pour la config Reverb
        const reverbConfig = config.reverb

        const echo = new Echo({
          broadcaster: 'reverb',
          key: reverbConfig.key,
          wsHost: reverbConfig.host,
          wsPort: reverbConfig.port,
          wssPort: reverbConfig.port,
          forceTLS: false,
          enabledTransports: ['ws', 'wss'],
          authEndpoint: `${apiUrl}/broadcasting/auth`,
          auth: {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              Accept: 'application/json',
            },
          },
        })

        nuxtApp.provide('echo', echo)
        window.echo = echo
      })
    })
  }
})