<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Paramètres', to: '#' },
        { label: 'Niveaux Scolaires', to: null },
      ]"
      title="Gestion des niveaux scolaires"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <!-- Recherche -->
      <div class="relative w-full lg:w-64">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un niveau..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div class="absolute left-3 top-2.5">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Ajouter -->
        <button
          @click="openAddModal"
          class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Ajouter un niveau
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div v-if="niveauStore.isLoading && !niveauStore.niveaux.length" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="niveauStore.niveaux"
          :search="searchQuery"
          :per-page="10"
          skin="bh-table-striped bh-table-hover"
          class="w-full"
        >
          <template #libelle="{ value }">
             <div class="flex items-center gap-3">
               <div class="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                 {{ value.code || value.libelle.substring(0, 2).toUpperCase() }}
               </div>
               <span class="font-medium text-gray-900 dark:text-white">{{ value.libelle }}</span>
             </div>
          </template>

          <template #active="{ value }">
            <button
              @click="toggleStatus(value)"
              class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
              :class="value.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'"
            >
              <span
                class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                :class="value.active ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
            <span class="ml-2 text-xs font-medium" :class="value.active ? 'text-green-600' : 'text-gray-500'">
              {{ value.active ? 'Actif' : 'Inactif' }}
            </span>
          </template>

          <template #action="{ value }">
            <div class="flex justify-center gap-2">
              <button
                v-if="isAuthorized"
                @click="openPeriodeModal(value)"
                class="p-2 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                title="Gérer les semestres"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                @click="openEditModal(value)"
                class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button
                @click="openDocumentModal(value)"
                class="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                title="Gérer les pièces jointes à fournir"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal Ajout/Edition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  {{ form.id ? 'Modifier le niveau' : 'Nouveau niveau scolaire' }}
                </DialogTitle>

                <form @submit.prevent="saveNiveau" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Libellé du niveau</label>
                    <input
                      v-model="form.libelle"
                      type="text"
                      placeholder="Ex: Licence 1, Master 2..."
                      required
                      class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Code</label>
                      <input
                        v-model="form.code"
                        type="text"
                        placeholder="Ex: L1"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Ordre</label>
                      <input
                        v-model.number="form.ordre"
                        type="number"
                        placeholder="1"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                        :class="{ 'border-amber-500 ring-amber-500': isOrderLow }"
                      />
                      <p v-if="isOrderLow && !form.id" class="text-[10px] text-amber-600 mt-1 font-medium">
                        L'ordre doit être 0 ou supérieur à {{ maxExistingOrder }}
                      </p>
                    </div>
                  </div>

                  <div v-if="!form.id" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3 items-start">
                    <svg class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p class="text-xs text-blue-700 dark:text-blue-300">
                      L'ordre définit la hiérarchie académique. Le système a suggéré l'ordre {{ nextSuggestedOrder }} basé sur vos enregistrements.
                    </p>
                  </div>

                  <div class="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      :disabled="niveauStore.isLoading"
                      class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                      <span v-if="niveauStore.isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {{ form.id ? 'Mettre à jour' : 'Enregistrer' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Document Modal -->
    <TransitionRoot appear :show="showDocModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDocModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  Pièces à fournir pour : {{ selectedNiveau?.libelle }}
                </DialogTitle>

                <!-- Liste des documents -->
                <div class="mb-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Documents actuellement exigés pour l'inscription</h3>
                  
                  <div v-if="isDocLoading" class="flex justify-center py-4">
                    <div class="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                  </div>
                  <div v-else-if="documents.length === 0" class="text-center py-6 text-gray-500 text-sm bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                    Aucun document n'est exigé pour ce niveau actuellement. Les étudiants n'auront aucune pièce à fournir.
                  </div>
                  <div v-else class="space-y-2 max-h-64 overflow-y-auto pr-2">
                    <div v-for="doc in documents" :key="doc.id" class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div class="flex items-center gap-3">
                        <span class="w-2 h-2 rounded-full mt-1 shrink-0" :class="doc.is_obligatoire ? 'bg-rose-500' : 'bg-sky-500'"></span>
                        <div>
                          <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ doc.nom_affichage }}</p>
                          <p class="text-[11px] text-gray-500 font-mono mt-0.5">Clé : {{ doc.document_key }}</p>
                          <p v-if="doc.description" class="text-[11px] text-gray-500 mt-0.5 italic">{{ doc.description }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <div class="flex flex-col gap-1 items-end">
                          <span v-if="doc.is_photo" class="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" title="Utilisé comme photo de profil">
                            Photo Profil
                          </span>
                          <span v-if="doc.is_multiple" class="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" title="Plusieurs fichiers autorisés">
                            Multiple
                          </span>
                          <span class="text-[10px] uppercase font-bold px-2 py-1 rounded-md" :class="doc.is_obligatoire ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'">
                            {{ doc.is_obligatoire ? 'Obligatoire' : 'Facultatif' }}
                          </span>
                        </div>
                        <div class="flex items-center gap-1">
                          <button @click="editDocument(doc)" class="text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 p-1.5 rounded-md transition-colors" title="Modifier">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </button>
                          <button @click="deleteDocument(doc.id)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-colors" title="Supprimer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Formulaire d'ajout / édition -->
                <form @submit.prevent="saveDocument" class="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 transition-all" :class="{'ring-2 ring-emerald-500 shadow-md': docForm.id}">
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                      {{ docForm.id ? 'Modifier l\'exigence' : 'Exiger un nouveau document' }}
                    </h3>
                    <button v-if="docForm.id" type="button" @click="cancelEdit" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline">Annuler la modification</button>
                  </div>
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Type de Document</label>
                      <Dropdown 
                        v-model="docForm.document_type_id" 
                        :options="availableDocumentTypes" 
                        optionLabel="nom_affichage" 
                        optionValue="id" 
                        placeholder="Sélectionner dans le catalogue..."
                        class="w-full !rounded-lg !border-gray-300 dark:!border-gray-700"
                        :filter="true"
                        filterPlaceholder="Rechercher..."
                      >
                        <template #option="slotProps">
                          <div class="flex flex-col">
                            <span class="font-medium text-sm">{{ slotProps.option.nom_affichage }}</span>
                            <span class="text-[10px] text-gray-500">{{ slotProps.option.is_photo ? 'Photo Profil' : (slotProps.option.is_multiple ? 'Fichiers multiples' : 'Standard') }}</span>
                          </div>
                        </template>
                      </Dropdown>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description <span class="font-normal text-gray-400">(optionnel)</span></label>
                      <textarea
                        v-model="docForm.description"
                        rows="2"
                        placeholder="Ex : Photo d'identité récente, fond blanc..."
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      ></textarea>
                      <p class="text-[11px] text-gray-500 mt-1">Affichée aux candidats sur le formulaire public, sous le nom du document.</p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between mt-4">
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <input v-model="docForm.is_obligatoire" type="checkbox" class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                        <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Pièce obligatoire</span>
                      </label>
                    </div>
                    
                    <button type="submit" :disabled="isDocSaving" class="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center gap-2 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                      <span v-if="isDocSaving" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {{ docForm.id ? 'Mettre à jour' : 'Ajouter à la liste' }}
                    </button>
                  </div>
                </form>

                <div class="flex justify-end mt-6">
                  <button type="button" @click="closeDocModal" class="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                    Terminer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Periode Modal -->
    <TransitionRoot appear :show="showPeriodeModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closePeriodeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
                <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Associer les semestres : {{ selectedNiveau?.libelle }}
                </DialogTitle>

                <div v-if="isPeriodeLoading" class="flex justify-center py-10">
                  <div class="h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
                </div>
                
                <form v-else @submit.prevent="savePeriodes" class="space-y-4">
                  <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sélectionnez les semestres concernés</label>
                    <MultiSelect
                      v-model="selectedPeriodes"
                      :options="periodeStore.periodes"
                      optionLabel="nom"
                      optionValue="id"
                      placeholder="Choisir un ou plusieurs semestres..."
                      filter
                      class="w-full !rounded-lg !border-gray-300 dark:!border-gray-700"
                      display="chip"
                    />
                  </div>

                  <div class="flex justify-end gap-3 mt-6">
                    <button type="button" @click="closePeriodeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                      Annuler
                    </button>
                    <button type="submit" :disabled="isPeriodeSaving" class="px-6 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md transition-all flex items-center gap-2">
                      <span v-if="isPeriodeSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Enregistrer
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useNiveauStore } from "~~/stores/niveau";
import { usePeriodeStore } from "~~/stores/periode";

const { $toastr, $swal, $axios } = useNuxtApp();
const niveauStore = useNiveauStore();
const periodeStore = usePeriodeStore();

const searchQuery = ref("");
const showModal = ref(false);
const showDocModal = ref(false);
const showPeriodeModal = ref(false);
const selectedNiveau = ref(null);
const documents = ref([]);
const isDocLoading = ref(false);
const isDocSaving = ref(false);
const isPeriodeLoading = ref(false);
const isPeriodeSaving = ref(false);
const selectedPeriodes = ref([]);

const isAuthorized = computed(() => {
  if (typeof localStorage === 'undefined') return false;
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userRoles = userData?.roles || [];
    const allowedRoles = [
      'directeur-general', 
      'directeur-general-adjoint',
      'directeur-academique', 
      'directeur-des-etudes',
      'informaticien'
    ];
    return userRoles.some(role => allowedRoles.includes(role.slug));
  } catch {
    return false;
  }
});

const form = ref({
  id: null,
  libelle: "",
  code: "",
  ordre: null
});

const docForm = ref({
  id: null,
  document_type_id: null,
  is_obligatoire: true,
  description: ""
});

const availableDocumentTypes = ref([]);

const columns = [
  { field: "libelle", title: "Niveau", sort: true },
  { field: "code", title: "Code", sort: true },
  { field: "ordre", title: "Ordre", sort: true },
  { field: "active", title: "Statut", sort: true },
  { field: "action", title: "Actions", sort: false, headerClass: "text-center" },
];

const maxExistingOrder = computed(() => {
  if (!niveauStore.niveaux.length) return 0;
  return Math.max(...niveauStore.niveaux.map(n => n.ordre || 0));
});

const nextSuggestedOrder = computed(() => maxExistingOrder.value + 1);

const isOrderLow = computed(() => {
  if (form.value.id) return false;
  return form.value.ordre !== null && form.value.ordre !== 0 && form.value.ordre <= maxExistingOrder.value;
});

const openAddModal = () => {
  form.value = { 
    id: null, 
    libelle: "", 
    code: "", 
    ordre: nextSuggestedOrder.value 
  };
  showModal.value = true;
};

const openEditModal = (niveau) => {
  form.value = { ...niveau };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveNiveau = async () => {
  try {
    if (form.value.id) {
      await niveauStore.updateNiveau(form.value.id, form.value);
      $toastr.success("Niveau modifié avec succès");
    } else {
      await niveauStore.addNiveau(form.value);
      $toastr.success("Niveau créé avec succès");
    }
    await niveauStore.fetchNiveaux();
    closeModal();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  }
};

const toggleStatus = async (niveau) => {
  const action = niveau.active ? "désactiver" : "activer";
  const res = await $swal.fire({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} le niveau ?`,
    text: `Voulez-vous vraiment ${action} le niveau "${niveau.libelle}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Oui, ${action}`,
    cancelButtonText: "Annuler",
    confirmButtonColor: niveau.active ? "#ef4444" : "#10b981"
  });

  if (res.isConfirmed) {
    try {
      await niveauStore.toggleNiveauStatus(niveau.id);
      await niveauStore.fetchNiveaux();
      $toastr.success(`Niveau ${niveau.active ? 'désactivé' : 'activé'} avec succès`);
    } catch (error) {
      $toastr.error("Erreur lors de la modification du statut");
    }
  }
};

const generateCode = (val) => {
  if (!val) return "";
  // Extrait les initiales de chaque mot
  const initials = val.split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .join("");
    
  // Extrait les chiffres
  const numbers = val.match(/\d+/g)?.join("") || "";
  
  // Combine initiales (sans les chiffres qui auraient pu être pris comme première lettre) + chiffres
  // On nettoie les initiales pour enlever ce qui n'est pas une lettre si besoin, 
  // mais généralement le premier caractère d'un mot suffit.
  return initials.replace(/[0-9]/g, '') + numbers;
};

watch(() => form.value.libelle, (newVal) => {
  if (!form.value.id && newVal) {
    form.value.code = generateCode(newVal);
  }
});

const generateSlug = (str) => {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
    .replace(/[^a-z0-9]/g, '_') // Remplace caractères spéciaux par _
    .replace(/_+/g, '_') // Enlève les _ multiples
    .replace(/^_|_$/g, ''); // Enlève les _ aux extrémités
};

const fetchAvailableDocumentTypes = async () => {
  try {
    const res = await $axios.get('/document-types', niveauStore.authHeaders());
    availableDocumentTypes.value = (res.data || []).map((type) => ({ ...type, id: Number(type.id) }));
  } catch (error) {
    console.error("Erreur chargement types documents", error);
  }
};

const openDocumentModal = async (niveau) => {
  selectedNiveau.value = niveau;
  showDocModal.value = true;
  await fetchDocuments();
  await fetchAvailableDocumentTypes();
};

const closeDocModal = () => {
  showDocModal.value = false;
  selectedNiveau.value = null;
  docForm.value = { id: null, document_type_id: null, is_obligatoire: true, description: "" };
};

const cancelEdit = () => {
  docForm.value = { id: null, document_type_id: null, is_obligatoire: true, description: "" };
};

const editDocument = async (doc) => {
  // On repasse d'abord par un état vide avant de réaffecter : certains composants
  // (le Dropdown PrimeVue en particulier) peuvent ne pas re-synchroniser correctement
  // leur valeur affichée si on saute directement d'une sélection à une autre dans le
  // même "tick" — le nextTick force un vrai cycle de rendu entre les deux.
  docForm.value = { id: null, document_type_id: null, is_obligatoire: true, description: "" };
  await nextTick();
  docForm.value = {
    id: doc.id,
    document_type_id: doc.document_type_id != null ? Number(doc.document_type_id) : null,
    is_obligatoire: !!doc.is_obligatoire,
    description: doc.description || ""
  };
};

const fetchDocuments = async () => {
  if (!selectedNiveau.value) return;
  isDocLoading.value = true;
  try {
    const res = await niveauStore.fetchDocumentRequirements(selectedNiveau.value.id);
    documents.value = res || [];
  } catch (error) {
    $toastr.error("Impossible de charger les documents.");
  } finally {
    isDocLoading.value = false;
  }
};

const saveDocument = async () => {
  if (!docForm.value.document_type_id) return;
  isDocSaving.value = true;
  try {
    if (docForm.value.id) {
      // Modification
      await niveauStore.updateDocumentRequirement(docForm.value.id, {
        document_type_id: docForm.value.document_type_id,
        is_obligatoire: docForm.value.is_obligatoire,
        description: docForm.value.description
      });
      $toastr.success("Exigence mise à jour avec succès !");
    } else {
      // Ajout
      await niveauStore.addDocumentRequirement(selectedNiveau.value.id, {
        document_type_id: docForm.value.document_type_id,
        is_obligatoire: docForm.value.is_obligatoire,
        description: docForm.value.description
      });
      $toastr.success("Document exigé avec succès !");
    }
    
    docForm.value = { id: null, document_type_id: null, is_obligatoire: true, description: "" };
    await fetchDocuments();
  } catch (error) {
    $toastr.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
  } finally {
    isDocSaving.value = false;
  }
};

const deleteDocument = async (id) => {
  const res = await $swal.fire({
    title: "Retirer ce document ?",
    text: "Les candidats n'auront plus à fournir ce document.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, retirer",
    cancelButtonText: "Annuler",
    confirmButtonColor: "#ef4444"
  });

  if (res.isConfirmed) {
    try {
      await niveauStore.deleteDocumentRequirement(id);
      $toastr.success("Document retiré avec succès.");
      await fetchDocuments();
    } catch (error) {
      $toastr.error("Erreur lors de la suppression.");
    }
  }
};

const openPeriodeModal = async (niveau) => {
  selectedNiveau.value = niveau;
  showPeriodeModal.value = true;
  isPeriodeLoading.value = true;
  selectedPeriodes.value = [];
  try {
    if (periodeStore.periodes.length === 0) {
      await periodeStore.fetchPeriode();
    }
    const assignedPeriodes = await niveauStore.fetchNiveauPeriodes(niveau.id);
    const assignedArray = assignedPeriodes?.data || assignedPeriodes || [];
    selectedPeriodes.value = assignedArray.map(p => p.id);
  } catch (error) {
    $toastr.error("Erreur lors du chargement des semestres.");
  } finally {
    isPeriodeLoading.value = false;
  }
};

const closePeriodeModal = () => {
  showPeriodeModal.value = false;
  selectedNiveau.value = null;
  selectedPeriodes.value = [];
};

const savePeriodes = async () => {
  if (!selectedNiveau.value) return;
  isPeriodeSaving.value = true;
  try {
    await niveauStore.assignPeriodesToNiveau(selectedNiveau.value.id, selectedPeriodes.value);
    $toastr.success("Semestres associés avec succès !");
    closePeriodeModal();
  } catch (error) {
    $toastr.error(error?.response?.data?.message || "Erreur lors de l'association.");
  } finally {
    isPeriodeSaving.value = false;
  }
};

onMounted(() => {
  niveauStore.fetchNiveaux();
});
</script>

<style scoped>
.bh-table-striped .bh-table-row:nth-child(even) {
  background-color: rgba(249, 250, 251, 0.5);
}
.dark .bh-table-striped .bh-table-row:nth-child(even) {
  background-color: rgba(31, 41, 55, 0.3);
}
</style>
