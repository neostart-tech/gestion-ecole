<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink
        to="/partenaires/liste"
        class="cursor-pointer hover:text-indigo-600 transition-colors"
      >
        Partenaires
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default"
        >Modifier {{ form.nom }}</span
      >
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
        Modifier le partenaire
      </h1>
      <NuxtLink
        to="/partenaires/liste"
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
      </NuxtLink>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-6">
      <div class="py-10 text-center">
        <svg class="mx-auto h-10 w-10 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-3 text-gray-600">Chargement des données...</p>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <form @submit.prevent="updateAdvertiser" class="space-y-6">
        <!-- Logo avec drag & drop -->
        <ImageUpload
          v-model="form.logo"
          label="Logo du partenaire"
          :error="uploadError"
          @error="uploadError = $event"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatLabel variant="on">
            <InputText
              id="nom"
              v-model="form.nom"
              autocomplete="off"
              class="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500"
              :class="{ 'border-red-500': errors.nom }"
            />
            <label for="nom">Nom *</label>
            <p v-if="errors.nom" class="mt-1 text-xs text-red-500">{{ errors.nom }}</p>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="email"
              v-model="form.email"
              autocomplete="off"
              type="email"
              class="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500"
              :class="{ 'border-red-500': errors.email }"
            />
            <label for="email">Email *</label>
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="ville"
              v-model="form.ville"
              autocomplete="off"
              class="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <label for="ville">Ville</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="site"
              v-model="form.site"
              autocomplete="off"
              type="url"
              class="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <label for="site">Site web</label>
          </FloatLabel>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Editor
            api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
            v-model="form.details"
            :init="{
              height: 400,
              menubar: false,
              plugins: 'lists link image media table wordcount',
              toolbar:
                'undo redo | bold italic underline | bullist numlist | link image media | removeformat',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }"
          />
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <NuxtLink
            to="/partenaires/liste"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </NuxtLink>
          <button
            :disabled="advertiserStore.isLoading"
            type="submit"
            class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg v-if="advertiserStore.isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ advertiserStore.isLoading ? "Modification..." : "Modifier" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Editor from "@tinymce/tinymce-vue";
import ImageUpload from "~/components/ImageUpload.vue";
import { useAdvertiserStore } from "~~/stores/adverstiser";
import { useRoute } from "vue-router";

const advertiserStore = useAdvertiserStore();
const route = useRoute();
const { $toastr } = useNuxtApp();
const partenaireSlug = route.params.slug;
const loading = ref(true);
const uploadError = ref("");
const errors = ref({});

const form = ref({
  nom: "",
  email: "",
  ville: "",
  site: "",
  details: "",
  logo: null
});

const validateForm = () => {
  errors.value = {};
  
  if (!form.value.nom?.trim()) {
    errors.value.nom = "Le nom est requis";
  }
  
  if (!form.value.email?.trim()) {
    errors.value.email = "L'email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "Email invalide";
  }
  
  return Object.keys(errors.value).length === 0;
};

const updateAdvertiser = async () => {
  if (!validateForm()) return;
  
  try {
    const formData = new FormData();
    formData.append('nom', form.value.nom);
    formData.append('email', form.value.email);
    formData.append('ville', form.value.ville || '');
    formData.append('site', form.value.site || '');
    formData.append('details', form.value.details || '');
    
    if (form.value.logo instanceof File) {
      formData.append('logo', form.value.logo);
    }

    await advertiserStore.updateAdvertiser(formData, partenaireSlug);
    $toastr.success(advertiserStore.message);
    navigateTo("/partenaires/liste");
  } catch (error) {
    console.log(error);
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

onMounted(async () => {
  loading.value = true;
  await advertiserStore.getAdvertiser(partenaireSlug);
  
  if (advertiserStore.advertiser) {
    form.value = {
      nom: advertiserStore.advertiser.nom || "",
      email: advertiserStore.advertiser.email || "",
      ville: advertiserStore.advertiser.ville || "",
      site: advertiserStore.advertiser.site || "",
      details: advertiserStore.advertiser.details || "",
      logo: advertiserStore.advertiser.logo_url || null
    };
  }
  loading.value = false;
});
</script>

<style scoped>
:deep(.tox-tinymce) {
  border-radius: 0.5rem;
}
</style>