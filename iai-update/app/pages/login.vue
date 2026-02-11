<template>
  <div class="h-screen w-screen bg-gradient-to-br from-[#dbeff7] to-white overflow-hidden">
    <!-- Main Container -->
    <div class="h-full w-full flex">
      <div class="w-full h-full bg-white flex flex-col">
        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
          
          <!-- Left Side - Login Form -->
          <div class="flex flex-col p-6 md:p-10 lg:p-12 xl:p-12 h-full overflow-y-auto custom-scrollbar">
            
            <!-- Container -->
            <div class="min-h-full flex flex-col justify-start">
              
              <div class="max-w-md mx-auto w-full space-y-6 pt-6">

                <!-- Logo -->
                <div class="text-center lg:text-left mb-3">
                  <NuxtLink to="/" class="inline-block">
                    <img
                      src="/logo/logo_escen.png"
                      alt="ESCEN Logo"
                      class="h-30 w-auto mx-auto lg:mx-0"
                    />
                  </NuxtLink>
                </div>

                <!-- Welcome Section -->
                <div class="space-y-2">
                  <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#202a51]">
                    Connectez-vous
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
                        <svg class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>

                      <input
                        type="email"
                        v-model="email"
                        required
                        placeholder="exemple@escen.university"
                        class="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white hover:bg-gray-50"
                      />
                    </div>
                  </div>

                  <!-- Password Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] font-semibold text-sm">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-[#00b3d4]" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clip-rule="evenodd"/>
                        </svg>
                        Mot de passe
                      </span>
                    </label>

                    <div class="relative group">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        required
                        placeholder="••••••••"
                        class="w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4]"
                      />
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full relative overflow-hidden group"
                  >
                    <div class="relative bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] py-4 rounded-xl flex items-center justify-center">
                      <span class="text-white font-semibold">
                        {{ isLoading ? 'Connexion en cours...' : 'Accéder à mon espace' }}
                      </span>
                    </div>
                  </button>

                  <!-- Espace bas -->
                  <div class="h-16"></div>

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
import {useLoginStore} from '~~/stores/login'


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