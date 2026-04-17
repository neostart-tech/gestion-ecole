<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Actualités', to: '/info-urgente/liste' },
        { label: 'Modifier l\'actualité', to: null },
      ]"
      title="Modifier l'actualité"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Titre -->
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
      Modifier l'actualité
    </h1>

    <!-- Loader -->
    <div v-if="isLoadingData" class="flex justify-center py-20">
      <div class="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>

    <!-- Formulaire -->
    <div v-else class="bg-white rounded-xl shadow-sm p-6">
      <form @submit.prevent="savePublication" class="space-y-6">
        <!-- Titre -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Titre de l'actualité <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Titre de l'actualité"
          />
        </div>

        <!-- Résumé -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Résumé / Contenu <span class="text-rose-500">*</span>
          </label>
          <ClientOnly>
            <EditorTinyMCE
              v-model="form.summary"
              placeholder="Contenu de l'actualité"
            />
            <template #fallback>
              <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                <span class="text-gray-400">Chargement de l'éditeur...</span>
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- Destinataires -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Destinataires <span class="text-rose-500">*</span>
            </label>
            <Dropdown
              v-model="form.target_audience"
              :options="audienceOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner le destinataire"
              class="w-full"
            />
          </div>

          <div v-if="form.target_audience === 'group'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Sélectionner le groupe <span class="text-rose-500">*</span>
            </label>
            <Dropdown
              v-model="form.target_group_id"
              :options="groupesOptions"
              optionLabel="label"
              optionValue="value"
              filter
              showClear
              placeholder="Rechercher un groupe..."
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Statut -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Statut <span class="text-rose-500">*</span>
            </label>
            <Dropdown
              v-model="form.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner le statut"
              class="w-full"
            />
          </div>

          <!-- Lien externe -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Lien externe (optionnel)
            </label>
            <input
              v-model="form.file_url"
              type="url"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <!-- Image de couverture -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Image de couverture (optionnel)
          </label>
          <div
            @click="$refs.imageInput.click()"
            class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <div v-if="imagePreview" class="mb-2 relative">
              <img :src="imagePreview" class="max-h-32 mx-auto rounded-lg object-contain" />
              <button
                type="button"
                @click.stop="removeImage"
                class="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-rose-600"
              >✕</button>
            </div>
            <div v-else class="py-2">
              <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 012-2V6a2 2 0 01-2-2H6a2 2 0 01-2 2v12a2 2 0 012 2z" />
              </svg>
              <p class="text-sm text-gray-500">Ajouter ou changer l'image</p>
            </div>
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
          </div>
        </div>

        <!-- Pièces jointes multiples -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Pièces jointes (PDF, Word, etc.) (optionnel)
          </label>
          <div
            @click="$refs.attachmentInput.click()"
            class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <p class="text-sm text-gray-500">Ajouter des fichiers joints</p>
            <input ref="attachmentInput" type="file" multiple class="hidden" @change="handleAttachmentsUpload" />
          </div>

          <!-- Fichiers existants -->
          <div v-if="existingAttachments.length" class="space-y-2 mt-3">
            <p class="text-xs font-medium text-gray-500 uppercase">Fichiers existants</p>
            <div v-for="(att, index) in existingAttachments" :key="'ex-'+index" class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-3 truncate">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-sm text-blue-700 truncate">{{ att.name || getFileNameFromPath(att.url || att) }}</span>
              </div>
              <button @click.prevent="removeExistingAttachment(index)" class="text-rose-500 hover:text-rose-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Nouveaux fichiers -->
          <div v-if="newAttachments.length" class="space-y-2 mt-3">
            <p class="text-xs font-medium text-gray-500 uppercase">Nouveaux fichiers</p>
            <div v-for="(file, index) in newAttachments" :key="'new-'+index" class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div class="flex items-center gap-3 truncate">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-sm text-green-700 truncate">{{ file.name }}</span>
              </div>
              <button @click.prevent="removeNewAttachment(index)" class="text-rose-500 hover:text-rose-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          <NuxtLink
            to="/info-urgente/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </NuxtLink>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isSubmitting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-if="isSubmitting">Mise à jour...</span>
            <span v-else>Mettre à jour</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUrgentInfoStore } from "~~/stores/urgent-info";
import { useGroupeStore } from "~~/stores/group";
import Breadcrumb from "~/components/Breadcrumb.vue";
import EditorTinyMCE from "~/components/EditorTinyMCE.vue";

const urgentinfoStore = useUrgentInfoStore();
const groupStore = useGroupeStore();
const { $toastr } = useNuxtApp();
const route = useRoute();

const isSubmitting = ref(false);
const isLoadingData = ref(true);
const imagePreview = ref(null);
const imageFile = ref(null);
const existingAttachments = ref([]);
const newAttachments = ref([]);

const form = ref({
  title: "",
  summary: "",
  target_audience: "all",
  target_group_id: null,
  status: "0",
  file_url: "",
});

const groupesOptions = computed(() =>
  groupStore.groupes.map((g) => ({
    label: `${g.niveau?.libelle || "Niveau inconnu"} - ${g.nom || g.name}`,
    value: g.id,
  }))
);

const audienceOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Étudiants', value: 'students' },
  { label: 'Enseignants', value: 'teachers' },
  { label: 'Administration', value: 'administration' },
  { label: 'Groupe spécifique', value: 'group' }
];

const statusOptions = [
  { label: 'Non publié (Brouillon)', value: '0' },
  { label: 'Publié', value: '1' }
];

const groups = computed(() => groupStore.groupes);

const getFileNameFromPath = (path) => {
  if (!path) return 'Fichier';
  return path.split('/').pop() || 'Fichier';
};

// Image
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    $toastr.warning("L'image est trop volumineuse (max 5MB)");
    return;
  }
  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => imagePreview.value = e.target.result;
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

// Attachments
const handleAttachmentsUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      $toastr.warning(`${file.name} trop volumineux (max 10MB)`);
      return;
    }
    newAttachments.value.push(file);
  });
};

const removeNewAttachment = (index) => {
  newAttachments.value.splice(index, 1);
};

const removeExistingAttachment = (index) => {
  existingAttachments.value.splice(index, 1);
};

// Chargement
onMounted(async () => {
  try {
    await groupStore.fetchGroupes();

    if (route.params.id) {
      const info = await urgentinfoStore.fetchUrgentInfo(route.params.id);
      if (info) {
        form.value.title = info.title || "";
        form.value.summary = info.summary || "";
        form.value.file_url = info.file_url || "";
        form.value.status = info.is_published ? "1" : "0";
        form.value.target_audience = info.target_audience || "all";
        form.value.target_group_id = info.target_group_id || null;

        if (info.image) {
          imagePreview.value = info.image;
        }

        if (info.attachments && Array.isArray(info.attachments)) {
          existingAttachments.value = [...info.attachments];
        }
      }
    }
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement");
  } finally {
    isLoadingData.value = false;
  }
});

// Sauvegarde
const savePublication = async () => {
  try {
    if (!form.value.title || (typeof form.value.title === 'string' && !form.value.title.trim())) {
      $toastr.warning("Le titre est obligatoire");
      return;
    }
    if (!form.value.summary || (typeof form.value.summary === 'string' && !form.value.summary.trim())) {
      $toastr.warning("Le résumé est obligatoire");
      return;
    }

    isSubmitting.value = true;
    const formData = new FormData();

    formData.append("title", String(form.value.title || "").trim());
    formData.append("summary", String(form.value.summary || "").trim());
    formData.append("target_audience", form.value.target_audience);
    formData.append("is_published", form.value.status);
    formData.append("_method", "PUT");

    if (form.value.target_audience === 'group' && form.value.target_group_id) {
      formData.append("target_group_id", form.value.target_group_id);
    }

    if (form.value.file_url) {
      formData.append("file_url", form.value.file_url);
    }

    if (imageFile.value) {
      formData.append("image", imageFile.value);
    }

    // Fichiers existants à conserver (envoyer en JSON)
    if (existingAttachments.value.length) {
      formData.append('existing_attachments', JSON.stringify(existingAttachments.value));
    }

    // Nouveaux fichiers
    newAttachments.value.forEach((file, i) => {
      formData.append(`attachments[${i}]`, file);
    });

    await urgentinfoStore.updateUrgentInfo(route.params.id, formData);
    $toastr.success("Actualité modifiée avec succès");
    navigateTo("/info-urgente/liste");

  } catch (error) {
    console.error("Erreur:", error);
    if (error.response?.data?.errors) {
      const msgs = Object.values(error.response.data.errors).flat().join("\n");
      $toastr.error(msgs || "Erreur de validation");
    } else {
      $toastr.error(error?.message || "Erreur lors de la modification");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>