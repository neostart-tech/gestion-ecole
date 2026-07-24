<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header avec progression -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-semibold text-gray-900">
            Nouvelle candidature
          </h1>
          <span class="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Étape {{ currentStep + 1 }}/{{ steps.length }}
          </span>
        </div>
        
        <!-- Barre de progression responsive -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center" v-if="currentStep > 0">
            <div class="h-0.5 w-full bg-blue-600"></div>
          </div>
          <div class="relative flex justify-between">
            <button
              v-for="(step, index) in steps"
              :key="index"
              @click="currentStep = index"
              class="flex flex-col items-center"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all border-2"
                :class="[
                  currentStep >= index
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500',
                ]"
              >
                {{ currentStep > index ? '✓' : index + 1 }}
              </div>
              <span
                class="mt-2 text-xs font-medium hidden sm:block"
                :class="currentStep === index ? 'text-blue-600' : 'text-gray-500'"
              >
                {{ step }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <Transition name="fade">
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </Transition>

      <!-- Formulaire -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- ÉTAPE 1: Informations personnelles & académiques -->
        <div v-if="currentStep === 0" class="space-y-6">
          <!-- Carte Informations personnelles -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <UserIcon class="w-5 h-5" />
                Informations personnelles
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Nom -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.nom"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.nom }"
                    @blur="validateField('nom')"
                  />
                  <p v-if="errors.nom" class="mt-1 text-sm text-red-600">{{ errors.nom }}</p>
                </div>

                <!-- Prénom -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Prénom(s) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.prenom"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.prenom }"
                    @blur="validateField('prenom')"
                  />
                  <p v-if="errors.prenom" class="mt-1 text-sm text-red-600">{{ errors.prenom }}</p>
                </div>

                <!-- Nom de jeune fille -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nom de jeune fille
                  </label>
                  <input
                    v-model="form.nom_jeune_fille"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Genre -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Genre <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.genre"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.genre }"
                    @blur="validateField('genre')"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                  <p v-if="errors.genre" class="mt-1 text-sm text-red-600">{{ errors.genre }}</p>
                </div>

                <!-- Date de naissance -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.date_naissance"
                    type="date"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.date_naissance }"
                    @blur="validateField('date_naissance')"
                  />
                  <p v-if="errors.date_naissance" class="mt-1 text-sm text-red-600">{{ errors.date_naissance }}</p>
                </div>

                <!-- Lieu de naissance -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Lieu de naissance <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.lieu_naissance"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.lieu_naissance }"
                    @blur="validateField('lieu_naissance')"
                  />
                  <p v-if="errors.lieu_naissance" class="mt-1 text-sm text-red-600">{{ errors.lieu_naissance }}</p>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.email }"
                    @blur="validateField('email')"
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                </div>

                <!-- Nationalité -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nationalité <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.nationalite"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.nationalite }"
                    @blur="validateField('nationalite')"
                  />
                  <p v-if="errors.nationalite" class="mt-1 text-sm text-red-600">{{ errors.nationalite }}</p>
                </div>

                <!-- Téléphone 1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone 1 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.tel"
                    type="tel"
                    placeholder="+221 XX XX XX XX"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.tel }"
                    @blur="validateField('tel')"
                  />
                  <p v-if="errors.tel" class="mt-1 text-sm text-red-600">{{ errors.tel }}</p>
                </div>

                <!-- Téléphone 2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone 2
                  </label>
                  <input
                    v-model="form.tel2"
                    type="tel"
                    placeholder="+221 XX XX XX XX"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Boîte postale -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Boîte postale
                  </label>
                  <input
                    v-model="form.bp"
                    type="text"
                    placeholder="BP ..."
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Centres d'intérêt -->
                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Centres d'intérêt / Hobbies
                  </label>
                  <textarea
                    v-model="form.hobbit"
                    rows="3"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="Décrivez vos centres d'intérêt"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Carte Informations académiques -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <AcademicCapIcon class="w-5 h-5" />
                Informations académiques
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Numéro de table -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de table
                  </label>
                  <input
                    v-model="form.numero_table"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Année du BAC -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Année du BAC
                  </label>
                  <input
                    v-model="form.annee_bac"
                    type="number"
                    :min="1900"
                    :max="currentYear"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Série du BAC -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Série du BAC
                  </label>
                  <input
                    v-model="form.serie"
                    type="text"
                    placeholder="Ex: S, L, ES"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Dernier diplôme -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dernier diplôme
                  </label>
                  <input
                    v-model="form.dernier_diplome"
                    type="text"
                    placeholder="Ex: BAC, BTS, Licence..."
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Filière -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Filière <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.filiere_id"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.filiere_id }"
                    @blur="validateField('filiere_id')"
                  >
                    <option value="">Sélectionnez une filière</option>
                    <option
                      v-for="filiere in filieres"
                      :key="filiere.id"
                      :value="filiere.id"
                    >
                      {{ filiere.nom }}
                    </option>
                  </select>
                  <p v-if="errors.filiere_id" class="mt-1 text-sm text-red-600">{{ errors.filiere_id }}</p>
                </div>

                <!-- Niveau -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Niveau <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.niveau_id"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.niveau_id }"
                    @blur="validateField('niveau_id')"
                  >
                    <option value="">Sélectionnez un niveau</option>
                    <option
                      v-for="niveau in niveaux"
                      :key="niveau.id"
                      :value="niveau.id"
                    >
                      {{ niveau.libelle }}
                    </option>
                  </select>
                  <p v-if="errors.niveau_id" class="mt-1 text-sm text-red-600">{{ errors.niveau_id }}</p>
                </div>

                <!-- Type de diplôme -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dernier Diplôme obtenu <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.type_diplome"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.type_diplome }"
                    @blur="validateField('type_diplome')"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="Bac 2">Bac 2</option>
                    <option value="BTS">BTS</option>
                    <option value="Licence">Licence</option>
                    <option value="Master">Master</option>
                  </select>
                  <p v-if="errors.type_diplome" class="mt-1 text-sm text-red-600">{{ errors.type_diplome }}</p>
                </div>

                <!-- Etablissement -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Établissement <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.etablissement_diplome"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.etablissement_diplome }"
                    @blur="validateField('etablissement_diplome')"
                  />
                  <p v-if="errors.etablissement_diplome" class="mt-1 text-sm text-red-600">{{ errors.etablissement_diplome }}</p>
                </div>

                <!-- Lettre de motivation -->
                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Lettre de motivation
                  </label>
                  <textarea
                    v-model="form.lettre_motivation"
                    rows="4"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="Votre lettre de motivation"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ÉTAPE 2: Source & Financement -->
        <div v-if="currentStep === 1" class="space-y-6">
          <!-- Carte Source -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <ShareIcon class="w-5 h-5" />
                Source de connaissance
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Connaissance -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Comment nous avez-vous connu ?
                  </label>
                  <select
                    v-model="form.connaissance"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="bouche_a_oreille">Bouche à oreille</option>
                    <option value="presse">Presse</option>
                    <option value="radio">Radio</option>
                    <option value="television">Télévision</option>
                    <option value="salon">Salon/Forum</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <!-- Autre connaissance -->
                <div v-if="form.connaissance === 'autre'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Précisez
                  </label>
                  <input
                    v-model="form.autre_connaissance"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Nom du recommandé -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la personne recommandée
                  </label>
                  <input
                    v-model="form.nom_recommande"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Contact du recommandé -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Contact du recommandé
                  </label>
                  <input
                    v-model="form.contact_recommande"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Carte Financement -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <BanknotesIcon class="w-5 h-5" />
                Financement des études
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Financement -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Qui financera vos études ?
                  </label>
                  <select
                    v-model="form.finance_scolarite"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="vous_meme">Vous-même</option>
                    <option value="parent_tuteur">Parent/Tuteur</option>
                    <option value="sponsor">Sponsor/Entreprise</option>
                    <option value="bourse">Bourse</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <!-- Autre financement -->
                <div v-if="form.finance_scolarite === 'autre'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Précisez
                  </label>
                  <input
                    v-model="form.preciser_autre_finance"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Sponsor details -->
                <template v-if="form.finance_scolarite === 'sponsor'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nom du sponsor
                    </label>
                    <input
                      v-model="form.nom_sponsor"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone du sponsor
                    </label>
                    <input
                      v-model="form.tel_sponsor"
                      type="tel"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Email du sponsor
                    </label>
                    <input
                      v-model="form.email_sponsor"
                      type="email"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- ÉTAPE 3: Responsable légal & Tuteur -->
        <div v-if="currentStep === 2" class="space-y-6">
          <!-- Carte Responsable légal -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <IdentificationIcon class="w-5 h-5" />
                Responsable légal
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Nom responsable -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.nom_resp"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.nom_resp }"
                    @blur="validateField('nom_resp')"
                  />
                  <p v-if="errors.nom_resp" class="mt-1 text-sm text-red-600">{{ errors.nom_resp }}</p>
                </div>

                <!-- Prénom responsable -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.prenom_resp"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.prenom_resp }"
                    @blur="validateField('prenom_resp')"
                  />
                  <p v-if="errors.prenom_resp" class="mt-1 text-sm text-red-600">{{ errors.prenom_resp }}</p>
                </div>

                <!-- Email responsable -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email_resp"
                    type="email"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.email_resp }"
                    @blur="validateField('email_resp')"
                  />
                  <p v-if="errors.email_resp" class="mt-1 text-sm text-red-600">{{ errors.email_resp }}</p>
                </div>

                <!-- Profession responsable -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Profession <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.profession_resp"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Employeur responsable -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Employeur
                  </label>
                  <input
                    v-model="form.employeur_resp"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Téléphone responsable -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.tel_resp"
                    type="tel"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    :class="{ 'border-red-500': errors.tel_resp }"
                    @blur="validateField('tel_resp')"
                  />
                  <p v-if="errors.tel_resp" class="mt-1 text-sm text-red-600">{{ errors.tel_resp }}</p>
                </div>

                <!-- Adresse responsable -->
                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Adresse <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="form.adresse_resp"
                    rows="2"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  ></textarea>
                </div>

                <!-- BP responsable -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Boîte postale
                  </label>
                  <input
                    v-model="form.bp_resp"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Carte Tuteur -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <UsersIcon class="w-5 h-5" />
                Tuteur académique (optionnel)
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Nom tuteur -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    v-model="form.nom_tuteur"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Prénom tuteur -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    v-model="form.prenom_tuteur"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Email tuteur -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    v-model="form.email_tuteur"
                    type="email"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Profession tuteur -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    v-model="form.profession_tuteur"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Employeur tuteur -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Employeur
                  </label>
                  <input
                    v-model="form.employeur_tuteur"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Téléphone tuteur -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    v-model="form.tel_tuteur"
                    type="tel"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <!-- Adresse tuteur -->
                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    v-model="form.adresse_tuteur"
                    rows="2"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  ></textarea>
                </div>

                <!-- BP tuteur -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Boîte postale
                  </label>
                  <input
                    v-model="form.bp_tuteur"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ÉTAPE 4: Documents avec Drag & Drop -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <DocumentIcon class="w-5 h-5" />
                Documents à fournir
              </h2>
            </div>
            
            <div class="p-6">
              <!-- Documents obligatoires -->
              <div class="mb-8">
                <h3 class="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  Documents obligatoires
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Photo -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.photo
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.photo ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('photo')"
                    @dragleave.prevent="handleDragLeave('photo')"
                    @drop.prevent="handleDrop('photo', $event)"
                    @click="triggerFileInput('photo')"
                  >
                    <input
                      ref="fileInputs.photo"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleFileSelect('photo', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.photo ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <CameraIcon
                          v-if="!files.photo"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Photo d'identité
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        JPG, PNG • Max 2 Mo
                      </span>

                      <!-- Fichier sélectionné -->
                      <div v-if="files.photo" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <PhotoIcon class="w-4 h-4 text-blue-500" />
                            <span class="text-sm truncate">{{ files.photo.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('photo')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <!-- Acte de naissance -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.naissance
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.naissance ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('naissance')"
                    @dragleave.prevent="handleDragLeave('naissance')"
                    @drop.prevent="handleDrop('naissance', $event)"
                    @click="triggerFileInput('naissance')"
                  >
                    <input
                      ref="fileInputs.naissance"
                      type="file"
                      accept=".pdf"
                      class="hidden"
                      @change="handleFileSelect('naissance', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.naissance ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <DocumentTextIcon
                          v-if="!files.naissance"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Acte de naissance
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF • Max 5 Mo
                      </span>

                      <div v-if="files.naissance" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <DocumentIcon class="w-4 h-4 text-red-500" />
                            <span class="text-sm truncate">{{ files.naissance.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('naissance')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <!-- Attestation nationalité -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.nationalite
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.nationalite ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('nationalite')"
                    @dragleave.prevent="handleDragLeave('nationalite')"
                    @drop.prevent="handleDrop('nationalite', $event)"
                    @click="triggerFileInput('nationalite')"
                  >
                    <input
                      ref="fileInputs.nationalite"
                      type="file"
                      accept=".pdf"
                      class="hidden"
                      @change="handleFileSelect('nationalite', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.nationalite ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <GlobeAltIcon
                          v-if="!files.nationalite"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Attestation de nationalité
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF • Max 5 Mo
                      </span>

                      <div v-if="files.nationalite" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <DocumentIcon class="w-4 h-4 text-red-500" />
                            <span class="text-sm truncate">{{ files.nationalite.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('nationalite')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <!-- Diplôme -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.diplome
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.diplome ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('diplome')"
                    @dragleave.prevent="handleDragLeave('diplome')"
                    @drop.prevent="handleDrop('diplome', $event)"
                    @click="triggerFileInput('diplome')"
                  >
                    <input
                      ref="fileInputs.diplome"
                      type="file"
                      accept=".pdf"
                      class="hidden"
                      @change="handleFileSelect('diplome', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.diplome ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <AcademicCapIcon
                          v-if="!files.diplome"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Diplôme
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF • Max 5 Mo
                      </span>

                      <div v-if="files.diplome" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <DocumentIcon class="w-4 h-4 text-red-500" />
                            <span class="text-sm truncate">{{ files.diplome.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('diplome')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <!-- Certificat médical -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.certificat_medical
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.certificat_medical ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('certificat_medical')"
                    @dragleave.prevent="handleDragLeave('certificat_medical')"
                    @drop.prevent="handleDrop('certificat_medical', $event)"
                    @click="triggerFileInput('certificat_medical')"
                  >
                    <input
                      ref="fileInputs.certificat_medical"
                      type="file"
                      accept=".pdf"
                      class="hidden"
                      @change="handleFileSelect('certificat_medical', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.certificat_medical ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <HeartIcon
                          v-if="!files.certificat_medical"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Certificat médical
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF • Max 5 Mo
                      </span>

                      <div v-if="files.certificat_medical" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <DocumentIcon class="w-4 h-4 text-red-500" />
                            <span class="text-sm truncate">{{ files.certificat_medical.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('certificat_medical')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Documents optionnels -->
              <div>
                <h3 class="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Documents optionnels
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Lettre manuscrite -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.lettre
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.lettre ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('lettre')"
                    @dragleave.prevent="handleDragLeave('lettre')"
                    @drop.prevent="handleDrop('lettre', $event)"
                    @click="triggerFileInput('lettre')"
                  >
                    <input
                      ref="fileInputs.lettre"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      class="hidden"
                      @change="handleFileSelect('lettre', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.lettre ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <DocumentTextIcon
                          v-if="!files.lettre"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Lettre manuscrite
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF, DOC • Max 5 Mo
                      </span>

                      <div v-if="files.lettre" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <DocumentIcon class="w-4 h-4 text-blue-500" />
                            <span class="text-sm truncate">{{ files.lettre.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('lettre')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <!-- CV -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.cv
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.cv ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('cv')"
                    @dragleave.prevent="handleDragLeave('cv')"
                    @drop.prevent="handleDrop('cv', $event)"
                    @click="triggerFileInput('cv')"
                  >
                    <input
                      ref="fileInputs.cv"
                      type="file"
                      accept=".pdf"
                      class="hidden"
                      @change="handleFileSelect('cv', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.cv ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <DocumentTextIcon
                          v-if="!files.cv"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        CV
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF • Max 5 Mo
                      </span>

                      <div v-if="files.cv" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <DocumentIcon class="w-4 h-4 text-red-500" />
                            <span class="text-sm truncate">{{ files.cv.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('cv')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <!-- Coupon -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer"
                    :class="[
                      files.coupon
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.coupon ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('coupon')"
                    @dragleave.prevent="handleDragLeave('coupon')"
                    @drop.prevent="handleDrop('coupon', $event)"
                    @click="triggerFileInput('coupon')"
                  >
                    <input
                      ref="fileInputs.coupon"
                      type="file"
                      accept=".pdf"
                      class="hidden"
                      @change="handleFileSelect('coupon', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.coupon ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <TicketIcon
                          v-if="!files.coupon"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Coupon
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF • Max 5 Mo
                      </span>

                      <div v-if="files.coupon" class="mt-2 w-full">
                        <div class="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <div class="flex items-center gap-2 truncate">
                            <DocumentIcon class="w-4 h-4 text-red-500" />
                            <span class="text-sm truncate">{{ files.coupon.name }}</span>
                          </div>
                          <button
                            type="button"
                            @click.stop="removeFile('coupon')"
                            class="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </div>

                  <!-- Bulletins multiples -->
                  <div
                    class="relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer lg:col-span-3"
                    :class="[
                      files.bulletins_lycee?.length
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-blue-500',
                      dragActive.bulletins_lycee ? 'border-blue-500 bg-blue-50' : '',
                    ]"
                    @dragover.prevent="handleDragOver('bulletins_lycee')"
                    @dragleave.prevent="handleDragLeave('bulletins_lycee')"
                    @drop.prevent="handleDropMultiple('bulletins_lycee', $event)"
                    @click="triggerMultipleFileInput('bulletins_lycee')"
                  >
                    <input
                      ref="fileInputs.bulletins_lycee"
                      type="file"
                      multiple
                      accept=".pdf"
                      class="hidden"
                      @change="handleMultipleFileSelect('bulletins_lycee', $event)"
                    />

                    <div class="flex flex-col items-center text-center">
                      <div
                        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                        :class="files.bulletins_lycee?.length ? 'bg-green-100' : 'bg-blue-100'"
                      >
                        <FolderOpenIcon
                          v-if="!files.bulletins_lycee?.length"
                          class="w-8 h-8 text-blue-600"
                        />
                        <CheckIcon v-else class="w-8 h-8 text-green-600" />
                      </div>
                      
                      <span class="font-medium text-gray-900 mb-1">
                        Bulletins de notes
                      </span>
                      <span class="text-sm text-gray-500 mb-2">
                        PDF • Plusieurs fichiers acceptés
                      </span>

                      <!-- Liste des fichiers -->
                      <div v-if="files.bulletins_lycee?.length" class="mt-4 w-full">
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                          <div
                            v-for="(file, index) in files.bulletins_lycee"
                            :key="index"
                            class="flex items-center justify-between bg-white p-2 rounded-lg border"
                          >
                            <div class="flex items-center gap-2 truncate flex-1">
                              <DocumentIcon class="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span class="text-sm truncate">{{ file.name }}</span>
                            </div>
                            <button
                              type="button"
                              @click.stop="removeMultipleFile('bulletins_lycee', index)"
                              class="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                            >
                              <XMarkIcon class="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p v-else class="text-xs text-gray-400 mt-2">
                        Cliquez ou glissez-déposez plusieurs fichiers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button
            type="button"
            @click="prevStep"
            :disabled="currentStep === 0"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Précédent
          </button>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              @click="navigateTo('/candidatures')"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>

            <button
              v-if="currentStep < steps.length - 1"
              type="button"
              @click="nextStep"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Suivant →
            </button>

            <button
              v-else
              type="submit"
              :disabled="isLoading || !confirmTerms"
              class="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isLoading ? "Envoi en cours..." : "Soumettre la candidature" }}
            </button>
          </div>
        </div>

        <!-- Checkbox de confirmation -->
        <div v-if="currentStep === steps.length - 1" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <label class="flex items-start gap-3">
            <input
              v-model="confirmTerms"
              type="checkbox"
              class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-600">
              Je certifie sur l'honneur que toutes les informations fournies sont exactes et complètes. Je m'engage à fournir les documents originaux en cas de demande.
            </span>
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
  UserIcon,
  AcademicCapIcon,
  ShareIcon,
  BanknotesIcon,
  IdentificationIcon,
  UsersIcon,
  DocumentIcon,
  DocumentTextIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  GlobeAltIcon,
  HeartIcon,
  TicketIcon,
  FolderOpenIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();

const steps = [
  "Infos personnelles & académiques",
  "Source & Financement",
  "Responsable & Tuteur",
  "Documents",
];

const currentStep = ref(0);
const isLoading = ref(false);
const error = ref(null);
const confirmTerms = ref(false);

// Drag & Drop state
const dragActive = ref({
  photo: false,
  naissance: false,
  nationalite: false,
  diplome: false,
  certificat_medical: false,
  lettre: false,
  cv: false,
  coupon: false,
  bulletins_lycee: false,
});

// File inputs refs
const fileInputs = ref({
  photo: null,
  naissance: null,
  nationalite: null,
  diplome: null,
  certificat_medical: null,
  lettre: null,
  cv: null,
  coupon: null,
  bulletins_lycee: null,
});

// Form data
const form = reactive({
  nom: "",
  nom_jeune_fille: "",
  prenom: "",
  genre: "",
  date_naissance: "",
  lieu_naissance: "",
  email: "",
  nationalite: "",
  tel: "",
  tel2: "",
  bp: "",
  hobbit: "",
  numero_table: "",
  annee_bac: null,
  serie: "",
  dernier_diplome: "",
  filiere_id: "",
  niveau_id: "",
  type_diplome: "",
  etablissement_diplome: "",
  lettre_motivation: "",
  connaissance: "",
  autre_connaissance: "",
  nom_recommande: "",
  contact_recommande: "",
  finance_scolarite: "",
  preciser_autre_finance: "",
  nom_sponsor: "",
  tel_sponsor: "",
  email_sponsor: "",
  nom_resp: "",
  prenom_resp: "",
  email_resp: "",
  profession_resp: "",
  employeur_resp: "",
  adresse_resp: "",
  tel_resp: "",
  bp_resp: "",
  nom_tuteur: "",
  prenom_tuteur: "",
  email_tuteur: "",
  profession_tuteur: "",
  employeur_tuteur: "",
  adresse_tuteur: "",
  tel_tuteur: "",
  bp_tuteur: "",
});

// Files
const files = reactive({
  photo: null,
  naissance: null,
  nationalite: null,
  diplome: null,
  certificat_medical: null,
  lettre: null,
  cv: null,
  coupon: null,
  bulletins_lycee: [],
});

// Errors
const errors = ref({});

// Mock data
const filieres = ref([
  { id: 1, nom: "Informatique" },
  { id: 2, nom: "Gestion" },
  { id: 3, nom: "Marketing" },
  { id: 4, nom: "Communication" },
  { id: 5, nom: "Droit" },
]);

const niveaux = ref([
  { id: 1, libelle: "Licence 1" },
  { id: 2, libelle: "Licence 2" },
  { id: 3, libelle: "Licence 3" },
  { id: 4, libelle: "Master 1" },
  { id: 5, libelle: "Master 2" },
]);

const currentYear = computed(() => new Date().getFullYear());

// Navigation
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Validation
const validateField = (field) => {
  delete errors.value[field];
  
  const requiredFields = {
    nom: "Le nom est requis",
    prenom: "Le prénom est requis",
    genre: "Le genre est requis",
    date_naissance: "La date de naissance est requise",
    lieu_naissance: "Le lieu de naissance est requis",
    email: "L'email est requis",
    nationalite: "La nationalité est requise",
    tel: "Le téléphone est requis",
    filiere_id: "La filière est requise",
    niveau_id: "Le niveau est requis",
    type_diplome: "Le type de diplôme est requis",
    etablissement_diplome: "L'établissement est requis",
    nom_resp: "Le nom du responsable est requis",
    prenom_resp: "Le prénom du responsable est requis",
    email_resp: "L'email du responsable est requis",
    tel_resp: "Le téléphone du responsable est requis",
  };
  
  if (requiredFields[field] && !form[field]?.trim()) {
    errors.value[field] = requiredFields[field];
  }
  
  if (field === "email" && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = "Email invalide";
  }
  
  if (field === "email_resp" && form.email_resp && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_resp)) {
    errors.value.email_resp = "Email invalide";
  }
};

// Drag & Drop handlers
const handleDragOver = (field) => {
  dragActive.value[field] = true;
};

const handleDragLeave = (field) => {
  dragActive.value[field] = false;
};

const handleDrop = (field, event) => {
  dragActive.value[field] = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    files[field] = file;
  }
};

const handleDropMultiple = (field, event) => {
  dragActive.value[field] = false;
  const droppedFiles = Array.from(event.dataTransfer.files);
  files[field] = [...files[field], ...droppedFiles];
};

// File handlers
const handleFileSelect = (field, event) => {
  const file = event.target.files[0];
  if (file) {
    files[field] = file;
  }
};

const handleMultipleFileSelect = (field, event) => {
  const selectedFiles = Array.from(event.target.files);
  files[field] = [...files[field], ...selectedFiles];
};

const removeFile = (field) => {
  files[field] = null;
  if (fileInputs.value[field]) {
    fileInputs.value[field].value = "";
  }
};

const removeMultipleFile = (field, index) => {
  files[field].splice(index, 1);
};

const triggerFileInput = (field) => {
  fileInputs.value[field]?.click();
};

const triggerMultipleFileInput = (field) => {
  fileInputs.value[field]?.click();
};

// Submit
const submitForm = async () => {
  try {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Candidature soumise avec succès !");
    router.push("/candidatures");
  } catch (err) {
    error.value = err.message || "Une erreur est survenue";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>