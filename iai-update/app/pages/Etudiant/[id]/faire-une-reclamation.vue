<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Espace Étudiant', to: '/' },
        { label: 'Mes notes', to: '/etudiant/mes-notes' },
        { label: 'Réclamer une note', to: null },
      ]"
      title="Réclamer une note"
      title-class="text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <!-- Alert si réclamation existe déjà -->
    <div
      v-if="hasExistingReclamation"
      class="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-orange-700 dark:text-orange-300 font-medium">
            Une réclamation est déjà en cours pour cette note
          </p>
          <p class="text-xs text-orange-600 dark:text-orange-400 mt-1">
            Soumise le {{ existingReclamation?.date_creation }} - Statut:
            <span :class="getStatusClass(existingReclamation?.statut)">
              {{ getStatusText(existingReclamation?.statut) }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Alert info normal -->
    <div
      v-else
      class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700 dark:text-blue-300">
            Vous êtes sur le point de faire une réclamation sur une note.
            Veuillez fournir des justificatifs clairs et un motif détaillé.
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <form
      @submit.prevent="submitReclamation"
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6"
    >
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"
        ></div>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Chargement des informations...
        </p>
      </div>

      <template v-else>
        <!-- Informations de la note -->
        <div
          class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-5 rounded-lg"
        >
          <h3
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
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
            Détails de la note
          </h3>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Note actuelle
              </p>
              <p
                class="text-2xl font-bold"
                :class="getNoteColorClass(noteDetails.note)"
              >
                {{ noteDetails.note }}/20
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Matière</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ noteDetails.matiere }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Type</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ noteDetails.type }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Date</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ noteDetails.date }}
              </p>
            </div>
          </div>

          <!-- Informations supplémentaires -->
          <div
            class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            <div v-if="noteDetails.ue">
              <p class="text-xs text-gray-500 dark:text-gray-400">UE</p>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ noteDetails.ue }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Semestre</p>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ noteDetails.semestre }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Coefficient
              </p>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ noteDetails.coefficient }}
              </p>
            </div>
          </div>
        </div>

        <!-- Si réclamation existe, afficher les détails -->
        <div
          v-if="hasExistingReclamation"
          class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg"
        >
          <h3
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
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
            Votre réclamation en cours
          </h3>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span :class="getStatusBadgeClass(existingReclamation?.statut)">
                {{ getStatusText(existingReclamation?.statut) }}
              </span>
              <span class="text-sm text-gray-500">
                Soumise le {{ existingReclamation?.date_creation }}
              </span>
            </div>

            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Note proposée
              </p>
              <p
                class="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
              >
                {{ existingReclamation?.nouvelle_note_proposee }}/20
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Motif</p>
              <p
                class="text-sm text-gray-700 dark:text-gray-300"
                v-html="existingReclamation?.motif"
              ></p>
            </div>

            <div v-if="existingReclamation?.fichier_justificatif">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Fichier justificatif
              </p>
              <a
                :href="`${file_url}${existingReclamation.fichier_justificatif}`"
                target="_blank"
                download
                class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Voir le fichier
              </a>
            </div>

            <div
              v-if="existingReclamation?.commentaire_admin"
              class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Réponse de l'administration
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ existingReclamation.commentaire_admin }}
              </p>
            </div>
          </div>
        </div>

        <!-- Champs du formulaire (désactivés si réclamation existe) -->
        <template v-if="!hasExistingReclamation">
          <!-- Nouvelle note proposée -->
          <div>
            <label
              class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              >Note proposée *</label
            >
            <div class="relative">
              <input
                v-model="form.nouvelle_note"
                type="number"
                step="0.01"
                min="0"
                max="20"
                placeholder="Ex: 15.5"
                class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 pr-12"
              />
              <span
                class="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
                >/20</span
              >
            </div>
          </div>

          <!-- Motif -->
          <div>
            <label
              class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              >Motif de la réclamation *</label
            >
            <Editor
              api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
              v-model="form.motif"
              :init="{
                height: 250,
                menubar: false,
                plugins: 'lists link wordcount',
                toolbar:
                  'undo redo | bold italic underline | bullist numlist | removeformat',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                placeholder:
                  'Expliquez clairement les raisons de votre réclamation...',
              }"
            />
          </div>

          <!-- Fichier -->
          <div>
            <label
              class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              >Fichier justificatif *</label
            >
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              @click="triggerFileInput"
              :class="[
                'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
                isDragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400',
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileSelect"
                class="hidden"
              />

              <div v-if="!form.fichier_justificatif" class="text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4V12a4 4 0 014-4h12m20 0v4a4 4 0 01-4 4h-4m-6 0h-4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-indigo-600 dark:text-indigo-400"
                    >Cliquez pour uploader</span
                  >
                  ou glissez-déposez
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PDF, JPG, PNG (max. 5MB)
                </p>
              </div>

              <div v-else class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-8 w-8 text-indigo-500"
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
                  </div>
                  <div class="text-sm">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ form.fichier_justificatif.name }}
                    </p>
                    <p class="text-gray-500 dark:text-gray-400">
                      {{ formatFileSize(form.fichier_justificatif.size) }}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  @click.stop="removeFile"
                  class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Message si réclamation existe -->
        <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            Vous ne pouvez pas soumettre une nouvelle réclamation car une
            réclamation est déjà en cours pour cette note.
          </p>
        </div>

        <!-- Boutons -->
        <div
          class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            @click="router.back()"
            class="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Retour
          </button>

          <button
            v-if="!hasExistingReclamation"
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin h-4 w-4 text-white"
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
            {{ isSubmitting ? "Envoi..." : "Soumettre la réclamation" }}
          </button>
        </div>
      </template>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNuxtApp } from "#app";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Editor from "@tinymce/tinymce-vue";
import { useReclamationStore } from "~~/stores/reclamation";
import config from "~~/config";

const route = useRoute();
const file_url = config.app_local
  ? config.app_dev_storage_url
  : config.app_prod_storage_url;
const router = useRouter();
const reclamationStore = useReclamationStore();
const { $swal, $toastr } = useNuxtApp();

const loading = ref(true);
const isSubmitting = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);

// Détails de la note
const noteDetails = ref({
  note: 0,
  matiere: "",
  type: "",
  date: "",
  ue: "",
  semestre: "",
  coefficient: 0,
});

// Formulaire
const form = ref({
  motif: "",
  nouvelle_note: "",
  fichier_justificatif: null,
});

// Réclamation existante
const existingReclamation = computed(() => {
  return reclamationStore.reclamation?.reclamation?.[0] || null;
});

const hasExistingReclamation = computed(() => {
  return !!existingReclamation.value;
});

// Validation
const isFormValid = computed(() => {
  if (hasExistingReclamation.value) return false;
  return (
    form.value.motif?.length >= 10 &&
    form.value.nouvelle_note &&
    form.value.fichier_justificatif
  );
});

// Fonctions utilitaires
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("fr-FR");
};

const getNoteColorClass = (note) => {
  if (note >= 16) return "text-green-600 dark:text-green-400";
  if (note >= 12) return "text-blue-600 dark:text-blue-400";
  if (note >= 10) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const getStatusText = (statut) => {
  const statusMap = {
    en_attente: "En attente",
    approuvee: "Approuvée",
    rejetee: "Rejetée",
  };
  return statusMap[statut] || statut;
};

const getStatusClass = (statut) => {
  const classes = {
    en_attente: "text-yellow-600 dark:text-yellow-400 font-medium",
    approuvee: "text-green-600 dark:text-green-400 font-medium",
    rejetee: "text-red-600 dark:text-red-400 font-medium",
  };
  return classes[statut] || "";
};

const getStatusBadgeClass = (statut) => {
  const classes = {
    en_attente:
      "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    approuvee:
      "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    rejetee:
      "px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return (
    classes[statut] ||
    "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
  );
};

// Gestion fichiers
const triggerFileInput = () => {
  if (!hasExistingReclamation.value) {
    fileInput.value?.click();
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) validateAndSetFile(file);
};

const handleFileDrop = (event) => {
  if (hasExistingReclamation.value) return;
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) validateAndSetFile(file);
};

const validateAndSetFile = (file) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    $toastr.error("Type de fichier non supporté. Utilisez PDF, JPG ou PNG.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    $toastr.error("Fichier trop volumineux. La taille maximum est de 5MB.");
    return;
  }

  form.value.fichier_justificatif = file;
};

const removeFile = () => {
  form.value.fichier_justificatif = null;
  if (fileInput.value) fileInput.value.value = "";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Soumission
const submitReclamation = async () => {
  if (!isFormValid.value || hasExistingReclamation.value) return;

  try {
    isSubmitting.value = true;

    const formData = new FormData();
    formData.append("motif", form.value.motif);
    formData.append("nouvelle_note", form.value.nouvelle_note);
    formData.append("fichier_justificatif", form.value.fichier_justificatif);

    await reclamationStore.storeReclamation(formData, route.params.id);

    $toastr.success("Réclamation envoyée avec succès");

    setTimeout(() => {
      router.push("/etudiant/mes-notes");
    }, 1500);
  } catch (error) {
    console.error("Erreur:", error);
    $toastr.error(error.response?.data?.message || "Erreur lors de l'envoi");
  } finally {
    isSubmitting.value = false;
  }
};

// Initialisation
onMounted(async () => {
  try {
    await reclamationStore.fetchReclamationDetail(route.params.id);

    // Extraire les informations de la note
    const data = reclamationStore.reclamation;
    if (data) {
      noteDetails.value = {
        note: data.notation || 0,
        matiere: data.evaluation?.matiere?.nom || "N/A",
        type: data.evaluation?.type || "N/A",
        date: formatDate(data.evaluation?.date),
        ue: data.evaluation?.matiere?.ue?.code || "N/A",
        semestre: data.evaluation?.matiere?.ue?.periode?.nom || "N/A",
        coefficient: data.evaluation?.matiere?.coefficient || 1,
      };
    }
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement des informations");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.border-dashed {
  transition: all 0.2s ease;
}
</style>
