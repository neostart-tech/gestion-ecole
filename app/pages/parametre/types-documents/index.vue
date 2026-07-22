<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Types de Documents', to: null },
      ]"
      title="Catalogue des Documents"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <div class="relative w-full lg:w-64">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un document..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
        <div class="absolute left-3 top-2.5 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>

      <Can action="create-type-document">
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/></svg>
          Ajouter un type
        </button>
      </Can>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
      <div v-if="isLoading && !documents.length" class="flex justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="documents"
          :search="searchQuery"
          :per-page="10"
          skin="bh-table-striped"
          class="w-full"
        >
          <template #nom_affichage="{ value }">
             <div class="font-medium text-gray-900 dark:text-white">{{ value.nom_affichage }}</div>
             <div class="text-[11px] text-gray-500 font-mono">{{ value.document_key }}</div>
          </template>

          <template #is_photo="{ value }">
             <span v-if="value.is_photo" class="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">Oui (Photo Profil)</span>
             <span v-else class="text-xs text-gray-400">-</span>
          </template>

          <template #is_multiple="{ value }">
             <span v-if="value.is_multiple" class="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md">Multiple</span>
             <span v-else class="text-xs text-gray-400">Unique</span>
          </template>

          <template #accepted_formats="{ value }">
             <span v-if="value.accepted_formats === 'image'" class="text-xs font-bold px-2 py-1 bg-sky-100 text-sky-700 rounded-md">Images (JPG, PNG)</span>
             <span v-else-if="value.accepted_formats === 'pdf'" class="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-md">Document (PDF)</span>
             <span v-else class="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-700 rounded-md">Tous formats</span>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <Can action="update-type-document">
                <button @click="openEditModal(value)" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </Can>
              <Can action="delete-type-document">
                <button @click="deleteDocument(value.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal Form -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-xl transform overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all border border-gray-100 dark:border-gray-700">
              <DialogTitle class="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white mb-6">
                <div class="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                {{ form.id ? 'Modifier le document' : 'Nouveau type' }}
              </DialogTitle>

              <form @submit.prevent="saveDocument" class="space-y-6">
                <div class="space-y-1">
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">Nom affiché</label>
                  <p class="text-[11px] text-gray-500 mb-2">Le nom qui sera visible par les étudiants.</p>
                  <input v-model="form.nom_affichage" @input="autoSlug" type="text" placeholder="Ex: Acte de Naissance" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-900 transition-colors shadow-sm" />
                </div>
                <div class="space-y-1">
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">Clé système</label>
                  <p class="text-[11px] text-gray-500 mb-2">Identifiant unique sans espace (généré automatiquement).</p>
                  <input v-model="form.document_key" type="text" placeholder="Ex: acte_naissance" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-900 transition-colors font-mono text-sm shadow-sm" />
                </div>
                
                <div class="space-y-1">
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">Format de fichier accepté</label>
                  <p class="text-[11px] text-gray-500 mb-2">Restreint les fichiers que les étudiants peuvent sélectionner.</p>
                  <div class="grid grid-cols-3 gap-2">
                    <label class="flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all" :class="form.accepted_formats === 'all' ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'">
                      <input type="radio" v-model="form.accepted_formats" value="all" class="hidden" />
                      <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                      <span class="text-[10px] font-bold uppercase tracking-wider">Tout type</span>
                    </label>
                    <label class="flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all" :class="form.accepted_formats === 'pdf' ? 'border-rose-500 bg-rose-50/50 text-rose-700 dark:border-rose-500 dark:bg-rose-900/20 dark:text-rose-400 ring-1 ring-rose-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'">
                      <input type="radio" v-model="form.accepted_formats" value="pdf" class="hidden" />
                      <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      <span class="text-[10px] font-bold uppercase tracking-wider">PDF Only</span>
                    </label>
                    <label class="flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all" :class="form.accepted_formats === 'image' ? 'border-sky-500 bg-sky-50/50 text-sky-700 dark:border-sky-500 dark:bg-sky-900/20 dark:text-sky-400 ring-1 ring-sky-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'">
                      <input type="radio" v-model="form.accepted_formats" value="image" class="hidden" />
                      <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span class="text-[10px] font-bold uppercase tracking-wider">Images</span>
                    </label>
                  </div>
                </div>
                
                <div class="pt-2 space-y-3">
                  <label class="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors" :class="{'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800': form.is_multiple}">
                    <div class="flex items-center h-5 mt-0.5">
                      <input v-model="form.is_multiple" type="checkbox" class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-gray-900 dark:text-white">Fichiers multiples</span>
                      <span class="text-[11px] text-gray-500 leading-tight">Autorise l'étudiant à télécharger plusieurs fichiers pour cette catégorie (ex: Bulletins).</span>
                    </div>
                  </label>

                  <div class="flex flex-col gap-1">
                    <label class="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors" :class="{'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': form.is_photo}">
                      <div class="flex items-center h-5 mt-0.5">
                        <input v-model="form.is_photo" type="checkbox" class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-600" />
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-900 dark:text-white">Photo de Profil Système</span>
                        <span class="text-[11px] text-gray-500 leading-tight">Définit ce document comme l'avatar officiel de l'étudiant.</span>
                      </div>
                    </label>
                    <div v-if="form.is_photo" class="flex items-center gap-1.5 px-2 mt-1">
                      <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span class="text-[10px] text-amber-600 font-medium">Ce choix désactivera l'option sur les autres documents.</span>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button type="button" @click="closeModal" class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Annuler</button>
                  <button type="submit" :disabled="isSaving" class="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                    <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {{ form.id ? 'Enregistrer les modifications' : 'Créer le document' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { useNuxtApp } from '#app';

const { $axios, $swal } = useNuxtApp();
const toast = useToast();

const documents = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const showModal = ref(false);
const searchQuery = ref("");

const form = ref({ id: null, nom_affichage: "", document_key: "", is_multiple: false, is_photo: false, accepted_formats: 'all' });
let manuallyEditedKey = false;

const columns = [
  { field: "nom_affichage", title: "Document", sort: true },
  { field: "accepted_formats", title: "Format", sort: true },
  { field: "is_photo", title: "Photo Profil", sort: true },
  { field: "is_multiple", title: "Type Fichier", sort: true },
  { field: "action", title: "Actions", sort: false, headerClass: "text-center" },
];

const authHeaders = () => {
  const token = localStorage.getItem("gest-ecole-token");
  return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
};

const fetchDocuments = async () => {
  isLoading.value = true;
  try {
    const res = await $axios.get('/document-types', authHeaders());
    documents.value = res.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les documents', life: 3000 });
  } finally {
    isLoading.value = false;
  }
};

const generateSlug = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') : "";

const autoSlug = () => {
  if (!form.value.id && !manuallyEditedKey) {
    form.value.document_key = generateSlug(form.value.nom_affichage);
  }
};

const openAddModal = () => {
  form.value = { id: null, nom_affichage: "", document_key: "", is_multiple: false, is_photo: false, accepted_formats: 'all' };
  manuallyEditedKey = false;
  showModal.value = true;
};

const openEditModal = (doc) => {
  form.value = { ...doc, is_multiple: !!doc.is_multiple, is_photo: !!doc.is_photo, accepted_formats: doc.accepted_formats || 'all' };
  manuallyEditedKey = true;
  showModal.value = true;
};

const closeModal = () => showModal.value = false;

const saveDocument = async () => {
  isSaving.value = true;
  try {
    if (form.value.id) {
      await $axios.put(`/document-types/${form.value.id}`, form.value, authHeaders());
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Document modifié', life: 3000 });
    } else {
      await $axios.post('/document-types', form.value, authHeaders());
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Document créé', life: 3000 });
    }
    closeModal();
    fetchDocuments();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Erreur lors de la sauvegarde', life: 3000 });
  } finally {
    isSaving.value = false;
  }
};

const deleteDocument = async (id) => {
  const res = await $swal.fire({
    title: "Supprimer ce type ?",
    text: "Cela supprimera le type uniquement s'il n'est exigé nulle part.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#ef4444"
  });

  if (res.isConfirmed) {
    try {
      await $axios.delete(`/document-types/${id}`, authHeaders());
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Document supprimé', life: 3000 });
      fetchDocuments();
    } catch (error) {
      $swal.fire("Erreur", error.response?.data?.message || "Impossible de supprimer", "error");
    }
  }
};

onMounted(() => fetchDocuments());
</script>
