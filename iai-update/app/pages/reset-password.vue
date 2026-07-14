<template>
  <div
    class="h-screen w-screen bg-gradient-to-br from-[#dbeff7] to-white dark:from-gray-900 dark:to-gray-900 overflow-hidden transition-colors"
  >
    <!-- Main Container -->
    <div class="h-full w-full flex">
      <div class="w-full h-full bg-white dark:bg-gray-900 flex flex-col">
        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
          <!-- Left Side - Reset Password Form -->
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
                    Réinitialiser le mot de passe
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Saisissez votre nouveau mot de passe.
                  </p>
                </div>

                <!-- Password Form -->
                <form @submit.prevent="submitReset" class="space-y-6">
                  <!-- Password -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] dark:text-gray-200 font-semibold text-sm">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      v-model="password"
                      required
                      placeholder="Nouveau mot de passe"
                      class="w-full pl-4 pr-4 py-3.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    />
                  </div>

                  <!-- Confirm Password -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] dark:text-gray-200 font-semibold text-sm">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      v-model="passwordConfirm"
                      required
                      placeholder="Confirmer le mot de passe"
                      class="w-full pl-4 pr-4 py-3.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    />
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
                        {{ isLoading ? "Traitement..." : "Réinitialiser" }}
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
                          Mot de passe réinitialisé avec succès !
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

          <!-- Right Side - Hero Image & Info (identique à ton template) -->
          <div
            class="hidden lg:flex flex-col relative bg-gradient-to-br from-[#202a51] via-[#2a3874] to-[#374c9c] overflow-hidden"
          >
            <!-- Image + décorations comme dans ton template précédent -->
            <div class="relative z-10 h-full flex flex-col p-8 md:p-10 lg:p-12 xl:p-16">
              <div class="flex-1 flex flex-col justify-center">
                <div class="mb-8">
                  <img
                    src="/bg/loginvector.png"
                    alt="Réinitialisation mot de passe"
                    class="w-full h-auto object-cover rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div class="text-center text-white space-y-4 max-w-lg mx-auto">
                  <h2 class="text-3xl font-bold">Sécurisé & rapide</h2>
                  <p class="text-white/80">
                    Créez un nouveau mot de passe pour accéder à votre compte en toute sécurité.
                  </p>
                </div>
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
import { useRoute, useRouter } from "vue-router";
import { useLoginStore } from "~~/stores/login";
import { useParametreStore } from "~~/stores/parametre";
import config from "~~/config";

const route = useRoute();
const router = useRouter();
const loginStore = useLoginStore();
const parametreStore = useParametreStore();

const token = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const isLoading = ref(false);
const linkSent = ref(false);

const file_url = config.app_local
  ? config.app_dev_storage_url
  : config.app_prod_storage_url;

const appLogo = computed(() => {
  const logo = parametreStore.getAppLogo;
  if (!logo) return null;
  return logo;
});

const appName = computed(() => parametreStore.getAppName || "ESCEN University");

onMounted(() => {
  token.value = route.query.token || "";
  email.value = route.query.email || "";
  parametreStore.fetchParametres();
});

const submitReset = async () => {
  isLoading.value = true;
  linkSent.value = false;
  try {
    await loginStore.resetPassword({
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirm.value,
    });
    linkSent.value = true;
  } catch (error) {
    let msg = "Erreur lors de la réinitialisation.";
    if (error.response?.data?.message) msg = error.response.data.message;
    alert(msg);
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: false,
  title: "Réinitialiser le mot de passe",
});
</script>

<style scoped>
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
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>