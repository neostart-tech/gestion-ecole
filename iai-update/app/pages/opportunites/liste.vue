<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Opportunités', to: null },
      ]"
      title="Liste des opportunités"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div
      class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
    >
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <!-- Filtre par type de contrat -->
      <Dropdown
        v-model="typeContratFilter"
        :options="typeContratOptions"
        optionLabel="label"
        optionValue="value"
        filter
        showClear
        placeholder="Filtrer par type de contrat"
        class="w-full lg:w-48"
      />

      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Colonnes -->
        <client-only>
          <VDropdown placement="bottom-end">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Colonnes
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <template #popper>
              <div
                class="w-56 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800"
              >
                <div
                  v-for="col in columns"
                  :key="col.field"
                  class="flex items-center gap-2 py-1"
                >
                  <input
                    type="checkbox"
                    v-model="col.visible"
                    :disabled="col.field === 'action'"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ col.title }}
                  </span>
                </div>
              </div>
            </template>
          </VDropdown>
        </client-only>

        <!-- Boutons d'action -->
        <div class="flex gap-2">
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <!-- Loader -->
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="rows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <!-- Statut avec toggle exactement comme votre exemple -->
          <template #published="data">
            <div class="flex items-center justify-center">
              <!-- Si déjà publié -->
              <div
                v-if="data.value.published.published === 1"
                class="flex items-center"
              >
                <button
                  class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-100 dark:bg-green-900/30 focus:ring-green-300 cursor-default"
                  title="Déjà publié (irréversible)"
                  disabled
                >
                  <span
                    class="translate-x-8 bg-green-500 dark:bg-green-600 inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                  ></span>
                </button>
                <span
                  class="ml-3 text-sm font-medium text-green-700 dark:text-green-300"
                >
                  
                </span>
              </div>

              <!-- Si non publié -->
              <div v-else class="flex items-center">
                <button
                  @click="togglePublish(data.value)"
                  class="relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 dark:bg-gray-800/40 focus:ring-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Cliquer pour publier"
                >
                  <span
                    class="translate-x-1 bg-gray-500 dark:bg-gray-600 inline-block w-5 h-5 transform rounded-full shadow-sm transition-all duration-200"
                  ></span>
                </button>
                <span
                  class="ml-3 text-sm font-medium text-red-700 dark:text-red-300"
                >
                  
                </span>
              </div>
            </div>
          </template>
11
          <!-- Actions -->
          <template #action="data">
            <div class="flex justify-center gap-3">
              <!-- View -->
              <button
                class="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                @click="openViewModal(data.value)"
                title="Voir détails"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>

              <!-- Edit -->
              <button
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                @click="openEditModal(data.value)"
                title="Modifier"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M4 20h4l10-10-4-4L4 16v4z"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <!-- Delete -->
              <button
                class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                @click="confirmDelete(data.value)"
                title="Supprimer"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M3 6h18M8 6v14m8-14v14M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- CREATE/EDIT MODAL -->
    <TransitionRoot appear :show="showEditModal" as="template">
      <Dialog
        as="div"
        class="relative z-50"
        @close="() => (showEditModal = false)"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
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
              <DialogPanel
                class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all"
              >
                <!-- Header -->
                <div
                  class="px-6 py-6 flex items-center justify-between"
                  style="background-color: #4f39f6"
                >
                  <h2 class="text-xl font-bold text-white">
                    {{
                      editForm.id
                        ? "Modifier l'opportunité"
                        : "Créer une opportunité"
                    }}
                  </h2>
                  <button
                    @click="showEditModal = false"
                    class="text-white hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Content -->
                <form
                  @submit.prevent="submitForm"
                  class="overflow-y-auto p-6"
                  style="max-height: calc(90vh - 100px)"
                >
                  <div class="space-y-5">
                    <!-- Annonceur -->
                    <div>
                      <label
                        class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                        >Annonceur *</label
                      >
                      <Dropdown
                        v-model="editForm.advertiser_id"
                        :options="advertisersOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Sélectionner un annonceur"
                        class="w-full"
                        required
                      />
                    </div>

                    <!-- Titre -->
                    <div>
                      <label
                        class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                        >Titre *</label
                      >
                      <input
                        v-model="editForm.title"
                        type="text"
                        placeholder="Titre de l'opportunité"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <!-- Type d'annonce et Type de contrat -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                          >Type d'annonce *</label
                        >
                        <Dropdown
                          v-model="editForm.type_annonce"
                          :options="typeAnnonceOptions"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Sélectionner"
                          class="w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                          >Type de contrat *</label
                        >
                        <Dropdown
                          v-model="editForm.type_contrat"
                          :options="typeContratOptions"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Sélectionner"
                          class="w-full"
                          required
                          @change="onTypeContratChange"
                        />
                      </div>
                    </div>

                    <!-- Ville -->
                    <div>
                      <label
                        class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                        >Ville</label
                      >
                      <input
                        v-model="editForm.ville"
                        type="text"
                        placeholder="Ville (optionnel - sera défini par l'annonceur si vide)"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <!-- Durée (si CDD) -->
                    <div
                      v-if="
                        editForm.type_contrat === 'Contrat à Durée Déterminée'
                      "
                    >
                      <label
                        class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                        >Durée (CDD) *</label
                      >
                      <input
                        v-model="editForm.duration"
                        type="text"
                        placeholder="ex: 3 mois, 6 mois..."
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <!-- Contenu -->
                    <div>
                      <label
                        class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                      >
                        Contenu {{ !editForm.file_path ? "*" : "" }}
                      </label>
                      <Editor
                        api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
                        v-model="editForm.content"
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
                    </div>

                    <!-- Fichier -->
                    <div>
                      <label
                        class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                      >
                        Document/Fichier {{ !editForm.content ? "*" : "" }}
                      </label>

                      <!-- Fichier actuel (si en modification) -->
                      <div v-if="editForm.id && editForm.filepath" class="mb-4">
                        <div
                          class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                        >
                          <svg
                            class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div class="flex-1 min-w-0">
                            <p
                              class="text-xs font-medium text-blue-900 dark:text-blue-100 uppercase"
                            >
                              Fichier actuel
                            </p>
                            <p
                              class="text-sm text-blue-700 dark:text-blue-300 truncate font-medium"
                            >
                              {{ editForm.filepath.split("/").pop() }}
                            </p>
                          </div>
                          <button
                            type="button"
                            @click="editForm.filepath = null"
                            class="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                        <p
                          class="text-xs text-gray-600 dark:text-gray-400 mt-2"
                        >
                          Sélectionnez un nouveau fichier pour le remplacer
                        </p>
                      </div>

                      <!-- Zone de téléchargement de fichier -->
                      <div
                        class="relative"
                        @dragover.prevent="dragover = true"
                        @dragleave.prevent="dragover = false"
                        @drop.prevent="handleFileDrop"
                      >
                        <input
                          ref="fileInput"
                          type="file"
                          @change="onFileSelect"
                          class="hidden"
                        />
                        <div
                          :class="[
                            'relative flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-all',
                            dragover
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50',
                          ]"
                        >
                          <svg
                            class="w-10 h-10 mb-2"
                            :class="
                              dragover
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-400 dark:text-gray-500'
                            "
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <button
                            type="button"
                            @click="$refs.fileInput.click()"
                            class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            Cliquez pour sélectionner
                          </button>
                          <p
                            class="text-xs text-gray-600 dark:text-gray-400 mt-2"
                          >
                            ou glissez-déposez votre fichier ici
                          </p>
                        </div>
                      </div>

                      <!-- Aperçu du fichier sélectionné -->
                      <div v-if="editForm.file_path" class="mt-3">
                        <div
                          class="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                          <svg
                            class="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <span
                            class="text-sm text-green-700 dark:text-green-300 font-medium"
                          >
                            {{ editForm.file_path.name }}
                          </span>
                          <span
                            class="text-xs text-green-600 dark:text-green-400 ml-auto"
                          >
                            {{ (editForm.file_path.size / 1024).toFixed(2) }} KB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div
                    class="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex justify-end gap-3"
                  >
                    <button
                      type="button"
                      @click="showEditModal = false"
                      class="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      {{ editForm.id ? "Modifier" : "Créer" }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- VIEW DETAILS MODAL -->
    <TransitionRoot appear :show="showViewModal" as="template">
      <Dialog
        as="div"
        class="relative z-50"
        @close="() => (showViewModal = false)"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
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
              <DialogPanel
                class="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all"
              >
                <!-- Header -->
                <div class="px-6 py-6 flex items-center justify-between">
                  <h2 class="text-xl font-bold">
                    {{ selectedAnnonce.title_detail }}
                  </h2>
                  <button
                    @click="showViewModal = false"
                    class="text-white hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Content -->
                <div
                  class="overflow-y-auto p-6"
                  style="max-height: calc(90vh - 140px)"
                >
                  <!-- Infos principales -->
                  <div class="grid grid-cols-2 gap-4 mb-6">
                    <div
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50"
                    >
                      <p
                        class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1"
                      >
                        Type d'annonce
                      </p>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ selectedAnnonce.type_annonce || "—" }}
                      </p>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50"
                    >
                      <p
                        class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1"
                      >
                        Type de contrat
                      </p>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ selectedAnnonce.type_contrat || "—" }}
                      </p>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50"
                    >
                      <p
                        class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1"
                      >
                        Ville
                      </p>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ selectedAnnonce.ville || "—" }}
                      </p>
                    </div>
                    <div
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50"
                    >
                      <p
                        class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1"
                      >
                        Statut
                      </p>
                      <span
                        :class="[
                          'text-xs font-semibold px-2 py-1 rounded',
                          selectedAnnonce.status === 'Publié' || selectedAnnonce.published === 1 || selectedAnnonce.published === true
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800',
                        ]"
                      >
                        {{ selectedAnnonce.status === 'Publié' || selectedAnnonce.published === 1 || selectedAnnonce.published === true ? 'Publié' : 'Brouillon' }}
                      </span>
                    </div>
                  </div>

                  <!-- Durée si CDD -->
                  <div v-if="selectedAnnonce.duration" class="mb-6">
                    <h3
                      class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2"
                    >
                      Durée
                    </h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                      {{ selectedAnnonce.duration }}
                    </p>
                  </div>

                  <!-- Annonceur -->
                  <div class="mb-6">
                    <h3
                      class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3"
                    >
                      Annonceur
                    </h3>
                    <div
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50"
                    >
                      <div class="space-y-2 text-sm">
                        <div>
                          <p class="text-gray-600 dark:text-gray-400">Nom</p>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ selectedAnnonce.advertiser || "—" }}
                          </p>
                        </div>
                        <div>
                          <p class="text-gray-600 dark:text-gray-400">Ville</p>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ selectedAnnonce.ville || "—" }}
                          </p>
                        </div>
                        <div v-if="selectedAnnonce.advertiser?.email">
                          <p class="text-gray-600 dark:text-gray-400">Email</p>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ selectedAnnonce.advertiser.email }}
                          </p>
                        </div>
                        <div v-if="selectedAnnonce.advertiser?.tel">
                          <p class="text-gray-600 dark:text-gray-400">
                            Téléphone
                          </p>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ selectedAnnonce.advertiser.tel }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Contenu -->
                  <div v-if="selectedAnnonce.content" class="mb-6">
                    <h3
                      class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3"
                    >
                      Description
                    </h3>
                    <div
                      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50 text-sm prose dark:prose-invert prose-sm max-w-none"
                      v-html="selectedAnnonce.content"
                    ></div>
                  </div>

                  <!-- Fichier -->
                  <div v-if="selectedAnnonce.filepath" class="mb-6">
                    <h3
                      class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3"
                    >
                      Fichier
                    </h3>
                    <a
                      :href="selectedAnnonce.filepath"
                      target="_blank"
                      class="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7a1 1 0 11-2 0 1 1 0 012 0zM4.5 20H19a2 2 0 002-2V9a2 2 0 00-2-2h-3.278l-1.957-6.26A2 2 0 0010.5 0h-7a2 2 0 00-1.965 2.74L2.75 7H.5a2 2 0 00-2 2v9a2 2 0 002 2z"
                        />
                      </svg>
                      Télécharger le document
                    </a>
                  </div>
                </div>

                <!-- Footer -->
                <div
                  class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end gap-3"
                >
                  <button
                    @click="showViewModal = false"
                    class="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Fermer
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
import { ref, computed, onMounted } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Dropdown from "primevue/dropdown";
import Editor from "@tinymce/tinymce-vue";

import { useAnnonceStore } from "~~/stores/annonce";
import { useAdvertiserStore } from "~~/stores/adverstiser";
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const annonceStore = useAnnonceStore();
const advertiserStore = useAdvertiserStore();
const { $toastr } = useNuxtApp();

// Références
const showEditModal = ref(false);
const showViewModal = ref(false);
const searchQuery = ref("");
const typeContratFilter = ref(null);
const itemsPerPage = ref(10);
const loading = ref(true);

const editForm = ref({
  id: null,
  advertiser_id: null,
  type_annonce: null,
  type_contrat: null,
  title: "",
  ville: "",
  content: "",
  filepath: null,
  duration: "",
});

const selectedAnnonce = ref({});
const fileInput = ref(null);
const dragover = ref(false);

// Colonnes de la table - CHANGEZ ICI pour utiliser 'published' au lieu de 'status'
const columns = ref([
  { field: "title", title: "Titre", sortable: true, visible: true },
  { field: "advertiser", title: "Annonceur", sortable: true, visible: true },
  {
    field: "type_contrat",
    title: "Type de contrat",
    sortable: true,
    visible: false,
  },
  {
    field: "type_annonce",
    title: "Type d'annonce",
    sortable: true,
    visible: false,
  },
  { field: "published", title: "Statut", sortable: true, visible: true }, // Changé de 'status' à 'published'
  { field: "action", title: "Actions", sortable: false, visible: true },
]);

const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Options pour les dropdowns
const typeAnnonceOptions = [
  { label: "Plein temps", value: "Plein temps" },
  { label: "Temps partiel", value: "Temps partiel" },
  { label: "Télétravail", value: "Télétravail" },
];

const typeContratOptions = [
  { label: "Contrat à Durée Déterminée", value: "Contrat à Durée Déterminée" },
  {
    label: "Contrat à Durée Indéterminée",
    value: "Contrat à Durée Indéterminée",
  },
  { label: "Alternance", value: "Alternance" },
];

const advertisersOptions = computed(() =>
  (advertiserStore.advertisers || []).map((a) => ({
    label: a.nom,
    value: a.slug,
  })),
);

// Rows de la table - AJOUTEZ published ici
const rows = computed(() => {
  const filtered = typeContratFilter.value
    ? annonceStore.annonces.filter(
        (a) => a.type_contrat === typeContratFilter.value,
      )
    : annonceStore.annonces;

  return filtered.map((a, i) => ({
    ...a,
    index: i + 1,
    title: a.title?.slice(0, 30) + "..." || a.titre?.slice(0, 30) + "..." || "--",
    title_detail: a.title || a.titre || "--",
    advertiser: a.advertiser?.nom || "--",
    advertiser_id: a.advertiser?.slug || null,
    type_contrat: a.type_contrat || "--",
    type_annonce: a.type_annonce || "--",
    published: {
      published: a.status ? 1 : 0, // Adapté pour votre template
      status: a.status ? "Publié" : "Brouillon",
      slug: a.slug,
      title_detail: a.title || a.titre || "--",
    },
    duration: a.duration || null,
  }));
});

// Fonctions
const openCreateModal = () => {
  editForm.value = {
    id: null,
    advertiser_id: null,
    type_annonce: null,
    type_contrat: null,
    title: "",
    ville: "",
    content: "",
    filepath: null,
    duration: "",
  };
  showEditModal.value = true;
};

const openEditModal = (annonce) => {
  console.log("Opening edit modal for annonce:", annonce);

  editForm.value = {
    id: annonce.id,
    slug: annonce.slug,
    advertiser_id: annonce.advertiser_id || null,
    type_annonce: annonce.type_annonce || null,
    type_contrat: annonce.type_contrat || annonce.type || null,
    title: annonce.title_detail || annonce.title || "",
    ville: annonce.ville || "",
    content: annonce.content || "",
    filepath: annonce.filepath || null,
    duration: annonce.duration || "",
  };

  showEditModal.value = true;
};

const openViewModal = (annonce) => {
  selectedAnnonce.value = annonce;
  console.log("Selected Annonce:", selectedAnnonce.value);
  showViewModal.value = true;
};

const onFileSelect = (event) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file) {
    editForm.value.file_path = file;
  }
  dragover.value = false;
};

const handleFileDrop = (event) => {
  dragover.value = false;
  const file = event.dataTransfer.files?.[0];
  if (file) {
    editForm.value.file_path = file;
  }
};

const onTypeContratChange = () => {
  if (editForm.value.type_contrat !== "Contrat à Durée Déterminée") {
    editForm.value.duration = "";
  }
};

const togglePublish = async (annonceData) => {
  const { $swal } = useNuxtApp();
  
  const result = await $swal.fire({
    title: "Publier l'opportunité ?",
    text: `Voulez-vous publier "${annonceData.title_detail || annonceData.title}" ? Cette action est irréversible.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, publier",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      await annonceStore.PublierAnnonce(annonceData.slug);
      $toastr.success("Opportunité publiée avec succès");
      await annonceStore.fetchAnnonces();
    } catch (error) {
      console.error("Erreur publication:", error);
      $toastr.error("Impossible de publier l'opportunité");
    }
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    formData.append("advertiser_id", editForm.value.advertiser_id);
    formData.append("type_annonce", editForm.value.type_annonce);
    formData.append("type_contrat", editForm.value.type_contrat);
    formData.append("title", editForm.value.title);
    formData.append("ville", editForm.value.ville || "");
    formData.append("content", editForm.value.content || "");
    if (editForm.value.duration) {
      formData.append("duration", editForm.value.duration);
    }
    if (editForm.value.file_path instanceof File) {
      formData.append("file_path", editForm.value.file_path);
    }

    if (editForm.value.id) {
      await annonceStore.updateAnnonce(editForm.value.slug, formData);
    } else {
      await annonceStore.addAnnonce(formData);
    }

    showEditModal.value = false;
    await annonceStore.fetchAnnonces();
    $toastr.success("Enrégistrement effectué avec succès");
  } catch (error) {
    console.error("Erreur:", error);
    $toastr.error(error?.message || "Erreur lors de l'opération");
  }
};

const confirmDelete = async (annonce) => {
  const { $swal } = useNuxtApp();
  const result = await $swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous supprimer "${annonce.title_detail || annonce.title}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      await annonceStore.deleteAnnonce(annonce.slug);
      $toastr.success("Opportunité supprimée avec succès");
      await annonceStore.fetchAnnonces();
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error("Impossible de supprimer l'opportunité");
    }
  }
};

// Chargement initial
onMounted(async () => {
  try {
    loading.value = true;
    await annonceStore.fetchAnnonces();
    await advertiserStore.fetchAdvertisers();
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement");
  } finally {
    loading.value = false;
  }
});
</script>