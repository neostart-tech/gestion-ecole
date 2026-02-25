<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <Breadcrumb
        :items="[
          { label: 'Espace étudiant', to: '/espace-etudiant' },
          { label: 'Annonces', to: '/espace-etudiant/annonces' },
          { label: 'Détails', to: null },
        ]"
        title="Détails de l'annonce"
        title-class="text-xl md:text-2xl font-semibold text-gray-800"
        spacing="mb-6"
      />

      <!-- Loading -->
      <div v-if="annonceStore.isLoading" class="flex justify-center py-12">
        <loading />
      </div>

      <!-- Contenu -->
      <div
        v-else-if="annonceStore.annonce"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <!-- En-tête -->
        <div class="px-6 py-6 border-b border-gray-100">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 class="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                {{ annonceStore.annonce.titre || annonceStore.annonce.title }}
              </h1>
              <p class="text-gray-500 text-sm">
                {{ annonceStore.annonce.advertiser?.nom }}
              </p>
            </div>
            <!-- Badge "Déjà postulé" -->
            <div
              v-if="annonceStore.annonce.applied"
              class="self-start bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 inline-flex items-center gap-1.5"
            >
              <svg
                class="w-3.5 h-3.5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="text-xs text-gray-600">Envoyée</span>
            </div>
          </div>
        </div>

        <!-- Infos en grille -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50/50 border-b border-gray-100">
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
            <p class="font-medium text-gray-700">{{ annonceStore.annonce.type_annonce || "-" }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Contrat</p>
            <p class="font-medium text-gray-700">{{ annonceStore.annonce.type_contrat || "-" }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Durée</p>
            <p class="font-medium text-gray-700">{{ annonceStore.annonce.duration || "-" }} mois</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Lieu</p>
            <p class="font-medium text-gray-700">{{ annonceStore.annonce.ville || "-" }}</p>
          </div>
        </div>

        <!-- Description -->
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Description
          </h2>
          <div
            class="prose prose-sm max-w-none text-gray-600"
            v-html="annonceStore.annonce.content"
          ></div>
        </div>

        <!-- Document joint -->
        <div
          v-if="annonceStore.annonce.filepath"
          class="px-6 py-4 border-b border-gray-100"
        >
          <a
            :href="annonceStore.annonce.filepath"
            target="_blank"
            class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
            Télécharger la fiche de poste
          </a>
        </div>

        <!-- Section Postuler -->
        <div v-if="!annonceStore.annonce.applied" class="p-6 bg-white">
          <h2 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">
            Postuler à cette offre
          </h2>

          <form @submit.prevent="handlePostuler" class="space-y-6">
            <!-- CV -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Vitae <span class="text-gray-400">*</span>
              </label>
              <div
                @dragover.prevent="isDraggingCV = true"
                @dragleave.prevent="isDraggingCV = false"
                @drop.prevent="handleFileDropCV"
                @click="triggerFileInputCV"
                :class="[
                  'border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer group',
                  isDraggingCV
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                ]"
              >
                <input
                  ref="fileInputCV"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  @change="handleFileSelectCV"
                  class="hidden"
                />

                <div v-if="!cvFile" class="text-center">
                  <div class="mb-3">
                    <svg
                      class="w-8 h-8 mx-auto text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 mb-1">
                    <span class="font-medium text-gray-700">Cliquez pour parcourir</span> ou glissez-déposez
                  </p>
                  <p class="text-xs text-gray-400">PDF, DOC, DOCX (max. 5 Mo)</p>
                </div>

                <div v-else class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gray-100 rounded-lg">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-700">{{ cvFile.name }}</p>
                      <p class="text-xs text-gray-400">{{ formatFileSize(cvFile.size) }}</p>
                    </div>
                  </div>
                  <button type="button" @click.stop="removeFileCV" class="p-1 text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Lettre de motivation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Lettre de motivation <span class="text-gray-400">(optionnel)</span>
              </label>
              <div
                @dragover.prevent="isDraggingLM = true"
                @dragleave.prevent="isDraggingLM = false"
                @drop.prevent="handleFileDropLM"
                @click="triggerFileInputLM"
                :class="[
                  'border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer group',
                  isDraggingLM
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                ]"
              >
                <input
                  ref="fileInputLM"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  @change="handleFileSelectLM"
                  class="hidden"
                />

                <div v-if="!lmFile" class="text-center">
                  <div class="mb-3">
                    <svg class="w-8 h-8 mx-auto text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 mb-1">
                    <span class="font-medium text-gray-700">Cliquez pour parcourir</span> ou glissez-déposez
                  </p>
                  <p class="text-xs text-gray-400">PDF, DOC, DOCX (max. 5 Mo)</p>
                </div>

                <div v-else class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gray-100 rounded-lg">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-700">{{ lmFile.name }}</p>
                      <p class="text-xs text-gray-400">{{ formatFileSize(lmFile.size) }}</p>
                    </div>
                  </div>
                  <button type="button" @click.stop="removeFileLM" class="p-1 text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Bouton -->
            <div class="flex items-center justify-between pt-4">
              <p class="text-xs text-gray-400"><span class="text-gray-600">*</span> Champs requis</p>
              <button
                type="submit"
                :disabled="!cvFile || isSubmitting"
                class="px-6 py-2.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? "Envoi..." : "Envoyer ma candidature" }}
              </button>
            </div>
          </form>
        </div>

        <!-- Message si déjà postulé -->
        <div v-else class="p-6 bg-white">
          <div class="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <svg class="w-12 h-12 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-800 mb-2">Candidature déjà envoyée</h3>
            <p class="text-gray-600 text-sm mb-4">
              Vous avez déjà postulé à cette offre. Vous ne pouvez pas soumettre une nouvelle candidature.
            </p>
            <NuxtLink
              to="/etudiant/annonces"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux annonces
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import loading from "~/components/loading.vue";
import { ref, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useAnnonceStore } from "~~/stores/annonce";
import { useRoute, useRouter } from "vue-router";

const annonceStore = useAnnonceStore();
const route = useRoute();
const router = useRouter();
const annonceId = route.params.id;

// États
const isSubmitting = ref(false);
const cvFile = ref(null);
const lmFile = ref(null);
const message = ref("");
const isDraggingCV = ref(false);
const isDraggingLM = ref(false);
const fileInputCV = ref(null);
const fileInputLM = ref(null);

// Gestionnaires CV
const triggerFileInputCV = () => fileInputCV.value?.click();

const handleFileSelectCV = (e) => {
  const file = e.target.files[0];
  if (file) validateFile(file, "cv");
};

const handleFileDropCV = (e) => {
  isDraggingCV.value = false;
  const file = e.dataTransfer.files[0];
  if (file) validateFile(file, "cv");
};

// Gestionnaires LM
const triggerFileInputLM = () => fileInputLM.value?.click();

const handleFileSelectLM = (e) => {
  const file = e.target.files[0];
  if (file) validateFile(file, "lm");
};

const handleFileDropLM = (e) => {
  isDraggingLM.value = false;
  const file = e.dataTransfer.files[0];
  if (file) validateFile(file, "lm");
};

// Validation commune
const validateFile = (file, type) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    alert("Format non supporté. Utilisez PDF, DOC ou DOCX.");
    return;
  }

  if (file.size > maxSize) {
    alert("Fichier trop volumineux. Maximum 5 Mo.");
    return;
  }

  if (type === "cv") cvFile.value = file;
  else lmFile.value = file;
};

// Suppression
const removeFileCV = () => {
  cvFile.value = null;
  if (fileInputCV.value) fileInputCV.value.value = "";
};

const removeFileLM = () => {
  lmFile.value = null;
  if (fileInputLM.value) fileInputLM.value.value = "";
};

// Formatage taille
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 o";
  const k = 1024;
  const sizes = ["o", "Ko", "Mo"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const handlePostuler = async () => {
  const { $toastr } = useNuxtApp();
  if (!cvFile.value) {
    // alert("Veuillez joindre votre CV");
    $toastr.error("Veuillez joindre votre CV");
    return;
  }

  try {
    isSubmitting.value = true;
    const formData = new FormData();
    formData.append("cv", cvFile.value);
    if (lmFile.value) formData.append("lettre_motivation", lmFile.value);

    await annonceStore.postulerAnnonce(annonceId, formData);
    $toastr.success("Candidature envoyée avec succès !");
    router.push("/etudiant/annonces");
  } catch (error) {
    $toastr.error(
      error.response?.data?.message ||
        "Une erreur est survenue lors de l'envoi de votre candidature.",
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Charger l'annonce
onMounted(async () => {
  await annonceStore.fetchAnnonceDetail(annonceId);
});
</script>

<style scoped>
/* Style sobre et épuré */
.prose {
  line-height: 1.7;
  color: #4b5563;
}

.prose p {
  margin-bottom: 1rem;
}

/* Transitions douces */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Animation spin */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
