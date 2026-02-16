<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900  pb-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6">
          <!-- Avatar simple -->
          <div class="flex-shrink-0">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mx-auto sm:mx-0">
              <span class="text-2xl sm:text-3xl font-medium">{{ userInitials }}</span>
            </div>
          </div>
          
          <!-- Informations utilisateur -->
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {{ user.prenom }} {{ user.nom }}
            </h1>
            
            <div class="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <!-- Matricule -->
              <span v-if="user.matricule" class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                </svg>
                {{ user.matricule }}
              </span>
              
              <!-- Email -->
              <span class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ user.email }}
              </span>
              
              <!-- Téléphone -->
              <span v-if="user.tel" class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ user.tel }}
              </span>
            </div>
            
            <!-- Rôles -->
            <div class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span 
                v-for="role in user.roles?.slice(0, 2)" 
                :key="role.id"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {{ role.nom }}
              </span>
              <span 
                v-if="user.roles?.length > 2" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              >
                +{{ user.roles.length - 2 }}
              </span>
            </div>
          </div>
          
          <!-- Boutons d'action -->
          <div class="flex items-center justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
            <button
              @click="editProfile"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
            
            <button
              @click="changePassword"
              class="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Mot de passe
            </button>
          </div>
        </div>
      </div>

      <!-- Système d'onglets -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Navigation des onglets - RESPONSIVE AVEC ESPACEMENT -->
        <div class="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 md:px-8 overflow-x-auto scrollbar-hide">
          <nav class="flex justify-start md:justify-center space-x-8 sm:space-x-12 md:space-x-16" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'py-4 md:py-5 inline-flex items-center gap-2 md:gap-3 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors',
                currentTab === tab.id
                  ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <svg 
                v-if="tab.id === 'info'" 
                class="w-5 h-5 md:w-6 md:h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <svg 
                v-if="tab.id === 'roles'" 
                class="w-5 h-5 md:w-6 md:h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg 
                v-if="tab.id === 'activity'" 
                class="w-5 h-5 md:w-6 md:h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Contenu des onglets -->
        <div class="p-4 sm:p-6 md:p-8">
          <!-- Onglet: Informations personnelles -->
          <div v-if="currentTab === 'info'" class="space-y-6 md:space-y-8">
            <!-- Grille d'informations -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <!-- Identité -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                  Identité
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 md:p-5 space-y-2 md:space-y-3">
                  <InfoRow label="Nom complet" :value="`${user.prenom} ${user.nom}`" />
                  <InfoRow label="Genre" :value="user.genre || 'Non renseigné'" />
                  <InfoRow label="Date de naissance" :value="formatDate(user.date_naissance)" />
                  <InfoRow label="Lieu de naissance" :value="user.lieu_naissance || 'Non renseigné'" />
                  <InfoRow label="Nationalité" :value="user.nationalite || 'Non renseignée'" />
                </div>
              </div>
              
              <!-- Contact -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                  Contact
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 md:p-5 space-y-2 md:space-y-3">
                  <InfoRow label="Email">
                    <template #value>
                      <a :href="`mailto:${user.email}`" class="text-gray-900 dark:text-white hover:underline">
                        {{ user.email }}
                      </a>
                    </template>
                  </InfoRow>
                  <InfoRow label="Téléphone">
                    <template #value>
                      <a v-if="user.tel" :href="`tel:${user.tel}`" class="text-gray-900 dark:text-white hover:underline">
                        {{ user.tel }}
                      </a>
                      <span v-else class="text-gray-500 dark:text-gray-400">Non renseigné</span>
                    </template>
                  </InfoRow>
                  <InfoRow label="Adresse" :value="user.adresse || 'Non renseignée'" />
                  <InfoRow label="Ville" :value="user.ville || 'Non renseignée'" />
                  <InfoRow label="Pays" :value="user.pays || 'Non renseigné'" />
                </div>
              </div>
              
              <!-- Académique -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                  Académique
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 md:p-5 space-y-2 md:space-y-3">
                  <InfoRow label="Matricule" :value="user.matricule || 'Non défini'" />
                  <InfoRow label="Année d'admission" :value="user.annee_admission || 'Non renseignée'" />
                  <InfoRow label="Superviseur" :value="user.supervisor_type || 'Non défini'" />
                </div>
              </div>
              
              <!-- Compte -->
              <div class="space-y-3 md:space-y-4">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                  Compte
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 md:p-5 space-y-2 md:space-y-3">
                  <InfoRow label="Statut">
                    <template #value>
                      <span class="text-gray-900 dark:text-white">
                        {{ user.email_verified_at ? 'Vérifié' : 'Non vérifié' }}
                      </span>
                    </template>
                  </InfoRow>
                  <InfoRow label="Membre depuis" :value="formatDate(user.created_at, true)" />
                  <InfoRow label="Dernière modification" :value="formatDate(user.updated_at, true)" />
                </div>
              </div>
            </div>
            
            <!-- Biographie -->
            <div v-if="user.biographie" class="space-y-3 md:space-y-4">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                Biographie
              </h3>
              <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 md:p-5 prose prose-sm max-w-none dark:prose-invert" v-html="user.biographie"></div>
            </div>
          </div>
          
          <!-- Onglet: Rôles -->
          <div v-if="currentTab === 'roles'" class="space-y-4 md:space-y-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
              Rôles ({{ user.roles?.length || 0 }})
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <div
                v-for="role in user.roles"
                :key="role.id"
                class="flex items-center gap-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                    {{ role.nom }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                    {{ role.slug }}
                  </p>
                </div>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                  Actif
                </span>
              </div>
            </div>
            
            <!-- Message si aucun rôle -->
            <div v-if="!user.roles?.length" class="text-center py-8 md:py-10">
              <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Aucun rôle assigné
              </p>
            </div>
          </div>
          
          <!-- Onglet: Activité récente -->
          <div v-if="currentTab === 'activity'" class="space-y-4 md:space-y-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
              Activité récente
            </h3>
            
            <div class="space-y-3 md:space-y-4">
              <!-- Connexion -->
              <div class="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div class="w-2 h-2 mt-2.5 bg-green-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                    Connexion à la plateforme
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                    Session active
                  </p>
                </div>
                <span class="text-xs text-gray-500">À l'instant</span>
              </div>
              
              <!-- Dernière modification -->
              <div class="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div class="w-2 h-2 mt-2.5 bg-blue-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                    Mise à jour du profil
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                    Informations personnelles modifiées
                  </p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(user.updated_at, true) }}</span>
              </div>
              
              <!-- Création du compte -->
              <div class="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div class="w-2 h-2 mt-2.5 bg-purple-500 rounded-full"></div>
                <div class="flex-1">
                  <p class="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                    Création du compte
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                    Inscription sur la plateforme
                  </p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(user.created_at, true) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const { $toastr } = useNuxtApp();

// Données utilisateur depuis localStorage
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));

// État local
const currentTab = ref('info');

// Configuration des onglets
const tabs = [
  { id: 'info', label: 'Informations' },
  { id: 'roles', label: 'Rôles' },
  // { id: 'activity', label: 'Activité' }
];

// Initiales de l'utilisateur
const userInitials = computed(() => {
  if (!user.value.prenom && !user.value.nom) return "U";
  const first = user.value.prenom?.[0] || '';
  const last = user.value.nom?.[0] || '';
  return (first + last).toUpperCase() || "U";
});

// Formatage des dates
const formatDate = (date: string, withTime: boolean = false) => {
  if (!date) return "Non renseignée";
  try {
    if (withTime) {
      return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: fr });
    }
    return format(new Date(date), "dd/MM/yyyy", { locale: fr });
  } catch {
    return "Date invalide";
  }
};

// Actions
const editProfile = () => {
  $toastr.info("Fonctionnalité d'édition du profil à venir");
};

const changePassword = () => {
  $toastr.info("Fonctionnalité de changement de mot de passe à venir");
};

// Composant InfoRow
const InfoRow = defineComponent({
  props: {
    label: String,
    value: [String, Number]
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2 md:gap-3 text-xs sm:text-sm' }, [
      h('span', { class: 'text-gray-500 dark:text-gray-400 sm:min-w-[100px] md:min-w-[110px] font-medium' }, props.label),
      h('span', { class: 'text-gray-900 dark:text-white flex-1 break-words' }, 
        slots.value ? slots.value() : (props.value || 'Non renseigné')
      )
    ]);
  }
});

onMounted(() => {
  if (!user.value.id) {
    $toastr.error("Vous devez être connecté pour voir cette page");
    navigateTo("/login");
  }
});
</script>

<style scoped>
/* Masquer scrollbar pour la navigation des onglets */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Style pour le contenu HTML de la biographie */
.prose {
  max-width: none;
  font-size: 0.875rem;
}

.prose p {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.prose p:last-child {
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .prose {
    font-size: 0.8125rem;
  }
}

/* Transitions douces */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>