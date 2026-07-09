<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/publications/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Publications
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/publications/infos-urgentes" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Actualités
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Nouvelle actualité</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Nouvelle actualité</h1>
        <p class="text-sm text-gray-500 mt-1">Partagez une information avec votre communauté</p>
      </div>
      <NuxtLink
        to="/publications/infos-urgentes"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Retour
      </NuxtLink>
    </div>

    <!-- Form card -->
    <div class="max-w-3xl mx-auto">
      <form @submit.prevent="saveUrgentInfo" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-800">Informations de l'actualité</h2>
        </div>

        <div class="px-6 py-6 space-y-6">
          <!-- Titre -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Titre de l'actualité <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              autofocus
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Ex: Réunion pédagogique du mardi..."
            />
          </div>

          <!-- Destinataires -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Cible des destinataires</label>
              <select
                v-model="form.target_audience"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="all">Tous (Utilisateurs &amp; Étudiants)</option>
                <option value="students">Tous les étudiants</option>
                <option value="teachers">Tous les enseignants</option>
                <option value="administration">Administration uniquement</option>
                <option value="group">Un groupe spécifique</option>
              </select>
            </div>
            <div class="space-y-1.5" v-if="form.target_audience === 'group'">
              <label class="text-sm font-semibold text-gray-700">Sélectionner le groupe <span class="text-rose-500">*</span></label>
              <select
                v-model="form.target_group_id"
                required
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.nom }}</option>
              </select>
            </div>
          </div>

          <!-- Image -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-gray-700">Image de couverture <span class="text-gray-400 font-normal">(Optionnelle)</span></label>
            <div @click="imageInput?.click()" class="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
              <div v-if="form.imagePreview" class="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img :src="form.imagePreview" class="w-full h-full object-contain" />
                <button type="button" @click.stop="removeImage" class="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-all scale-0 group-hover:scale-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div v-else class="text-center py-4">
                <div class="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-600 font-medium">Cliquez pour ajouter une image</p>
                <p class="text-xs text-gray-400 mt-1">Format recommandé : 16:9, max 5MB</p>
              </div>
            </div>
          </div>

          <!-- Contenu -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-gray-700">Contenu de l'actualité</label>
            <textarea
              v-model="form.summary"
              rows="5"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="Écrivez votre message ici..."
            ></textarea>
          </div>

          <!-- Pièces jointes -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-gray-700">Pièces jointes <span class="text-gray-400 font-normal">(Optionnelles)</span></label>
              <button type="button" @click="attachmentInput?.click()" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter des fichiers
              </button>
              <input ref="attachmentInput" type="file" multiple class="hidden" @change="handleAttachmentUpload" />
            </div>

            <div v-if="form.attachments.length" class="space-y-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
              <div v-for="(att, idx) in form.attachments" :key="idx" class="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 group">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 truncate">{{ att.name }}</p>
                    <p class="text-[10px] text-gray-500">{{ formatFileSize(att.size) }}</p>
                  </div>
                </div>
                <button type="button" @click="removeAttachment(idx)" class="p-1 text-gray-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Publication -->
          <div class="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <div>
                <label class="text-sm font-bold text-gray-900 block">Publier et notifier</label>
                <p class="text-[11px] text-gray-600">L'actualité sera visible et une notification sera envoyée</p>
              </div>
            </div>
            <button
              type="button"
              @click="form.is_published = !form.is_published"
              :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', form.is_published ? 'bg-indigo-600' : 'bg-gray-300']"
            >
              <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', form.is_published ? 'translate-x-6' : 'translate-x-1']" />
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <NuxtLink
            to="/publications/infos-urgentes"
            class="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </NuxtLink>
          <button
            type="submit"
            :disabled="isSaving"
            class="px-8 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div v-if="isSaving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            {{ form.is_published ? 'Publier maintenant' : 'Enregistrer brouillon' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUrgentInfoStore } from '~~/stores/urgent-info';
import { useGroupeStore } from '~~/stores/group';

const { $toastr } = useNuxtApp();
const urgentInfoStore = useUrgentInfoStore();
const groupStore = useGroupeStore();

const isSaving = ref(false);
const imageInput = ref(null);
const attachmentInput = ref(null);

const groups = computed(() => groupStore.groupes);

const form = ref({
  title: '',
  summary: '',
  image: null,
  imagePreview: null,
  attachments: [],
  target_audience: 'all',
  target_group_id: null,
  is_published: true,
});

onMounted(async () => {
  await groupStore.fetchGroupes();
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    $toastr.error('Veuillez sélectionner une image');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    $toastr.warning("L'image est trop volumineuse (max 5MB)");
    return;
  }
  form.value.image = file;
  form.value.imagePreview = URL.createObjectURL(file);
};

const removeImage = () => {
  if (form.value.imagePreview) URL.revokeObjectURL(form.value.imagePreview);
  form.value.image = null;
  form.value.imagePreview = null;
};

const handleAttachmentUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (file.size > 20 * 1024 * 1024) {
      $toastr.warning(`Le fichier ${file.name} est trop volumineux (max 20MB)`);
      return;
    }
    form.value.attachments.push({ file, name: file.name, size: file.size });
  });
};

const removeAttachment = (index) => {
  form.value.attachments.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const saveUrgentInfo = async () => {
  if (!form.value.title.trim()) {
    $toastr.warning('Le titre est obligatoire');
    return;
  }

  try {
    isSaving.value = true;
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('summary', form.value.summary);
    formData.append('target_audience', form.value.target_audience);
    formData.append('is_published', form.value.is_published ? '1' : '0');

    if (form.value.target_group_id) {
      formData.append('target_group_id', form.value.target_group_id);
    }
    if (form.value.image instanceof File) {
      formData.append('image', form.value.image);
    }
    form.value.attachments.forEach((att, index) => {
      if (att.file instanceof File) {
        formData.append(`attachments[${index}]`, att.file);
      }
    });

    await urgentInfoStore.createUrgentInfo(formData);
    $toastr.success(form.value.is_published ? 'Actualité publiée avec succès' : 'Brouillon enregistré');
    navigateTo('/publications/infos-urgentes');
  } catch (error) {
    $toastr.error("Une erreur est survenue lors de l'enregistrement");
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};
</script>
