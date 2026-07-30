<template>
  <div class="min-h-screen w-full flex bg-white overflow-hidden font-sans">
    
    <!-- Left Side: Form Area -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 bg-white overflow-hidden">
      
      <!-- Abundant Visible Floating Particles across the entire white space -->
      <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         <!-- Top Region -->
         <div class="absolute top-[10%] left-[10%] w-14 h-14 rounded-full border-[5px] border-[#00acc1]/30 animate-floating" style="animation-delay: 0s;"></div>
         <div class="absolute top-[5%] right-[25%] w-4 h-4 rounded-full bg-[#16243d]/20 animate-ping" style="animation-duration: 4s;"></div>
         <div class="absolute top-[20%] right-[10%] w-10 h-10 bg-[#00acc1]/20 rounded-xl animate-[spin_10s_linear_infinite]" style="animation-delay: 2s;"></div>
         
         <!-- Center-Top Region -->
         <div class="absolute top-[35%] left-[25%] w-6 h-6 rounded-full bg-[#00acc1]/20 animate-floating" style="animation-delay: 1s;"></div>
         <div class="absolute top-[30%] right-[30%] w-12 h-12 rounded-full border-[3px] border-[#16243d]/10 animate-floating" style="animation-delay: 3s;"></div>

         <!-- Center-Bottom Region -->
         <div class="absolute top-[60%] left-[15%] w-8 h-8 rounded-lg bg-[#00acc1]/10 rotate-45 animate-floating" style="animation-delay: 2.5s;"></div>
         <div class="absolute top-[50%] right-[15%] w-3 h-3 rounded-full bg-[#00acc1]/40 animate-ping" style="animation-duration: 3s;"></div>
         <div class="absolute top-[75%] right-[25%] w-16 h-16 rounded-full border-4 border-[#00acc1]/20 animate-floating" style="animation-delay: 4s;"></div>
         
         <!-- Bottom Region -->
         <div class="absolute bottom-[10%] left-[20%] w-6 h-6 rounded-full bg-[#16243d]/30 animate-floating" style="animation-delay: 1.5s;"></div>
         <div class="absolute bottom-[15%] right-[10%] w-20 h-20 rounded-full border-[6px] border-[#00acc1]/10 animate-[spin_15s_linear_infinite]" style="animation-delay: 5s; border-style: dashed;"></div>
         <div class="absolute bottom-[5%] left-[40%] w-4 h-4 rounded-full bg-[#00acc1]/30 animate-floating" style="animation-delay: 0.5s;"></div>
      </div>
      
      <div class="w-full max-w-sm mt-10 relative z-10 animate-fade-in-up">
        
        <!-- Logo -->
        <div class="mb-8 flex justify-center lg:justify-start">
          <img v-if="appLogo" :src="appLogo" :alt="appName" class="h-16 w-auto object-contain" />
          <div v-else class="flex items-center gap-2">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00acc1] to-[#00838f] flex items-center justify-center text-white font-bold shadow-lg">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
            </div>
            <span class="text-xl font-extrabold text-[#16243d] tracking-tight">{{ appName }}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="mb-10 text-center lg:text-left">
          <h1 class="text-3xl font-extrabold text-[#00acc1]">Code oublié</h1>
          <p class="text-gray-400 mt-2 text-sm font-medium">Entrez votre adresse e-mail pour réinitialiser.</p>
        </div>

        <!-- Success state -->
        <div v-if="success" class="bg-[#e0f7fa] border border-[#00acc1]/30 rounded-2xl p-6 text-center animate-fade-in-up">
          <div class="w-14 h-14 mx-auto bg-white text-[#00acc1] rounded-full flex items-center justify-center mb-4 shadow-sm">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-[#008394] mb-2">Email envoyé !</h3>
          <p class="text-sm text-[#00acc1] font-medium">
            Un lien de réinitialisation a été envoyé à <strong>{{ email }}</strong>. Vérifiez votre boîte mail (et vos spams).
          </p>
          <NuxtLink to="/candidat/login" class="mt-6 inline-block text-sm font-bold text-[#00acc1] hover:underline">
            ← Retour à la connexion
          </NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          
          <!-- Email Input -->
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <div class="w-8 h-8 rounded-full bg-[#e0f7fa] text-[#00acc1] flex items-center justify-center group-focus-within:bg-[#00acc1] group-focus-within:text-white transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </div>
            <input type="email" v-model="email" required placeholder="votre@email.com"
                   class="w-full pl-14 pr-6 py-4 rounded-full border border-gray-100 shadow-sm bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00acc1]/30 focus:border-[#00acc1] transition-all font-medium" />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-6">
             <NuxtLink to="/candidat/login" class="text-xs text-gray-500 font-bold hover:text-[#00acc1] transition-colors">
               ← Retour
             </NuxtLink>
             
             <button type="submit" :disabled="isLoading" class="px-10 py-3 bg-[#00acc1] hover:bg-[#0097a7] text-white rounded-full text-sm font-bold shadow-lg shadow-[#00acc1]/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center min-w-[140px]">
               <svg v-if="isLoading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               {{ isLoading ? "Envoi..." : "Envoyer" }}
             </button>
          </div>
        </form>

      </div>
    </div>

    <!-- Right Side: Graphic Area -->
    <div class="hidden lg:flex w-1/2 relative items-center justify-center overflow-visible z-0">
       
       <!-- Massive Concentric Circles Background using dark blue and cyan -->
       <!-- Outer circle -->
       <div class="absolute top-1/2 -translate-y-1/2 left-0 w-[120%] aspect-square rounded-full z-0 -translate-x-[20%]" style="background-color: #f2fbfd;"></div>
       <!-- Medium circle -->
       <div class="absolute top-1/2 -translate-y-1/2 left-0 w-[100%] aspect-square rounded-full z-10 -translate-x-[10%]" style="background-color: #e0f7fa;"></div>
       <!-- Inner Core circle (Dark Blue) -->
       <div class="absolute top-1/2 -translate-y-1/2 left-0 w-[80%] aspect-square rounded-full z-20" style="background-color: #16243d;"></div>

       <!-- Solid fill to complete the right edge if screen is very wide -->
       <div class="absolute inset-y-0 right-0 w-1/4 z-10" style="background-color: #16243d;"></div>
       
       <!-- Content Overlay: Illustration + Text, precisely centered inside the dark blue circle (which takes 80% width) -->
       <div class="absolute top-0 left-0 w-[80%] h-full z-30 flex flex-col items-center justify-center text-center px-4">
           <img src="/bg/loginvector.png" alt="Illustration" class="w-[80%] max-w-md lg:max-w-lg object-contain drop-shadow-2xl animate-floating mb-8" />
           
           <div class="space-y-3 max-w-sm">
              <h2 class="text-3xl font-extrabold text-white tracking-wide">
                 {{ appName || 'Bienvenue' }}
              </h2>
              <p class="text-[#e0f7fa]/80 text-sm font-medium leading-relaxed">
                 Un simple e-mail suffit pour retrouver l'accès sécurisé à votre espace candidat.
              </p>
           </div>
       </div>
       
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useCandidatAuthStore } from '~~/stores/candidatAuth'
import { useParametreStore } from '~~/stores/parametre'

definePageMeta({
  layout: false,
  title: "Mot de passe oublié"
})

const { $toastr } = useNuxtApp()
const router = useRouter()
const candidatAuthStore = useCandidatAuthStore()
const parametreStore = useParametreStore()

// Guard invité : si déjà connecté, rediriger vers le dashboard
if (candidatAuthStore.isAuthenticated()) {
  router.replace('/candidat/dashboard')
}

const appLogo = computed(() => parametreStore.getAppLogo || '')
const appName = computed(() => parametreStore.getAppName || 'Portail Candidat')

onMounted(() => {
  parametreStore.fetchParametres()
})

const email = ref('')
const isLoading = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await candidatAuthStore.forgetPassword({ email: email.value })
    success.value = true
    $toastr.success('Un lien a été envoyé à votre adresse e-mail.', {
      closeButton: true,
      progressBar: true,
      positionClass: "toast-top-center",
      timeOut: 5000,
    })
  } catch (e) {
    $toastr.error(e.response?.data?.message || 'Une erreur est survenue. Vérifiez votre adresse e-mail.', {
      closeButton: true,
      progressBar: true,
      positionClass: "toast-top-center",
      timeOut: 5000,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.animate-floating {
  animation: floating 6s ease-in-out infinite;
}
</style>
