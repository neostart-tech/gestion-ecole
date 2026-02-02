<template>
  <div class="h-screen w-screen bg-gradient-to-br from-[#dbeff7] to-white overflow-hidden">
    <!-- Main Container -->
    <div class="h-full w-full flex">
      <div class="w-full h-full bg-white flex flex-col">
        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
          
          <!-- Left Side - Login Form -->
          <div class="flex flex-col justify-center p-8 md:p-10 lg:p-12 xl:p-16">
            <!-- Scrollable container for mobile -->
            <div class="h-full flex flex-col justify-center overflow-y-auto custom-scrollbar">
              <div class="max-w-md mx-auto w-full space-y-8">
                <!-- Logo -->
                <div class="text-center lg:text-left">
                  <NuxtLink to="/" class="inline-block">
                    <img
                      src="/logo/logo_escen.png"
                      alt="ESCEN Logo"
                      class="h-30 w-auto mx-auto lg:mx-0"
                    />
                  </NuxtLink>
                </div>

                <!-- Welcome Section -->
                <div class="space-y-4">
                  
                  <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#202a51]">
                    Connectez-vous<br>
                    <!-- <span class="bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] bg-clip-text text-transparent">
                      à votre compte pour
                    </span> -->
                  </h1>
                  <p class="text-gray-600 text-sm md:text-base">
                    Accédez à votre compte et gérez vos ressources académiques en toute simplicité.
                  </p>
                </div>

                <!-- Login Form -->
                <form @submit.prevent="handleLogin" class="space-y-6">
                  <!-- Email Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] font-semibold text-sm">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-[#00b3d4]" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                        </svg>
                        Identifiant
                      </span>
                    </label>
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                      <input 
                        type="email" 
                        v-model="email"
                        required
                        placeholder="exemple@escen.university"
                        class="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent transition-all duration-300 bg-white hover:bg-gray-50 placeholder-gray-400"
                      >
                    </div>
                  </div>

                  <!-- Password Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] font-semibold text-sm">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-[#00b3d4]" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                        </svg>
                        Mot de passe
                      </span>
                    </label>
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                      </div>
                      <input 
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        required
                        placeholder="••••••••"
                        class="w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent transition-all duration-300 bg-white hover:bg-gray-50 placeholder-gray-400"
                      >
                      <button 
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#00b3d4] transition-colors"
                      >
                        <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Form Options -->
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <!-- Remember Me -->
                    <label class="flex items-center space-x-3 cursor-pointer group">
                      <div class="relative">
                        <input 
                          type="checkbox" 
                          v-model="rememberMe"
                          class="sr-only peer"
                        >
                        <div class="w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-md flex items-center justify-center transition-all duration-200 peer-checked:bg-[#00b3d4] peer-checked:border-[#00b3d4] group-hover:border-gray-400">
                          <svg v-if="rememberMe" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                      <span class="text-gray-700 text-sm select-none">Me connectez en tant qu'étudiant</span>
                    </label>
                    
                    <!-- Forgot Password -->
                    <NuxtLink 
                      to="/mot-de-passe-oublie" 
                      class="text-[#00b3d4] hover:text-[#202a51] text-sm font-medium transition-colors duration-200 flex items-center group"
                    >
                      <span>Mot de passe oublié ?</span>
                      <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </NuxtLink>
                  </div>

                

                  <!-- Submit Button -->
                  <button 
                    type="submit"
                    :disabled="isLoading"
                    class="w-full relative overflow-hidden group"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-[#202a51] to-[#374c9c]  transition-transform duration-300 rounded-xl"></div>
                    <div class="relative bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2]  duration-300 py-4 px-6 rounded-xl flex items-center justify-center">
                      <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="text-white font-semibold text-base">
                        {{ isLoading ? 'Connexion en cours...' : 'Accéder à mon espace' }}
                      </span>
                      <svg v-if="!isLoading" class="w-5 h-5 ml-2 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </div>
                  </button>

                  <!-- Alternative Login -->
                

                  <!-- Social Login Buttons -->
                  

                  <!-- Register Link -->
                  <!-- <div class="pt-6 border-t border-gray-100">
                    <p class="text-center text-gray-600 text-sm">
                      Nouveau sur la plateforme ESCEN ?
                      <NuxtLink 
                        to="/inscription" 
                        class="text-[#00b3d4] hover:text-[#202a51] font-semibold ml-1 transition-colors duration-200 inline-flex items-center group"
                      >
                        Créer un compte
                        <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                      </NuxtLink>
                    </p>
                  </div> -->
                </form>
              </div>
            </div>
          </div>

          <!-- Right Side - Hero Image & Info -->
          <div class="hidden lg:flex flex-col relative bg-gradient-to-br from-[#202a51] via-[#2a3874] to-[#374c9c] overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5">
              <div class="absolute top-1/4 -right-24 w-96 h-96 bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] rounded-full blur-3xl"></div>
              <div class="absolute bottom-1/4 -left-24 w-96 h-96 bg-gradient-to-r from-[#6cc6e2] to-[#00b3d4] rounded-full blur-3xl"></div>
            </div>

            <!-- Decorative Elements -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b3d4] via-[#6cc6e2] to-transparent"></div>
            <div class="absolute top-8 right-8">
              <div class="w-24 h-24 bg-gradient-to-br from-[#00b3d4]/20 to-transparent rounded-full blur-xl"></div>
            </div>

            <!-- Content -->
            <div class="relative z-10 h-full flex flex-col p-8 md:p-10 lg:p-12 xl:p-16">
              <!-- Stats Cards -->
             

              <!-- Main Content -->
              <div class="flex-1 flex flex-col justify-center">
                <!-- Hero Image Container -->
                <div class="mb-8">
                  <div class="relative w-full max-w-2xl mx-auto">
                    <!-- Floating elements -->
                    <div class="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#00b3d4] to-[#6cc6e2] rounded-full opacity-20 blur-xl"></div>
                    <div class="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-[#6cc6e2] to-[#00b3d4] rounded-full opacity-20 blur-xl"></div>
                    
                    <!-- Main Image -->
                    <div class="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                      <img 
                        src="/bg/loginvector.png"
                        alt="Étudiants ESCEN collaborant sur un projet digital"
                        class="w-full h-auto object-cover"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-[#202a51]/70 to-transparent"></div>
                      
                      <!-- Image overlay content -->
                      <!-- <div class="absolute bottom-0 left-0 right-0 p-6">
                        <div class="flex items-center space-x-2 mb-2">
                          <div class="w-2 h-2 bg-[#00b3d4] rounded-full"></div>
                          <span class="text-white/90 text-sm font-medium">Plateforme étudiante</span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">
                          Votre succès commence ici
                        </h3>
                        <p class="text-white/80 text-sm">
                          Accédez à toutes vos ressources académiques en un seul endroit
                        </p>
                      </div> -->
                    </div>
                  </div>
                </div>

                <!-- Features List -->
               
              </div>

              <!-- Footer Note -->
              <div class="mt-8 pt-6 border-t border-white/10">
                <p class="text-white/60 text-sm text-center">
                  © 2024 ESCEN University • Tous droits réservés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useLoginStore} from '../../stores/login'


const { $toastr} = useNuxtApp()



const router = useRouter()

const loginStore = useLoginStore()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

// UI states
const isLoading = ref(false)
const errorMessage = ref('')


// Handle login (unchanged)
const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const payload = {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    }
    const response = await loginStore.loginUser(payload)
    $toastr.success('Bienvenue ' + response.user.nom + ' ' + response.user.prenom + ' !')
    navigateTo('/')
    isLoading.value = false
  } catch (error) {
    $toastr.error(error.response.data.message || 'Une erreur est survenue. Veuillez réessayer plus tard.')
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  layout: false,
  title: 'Connexion',
  middleware: 'auth'
})


</script>

<style scoped>
/* Custom animations */
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

/* Custom scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 179, 212, 0.1);
}

/* Ensure full height */
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .flex-col.justify-center {
    justify-content: flex-start;
    padding-top: 2rem;
  }
  
  .max-w-md {
    max-width: 100%;
  }
}

/* Hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>