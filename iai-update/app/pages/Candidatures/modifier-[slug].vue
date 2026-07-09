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
    <form v-else @submit.prevent="handleUpdate" enctype="multipart/form-data">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progression de la mise à jour</span>
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
      <div class="flex items-center justify-between mb-8 overflow-x-auto pb-2 no-scrollbar">
        <div 
          v-for="(etape, index) in etapes" 
          :key="index"
          @click="etapeActive = index"
          class="flex items-center cursor-pointer group min-w-[150px] shrink-0"
          :class="{ 'opacity-50': index > etapeActive }"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all"
            :class="{
              'bg-indigo-600 text-white shadow-lg shadow-indigo-200': index <= etapeActive,
              'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400': index > etapeActive
            }"
          >
            {{ index + 1 }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{{ etape.titre }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-black">{{ etape.sousTitre }}</p>
          </div>
          <svg v-if="index < etapes.length - 1" class="w-5 h-5 mx-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <!-- Étape 1: Informations personnelles -->
      <div v-if="etapeActive === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
            <UserIcon class="w-5 h-5 text-indigo-600" />
            1. Informations personnelles
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Nom</label>
              <input v-model="formData.nom" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Prénom -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Prénom</label>
              <input v-model="formData.prenom" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Genre -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Genre</label>
              <select v-model="formData.genre" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>

            <!-- Date de naissance -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Date de naissance</label>
              <input v-model="formData.date_naissance" type="date" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Lieu de naissance -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Lieu de naissance</label>
              <input v-model="formData.lieu_naissance" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Nationalité -->
            <div>
              <NationaliteSelector v-model="formData.nationalite" label="Nationalité" />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Email</label>
              <input v-model="formData.email" type="email" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Téléphone -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Téléphone</label>
              <input v-model="formData.tel" type="tel" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            @click="etapeActive = 1"
            type="button"
            class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-indigo-200 transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 2: Informations académiques -->
      <div v-if="etapeActive === 1" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
            <AcademicCapIcon class="w-5 h-5 text-indigo-600" />
            2. Informations académiques
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Niveau -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Niveau</label>
              <select v-model="formData.niveau_id" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option v-for="niveau in niveaux" :key="niveau.id" :value="niveau.id">{{ niveau.libelle }}</option>
              </select>
            </div>

            <!-- Filière -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Filière</label>
              <select v-model="formData.filiere_id" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option v-for="filiere in filieres" :key="filiere.id" :value="filiere.id">{{ filiere.nom }}</option>
              </select>
            </div>

            <!-- Numéro de table -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Numéro de table</label>
              <input v-model="formData.numero_table" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Année du bac -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Année du bac</label>
              <input v-model="formData.annee_bac" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Série -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Série</label>
              <input v-model="formData.serie" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <!-- Type de diplôme -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Dernier Diplôme obtenu</label>
              <select v-model="formData.type_diplome" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option value="Bac 2">Bac 2</option>
                <option value="BTS">BTS</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
              </select>
            </div>

            <!-- Etablissement -->
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Établissement</label>
              <input v-model="formData.etablissement_diplome" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 0"
            type="button"
            class="px-8 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Précédent
          </button>
          <button
            @click="etapeActive = 2"
            type="button"
            class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-indigo-200 transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 3: Responsable -->
      <div v-if="etapeActive === 2" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
            <CreditCardIcon class="w-5 h-5 text-indigo-600" />
            3. Informations du responsable
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Nom du responsable</label>
              <input v-model="formData.nom_resp" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Prénom du responsable</label>
              <input v-model="formData.prenom_resp" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Profession</label>
              <input v-model="formData.profession_resp" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Téléphone responsable</label>
              <input v-model="formData.tel_resp" type="tel" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 1"
            type="button"
            class="px-8 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Précédent
          </button>
          <button
            @click="etapeActive = 3"
            type="button"
            class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-indigo-200 transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 4: Tuteur -->
      <div v-if="etapeActive === 3" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
            <UsersIcon class="w-5 h-5 text-indigo-600" />
            4. Informations du tuteur
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Nom du tuteur</label>
              <input v-model="formData.nom_tuteur" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Prénom du tuteur</label>
              <input v-model="formData.prenom_tuteur" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-wider">Téléphone tuteur</label>
              <input v-model="formData.tel_tuteur" type="tel" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 2"
            type="button"
            class="px-8 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Précédent
          </button>
          <button
            @click="etapeActive = 4"
            type="button"
            class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-indigo-200 transition-all"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 5: Documents -->
      <div v-if="etapeActive === 4" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
            <DocumentIcon class="w-5 h-5 text-indigo-600" />
            5. Documents du dossier
          </h2>
        </div>

        <div class="p-6 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Photo d'identité</label>
              <FileUpload id="photo_identite_file" v-model="files.photo_identite_file" :existingUrl="existingFiles.photo" accept=".jpg,.jpeg,.png" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Acte de naissance</label>
              <FileUpload id="naissance_file" v-model="files.naissance_file" :existingUrl="getFullUrl(existingFiles.naissance)" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Pièce d'identité / Passeport</label>
              <FileUpload id="nationalite_file" v-model="files.nationalite_file" :existingUrl="getFullUrl(existingFiles.nationalite)" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Attestation du Diplôme</label>
              <FileUpload id="diplome_file" v-model="files.diplome_file" :existingUrl="getFullUrl(existingFiles.diplome)" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Lettre de motivation</label>
              <FileUpload id="lettre_file" v-model="files.lettre_file" :existingUrl="getFullUrl(existingFiles.lettre)" accept=".pdf,.doc,.docx" />
            </div>
          </div>

          <!-- Bulletins et Relevés -->
          <div class="pt-8 border-t border-gray-100 dark:border-gray-700 space-y-6">
            <h3 class="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
              Bulletins & Relevés de notes
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase">Bulletins Seconde</label>
                <MultipleFileUpload v-model="files.bulletins_seconde" :existingFiles="existingFiles.bulletins_seconde" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase">Bulletins Première</label>
                <MultipleFileUpload v-model="files.bulletins_premiere" :existingFiles="existingFiles.bulletins_premiere" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase">Bulletins Terminale</label>
                <MultipleFileUpload v-model="files.bulletins_terminale" :existingFiles="existingFiles.bulletins_terminale" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase">Relevés BAC 1</label>
                <MultipleFileUpload v-model="files.releve_bac1" :existingFiles="existingFiles.releve_bac1" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase">Relevés BAC 2</label>
                <MultipleFileUpload v-model="files.releve_bac2" :existingFiles="existingFiles.releve_bac2" />
              </div>
            </div>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/50 rounded-2xl">
            <div class="flex items-start gap-3">
               <div class="mt-0.5"><svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg></div>
               <p class="text-xs text-amber-700 dark:text-amber-400 font-medium italic">Note: Les fichiers existants ne seront pas modifiés si vous n'en sélectionnez pas de nouveaux.</p>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            @click="etapeActive = 3"
            type="button"
            class="px-8 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Précédent
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-green-200 transition-all flex items-center gap-2"
          >
            <span v-if="submitting" class="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span>
            {{ submitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCandidatureStore } from '~~/stores/candidature';
import { useFiliereStore } from '~~/stores/filiere';
import { useNiveauStore } from '~~/stores/niveau';
import { getStorageBaseUrl } from '~/utils/storageUrl';
import Swal from 'sweetalert2';
import Breadcrumb from "~/components/Breadcrumb.vue"
import NationaliteSelector from "~/components/NationaliteSelector.vue"
import FileUpload from "~/components/FileUpload.vue"
import MultipleFileUpload from "~/components/MultipleFileUpload.vue"
import {
  ArrowLeftIcon,
  UserIcon,
  AcademicCapIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const candidatureStore = useCandidatureStore();
const filiereStore = useFiliereStore();
const niveauStore = useNiveauStore();

const slug = route.params.slug;
const loading = ref(true);
const submitting = ref(false);
const etapeActive = ref(0);
const maxStepReached = ref(0);
const filieres = ref([]);
const niveaux = ref([]);

const etapes = [
  { titre: 'Informations personnelles', sousTitre: 'Identité et coordonnées' },
  { titre: 'Informations académiques', sousTitre: 'Parcours scolaire' },
  { titre: 'Responsable', sousTitre: 'Informations du responsable' },
  { titre: 'Tuteur', sousTitre: 'Informations du tuteur' },
  { titre: 'Documents', sousTitre: 'Pièces jointes' },
];

const progression = computed(() => Math.round(((etapeActive.value + 1) / etapes.length) * 100));

const formData = reactive({
  nom: '',
  prenom: '',
  nom_jeune_fille: '',
  genre: 'Masculin',
  date_naissance: '',
  lieu_naissance: '',
  email: '',
  nationalite: '',
  tel: '',
  tel2: '',
  tel3: '',
  bp: '',
  fax: '',
  hobbit: '',
  niveau_id: null,
  filiere_id: null,
  serie: '',
  annee_bac: '',
  lettre_motivation: '',
  type_diplome: 'Bac',
  etablissement_diplome: '',
  nom_resp: '',
  prenom_resp: '',
  profession_resp: '',
  employeur_resp: '',
  email_resp: '',
  tel_resp: '',
  adresse_resp: '',
  fax_resp: '',
  bp_resp: '',
  nom_tuteur: '',
  prenom_tuteur: '',
  profession_tuteur: '',
  employeur_tuteur: '',
  email_tuteur: '',
  tel_tuteur: '',
  adresse_tuteur: '',
  fax_tuteur: '',
  bp_tuteur: '',
});

const files = reactive({
  photo_identite_file: null,
  naissance_file: null,
  diplome_file: null,
  nationalite_file: null,
  lettre_file: null,
  bulletins_seconde: [],
  bulletins_premiere: [],
  bulletins_terminale: [],
  releve_bac1: [],
  releve_bac2: [],
});

const existingFiles = reactive({
  photo: null,
  diplome: null,
  lettre: null,
  naissance: null,
  nationalite: null,
  bulletins_seconde: [],
  bulletins_premiere: [],
  bulletins_terminale: [],
  releve_bac1: [],
  releve_bac2: [],
});


const getFullUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${getStorageBaseUrl()}/storage/${path}`
};

const loadData = async () => {
  try {
    loading.value = true;
    await Promise.all([
      filiereStore.fetchFilieres(),
      niveauStore.fetchNiveaux()
    ]);
    filieres.value = filiereStore.filieres;
    niveaux.value = niveauStore.niveaux;

    const data = await candidatureStore.fetchCandidatureDetail(slug);
    
    // Mapper les données
    Object.keys(formData).forEach(key => {
       if (data[key] !== undefined) {
         if (key === 'date_naissance' && data[key]) {
            // S'assurer que le format est YYYY-MM-DD pour l'input date
            formData[key] = data[key].split('T')[0].split(' ')[0];
         } else {
            formData[key] = data[key];
         }
       }
    });

    if (data.responsable) {
       Object.keys(data.responsable).forEach(k => {
          if (formData[`${k}_resp`] !== undefined) formData[`${k}_resp`] = data.responsable[k];
          else if (k === 'tel') formData.tel_resp = data.responsable.tel;
          else if (k === 'adresse') formData.adresse_resp = data.responsable.adresse;
          else if (k === 'fax') formData.fax_resp = data.responsable.fax;
          else if (k === 'bp') formData.bp_resp = data.responsable.bp;
       });
    }

    if (data.tuteur) {
       formData.nom_tuteur = data.tuteur.nom;
       formData.prenom_tuteur = data.tuteur.prenom;
       formData.profession_tuteur = data.tuteur.profession;
       formData.employeur_tuteur = data.tuteur.employeur;
       formData.email_tuteur = data.tuteur.email;
       formData.tel_tuteur = data.tuteur.tel;
       formData.adresse_tuteur = data.tuteur.adresse;
       formData.fax_tuteur = data.tuteur.fax;
       formData.bp_tuteur = data.tuteur.bp;
    }

    if (data.album) {
      formData.type_diplome = data.album.type_diplome;
      existingFiles.photo = getFullUrl(data.album.photo);
      existingFiles.diplome = data.album.diplome;
      existingFiles.lettre = data.album.lettre;
      existingFiles.naissance = data.album.naissance;
      existingFiles.nationalite = data.album.nationalite;
      
      if (data.album.bulletins_lycee_paths) {
        try {
          const bulletins = JSON.parse(data.album.bulletins_lycee_paths);
          existingFiles.bulletins_seconde = bulletins.seconde || [];
          existingFiles.bulletins_premiere = bulletins.premiere || [];
          existingFiles.bulletins_terminale = bulletins.terminale || [];
        } catch (e) {
          console.error("Erreur parsing bulletins:", e);
        }
      }
      if (data.album.releve_bac1_path) existingFiles.releve_bac1 = [data.album.releve_bac1_path];
      if (data.album.releve_bac2_path) existingFiles.releve_bac2 = [data.album.releve_bac2_path];
    }
    maxStepReached.value = 4;

  } catch (error) {
    console.error("Erreur chargement:", error);
    Swal.fire('Erreur', 'Impossible de charger les données', 'error');
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  submitting.value = true;
  try {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) data.append(key, formData[key]);
    });
    
    // Fichiers uniques
    Object.keys(files).forEach(key => {
      if (files[key] && !Array.isArray(files[key])) {
        data.append(key, files[key]);
      }
    });

    // Fichiers multiples (bulletins)
    ['seconde', 'premiere', 'terminale'].forEach(n => {
      const field = `bulletins_${n}`;
      if (files[field] && files[field].length > 0) {
        files[field].forEach((f, i) => data.append(`${field}[${i}]`, f));
      }
    });

    // Relevés
    if (files.releve_bac1 && files.releve_bac1.length > 0) {
      files.releve_bac1.forEach((f, i) => data.append(`releve_bac1[${i}]`, f));
    }
    if (files.releve_bac2 && files.releve_bac2.length > 0) {
      files.releve_bac2.forEach((f, i) => data.append(`releve_bac2[${i}]`, f));
    }

    await candidatureStore.updateByAdmin(slug, data);

    Swal.fire({
      title: 'Succès !',
      text: 'La candidature a été mise à jour avec succès.',
      icon: 'success',
      confirmButtonColor: '#4F46E5'
    }).then(() => {
      navigateTo('/candidatures/etude-dossier');
    });

  } catch (error) {
    console.error("Erreur mise à jour:", error);
    Swal.fire('Erreur', error.response?.data?.message || 'Une erreur est survenue', 'error');
  } finally {
    submitting.value = false;
  }
};

onMounted(loadData);

watch(() => etapeActive.value, (val) => {
   if (val > maxStepReached.value) maxStepReached.value = val;
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
