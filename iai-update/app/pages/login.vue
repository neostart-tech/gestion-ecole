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
                        class="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-200"
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
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                      </div>
                      
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        required
                        placeholder="••••••••"
                        class="w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-200"
                      />
                      
                      <!-- Toggle password visibility -->
                      <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg 
                          v-if="!showPassword"
                          class="w-5 h-5 text-gray-400 hover:text-[#00b3d4] transition-colors duration-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg 
                          v-else
                          class="w-5 h-5 text-[#00b3d4]" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Remember Me Checkbox -->
                  <div class="flex items-center justify-between">
                    <label class="flex items-center cursor-pointer group">
                      <div class="relative flex items-center">
                        <input
                          type="checkbox"
                          v-model="rememberMe"
                          class="w-5 h-5 border-2 border-gray-300 rounded-lg checked:bg-[#00b3d4] checked:border-[#00b3d4] focus:ring-2 focus:ring-[#00b3d4]/20 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                        />
                        <span class="ml-3 text-sm text-gray-700 group-hover:text-[#202a51] transition-colors duration-200">
                         Me connecter en tant qu'étudiant
                        </span>
                      </div>
                    </label>
                    
                    <a href="/mot-de-passe-oublie" class="text-sm text-[#00b3d4] hover:text-[#202a51] hover:underline transition-all duration-200 font-medium">
                      Mot de passe oublié?
                    </a>
                  </div>

                
                 

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full relative overflow-hidden group rounded-xl"
                  >
                    <div class="relative bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] py-4 px-6 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
                      <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="text-white font-semibold text-base">
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
                    </div>
                  </div>
                </div>

                <!-- Welcome Message -->
                <div class="text-center text-white space-y-4 max-w-lg mx-auto">
                  <h2 class="text-3xl font-bold">Bienvenue sur ESCEN</h2>
                  <p class="text-white/80">
                    Accédez à votre espace personnel pour consulter vos cours, notes, emploi du temps et bien plus encore.
                  </p>
                  
                  <!-- User type badges -->
                  <div class="flex flex-wrap justify-center gap-3 mt-6">
                    <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                      👨‍🎓 Étudiants
                    </span>
                    <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                      👨‍🏫 Enseignants
                    </span>
                    <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                      👨‍💼 Administration
                    </span>
                  </div>
                </div>
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
import { useLoginStore } from '~~/stores/login'

const { $toastr } = useNuxtApp()
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

// Handle login avec gestion des routes différentes selon le type d'utilisateur
const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    const payload = {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value // Important: ce flag détermine la route utilisée
    }
    
    const response = await loginStore.loginUser(payload)
    
    // Message de bienvenue personnalisé
    const user = response.user
    const userType = rememberMe.value ? 'Étudiant' : 'Administrateur'
    
    $toastr.success(
      `Bienvenue ${user.prenom || ''} ${user.nom || ''} ! Connexion ${userType} réussie.`,
      { 
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
        timeOut: 5000
      }
    )
    
    // Redirection vers le dashboard
    await router.push('/')
    
  } catch (error) {
    console.error('Erreur de connexion:', error)
    
    // Message d'erreur personnalisé selon le type d'erreur
    let errorMsg = 'Une erreur est survenue. Veuillez réessayer plus tard.'
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMsg = 'Email ou mot de passe incorrect.'
      } else if (error.response.status === 403) {
        errorMsg = 'Accès non autorisé. Veuillez vérifier vos identifiants.'
      } else if (error.response.data?.message) {
        errorMsg = error.response.data.message
      }
    } else if (error.request) {
      errorMsg = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
    }
    
    $toastr.error(errorMsg, {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-center',
      timeOut: 5000
    })
    
  } finally {
    isLoading.value = false
  }
}

// Redirection vers mot de passe oublié
const goToForgotPassword = () => {
  router.push('/mot-de-passe-oublie')
}

definePageMeta({
  layout: false,
  title: 'Connexion',
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
  transition-property: color, background-color, border-color, transform, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 179, 212, 0.1);
}

/* Checkbox custom styles */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #00b3d4;
  border-color: #00b3d4;
}

input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

input[type="checkbox"]:focus {
  ring: 2px solid rgba(0, 179, 212, 0.2);
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

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
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