<!-- pages/candidatures/modifier-[slug].vue -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <!-- En-tête avec Breadcrumb -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Breadcrumb
        :items="[
          { label: 'Tableau de bord', to: '/admin/dashboard' },
          { label: 'Candidatures', to: '/candidatures/etude-dossier' },
          { label: 'Modifier candidature', to: null }
        ]"
        title="Modifier la candidature"
        title-class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        spacing="mb-0"
      />
      <button
        @click="$router.back()"
        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
      >
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Retour
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-500 font-medium">Chargement du dossier...</p>
    </div>

    <!-- Formulaire -->
    <form v-else @submit.prevent="soumettreFormulaire" enctype="multipart/form-data">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
          <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">{{ progression }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            :style="{ width: progression + '%' }"
          ></div>
        </div>
      </div>

      <!-- Stepper -->
      <div class="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        <div
          v-for="(etape, index) in etapes"
          :key="index"
          @click="etapeActive = index"
          class="flex items-center cursor-pointer group min-w-[120px]"
          :class="{ 'opacity-50': index > etapeActive }"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all"
            :class="{
              'bg-indigo-600 text-white': index <= etapeActive,
              'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400': index > etapeActive
            }"
          >
            {{ index + 1 }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ etape.titre }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ etape.sousTitre }}</p>
          </div>
          <svg v-if="index < etapes.length - 1" class="w-5 h-5 mx-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <!-- Étape 1: Identité -->
      <div v-if="etapeActive === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Identité
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom <span class="text-red-500">*</span></label>
              <input v-model="formData.nom" type="text" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Entrez le nom" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom <span class="text-red-500">*</span></label>
              <input v-model="formData.prenom" type="text" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Entrez le prénom" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de jeune fille <span class="text-gray-400 text-xs">(optionnel)</span></label>
              <input v-model="formData.nom_jeune_fille" type="text" class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Nom de jeune fille (si applicable)" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genre <span class="text-red-500">*</span></label>
              <select v-model="formData.genre" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500">
                <option value="">Sélectionnez</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date de naissance <span class="text-red-500">*</span></label>
              <input v-model="formData.date_naissance" type="date" required :max="maxDateNaissance" class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lieu de naissance <span class="text-red-500">*</span></label>
              <input v-model="formData.lieu_naissance" type="text" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Lieu de naissance" />
            </div>

            <div class="md:col-span-2">
              <NationaliteSelector
                v-model="formData.nationalite"
                label="Nationalité"
                :required="true"
                help-text="Sélectionnez la nationalité du candidat"
              />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button @click="etapeActive = 1" type="button" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all">
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 2: Contact -->
      <div v-if="etapeActive === 1" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone 1 <span class="text-red-500">*</span></label>
              <input v-model="formData.tel" type="tel" required :ref="el => initPhoneWidget(el, 'tel', v => formData.tel = v)" class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Numéro togolais ou étranger" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone 2 <span class="text-gray-400 text-xs">(optionnel)</span></label>
              <input v-model="formData.tel2" type="tel" :ref="el => initPhoneWidget(el, 'tel2', v => formData.tel2 = v)" class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Téléphone secondaire" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone 3 <span class="text-gray-400 text-xs">(optionnel)</span></label>
              <input v-model="formData.tel3" type="tel" :ref="el => initPhoneWidget(el, 'tel3', v => formData.tel3 = v)" class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Téléphone supplémentaire" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email <span class="text-red-500">*</span></label>
              <input v-model="formData.email" type="email" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="email@exemple.com" />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button @click="etapeActive = 0" type="button" class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all">Précédent</button>
          <button @click="etapeActive = 2" type="button" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all">Suivant</button>
        </div>
      </div>

      <!-- Étape 3: Parcours & Niveau -->
      <div v-if="etapeActive === 2" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Parcours académique & Niveau
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Niveau : choix libre par l'admin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Niveau visé <span class="text-red-500">*</span></label>
              <select v-model="formData.niveau_id" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500">
                <option value="">Sélectionnez</option>
                <option v-for="niveau in niveaux" :key="niveau.id" :value="niveau.id">{{ niveau.libelle }}</option>
              </select>
            </div>

            <!-- Filière : déduite automatiquement du niveau choisi, pas de sélection manuelle -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filière</label>
              <div class="w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <span v-if="loadingFilieres">Recherche de la filière...</span>
                <span v-else-if="!formData.niveau_id" class="text-gray-400">Choisissez d'abord un niveau</span>
                <span v-else-if="filiereDetectee">{{ filiereDetectee.nom }}</span>
                <span v-else class="text-amber-600">Aucune filière configurée pour ce niveau</span>
              </div>
              <p class="text-[11px] text-gray-500 mt-1">Déduite automatiquement du niveau choisi.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Numéro de table <span class="text-red-500">*</span></label>
              <input
                v-model="formData.numero_table"
                @input="formData.numero_table = formData.numero_table.replace(/[^0-9]/g, '').slice(0, 7)"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="7"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Numéro de table (7 chiffres max)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Année du BAC <span class="text-red-500">*</span></label>
              <input v-model="formData.annee_bac" type="number" min="1990" :max="anneeCourante" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Année" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Série du BAC <span class="text-red-500">*</span></label>
              <select v-model="formData.serie" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500">
                <option value="">Sélectionnez</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F2">F2</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mention au BAC <span class="text-red-500">*</span></label>
              <select v-model="formData.mention_bac" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500">
                <option value="">Sélectionnez</option>
                <option value="Passable">Passable</option>
                <option value="Assez Bien">Assez Bien</option>
                <option value="Bien">Bien</option>
                <option value="Très Bien">Très Bien</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type du dernier diplôme <span class="text-red-500">*</span></label>
              <select v-model="formData.type_diplome" required class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500">
                <option value="">Sélectionnez</option>
                <option value="Bac 2">Bac 2</option>
                <option value="BTS">BTS</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Établissement</label>
              <input v-model="formData.etablissement_diplome" type="text" class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" placeholder="Établissement" />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button @click="etapeActive = 1" type="button" class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all">Précédent</button>
          <button @click="etapeActive = 3" type="button" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all">Suivant</button>
        </div>
      </div>

      <!-- Étape 4: Documents (dynamiques, configurés dans Paramètre > Niveaux) -->
      <div v-if="etapeActive === 3" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documents
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div v-if="!formData.niveau_id" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p class="text-sm text-amber-700 dark:text-amber-400 font-medium">⚠️ Veuillez d'abord sélectionner un niveau (Étape 3) pour afficher les documents requis.</p>
          </div>
          <div v-else-if="loadingDocuments" class="p-4 text-sm text-gray-500">Chargement des pièces à fournir...</div>
          <div v-else-if="applicableDocs.length === 0" class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500">Aucun document n'est configuré pour ce niveau/filière.</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="doc in applicableDocs" :key="doc.document_key" class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ doc.nom_affichage }}
                <span v-if="doc.is_obligatoire" class="text-red-500">*</span>
                <span v-else class="text-gray-400 text-xs">(optionnel)</span>
              </label>
              <p v-if="doc.description" class="text-xs text-gray-500">{{ doc.description }}</p>
              <MultipleFileUpload
                v-if="doc.is_multiple"
                v-model="documentFiles[doc.document_key]"
                :existingFiles="existingDocValue(doc)"
                :accept="acceptFor(doc.accepted_formats)"
              />
              <FileUpload
                v-else
                :id="doc.document_key"
                v-model="documentFiles[doc.document_key]"
                :existingUrl="existingDocValue(doc)"
                :accept="acceptFor(doc.accepted_formats)"
              />
            </div>
          </div>
          <div class="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/50 rounded-xl">
            <p class="text-xs text-amber-700 dark:text-amber-400 font-medium italic">Note : les fichiers déjà enregistrés ne seront remplacés que si vous en sélectionnez de nouveaux.</p>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button @click="etapeActive = 2" type="button" class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all">Précédent</button>
          <button @click="etapeActive = 4" type="button" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all">Suivant</button>
        </div>
      </div>

      <!-- Étape 5: Tuteur(s) répétables -->
      <div v-if="etapeActive === 4" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Parent(s) ou tuteur(s)
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div v-for="(tuteur, index) in tuteurs" :key="tuteur._uid" class="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ index === 0 ? 'Tuteur / Parent 1' : `Tuteur / Parent ${index + 1}` }}</h3>
              <button v-if="tuteurs.length > 1" @click="retirerTuteur(index)" type="button" class="text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-full transition-colors">Retirer</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nom <span class="text-red-500">*</span></label>
                <input v-model="tuteur.nom" type="text" required class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Nom" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom <span class="text-red-500">*</span></label>
                <input v-model="tuteur.prenom" type="text" required class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Prénom" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Profession <span class="text-red-500">*</span></label>
                <input v-model="tuteur.profession" type="text" required class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Profession" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Employeur <span class="text-gray-400">(optionnel)</span></label>
                <input v-model="tuteur.employeur" type="text" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Nom de l'employeur" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span class="text-gray-400">(optionnel)</span></label>
                <input v-model="tuteur.email" type="email" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Email" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone <span class="text-red-500">*</span></label>
                <input v-model="tuteur.tel" type="tel" required :ref="el => initPhoneWidget(el, `tuteur-${tuteur._uid}`, v => tuteur.tel = v)" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Téléphone" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse / Quartier <span class="text-red-500">*</span></label>
                <input v-model="tuteur.adresse" type="text" required class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Adresse / Quartier" />
              </div>
              <div class="md:col-span-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="tuteur.responsable_des_frais" type="checkbox" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Responsable des frais de scolarité</span>
                </label>
              </div>
            </div>
          </div>

          <button @click="ajouterTuteur" type="button" class="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors">
            + Ajouter un autre tuteur/parent
          </button>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button @click="etapeActive = 3" type="button" class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all">Précédent</button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Toast pour les notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Breadcrumb from "~/components/Breadcrumb.vue"
import Toast from 'primevue/toast'
import NationaliteSelector from "~/components/NationaliteSelector.vue"
import FileUpload from "~/components/FileUpload.vue"
import MultipleFileUpload from "~/components/MultipleFileUpload.vue"
import { useFiliereStore } from '~~/stores/filiere'
import { useNiveauStore } from '~~/stores/niveau'
import { useCandidatureStore } from '~~/stores/candidature'
import { useNuxtApp } from '#app'
import { getStorageBaseUrl } from '~/utils/storageUrl'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const toast = useToast()
const filiereStore = useFiliereStore()
const candidatureStore = useCandidatureStore()
const niveauStore = useNiveauStore()
const { $intlTelInput } = useNuxtApp()

// États
const loading = ref(true)
const etapeActive = ref(0)
const isSubmitting = ref(false)
const niveaux = ref([])
const loadingFilieres = ref(false)
const filiereDetectee = ref(null)
const loadingDocuments = ref(false)
const documentRequirements = ref([])
const existingAlbum = ref({})

const getFullUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${getStorageBaseUrl()}/storage/${path}`
}

// Widgets d'indicatif téléphonique — même logique que admin/candidatures/inscription.vue.
const phoneWidgets = {}

const initPhoneWidget = (el, key, onNumberChange) => {
  if (!el) {
    if (phoneWidgets[key]) {
      try { phoneWidgets[key].destroy() } catch (e) { /* déjà détruit */ }
      delete phoneWidgets[key]
    }
    return
  }
  if (phoneWidgets[key] || !$intlTelInput) return

  const iti = $intlTelInput(el, {
    initialCountry: 'tg',
    separateDialCode: true,
    useFullscreenPopup: false,
    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input/dist/js/utils.js',
  })
  phoneWidgets[key] = iti

  const sync = () => onNumberChange(iti.getNumber() || el.value)
  el.addEventListener('blur', sync)
  el.addEventListener('countrychange', sync)
}

// Reflète le mapping $mapKeyForUpload de CandidatureController::updateOrCreateAlbum.
const docKeyFieldOverrides = {
  lettre: 'lettre_file',
  naissance: 'naissance_file',
  diplome: 'diplome_file',
  nationalite: 'nationalite_file',
  photo: 'photo_identite_file',
  certificat_medical: 'certificat_medical_file',
  cv: 'cv_file',
  coupon: 'coupon_file',
  releve_bac1_path: 'releve_bac1',
  releve_bac2_path: 'releve_bac2',
}

const acceptFor = (format) => {
  if (format === 'image') return '.jpg,.jpeg,.png'
  if (format === 'pdf') return '.pdf'
  return '.pdf,.jpg,.jpeg,.png'
}

// Valeur déjà enregistrée pour un document donné (URL complète ou tableau d'URLs).
const existingDocValue = (doc) => {
  const raw = existingAlbum.value?.[doc.document_key]
  if (!raw) return doc.is_multiple ? [] : ''

  if (doc.is_multiple) {
    let paths = raw
    if (typeof raw === 'string') {
      try { paths = JSON.parse(raw) } catch (e) { paths = [raw] }
    }
    return (Array.isArray(paths) ? paths : [paths]).filter(Boolean).map(getFullUrl)
  }

  return getFullUrl(raw)
}

// Données du formulaire — mêmes champs que le formulaire d'ajout.
const formData = reactive({
  nom: '',
  prenom: '',
  nom_jeune_fille: '',
  genre: '',
  date_naissance: '',
  lieu_naissance: '',
  nationalite: '',
  email: '',
  tel: '',
  tel2: '',
  tel3: '',
  niveau_id: '',
  filiere_id: '',
  numero_table: '',
  annee_bac: '',
  serie: '',
  mention_bac: '',
  type_diplome: '',
  etablissement_diplome: '',
})

// Documents dynamiques : { [document_key]: File | File[] }
const documentFiles = reactive({})

// Tuteurs répétables (chargés depuis la candidature, ou un tuteur vide par défaut).
let prochainTuteurUid = 1
const creerTuteurVide = () => ({
  _uid: prochainTuteurUid++,
  nom: '', prenom: '', profession: '', employeur: '', email: '', tel: '', adresse: '', responsable_des_frais: false
})

const tuteurs = ref([creerTuteurVide()])

const ajouterTuteur = () => {
  tuteurs.value.push(creerTuteurVide())
}
const retirerTuteur = (index) => {
  tuteurs.value.splice(index, 1)
}

// Étapes
const etapes = [
  { titre: 'Identité', sousTitre: 'Informations personnelles' },
  { titre: 'Contact', sousTitre: 'Téléphones et email' },
  { titre: 'Parcours', sousTitre: 'Niveau et académique' },
  { titre: 'Documents', sousTitre: 'Pièces jointes' },
  { titre: 'Tuteur(s)', sousTitre: 'Parents ou tuteurs' },
]

const progression = computed(() => ((etapeActive.value + 1) / etapes.length) * 100)

const anneeCourante = computed(() => new Date().getFullYear())

const maxDateNaissance = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 10)
  return d.toISOString().split('T')[0]
})

// Documents applicables au niveau/filière actuellement sélectionnés.
const applicableDocs = computed(() => {
  if (!formData.niveau_id) return []
  return documentRequirements.value.filter(req =>
    String(req.niveau_id) === String(formData.niveau_id) &&
    (req.filiere_id === null || String(req.filiere_id) === String(formData.filiere_id))
  )
})

// Quand le niveau change : on déduit la filière automatiquement et on recharge les
// documents requis pour ce niveau (même principe que la page d'ajout).
watch(() => formData.niveau_id, async (newNiveauId) => {
  filiereDetectee.value = null

  if (!newNiveauId) {
    documentRequirements.value = []
    return
  }

  loadingFilieres.value = true
  loadingDocuments.value = true

  try {
    await filiereStore.fetchFilieres(newNiveauId)
    const filieresDuNiveau = filiereStore.filieres || []
    if (filieresDuNiveau.length > 0) {
      filiereDetectee.value = filieresDuNiveau[0]
      formData.filiere_id = filieresDuNiveau[0].id
    }
  } catch (error) {
    console.error('Erreur récupération filière:', error)
  } finally {
    loadingFilieres.value = false
  }

  try {
    documentRequirements.value = await niveauStore.fetchDocumentRequirements(newNiveauId)
  } catch (error) {
    console.error('Erreur récupération documents requis:', error)
    documentRequirements.value = []
  } finally {
    loadingDocuments.value = false
  }
})

// Initialise documentFiles à chaque changement de la liste de documents applicables.
watch(applicableDocs, (docs) => {
  const clesActuelles = docs.map(d => d.document_key)
  Object.keys(documentFiles).forEach(key => {
    if (!clesActuelles.includes(key)) delete documentFiles[key]
  })
  docs.forEach(doc => {
    if (!(doc.document_key in documentFiles)) {
      documentFiles[doc.document_key] = doc.is_multiple ? [] : null
    }
  })
})

// Charge la candidature existante et pré-remplit le formulaire.
const chargerCandidature = async () => {
  loading.value = true
  try {
    await niveauStore.fetchNiveaux()
    niveaux.value = niveauStore.niveaux || []

    const data = await candidatureStore.fetchCandidatureDetail(slug)

    Object.keys(formData).forEach(key => {
      if (data[key] === undefined || data[key] === null) return
      if (key === 'date_naissance') {
        formData[key] = String(data[key]).split('T')[0].split(' ')[0]
      } else {
        formData[key] = data[key]
      }
    })

    if (data.album) {
      existingAlbum.value = data.album
      if (!formData.type_diplome && data.album.type_diplome) {
        formData.type_diplome = data.album.type_diplome
      }
    }

    // Tuteurs : `tuteurs` (MorphMany) et `tuteur` (MorphOne) pointent vers la même table,
    // donc `tuteurs` contient toujours l'historique complet, quel que soit le formulaire
    // qui a créé la candidature à l'origine.
    const tuteursExistants = data.tuteurs && data.tuteurs.length > 0
      ? data.tuteurs
      : (data.tuteur ? [data.tuteur] : [])

    if (tuteursExistants.length > 0) {
      tuteurs.value = tuteursExistants.map(t => ({
        _uid: prochainTuteurUid++,
        nom: t.nom || '',
        prenom: t.prenom || '',
        profession: t.profession || '',
        employeur: t.employeur || '',
        email: t.email || '',
        tel: t.tel || '',
        adresse: t.adresse || '',
        responsable_des_frais: Boolean(t.responsable_des_frais),
      }))
    }
  } catch (error) {
    console.error('Erreur chargement candidature:', error)
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger le dossier', life: 5000 })
  } finally {
    loading.value = false
  }
}

onMounted(chargerCandidature)

// Vérifie que tous les champs obligatoires sont bien remplis avant l'envoi.
const validerAvantEnvoi = () => {
  const manquants = []

  if (!formData.nom) manquants.push('Nom')
  if (!formData.prenom) manquants.push('Prénom')
  if (!formData.genre) manquants.push('Genre')
  if (!formData.date_naissance) manquants.push('Date de naissance')
  if (!formData.lieu_naissance) manquants.push('Lieu de naissance')
  if (!formData.nationalite) manquants.push('Nationalité')
  if (!formData.tel) manquants.push('Téléphone 1')
  if (!formData.email) manquants.push('Email')
  if (!formData.niveau_id) manquants.push('Niveau')
  if (!formData.numero_table || formData.numero_table.length > 7) manquants.push('Numéro de table (1 à 7 chiffres)')
  if (!formData.annee_bac) manquants.push('Année du BAC')
  if (!formData.serie) manquants.push('Série du BAC')
  if (!formData.mention_bac) manquants.push('Mention au BAC')
  if (!formData.type_diplome) manquants.push('Type du dernier diplôme')

  tuteurs.value.forEach((t, i) => {
    if (!t.nom || !t.prenom || !t.profession || !t.tel || !t.adresse) {
      manquants.push(`Tuteur ${i + 1} : champs obligatoires incomplets`)
    }
  })

  applicableDocs.value.forEach(doc => {
    if (!doc.is_obligatoire) return
    const hasNewFile = doc.is_multiple
      ? (documentFiles[doc.document_key] || []).length > 0
      : Boolean(documentFiles[doc.document_key])
    const hasExistingFile = doc.is_multiple
      ? existingDocValue(doc).length > 0
      : Boolean(existingDocValue(doc))
    if (!hasNewFile && !hasExistingFile) manquants.push(doc.nom_affichage)
  })

  if (manquants.length > 0) {
    toast.add({
      severity: 'error',
      summary: 'Champs manquants',
      detail: `Veuillez compléter : ${manquants.join(', ')}`,
      life: 7000
    })
    return false
  }

  return true
}

// Soumettre le formulaire
const soumettreFormulaire = async () => {
  if (!validerAvantEnvoi()) return

  isSubmitting.value = true

  try {
    const formDataToSend = new FormData()

    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key])
      }
    })

    tuteurs.value.forEach((tuteur, index) => {
      Object.keys(tuteur).forEach(key => {
        if (key === '_uid') return
        const value = tuteur[key]
        if (key === 'responsable_des_frais') {
          formDataToSend.append(`tuteurs[${index}][${key}]`, value ? '1' : '0')
        } else if (value) {
          formDataToSend.append(`tuteurs[${index}][${key}]`, value)
        }
      })
    })

    applicableDocs.value.forEach(doc => {
      const fieldName = docKeyFieldOverrides[doc.document_key] || doc.document_key
      const value = documentFiles[doc.document_key]
      if (!value) return

      if (doc.is_multiple) {
        (value || []).forEach((file, index) => {
          formDataToSend.append(`${fieldName}[${index}]`, file)
        })
      } else {
        formDataToSend.append(fieldName, value)
      }
    })

    const response = await candidatureStore.updateByAdmin(slug, formDataToSend)

    if (response.success) {
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Candidature mise à jour avec succès', life: 5000 })
      setTimeout(() => {
        navigateTo('/candidatures/etude-dossier')
      }, 1500)
    }
  } catch (error) {
    console.error('Erreur mise à jour:', error)

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      Object.keys(errors).forEach(key => {
        toast.add({ severity: 'error', summary: 'Erreur de validation', detail: errors[key][0], life: 5000 })
      })
    } else {
      toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Erreur lors de la mise à jour', life: 5000 })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
