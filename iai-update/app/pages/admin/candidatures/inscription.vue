<!-- pages/admin/candidatures/creer.vue -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 transition-colors">
    <!-- En-tête avec Breadcrumb -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Breadcrumb
        :items="[
          { label: 'Tableau de bord', to: '/admin/dashboard' },
          { label: 'Candidatures', to: '/admin/candidatures' },
          { label: 'Nouvelle candidature', to: null }
        ]"
        title="Nouvelle candidature"
        title-class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        spacing="mb-0"
      />
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="soumettreFormulaire" enctype="multipart/form-data">
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

      <!-- Étape 1: Informations personnelles -->
      <div v-if="etapeActive === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informations personnelles
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nom"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Entrez le nom"
              />
            </div>

            <!-- Prénom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prénom <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.prenom"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Entrez le prénom"
              />
            </div>

            <!-- Nom de jeune fille -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de jeune fille
              </label>
              <input
                v-model="formData.nom_jeune_fille"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Nom de jeune fille (si applicable)"
              />
            </div>

            <!-- Genre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.genre"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              >
                <option value="">Sélectionnez</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <!-- Date de naissance -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de naissance <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.date_naissance"
                type="date"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>

            <!-- Lieu de naissance -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lieu de naissance <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.lieu_naissance"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Lieu de naissance"
              />
            </div>

            <!-- Nationalité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nationalité <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nationalite"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Nationalité"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="email@exemple.com"
              />
            </div>

            <!-- Téléphone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.tel"
                type="tel"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Téléphone principal"
              />
            </div>

            <!-- Téléphone 2 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone 2
              </label>
              <input
                v-model="formData.tel2"
                type="tel"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Téléphone secondaire"
              />
            </div>

            <!-- Téléphone 3 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone 3
              </label>
              <input
                v-model="formData.tel3"
                type="tel"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Téléphone supplémentaire"
              />
            </div>

            <!-- BP -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                BP
              </label>
              <input
                v-model="formData.bp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Boîte postale"
              />
            </div>

            <!-- Fax -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fax
              </label>
              <input
                v-model="formData.fax"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Fax"
              />
            </div>

            <!-- Hobbit -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Centres d'intérêt
              </label>
              <textarea
                v-model="formData.hobbit"
                rows="3"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Vos centres d'intérêt..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            @click="etapeActive = 1"
            type="button"
            class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 2: Informations académiques -->
      <div v-if="etapeActive === 1" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Informations académiques
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Niveau -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Niveau <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.niveau_id"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              >
                <option value="">Sélectionnez</option>
                <option v-for="niveau in niveaux" :key="niveau.id" :value="niveau.id">
                  {{ niveau.libelle }}
                </option>
              </select>
            </div>

            <!-- Filière -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filière <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.filiere_id"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              >
                <option value="">Sélectionnez</option>
                <option v-for="filiere in filieres" :key="filiere.id" :value="filiere.id">
                  {{ filiere.nom }}
                </option>
              </select>
            </div>

            <!-- Numéro de table -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de table
              </label>
              <input
                v-model="formData.numero_table"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Numéro de table"
              />
            </div>

            <!-- Année du bac -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Année du bac <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.annee_bac"
                type="number"
                required
                min="1900"
                max="2099"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Année"
              />
            </div>

            <!-- Série -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Série <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.serie"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Série du bac"
              />
            </div>

            <!-- Type de diplôme -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de diplôme <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.type_diplome"
                required
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              >
                <option value="">Sélectionnez</option>
                <option value="bac1">Bac 1</option>
                <option value="bac2">Bac 2</option>
              </select>
            </div>

            <!-- Lettre de motivation -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lettre de motivation
              </label>
              <textarea
                v-model="formData.lettre_motivation"
                rows="4"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Votre lettre de motivation..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 0"
            type="button"
            class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all"
          >
            Précédent
          </button>
          <button
            @click="etapeActive = 2"
            type="button"
            class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 3: Responsable -->
      <div v-if="etapeActive === 2" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Informations du responsable
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du responsable
              </label>
              <input
                v-model="formData.nom_resp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Nom"
              />
            </div>

            <!-- Prénom responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prénom du responsable
              </label>
              <input
                v-model="formData.prenom_resp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Prénom"
              />
            </div>

            <!-- Profession responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profession
              </label>
              <input
                v-model="formData.profession_resp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Profession"
              />
            </div>

            <!-- Employeur responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employeur
              </label>
              <input
                v-model="formData.employeur_resp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Employeur"
              />
            </div>

            <!-- Email responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email responsable
              </label>
              <input
                v-model="formData.email_resp"
                type="email"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="email@exemple.com"
              />
            </div>

            <!-- Téléphone responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone responsable
              </label>
              <input
                v-model="formData.tel_resp"
                type="tel"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Téléphone"
              />
            </div>

            <!-- Adresse responsable -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse
              </label>
              <input
                v-model="formData.adresse_resp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Adresse complète"
              />
            </div>

            <!-- BP responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                BP
              </label>
              <input
                v-model="formData.bp_resp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Boîte postale"
              />
            </div>

            <!-- Fax responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fax
              </label>
              <input
                v-model="formData.fax_resp"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Fax"
              />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 1"
            type="button"
            class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all"
          >
            Précédent
          </button>
          <button
            @click="etapeActive = 3"
            type="button"
            class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 4: Tuteur -->
      <div v-if="etapeActive === 3" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Informations du tuteur
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du tuteur
              </label>
              <input
                v-model="formData.nom_tuteur"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Nom"
              />
            </div>

            <!-- Prénom tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prénom du tuteur
              </label>
              <input
                v-model="formData.prenom_tuteur"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Prénom"
              />
            </div>

            <!-- Profession tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profession
              </label>
              <input
                v-model="formData.profession_tuteur"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Profession"
              />
            </div>

            <!-- Employeur tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employeur
              </label>
              <input
                v-model="formData.employeur_tuteur"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Employeur"
              />
            </div>

            <!-- Email tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email tuteur
              </label>
              <input
                v-model="formData.email_tuteur"
                type="email"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="email@exemple.com"
              />
            </div>

            <!-- Téléphone tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone tuteur
              </label>
              <input
                v-model="formData.tel_tuteur"
                type="tel"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Téléphone"
              />
            </div>

            <!-- Adresse tuteur -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse
              </label>
              <input
                v-model="formData.adresse_tuteur"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Adresse complète"
              />
            </div>

            <!-- BP tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                BP
              </label>
              <input
                v-model="formData.bp_tuteur"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Boîte postale"
              />
            </div>

            <!-- Fax tuteur -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fax
              </label>
              <input
                v-model="formData.fax_tuteur"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="Fax"
              />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 2"
            type="button"
            class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all"
          >
            Précédent
          </button>
          <button
            @click="etapeActive = 4"
            type="button"
            class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 5: Documents -->
      <div v-if="etapeActive === 4" class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documents
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <!-- Indicateur du niveau sélectionné et documents requis -->
          <div v-if="selectedNiveauLabel" class="p-4 rounded-xl border-2 border-dashed" :class="niveauAlertClass">
            <div class="flex items-start gap-3">
              <svg class="w-6 h-6 text-indigo-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>
              <div>
                <p class="text-sm font-bold text-indigo-800 dark:text-indigo-300">Documents requis pour : {{ selectedNiveauLabel }}</p>
                <ul class="mt-2 space-y-1 text-xs text-indigo-700 dark:text-indigo-400">
                  <li v-for="doc in requiredDocsList" :key="doc" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    {{ doc }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p class="text-sm text-amber-700 dark:text-amber-400 font-medium">⚠️ Veuillez d'abord sélectionner un niveau académique (Étape 2) pour afficher les documents requis.</p>
          </div>

          <!-- Documents communs à tous les niveaux -->
          <h3 class="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
            Documents communs
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Photos d'identité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photos d'identité (format passeport) <span class="text-red-500">*</span>
              </label>
              <input
                ref="photoFile"
                type="file"
                @change="handleFileUpload('photo_identite_file', $event)"
                accept=".jpg,.jpeg,.png"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
              <p class="text-[10px] text-gray-400 mt-1">2 photos d'identité format passeport</p>
            </div>

            <!-- Pièce d'identité / Passeport -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Copie pièce d'identité / Passeport <span class="text-red-500">*</span>
              </label>
              <input
                ref="nationaliteFile"
                type="file"
                @change="handleFileUpload('nationalite_file', $event)"
                accept=".pdf,.jpg,.jpeg,.png"
                class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- Documents spécifiques Licence 1 -->
          <template v-if="isLicence1">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/></svg>
              Documents Licence 1
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée attestation BAC <span class="text-red-500">*</span>
                </label>
                <input ref="diplomeFile" type="file" @change="handleFileUpload('diplome_file', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée relevé de BAC <span class="text-red-500">*</span>
                </label>
                <input ref="releveBac1" type="file" @change="handleMultipleFiles('releve_bac1', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
          </template>

          <!-- Documents spécifiques Licence 2 -->
          <template v-if="isLicence2">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/></svg>
              Documents Licence 2
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée attestation BAC <span class="text-red-500">*</span>
                </label>
                <input ref="diplomeFile" type="file" @change="handleFileUpload('diplome_file', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée relevé de BAC <span class="text-red-500">*</span>
                </label>
                <input ref="releveBac1" type="file" @change="handleMultipleFiles('releve_bac1', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée du relevé de la 1ère année <span class="text-red-500">*</span>
                </label>
                <input ref="releveBac2" type="file" @change="handleMultipleFiles('releve_bac2', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
          </template>

          <!-- Documents spécifiques Licence 3 -->
          <template v-if="isLicence3">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/></svg>
              Documents Licence 3
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée attestation BAC ou BTS <span class="text-red-500">*</span>
                </label>
                <input ref="diplomeFile" type="file" @change="handleFileUpload('diplome_file', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée relevé BAC ou BTS <span class="text-red-500">*</span>
                </label>
                <input ref="releveBac1" type="file" @change="handleMultipleFiles('releve_bac1', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée du relevé de la 1ère et 2ème année <span class="text-red-500">*</span>
                </label>
                <input ref="releveBac2" type="file" @change="handleMultipleFiles('releve_bac2', $event)" multiple accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
          </template>

          <!-- Documents spécifiques Master & Executive Master -->
          <template v-if="isMaster">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <svg class="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/></svg>
              Documents Master & Executive Master
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copie légalisée du dernier diplôme universitaire <span class="text-red-500">*</span>
                </label>
                <input ref="diplomeFile" type="file" @change="handleFileUpload('diplome_file', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Curriculum Vitæ (CV) à jour <span class="text-red-500">*</span>
                </label>
                <input ref="cvFile" type="file" @change="handleFileUpload('cv_file', $event)" accept=".pdf,.doc,.docx"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
          </template>

          <!-- Documents optionnels supplémentaires -->
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"/></svg>
              Documents supplémentaires (optionnels)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lettre de motivation (fichier)</label>
                <input ref="lettreFile" type="file" @change="handleFileUpload('lettre_file', $event)" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Acte de naissance</label>
                <input ref="naissanceFile" type="file" @change="handleFileUpload('naissance_file', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certificat médical</label>
                <input ref="certificatFile" type="file" @change="handleFileUpload('certificat_medical_file', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coupon de paiement</label>
                <input ref="couponFile" type="file" @change="handleFileUpload('coupon_file', $event)" accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 3"
            type="button"
            class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium rounded-xl transition-all"
          >
            Précédent
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer la candidature' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Toast pour les notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Breadcrumb from "~/components/Breadcrumb.vue"
import Toast from 'primevue/toast'
import axios from 'axios'
import { useFiliereStore } from '~~/stores/filiere';
import { useNiveauStore } from '~~/stores/niveau'
import {useCandidatureStore } from '~~/stores/candidature'

const toast = useToast()
const filiereStore=useFiliereStore()
const candidatureStore=useCandidatureStore()
const niveauStore=useNiveauStore()

// États
const etapeActive = ref(0)
const isSubmitting = ref(false)
const niveaux = ref([])
const filieres = ref([])

// Données du formulaire
const formData = reactive({
  // Informations personnelles
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
  bp: '',
  fax: '',
  hobbit: '',
  
  // Informations académiques
  niveau_id: '',
  filiere_id: '',
  numero_table: '',
  annee_bac: '',
  serie: '',
  lettre_motivation: '',
  type_diplome: '',
  
  // Responsable
  nom_resp: '',
  prenom_resp: '',
  profession_resp: '',
  employeur_resp: '',
  email_resp: '',
  tel_resp: '',
  adresse_resp: '',
  bp_resp: '',
  fax_resp: '',
  
  // Tuteur
  nom_tuteur: '',
  prenom_tuteur: '',
  profession_tuteur: '',
  employeur_tuteur: '',
  email_tuteur: '',
  tel_tuteur: '',
  adresse_tuteur: '',
  bp_tuteur: '',
  fax_tuteur: '',
})

// Fichiers
const files = reactive({
  lettre_file: null,
  naissance_file: null,
  diplome_file: null,
  nationalite_file: null,
  photo_identite_file: null,
  certificat_medical_file: null,
  coupon_file: null,
  cv_file: null,
  bulletins_seconde: [],
  bulletins_premiere: [],
  bulletins_terminale: [],
  releve_bac1: [],
  releve_bac2: [],
})

// Références pour les fichiers
const lettreFile = ref(null)
const naissanceFile = ref(null)
const diplomeFile = ref(null)
const nationaliteFile = ref(null)
const photoFile = ref(null)
const certificatFile = ref(null)
const couponFile = ref(null)
const cvFile = ref(null)
const bulletinsSeconde = ref(null)
const bulletinsPremiere = ref(null)
const bulletinsTerminale = ref(null)
const releveBac1 = ref(null)
const releveBac2 = ref(null)

// Étapes
const etapes = [
  { titre: 'Informations personnelles', sousTitre: 'Identité et coordonnées' },
  { titre: 'Informations académiques', sousTitre: 'Parcours scolaire' },
  { titre: 'Responsable', sousTitre: 'Informations du responsable' },
  { titre: 'Tuteur', sousTitre: 'Informations du tuteur' },
  { titre: 'Documents', sousTitre: 'Pièces jointes' },
]

// Progression
const progression = computed(() => {
  return ((etapeActive.value + 1) / etapes.length) * 100
})

// ===== Détection du niveau sélectionné pour les documents requis =====
const selectedNiveauObj = computed(() => {
  if (!formData.niveau_id) return null
  return niveaux.value.find(n => n.id == formData.niveau_id)
})

const selectedNiveauLabel = computed(() => {
  if (!selectedNiveauObj.value) return ''
  return selectedNiveauObj.value.nom || selectedNiveauObj.value.libelle || ''
})

const niveauName = computed(() => (selectedNiveauLabel.value || '').toLowerCase())

const isLicence1 = computed(() => niveauName.value.includes('licence 1') || niveauName.value === 'l1')
const isLicence2 = computed(() => niveauName.value.includes('licence 2') || niveauName.value === 'l2')
const isLicence3 = computed(() => niveauName.value.includes('licence 3') || niveauName.value === 'l3')
const isMaster = computed(() => niveauName.value.includes('master') || niveauName.value.includes('executive'))

const niveauAlertClass = computed(() => 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20')

const requiredDocsList = computed(() => {
  const common = [
    'Deux (02) photos d\'identité (Format passeport)',
    'Une (01) copie de votre pièce nationale d\'identité ou passeport',
  ]
  if (isMaster.value) {
    return [...common,
      'Une (01) copie légalisée de votre dernier diplôme universitaire',
      'Un curriculum vitæ (CV) à jour',
    ]
  }
  if (isLicence3.value) {
    return [...common,
      'Une (01) copie légalisée de l\'attestation de BAC ou BTS',
      'Une (01) copie légalisée du relevé de BAC ou BTS',
      'Une (01) copie légalisée du relevé de la 1ère et 2ème année',
    ]
  }
  if (isLicence2.value) {
    return [...common,
      'Une (01) copie légalisée de l\'attestation de BAC',
      'Une (01) copie légalisée du relevé de BAC',
      'Une (01) copie légalisée du relevé de la 1ère année',
    ]
  }
  // Licence 1 par défaut
  return [...common,
    'Une (01) copie légalisée de l\'attestation de BAC',
    'Une (01) copie légalisée du relevé de BAC',
  ]
})

// Headers d'authentification
const authHeaders = () => {
  const token = localStorage.getItem("gest-ecole-token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  };
}

// Charger les données initiales
onMounted(async () => {
  try {
    const [niveauxRes, filieresRes] = await Promise.all([
      niveauStore.fetchNiveaux(),
       filiereStore.fetchFilieres()
    ])
    niveaux.value = niveauStore.niveaux || []
    filieres.value = filiereStore.filieres|| []
  } catch (error) {
    console.error('Erreur chargement données:', error)
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les données', life: 5000 })
  }
})

// Gestion des fichiers
const handleFileUpload = (field, event) => {
  files[field] = event.target.files[0]
}

const handleMultipleFiles = (field, event) => {
  files[field] = Array.from(event.target.files)
}

// Soumettre le formulaire
const soumettreFormulaire = async () => {
  isSubmitting.value = true

  try {
    const formDataToSend = new FormData()
    
    // Ajouter toutes les données textuelles
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key])
      }
    })

    // Ajouter les fichiers uniques
    const fileFields = [
      'lettre_file', 'naissance_file', 'diplome_file', 
      'nationalite_file', 'photo_identite_file', 
      'certificat_medical_file', 'coupon_file', 'cv_file'
    ]
    
    fileFields.forEach(field => {
      if (files[field]) {
        formDataToSend.append(field, files[field])
      }
    })

    // Ajouter les bulletins
    const bulletinsNiveaux = ['seconde', 'premiere', 'terminale']
    bulletinsNiveaux.forEach(niveau => {
      const bulletins = files[`bulletins_${niveau}`]
      if (bulletins && bulletins.length > 0) {
        bulletins.forEach((file, index) => {
          formDataToSend.append(`bulletins_${niveau}[${index}]`, file)
        })
      }
    })

    // Ajouter les relevés BAC
    if (files.releve_bac1 && files.releve_bac1.length > 0) {
      files.releve_bac1.forEach((file, index) => {
        formDataToSend.append(`releve_bac1[${index}]`, file)
      })
    }
    
    if (files.releve_bac2 && files.releve_bac2.length > 0) {
      files.releve_bac2.forEach((file, index) => {
        formDataToSend.append(`releve_bac2[${index}]`, file)
      })
    }

    // Envoyer la requête
    const response = await candidatureStore.storeByAdmin(formDataToSend)

    if (response.data.success) {
      toast.add({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Candidature enregistrée avec succès', 
        life: 5000 
      })
      
      // Rediriger vers la liste des candidatures après 2 secondes
      setTimeout(() => {
        navigateTo('/admin/candidatures')
      }, 2000)
    }

  } catch (error) {
    console.error('Erreur soumission:', error)
    
    if (error.response?.data?.errors) {
      // Afficher les erreurs de validation
      const errors = error.response.data.errors
      Object.keys(errors).forEach(key => {
        toast.add({ 
          severity: 'error', 
          summary: 'Erreur de validation', 
          detail: errors[key][0], 
          life: 5000 
        })
      })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: error.response?.data?.message || 'Erreur lors de l\'enregistrement', 
        life: 5000 
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>