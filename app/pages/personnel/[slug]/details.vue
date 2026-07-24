<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header avec gradient subtil -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Breadcrumb
              :items="[
                { label: 'Administration', to: '/' },
                { label: 'Personnel', to: '/personnel' },
                { label: 'Enseignants', to: '/personnel/enseignants' },
                { label: 'Détails', to: null },
              ]"
              spacing="mb-2"
            />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Détails du professeur</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Consultez les informations complètes du professeur</p>
          </div>
          <div class="flex gap-3">
          
            <button
              @click="navigateTo('/personnel/enseignants')"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Retour
            </button>
            <Can :action="['update-enseignant']">
            <NuxtLink
              :to="`/personnel/${user?.slug}/modifier-un-enseignant`"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              Modifier
            </NuxtLink>
            </Can>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="user" class="space-y-6">
        <!-- Carte profil avec dégradé -->
        <div class="bg-gradient-to-r from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/10 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center gap-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5">
              <div class="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <svg class="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ user.nom }} {{ user.prenom }}</h2>
                <span v-if="user.is_togolais" class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Togolais
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ user.email }}
              </p>
              <div class="flex flex-wrap gap-2 mt-3">
                <span v-if="user.matricule" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0h4" />
                  </svg>
                  {{ user.matricule }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {{ user.supervisor_type_value || 'Non surveillant' }}
                </span>
              </div>
            </div>
            <div class="hidden sm:block">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Grille d'informations -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Colonne gauche -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Informations personnelles -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informations personnelles
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom complet</label>
                    <p class="text-sm text-gray-900 dark:text-white font-medium">{{ user.nom }} {{ user.prenom }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Genre</label>
                    <p class="text-sm text-gray-900 dark:text-white">{{ user.genre || '—' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
                    <p class="text-sm text-gray-900 dark:text-white break-all">{{ user.email }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Téléphone</label>
                    <p class="text-sm text-gray-900 dark:text-white">{{ user.tel || '—' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matricule</label>
                    <p class="text-sm font-mono text-gray-900 dark:text-white">{{ user.matricule || '—' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type surveillant</label>
                    <p class="text-sm text-gray-900 dark:text-white capitalize">{{ user.supervisor_type_value || 'Non surveillant' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations fiscales -->
            <div v-if="user.nationalite === 'Togo'" class="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800/30 overflow-hidden">
              <div class="px-6 py-4 border-b border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10">
                <h3 class="font-medium text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Informations fiscales
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nationalité</label>
                    <p class="text-sm text-gray-900 dark:text-white">{{ user.nationalite }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">NIF</label>
                    <p class="text-sm font-mono text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg inline-block">{{ user.nif || '—' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Biographie -->
            <div v-if="user.biographie" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Biographie
                </h3>
              </div>
              <div class="p-6 prose dark:prose-invert prose-sm max-w-none" v-html="user.biographie"></div>
            </div>
          </div>

          <!-- Colonne droite -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documents
                </h3>
              </div>
              <div class="p-4">
                <DocumentItem
                  title="Pièce d'identité"
                  :url="user.identity_document_url"
                  required
                />
                <DocumentItem
                  v-if="user.nationalite === 'Togo'"
                  title="Justificatif NIF"
                  :url="user.nif_document_url"
                  required
                />
                <DocumentItem
                  title="Diplômes"
                  :url="user.diploma_document_url"
                />
                <DocumentItem
                  title="Curriculum Vitae"
                  :url="user.cv_document_url"
                />
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Rôles
                </h3>
              </div>
              <div class="p-6">
                <div v-if="user.roles && user.roles.length > 0" class="flex flex-wrap gap-2">
                  <span v-for="role in user.roles" :key="role.id" class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm rounded-lg flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    {{ role.nom }}
                  </span>
                </div>
                <p v-else class="text-sm text-gray-500 dark:text-gray-400">Aucun rôle assigné</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400">Professeur non trouvé</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import Breadcrumb from "~/components/Breadcrumb.vue"
import DocumentItem from "~/components/DocumentItem.vue"
import { useUserStore } from "~~/stores/user"

const route = useRoute()
const userStore = useUserStore()
const { $toastr } = useNuxtApp()

const loading = ref(true)
const user = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    const slug = route.params.slug
    await userStore.fetchUser(slug)
    user.value = userStore.user
    
    if (!user.value) {
      throw new Error("Utilisateur non trouvé")
    }
  } catch (error) {
    console.error("Erreur chargement:", error)
    $toastr.error(error.message || "Impossible de charger les détails du professeur")
  } finally {
    loading.value = false
  }
})
</script>