<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a12] flex">

    <!-- Left Section: Login Form -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 lg:w-1/2">
      <div class="mx-auto w-full max-w-sm lg:w-96">

        <!-- Logo & Header -->
        <div class="mb-10">
          <img src="/logo/logo_escen.png" alt="Logo" class="h-16 w-auto object-contain drop-shadow-sm mb-6" />
          <h2 class="mt-6 text-3xl font-extrabold text-[#1A2238] dark:text-white tracking-tight">
            Espace Candidat
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
            Connectez-vous pour suivre votre dossier d'admission
          </p>
        </div>

        <!-- Form -->
        <div class="mt-8">
          <form class="space-y-6" @submit.prevent="handleLogin">

            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Adresse e-mail
              </label>
              <div class="mt-1">
                <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                       class="appearance-none block w-full px-4 py-3.5 bg-gray-50/50 dark:bg-[#1a1a2a] border-2 border-gray-100 dark:border-[#242438] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-[#1a1a2a] focus:ring-0 focus:border-[#01b4d5] transition-all duration-300 text-[15px] font-medium text-[#1A2238] dark:text-white">
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="password" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Code d'accès
                </label>
                <NuxtLink to="/candidat/mot-de-passe-oublie" class="text-xs font-bold text-[#01b4d5] hover:text-[#009ab5] transition-colors">
                  Code oublié ?
                </NuxtLink>
              </div>
              <div class="mt-1">
                <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" required
                       class="appearance-none block w-full px-4 py-3.5 bg-gray-50/50 dark:bg-[#1a1a2a] border-2 border-gray-100 dark:border-[#242438] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-[#1a1a2a] focus:ring-0 focus:border-[#01b4d5] transition-all duration-300 text-[15px] font-medium text-[#1A2238] dark:text-white">
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center">
                <input id="remember-me" v-model="remember" name="remember-me" type="checkbox" class="h-4 w-4 text-[#01b4d5] focus:ring-[#01b4d5] border-gray-300 rounded cursor-pointer transition-colors">
                <label for="remember-me" class="ml-2 block text-sm text-gray-600 dark:text-gray-400 font-medium cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="isLoading" class="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[#01b4d5] to-[#009ab5] hover:shadow-lg hover:shadow-[#01b4d5]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01b4d5] transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide disabled:opacity-70 disabled:pointer-events-none">
                <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isLoading ? 'Connexion en cours...' : 'Accéder à mon dossier' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Right Section: Image / Graphic -->
    <div class="hidden lg:block relative w-0 flex-1 bg-[#1A2238] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-[#1A2238] via-[#212b46] to-[#01b4d5]/20"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#01b4d5]/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#01b4d5]/20 to-transparent"></div>

      <div class="absolute inset-0 flex flex-col justify-center items-center px-12 text-center z-10">
        <div class="w-56 h-32 mb-12 -mt-32 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden p-4">
          <img src="/logo/logo_escen.png" alt="Logo" class="w-full h-full object-contain drop-shadow-md" />
        </div>
        <h3 class="text-4xl font-bold text-white mb-6 leading-tight">
          Suivez votre <br/>
          <span class="text-[#01b4d5]">dossier d'admission</span>
        </h3>
        <p class="text-lg text-gray-300 max-w-md font-medium">
          Consultez l'avancement de votre candidature et gérez vos documents en toute simplicité.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useCandidatAuthStore } from '~~/stores/candidatAuth'

definePageMeta({
  layout: false
})

const { $toastr } = useNuxtApp()
const router = useRouter()
const candidatAuthStore = useCandidatAuthStore()

// Guard invité : si déjà connecté, rediriger vers le dashboard
if (candidatAuthStore.isAuthenticated()) {
  router.replace('/candidat/dashboard')
}

const email = ref('')
const password = ref('')
const remember = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    const data = await candidatAuthStore.login({
      email: email.value,
      password: password.value,
      remember: remember.value,
    })
    $toastr.success(data?.message || 'Connexion réussie')
    router.push('/candidat/dashboard')
  } catch (error) {
    if (error.response?.data?.errors) {
      $toastr.error('Identifiants incorrects')
    } else {
      $toastr.error(error.response?.data?.message || 'Erreur de connexion au serveur')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
