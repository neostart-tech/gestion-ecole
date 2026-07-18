<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a12] flex">

    <!-- Left Section: Form -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 lg:w-1/2">
      <div class="mx-auto w-full max-w-sm lg:w-96">

        <!-- Logo & Header -->
        <div class="mb-10">
          <img src="/logo/logo_escen.png" alt="Logo" class="h-16 w-auto object-contain drop-shadow-sm mb-6" />
          <h2 class="mt-6 text-3xl font-extrabold text-[#1A2238] dark:text-white tracking-tight">Code d'accès oublié</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
            Entrez votre adresse e-mail. Vous recevrez un lien pour créer un nouveau code d'accès.
          </p>
        </div>

        <!-- Success state -->
        <div v-if="success" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center">
          <div class="w-14 h-14 mx-auto bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">Email envoyé !</h3>
          <p class="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
            Un lien de réinitialisation a été envoyé à <strong>{{ email }}</strong>. Vérifiez votre boîte mail (et vos spams).
          </p>
          <NuxtLink to="/candidat/login" class="mt-6 inline-block text-sm font-bold text-[#01b4d5] hover:underline">
            ← Retour à la connexion
          </NuxtLink>
        </div>

        <!-- Form -->
        <div v-else class="mt-8">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Adresse e-mail
              </label>
              <div class="mt-1">
                <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                       placeholder="votre@email.com"
                       class="appearance-none block w-full px-4 py-3.5 bg-gray-50/50 dark:bg-[#1a1a2a] border-2 border-gray-100 dark:border-[#242438] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-[#1a1a2a] focus:ring-0 focus:border-[#01b4d5] transition-all duration-300 text-[15px] font-medium text-[#1A2238] dark:text-white">
              </div>
            </div>

            <div v-if="errorMsg" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400 font-medium">
              {{ errorMsg }}
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="isLoading"
                      class="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[#01b4d5] to-[#009ab5] hover:shadow-lg hover:shadow-[#01b4d5]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01b4d5] transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide disabled:opacity-70 disabled:pointer-events-none">
                <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
              </button>
            </div>

            <div class="text-center">
              <NuxtLink to="/candidat/login" class="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#01b4d5] transition-colors">
                ← Retour à la connexion
              </NuxtLink>
            </div>
          </form>
        </div>

      </div>
    </div>

    <!-- Right Section -->
    <div class="hidden lg:block relative w-0 flex-1 bg-[#1A2238] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-[#1A2238] via-[#212b46] to-[#01b4d5]/20"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#01b4d5]/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#01b4d5]/20 to-transparent"></div>
      <div class="absolute inset-0 flex flex-col justify-center items-center px-12 text-center z-10">
        <div class="w-56 h-32 mb-12 -mt-32 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden p-4">
          <img src="/logo/logo_escen.png" alt="Logo" class="w-full h-full object-contain drop-shadow-md" />
        </div>
        <h3 class="text-4xl font-bold text-white mb-6 leading-tight">
          Récupérez votre <br/>
          <span class="text-[#01b4d5]">accès</span>
        </h3>
        <p class="text-lg text-gray-300 max-w-md font-medium">
          Un simple e-mail suffit pour retrouver l'accès à votre espace candidat.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCandidatAuthStore } from '~~/stores/candidatAuth'

definePageMeta({
  layout: false
})

const router = useRouter()
const candidatAuthStore = useCandidatAuthStore()

// Guard invité : si déjà connecté, rediriger vers le dashboard
if (candidatAuthStore.isAuthenticated()) {
  router.replace('/candidat/dashboard')
}

const email = ref('')
const isLoading = ref(false)
const success = ref(false)
const errorMsg = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await candidatAuthStore.forgetPassword({ email: email.value })
    success.value = true
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Une erreur est survenue. Vérifiez votre adresse e-mail.'
  } finally {
    isLoading.value = false
  }
}
</script>
