<template>
  <div
    class="h-screen w-screen bg-gradient-to-br from-[#dbeff7] to-white dark:from-gray-900 dark:to-gray-900 overflow-hidden transition-colors"
  >
    <!-- Main Container -->
    <div class="h-full w-full flex">
      <div class="w-full h-full bg-white dark:bg-gray-900 flex flex-col">
        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
          <!-- Left Side - Forgot Password Form -->
          <div
            class="flex flex-col p-6 md:p-10 lg:p-12 xl:p-12 h-full overflow-y-auto custom-scrollbar"
          >
            <!-- Container -->
            <div class="min-h-full flex flex-col justify-start">
              <div class="max-w-md mx-auto w-full space-y-6 pt-6">
                <!-- Logo -->
                <div class="text-center lg:text-left mb-3">
                  <NuxtLink to="/" class="inline-block">
                    <img
                      :src="appLogo"
                      :alt="appName"
                      class="h-30 w-auto mx-auto lg:mx-0"
                    />
                  </NuxtLink>
                </div>

                <!-- Welcome Section -->
                <div class="space-y-2">
                  <h1
                    class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#202a51] dark:text-white"
                  >
                    Mot de passe oublié
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Saisissez votre email pour recevoir un lien de réinitialisation.
                  </p>
                </div>

                <!-- Email Form -->
                <form @submit.prevent="sendResetLink" class="space-y-6">
                  <!-- Email Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] dark:text-gray-200 font-semibold text-sm">
                      <span class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1 text-[#00b3d4]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Adresse email
                      </span>
                    </label>

                    <div class="relative group">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-[#00b3d4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <input
                        type="email"
                        v-model="email"
                        required
                        placeholder="exemple@escen.university"
                        class="w-full pl-10 pr-4 py-3.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full relative overflow-hidden group rounded-xl"
                  >
                    <div
                      class="relative bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] py-4 px-6 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                    >
                      <svg
                        v-if="isLoading"
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span class="text-white font-semibold text-base">
                        {{ isLoading ? "Envoi en cours..." : "Envoyer le lien" }}
                      </span>
                    </div>
                  </button>

                  <!-- Success Message -->
                  <div
                    v-if="linkSent"
                    class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg
                          class="h-5 w-5 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-green-700 dark:text-green-400">
                          Un lien de réinitialisation a été envoyé à
                          <strong>{{ email }}</strong>. Vérifiez votre boîte de réception.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>

                <!-- Back to Login Link -->
                <div class="text-center mt-6">
                  <NuxtLink
                    to="/login"
                    class="text-sm text-[#00b3d4] hover:text-[#202a51] dark:hover:text-white hover:underline transition-all duration-200 font-medium inline-flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour à la connexion
                  </NuxtLink>
                </div>

                <!-- Espace bas -->
                <div class="h-16"></div>
              </div>
            </div>
          </div>

          <!-- Right Side - Hero Image & Info -->
          <div
            class="hidden lg:flex flex-col relative bg-gradient-to-br from-[#202a51] via-[#2a3874] to-[#374c9c] overflow-hidden"
          >
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5">
              <div
                class="absolute top-1/4 -right-24 w-96 h-96 bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] rounded-full blur-3xl"
              ></div>
              <div
                class="absolute bottom-1/4 -left-24 w-96 h-96 bg-gradient-to-r from-[#6cc6e2] to-[#00b3d4] rounded-full blur-3xl"
              ></div>
            </div>

            <!-- Decorative Elements -->
            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b3d4] via-[#6cc6e2] to-transparent"
            ></div>
            <div class="absolute top-8 right-8">
              <div
                class="w-24 h-24 bg-gradient-to-br from-[#00b3d4]/20 to-transparent rounded-full blur-xl"
              ></div>
            </div>

            <!-- Content -->
            <div
              class="relative z-10 h-full flex flex-col p-8 md:p-10 lg:p-12 xl:p-16"
            >
              <!-- Main Content -->
              <div class="flex-1 flex flex-col justify-center">
                <!-- Hero Image Container -->
                <div class="mb-8">
                  <div class="relative w-full max-w-2xl mx-auto">
                    <!-- Floating elements -->
                    <div
                      class="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#00b3d4] to-[#6cc6e2] rounded-full opacity-20 blur-xl"
                    ></div>
                    <div
                      class="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-[#6cc6e2] to-[#00b3d4] rounded-full opacity-20 blur-xl"
                    ></div>

                    <!-- Main Image -->
                    <div
                      class="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                    >
                      <img
                        src="/bg/loginvector.png"
                        :alt="`Étudiants ${appName} collaborant sur un projet digital`"
                        class="w-full h-auto object-cover"
                      />
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-[#202a51]/70 to-transparent"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Welcome Message -->
                <div class="text-center text-white space-y-4 max-w-lg mx-auto">
                  <h2 class="text-3xl font-bold">Mot de passe oublié ?</h2>
                  <p class="text-white/80">
                    Pas d'inquiétude ! Nous vous envoyons un lien pour en créer un nouveau.
                  </p>

                  <!-- Security badges -->
                  <div class="flex flex-wrap justify-center gap-3 mt-6">
                    <span
                      class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                    >
                      Sécurisé
                    </span>
                    <span
                      class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                    >
                      Rapide
                    </span>
                    <span
                      class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                    >
                      Fiable
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useParametreStore } from "~~/stores/parametre";
import { useLoginStore } from "~~/stores/login";
import config from "~~/config";

const { $toastr } = useNuxtApp();
const router = useRouter();
const parametreStore = useParametreStore();
const loginStore = useLoginStore();

const file_url = config.app_local
  ? config.app_dev_storage_url
  : config.app_prod_storage_url;

const appLogo = computed(() => {
  const logo = parametreStore.getAppLogo;
  if (!logo) return null;
  return logo;
});

const appName = computed(() => parametreStore.getAppName || "ESCEN University");

const email = ref("");
const isLoading = ref(false);
const linkSent = ref(false);

const sendResetLink = async () => {
  isLoading.value = true;
  linkSent.value = false;

  try {
    await loginStore.forgetPassword({ email: email.value });
    linkSent.value = true;
    $toastr.success("Lien de réinitialisation envoyé !");
  } catch (error) {
    console.error(error);
    let errorMsg = "Une erreur est survenue. Réessayez.";
    if (error.response?.data?.message) errorMsg = error.response.data.message;
    $toastr.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => parametreStore.fetchParametres());

definePageMeta({
  layout: false,
  title: "Mot de passe oublié",
});
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
  transition-property:
    color, background-color, border-color, transform, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 179, 212, 0.1);
}

/* Ensure full height */
html,
body,
#__nuxt {
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
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>