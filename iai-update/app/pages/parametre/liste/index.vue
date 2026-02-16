<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb -->
      <Breadcrumb
        :items="[
          { label: 'Administration', to: '/admin' },
          { label: 'Paramètres', to: '/admin/parametres' },
          { label: 'Configuration système', to: null },
        ]"
        title="Configuration générale de l'établissement"
        title-class="text-xl font-semibold text-gray-800 dark:text-white"
        spacing="mb-6"
      />

      <!-- Loading -->
      <div
        v-if="store.isLoading && !store.parametres.length"
        class="flex justify-center py-12"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"
        ></div>
      </div>

      <!-- Formulaire dynamique -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- SECTION 1: Informations générales -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
          >
            <h2
              class="text-base font-semibold text-gray-900 dark:text-white flex items-center"
            >
              <div class="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
              <svg
                class="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Informations générales
            </h2>
          </div>

          <div class="p-6 space-y-6">
            <!-- Nom de l'établissement -->
            <DynamicParamField
              v-if="parametres.nom_de_etablissement"
              :param="parametres.nom_de_etablissement"
              v-model="formData.nom_de_etablissement"
            />

            <!-- Logo -->
            <DynamicParamField
              v-if="parametres.logo_etablissement"
              :param="parametres.logo_etablissement"
              v-model="formData.logo_etablissement"
              @delete="handleFileDelete('logo_etablissement')"
            />
          </div>
        </div>

        <!-- SECTION 2: Direction -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
          >
            <h2
              class="text-base font-semibold text-gray-900 dark:text-white flex items-center"
            >
              <div class="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
              <svg
                class="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Direction des études
            </h2>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Titre du directeur -->
            <DynamicParamField
              v-if="parametres.titre_du_directeur_des_etudes"
              :param="parametres.titre_du_directeur_des_etudes"
              v-model="formData.titre_du_directeur_des_etudes"
            />

            <!-- Nom du directeur -->
            <DynamicParamField
              v-if="parametres.nom_complet_du_directeur_des_etudes"
              :param="parametres.nom_complet_du_directeur_des_etudes"
              v-model="formData.nom_complet_du_directeur_des_etudes"
            />
          </div>
        </div>

        <!-- SECTION 3: Pédagogie -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
          >
            <h2
              class="text-base font-semibold text-gray-900 dark:text-white flex items-center"
            >
              <div class="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
              <svg
                class="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Système pédagogique
            </h2>
          </div>

          <div class="p-6 space-y-6">
            <!-- Type de système -->
            <DynamicParamField
              v-if="parametres.systeme_pedagogique_de_etablissement"
              :param="parametres.systeme_pedagogique_de_etablissement"
              v-model="formData.systeme_pedagogique_de_etablissement"
              @update:model-value="handleSystemChange"
            />

            <!-- Options conditionnelles -->
            <div
              v-if="showUnitesOptions"
              class="ml-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <DynamicParamField
                v-if="parametres.afficher_unites"
                :param="parametres.afficher_unites"
                v-model="formData.afficher_unites"
              />
            </div>
          </div>
        </div>

        <!-- SECTION 4: Options avancées -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
          >
            <h2
              class="text-base font-semibold text-gray-900 dark:text-white flex items-center"
            >
              <div class="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
              <svg
                class="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Options avancées
            </h2>
          </div>

          <div class="p-6">
            <!-- Dates de formation -->
            <DynamicParamField
              v-if="parametres.afficher_le_choix_des_dates_pour_formations"
              :param="parametres.afficher_le_choix_des_dates_pour_formations"
              v-model="formData.afficher_le_choix_des_dates_pour_formations"
            />
          </div>
        </div>

        <!-- Barre d'actions flottante -->
        <div
          class="sticky bottom-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mt-8"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div
              class="flex items-center text-sm text-gray-500 dark:text-gray-400"
            >
              <svg
                class="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Les modifications seront appliquées immédiatement
            </div>
            <div class="flex space-x-3">
              <button
                type="submit"
                :disabled="store.isLoading || !hasChanges"
                class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg
                  v-if="store.isLoading"
                  class="animate-spin h-4 w-4 mr-2"
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
                <svg
                  v-else
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ store.isLoading ? "Enregistrement..." : "Enregistrer" }}
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- Toast notification -->
      <div
        v-if="notification.show"
        class="fixed bottom-4 right-4 z-50 animate-slide-up"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 overflow-hidden min-w-[320px]"
          :class="{
            'border-green-500': notification.type === 'success',
            'border-red-500': notification.type === 'error',
            'border-blue-500': notification.type === 'info',
          }"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  v-if="notification.type === 'success'"
                  class="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <svg
                  v-else-if="notification.type === 'error'"
                  class="h-5 w-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <button
                  @click="notification.show = false"
                  class="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useParametreStore } from "~~/stores/parametre";
import Breadcrumb from "~/components/Breadcrumb.vue";
import DynamicParamField from "~/components/DynamicParamField.vue";

const store = useParametreStore();
const { $toastr, $swal } = useNuxtApp();

// État local
const formData = ref({});
const originalFormData = ref({});
const deletedFiles = ref({});
const notification = ref({
  show: false,
  type: "success",
  message: "",
});

// Paramètres par clé
const parametres = computed(() => store.parametresByKey);

// Vérifier s'il y a des changements
const hasChanges = computed(() => {
  return (
    JSON.stringify(formData.value) !== JSON.stringify(originalFormData.value)
  );
});

// Options conditionnelles
const showUnitesOptions = computed(() => {
  return formData.value.systeme_pedagogique_de_etablissement === "unites";
});

// Initialiser le formulaire
const initForm = () => {
  const initialData = {};
  store.parametres.forEach((param) => {
    // Important: pour les booléens, on convertit en booléen
    if (param.type === "boolean") {
      initialData[param.key] = param.value == 1 || param.value === true;
    } else {
      initialData[param.key] = param.value;
    }
  });
  formData.value = JSON.parse(JSON.stringify(initialData));
  originalFormData.value = JSON.parse(JSON.stringify(initialData));
  deletedFiles.value = {};
};

// Gestionnaire de suppression de fichier
const handleFileDelete = (key) => {
  deletedFiles.value[key] = true;
};

// Gestionnaire de changement de système
const handleSystemChange = () => {
  if (!showUnitesOptions.value) {
    formData.value.afficher_unites = false;
  }
};

// Soumission du formulaire
const handleSubmit = async () => {
  try {
    const submitData = { ...formData.value };

    // Ajouter les fichiers à supprimer
    if (Object.keys(deletedFiles.value).length > 0) {
      submitData._delete_files = deletedFiles.value;
    }

    await store.updateParametres(submitData);

    // Mettre à jour les données originales
    originalFormData.value = JSON.parse(JSON.stringify(formData.value));
    deletedFiles.value = {};
    $toastr.success("Paramètres enregistrés avec succès !");
    // showNotification("success", "Paramètres enregistrés avec succès !");
  } catch (error) {
    console.error("Erreur:", error);
    $toastr.success(error.response?.data?.message);

    // showNotification(
    //   "error",
    //   error.response?.data?.message || "Erreur lors de l'enregistrement",
    // );
  }
};

// Afficher une notification
const showNotification = (type, message, duration = 3000) => {
  notification.value = {
    show: true,
    type,
    message,
  };

  setTimeout(() => {
    notification.value.show = false;
  }, duration);
};

// Charger les données
onMounted(async () => {
  try {
    await store.fetchParametres();
    initForm();
  } catch (error) {
    showNotification("error", "Erreur lors du chargement des paramètres");
  }
});

// Surveiller les erreurs
watch(
  () => store.error,
  (newError) => {
    if (newError) {
      showNotification("error", newError);
    }
  },
);
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
