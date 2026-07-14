<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/publications/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Publications
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Actualités</span>
    </div>

    <!-- Titre et bouton -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Actualités</h1>
      
      <NuxtLink
        to="/publications/infos-urgentes/nouvelle"
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow-md"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nouvelle actualité
      </NuxtLink>
    </div>

    <!-- Tableau des Actualités -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden relative" :class="{ 'opacity-60 pointer-events-none': isLoading }">
      <!-- Loading indicator -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actualité
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Destinataires
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fichiers
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="urgentInfos.length === 0 && !isLoading">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                  <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-1">Aucune actualité</h3>
                  <p class="text-gray-500 mb-6">Partagez des informations importantes avec votre communauté</p>
                  <NuxtLink to="/publications/infos-urgentes/nouvelle" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    Créer la première actualité
                  </NuxtLink>
                </div>
              </td>
            </tr>

            <tr v-for="info in urgentInfos" :key="info.id" class="hover:bg-gray-50/80 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="relative flex-shrink-0">
                    <img v-if="info.image" :src="info.image" class="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm" alt="Image">
                    <div v-else class="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-semibold text-gray-900 mb-0.5 truncate max-w-[200px]">
                      {{ info.title }}
                    </h4>
                    <p class="text-xs text-gray-500 line-clamp-1">
                      {{ info.summary || 'Pas de description' }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  info.target_audience === 'all' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  info.target_audience === 'students' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  info.target_audience === 'group' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
                ]">
                  {{ 
                    info.target_audience === 'all' ? 'Tous' :
                    info.target_audience === 'students' ? 'Étudiants' :
                    info.target_audience === 'teachers' ? 'Enseignants' :
                    info.target_audience === 'administration' ? 'Administration' :
                    `Groupe: ${info.target_group?.nom || '-'}`
                  }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="toggleStatus(info)"
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all hover:scale-105',
                    info.is_published 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="info.is_published ? 'bg-green-500' : 'bg-gray-400'"></span>
                  {{ info.is_published ? 'En ligne' : 'Brouillon' }}
                </button>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center -space-x-2 overflow-hidden" v-if="info.attachments?.length">
                  <div 
                    v-for="(att, idx) in info.attachments" 
                    :key="idx"
                    class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    :title="att.name"
                    @click="window.open(att.url, '_blank')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <span v-if="info.attachments.length > 3" class="flex-shrink-0 w-8 h-8 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-[10px] font-medium text-gray-500">
                    +{{ info.attachments.length - 3 }}
                  </span>
                </div>
                <span v-else class="text-xs text-gray-400 italic">Aucun</span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal(info)" class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Modifier">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="openDeleteModal(info)" class="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Supprimer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 z-[100] overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-100">
          <form @submit.prevent="saveUrgentInfo" class="flex flex-col h-full">
            <!-- Header -->
            <div class="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <h3 class="text-xl font-bold text-gray-900">{{ modalTitle }}</h3>
              <button type="button" @click="closeModal" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
              <!-- Titre -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  Titre de l'actualité <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Ex: Réunon pédagogique..."
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
                    <option value="all">Tous (Utilisateurs & Étudiants)</option>
                    <option value="students">Tous les étudiants</option>
                    <option value="teachers">Tous les enseignants</option>
                    <option value="administration">Administration uniquement</option>
                    <option value="group">Un groupe spécifique</option>
                  </select>
                </div>
                <div class="space-y-1.5" v-if="form.target_audience === 'group'">
                  <label class="text-sm font-semibold text-gray-700">Sélectionner le groupe</label>
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
                <label class="text-sm font-semibold text-gray-700">Image de couverture (Optionnelle)</label>
                <div @click="triggerImageInput" class="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                  <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload">
                  
                  <div v-if="form.imagePreview" class="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img :src="form.imagePreview" class="w-full h-full object-contain" />
                    <button @click.stop="removeImage" class="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-all scale-0 group-hover:scale-100">
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

              <!-- Message -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Contenu de l'actualité</label>
                <textarea
                  v-model="form.summary"
                  rows="4"
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  placeholder="Écrivez votre message ici..."
                ></textarea>
              </div>

              <!-- Fichiers joints -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-semibold text-gray-700">Pièces jointes</label>
                  <button type="button" @click="triggerAttachmentInput" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Ajouter des fichiers
                  </button>
                  <input ref="attachmentInput" type="file" multiple class="hidden" @change="handleAttachmentUpload">
                </div>

                <div v-if="form.attachments.length" class="space-y-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div v-for="(att, idx) in form.attachments" :key="idx" class="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 group">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-gray-900 truncate">{{ att.name }}</p>
                        <p class="text-[10px] text-gray-500">{{ formatFileSize(att.size) }}</p>
                      </div>
                    </div>
                    <button type="button" @click="removeAttachment(idx)" class="p-1 text-gray-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Options de publication -->
              <div class="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    form.is_published ? 'bg-indigo-600' : 'bg-gray-300'
                  ]"
                >
                  <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', form.is_published ? 'translate-x-6' : 'translate-x-1']" />
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <button type="button" @click="closeModal" class="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors">
                Annuler
              </button>
              <button 
                type="submit" 
                class="px-8 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                :disabled="isLoading"
              >
                <div v-if="isLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                {{ form.id ? 'Mettre à jour' : (form.is_published ? 'Publier maintenant' : 'Enregistrer brouillon') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/50 transition-opacity" @click="closeDeleteModal"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-gray-100">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 mb-6 ring-8 ring-rose-50/50">
            <svg class="h-8 w-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
          <p class="text-sm text-gray-500 mb-8 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer l'actualité <span class="font-bold text-gray-800">"{{ infoToDelete?.title }}"</span> ? Cette opération est irréversible.
          </p>
        </div>
        <div class="flex gap-3">
          <button @click="closeDeleteModal" class="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Annuler
          </button>
          <button @click="confirmDelete" class="flex-1 px-4 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useUrgentInfoStore } from '~~/stores/urgent-info';
import { useGroupeStore } from '~~/stores/group';

const { $toastr, $swal } = useNuxtApp();
const urgentInfoStore = useUrgentInfoStore();
const groupStore = useGroupeStore();

// Données réactives
const showModal = ref(false);
const showDeleteModal = ref(false);
const modalTitle = ref('');
const dragover = ref(false);
const fileInput = ref(null);
const imageInput = ref(null);
const attachmentInput = ref(null);
const infoToDelete = ref(null);

const urgentInfos = computed(() => urgentInfoStore.urgentinfos);
const groups = computed(() => groupStore.groupes);
const isLoading = computed(() => urgentInfoStore.isLoading);

// Formulaire
const form = ref({
  id: null,
  title: '',
  summary: '',
  publishedAt: '',
  image: null,
  imagePreview: null,
  attachments: [], // Array of objects {file, name, size}
  target_audience: 'all',
  target_group_id: null,
  is_published: false,
});

// Charger les données
onMounted(async () => {
  await Promise.all([
    urgentInfoStore.fetchUrgentInfos(),
    groupStore.fetchGroups()
  ]);
});

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formater la taille du fichier
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Gestion des fichiers
const triggerFileInput = () => {
  fileInput.value?.click();
};

const triggerImageInput = () => {
  imageInput.value?.click();
};

const triggerAttachmentInput = () => {
  attachmentInput.value?.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
       $toastr.error('Veuillez sélectionner une image');
       return;
    }
    form.value.image = file;
    form.value.imagePreview = URL.createObjectURL(file);
  }
};

const handleAttachmentUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (file.size > 20 * 1024 * 1024) {
      $toastr.warning(`Le fichier ${file.name} est trop volumineux (max 20MB)`);
      return;
    }
    form.value.attachments.push({
      file,
      name: file.name,
      size: file.size
    });
  });
};

const removeAttachment = (index) => {
  form.value.attachments.splice(index, 1);
};

const removeImage = () => {
  if (form.value.imagePreview) URL.revokeObjectURL(form.value.imagePreview);
  form.value.image = null;
  form.value.imagePreview = null;
};

// Modals
const openAddModal = () => {
  modalTitle.value = "Nouvelle actualité";
  form.value = {
    id: null,
    title: '',
    summary: '',
    publishedAt: new Date().toISOString().slice(0, 16),
    image: null,
    imagePreview: null,
    attachments: [],
    target_audience: 'all',
    target_group_id: null,
    is_published: true
  };
  showModal.value = true;
};

const openEditModal = (info) => {
  modalTitle.value = "Modifier l'actualité";
  form.value = {
    id: info.id,
    title: info.title,
    summary: info.summary || '',
    publishedAt: info.publishedAt ? new Date(info.publishedAt).toISOString().slice(0, 16) : '',
    image: null, // On ne modifie pas l'image existante à moins d'en uploader une nouvelle
    imagePreview: info.image || null,
    attachments: info.attachments ? info.attachments.map(a => ({ name: a.name, size: a.size, url: a.url, isExisting: true })) : [],
    target_audience: info.targetAudience || 'all',
    target_group_id: info.targetGroup?.id || null,
    is_published: info.is_published
  };
  showModal.value = true;
};

const openDeleteModal = (info) => {
  infoToDelete.value = info;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  removeImage();
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  infoToDelete.value = null;
};

// Sauvegarder
const saveUrgentInfo = async () => {
  if (!form.value.title.trim()) {
    $toastr.warning('Le titre est obligatoire');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('summary', form.value.summary);
    formData.append('target_audience', form.value.target_audience);
    if (form.value.target_group_id) formData.append('target_group_id', form.value.target_group_id);
    formData.append('is_published', form.value.is_published ? '1' : '0');
    
    if (form.value.image instanceof File) {
      formData.append('image', form.value.image);
    }
    
    form.value.attachments.forEach((att, index) => {
      if (att.file instanceof File) {
        formData.append(`attachments[${index}]`, att.file);
      }
    });

    if (form.value.id) {
       await urgentInfoStore.updateUrgentInfo(form.value.id, formData);
       $toastr.success('Actualité mise à jour avec succès');
    } else {
       await urgentInfoStore.createUrgentInfo(formData);
       $toastr.success('Actualité publiée avec succès');
    }
    
    closeModal();
    await urgentInfoStore.fetchUrgentInfos(); // Raffraîchir
  } catch (error) {
    $toastr.error('Une erreur est survenue lors de l\'enregistrement');
    console.error(error);
  }
};

const confirmDelete = async () => {
  if (infoToDelete.value) {
    try {
      await urgentInfoStore.deleteUrgentInfo(infoToDelete.value.id);
      $toastr.success('Actualité supprimée');
      closeDeleteModal();
    } catch (error) {
      $toastr.error('Erreur lors de la suppression');
    }
  }
};

const toggleStatus = async (info) => {
  try {
    if (info.is_published) {
      await urgentInfoStore.unPublishUrgentInfo(info.id);
      $toastr.success('Actualité dépubliée');
    } else {
      await urgentInfoStore.publishUrgentInfo(info.id);
      $toastr.success('Actualité publiée');
    }
    await urgentInfoStore.fetchUrgentInfos();
  } catch (error) {
    $toastr.error('Erreur lors du changement de statut');
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styles pour le tableau */
table {
  min-width: 100%;
}

th {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td, th {
  padding: 1rem 1.5rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:last-child {
  border-bottom: none;
}

/* Animation pour le drag & drop */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dragover-animation {
  animation: pulse 2s infinite;
}

/* Styles pour les boutons d'action */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}
</style>