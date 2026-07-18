<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <a href="#" class="text-blue-600 hover:text-blue-800">Mon dossier</a>
        </li>
        <li class="flex items-center">
          <span class="text-gray-400 mx-2">/</span>
          <span class="text-gray-600">Mes informations</span>
        </li>
      </ol>
    </nav>

    <!-- Titre -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Constitution de mon dossier</h1>
    </div>

    <!-- Accordéon -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <!-- Section 1: Mon identité -->
        <div class="border rounded-lg mb-4 overflow-hidden">
          <button
            @click="toggleSection(1)"
            class="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 border-b flex justify-between items-center focus:outline-none"
          >
            <span class="font-medium text-gray-700">Mon identité</span>
            <svg
              :class="{'rotate-180': activeSection === 1}"
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-if="activeSection === 1" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  :value="formData.identity.nom"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Prénom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  :value="formData.identity.prenom"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Nom de jeune fille -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom de jeune fille</label>
                <input
                  type="text"
                  :value="formData.identity.nom_jeune_fille"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Genre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <input
                  type="text"
                  :value="formData.identity.genre"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Date de naissance -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <input
                  type="text"
                  :value="formData.identity.date_naissance"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Lieu de naissance -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                <input
                  type="text"
                  :value="formData.identity.lieu_naissance"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Téléphone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  :value="formData.identity.tel"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Nationalité -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                <input
                  type="text"
                  :value="formData.identity.nationalite"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Boîte postale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Boîte postale</label>
                <input
                  type="text"
                  :value="formData.identity.pb"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Fax -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                <input
                  type="text"
                  :value="formData.identity.fax"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Personne responsable des frais de formation -->
        <div class="border rounded-lg mb-4 overflow-hidden">
          <button
            @click="toggleSection(2)"
            class="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 border-b flex justify-between items-center focus:outline-none"
          >
            <span class="font-medium text-gray-700">Personne responsable des frais de formation</span>
            <svg
              :class="{'rotate-180': activeSection === 2}"
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-if="activeSection === 2" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  :value="formData.responsable.nom"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Prénom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom(s)</label>
                <input
                  type="text"
                  :value="formData.responsable.prenom"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Profession -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input
                  type="text"
                  :value="formData.responsable.profession"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Nom de l'employeur -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'employeur</label>
                <input
                  type="text"
                  :value="formData.responsable.employeur"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  :value="formData.responsable.email"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Téléphone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  :value="formData.responsable.tel"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Adresse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  :value="formData.responsable.adresse"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Fax -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                <input
                  type="text"
                  :value="formData.responsable.fax"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Boîte postale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Boîte postale</label>
                <input
                  type="text"
                  :value="formData.responsable.bp"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Parent ou tuteur -->
        <div class="border rounded-lg overflow-hidden">
          <button
            @click="toggleSection(3)"
            class="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 border-b flex justify-between items-center focus:outline-none"
          >
            <span class="font-medium text-gray-700">Parent ou tuteur</span>
            <svg
              :class="{'rotate-180': activeSection === 3}"
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-if="activeSection === 3" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  :value="formData.tuteur.nom"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Prénom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom(s)</label>
                <input
                  type="text"
                  :value="formData.tuteur.prenom"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Profession -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input
                  type="text"
                  :value="formData.tuteur.profession"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Nom de l'employeur -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'employeur</label>
                <input
                  type="text"
                  :value="formData.tuteur.employeur"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  :value="formData.tuteur.email"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Téléphone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  :value="formData.tuteur.tel"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Adresse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  :value="formData.tuteur.adresse"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Fax -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                <input
                  type="text"
                  :value="formData.tuteur.fax"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              <!-- Boîte postale -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Boîte postale</label>
                <input
                  type="text"
                  :value="formData.tuteur.bp"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// État pour gérer les sections de l'accordéon
const activeSection = ref(1) // Par défaut, première section ouverte

const toggleSection = (sectionNumber) => {
  if (activeSection.value === sectionNumber) {
    activeSection.value = null // Fermer la section si elle est déjà ouverte
  } else {
    activeSection.value = sectionNumber // Ouvrir la section
  }
}

// Données du formulaire
const formData = reactive({
  identity: {
    nom: "AFANTSAO",
    prenom: "Komi Ebénezer Aménouvévé",
    nom_jeune_fille: "",
    genre: "Masculin",
    date_naissance: "14 mars 2002",
    lieu_naissance: "Lomé",
    tel: "+228 98702907",
    nationalite: "TG",
    pb: "",
    fax: ""
  },
  responsable: {
    nom: "AFANTSAO",
    prenom: "Abel",
    profession: "Juriste",
    employeur: "Didier",
    email: "abelafantsao@gmail.com",
    tel: "96250771",
    adresse: "Agbalépédogan",
    fax: "",
    bp: ""
  },
  tuteur: {
    nom: "AFANTSAO",
    prenom: "Abel",
    profession: "Juriste",
    employeur: "Didier",
    email: "abelafantsao@gmail.com",
    tel: "96250771",
    adresse: "Agbalépédogan",
    fax: "",
    bp: ""
  }
})
</script>

<style scoped>
/* Styles spécifiques au composant */
.rotate-180 {
  transform: rotate(180deg);
}

input[readonly] {
  cursor: default;
}
</style>