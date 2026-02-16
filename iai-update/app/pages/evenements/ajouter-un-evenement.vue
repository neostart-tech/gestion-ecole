<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink
        to="/admin/evenements"
        class="cursor-pointer hover:text-indigo-600 transition-colors"
      >
        Évènements
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default"
        >Ajouter un évènement</span
      >
    </div>

    <!-- Titre -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
        Ajouter un évènement
      </h1>
      <button
        @click="goBack"
        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Retour
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Titre de la publication -->
        <div>
          <label
            for="titre"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Nom de l'événement <span class="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="titre"
            v-model="form.nom"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Entrez le titre de l'évènement"
            :class="{ 'border-rose-500': errors.nom }"
          />
          <p v-if="errors.nom" class="mt-1 text-sm text-rose-600">
            {{ errors.nom }}
          </p>
        </div>

        <!-- Dates de l'évènement -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date de début -->
          <div>
            <label
              for="date_debut"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Date de début de l'évènement <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input
                type="date"
                id="date_debut"
                v-model="form.start_date"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                :class="{ 'border-rose-500': errors.start_date }"
              />
            </div>
            <p v-if="errors.start_date" class="mt-1 text-sm text-rose-600">
              {{ errors.start_date }}
            </p>
          </div>

          <!-- Date de fin -->
          <div>
            <label
              for="date_fin"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Date de fin de l'évènement
            </label>
            <div class="relative">
              <input
                type="date"
                id="date_fin"
                v-model="form.end_date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                :class="{ 'border-rose-500': errors.end_date }"
              />
            </div>
            <p v-if="errors.end_date" class="mt-1 text-sm text-rose-600">
              {{ errors.end_date }}
            </p>
            <p class="mt-1 text-xs text-gray-500">
              Laisser vide si l'évènement dure un seul jour
            </p>
          </div>
        </div>

        <!-- Contenu de la publication avec TinyMCE -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Contenu de la publication <span class="text-rose-500">*</span>
            </label>
          </div>

          <!-- TinyMCE Editor -->
          <div :class="{ 'border-rose-500 rounded-lg': errors.details }">
            <Editor
              v-model="form.details"
              :api-key="tinymceApiKey"
              :init="editorConfig"
              class="tinymce-editor"
            />
          </div>
          <p v-if="errors.details" class="mt-1 text-sm text-rose-600">
            {{ errors.details }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Utilisez l'éditeur pour formater votre contenu avec des images, des
            liens, etc.
          </p>
        </div>

        <div
          class="flex items-center justify-end gap-4 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="goBack"
            class="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin h-5 w-5 text-white"
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
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{
              isSubmitting
                ? "Enrégistrement en cours..."
                : "Enrégistrer l'évènement"
            }}
          </button>
        </div>
      </form>
    </div>

  
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Editor from "@tinymce/tinymce-vue";
import { useEvenementStore } from "~~/stores/evenement";

// Clé API TinyMCE
const tinymceApiKey = "zg2zugks07aopv32g7tny5709pnqww29mxbvn1oa8x7d78c7";
const evenementStore = useEvenementStore();
const { $toastr } = useNuxtApp();

// Configuration de l'éditeur TinyMCE
const editorConfig = {
  height: 400,
  menubar: true,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "code",
    "help",
    "wordcount",
    "emoticons",
  ],
  toolbar:
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | link image | emoticons | help",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
  images_upload_url: "/api/upload", // URL d'upload d'images
  automatic_uploads: true,
  file_picker_types: "image",
  promotion: false,
  branding: false,
  emoticons_database: "emojis",
  emoticons_append: {
    custom_mind_explode: {
      keywords: ["brain", "mind", "explode", "blown"],
      char: "🤯",
    },
  },
};

// État du formulaire
const form = ref({
  nom: "",
  start_date: "",
  end_date: "",
  details: "",
});

// Gestion des erreurs
const errors = ref({});
const isSubmitting = ref(false);

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Validation du formulaire
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.nom.trim()) {
    errors.value.nom = "Le nom est requis";
    isValid = false;
  }

  if (!form.value.start_date) {
    errors.value.start_date = "La date de début est requise";
    isValid = false;
  }

  if (form.value.end_date && form.value.end_date < form.value.end_date) {
    errors.value.end_date = "La date de fin doit être après la date de début";
    isValid = false;
  }

  if (!form.value.details.trim()) {
    errors.value.details = "Le contenu est requis";
    isValid = false;
  }

  return isValid;
};

// Soumettre le formulaire
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Préparer les données
    const eventData = {
      nom: form.value.nom,
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      details: form.value.details,
    };
    await evenementStore.createEvenement(eventData);
    await evenementStore.fetchEvenements();
    $toastr.success("Evénement enrégistré avec succes");
    try {
    } catch (error) {}
    navigateTo("/evenements/liste");
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue lors de l'événement.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation
const goBack = () => {
  navigateTo("/evenements/liste");
};

onMounted(() => {});
</script>
