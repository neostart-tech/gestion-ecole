<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- ===================== Breadcrumb ===================== -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink
        to="/admin/partenaires"
        class="cursor-pointer hover:text-indigo-600 transition-colors"
      >
        Partenaires
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default"
        >Ajouter un partenaire</span
      >
    </div>

    <!-- ===================== Titre ===================== -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
        Ajouter un partenaire
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

    <!-- ===================== Formulaire ===================== -->
    <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <form @submit.prevent="saveAdvertiser" class="space-y-4">
        <FloatLabel variant="on">
          <InputText
            id="nom"
            v-model="form.nom"
            autocomplete="off"
            class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label for="nom">Nom</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText
            id="email"
            v-model="form.email"
            autocomplete="off"
            class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label for="email">Email</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText
            id="ville"
            v-model="form.ville"
            autocomplete="off"
            class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label for="ville">Ville</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText
            id="site"
            v-model="form.site"
            autocomplete="off"
            class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label for="site">Site web</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <!-- <Textarea
                  id="details"
                  v-model="form.details"
                  rows="4"
                  class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                /> -->
          <Editor
            api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
            v-model="form.details"
            :init="{
              height: 250,
              menubar: false,
              plugins: 'lists link image media table wordcount',
              toolbar:
                'undo redo | bold italic underline | bullist numlist | link image media | removeformat',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }"
          />
        </FloatLabel>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Annuler
          </button>

          <button
            :disabled="advertiserStore.isLoading"
            type="submit"
            class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{
              advertiserStore.isLoading
                ? "Enrégistrement en cours..."
                : "Enregistrer"
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
import { useAdvertiserStore } from "~~/stores/adverstiser";

const advertiserStore = useAdvertiserStore();
const { $swal, $toastr } = useNuxtApp();

const form = ref({
  id: null,
  slug: null,
  nom: "",
  email: "",
  ville: "",
  site: "",
  details: "",
});

const saveAdvertiser = async () => {
  try {
    await advertiserStore.addAdvertiser(form.value);

    $toastr.success(advertiserStore.message);

    navigateTo("/partenaires/liste");
  } catch (error) {
    console.log(error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};
</script>

<style scoped>
:deep(.tox-tinymce) {
  border-radius: 0.5rem;
}
</style>
