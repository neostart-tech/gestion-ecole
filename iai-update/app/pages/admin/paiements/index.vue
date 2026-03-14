<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300"
  >
    <!-- Loading state avec animation SVG -->
   <div v-if="isLoading || paiementStore.isLoading" class=" inset-0 bg-white dark:bg-gray-900 z-50 flex justify-center items-center">
     <Loading/>
    </div>
    <div v-else class="max-w-7xl mx-auto space-y-6">
      <!-- En-tête avec boutons PDF -->
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
   
        <div class="flex items-center gap-3">
          <!-- SVG Wallet -->
          <svg
            class="w-10 h-10 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <div>
            <h1
              class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
            >
              Paiement étudiant
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Gérez les paiements de vos étudiants
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Boutons PDF - affichés seulement si l'étudiant a des paiements -->
          <template
            v-if="
              selectedEtudiant && paiementStore.historiquePaiements.length > 0
            "
          >
            <!-- Bouton visualisation PDF -->
            <button
              @click="previewPDF"
              class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              :disabled="isDownloadingPDF"
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
                  stroke-width="1.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span class="hidden sm:inline">Aperçu</span>
            </button>
          </template>
        </div>
      </div>
      <
      <!-- Sélection étudiant -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center gap-2 mb-4">
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Sélection de l'étudiant
            </h2>
          </div>

          <Dropdown
            v-model="selectedEtudiant"
            :options="formattedEtudiants"
            optionLabel="nom_complet"
            placeholder="Rechercher un étudiant..."
            class="w-full"
            :loading="etudiantStore.isLoading || isLoading"
            filter
            filterPlaceholder="Tapez pour rechercher..."
            showClear
            @change="handleEtudiantChange"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center gap-3">
                <Avatar
                  :label="getInitials(slotProps.value)"
                  class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  size="normal"
                  shape="circle"
                />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ slotProps.value.nom_complet }}
                  </div>
                  <div class="text-xs text-gray-500 flex items-center gap-2">
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      ></path>
                    </svg>
                    {{ slotProps.value.matricule }}
                  </div>
                </div>
              </div>
              <span v-else class="text-gray-400">{{
                slotProps.placeholder
              }}</span>
            </template>

            <template #option="slotProps">
              <div
                class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Avatar
                  :label="getInitials(slotProps.option)"
                  class="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  size="normal"
                  shape="circle"
                />
                <div class="flex-1">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ slotProps.option.nom_complet }}
                  </div>
                  <div
                    class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-0.5"
                  >
                    <span class="flex items-center gap-1">
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        ></path>
                      </svg>
                      {{ slotProps.option.matricule }}
                    </span>
                    <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span class="flex items-center gap-1">
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        ></path>
                      </svg>
                      {{ slotProps.option.niveau }}
                    </span>
                  </div>
                  <div
                    v-if="slotProps.option.filiere"
                    class="text-xs text-indigo-600 dark:text-indigo-400 mt-1"
                  >
                    {{ slotProps.option.filiere }}
                  </div>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>

      <!-- Informations étudiant sélectionné -->
      <div
        v-if="selectedEtudiant && paiementStore.infosEtudiant"
        class="space-y-6"
      >
        <!-- Profil étudiant -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-6">
            <div
              class="flex flex-col lg:flex-row items-start lg:items-center gap-6"
            >
              <Avatar
                :label="getInitials(paiementStore.infosEtudiant.etudiant)"
                class="w-20 h-20 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-2xl font-bold"
                shape="circle"
              />
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ paiementStore.infosEtudiant.etudiant.nom_complet }}
                  </h2>
                  <span
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {{ typeFraisLabel }}
                  </span>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Matricule
                    </p>
                    <p
                      class="font-medium text-gray-900 dark:text-white flex items-center gap-1"
                    >
                      <svg
                        class="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        ></path>
                      </svg>
                      {{ paiementStore.infosEtudiant.etudiant.matricule }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Niveau
                    </p>
                    <p
                      class="font-medium text-gray-900 dark:text-white flex items-center gap-1"
                    >
                      <svg
                        class="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        ></path>
                      </svg>
                      {{ paiementStore.infosEtudiant.etudiant.niveau || "N/A" }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Filière
                    </p>
                    <p
                      class="font-medium text-gray-900 dark:text-white flex items-center gap-1"
                    >
                      <svg
                        class="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                        ></path>
                      </svg>
                      {{
                        paiementStore.infosEtudiant.etudiant.filiere ||
                        "Non spécifiée"
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Contact
                    </p>
                    <p
                      class="font-medium text-gray-900 dark:text-white flex items-center gap-1"
                    >
                      <svg
                        class="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                      {{
                        paiementStore.infosEtudiant.etudiant.telephone || "N/A"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bannière bourse -->
        <div
          v-if="paiementStore.bourseInfo"
          class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
        >
          <div class="flex items-center gap-3">
            <svg
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              ></path>
            </svg>
            <div>
              <p class="text-sm font-medium text-amber-800 dark:text-amber-400">
                {{ paiementStore.bourseInfo.nom }}
              </p>
              <p class="text-xs text-amber-600 dark:text-amber-300">
                {{
                  paiementStore.bourseInfo.type === "pourcentage"
                    ? paiementStore.bourseInfo.valeur + "% de réduction"
                    : formatMontant(paiementStore.bourseInfo.valeur) +
                      " de réduction"
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Stats rapides -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(stat, index) in quickStats"
            :key="index"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {{ stat.label }}
            </p>
            <p class="text-xl font-bold" :class="stat.valueClass">
              {{ stat.value }}
            </p>
            <p class="text-xs text-gray-400 mt-1">{{ stat.subtext }}</p>
          </div>
        </div>

        <!-- Formulaire de paiement -->
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center gap-2 mb-6">
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Nouveau paiement
              </h3>
            </div>

            <form @submit.prevent="handlePaiement" class="space-y-4">
              <!-- Sélection élément -->
              <div v-if="elementsPayables.length > 1">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Élément à payer
                </label>
                <SelectButton
                  v-model="paiementForm.payable_id"
                  :options="elementsPayables"
                  optionLabel="libelle"
                  optionValue="id"
                  class="w-full"
                />
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Montant -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Montant <span class="text-red-500">*</span>
                  </label>
                  <InputNumber
                    v-model="paiementForm.montant"
                    :min="1"
                    :max="maxMontant"
                    placeholder="0"
                    class="w-full"
                    :useGrouping="true"
                    :minFractionDigits="0"
                    :maxFractionDigits="0"
                    mode="currency"
                    currency="XOF"
                    locale="fr-FR"
                  />
                  <div class="mt-2 text-sm text-gray-500">
                    Reste: {{ formatMontant(paiementStore.resteAPayer) }}
                  </div>
                </div>
                <!-- Dans le formulaire de paiement, après le champ montant -->
                <div class="mt-2">
                  <div
                    v-if="paiementForm.montant && paiementForm.payable_id"
                    class="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span
                      >Si le montant dépasse le reste de cette échéance, le
                      surplus sera automatiquement réparti sur les échéances
                      suivantes.</span
                    >
                  </div>
                </div>

                <!-- Mode de paiement -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Mode <span class="text-red-500">*</span>
                  </label>
                  <SelectButton
                    v-model="paiementForm.mode_paiement"
                    :options="modesPaiement"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  />
                </div>

                <!-- Référence -->
                <div class="lg:col-span-2">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Référence
                    <span class="text-xs text-gray-400">(optionnel)</span>
                  </label>
                  <InputText
                    v-model="paiementForm.reference"
                    placeholder="N° de reçu, transaction..."
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Boutons -->
              <div
                class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700"
              >
                <Button
                  type="button"
                  label="Réinitialiser"
                  class="p-button-outlined p-button-secondary"
                  @click="resetForm"
                />
                <Button
                  type="submit"
                  :label="
                    isSubmitting ? 'Traitement...' : 'Effectuer le paiement'
                  "
                  :loading="isSubmitting"
                  :disabled="
                    isSubmitting ||
                    !paiementForm.montant ||
                    paiementForm.montant <= 0
                  "
                />
              </div>
            </form>
          </div>
        </div>

        <!-- Éléments à payer -->
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ typeFraisTitre }}
                </h3>
                <span
                  class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                >
                  {{ paiementStore.nombreElements }}
                </span>
              </div>
            </div>

            <!-- Version desktop -->
            <div class="hidden lg:block">
              <DataTable :value="paiementStore.elementsAPayer" class="w-full">
                <Column field="ordre" header="N°" style="width: 70px">
                  <template #body="slotProps">
                    <span
                      class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {{ slotProps.data.ordre }}
                    </span>
                  </template>
                </Column>
                <Column
                  field="libelle"
                  :header="typeFraisColonneLibelle"
                ></Column>
                <Column field="montant" header="Montant">
                  <template #body="slotProps">
                    {{
                      formatMontant(
                        slotProps.data.montant_apres_bourse ||
                          slotProps.data.montant,
                      )
                    }}
                  </template>
                </Column>
                <Column field="paye" header="Payé">
                  <template #body="slotProps">
                    <span class="text-green-600">
                      {{
                        formatMontant(
                          slotProps.data.paye ||
                            slotProps.data.montant_paye ||
                            0,
                        )
                      }}
                    </span>
                  </template>
                </Column>
                <Column field="reste" header="Reste">
                  <template #body="slotProps">
                    <span
                      :class="
                        (slotProps.data.reste || slotProps.data.reste_a_payer) >
                        0
                          ? 'text-amber-600'
                          : 'text-green-600'
                      "
                    >
                      {{
                        formatMontant(
                          slotProps.data.reste ||
                            slotProps.data.reste_a_payer ||
                            0,
                        )
                      }}
                    </span>
                  </template>
                </Column>
                <Column
                  field="date_limite_formatted"
                  header="Date limite"
                ></Column>
                <Column field="statut" header="Statut">
                  <template #body="slotProps">
                    <span
                      class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {{ getStatutLabel(slotProps.data) }}
                    </span>
                  </template>
                </Column>
                <Column header="Action" style="width: 80px">
                  <template #body="slotProps">
                    <button
                      v-if="
                        (slotProps.data.reste || slotProps.data.reste_a_payer) >
                        0
                      "
                      @click="preparerPaiementElement(slotProps.data)"
                      class="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        ></path>
                      </svg>
                    </button>
                  </template>
                </Column>
              </DataTable>
            </div>

            <!-- Version mobile -->
            <div class="lg:hidden space-y-3">
              <div
                v-for="element in paiementStore.elementsAPayer"
                :key="element.id"
                class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
              >
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full text-xs"
                    >
                      {{ element.ordre }}
                    </span>
                    <span class="font-medium">{{ element.libelle }}</span>
                  </div>
                  <span
                    class="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full text-xs"
                  >
                    {{ getStatutLabel(element) }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p class="text-xs text-gray-500">Montant</p>
                    <p class="font-medium">
                      {{
                        formatMontant(
                          element.montant_apres_bourse || element.montant,
                        )
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Payé</p>
                    <p class="text-green-600">
                      {{
                        formatMontant(element.paye || element.montant_paye || 0)
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Reste</p>
                    <p
                      :class="
                        (element.reste || element.reste_a_payer) > 0
                          ? 'text-amber-600'
                          : 'text-green-600'
                      "
                    >
                      {{
                        formatMontant(
                          element.reste || element.reste_a_payer || 0,
                        )
                      }}
                    </p>
                  </div>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                  {{ element.date_limite_formatted }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Historique et Récapitulatif -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Historique -->
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Historique
                  </h3>
                </div>
                <span
                  class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                >
                  {{ paiementStore.historiquePaiements.length }}
                </span>
              </div>

              <div
                v-if="paiementStore.historiquePaiements.length === 0"
                class="text-center py-8 text-gray-500"
              >
                Aucun paiement
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="item in paiementStore.historiquePaiements.slice(0, 3)"
                  :key="item.id"
                  class="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ item.libelle }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ item.date_formatted }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-green-600">
                        {{ formatMontant(item.montant) }}
                      </p>
                      <p class="text-xs text-gray-500">{{ item.mode_label }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Récapitulatif -->
          <div
            v-if="paiementStore.recap"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center gap-2 mb-4">
                <svg
                  class="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Récapitulatif
                </h3>
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p class="text-xs text-gray-500">Total</p>
                    <p class="text-lg font-bold">
                      {{ formatMontant(paiementStore.recap.montant_total) }}
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p class="text-xs text-gray-500">Payé</p>
                    <p class="text-lg font-bold text-green-600">
                      {{ formatMontant(paiementStore.recap.total_paye) }}
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p class="text-xs text-gray-500">Reste</p>
                    <p class="text-lg font-bold text-amber-600">
                      {{ formatMontant(paiementStore.recap.reste_a_payer) }}
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p class="text-xs text-gray-500">Progression</p>
                    <p class="text-lg font-bold">
                      {{ paiementStore.recap.pourcentage }}%
                    </p>
                  </div>
                </div>

                <ProgressBar
                  :value="paiementStore.recap.pourcentage"
                  class="h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- États vides -->
      <div
        v-else-if="selectedEtudiant && paiementStore.error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center"
      >
        <svg
          class="w-12 h-12 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
          {{ paiementStore.error }}
        </h3>
        <button
          @click="handleEtudiantChange"
          class="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <div
        v-else-if="selectedEtudiant && !paiementStore.infosEtudiant"
        class="text-center py-12"
      >
        <svg
          class="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin"
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
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">
          Chargement des informations...
        </p>
      </div>

      <div v-else class="text-center py-12">
        <svg
          class="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          ></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Sélectionnez un étudiant
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Choisissez un étudiant pour commencer
        </p>
      </div>
    </div>

    <!-- Modal de reçu -->
    <TransitionRoot appear :show="showPDFModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showPDFModal = false">
        <div class="fixed inset-0 bg-black/60" />

        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-5 max-h-[90vh] overflow-y-auto"
          >
            <DialogTitle
              class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-indigo-600"
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
                <span>Reçu de paiement</span>
              </div>
              <button
                @click="showPDFModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
            </DialogTitle>

            <div v-if="pdfEtudiant" class="space-y-4">
              <!-- Contrôles de zoom -->
              <div
                class="flex justify-end items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <button
                    @click="zoomOut"
                    :disabled="pdfZoom <= 0.5"
                    class="p-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
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
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span class="text-sm font-medium"
                    >{{ Math.round(pdfZoom * 100) }}%</span
                  >
                  <button
                    @click="zoomIn"
                    :disabled="pdfZoom >= 2"
                    class="p-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
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
                  </button>
                </div>
              </div>

              <!-- Contenu du reçu -->
              <div
                ref="recuContent"
                class="recu-pdf-container"
                :style="{
                  transform: `scale(${pdfZoom})`,
                  transformOrigin: 'top center',
                }"
              >
                <div class="recu-pdf">
                  <div class="recu-header">
                    <h1>{{ appName }}</h1>
                    <p class="recu-subtitle">Reçu de paiement officiel</p>
                    <div class="recu-matricule">
                      N° REC-{{ pdfEtudiant.id }}-{{
                        formatDateForRef(new Date())
                      }}
                    </div>
                  </div>

                  <div class="recu-content">
                    <!-- Informations étudiant -->
                    <div class="recu-grid">
                      <div class="recu-card">
                        <h3>Étudiant</h3>
                        <div class="recu-row">
                          <span class="recu-label">Nom complet</span>
                          <span class="recu-value">{{
                            pdfEtudiant.nom_complet
                          }}</span>
                        </div>
                        <div class="recu-row">
                          <span class="recu-label">Matricule</span>
                          <span class="recu-value">{{
                            pdfEtudiant.matricule || "N/A"
                          }}</span>
                        </div>
                        <div class="recu-row">
                          <span class="recu-label">Contact</span>
                          <span class="recu-value">{{
                            pdfEtudiant.telephone || "N/A"
                          }}</span>
                        </div>
                      </div>

                      <div class="recu-card">
                        <h3>Scolarité</h3>
                        <div class="recu-row">
                          <span class="recu-label">Niveau</span>
                          <span class="recu-value">{{
                            pdfEtudiant.niveau || "N/A"
                          }}</span>
                        </div>
                        <div class="recu-row">
                          <span class="recu-label">Filière</span>
                          <span class="recu-value">{{
                            pdfEtudiant.filiere || "N/A"
                          }}</span>
                        </div>
                        <div class="recu-row">
                          <span class="recu-label">Email</span>
                          <span class="recu-value">{{
                            pdfEtudiant.email || "N/A"
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Tableau des paiements -->
                    <h3 class="recu-section-title">Détail des paiements</h3>
                    <table class="recu-table">
                      <thead>
                        <tr>
                          <th>Échéance</th>
                          <th>Date</th>
                          <th>Mode</th>
                          <th class="recu-text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="paiement in pdfPaiements" :key="paiement.id">
                          <td>{{ paiement.libelle || "N/A" }}</td>
                          <td>
                            {{
                              formatDate(
                                paiement.date_paiement || paiement.created_at,
                              )
                            }}
                          </td>
                          <td>
                            {{ getModePaiementLabel(paiement.mode_paiement) }}
                          </td>
                          <td class="recu-text-right recu-font-bold">
                            {{ formatMontant(paiement.montant) }}
                          </td>
                        </tr>
                        <tr v-if="pdfPaiements.length === 0">
                          <td colspan="4" class="recu-text-center recu-empty">
                            Aucun paiement enregistré
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Récapitulatif -->
                    <div class="recu-total">
                      <div class="recu-total-item">
                        <div class="recu-total-label">Total payé</div>
                        <div class="recu-total-value recu-paye">
                          {{ formatMontant(pdfTotalPaye) }}
                        </div>
                      </div>
                      <div class="recu-total-item">
                        <div class="recu-total-label">Reste à payer</div>
                        <div class="recu-total-value recu-reste">
                          {{ formatMontant(pdfResteAPayer) }}
                        </div>
                      </div>
                    </div>

                    <!-- Date et signature -->
                    <div class="recu-footer">
                      <div>
                        <p class="recu-footer-label">Date d'émission</p>
                        <p class="recu-footer-value">
                          {{ formatDate(new Date()) }}
                        </p>
                      </div>
                      <div class="recu-signature">
                        <p class="recu-footer-label">Cachet et signature</p>
                        <div class="recu-signature-line"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex justify-end gap-3 pt-4">
                <button
                  @click="showPDFModal = false"
                  class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Fermer
                </button>
                <button
                  @click="downloadPDF"
                  :disabled="isDownloadingPDF"
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <svg
                    v-if="isDownloadingPDF"
                    class="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4"
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
                  {{
                    isDownloadingPDF
                      ? "Téléchargement..."
                      : "Télécharger le reçu"
                  }}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Toast -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";
import Avatar from "primevue/avatar";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import SelectButton from "primevue/selectbutton";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressBar from "primevue/progressbar";
import Toast from "primevue/toast";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";
import { usePaiementGlobalStore } from "~~/stores/paiement";
import { useEtudiantStore } from "~~/stores/etudiant";
import { useParametreStore } from "~~/stores/parametre";

let html2pdf = null;
if (process.client) {
  import("html2pdf.js").then((module) => {
    html2pdf = module.default;
  });
}

const toast = useToast();
const paiementStore = usePaiementGlobalStore();
const etudiantStore = useEtudiantStore();
const parametreStore = useParametreStore();

// États
const isLoading = ref(false);
const isSubmitting = ref(false);
const selectedEtudiant = ref(null);
const isDarkMode = ref(false);
const showPDFModal = ref(false);
const isDownloadingPDF = ref(false);
const pdfZoom = ref(1);
const recuContent = ref(null);

// Données pour le PDF
const pdfEtudiant = ref(null);
const pdfPaiements = ref([]);
const pdfTotalPaye = ref(0);
const pdfResteAPayer = ref(0);

// Formulaire de paiement
const paiementForm = ref({
  etudiant_id: null,
  montant: null,
  mode_paiement: "especes",
  reference: "",
  payable_id: null,
  payable_type: null,
});

// Modes de paiement
const modesPaiement = ref([
  //   { value: "especes", label: "Espèces" },
  { value: "banque", label: "Banque" },
  //   { value: "semoa", label: "SEMOA" },
  { value: "caisse", label: "Caisse" },
  //   { value: "carte", label: "Carte" },
  //   { value: "virement", label: "Virement" },
  //   { value: "cheque", label: "Chèque" },
]);

// App name
const appName = computed(() => parametreStore.getAppName || "Établissement");

// Statistiques rapides
const quickStats = computed(() => {
  if (!paiementStore.infosEtudiant) return [];

  return [
    {
      label: "Total",
      value: formatMontant(paiementStore.montantTotal),
      subtext: "À payer",
      valueClass: "text-gray-900 dark:text-white",
    },
    {
      label: "Payé",
      value: formatMontant(paiementStore.totalPaye),
      subtext: "Déjà réglé",
      valueClass: "text-emerald-600",
    },
    {
      label: "Reste",
      value: formatMontant(paiementStore.resteAPayer),
      subtext: "À régler",
      valueClass: "text-amber-600",
    },
    {
      label: "Prochaine",
      value: paiementStore.prochainElement?.libelle || "Aucune",
      subtext: paiementStore.prochainElement
        ? formatDate(paiementStore.prochainElement.date_limite)
        : "",
      valueClass: "text-gray-900 dark:text-white",
    },
  ];
});

// Formater les étudiants pour le dropdown
const formattedEtudiants = computed(() => {
  return etudiantStore.etudiants.map((e) => {
    let niveau = "N/A";
    let filiere = null;

    if (e.dernier_groupe) {
      if (e.dernier_groupe.niveau) {
        niveau =
          e.dernier_groupe.niveau.nom ||
          e.dernier_groupe.niveau.libelle ||
          "N/A";
      }
      if (e.dernier_groupe.filiere) {
        filiere = e.dernier_groupe.filiere.nom || "N/A";
      }
    }

    return {
      id: e.id,
      slug: e.slug,
      nom_complet: `${e.nom} ${e.prenom}`,
      nom: e.nom,
      prenom: e.prenom,
      matricule: e.matricule,
      niveau: niveau,
      filiere: filiere,
      telephone: e.tel,
      email: e.email,
      genre: e.genre,
    };
  });
});

// ==================== COMPUTED PROPERTIES ====================

const typeFraisLabel = computed(() => {
  if (!paiementStore.infosEtudiant) return "";
  return paiementStore.hasFraisNegocie ? "Négociation" : "Standard";
});

const typeFraisTitre = computed(() => {
  return paiementStore.hasFraisNegocie ? "Échéances" : "Tranches";
});

const typeFraisColonneLibelle = computed(() => {
  return paiementStore.hasFraisNegocie ? "Échéance" : "Tranche";
});

const elementsPayables = computed(() => {
  if (!paiementStore.infosEtudiant) return [];
  const elements = paiementStore.elementsAPayer;
  return elements.filter((e) => (e.reste || e.reste_a_payer) > 0);
});

const maxMontant = computed(() => {
  if (paiementForm.value.payable_id) {
    return montantRestantElement.value || paiementStore.resteAPayer;
  }
  return paiementStore.resteAPayer;
});

const montantRestantElement = computed(() => {
  if (!paiementForm.value.payable_id || !paiementStore.infosEtudiant)
    return null;
  const element = paiementStore.elementsAPayer.find(
    (e) => e.id === paiementForm.value.payable_id,
  );
  return element ? element.reste || element.reste_a_payer : null;
});

// ==================== METHODS ====================

onMounted(async () => {
  // Vérifier le mode sombre au chargement
  if (localStorage.getItem("darkMode") === "true") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  }

  // Charger les paramètres
  await parametreStore.fetchParametres();

  if (etudiantStore.etudiants.length === 0) {
    isLoading.value = true;
    try {
      await etudiantStore.fetchEtudiants();
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger la liste des étudiants",
        life: 5000,
      });
    } finally {
      isLoading.value = false;
    }
  }
});

const handleEtudiantChange = async () => {
  if (!selectedEtudiant.value) {
    paiementStore.resetInfos();
    paiementForm.value.etudiant_id = null;
    return;
  }

  isLoading.value = true;
  paiementStore.error = null;

  try {
    if (selectedEtudiant.value.slug) {
      await etudiantStore.fetchEtudiant(selectedEtudiant.value.slug);
    }

    await paiementStore.getInfosEtudiant(selectedEtudiant.value.id);
    await paiementStore.getHistorique(selectedEtudiant.value.id);
    await paiementStore.getRecap(selectedEtudiant.value.id);

    paiementForm.value.etudiant_id = selectedEtudiant.value.id;

    if (paiementStore.error) {
      toast.add({
        severity: "warn",
        summary: "Attention",
        detail: paiementStore.error,
        life: 6000,
      });
    } else if (paiementStore.infosEtudiant) {
      toast.add({
        severity: "success",
        summary: "Succès",
        detail: `Étudiant ${selectedEtudiant.value.nom_complet} chargé`,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Erreur chargement:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: error.message || "Erreur lors du chargement",
      life: 5000,
    });
  } finally {
    isLoading.value = false;
  }
};

const preparerPaiementElement = (element) => {
  paiementForm.value.payable_id = element.id;
  paiementForm.value.payable_type = paiementStore.hasFraisNegocie
    ? "echeance"
    : "tranche";

  // Pré-remplir avec le montant restant de l'échéance
  const reste = element.reste || element.reste_a_payer || 0;
  paiementForm.value.montant = reste;

  // Message informatif
  toast.add({
    severity: "info",
    summary: "Préparation",
    detail: `Paiement de ${element.libelle} préparé. Montant: ${formatMontant(reste)}`,
    life: 3000,
  });

  // Scroll vers le formulaire
  const formElement = document.querySelector(".paiement-form");
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth" });
  }
};

// Fonction pour répartir automatiquement le paiement sur plusieurs échéances
const repartirPaiementSurEcheances = async (montantTotal, echeanceId) => {
  if (!selectedEtudiant.value || !paiementStore.elementsAPayer.length) {
    throw new Error("Aucune échéance disponible");
  }

  // Trier les échéances par ordre
  const echeancesTriees = [...paiementStore.elementsAPayer]
    .filter((e) => (e.reste || e.reste_a_payer) > 0)
    .sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

  if (echeancesTriees.length === 0) {
    throw new Error("Aucune échéance avec reste à payer");
  }

  // Trouver l'index de l'échéance sélectionnée (ou commencer par la première)
  let indexDepart = 0;
  if (echeanceId) {
    indexDepart = echeancesTriees.findIndex((e) => e.id === echeanceId);
    if (indexDepart === -1) indexDepart = 0;
  }

  let montantRestant = montantTotal;
  const paiementsEffectues = [];
  const echeancesConcernees = [];

  // Parcourir les échéances à partir de l'index de départ
  for (
    let i = indexDepart;
    i < echeancesTriees.length && montantRestant > 0;
    i++
  ) {
    const echeance = echeancesTriees[i];
    const resteEcheance = echeance.reste || echeance.reste_a_payer || 0;

    if (resteEcheance <= 0) continue; // Échéance déjà payée

    // Déterminer le montant à payer pour cette échéance
    const montantAEcheance = Math.min(montantRestant, resteEcheance);

    // Préparer les données pour cette échéance
    const paiementData = {
      etudiant_id: selectedEtudiant.value.id,
      montant: montantAEcheance,
      mode_paiement: paiementForm.value.mode_paiement,
      reference: paiementForm.value.reference || null,
      payable_id: echeance.id,
      payable_type: paiementStore.hasFraisNegocie ? "echeance" : "tranche",
    };

    try {
      // Effectuer le paiement pour cette échéance
      const result = await paiementStore.effectuerPaiement(paiementData);

      paiementsEffectues.push({
        echeance: echeance.libelle,
        montant: montantAEcheance,
      });

      echeancesConcernees.push(echeance.libelle);
      montantRestant -= montantAEcheance;

      // Message informatif si le paiement continue sur l'échéance suivante
      if (montantRestant > 0 && i < echeancesTriees.length - 1) {
        toast.add({
          severity: "info",
          summary: "Répartition automatique",
          detail: `${formatMontant(montantAEcheance)} payé sur "${echeance.libelle}". Le reste (${formatMontant(montantRestant)}) sera appliqué à l'échéance suivante.`,
          life: 4000,
        });
      }
    } catch (error) {
      console.error(`Erreur sur l'échéance ${echeance.libelle}:`, error);

      if (paiementsEffectues.length > 0) {
        toast.add({
          severity: "warning",
          summary: "Paiement partiel",
          detail: `Paiements effectués sur ${echeancesConcernees.join(", ")}. Une erreur est survenue pour la suite.`,
          life: 5000,
        });
      } else {
        throw error;
      }
      break;
    }
  }

  return {
    montantTotal: montantTotal - montantRestant,
    montantRestant,
    echeances: echeancesConcernees,
    paiements: paiementsEffectues,
  };
};

const handlePaiement = async () => {
  if (!paiementForm.value.montant || paiementForm.value.montant <= 0) {
    toast.add({
      severity: "warn",
      summary: "Attention",
      detail: "Veuillez saisir un montant valide",
      life: 3000,
    });
    return;
  }

  if (!selectedEtudiant.value) {
    toast.add({
      severity: "warn",
      summary: "Attention",
      detail: "Veuillez sélectionner un étudiant",
      life: 3000,
    });
    return;
  }

  // Vérifier si le montant dépasse le reste de l'échéance sélectionnée
  const montantSaisi = paiementForm.value.montant;
  let montantMaxEcheance =
    montantRestantElement.value || paiementStore.resteAPayer;

  if (montantSaisi > montantMaxEcheance) {
    toast.add({
      severity: "warn",
      summary: "Attention",
      detail: `Le montant saisi (${formatMontant(montantSaisi)}) dépasse le maximum autorisé (${formatMontant(montantMaxEcheance)})`,
      life: 5000,
    });
    return;
  }

  isSubmitting.value = true;

  try {
    // Vérifier si le paiement concerne une échéance spécifique
    if (paiementForm.value.payable_id) {
      // Récupérer l'échéance concernée
      const echeance = paiementStore.elementsAPayer.find(
        (e) => e.id === paiementForm.value.payable_id,
      );

      if (!echeance) {
        throw new Error("Échéance non trouvée");
      }

      const resteEcheance = echeance.reste || echeance.reste_a_payer || 0;

      // Cas 1: Le montant payé est inférieur ou égal au reste de l'échéance
      if (montantSaisi <= resteEcheance) {
        // Paiement simple sur une seule échéance
        const result = await paiementStore.effectuerPaiement({
          etudiant_id: selectedEtudiant.value.id,
          montant: montantSaisi,
          mode_paiement: paiementForm.value.mode_paiement,
          reference: paiementForm.value.reference || null,
          payable_id: paiementForm.value.payable_id,
          payable_type: paiementForm.value.payable_type,
        });

        toast.add({
          severity: "success",
          summary: "Succès",
          detail: `Paiement de ${formatMontant(montantSaisi)} effectué sur "${echeance.libelle}"`,
          life: 5000,
        });
      }
      // Cas 2: Le montant payé dépasse le reste de l'échéance
      else {
        // Répartition automatique sur plusieurs échéances
        const resultat = await repartirPaiementSurEcheances(
          montantSaisi,
          echeance.id,
        );

        if (resultat.montantRestant === 0) {
          toast.add({
            severity: "success",
            summary: "Paiement réparti avec succès",
            detail: `${formatMontant(montantSaisi)} réparti sur ${resultat.echeances.length} échéance(s)`,
            life: 5000,
          });
        } else {
          toast.add({
            severity: "warning",
            summary: "Paiement partiel",
            detail: `${formatMontant(montantSaisi - resultat.montantRestant)} payé sur ${resultat.echeances.length} échéance(s). Reste: ${formatMontant(resultat.montantRestant)}`,
            life: 5000,
          });
        }
      }
    }
    // Paiement sans échéance spécifique (paiement global)
    else {
      // Trier les échéances par ordre
      const echeancesNonSoldees = paiementStore.elementsAPayer
        .filter((e) => (e.reste || e.reste_a_payer) > 0)
        .sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

      if (echeancesNonSoldees.length === 0) {
        throw new Error("Aucune échéance à payer");
      }

      let montantRestant = montantSaisi;
      const paiementsEffectues = [];
      const echeancesConcernees = [];

      // Parcourir toutes les échéances dans l'ordre
      for (const echeance of echeancesNonSoldees) {
        if (montantRestant <= 0) break;

        const resteEcheance = echeance.reste || echeance.reste_a_payer || 0;
        if (resteEcheance <= 0) continue;

        const montantAEcheance = Math.min(montantRestant, resteEcheance);

        const result = await paiementStore.effectuerPaiement({
          etudiant_id: selectedEtudiant.value.id,
          montant: montantAEcheance,
          mode_paiement: paiementForm.value.mode_paiement,
          reference: paiementForm.value.reference || null,
          payable_id: echeance.id,
          payable_type: paiementStore.hasFraisNegocie ? "echeance" : "tranche",
        });

        paiementsEffectues.push({
          echeance: echeance.libelle,
          montant: montantAEcheance,
        });

        echeancesConcernees.push(echeance.libelle);
        montantRestant -= montantAEcheance;

        if (montantRestant > 0) {
          toast.add({
            severity: "info",
            summary: "Répartition automatique",
            detail: `${formatMontant(montantAEcheance)} payé sur "${echeance.libelle}". Passage à l'échéance suivante...`,
            life: 3000,
          });
        }
      }

      if (montantRestant === 0) {
        toast.add({
          severity: "success",
          summary: "Paiement réparti avec succès",
          detail: `${formatMontant(montantSaisi)} réparti sur ${echeancesConcernees.length} échéance(s)`,
          life: 5000,
        });
      } else {
        toast.add({
          severity: "warning",
          summary: "Paiement partiel",
          detail: `${formatMontant(montantSaisi - montantRestant)} payé sur ${echeancesConcernees.length} échéance(s). Reste: ${formatMontant(montantRestant)}`,
          life: 5000,
        });
      }
    }

    // Recharger les données
    await paiementStore.getInfosEtudiant(selectedEtudiant.value.id);
    await paiementStore.getHistorique(selectedEtudiant.value.id);
    await paiementStore.getRecap(selectedEtudiant.value.id);

    resetForm();
  } catch (error) {
    console.error("Erreur paiement:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: error.message || "Erreur lors du paiement",
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  paiementForm.value.montant = null;
  paiementForm.value.reference = "";
  paiementForm.value.payable_id = null;
  paiementForm.value.payable_type = null;
};

const getInitials = (etudiant) => {
  if (!etudiant) return "?";
  const nom = etudiant.nom || etudiant.nom_complet?.split(" ")[0] || "";
  const prenom = etudiant.prenom || etudiant.nom_complet?.split(" ")[1] || "";
  return (nom.charAt(0) + prenom.charAt(0)).toUpperCase();
};

const formatMontant = (montant) => {
  if (montant === undefined || montant === null || isNaN(montant))
    return "0 FCFA";

  const nombre = Number(montant);
  if (isNaN(nombre)) return "0 FCFA";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(nombre)
    .replace("XOF", "FCFA");
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateForRef = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${d.getDate().toString().padStart(2, "0")}`;
};

const getStatutLabel = (element) => {
  if (element.statut) {
    switch (element.statut) {
      case "paye":
        return "Payé";
      case "partiel":
        return "Partiel";
      case "en_retard":
        return "Retard";
      default:
        return "Attente";
    }
  }

  if (element.reste === 0 || element.reste_a_payer === 0) return "Payé";
  if (element.paye > 0) return "Partiel";

  if (element.date_limite) {
    const dateLimite = new Date(element.date_limite);
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    dateLimite.setHours(0, 0, 0, 0);

    if (dateLimite < aujourdHui) return "Retard";
  }

  return "Attente";
};

const getModePaiementLabel = (mode) => {
  const labels = {
    especes: "Espèces",
    banque: "Banque",
    semoa: "SEMOA",
    caisse: "Caisse",
    carte: "Carte",
    virement: "Virement",
    cheque: "Chèque",
  };
  return labels[mode] || mode;
};

// Gestion du PDF - Aperçu
const previewPDF = async () => {
  if (!html2pdf) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Bibliothèque PDF non chargée",
      life: 3000,
    });
    return;
  }

  if (
    !paiementStore.infosEtudiant ||
    paiementStore.historiquePaiements.length === 0
  ) {
    toast.add({
      severity: "warn",
      summary: "Attention",
      detail: "Aucun paiement à afficher",
      life: 3000,
    });
    return;
  }

  // Sauvegarder les données pour le PDF
  pdfEtudiant.value = {
    id: selectedEtudiant.value.id,
    nom_complet: selectedEtudiant.value.nom_complet,
    matricule: selectedEtudiant.value.matricule,
    niveau: selectedEtudiant.value.niveau || "N/A",
    filiere: selectedEtudiant.value.filiere || "N/A",
    email: selectedEtudiant.value.email || "N/A",
    telephone: selectedEtudiant.value.telephone || "N/A",
  };

  pdfPaiements.value = paiementStore.historiquePaiements.map((p) => ({
    ...p,
    date_paiement: p.created_at,
  }));

  pdfTotalPaye.value = paiementStore.totalPaye || 0;
  pdfResteAPayer.value = paiementStore.resteAPayer || 0;

  // Ouvrir le modal
  showPDFModal.value = true;
};

// Téléchargement du PDF
const downloadPDF = async () => {
  if (!html2pdf || !recuContent.value) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Impossible de générer le PDF",
      life: 3000,
    });
    return;
  }

  isDownloadingPDF.value = true;

  try {
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `recu_${pdfEtudiant.value?.matricule || "etudiant"}_${formatDateForRef(new Date())}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(recuContent.value).save();

    toast.add({
      severity: "success",
      summary: "Succès",
      detail: "PDF téléchargé avec succès",
      life: 3000,
    });
  } catch (error) {
    console.error("Erreur téléchargement PDF:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Erreur lors du téléchargement du PDF",
      life: 3000,
    });
  } finally {
    isDownloadingPDF.value = false;
  }
};

// Fonctions de zoom
const zoomIn = () => {
  if (pdfZoom.value < 2) {
    pdfZoom.value += 0.1;
  }
};

const zoomOut = () => {
  if (pdfZoom.value > 0.5) {
    pdfZoom.value -= 0.1;
  }
};
</script>

<style scoped>
/* Masquer la scrollbar tout en gardant la fonctionnalité */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animation pour les cartes */
.group:hover {
  transform: translateY(-2px);
}

/* Styles pour le reçu PDF */
.recu-pdf-container {
  font-family: Arial, Helvetica, sans-serif;
  transition: transform 0.2s ease;
}

.recu-pdf {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.recu-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 35px 30px 25px;
  text-align: center;
  border-bottom: 1px solid #eef2f6;
  position: relative;
}

.recu-header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.recu-header h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #1e293b;
}

.recu-subtitle {
  color: #64748b;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.recu-matricule {
  background: rgba(79, 70, 229, 0.1);
  padding: 6px 15px;
  border-radius: 30px;
  display: inline-block;
  margin-top: 15px;
  font-size: 14px;
  color: #4f46e5;
  font-weight: 500;
}

.recu-content {
  padding: 30px;
}

.recu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.recu-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.recu-card h3 {
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px 0;
  text-transform: uppercase;
}

.recu-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.recu-row:last-child {
  border-bottom: none;
}

.recu-label {
  color: #64748b;
  font-size: 13px;
}

.recu-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 13px;
}

.recu-section-title {
  font-size: 16px;
  margin: 20px 0 10px 0;
  font-weight: 600;
  color: #1e293b;
}

.recu-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.recu-table th {
  background: #f1f5f9;
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.recu-table td {
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  font-size: 13px;
}

.recu-text-right {
  text-align: right;
}

.recu-text-center {
  text-align: center;
}

.recu-font-bold {
  font-weight: 600;
}

.recu-empty {
  color: #94a3b8;
  padding: 30px;
}

.recu-total {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #e2e8f0;
}

.recu-total-item {
  text-align: right;
}

.recu-total-label {
  font-size: 12px;
  color: #64748b;
}

.recu-total-value {
  font-size: 18px;
  font-weight: bold;
  color: #1e293b;
}

.recu-paye {
  color: #059669;
}

.recu-reste {
  color: #d97706;
}

.recu-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.recu-footer-label {
  color: #64748b;
  font-size: 12px;
  margin-bottom: 5px;
}

.recu-footer-value {
  font-weight: 600;
  color: #1e293b;
}

.recu-signature {
  text-align: right;
}

.recu-signature-line {
  border-top: 2px dashed #cbd5e1;
  width: 200px;
  margin-top: 10px;
}
</style>
