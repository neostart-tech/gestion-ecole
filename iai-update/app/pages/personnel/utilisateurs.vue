<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Membres', to: null },
      ]"
      title="Liste des membres de l'administration"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
      <!-- Recherche -->
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Rechercher..."
        class="w-full lg:w-64 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <!-- Filtre par rôle -->
      <Dropdown
        v-model="roleFilter"
        :options="rolesOptions"
        optionLabel="label"
        optionValue="value"
        filter
        showClear
        placeholder="Filtrer par rôle"
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
          <!-- <button
            @click="processExport"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Exporter les utilisateurs"
            :disabled="exportLoading"
          >
            <svg
              v-if="exportLoading"
              class="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {{ exportLoading ? 'Exportation...' : 'Exporter' }}
          </button> -->

          <!-- Import -->
          <!-- <button
            @click="openImportModal"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Importer des utilisateurs"
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
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Importer
          </button> -->

          <!-- Bouton ajouter -->
          <NuxtLink
            to="/personnel/ajouter"
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
          </NuxtLink>
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

              <NuxtLink
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                :to="`/personnel/${data.value.slug}/modifier-un-utilisateur`"
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
              </NuxtLink>

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

    <!-- MODAL MODIFICATION -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-xl p-6 overflow-y-auto"
        style="max-height: 90vh"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
            Modifier l'utilisateur
          </h2>
          <button
            class="text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="showEditModal = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitUpdate" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom *</label>
              <input v-model="editForm.nom" class="input w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénoms *</label>
              <input v-model="editForm.prenom" class="input w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                v-model="editForm.email"
                class="input w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone *</label>
              <input v-model="editForm.tel" class="input w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genre *</label>
              <select v-model="editForm.genre" class="input w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type surveillant</label>
              <select v-model="editForm.supervisor_type" class="input w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="non_surveillant">Non surveillant</option>
                <option value="interne">Interne</option>
                <option value="externe">Externe</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6">
            <button
              type="button"
              class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              @click="showEditModal = false"
            >
              Annuler
            </button>

            <button
              type="submit"
              class="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- VIEW USER DETAILS MODAL (Headless UI) -->
    <!-- USER DETAILS MODAL (SIMPLE) -->
    <TransitionRoot appear :show="showViewModal" as="template">
      <Dialog as="div" class="relative z-50" @close="() => (showViewModal = false)">
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
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                <!-- Header avec couleur personnalisée -->
                <div class="px-6 py-6 flex items-center justify-between" style="background-color: #4F39F6;">
                  <div class="flex items-center gap-4">
                    <!-- Avatar -->
                    <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <!-- Info utilisateur -->
                    <div>
                      <h2 class="text-xl font-bold text-white">{{ selectedUser.nom }} {{ selectedUser.prenom }}</h2>
                      <p class="text-slate-200 text-sm">{{ selectedUser.email }}</p>
                    </div>
                  </div>
                  <button @click="showViewModal = false" class="text-white hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-white/10">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Content -->
                <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 180px)">
                  <!-- Infos générales -->
                  <div class="mb-6">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Informations personnelles</h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Téléphone</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedUser.tel || '—' }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Genre</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedUser.genre || '—' }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Matricule</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedUser.matricule || '—' }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Type surveillant</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white capitalize">{{ selectedUser.supervisor_type || '—' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Biographie -->
                  <div v-if="selectedUser.biographie" class="mb-6">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Biographie</h3>
                    <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600/50 text-sm prose dark:prose-invert prose-sm max-w-none" v-html="selectedUser.biographie"></div>
                  </div>

                  <!-- Rôles -->
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Rôles</h3>
                    <div v-if="selectedUser.roles && selectedUser.roles.length > 0" class="space-y-2">
                      <div v-for="role in selectedUser.roles" :key="role.id" class="bg-slate-50 dark:bg-slate-700/30 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-600/50 flex items-center gap-2">
                        <svg class="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ role.nom }}</span>
                      </div>
                    </div>
                    <div v-else class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 text-center border border-gray-200 dark:border-gray-600/50">
                      Aucun rôle assigné
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end gap-3">
                  <button @click="showViewModal = false" class="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal d'importation -->
    <TransitionRoot appear :show="showImportModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeImportModal">
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
                class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- En-tête de la modale -->
                <div class="flex items-start justify-between mb-6">
                  <DialogTitle
                    class="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    Importer des utilisateurs
                  </DialogTitle>
                  <button
                    @click="closeImportModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Fermer"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Contenu de la modale -->
                <div class="space-y-4">
                  <!-- Sélection des rôles -->
                  <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                    <div class="flex items-center gap-3 mb-3">
                      <div
                        class="p-2 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg"
                      >
                        <svg
                          class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          Attribution des rôles (optionnel)
                        </p>
                        <p
                          class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        >
                          Sélectionnez les rôles à attribuer aux utilisateurs importés
                        </p>
                      </div>
                    </div>
                    
                    <!-- Liste des rôles disponibles -->
                    <div v-if="availableRoles.length > 0" class="ml-11 space-y-2 max-h-40 overflow-y-auto pr-2">
                      <div
                        v-for="role in availableRoles"
                        :key="role.id"
                        class="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          :id="`role-${role.id}`"
                          :value="role.id"
                          v-model="selectedRoles"
                          class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          :for="`role-${role.id}`"
                          class="text-sm text-gray-700 dark:text-gray-300"
                        >
                          {{ role.name }}
                        </label>
                      </div>
                    </div>
                    <div v-else class="ml-11">
                      <p class="text-sm text-gray-500 dark:text-gray-400 italic">
                        Aucun rôle disponible
                      </p>
                    </div>
                  </div>

                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg"
                      >
                        <svg
                          class="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          Format requis
                        </p>
                        <p
                          class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        >
                          Le fichier doit être au format Excel (.xlsx) avec les colonnes : 
                          Nom, Prénom, Email, Genre, Téléphone
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Zone de dépôt de fichier -->
                  <div
                    @dragover.prevent="dragOver = true"
                    @dragleave.prevent="dragOver = false"
                    @drop.prevent="handleFileDrop"
                    :class="[
                      'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                      dragOver
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400',
                    ]"
                  >
                    <input
                      type="file"
                      ref="fileInput"
                      @change="handleFileSelect"
                      accept=".xlsx,.xls"
                      class="hidden"
                    />

                    <div class="space-y-3">
                      <div
                        class="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-800/30 rounded-full flex items-center justify-center"
                      >
                        <svg
                          class="w-8 h-8 text-indigo-600 dark:text-indigo-400"
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
                      </div>

                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          Glissez-déposez votre fichier ici
                        </p>
                        <p
                          class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                        >
                          ou
                        </p>
                        <button
                          type="button"
                          @click="openFileSelector"
                          class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Parcourir les fichiers
                        </button>
                      </div>

                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Formats supportés : .xlsx, .xls (Max 10MB)
                      </p>
                    </div>
                  </div>

                  <!-- Fichier sélectionné -->
                  <div
                    v-if="selectedFile"
                    class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <svg
                          class="w-5 h-5 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ selectedFile.name }}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ formatFileSize(selectedFile.size) }}
                          </p>
                        </div>
                      </div>
                      <button
                        @click="removeFile"
                        class="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Supprimer le fichier"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Message d'erreur -->
                <div
                  v-if="importError"
                  class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-4"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5 text-red-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p class="text-red-700 dark:text-red-300 text-sm">
                      {{ importError }}
                    </p>
                  </div>
                </div>

                <!-- Footer de la modale -->
                <div
                  class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4"
                >
                  <button
                    type="button"
                    @click="closeImportModal"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    @click="processImport"
                    :disabled="!selectedFile || importLoading"
                    :class="[
                      'px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center gap-2',
                      !selectedFile || importLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
                    ]"
                  >
                    <svg
                      v-if="importLoading"
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{{ importLoading ? 'Importation...' : 'Importer' }}</span>
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
import { useUserStore } from "~~/stores/user";
import { useRoleStore } from "~~/stores/role";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

// Stores et utilitaires
const userStore = useUserStore();
const roleStore=useRoleStore();
const { $toastr } = useNuxtApp();

// Références pour l'import/export
const showImportModal = ref(false);
const selectedFile = ref(null);
const dragOver = ref(false);
const importLoading = ref(false);
const importError = ref("");
const exportLoading = ref(false);
const fileInput = ref(null);
const selectedRoles = ref([]);
const availableRoles = ref([]);

// Références existantes
const showEditModal = ref(false);
const editForm = ref({});
const showViewModal = ref(false);
const selectedUser = ref({});
const searchQuery = ref("");
const roleFilter = ref(null);
const itemsPerPage = ref(10);
const loading = ref(true);

// Colonnes de la table
const columns = ref([
  { field: "index", title: "#", sortable: true, visible: true },
  { field: "nom", title: "Nom", sortable: true, visible: true },
  { field: "prenom", title: "Prénoms", sortable: true, visible: true },
  { field: "email", title: "Email", sortable: true, visible: false },
  { field: "genre", title: "Genre", sortable: true, visible: true },
  { field: "tel", title: "Téléphone", sortable: true, visible: true },
  {
    field: "supervisor_type",
    title: "Type surveillant",
    sortable: true,
    visible: true,
  },
  { field: "action", title: "Actions", sortable: false, visible: true },
]);

// Colonnes visibles
const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Options de rôles pour le Dropdown
const rolesOptions = computed(() =>
  availableRoles.value.map((r) => ({
    label: r.nom,
    value: r.id,
  }))
);

// Rows de la table
const rows = computed(() => {
  // Filter by selected role if any
  const filtered = roleFilter.value
    ? userStore.users.filter((u) => (u.roles || []).some((r) => String(r.id) === String(roleFilter.value)))
    : userStore.users;

  return filtered.map((u, i) => ({
    ...u,
    id: u.id,
    index: i + 1,
    nom: u.nom || "--",
    prenom: u.prenom || "--",
    email: u.email || "--",
    genre: u.genre || "--",
    tel: u.tel || "--",
    supervisor_type: u.supervisor_type ?? "—",
    action: u.id, // Pour le template d'actions
  }));
});

// Fonctions utilitaires
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Fonctions d'import/export
const openImportModal = async () => {
  try {
    // Réinitialiser l'état
    selectedRoles.value = [];
    selectedFile.value = null;
    importError.value = "";
    
    // Charger les rôles disponibles
     await roleStore.fetchRoles();
    availableRoles.value = roleStore.roles || [];
    
    showImportModal.value = true;
  } catch (error) {
    console.error("Erreur chargement rôles:", error);
    $toastr.error("Erreur lors du chargement des rôles");
    // Ouvrir quand même la modale sans les rôles
    showImportModal.value = true;
  }
};

const closeImportModal = () => {
  showImportModal.value = false;
  selectedFile.value = null;
  selectedRoles.value = [];
  importError.value = "";
  dragOver.value = false;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const openFileSelector = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileDrop = (event) => {
  dragOver.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // Vérifier la taille (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    importError.value = "Le fichier est trop volumineux (max 10MB)";
    $toastr.error("Le fichier dépasse la taille maximale de 10MB");
    return;
  }

  // Vérifier l'extension
  const validExtensions = [".xlsx", ".xls"];
  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

  if (validExtensions.includes(extension)) {
    selectedFile.value = file;
    importError.value = "";
  } else {
    importError.value = "Format non supporté. Utilisez .xlsx ou .xls";
    $toastr.error("Format de fichier non supporté");
  }
};

const removeFile = () => {
  selectedFile.value = null;
  importError.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const processImport = async () => {
  if (!selectedFile.value) {
    $toastr.error("Veuillez sélectionner un fichier.");
    return;
  }

  importLoading.value = true;
  importError.value = "";

  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    
    // Ajouter les rôles sélectionnés si existants
    if (selectedRoles.value.length > 0) {
      selectedRoles.value.forEach(roleId => {
        formData.append("roles[]", roleId);
      });
    }

    // Appeler l'API d'importation via le store
    await userStore.importUsers(formData);
    
    $toastr.success("Importation en cours... Les utilisateurs seront ajoutés sous peu.");
    
    // Rafraîchir la liste après un délai
    setTimeout(async () => {
      await userStore.fetchUsers();
    }, 2000);
    
    closeImportModal();
  } catch (error) {
    console.error("Erreur importation:", error);
    
    if (error.data?.message) {
      importError.value = error.data.message;
    } else if (error.data?.errors) {
      const errors = error.data.errors;
      const errorMessages = [];
      Object.keys(errors).forEach((key) => {
        errorMessages.push(...errors[key]);
      });
      importError.value = errorMessages.join(". ");
    } else {
      importError.value = "Erreur lors de l'importation. Vérifiez le format du fichier.";
    }

    $toastr.error(importError.value || "Erreur lors de l'importation");
  } finally {
    importLoading.value = false;
  }
};

const processExport = async () => {
  exportLoading.value = true;

  try {
    // Préparer les filtres pour l'export
    const filters = {
      search: searchQuery.value,
      // Ajouter d'autres filtres si nécessaire
    };

    // Appeler l'API d'exportation via le store
    const blob = await userStore.exportUsers(filters);
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Nom du fichier
    const date = new Date().toISOString().split('T')[0];
    const filename = `utilisateurs_administration_${date}.xlsx`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libérer l'URL
    window.URL.revokeObjectURL(url);
    
    $toastr.success("Exportation terminée !");
  } catch (error) {
    console.error("Erreur lors de l'exportation:", error);
    
    let errorMessage = "Erreur lors de l'exportation.";
    
    if (error.statusCode === 404) {
      errorMessage = "Aucun utilisateur à exporter.";
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.statusCode === 500) {
      errorMessage = "Erreur serveur lors de l'exportation.";
    }
    
    $toastr.error(errorMessage);
  } finally {
    exportLoading.value = false;
  }
};

// Fonctions de gestion des utilisateurs (existantes)
const openEditModal = (user) => {
  editForm.value = {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    tel: user.tel,
    genre: user.genre,
    supervisor_type: user.supervisor_type ?? "non_surveillant",
    biographie: user.biographie ?? "",
  };
  showEditModal.value = true;
};

const openViewModal = (user) => {
  selectedUser.value = user;
  showViewModal.value = true;
};

const confirmDelete = async (user) => {
  const { $swal,$toastr } = useNuxtApp();
  console.log(user)
  const result = await $swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous supprimer ${user.nom} ${user.prenom} ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      await userStore.deleteUser(user.slug);
      
      // $swal.fire({
      //   icon: "success",
      //   title: "Supprimé",
      //   text: "Utilisateur supprimé avec succès",
      //   timer: 1500,
      //   showConfirmButton: false,
      // });
      // Rafraîchir la liste
      await userStore.fetchUsers();
       $toastr.success("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error("Erreur suppression:", error);
      $toastr.error(error?.response?.data?.message || "Impossible de supprimer l'utilisateur");
      // $swal.fire({
      //   icon: "error",
      //   title: "Erreur",
      //   text: "Impossible de supprimer l'utilisateur",
      // });
    }
  }
};

const submitUpdate = async () => {
  try {
    await userStore.updateUser(editForm.value.id, editForm.value);
    
    // Fermer la modale et rafraîchir
    showEditModal.value = false;
    
    const { $swal } = useNuxtApp();
    $swal.fire({
      icon: "success",
      title: "Succès",
      text: "Utilisateur modifié",
      timer: 1500,
      showConfirmButton: false,
    });
    
    // Rafraîchir la liste
    await userStore.fetchUsers();
  } catch (error) {
    console.error("Erreur modification:", error);
    
    const { $swal } = useNuxtApp();
    $swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Impossible de modifier l'utilisateur",
    });
  }
};

// Chargement initial
onMounted(async () => {
  try {
    loading.value = true;
    // Load roles list for filter
    try {
     await roleStore.fetchRoles();
      availableRoles.value = roleStore.roles || [];
    } catch (err) {
      console.warn('Impossible de charger les rôles:', err);
    }

    await userStore.fetchUsers();
  } catch (error) {
    console.error("Erreur chargement utilisateurs:", error);
    $toastr.error("Erreur lors du chargement des utilisateurs");
  } finally {
    loading.value = false;
  }
});
</script>

