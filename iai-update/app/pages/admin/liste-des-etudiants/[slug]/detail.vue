<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Groupes', to: '/' },
        { label: 'Étudiants', to: '/admin/liste-des-etudiants' },
        { label: studentName, to: null },
      ]"
      :title="studentName"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Loading -->
    <div v-if="etudiantStore.isLoading" class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="etudiantStore.error"
      class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
    >
      <p class="text-gray-600 dark:text-gray-400">Étudiant non trouvé</p>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="etudiantStore.etudiant" class="max-w-7xl mx-auto">
      <!-- En-tête avec actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold text-xl overflow-hidden"
            >
              <img 
                v-if="etudiantStore.etudiant.image" 
                :src="etudiantStore.etudiant.image" 
                class="w-full h-full object-cover"
                alt="Profile"
              />
              <span v-else>{{ initials }}</span>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ etudiantStore.etudiant.prenom }}
                {{ etudiantStore.etudiant.nom }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ etudiantStore.etudiant.matricule }} •
                {{ etudiantStore.etudiant.email }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
      >
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'info'"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200',
                activeTab === 'info'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              Informations
            </button>
            <button
              @click="activeTab = 'releves'"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200',
                activeTab === 'releves'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              Relevés de notes
            </button>
            <button
              @click="activeTab = 'dossier'"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200',
                activeTab === 'dossier'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              Dossier (Album)
            </button>
          </nav>
        </div>

        <!-- Contenu des onglets -->
        <div class="p-6">
          <!-- Onglet Informations -->
          <div v-if="activeTab === 'info'">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Colonne principale -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Informations personnelles -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Informations personnelles
                  </h2>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Nom
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.nom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Prénom
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.prenom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Genre
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.genre || "-" }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Nationalité
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.nationalite || "-" }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Email
                      </p>
                      <p
                        class="text-sm text-gray-900 dark:text-white mt-1 break-all"
                      >
                        {{ etudiantStore.etudiant.email }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Téléphone
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.tel || "-" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Dates -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Dates
                  </h2>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Date de naissance
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{
                          etudiantStore.etudiant.date_naissance
                            ? formatDate(etudiantStore.etudiant.date_naissance)
                            : "-"
                        }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Année d'admission
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.annee_admission || "-" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne latérale -->
              <div class="space-y-6">
                <!-- Parcours actuel -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Parcours actuel
                  </h2>
                  <div
                    v-if="etudiantStore.etudiant.dernier_groupe"
                    class="space-y-3"
                  >
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Groupe
                      </p>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                      >
                        {{ etudiantStore.etudiant.dernier_groupe.group.nom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Niveau
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.dernier_groupe.niveau.nom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Filière
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.dernier_groupe.filiere.nom }}
                      </p>
                    </div>
                  </div>
                  <p v-else class="text-sm text-gray-500 dark:text-gray-400">
                    Aucun groupe assigné
                  </p>
                </div>

                <!-- Lieux -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Lieux
                  </h2>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Lieu de naissance
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.lieu_naissance || "-" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Relevés de notes -->
          <div v-if="activeTab === 'releves'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                Relevés de notes
              </h2>
              <Can action="create-releve">
                <button
                  @click="openReleveModal"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Nouveau relevé
                </button>
              </Can>
            </div>

            <!-- Liste des relevés -->
            <div class="space-y-3">
              <template v-if="relevenoteStore.releves.length > 0">
                <div
                  v-for="releve in relevenoteStore.releves"
                  :key="releve.id"
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">
                        Relevé de notes - {{ releve.periode }}
                      </h3>
                      <div class="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>Année : {{ releve.annee_scolaire }}</span>
                        <span>•</span>
                        <span>{{ releve.periode }}</span>
                        <span>•</span>
                        <span>Généré le : {{ formatDate(releve.date_generation) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="deleteReleve(releve.id)"
                      class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      title="Supprimer le relevé"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button
                      @click="
                        activeReleve = releve;
                        showPreviewModal = true;
                      "
                      class="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                      title="Prévisualiser et télécharger"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </template>
              <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div class="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucun relevé généré</h3>
                <p class="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                  Il n'y a pas encore de relevé de notes pour cet étudiant. Commencez par en générer un.
                </p>
                <button
                  @click="openReleveModal"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Générer le premier relevé
                </button>
              </div>
            </div>
          </div>

          <!-- Onglet Dossier (Album) -->
          <div v-if="activeTab === 'dossier'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                Dossier de l'étudiant
              </h2>
            </div>

            <div v-if="etudiantStore.etudiant.album" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="(label, key) in documentLabels" 
                :key="key"
                v-show="etudiantStore.etudiant.album[key]"
                class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300"
              >
                <!-- Preview / Icon Area -->
                <div class="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="isImage(etudiantStore.etudiant.album[key])"
                    :src="getFileUrl(etudiantStore.etudiant.album[key])" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt="Document preview"
                  />
                  <div v-else class="flex flex-col items-center gap-2">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-xs font-medium text-gray-500 uppercase">{{ getFileExtension(etudiantStore.etudiant.album[key]) }}</span>
                  </div>
                </div>

                <!-- Info and Actions -->
                <div class="p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-sm font-semibold text-gray-800 dark:text-white truncate pr-2">
                      {{ label }}
                    </h3>
                  </div>
                  
                  <div class="flex gap-2 mt-4">
                    <a 
                      :href="getFileUrl(etudiantStore.etudiant.album[key])" 
                      target="_blank"
                      class="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-400/30 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      Voir
                    </a>
                    <a 
                      :href="getFileUrl(etudiantStore.etudiant.album[key])" 
                      download
                      class="flex items-center justify-center p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-400/30"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
               <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <p class="text-gray-500 dark:text-gray-400">Aucun document n'a été fourni par cet étudiant.</p>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal de modification -->
    <TransitionRoot appear :show="showEditModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEditModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Modifier les informations
                </DialogTitle>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                    <input v-model="editForm.nom" type="text" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                    <input v-model="editForm.prenom" type="text" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                    <input v-model="editForm.tel" type="text" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button @click="closeEditModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Annuler</button>
                  <button @click="saveEdit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Enregistrer</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de désactivation -->
    <TransitionRoot appear :show="showDisableModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDisableModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="flex items-center gap-3 text-red-600 mb-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <DialogTitle class="text-lg font-medium text-gray-900 dark:text-white">Désactiver le compte</DialogTitle>
                </div>

                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Êtes-vous sûr de vouloir désactiver le compte de {{ studentName }} ? Cette action peut être réversible.</p>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motif (optionnel)</label>
                  <textarea v-model="disableReason" rows="3" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" placeholder="Raison de la désactivation..."></textarea>
                </div>

                <div class="flex justify-end gap-3">
                  <button @click="closeDisableModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Annuler</button>
                  <button @click="confirmDisable" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Désactiver</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de prévisualisation du relevé -->
    <TransitionRoot appear :show="showPreviewModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showPreviewModal = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="flex justify-between items-center mb-6">
                  <DialogTitle
                    class="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    Prévisualisation du relevé
                  </DialogTitle>
                  <div class="flex gap-3">
                    <button
                      @click="downloadCurrentPDF"
                      class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Télécharger PDF
                    </button>
                    <button
                      @click="showPreviewModal = false"
                      class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-900 rounded-xl p-8 max-h-[70vh] overflow-y-auto border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div class="bg-white text-black shadow-2xl mx-auto p-10 min-h-[297mm] w-[210mm] origin-top transform scale-[0.8] md:scale-100">
                    <div v-if="currentReleve" id="releve-content">
                      <div style="text-align: center; margin-bottom: 20px">
                        <div v-if="currentReleve.logo_url || parametreStore.getAppLogo" style="margin-bottom: 10px;">
                          <img :src="currentReleve.logo_url || parametreStore.getAppLogo" alt="Logo" style="height: 80px; object-fit: contain; margin: 0 auto;">
                        </div>
                        <h1 style="color: #4f46e5; font-size: 24px; font-weight: bold; text-transform: uppercase; margin: 0;">{{ parametreStore.getParamValue('nom_de_etablissement') || 'UNIVERSITÉ EXCELLENCE' }}</h1>
                        <p style="color: #666; font-size: 12px; margin: 5px 0">---------- Excellence et Innovation ----------</p>
                      </div>

                      <div style="text-align: center; margin-bottom: 30px">
                        <h2 style="font-size: 20px; font-weight: bold; color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 5px; display: inline-block; padding-left: 30px; padding-right: 30px; margin: 0;">RELEVÉ DE NOTES</h2>
                      </div>

                      <div style="margin-bottom: 30px; background: #f9fafb; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px;">
                        <table style="width: 100%; border-collapse: collapse">
                          <tr>
                            <td style="padding: 5px; width: 50%">
                              <span style="color: #666; font-size: 12px">Nom et Prénoms :</span>
                              <span style="font-weight: bold; color: #111; margin-left: 10px; font-size: 14px;">{{ studentName }}</span>
                            </td>
                            <td style="padding: 5px">
                              <span style="color: #666; font-size: 12px">Matricule :</span>
                              <span style="font-weight: bold; color: #111; margin-left: 10px; font-size: 14px;">{{ etudiantStore.etudiant?.matricule }}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 5px">
                              <span style="color: #666; font-size: 12px">Niveau :</span>
                              <span style="font-weight: bold; color: #111; margin-left: 10px; font-size: 14px;">{{ etudiantStore.etudiant?.dernier_groupe?.niveau?.nom || "-" }}</span>
                            </td>
                            <td style="padding: 5px">
                              <span style="color: #666; font-size: 12px">Filière :</span>
                              <span style="font-weight: bold; color: #111; margin-left: 10px; font-size: 14px;">{{ etudiantStore.etudiant?.dernier_groupe?.filiere?.nom || "-" }}</span>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <div style="margin-bottom: 20px; text-align: center">
                        <p style="font-size: 14px; margin: 0">
                          <span style="font-weight: bold">Année académique :</span> {{ currentReleve.annee_scolaire }} •
                          <span style="font-weight: bold">{{ currentReleve.periode }}</span>
                        </p>
                      </div>

                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px">
                        <thead>
                          <tr style="background-color: #4f46e5">
                            <th style="border: 1px solid #3730a3; padding: 10px; text-align: left; color: white; font-weight: bold;">Matières</th>
                            <th style="border: 1px solid #3730a3; padding: 10px; text-align: center; color: white; font-weight: bold;">Devoir</th>
                            <th style="border: 1px solid #3730a3; padding: 10px; text-align: center; color: white; font-weight: bold;">Examen</th>
                            <th style="border: 1px solid #3730a3; padding: 10px; text-align: center; color: white; font-weight: bold;">Moy.</th>
                            <th style="border: 1px solid #3730a3; padding: 10px; text-align: center; color: white; font-weight: bold;">Crédit</th>
                            <th style="border: 1px solid #3730a3; padding: 10px; text-align: center; color: white; font-weight: bold;">Points</th>
                            <th style="border: 1px solid #3730a3; padding: 10px; text-align: center; color: white; font-weight: bold;">Mentions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(uv, index) in currentUVs" :key="index">
                            <td style="border: 1px solid #d1d5db; padding: 8px">{{ uv.nom }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">{{ uv.devoir }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">{{ uv.examen }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center; font-weight: bold;">{{ uv.note }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">{{ uv.credits }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center; font-weight: bold;">{{ uv.note_ponderee }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">{{ uv.mention }}</td>
                          </tr>
                        </tbody>
                        <tfoot style="background-color: #f3f4f6">
                          <tr>
                            <td colspan="4" style="border: 1px solid #d1d5db; padding: 10px; text-align: right; font-weight: bold;">Totaux :</td>
                            <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; font-weight: bold;">{{ currentReleve.total_coefficients }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; font-weight: bold;">{{ currentReleve.total_notes_ponderees }}</td>
                            <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; font-weight: bold;">-</td>
                          </tr>
                          <tr>
                            <td colspan="5" style="border: 1px solid #d1d5db; padding: 10px; text-align: right; font-weight: bold;">Moyenne générale :</td>
                            <td colspan="2" style="border: 1px solid #d1d5db; padding: 10px; text-align: center; font-weight: bold; font-size: 16px; color: #4f46e5;">{{ currentReleve.moyenne_generale }} / 20</td>
                          </tr>
                        </tfoot>
                      </table>

                      <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="font-size: 12px; color: #666; padding-top: 20px;">
                          <p style="margin-bottom: 5px;">Total crédits : <span style="font-weight: bold; color: #111;">{{ currentReleve.total_credits_valides }} / {{ (parseInt(currentReleve.total_credits_valides) + parseInt(currentReleve.total_credits_non_valides)) }}</span></p>
                          <p>Décision : <span style="font-weight: bold; color: #111; font-size: 14px;">{{ parseFloat(currentReleve.moyenne_generale) >= 10 ? 'Admis' : 'Ajourné' }}</span></p>
                        </div>
                        <div style="text-align: center; min-width: 280px;">
                          <p style="font-size: 14px; margin-bottom: 50px;">Fait à Lomé, le {{ formatDate(currentReleve.date_generation) }}</p>
                          <p style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">{{ parametreStore.getParamValue('titre_du_directeur_des_etudes') || 'Le Directeur des Études' }}</p>
                          <div style="margin-top: 10px;">
                            <p style="font-weight: bold; font-size: 16px;">{{ parametreStore.getParamValue('nom_complet_du_directeur_des_etudes') || '' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500">
                      <p>Données du relevé indisponibles...</p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de sélection de relevé -->
    <TransitionRoot appear :show="showReleveModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeReleveModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Générer un relevé de notes
                </DialogTitle>

                <div class="space-y-4">
                  <Dropdown
                    v-model="form.periode_id"
                    :options="periodeOptions"
                    optionLabel="label"
                    optionValue="value"
                    filter
                    showClear
                    placeholder="Sélectionner une période"
                    class="w-full"
                  />
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button
                    @click="closeReleveModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    @click="generateReleveDeNote"
                    :disabled="isGenerating"
                    class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2"
                    :class="[
                      isGenerating ? 'bg-indigo-400 cursor-not-allowed' : 
                      selectedReleveExists ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'
                    ]"
                  >
                    <svg v-if="isGenerating" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isGenerating ? 'Génération...' : (selectedReleveExists ? 'Prévisualiser' : 'Générer') }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useEtudiantStore } from "~~/stores/etudiant";
import { usePeriodeStore } from "~~/stores/periode";
import { useReleveNoteStore } from "~~/stores/relevenote";
import { useParametreStore } from "~~/stores/parametre";
import config from "~~/config";

const periodeStore = usePeriodeStore();
const relevenoteStore = useReleveNoteStore();
const parametreStore = useParametreStore();

// Import dynamique de html2pdf avec fallback
let html2pdf = null;

if (process.client) {
  import("html2pdf.js")
    .then((module) => {
      html2pdf = module.default;
    })
    .catch((err) => {
      console.error("Erreur chargement html2pdf:", err);
    });
}

const route = useRoute();
const { $toastr, $swal } = useNuxtApp();
const etudiantStore = useEtudiantStore();

// Référence pour le template de relevé
const releveTemplate = ref(null);

const form = ref({
  periode_id: "",
});

const selectedAnnee = computed(() => {
  const p = periodeStore.periodes.find(p => p.id === form.value.periode_id);
  return p ? p.annee_scolaire_id : null;
});

const selectedPeriode = computed(() => form.value.periode_id);

// État
const isGenerating = ref(false);
const activeTab = ref("info");
const showEditModal = ref(false);
const showDisableModal = ref(false);
const showReleveModal = ref(false);
const showPreviewModal = ref(false);
const activeReleve = ref(null);
const disableReason = ref("");

// Formulaire d'édition
const editForm = ref({
  nom: "",
  prenom: "",
  tel: "",
});

// Formulaire de relevé
const releveForm = ref({
  annee: "2023-2024",
  semestre: "Semestre 1",
});

// Mapping des documents
const documentLabels = {
  lettre: "Lettre de demande",
  naissance: "Acte de naissance",
  diplome: "Diplôme principal",
  nationalite: "Nationalité",
  photo: "Photo d'identité",
  certificat_medical: "Certificat médical",
  cv: "CV",
  lettre_motivation: "Lettre de motivation",
  releve_bac1_path: "Relevé BAC 1",
  releve_bac2_path: "Relevé BAC 2",
};

// Computed
const studentName = computed(() => {
  if (!etudiantStore.etudiant) return "";
  return `${etudiantStore.etudiant.nom} ${etudiantStore.etudiant.prenom}`;
});

const initials = computed(() => {
  if (!etudiantStore.etudiant) return "?";
  const prenom = etudiantStore.etudiant.prenom || "";
  const nom = etudiantStore.etudiant.nom || "";
  return (prenom.charAt(0) + nom.charAt(0)).toUpperCase() || "?";
});

const selectedReleveId = ref(null);

const currentReleve = computed(() => {
  return activeReleve.value;
});

const selectedReleveExists = computed(() => {
  if (!form.value.periode_id) return false;
  return relevenoteStore.releves.find(r => r.periode_id === form.value.periode_id);
});

const currentUVs = computed(() => {
  if (!currentReleve.value || !currentReleve.value.ues) return [];
  const uvs = [];
  currentReleve.value.ues.forEach((ue) => {
    if (ue.uvs) {
      ue.uvs.forEach((uv) => {
        uvs.push({
          nom: uv.nom,
          devoir: uv.devoir || "0.00",
          examen: uv.examen || "0.00",
          note: uv.moyenne_uv,
          note_ponderee: uv.note_ponderee || "0.00",
          credits: uv.coefficient,
          mention: getMention(uv.moyenne_uv),
        });
      });
    }
  });
  return uvs;
});

const totalCoefficients = computed(() => {
  return currentUVs.value.reduce((acc, uv) => acc + parseFloat(uv.credits || 0), 0);
});

const totalPoints = computed(() => {
  return currentUVs.value.reduce((acc, uv) => acc + parseFloat(uv.note_ponderee || 0), 0).toFixed(2);
});

const getMention = (note) => {
  const n = parseFloat(note);
  if (n >= 16) return "Très Bien";
  if (n >= 14) return "Bien";
  if (n >= 12) return "Assez Bien";
  if (n >= 10) return "Passable";
  return "Ajourné";
};

const currentDate = computed(() => {
  return new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

// Fonctions utilitaires
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

const getFileUrl = (path) => {
  if (!path) return null;
  const baseUrl = process.dev ? config.app_dev_storage_url : config.app_prod_storage_url;
  return `${baseUrl}/${path}`;
};

const isImage = (path) => {
  if (!path) return false;
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(path);
};

const getFileExtension = (path) => {
  if (!path) return "";
  return path.split(".").pop().toUpperCase();
};

// Gestion des modales
const openEditModal = () => {
  if (etudiantStore.etudiant) {
    editForm.value = {
      nom: etudiantStore.etudiant.nom || "",
      prenom: etudiantStore.etudiant.prenom || "",
      tel: etudiantStore.etudiant.tel || "",
    };
    showEditModal.value = true;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const saveEdit = () => {
  // Logique de sauvegarde
  $toastr.success("Informations mises à jour");
  closeEditModal();
};

const openDisableModal = () => {
  showDisableModal.value = true;
};

const closeDisableModal = () => {
  showDisableModal.value = false;
  disableReason.value = "";
};

const confirmDisable = () => {
  $toastr.warning(
    `Compte désactivé${disableReason.value ? " : " + disableReason.value : ""}`,
  );
  closeDisableModal();
};

const openReleveModal = () => {
  showReleveModal.value = true;
};

const closeReleveModal = () => {
  showReleveModal.value = false;
  releveForm.value = {
    annee: "2023-2024",
    semestre: "Semestre 1",
  };
};

const generateReleveDeNote = async () => {
  if (!form.value.periode_id) {
    $toastr.error("Veuillez sélectionner une période");
    return;
  }

  isGenerating.value = true;
  
  if (selectedReleveExists.value) {
    activeReleve.value = selectedReleveExists.value;
    showPreviewModal.value = true;
    closeReleveModal();
    isGenerating.value = false;
    return;
  }

  // Afficher un loading Swal
  $swal.fire({
    title: 'Génération en cours...',
    text: 'Calcul des moyennes et des crédits en cours.',
    allowOutsideClick: false,
    didOpen: () => {
      $swal.showLoading();
    }
  });

  try {
    const newReleve = await relevenoteStore.GenererReleveNotes(
      route.params.slug,
      {
        annee_scolaire_id: selectedAnnee.value,
        periode_id: selectedPeriode.value
      }
    );
    
    $swal.close();
    $toastr.success("Relevé de notes calculé avec succès");
    closeReleveModal();

    if (newReleve) {
      activeReleve.value = newReleve;
      showPreviewModal.value = true;
    }
  } catch (error) {
    $swal.close();
    $toastr.error("Erreur lors de la génération du relevé");
  } finally {
    isGenerating.value = false;
  }
};

const downloadCurrentPDF = async () => {
  if (currentReleve.value) {
    await generatePDF(currentReleve.value);
  }
};

// Génération de PDF pour un relevé existant
const generatePDF = async (releve) => {
  if (!html2pdf) {
    $toastr.error("Bibliothèque de génération PDF non disponible");
    return;
  }

  try {
    selectedReleveId.value = releve.id;
    releveForm.value.annee = releve.annee_scolaire;
    releveForm.value.semestre = releve.periode;

    // Attendre que le DOM soit mis à jour avec les nouvelles données de selectedReleveId
    await nextTick();

    const element = document.getElementById("releve-content");
    if (!element) {
      $toastr.error("Élément du relevé non trouvé");
      return;
    }

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `releve_${etudiantStore.etudiant?.matricule || "etudiant"}_${releve.periode}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(element).save();
    $toastr.success("Relevé généré avec succès");
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    $toastr.error("Erreur lors de la génération du PDF");
  }
};

const deleteReleve = async (id) => {
  const result = await $swal.fire({
    title: 'Supprimer ce relevé ?',
    text: "Cette action est irréversible et supprimera également toutes les validations (UE/UV) associées.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
  });

  if (result.isConfirmed) {
    try {
      await relevenoteStore.deleteReleveNote(id);
      $toastr.success("Relevé supprimé avec succès");
      if (activeReleve.value?.id === id) {
        showPreviewModal.value = false;
        activeReleve.value = null;
      }
    } catch (error) {
      $swal.fire({
        title: 'Erreur',
        text: "Une erreur est survenue lors de la suppression.",
        icon: 'error'
      });
    }
  }
};

const periodeOptions = computed(() =>
  periodeStore.periode.map((p) => {
    const exists = relevenoteStore.releves.some(r => r.periode_id === p.id);
    return {
      label: exists ? `${p.nom} (Déjà généré)` : p.nom,
      value: p.id,
      isGenerated: exists
    };
  }),
);

// Chargement initial
onMounted(async () => {
  await etudiantStore.fetchEtudiant(route.params.slug);
  await periodeStore.fetchPeriodeByYear();
  await relevenoteStore.getReleveNotes(route.params.slug);
  await parametreStore.fetchParametres();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}

/* Styles spécifiques pour le PDF */
.releve-pdf {
  background: white;
  font-family: Arial, sans-serif;
}

.releve-pdf table {
  border-collapse: collapse;
  width: 100%;
}

.releve-pdf th {
  background-color: #4f46e5;
  color: white;
  padding: 10px;
  text-align: left;
  border: 1px solid #3730a3;
}

.releve-pdf td {
  padding: 8px;
  border: 1px solid #d1d5db;
}

.releve-pdf tfoot td {
  background-color: #f3f4f6;
  font-weight: bold;
}
</style>
