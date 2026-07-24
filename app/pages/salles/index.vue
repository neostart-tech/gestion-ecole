<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->

    <!-- En-tête de page -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div class="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Gestion des Salles
          </h1>
          <p class="mt-1 text-gray-500 dark:text-gray-400">Gérez vos espaces physiques et virtuels pour vos formations.</p>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <!-- Total -->
        <div class="group bg-white dark:bg-gray-800 p-6 rounded-[5px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total salles</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</h3>
            </div>
          </div>
        </div>

        <!-- Physiques -->
        <div class="group bg-white dark:bg-gray-800 p-6 rounded-[5px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg class="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Physiques</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.physiques }}</h3>
            </div>
          </div>
        </div>

        <!-- Virtuelles -->
        <div class="group bg-white dark:bg-gray-800 p-6 rounded-[5px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <svg class="w-16 h-16 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Virtuelles</p>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.virtuelles }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table de données et outils -->
    <div class="bg-white dark:bg-gray-800 rounded-[5px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <!-- Barre d'outils -->
      <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
        <div class="flex flex-wrap items-center gap-4 flex-1">
          <div class="relative max-w-xs w-full">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une salle..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-[5px] bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          
          <select
            v-model="typeFilter"
            class="block pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-[5px] bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none min-w-[150px]"
          >
            <option value="tous">Tous les types</option>
            <option value="physique">Salles physiques</option>
            <option value="virtuelle">Salles virtuelles</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <!-- Gestion des colonnes -->
          <client-only>
            <VDropdown placement="bottom-end" :distance="12">
              <button class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-[5px] bg-white dark:bg-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                </svg>
                Colonnes
                <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <template #popper>
                <div class="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2">
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Affichage des colonnes</div>
                  <div class="max-h-64 overflow-y-auto">
                    <div 
                      v-for="col in columns" 
                      :key="col.field" 
                      class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors" 
                      @click="col.visible = !col.visible"
                    >
                      <div 
                        class="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center transition-colors" 
                        :class="{'bg-blue-600 border-blue-600': col.visible}"
                      >
                        <svg v-if="col.visible" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ col.title }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </VDropdown>
          </client-only>
        </div>

        <div class="flex items-center gap-2">
          <Can action="create-salle">
            <button
              @click="openAddModal"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[5px] transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une salle
            </button>
          </Can>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="visibleColumns"
          :rows="filteredRows"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-striped bh-table-hover"
        >
          <!-- Type de salle -->
          <template #salle_type="data">
            <div class="flex items-center gap-2">
              <span
                v-if="(data.salle_type || data.value?.salle_type || data.value) === 'physique'"
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Physique
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Virtuelle
              </span>
            </div>
          </template>

          <!-- Lien de réunion -->
          <template #lien_url="data">
            <div v-if="getLienUrl(data)" class="flex items-center">
              <a
                :href="getLienUrl(data)"
                target="_blank"
                class="group inline-flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white border border-blue-100 dark:border-blue-800 hover:border-blue-600 transition-all duration-300"
                @click.stop
              >
                <svg class="w-3.5 h-3.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Rejoindre
              </a>
            </div>
            <span v-else class="text-gray-400 italic text-xs">—</span>
          </template>

          <!-- Actions -->
          <template #action="data">
            <div class="flex justify-center gap-3">
              <button
                @click="openDetailModal(data.value.raw || data.value)"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                title="Voir détails"
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
              
              <NuxtLink
                v-if="data.value?.raw?.slug || data.value?.slug"
                :to="`/salles/calendrier/${(data.value?.raw?.slug || data.value?.slug)}-programme`"
                class="p-2 rounded-lg text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-colors duration-200"
                title="Voir dans le calendrier"
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
                    stroke-width="1.8"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </NuxtLink>

              <Can action="update-salle">
                <button
                  @click="openEditModal(data.value.raw || data.value)"
                  class="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
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
              </Can>

              <Can action="delete-salle">
                <button
                  @click="deleteItem(data.value.raw || data.value)"
                  class="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                  title="Supprimer"
                >
                  <ButtonDelete />
                </button>
              </Can>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal de création/édition -->
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
                <DialogTitle
                  class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!isEditing" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ modalTitle }}
                </DialogTitle>

                <form @submit.prevent="saveSalle" class="space-y-4">
                  <!-- Type de salle -->
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type de salle
                    </label>
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2">
                        <input
                          type="radio"
                          v-model="form.type"
                          value="physique"
                          class="w-4 h-4 text-indigo-600"
                        />
                        <span class="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Physique
                        </span>
                      </label>
                      <label class="flex items-center gap-2">
                        <input
                          type="radio"
                          v-model="form.type"
                          value="virtuelle"
                          class="w-4 h-4 text-indigo-600"
                        />
                        <span class="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Virtuelle
                        </span>
                      </label>
                    </div>
                  </div>

                  <!-- Nom -->
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom de la salle
                    </label>
                    <FloatLabel variant="on">
                      <InputText
                        id="nom"
                        v-model="form.nom"
                        autocomplete="off"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                        :class="{ 'border-red-500': errors.nom }"
                      />
                      <label for="nom">Nom</label>
                    </FloatLabel>
                    <p v-if="errors.nom" class="text-sm text-red-600">{{ errors.nom }}</p>
                  </div>

                  <!-- Champs pour salle physique -->
                  <div v-if="form.type === 'physique'" class="space-y-4">
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Effectif maximum
                      </label>
                      <FloatLabel variant="on">
                        <InputNumber
                          id="effectif"
                          v-model="form.effectif"
                          :min="1"
                          autocomplete="off"
                          class="w-full"
                          :class="{ 'p-invalid': errors.effectif }"
                        />
                        <label for="effectif">Effectif</label>
                      </FloatLabel>
                      <p v-if="errors.effectif" class="text-sm text-red-600">{{ errors.effectif }}</p>
                    </div>
                  </div>

                  <!-- Champs pour salle virtuelle -->
                  <div v-if="form.type === 'virtuelle'" class="space-y-4">
                    <!-- Plateforme -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Plateforme
                      </label>
                      <select
                        v-model="form.plateforme"
                        class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Sélectionner une plateforme</option>
                        <option v-for="(label, value) in plateformes" :key="value" :value="value">
                          {{ label }}
                        </option>
                      </select>
                    </div>

                    <!-- Lien de réunion -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Lien/ID de réunion
                      </label>
                      <FloatLabel variant="on">
                        <InputText
                          id="lien_reunion"
                          v-model="form.lien_reunion"
                          autocomplete="off"
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                          :class="{ 'border-red-500': errors.lien_reunion }"
                          placeholder="https://zoom.us/j/123456789"
                        />
                        <label for="lien_reunion">Lien de réunion</label>
                      </FloatLabel>
                      <p v-if="errors.lien_reunion" class="text-sm text-red-600">{{ errors.lien_reunion }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Vous pouvez mettre l'URL complète ou simplement l'ID de réunion
                      </p>
                    </div>

                    <!-- Instructions (optionnel) -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Instructions (optionnel)
                      </label>
                      <FloatLabel variant="on">
                        <Textarea
                          id="instructions"
                          v-model="form.instructions"
                          rows="3"
                          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                          placeholder="Instructions pour les étudiants..."
                        />
                        <label for="instructions">Instructions</label>
                      </FloatLabel>
                    </div>

                    <!-- Effectif (optionnel pour salles virtuelles) -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Effectif maximum (optionnel)
                      </label>
                      <FloatLabel variant="on">
                        <InputNumber
                          id="effectif_virtuel"
                          v-model="form.effectif"
                          :min="0"
                          autocomplete="off"
                          class="w-full"
                        />
                        <label for="effectif_virtuel">Effectif</label>
                      </FloatLabel>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Laissez vide pour une capacité illimitée
                      </p>
                    </div>
                  </div>

                  <!-- Boutons -->
                  <div class="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Annuler
                    </button>

                    <button
                      type="submit"
                      :disabled="formLoading"
                      class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      :class="{ 'opacity-50 cursor-not-allowed': formLoading }"
                    >
                      <svg
                        v-if="formLoading"
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
                      {{ isEditing ? 'Modifier' : 'Enregistrer' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de détails -->
    <TransitionRoot appear :show="showDetailModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDetailModal">
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
                <!-- En-tête -->
                <div class="flex items-start justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div
                      class="p-2 rounded-lg"
                      :class="selectedEvent?.type === 'virtuelle' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-green-100 dark:bg-green-900/30'"
                    >
                      <svg
                        class="w-5 h-5"
                        :class="selectedEvent?.type === 'virtuelle' ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          v-if="selectedEvent?.type === 'virtuelle'"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                        <path
                          v-else
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <DialogTitle
                      class="text-xl font-bold text-gray-900 dark:text-white"
                    >
                      {{ selectedEvent?.nom }}
                    </DialogTitle>
                  </div>
                  <button
                    @click="closeDetailModal"
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

                <!-- Contenu -->
                <div class="space-y-4">
                  <!-- Type -->
                  <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Type:</span>
                    <span
                      class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                      :class="selectedEvent?.type === 'virtuelle' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'"
                    >
                      <svg v-if="selectedEvent?.type === 'virtuelle'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {{ selectedEvent?.type === 'virtuelle' ? 'Salle virtuelle' : 'Salle physique' }}
                    </span>
                  </div>

                  <!-- Effectif -->
                  <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Effectif:</span>
                    <span class="text-gray-900 dark:text-white">
                      {{ selectedEvent?.effectif || (selectedEvent?.type === 'virtuelle' ? 'Illimité' : 'Non défini') }}
                      <span v-if="selectedEvent?.effectif" class="text-sm text-gray-500">personnes</span>
                    </span>
                  </div>

                  <!-- Champs virtuels -->
                  <template v-if="selectedEvent?.type === 'virtuelle'">
                    <!-- Plateforme -->
                    <div v-if="selectedEvent?.plateforme" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Plateforme:</span>
                      <span class="text-gray-900 dark:text-white">
                        {{ getPlateformeLabel(selectedEvent.plateforme) }}
                      </span>
                    </div>

                    <!-- Lien de réunion -->
                    <div v-if="selectedEvent?.lien_reunion_formate" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Lien:</span>
                      <a
                        :href="selectedEvent.lien_reunion_formate"
                        target="_blank"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {{ selectedEvent.lien_reunion_formate }}
                      </a>
                    </div>

                    <!-- Instructions -->
                    <div v-if="selectedEvent?.instructions" class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <span class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Instructions:</span>
                      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {{ selectedEvent.instructions }}
                      </p>
                    </div>
                  </template>
                </div>

                <!-- Actions -->
                <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    type="button"
                    @click="closeDetailModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                  <Can action="update-salle">
                    <button
                      @click="openEditModalFromDetail"
                      class="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                  </Can>
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
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useSalleStore } from "~~/stores/salle";
import ButtonDelete from "~/components/ui/buttonDelete.vue";

const { $toastr, $swal } = useNuxtApp();
const salleStore = useSalleStore();

// États
const searchQuery = ref("");
const typeFilter = ref("tous");
const loading = ref(true);
const formLoading = ref(false);
const showModal = ref(false);
const showDetailModal = ref(false);
const modalTitle = ref("");
const isEditing = ref(false);
const itemsPerPage = ref(10);
const selectedEvent = ref(null);
const errors = ref({});

// Liste des plateformes
const plateformes = {
  zoom: "Zoom",
  teams: "Microsoft Teams",
  meet: "Google Meet",
  whatsapp: "WhatsApp",
  discord: "Discord",
  autres: "Autre"
};

// Formulaire
const form = ref({
  id: null,
  slug: null,
  nom: "",
  type: "physique",
  effectif: null,
  lien_reunion: "",
  plateforme: "",
  instructions: ""
});

// Configuration des colonnes
const columns = ref([
  { field: "nom", title: "Nom", visible: true },
  { field: "salle_type", title: "Type", visible: true },
  { field: "effectif", title: "Effectif", visible: true },
  { field: "plateforme_label", title: "Plateforme", visible: true },
  { field: "lien_url", title: "Lien", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

// Colonnes visibles
const visibleColumns = computed(() => columns.value.filter((c) => c.visible));

// Retourne le vrai lien de réunion, ou null si absent (salle physique) — le tiret
// placeholder "—" est une chaîne non vide donc "vraie" en JS, il faut l'exclure
// explicitement pour ne pas afficher un bouton "Rejoindre" pointant vers "—".
const getLienUrl = (data) => {
  const value = data.lien_url || data.value?.lien_url || data.value;
  return value && value !== '—' ? value : null;
};

// Statistiques
const stats = computed(() => {
  const salles = salleStore.salles || [];
  return {
    total: salles.length,
    physiques: salles.filter(s => s.type === 'physique').length,
    virtuelles: salles.filter(s => s.type === 'virtuelle').length
  };
});

// Lignes filtrées
const filteredRows = computed(() => {
  let rows = salleStore.salles.map((f) => ({
    id: f.id,
    slug: f.slug,
    nom: f.nom,
    salle_type: f.type,
    effectif: f.effectif ?? (f.type === 'virtuelle' ? '∞' : '—'),
    plateforme_label: f.plateforme_nom || '—',
    lien_url: f.lien_reunion_formate || '—',
    instructions: f.instructions,
    raw: f
  }));

  if (typeFilter.value !== 'tous') {
    rows = rows.filter(r => r.type === typeFilter.value);
  }

  return rows;
});

// Fonctions utilitaires
const getPlateformeLabel = (value) => {
  return plateformes[value] || value || 'Non spécifiée';
};

// Ouvrir modal d'ajout
const openAddModal = () => {
  modalTitle.value = "Créer une salle";
  isEditing.value = false;
  form.value = {
    id: null,
    slug: null,
    nom: "",
    type: "physique",
    effectif: null,
    lien_reunion: "",
    plateforme: "",
    instructions: ""
  };
  errors.value = {};
  showModal.value = true;
};

// Ouvrir modal d'édition
const openEditModal = (item) => {
  modalTitle.value = "Modifier la salle";
  isEditing.value = true;
  
  const salle = salleStore.salles.find(s => s.slug === item.slug);
  
  form.value = {
    id: salle?.id,
    slug: salle?.slug,
    nom: salle?.nom || "",
    type: salle?.type || "physique",
    effectif: salle?.effectif,
    lien_reunion: salle?.lien_reunion || "",
    plateforme: salle?.plateforme || "",
    instructions: salle?.instructions || ""
  };
  
  errors.value = {};
  showModal.value = true;
  closeDetailModal();
};

// Ouvrir modal de détails
const openDetailModal = (item) => {
  const salle = salleStore.salles.find(s => s.slug === item.slug);
  selectedEvent.value = salle;
  showDetailModal.value = true;
};

// Ouvrir édition depuis les détails
const openEditModalFromDetail = () => {
  if (selectedEvent.value) {
    openEditModal(selectedEvent.value);
  }
};

// Fermer modal
const closeModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    slug: null,
    nom: "",
    type: "physique",
    effectif: null,
    lien_reunion: "",
    plateforme: "",
    instructions: ""
  };
  errors.value = {};
};

// Fermer modal de détails
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};

// Valider le formulaire
const validateForm = () => {
  errors.value = {};
  
  if (!form.value.nom?.trim()) {
    errors.value.nom = "Le nom est requis";
  }
  
  if (form.value.type === 'physique') {
    if (!form.value.effectif || form.value.effectif < 1) {
      errors.value.effectif = "L'effectif doit être supérieur à 0";
    }
  } else {
    if (!form.value.lien_reunion?.trim()) {
      errors.value.lien_reunion = "Le lien de réunion est requis";
    }
  }
  
  return Object.keys(errors.value).length === 0;
};

// Sauvegarder
const saveSalle = async () => {
  if (!validateForm()) return;
  
  formLoading.value = true;
  
  try {
    const data = {
      nom: form.value.nom.toUpperCase(),
      type: form.value.type,
    };
    
    if (form.value.type === 'physique') {
      data.effectif = form.value.effectif;
    } else {
      data.lien_reunion = form.value.lien_reunion;
      data.plateforme = form.value.plateforme || null;
      data.instructions = form.value.instructions || null;
      data.effectif = form.value.effectif || null;
    }
    
    if (isEditing.value && form.value.slug) {
      await salleStore.updateSalle(form.value.slug, data);
      $toastr.success("Salle modifiée avec succès");
    } else {
      await salleStore.addSalle(data);
      $toastr.success("Salle créée avec succès");
    }
    
    await salleStore.fetchSalles();
    closeModal();
  } catch (error) {
    console.error("Erreur:", error);
    $toastr.error(error.response?.data?.message || "Une erreur est survenue");
  } finally {
    formLoading.value = false;
  }
};

// Supprimer
const deleteItem = async (item) => {
  const result = await $swal.fire({
    title: "Supprimer cette salle ?",
    text: "Cette action est irréversible",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler"
  });

  if (result.isConfirmed) {
    try {
      await salleStore.deleteSalle(item.slug);
      await salleStore.fetchSalles();
      $toastr.success("Salle supprimée avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      $toastr.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  }
};

// Chargement initial
onMounted(async () => {
  try {
    await salleStore.fetchSalles();
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement des salles");
  } finally {
    loading.value = false;
  }
});
</script>