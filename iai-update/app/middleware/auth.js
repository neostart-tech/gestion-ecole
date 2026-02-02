import { useLoginStore } from '../../stores/login';

export default defineNuxtRouteMiddleware(async (to, from) => {

    const authStore = useLoginStore();

  const isAuthenticated = await authStore.isAuthenticated();
if(!process.client){
    return;
}

  if (!isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }

  if(isAuthenticated && to.path === "/login") {
    return navigateTo("/");
  }



});
