<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-[600px]"
    >
      <div
        class="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
      ></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Header avec breadcrumb et boutons PDF -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <Breadcrumb
          :items="[
            { label: 'Négociations', to: '/admin/negociations' },
            { label: 'Détails', to: null },
          ]"
          :title="etudiantNomComplet"
          title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
          spacing="mb-4"
        />

        <div class="flex items-center gap-2">
          <!-- Bouton visualisation PDF -->

          <!-- Bouton téléchargement PDF -->
      
        </div>
      </div>

      <!-- Header info avec statut corrigé -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div
          class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
        >
          <div class="flex items-start gap-4">
            <div class="relative flex-shrink-0">
              <div
                class="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg"
              >
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div
                class="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"
              ></div>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <h1
                  class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {{ frais?.etudiant?.nom }} {{ frais?.etudiant?.prenom }}
                </h1>
              </div>
              <div
                class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2"
              >
                <div class="flex items-center gap-1.5">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{{ frais?.frais_scolarite?.niveau?.libelle }}</span>
                </div>
                <span
                  class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"
                ></span>
                <div class="flex items-center gap-1.5">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{{ frais?.annee_scolaire?.nom }}</span>
                </div>
                <span
                  class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"
                ></span>
                <div class="flex items-center gap-1.5">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Créé le {{ formatDate(frais?.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Badge statut corrigé avec computed statutActuel -->
            <div
              :class="[
                'px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 shadow-sm',
                getStatutClass(statutActuel),
              ]"
            >
              <div
                :class="['w-2 h-2 rounded-full', getStatutDot(statutActuel)]"
              ></div>
              <span>{{ getStatutLabel(statutActuel) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats cards - 2 par ligne -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(stat, index) in statsCards"
          :key="index"
          class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <!-- Barre colorée en haut -->
          <div class="h-1.5 w-full" :class="stat.topBarColor"></div>

          <div class="p-5">
            <div class="flex items-start gap-3">
              <!-- Icône -->
              <div
                :class="[
                  'p-3 rounded-xl',
                  stat.bgColor,
                  'group-hover:scale-110 transition-transform duration-300 flex-shrink-0',
                ]"
              >
                <svg
                  class="w-5 h-5"
                  :class="stat.iconColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    :d="stat.iconPath"
                  />
                </svg>
              </div>

              <!-- Contenu principal -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p
                      class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {{ stat.label }}
                    </p>
                    <p
                      class="text-2xl font-bold text-gray-900 dark:text-white mt-0.5"
                    >
                      {{ stat.value }}
                    </p>
                  </div>

                  <!-- Badge de tendance -->
                  <div
                    v-if="stat.trend"
                    class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                    :class="stat.trendBgClass"
                  >
                    <svg
                      class="w-3 h-3"
                      :class="stat.trendIconClass"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        :d="stat.trendIcon"
                      />
                    </svg>
                    <span>{{ stat.trend }}</span>
                  </div>
                </div>

                <!-- Sous-information -->
                <div
                  v-if="stat.subInfo"
                  class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"
                >
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
                  >
                    <span>{{ stat.subInfo.label }} :</span>
                    <span class="font-medium" :class="stat.subInfo.color">{{
                      stat.subInfo.value
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grille d'informations - 2 colonnes égales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Carte étudiant -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden h-full"
        >
          <div
            class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-indigo-950/20 dark:to-transparent"
          >
            <h3
              class="font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profil étudiant
            </h3>
          </div>
          <div class="p-6 space-y-5">
            <div class="flex items-center gap-4">
              <div class="relative flex-shrink-0">
                <div
                  class="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-light shadow-lg"
                >
                  {{ getInitials(frais?.etudiant) }}
                </div>
                <div
                  class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"
                ></div>
              </div>
              <div class="space-y-1.5 flex-1">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Matricule
                </p>
                <p
                  class="font-mono text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/30 px-3 py-1.5 rounded-lg inline-block"
                >
                  {{ frais?.etudiant?.matricule }}
                </p>
              </div>
            </div>

            <div
              class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700"
            >
              <div>
                <p class="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </p>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white break-all"
                >
                  {{ frais?.etudiant?.email }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Téléphone
                </p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ frais?.etudiant?.tel || "Non renseigné" }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/20 p-3 rounded-xl"
            >
              <span class="text-gray-600 dark:text-gray-400">Nationalité</span>
              <span class="font-medium text-gray-900 dark:text-white">{{
                frais?.etudiant?.nationalite || "Non renseignée"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Carte frais -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden h-full"
        >
          <div
            class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/20 dark:to-transparent"
          >
            <h3
              class="font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Détails financiers
            </h3>
          </div>
          <div class="p-6 space-y-5">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Type de paiement</span
              >
              <span
                class="px-3 py-1.5 text-xs font-medium rounded-xl"
                :class="{
                  'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50':
                    frais?.type_paiement === 'tranches_globales',
                  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50':
                    frais?.type_paiement === 'negociation',
                }"
              >
                {{
                  frais?.type_paiement === "tranches_globales"
                    ? "Tranches globales"
                    : "Négociation"
                }}
              </span>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400"
                  >Montant initial</span
                >
                <span class="font-mono text-gray-900 dark:text-white">{{
                  formatMontant(frais?.montant_initial)
                }}</span>
              </div>

              <div
                class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700"
              >
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Montant après bourse</span
                >
                <span
                  class="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400"
                  >{{ formatMontant(frais?.montant_apres_bourse) }}</span
                >
              </div>
            </div>

            <div
              v-if="frais?.bourse_etudiant?.bourse"
              class="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30"
            >
              <div class="flex items-start gap-3">
                <div
                  class="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 019.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <p
                    class="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1"
                  >
                    Bourse appliquée
                  </p>
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ frais.bourse_etudiant.bourse.nom }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {{
                      frais.bourse_etudiant.bourse.type === "pourcentage"
                        ? frais.bourse_etudiant.bourse.valeur + "% de réduction"
                        : formatMontant(frais.bourse_etudiant.bourse.valeur) +
                          " de réduction"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carte commentaire - Prend toute la largeur si présent -->
        <div
          v-if="frais?.echeancier?.commentaire"
          class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden lg:col-span-2"
        >
          <div
            class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-transparent"
          >
            <h3
              class="font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Commentaire
            </h3>
          </div>
          <div class="p-6">
            <div class="relative">
              <svg
                class="absolute top-0 left-0 w-8 h-8 text-amber-200 dark:text-amber-800/30 -translate-x-2 -translate-y-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"
                />
              </svg>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed pl-6">
                "{{ frais.echeancier.commentaire }}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Échéances -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <!-- Toolbar -->
        <div
          class="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5"
        >
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
              <svg
                class="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Échéances de paiement
              </h3>
              <p class="text-sm text-gray-500">
                {{ echeances.length }} échéance{{
                  echeances.length > 1 ? "s" : ""
                }}
                au total
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Sélecteur de colonnes -->
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
                      v-for="col in echeanceColumns"
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
                        {{ col.label }}
                      </span>
                    </div>
                  </div>
                </template>
              </VDropdown>
            </client-only>

            <!-- Ajouter paiement -->
            <button
              v-if="resteAPayer > 0"
              @click="openPaiementModal()"
              class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              Nouveau paiement
            </button>
          </div>
        </div>

        <!-- Table des échéances -->
        <div class="overflow-x-auto">
          <Vue3Datatable
            :columns="visibleEcheanceColumns"
            :rows="echeances"
            :search="searchQuery"
            :per-page="itemsPerPage"
            skin="bh-table-striped bh-table-hover"
          >
            <template #libelle="{ value }">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 font-medium text-sm"
                >
                  {{ value.ordre }}
                </div>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  value.libelle
                }}</span>
              </div>
            </template>

            <template #montant="{ value }">
              <span class="font-mono text-gray-900 dark:text-white">{{
                formatMontant(value.montant)
              }}</span>
            </template>

            <template #montant_paye="{ value }">
              <span class="font-mono text-emerald-600">{{
                formatMontant(value.montant_paye)
              }}</span>
            </template>

            <template #reste_a_payer="{ value }">
              <span class="font-mono text-gray-900 dark:text-white">{{
                formatMontant(value.reste_a_payer)
              }}</span>
            </template>

            <template #date_limite="{ value }">
              <div
                class="flex items-center gap-1.5"
                :class="{ 'text-red-600': estEnRetard(value) }"
              >
                <svg
                  v-if="estEnRetard(value)"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ formatDate(value.date_limite) }}</span>
              </div>
            </template>

            <template #statut="{ value }">
              <span
                class="px-3 py-1.5 text-xs font-medium rounded-xl"
                :class="{
                  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50':
                    value.statut === 'paye',
                  'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50':
                    value.statut === 'partiel',
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600':
                    value.statut === 'en_attente',
                  'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800/50':
                    value.statut === 'en_retard',
                }"
              >
                {{ getEcheanceStatut(value.statut) }}
              </span>
            </template>

            <template #action="{ value }">
              <div class="flex justify-center">
                <button
                  v-if="value.reste_a_payer > 0"
                  @click="openPaiementModal(value)"
                  class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>

        <!-- Pied de tableau -->
        <div
          class="flex flex-wrap justify-end gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Total à payer:</span>
            <span
              class="font-mono font-semibold text-gray-900 dark:text-white"
              >{{ formatMontant(frais?.montant_apres_bourse) }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Total payé:</span>
            <span class="font-mono font-semibold text-emerald-600">{{
              formatMontant(totalPaye)
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Reste:</span>
            <span
              class="font-mono font-semibold"
              :class="resteAPayer === 0 ? 'text-emerald-600' : 'text-amber-600'"
            >
              {{ formatMontant(resteAPayer) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Historique des paiements avec accordéon (fermé par défaut) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <div
          @click="togglePaiements"
          class="flex items-center gap-3 mb-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -m-2 rounded-lg transition-colors"
        >
          <div class="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Historique des paiements
            </h3>
            <p class="text-sm text-gray-500">
              {{ paiements.length }} paiement{{
                paiements.length > 1 ? "s" : ""
              }}
              enregistré{{ paiements.length > 1 ? "s" : "" }}
            </p>
          </div>
          <!-- Icône de déploiement -->
          <svg
            class="w-6 h-6 text-gray-400 transition-transform duration-300"
            :class="{ 'rotate-180': showPaiements }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <!-- Contenu avec transition (fermé par défaut) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[2000px]"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-[2000px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-show="showPaiements" class="overflow-hidden">
            <div v-if="paiements.length === 0" class="p-12 text-center">
              <div
                class="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4"
              >
                <svg
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4
                class="text-lg font-medium text-gray-900 dark:text-white mb-1"
              >
                Aucun paiement
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Aucun paiement n'a encore été enregistré pour cette négociation.
              </p>
              <button
                v-if="resteAPayer > 0"
                @click="openPaiementModal()"
                class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
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
                Enregistrer un premier paiement
              </button>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="p in paiements"
                :key="p.id"
                class="p-4 bg-gray-50 dark:bg-gray-700/20 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="relative flex-shrink-0">
                      <div
                        class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center"
                      >
                        <svg
                          class="w-6 h-6 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div
                        class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"
                      ></div>
                    </div>
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <p
                          class="font-mono text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ p.reference || "Sans référence" }}
                        </p>
                        <span class="text-xs text-gray-400">•</span>
                        <p class="text-xs text-gray-500">
                          {{ formatDate(p.created_at) }}
                        </p>
                      </div>
                      <div class="flex items-center gap-2 text-sm">
                        <span
                          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300"
                        >
                          {{ getModePaiementLabel(p.mode_paiement) }}
                        </span>
                        <span class="text-xs text-gray-400">•</span>
                        <span class="text-xs text-gray-500"
                          >Échéance: {{ getEcheanceLabel(p.payable_id) }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xl font-bold font-mono text-emerald-600">
                      {{ formatMontant(p.montant) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Modal de paiement -->
    <TransitionRoot appear :show="showPaiementModal" as="template">
      <Dialog 
    v-model:visible="showPDFModal" 
    modal 
    header="Aperçu du reçu"
    :style="{ width: '90vw', maxWidth: '1200px' }"
    :dismissableMask="true"
    class="pdf-preview-modal"
    :breakpoints="{ '640px': '90vw' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <div class="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span class="font-semibold text-gray-900 dark:text-white">Reçu de paiement - {{ pdfEtudiant?.nom_complet || 'Étudiant' }}</span>
      </div>
    </template>

    <div class="flex flex-col h-[80vh]">
      <!-- Contrôles du PDF -->
      <div class="flex justify-between items-center mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex items-center gap-2">
          <Button 
            icon="pi pi-minus" 
            @click="zoomOut" 
            :disabled="pdfZoom <= 0.5"
            class="p-button-rounded p-button-text"
          />
          <span class="text-sm font-medium">{{ Math.round(pdfZoom * 100) }}%</span>
          <Button 
            icon="pi pi-plus" 
            @click="zoomIn" 
            :disabled="pdfZoom >= 2"
            class="p-button-rounded p-button-text"
          />
        </div>
        <div class="flex items-center gap-2">
          <Button 
            label="Télécharger" 
            icon="pi pi-download" 
            @click="downloadPDF"
            :loading="isDownloadingPDF"
            class="p-button-success"
          />
          <Button 
            label="Fermer" 
            icon="pi pi-times" 
            @click="showPDFModal = false"
            class="p-button-secondary"
          />
        </div>
      </div>

      <!-- Aperçu PDF -->
      <div class="flex-1 overflow-auto bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <div id="pdf-preview-content" class="bg-white shadow-lg mx-auto" :style="{ transform: `scale(${pdfZoom})`, transformOrigin: 'top center', width: '210mm', minHeight: '297mm' }">
          <!-- Contenu du PDF adapté du design négociation -->
          <div class="p-8" v-if="pdfEtudiant && pdfPaiements.length">
            <!-- En-tête avec breadcrumb style -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">Reçu de paiement</p>
                <h1 class="text-2xl font-bold text-gray-900">DÉTAILS DES PAIEMENTS</h1>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">N° {{ pdfNumeroRecu }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(new Date()) }}</p>
              </div>
            </div>

            <!-- Header info avec statut -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div class="flex items-start gap-4">
                  <div class="relative flex-shrink-0">
                    <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div class="flex flex-wrap items-center gap-3">
                      <h1 class="text-2xl font-bold text-gray-900">
                        {{ pdfEtudiant.nom_complet }}
                      </h1>
                    </div>
                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{{ pdfEtudiant.niveau || 'N/A' }}</span>
                      </div>
                      <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Matricule: {{ pdfEtudiant.matricule }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <!-- Badge statut -->
                  <div class="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>Payé</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats cards - 2 par ligne -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <!-- Carte Total -->
              <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div class="h-1.5 w-full bg-indigo-500"></div>
                <div class="p-5">
                  <div class="flex items-start gap-3">
                    <div class="p-3 rounded-xl bg-indigo-50 flex-shrink-0">
                      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total à payer</p>
                      <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ formatMontant(pdfTotalAPayer) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Carte Payé -->
              <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div class="h-1.5 w-full bg-emerald-500"></div>
                <div class="p-5">
                  <div class="flex items-start gap-3">
                    <div class="p-3 rounded-xl bg-emerald-50 flex-shrink-0">
                      <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Déjà payé</p>
                      <p class="text-2xl font-bold text-emerald-600 mt-0.5">{{ formatMontant(pdfTotalPaye) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grille d'informations étudiant -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <!-- Carte étudiant -->
              <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-indigo-50/50">
                  <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profil étudiant
                  </h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="relative flex-shrink-0">
                      <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl font-light shadow-lg">
                        {{ getInitials(pdfEtudiant) }}
                      </div>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">Matricule</p>
                      <p class="font-mono text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg">
                        {{ pdfEtudiant.matricule }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <p class="text-xs text-gray-500 mb-1 flex items-center gap-1">Email</p>
                      <p class="text-sm font-medium text-gray-900">{{ pdfEtudiant.email || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1 flex items-center gap-1">Téléphone</p>
                      <p class="text-sm font-medium text-gray-900">{{ pdfEtudiant.telephone || 'Non renseigné' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Carte résumé -->
              <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-50/50">
                  <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Résumé
                  </h3>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Type de paiement</span>
                    <span class="px-3 py-1.5 text-xs font-medium rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                      Négociation
                    </span>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Montant initial</span>
                      <span class="font-mono text-gray-900">{{ formatMontant(pdfMontantInitial) }}</span>
                    </div>
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span class="text-sm font-medium text-gray-700">Montant après bourse</span>
                      <span class="font-mono text-xl font-bold text-indigo-600">{{ formatMontant(pdfMontantApresBourse) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Échéances -->
            <div class="bg-white rounded-xl shadow p-4 mb-6">
              <div class="flex items-center gap-3 mb-5">
                <div class="p-2.5 bg-indigo-50 rounded-xl">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Échéances de paiement</h3>
                  <p class="text-sm text-gray-500">{{ pdfEcheances.length }} échéance{{ pdfEcheances.length > 1 ? 's' : '' }} au total</p>
                </div>
              </div>

              <!-- Table des échéances -->
              <table class="w-full">
                <thead>
                  <tr class="border-b-2 border-gray-200">
                    <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                    <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payé</th>
                    <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reste</th>
                    <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date limite</th>
                    <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="e in pdfEcheances" :key="e.id" class="border-b border-gray-100">
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-medium text-sm">
                          {{ e.ordre }}
                        </div>
                        <span class="font-medium text-gray-900">{{ e.libelle }}</span>
                      </div>
                    </td>
                    <td class="py-3 font-mono text-gray-900">{{ formatMontant(e.montant) }}</td>
                    <td class="py-3 font-mono text-emerald-600">{{ formatMontant(e.montant_paye || 0) }}</td>
                    <td class="py-3 font-mono text-gray-900">{{ formatMontant(e.reste_a_payer) }}</td>
                    <td class="py-3">{{ formatDate(e.date_limite) }}</td>
                    <td class="py-3">
                      <span class="px-3 py-1.5 text-xs font-medium rounded-xl" :class="{
                        'bg-emerald-50 text-emerald-700 border border-emerald-200': e.statut === 'paye',
                        'bg-amber-50 text-amber-700 border border-amber-200': e.statut === 'partiel',
                        'bg-gray-100 text-gray-600 border border-gray-200': e.statut === 'en_attente',
                        'bg-red-50 text-red-700 border border-red-200': e.statut === 'en_retard',
                      }">
                        {{ getEcheanceStatut(e.statut) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pied de tableau -->
              <div class="flex flex-wrap justify-end gap-6 mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Total à payer:</span>
                  <span class="font-mono font-semibold text-gray-900">{{ formatMontant(pdfMontantApresBourse) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Total payé:</span>
                  <span class="font-mono font-semibold text-emerald-600">{{ formatMontant(pdfTotalPaye) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">Reste:</span>
                  <span class="font-mono font-semibold text-amber-600">{{ formatMontant(pdfResteAPayer) }}</span>
                </div>
              </div>
            </div>

            <!-- Historique des paiements -->
            <div class="bg-white rounded-xl shadow p-4">
              <div class="flex items-center gap-3 mb-5">
                <div class="p-2.5 bg-indigo-50 rounded-xl">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Historique des paiements</h3>
                  <p class="text-sm text-gray-500">{{ pdfPaiements.length }} paiement{{ pdfPaiements.length > 1 ? 's' : '' }} enregistré{{ pdfPaiements.length > 1 ? 's' : '' }}</p>
                </div>
              </div>

              <div v-if="pdfPaiements.length === 0" class="p-12 text-center">
                <div class="w-24 h-24 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-medium text-gray-900 mb-1">Aucun paiement</h4>
                <p class="text-sm text-gray-500">Aucun paiement n'a encore été enregistré.</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="p in pdfPaiements" :key="p.id" class="p-4 bg-gray-50 rounded-xl">
                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <div class="relative flex-shrink-0">
                        <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="font-mono text-sm font-medium text-gray-900">{{ p.reference || 'Sans référence' }}</p>
                          <span class="text-xs text-gray-400">•</span>
                          <p class="text-xs text-gray-500">{{ formatDate(p.created_at) }}</p>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                          <span class="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                            {{ getModePaiementLabel(p.mode_paiement) }}
                          </span>
                          <span class="text-xs text-gray-400">•</span>
                          <span class="text-xs text-gray-500">Échéance: {{ getEcheanceLabel(p.payable_id) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xl font-bold font-mono text-emerald-600">{{ formatMontant(p.montant) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mentions légales -->
            <div class="text-sm text-gray-500 text-center mt-8 pt-8 border-t border-gray-200">
              <p>Ce reçu est délivré à titre d'information et ne constitue pas une facture officielle.</p>
              <p>Pour toute réclamation, veuillez contacter le service financier.</p>
            </div>

            <!-- Cachet et signature -->
            <div class="flex justify-between mt-12">
              <div>
                <p class="font-semibold text-gray-900">Le caissier,</p>
                <p class="mt-8 text-gray-700">____________________</p>
              </div>
              <div class="text-center">
                <p class="font-semibold text-gray-900">Cachet de l'établissement</p>
                <div class="mt-4 w-32 h-32 border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center text-gray-400">Cachet</div>
              </div>
            </div>
          </div>
          
          <!-- Message si pas de données -->
          <div v-else class="p-8 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>Aucune donnée de paiement disponible</p>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useNegociationStore } from "~~/stores/negociation";
// Importer html2pdf de façon dynamique pour éviter les problèmes avec Nuxt
let html2pdf = null;
if (process.client) {
  import("html2pdf.js").then((module) => {
    html2pdf = module.default;
  });
}

const { $toastr } = useNuxtApp();
const route = useRoute();
const fraisId = route.params.id;
const negociationStore = useNegociationStore();

// États
const isLoading = ref(true);
const isSaving = ref(false);
const showPaiementModal = ref(false);
const showPaiements = ref(false); // Fermé par défaut
const selectedEcheance = ref(null);
const frais = ref(null);
const echeances = ref([]);
const paiements = ref([]);
const searchQuery = ref("");
const itemsPerPage = ref(10);
const isDownloadingPDF = ref(false);

const pdfEtudiant = ref(null);
const pdfEcheances = ref([]);
const pdfPaiements = ref([]);
const pdfTotalPaye = ref(0);
const pdfTotalAPayer = ref(0);
const pdfResteAPayer = ref(0);
const pdfMontantInitial = ref(0);
const pdfMontantApresBourse = ref(0);
const pdfNumeroRecu = ref('');

// Formulaire de paiement
const paiementForm = ref({
  echeance_id: "",
  montant: "",
  mode_paiement: "especes",
  reference: "",
});

// Colonnes du tableau des échéances
const echeanceColumns = ref([
  { field: "libelle", title: "Échéance", visible: true },
  { field: "montant", title: "Montant", visible: true },
  { field: "montant_paye", title: "Payé", visible: true },
  { field: "reste_a_payer", title: "Reste", visible: true },
  { field: "date_limite", title: "Date limite", visible: true },
  { field: "statut", title: "Statut", visible: true },
  { field: "action", title: "Actions", visible: true },
]);

const visibleEcheanceColumns = computed(() =>
  echeanceColumns.value.filter((c) => c.visible),
);

// Modes de paiement
const modesPaiement = [
  {
    value: "especes",
    label: "Espèces",
    iconPath:
      "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    value: "banque",
    label: "Banque",
    iconPath: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4v3H3v-3z",
  },
  {
    value: "semoa",
    label: "SEMOA",
    iconPath:
      "M12 18h.01M8 21h8a4 4 0 004-4V7a4 4 0 00-4-4H8a4 4 0 00-4 4v10a4 4 0 004 4z",
  },
  {
    value: "caisse",
    label: "Caisse",
    iconPath:
      "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
];

// Méthodes pour les statuts
const getStatutClass = (statut) => {
  const classes = {
    en_cours:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50",
    solde:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50",
    en_retard:
      "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
  };
  return (
    classes[statut] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  );
};

const getStatutDot = (statut) => {
  const dots = {
    en_cours: "bg-amber-500",
    solde: "bg-emerald-500",
    en_retard: "bg-red-500",
  };
  return dots[statut] || "bg-gray-500";
};

const getStatutLabel = (statut) => {
  const labels = {
    en_cours: "En cours",
    solde: "Soldé",
    en_retard: "En retard",
  };
  return labels[statut] || statut;
};

// Computed pour le statut actuel (mis à jour en temps réel)
const statutActuel = computed(() => {
  if (!frais.value) return "en_cours";

  // Si tout est payé, c'est soldé
  if (resteAPayer.value <= 0) return "solde";

  // Vérifier s'il y a des échéances en retard
  const aDesEcheancesEnRetard = echeances.value.some((e) => {
    const dateLimite = new Date(e.date_limite);
    const aujourdHui = new Date();
    return dateLimite < aujourdHui && e.reste_a_payer > 0;
  });

  if (aDesEcheancesEnRetard) return "en_retard";

  return "en_cours";
});

// Computed
const etudiantNomComplet = computed(() =>
  frais.value?.etudiant
    ? `${frais.value.etudiant.nom} ${frais.value.etudiant.prenom}`
    : "",
);

// Chargement des données
onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const data = await negociationStore.fetchNegociation(route.params.id);
    frais.value = data;

    if (data.echeances && data.echeances.length > 0) {
      echeances.value = data.echeances.map((e) => ({
        ...e,
        reste_a_payer:
          (parseFloat(e.montant) || 0) - (parseFloat(e.montant_paye) || 0),
      }));

      // Extraire tous les paiements depuis les échéances
      const tousLesPaiements = [];
      data.echeances.forEach((echeance) => {
        if (echeance.paiements && echeance.paiements.length > 0) {
          tousLesPaiements.push(...echeance.paiements);
        }
      });

      // Trier les paiements par date (du plus récent au plus ancien)
      paiements.value = tousLesPaiements.sort(
        (a, b) => new Date(b.date_paiement) - new Date(a.date_paiement),
      );
    } else {
      echeances.value = [];
      paiements.value = [];
    }
  } catch (error) {
    console.error("Erreur chargement:", error);
    $toastr.error("Erreur lors du chargement des données");
  } finally {
    isLoading.value = false;
  }
};

// Calculs
const totalPaye = computed(() => {
  return echeances.value.reduce(
    (sum, e) => sum + (parseFloat(e.montant_paye) || 0),
    0,
  );
});

const resteAPayer = computed(() => {
  return (parseFloat(frais.value?.montant_apres_bourse) || 0) - totalPaye.value;
});

const echeancesWithReste = computed(() => {
  return echeances.value.filter((e) => e.reste_a_payer > 0);
});

const montantMax = computed(() => {
  if (paiementForm.value.echeance_id) {
    const echeance = echeances.value.find(
      (e) => e.id == paiementForm.value.echeance_id,
    );
    return echeance?.reste_a_payer || 0;
  }
  if (selectedEcheance.value) {
    return selectedEcheance.value.reste_a_payer || 0;
  }
  return 0;
});

// Stats cards
const statsCards = computed(() => {
  if (!frais.value) return [];

  const nbEcheancesNonSoldees = echeances.value.filter(
    (e) => e.reste_a_payer > 0,
  ).length;
  const nbEcheancesEnRetard = echeances.value.filter((e) => {
    const dateLimite = new Date(e.date_limite);
    const aujourdHui = new Date();
    return dateLimite < aujourdHui && e.reste_a_payer > 0;
  }).length;

  return [
    {
      label: "Montant total",
      value: formatMontant(frais.value?.montant_apres_bourse),
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      iconColor: "text-indigo-600",
      iconPath:
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      topBarColor: "bg-indigo-500",
      subInfo: {
        label: "Montant initial",
        value: formatMontant(frais.value?.montant_initial),
        color: "text-gray-600",
      },
    },
    {
      label: "Déjà payé",
      value: formatMontant(totalPaye.value),
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      topBarColor: "bg-emerald-500",
      trend: `${Math.round((totalPaye.value / (frais.value?.montant_apres_bourse || 1)) * 100)}%`,
      trendIcon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      trendIconClass: "text-emerald-600",
      trendBgClass:
        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
    },
    {
      label: "Reste à payer",
      value: formatMontant(resteAPayer.value),
      bgColor:
        resteAPayer.value === 0
          ? "bg-emerald-50 dark:bg-emerald-950/30"
          : "bg-amber-50 dark:bg-amber-950/30",
      iconColor:
        resteAPayer.value === 0 ? "text-emerald-600" : "text-amber-600",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      topBarColor: resteAPayer.value === 0 ? "bg-emerald-500" : "bg-amber-500",
      subInfo: {
        label:
          nbEcheancesEnRetard > 0
            ? "Dont échéances en retard"
            : "Échéances restantes",
        value:
          nbEcheancesEnRetard > 0
            ? `${nbEcheancesEnRetard} échéance(s)`
            : `${nbEcheancesNonSoldees} échéance(s)`,
        color: nbEcheancesEnRetard > 0 ? "text-red-600" : "text-amber-600",
      },
    },
    {
      label: "Échéances",
      value: `${echeances.value.length} totale`,
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      iconColor: "text-purple-600",
      iconPath:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      topBarColor: "bg-purple-500",
      subInfo: {
        label: "Non soldées",
        value: `${echeancesWithReste.value.length} échéance(s)`,
        color:
          echeancesWithReste.value.length > 0
            ? "text-amber-600"
            : "text-emerald-600",
      },
    },
  ];
});

// Méthodes utilitaires
const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return "-";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(montant)
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

const getInitials = (etudiant) => {
  if (!etudiant) return "?";
  const nom = etudiant.nom || "";
  const prenom = etudiant.prenom || "";
  return (nom.charAt(0) + prenom.charAt(0)).toUpperCase();
};

const getEcheanceStatut = (statut) => {
  const labels = {
    en_attente: "En attente",
    partiel: "Partiel",
    paye: "Payé",
    en_retard: "En retard",
  };
  return labels[statut] || statut;
};

const getModePaiementLabel = (mode) => {
  const labels = {
    especes: "Espèces",
    banque: "Banque",
    semoa: "SEMOA",
    caisse: "Caisse",
  };
  return labels[mode] || mode;
};

const getEcheanceLabel = (echeanceId) => {
  const echeance = echeances.value.find((e) => e.id === echeanceId);
  return echeance?.libelle || "N/A";
};

const estEnRetard = (echeance) => {
  const dateLimite = new Date(echeance.date_limite);
  const aujourdHui = new Date();
  return dateLimite < aujourdHui && echeance.reste_a_payer > 0;
};

// Gestion de l'accordéon
const togglePaiements = () => {
  showPaiements.value = !showPaiements.value;
};

// Gestion des modales
const openPaiementModal = (echeance = null) => {
  selectedEcheance.value = echeance;
  paiementForm.value = {
    echeance_id: echeance?.id || "",
    montant: echeance?.reste_a_payer || "",
    mode_paiement: "especes",
    reference: "",
  };
  showPaiementModal.value = true;
};

const closePaiementModal = () => {
  showPaiementModal.value = false;
  selectedEcheance.value = null;
  paiementForm.value = {
    echeance_id: "",
    montant: "",
    mode_paiement: "especes",
    reference: "",
  };
};

const savePaiement = async () => {
  // Validation du montant
  if (!paiementForm.value.montant || paiementForm.value.montant <= 0) {
    $toastr.warning("Veuillez saisir un montant valide");
    return;
  }

  // Validation de l'échéance
  const echeanceId = selectedEcheance.value?.id || paiementForm.value.echeance_id;
  if (!echeanceId) {
    $toastr.warning("Veuillez sélectionner une échéance");
    return;
  }

  isSaving.value = true;
  
  try {
    // Récupérer l'échéance sélectionnée
    const echeanceSelectionnee = echeances.value.find(e => e.id == echeanceId);
    if (!echeanceSelectionnee) {
      $toastr.error("Échéance non trouvée");
      return;
    }

    let montantRestant = parseFloat(paiementForm.value.montant);
    const paiementsEffectues = [];
    
    // Trier les échéances par ordre croissant
    const echeancesTriees = [...echeances.value].sort((a, b) => a.ordre - b.ordre);
    
    // Trouver l'index de l'échéance sélectionnée
    const indexDepart = echeancesTriees.findIndex(e => e.id == echeanceId);
    
    // Traiter les échéances à partir de celle sélectionnée
    for (let i = indexDepart; i < echeancesTriees.length && montantRestant > 0; i++) {
      const echeance = echeancesTriees[i];
      const resteEcheance = echeance.reste_a_payer;
      
      if (resteEcheance <= 0) continue; // Échéance déjà payée
      
      // Déterminer le montant à payer pour cette échéance
      const montantAEcheance = Math.min(montantRestant, resteEcheance);
      
      // Préparer les données pour cette échéance
      const paiementData = {
        echeance_id: echeance.id,
        montant: montantAEcheance,
        mode_paiement: paiementForm.value.mode_paiement,
        reference: paiementForm.value.reference || null,
      };

      try {
        // Envoyer la requête pour cette échéance
        await negociationStore.ajouterPaiement(fraisId, paiementData);
        paiementsEffectues.push(echeance.libelle);
        
        montantRestant -= montantAEcheance;
        
        // Message informatif
        if (montantRestant > 0 && i < echeancesTriees.length - 1) {
          $toastr.info(`Paiement de ${formatMontant(montantAEcheance)} effectué sur "${echeance.libelle}". Le reste (${formatMontant(montantRestant)}) sera appliqué à l'échéance suivante.`);
        }
      } catch (error) {
        console.error(`Erreur sur l'échéance ${echeance.libelle}:`, error);
        
        if (paiementsEffectues.length > 0) {
          $toastr.warning(`Paiements partiels effectués sur ${paiementsEffectues.join(', ')}. Une erreur est survenue pour la suite.`);
        } else {
          throw error;
        }
        break;
      }
    }

    // Recharger les données
    await loadData();

    // Message de succès
    if (montantRestant === 0) {
      $toastr.success(`Paiement total de ${formatMontant(paiementForm.value.montant)} réparti sur ${paiementsEffectues.length} échéance(s).`);
    } else {
      $toastr.success(`Paiement partiel de ${formatMontant(parseFloat(paiementForm.value.montant) - montantRestant)} effectué.`);
    }

    closePaiementModal();
  } catch (error) {
    console.error("Erreur paiement:", error);
    $toastr.error(error.response?.data?.error || "Erreur lors de l'enregistrement du paiement");
  } finally {
    isSaving.value = false;
  }
};

// Ajouter ce computed pour afficher l'échéance concernée
const echeanceConcernee = computed(() => {
  if (paiementForm.value.echeance_id) {
    return echeances.value.find(e => e.id == paiementForm.value.echeance_id);
  }
  return selectedEcheance.value;
});


// Exposer les données au template
defineExpose({
  isLoading,
  frais,
  echeances,
  paiements,
  statsCards,
  totalPaye,
  resteAPayer,
  showPaiementModal,
  selectedEcheance,
  paiementForm,
  isSaving,
  showPaiements,
  montantMax,
  echeancesWithReste,
  echeanceColumns,
  visibleEcheanceColumns,
  searchQuery,
  itemsPerPage,
  modesPaiement,
  formatMontant,
  formatDate,
  getInitials,
  getEcheanceStatut,
  getModePaiementLabel,
  getEcheanceLabel,
  estEnRetard,
  getStatutClass,
  getStatutDot,
  getStatutLabel,
  statutActuel,
  openPaiementModal,
  closePaiementModal,
  savePaiement,
  togglePaiements,
});
</script>

<style>
/* Transitions pour l'accordéon */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  max-height: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
