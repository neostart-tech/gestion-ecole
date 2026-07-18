<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors">
    <!-- En-tête -->
    <div class="mb-8">
      <Breadcrumb
        :items="[
          { label: 'Administration', to: '/' },
          { label: 'Personnel', to: '/personnel' },
          { label: 'Enseignants', to: '/personnel/enseignants' },
          { label: 'Modifier', to: null },
        ]"
        spacing="mb-4"
      />
      
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Modifier le professeur
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Modifiez les informations du professeur {{ userData?.nom }} {{ userData?.prenom }}
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            type="button"
            @click="navigateTo('/personnel/enseignants')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="teacher-form"
            :disabled="isLoading"
            class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </span>
            <span v-else>Enregistrer les modifications</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loader pendant le chargement des données -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="relative">
          <div class="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="h-8 w-8 rounded-full bg-indigo-100 animate-pulse"></div>
          </div>
        </div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Chargement des données...</p>
      </div>
    </div>

    <!-- Formulaire -->
    <form v-else id="teacher-form" @submit.prevent="submitUser" class="space-y-6">
      <!-- Section 1: Informations personnelles -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Informations personnelles</h2>
          </div>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 ml-7">État civil et coordonnées</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom complet <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nom"
                type="text"
                placeholder="Nom de famille"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>

            <!-- Prénoms -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prénom(s) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.prenom"
                type="text"
                placeholder="Prénom(s)"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse email <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="professeur@ecole.tg"
                  required
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <!-- Téléphone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de téléphone <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  v-model="form.tel"
                  type="tel"
                  placeholder="+228 XX XX XX XX"
                  required
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <!-- Genre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre <span class="text-red-500">*</span>
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500': form.genre === 'Masculin' }">
                  <input
                    type="radio"
                    value="Masculin"
                    v-model="form.genre"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Masculin</span>
                </label>
                <label class="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500': form.genre === 'Féminin' }">
                  <input
                    type="radio"
                    value="Féminin"
                    v-model="form.genre"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Féminin</span>
                </label>
              </div>
            </div>

            <!-- Nationalité -->
            <div class="md:col-span-2">
              <NationaliteSelector
                v-model="form.nationalite"
                label="Nationalité"
                :required="true"
                helpText="Sélectionnez la nationalité du professeur"
              />
            </div>
          </div>

          <!-- NIF - Apparaît UNIQUEMENT si Togo est sélectionné -->
          <div v-if="form.nationalite === 'Togo'" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <div class="flex items-center space-x-2 mb-3">
                <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-300">Informations fiscales</h3>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro d'identification fiscale (NIF) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.nif"
                  type="text"
                  placeholder="Ex: 1234567890"
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Le numéro d'identification fiscale est obligatoire pour les professeurs de nationalité togolaise
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Informations professionnelles -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Informations professionnelles</h2>
          </div>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 ml-7">Fonctions et responsabilités</p>
        </div>
        
        <div class="p-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de surveillant
            </label>
            <div class="grid grid-cols-3 gap-3">
              <label class="relative flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500': form.supervisor_type === 'non_surveillant' }">
                <input type="radio" value="non_surveillant" v-model="form.supervisor_type" class="sr-only" />
                <span class="text-sm">Non surveillant</span>
              </label>
              <label class="relative flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500': form.supervisor_type === 'interne' }">
                <input type="radio" value="interne" v-model="form.supervisor_type" class="sr-only" />
                <span class="text-sm">Interne</span>
              </label>
              <label class="relative flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500': form.supervisor_type === 'externe' }">
                <input type="radio" value="externe" v-model="form.supervisor_type" class="sr-only" />
                <span class="text-sm">Externe</span>
              </label>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Biographie
            </label>
            <Editor
              api-key="2i64hds9y2pudvppatub5l7yvbpfncjva29myumeyneiqnzl"
              v-model="form.biographie"
              :init="{
                height: 250,
                menubar: false,
                plugins: 'lists link image media table wordcount',
                toolbar: 'undo redo | bold italic underline | bullist numlist | link image media | removeformat',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }"
            />
          </div>
        </div>
      </div>

      <!-- Section 3: Documents justificatifs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-800">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Documents justificatifs</h2>
          </div>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 ml-7">Les documents existants sont conservés. Vous pouvez les remplacer en téléchargeant un nouveau fichier.</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Pièce d'identité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pièce d'identité ou passeport 
                <span class="text-xs text-gray-500">(Laisser vide pour conserver l'existant)</span>
              </label>
              <FileUpload
                id="identity-document"
                v-model="form.identity_document"
                accept=".pdf,.jpg,.jpeg,.png"
                :max-size="5"
                @error="handleUploadError"
              />
              <div v-if="existingDocuments.identity_document_url" class="mt-2 text-xs text-green-600 dark:text-green-400">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Document existant
                </span>
              </div>
            </div>

            <!-- Document NIF -->
            <div v-if="form.nationalite === 'Togo'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Justificatif du NIF 
                <span class="text-xs text-gray-500">(Laisser vide pour conserver l'existant)</span>
              </label>
              <FileUpload
                id="nif-document"
                v-model="form.nif_document"
                accept=".pdf,.jpg,.jpeg,.png"
                :max-size="5"
                @error="handleUploadError"
              />
              <div v-if="existingDocuments.nif_document_url" class="mt-2 text-xs text-green-600 dark:text-green-400">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Document existant
                </span>
              </div>
            </div>

            <!-- Diplômes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Diplômes et certificats
                <span class="text-xs text-gray-500">(Laisser vide pour conserver l'existant)</span>
              </label>
              <FileUpload
                id="diploma-document"
                v-model="form.diploma_document"
                accept=".pdf,.jpg,.jpeg,.png"
                :max-size="10"
                @error="handleUploadError"
              />
              <div v-if="existingDocuments.diploma_document_url" class="mt-2 text-xs text-green-600 dark:text-green-400">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Document existant
                </span>
              </div>
            </div>

            <!-- CV -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Curriculum Vitae (CV)
                <span class="text-xs text-gray-500">(Laisser vide pour conserver l'existant)</span>
              </label>
              <FileUpload
                id="cv-document"
                v-model="form.cv_document"
                accept=".pdf,.doc,.docx"
                :max-size="5"
                @error="handleUploadError"
              />
              <div v-if="existingDocuments.cv_document_url" class="mt-2 text-xs text-green-600 dark:text-green-400">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Document existant
                </span>
              </div>
            </div>
          </div>

          <!-- Aide mémoire -->
          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm text-blue-800 dark:text-blue-200">
                <p class="font-medium mb-2 flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Informations importantes</span>
                </p>
                <ul class="space-y-2">
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span><strong>Nationalité :</strong> Champ obligatoire pour tous les professeurs</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span><strong>NIF :</strong> Apparaît et devient obligatoire uniquement si la nationalité est "Togo"</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span><strong>Documents :</strong> Laissez vide pour conserver le document existant</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-1">•</span>
                    <span><strong>Formats acceptés :</strong> PDF, JPG, JPEG, PNG (max 10 Mo par fichier)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import Breadcrumb from "~/components/Breadcrumb.vue"
import Editor from "@tinymce/tinymce-vue"
import FileUpload from "~/components/FileUpload.vue"
import NationaliteSelector from "~/components/NationaliteSelector.vue"
import { useUserStore } from "~~/stores/user"
import { useRoleStore } from "~~/stores/role"
import { useNuxtApp } from "#app"

const route = useRoute()
const userStore = useUserStore()
const roleStore = useRoleStore()
const { $swal, $toastr } = useNuxtApp()

const isLoading = ref(false)
const loading = ref(true)
const userSlug = ref(route.params.slug)
const userData = ref(null)

// Documents existants
const existingDocuments = ref({
  identity_document_url: null,
  nif_document_url: null,
  diploma_document_url: null,
  cv_document_url: null
})

// Formulaire
const form = ref({
  nom: "",
  prenom: "",
  email: "",
  tel: "",
  genre: "",
  nationalite: "",
  nif: "",
  supervisor_type: "non_surveillant",
  biographie: "",
  identity_document: null,
  nif_document: null,
  diploma_document: null,
  cv_document: null
})

// Watch pour réinitialiser le NIF quand la nationalité n'est pas Togo
watch(() => form.value.nationalite, (newValue) => {
  if (newValue !== 'Togo') {
    form.value.nif = ""
    form.value.nif_document = null
  }
})

const handleUploadError = (errorMessage) => {
  $swal.fire({
    icon: "error",
    title: "Erreur de téléchargement",
    text: errorMessage,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

const validateForm = () => {
  if (!form.value.nationalite) {
    $swal.fire({ icon: "error", title: "Champ requis", text: "La nationalité est obligatoire.", confirmButtonColor: "#6366f1" })
    return false
  }
  
  if (form.value.nationalite === 'Togo') {
    if (!form.value.nif?.trim()) {
      $swal.fire({ icon: "error", title: "Champ requis", text: "Le numéro NIF est obligatoire pour les professeurs togolais.", confirmButtonColor: "#6366f1" })
      return false
    }
  }
  
  return true
}

const prepareFormData = () => {
  const formData = new FormData()
  
  const textFields = ['nom', 'prenom', 'email', 'tel', 'genre', 'nationalite', 'supervisor_type', 'biographie']
  textFields.forEach(field => {
    if (form.value[field]) formData.append(field, form.value[field])
  })
  
  if (form.value.nif?.trim()) formData.append('nif', form.value.nif)
  
  // Ajouter les nouveaux fichiers (si présents)
  if (form.value.identity_document) formData.append('identity_document', form.value.identity_document)
  if (form.value.nif_document) formData.append('nif_document', form.value.nif_document)
  if (form.value.diploma_document) formData.append('diploma_document', form.value.diploma_document)
  if (form.value.cv_document) formData.append('cv_document', form.value.cv_document)
  
  return formData
}

const submitUser = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    const formData = prepareFormData()
    await userStore.updateUserEnseignant(userSlug.value, formData)
    
    await $swal.fire({
      icon: "success",
      title: "Succès !",
      text: "Les modifications ont été enregistrées avec succès.",
      confirmButtonColor: "#6366f1",
      timer: 2000
    })
    
    navigateTo("/personnel/enseignants")
  } catch (error) {
    console.error("Erreur modification:", error)
    $swal.fire({
      icon: "error",
      title: "Erreur",
      text: error.response?.data?.message || error.message || "Impossible de modifier le professeur.",
      confirmButtonColor: "#6366f1"
    })
  } finally {
    isLoading.value = false
  }
}

// Chargement des données
onMounted(async () => {
  try {
    loading.value = true
    
    // Récupérer les rôles et les données de l'utilisateur
    await Promise.all([
      roleStore.fetchRoles(),
      userStore.EditUser(userSlug.value)
    ])
    
    if (userStore.user) {
      userData.value = userStore.user
      form.value = {
        nom: userStore.user.nom || "",
        prenom: userStore.user.prenom || "",
        email: userStore.user.email || "",
        tel: userStore.user.tel || "",
        genre: userStore.user.genre || "",
        nationalite: userStore.user.nationalite || "",
        nif: userStore.user.nif || "",
        supervisor_type: userStore.user.supervisor_type || "non_surveillant",
        biographie: userStore.user.biographie || "",
        identity_document: null,
        nif_document: null,
        diploma_document: null,
        cv_document: null
      }
      
      // Sauvegarder les URLs des documents existants
      existingDocuments.value = {
        identity_document_url: userStore.user.identity_document_url || null,
        nif_document_url: userStore.user.nif_document_url || null,
        diploma_document_url: userStore.user.diploma_document_url || null,
        cv_document_url: userStore.user.cv_document_url || null
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error)
    $toastr.error("Erreur lors du chargement des données")
  } finally {
    loading.value = false
  }
})
</script>