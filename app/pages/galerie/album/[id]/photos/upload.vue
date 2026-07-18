<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">
    <div v-if="loadingInitial" class="flex items-center justify-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600"></div>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Fil d'Ariane -->
      <nav class="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <NuxtLink to="/galerie" class="flex items-center gap-1.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Galerie
        </NuxtLink>
        <svg class="w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <NuxtLink :to="`/galerie?album=${albumId}`" class="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          {{ album.name }}
        </NuxtLink>
        <svg class="w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span class="text-gray-600 dark:text-gray-300">Ajouter des photos</span>
      </nav>

      <!-- En-tête -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <CloudArrowUpIcon class="w-5 h-5 text-white" />
            </div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Importer des photos</h1>
          </div>
          <p class="text-sm text-gray-400 dark:text-gray-500 pl-12">
            Album cible : <strong>{{ album.name }}</strong>
          </p>
        </div>
        
        <button @click="$router.push(`/galerie?album=${albumId}`)" class="btn-ghost">
          Terminer
        </button>
      </div>

      <!-- Zone d'importation -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm mb-8">
        <div class="space-y-8">
          <div class="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-4 mb-4">
             <h2 class="text-lg font-bold text-gray-900 dark:text-white">Importer de nouveaux fichiers</h2>
             <span class="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-lg">Batch Upload</span>
          </div>
          
          <MultipleFileUpload 
            v-model="files"
            accept="image/*"
            :max-size="10"
            :max-files="50"
          />

          <!-- Métadonnées communes -->
          <div v-if="files.length > 0" class="space-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Informations communes (Optionnel)
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">Titre par défaut</label>
                <input v-model="batchInfo.title" type="text" placeholder="Ex: Sortie pédagogique..." class="field-slim" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">Texte alternatif (Alt text)</label>
                <input v-model="batchInfo.alt_text" type="text" placeholder="Description pour l'accessibilité..." class="field-slim" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5 flex-1">
                <label class="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">Date de prise de vue</label>
                <input v-model="batchInfo.taken_at" type="date" class="field-slim" />
              </div>
              <div class="flex items-center gap-2 pt-6">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="batchInfo.is_published" class="sr-only peer">
                  <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
                  <span class="ml-3 text-xs font-medium text-gray-600 dark:text-gray-400">Publier immédiatement</span>
                </label>
              </div>
            </div>
            
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">Légende / Description</label>
              <textarea v-model="batchInfo.caption" rows="2" placeholder="Description courte appliquée à toutes les photos..." class="field-slim resize-none"></textarea>
            </div>
          </div>
          
          <!-- Infos -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-violet-50 dark:bg-violet-950/20 rounded-2xl border border-violet-100 dark:border-violet-900/40">
            <div class="flex items-start gap-3">
              <InformationCircleIcon class="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 class="text-sm font-bold text-violet-900 dark:text-violet-100">Directives d'importation</h4>
                <p class="text-xs text-violet-700 dark:text-violet-300 mt-1 leading-relaxed">
                  Sélectionnez jusqu'à 50 images (JPG, PNG, WEBP). <br>
                  Taille maximale autorisée : 10 Mo par fichier.
                </p>
              </div>
            </div>
            
            <div class="flex flex-col items-center bg-white dark:bg-gray-900 px-6 py-3 rounded-xl border border-violet-100 dark:border-violet-800 shadow-sm">
              <div class="text-2xl font-black text-violet-600 dark:text-violet-400">{{ files.length }}</div>
              <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sélectionnées</div>
            </div>
          </div>

          <!-- Action -->
          <div class="flex justify-center pt-4">
            <button 
              @click="envoyer" 
              :disabled="files.length === 0 || loading" 
              class="btn-primary-large"
            >
              <svg v-if="loading" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              <CloudArrowUpIcon v-else class="w-5 h-5" />
              {{ loading ? 'Envoi en cours…' : "Lancer l'importation" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Photos existantes -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
        <div class="flex items-center justify-between mb-6 border-b border-gray-50 dark:border-gray-800 pb-4">
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Photos existantes</h2>
            <p class="text-xs text-gray-400 dark:text-gray-500">Gérez les images déjà présentes dans cet album.</p>
          </div>
          <div class="text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
            Total : <span class="text-violet-600">{{ existingPhotos.length }}</span>
          </div>
        </div>

        <div v-if="loadingPhotos" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600"></div>
        </div>

        <div v-else-if="existingPhotos.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-400">Aucune photo dans cet album.</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="photo in existingPhotos" :key="photo.id" class="flex flex-col">
            <div class="group relative aspect-square rounded-[5px] overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
              <img
                :src="photo.file_url || (config.app_dev_storage_url + '/storage/' + photo.file_path)"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <!-- Edit Title -->
                <button @click="editPhotoTitle(photo)" class="w-8 h-8 rounded-[5px] bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-colors shadow-lg" title="Modifier le titre">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>

                <!-- Toggle Publication -->
                <button @click="togglePublish(photo)" :class="photo.is_published ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'" class="w-8 h-8 rounded-[5px] text-white flex items-center justify-center transition-colors shadow-lg" :title="photo.is_published ? 'Passer en brouillon' : 'Publier'">
                  <svg v-if="photo.is_published" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057-5.064-7-9.542-7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>

                <button @click="confirmDelete(photo.id)" class="w-8 h-8 rounded-[5px] bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg" title="Supprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <div v-if="!photo.is_published" class="absolute top-2 left-2 px-1.5 py-0.5 rounded-[5px] bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                Brouillon
              </div>
              <div v-else class="absolute top-2 left-2 px-1.5 py-0.5 rounded-[5px] bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                Publié
              </div>
            </div>
            <div class="mt-2 px-1 min-h-[1.5rem]">
              <p v-if="photo.title" class="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate" :title="photo.title">
                {{ photo.title }}
              </p>
              <p v-else class="text-[9px] italic text-gray-400">Sans titre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Édition Titre (Headless UI) -->
    <TransitionRoot appear :show="showEditTitleModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showEditTitleModal = false">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-md" aria-hidden="true" @click="showEditTitleModal = false"/>
        </TransitionChild>
        
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
            <DialogPanel class="w-full max-w-md bg-white dark:bg-gray-900 rounded-[5px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-6 py-5 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <DialogTitle class="text-lg font-black text-gray-900 dark:text-white">Modifier le titre</DialogTitle>
                <button @click="showEditTitleModal = false" class="p-2 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="p-6 space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Titre de la photo</label>
                  <input 
                    v-model="editForm.title" 
                    type="text" 
                    placeholder="Entrez un titre..." 
                    class="w-full px-5 py-4 rounded-[5px] bg-gray-50 dark:bg-gray-800 border-2 border-transparent text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:border-violet-600/30 focus:ring-4 focus:ring-violet-600/5 transition-all outline-none"
                    @keyup.enter="saveEditedTitle"
                  />
                </div>

                <div class="flex justify-end gap-3">
                  <button @click="showEditTitleModal = false" class="px-6 py-3 rounded-[5px] font-bold text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Annuler</button>
                  <button 
                    @click="saveEditedTitle" 
                    :disabled="!editForm.title || savingTitle" 
                    class="flex items-center gap-2 px-6 py-3 rounded-[5px] bg-violet-600 text-white text-sm font-black tracking-widest uppercase hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <svg v-if="savingTitle" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                      <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    {{ savingTitle ? 'Enregistrement...' : 'Sauvegarder' }}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { CloudArrowUpIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from "@headlessui/vue";
import { useGalerieStore } from "~~/stores/galerie";
import { useToast } from "primevue/usetoast";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const galerieStore = useGalerieStore();
const config = useRuntimeConfig().public;

const albumId = route.params.id;
const album = ref({});
const files = ref([]);
const existingPhotos = ref([]);
const loading = ref(false);
const loadingInitial = ref(true);
const loadingPhotos = ref(false);
const showEditTitleModal = ref(false);
const savingTitle = ref(false);
const editingPhoto = ref(null);
const editForm = ref({ title: "" });

const batchInfo = ref({
  title: "",
  caption: "",
  taken_at: "",
  is_published: true,
  alt_text: ""
});

onMounted(async () => {
  try {
    const data = await galerieStore.fetchAlbumById(albumId);
    if (data) album.value = data;
    await loadExistingPhotos();
  } catch (error) {
    console.error("Erreur chargement album:", error);
    router.push("/galerie");
  } finally {
    loadingInitial.value = false;
  }
});

const loadExistingPhotos = async () => {
  loadingPhotos.value = true;
  try {
    existingPhotos.value = await galerieStore.fetchPhotos(albumId);
  } finally {
    loadingPhotos.value = false;
  }
};

const envoyer = async () => {
  if (files.value.length === 0) return;

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("gallery_album_id", albumId);
    
    // Ajout des métadonnées communes
    if (batchInfo.value.title) formData.append("title", batchInfo.value.title);
    if (batchInfo.value.caption) formData.append("caption", batchInfo.value.caption);
    if (batchInfo.value.alt_text) formData.append("alt_text", batchInfo.value.alt_text);
    if (batchInfo.value.taken_at) formData.append("taken_at", batchInfo.value.taken_at);
    formData.append("is_published", batchInfo.value.is_published ? "1" : "0");
    
    files.value.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    await galerieStore.addPhotos(formData);
    
    await Swal.fire({
      title: "Importation réussie !",
      text: `${files.value.length} photo(s) ont été ajoutées à l'album.`,
      icon: "success",
      confirmButtonColor: "#7c3aed"
    });

    files.value = [];
    await loadExistingPhotos(); // Refresh the list
    // Ne pas rediriger immédiatement pour permettre de voir le résultat
    // router.push(`/galerie?album=${albumId}`);
  } catch (error) {
    console.error("Erreur envoi photos:", error);
    toast.add({ severity: "error", summary: "Erreur", detail: "Échec de l'importation", life: 3000 });
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async (photoId) => {
  const result = await Swal.fire({
    title: "Supprimer cette photo ?",
    text: "Cette action est irréversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await galerieStore.deletePhoto(photoId);
      existingPhotos.value = existingPhotos.value.filter(p => p.id !== photoId);
      toast.add({ severity: "success", summary: "Succès", detail: "Photo supprimée", life: 3000 });
    } catch (error) {
      toast.add({ severity: "error", summary: "Erreur", detail: "Échec de la suppression", life: 3000 });
    }
  }
};

const togglePublish = async (photo) => {
  const newStatus = !photo.is_published;
  
  const result = await Swal.fire({
    title: newStatus ? "Publier cette photo ?" : "Passer en brouillon ?",
    text: newStatus 
      ? "La photo sera visible par tous les utilisateurs." 
      : "La photo ne sera plus visible publiquement.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: newStatus ? "#10b981" : "#f59e0b",
    cancelButtonColor: "#6b7280",
    confirmButtonText: newStatus ? "Oui, publier" : "Oui, dépublier",
    cancelButtonText: "Annuler",
    reverseButtons: true
  });

  if (!result.isConfirmed) return;

  try {
    await galerieStore.updatePhoto(photo.id, { 
      is_published: newStatus,
      gallery_album_id: photo.gallery_album_id || albumId 
    });
    photo.is_published = newStatus;
    toast.add({ 
      severity: "success", 
      summary: "Succès", 
      detail: newStatus ? "Photo publiée avec succès" : "Photo passée en brouillon", 
      life: 3000 
    });
  } catch (error) {
    toast.add({ severity: "error", summary: "Erreur", detail: "Impossible de modifier le statut de la photo", life: 4000 });
  }
};

const editPhotoTitle = (photo) => {
  editingPhoto.value = photo;
  editForm.value.title = photo.title || "";
  showEditTitleModal.value = true;
};

const saveEditedTitle = async () => {
  if (!editForm.value.title || !editingPhoto.value || savingTitle.value) return;

  savingTitle.value = true;
  try {
    await galerieStore.updatePhoto(editingPhoto.value.id, { 
      title: editForm.value.title,
      gallery_album_id: editingPhoto.value.gallery_album_id || albumId
    });
    editingPhoto.value.title = editForm.value.title;
    showEditTitleModal.value = false;
    toast.add({ severity: "success", summary: "Succès", detail: "Titre mis à jour", life: 3000 });
  } catch (error) {
    toast.add({ severity: "error", summary: "Erreur", detail: "Échec de la mise à jour du titre", life: 3000 });
  } finally {
    savingTitle.value = false;
  }
};
</script>

<style scoped>
@reference "~/assets/css/main.css";

.btn-ghost {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
    text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}

.btn-primary-large {
  @apply inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-violet-600 text-white font-bold
    hover:bg-violet-700 shadow-xl shadow-violet-200 dark:shadow-none transition-all active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto;
}

.field-slim {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 
    text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 
    transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600;
}
</style>
