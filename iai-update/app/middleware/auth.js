import  { useLoginStore } from '~~/stores/login'

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  const authStore = useLoginStore()

  if (!authStore.isAuthenticated() && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated() && to.path === '/login') {
    return navigateTo('/')
  }
})
