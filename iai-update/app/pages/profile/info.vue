<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- En-tête du profil - Plus coloré -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30">
                <span class="text-2xl font-light">{{ userInitials }}</span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full border-4 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <h1 class="text-2xl font-light text-gray-900 dark:text-white">
                {{ user.prenom }} {{ user.nom }}
              </h1>
              <div class="flex items-center space-x-2 mt-0.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                  {{ user.matricule || 'Étudiant' }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ user.email }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="editProfile"
              class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              title="Modifier le profil"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation avec couleurs -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'py-3 text-sm font-medium border-b-2 transition-all duration-200',
              currentTab === tab.id
                ? tab.id === 'info' 
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Contenu principal avec plus de couleurs -->
      <div class="space-y-6">
        <!-- Informations personnelles -->
        <div v-if="currentTab === 'info'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Colonne principale -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Carte d'identité avec dégradé -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-blue-100/50 dark:shadow-blue-900/10 border border-blue-100 dark:border-blue-900/30 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-blue-100 dark:border-blue-900/30">
                <h2 class="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Identité
                </h2>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-2 gap-4">
                  <InfoItem label="Prénom" :value="user.prenom" color="blue" />
                  <InfoItem label="Nom" :value="user.nom" color="indigo" />
                  <InfoItem label="Date de naissance" :value="formatDate(user.date_naissance)" color="purple" />
                  <InfoItem label="Lieu de naissance" :value="user.lieu_naissance || '—'" color="pink" />
                  <InfoItem label="Nationalité" :value="user.nationalite || '—'" color="teal" />
                  <InfoItem label="Genre" :value="user.genre || '—'" color="orange" />
                </dl>
              </div>
            </div>

            <!-- Coordonnées avec dégradé -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-purple-100/50 dark:shadow-purple-900/10 border border-purple-100 dark:border-purple-900/30 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-b border-purple-100 dark:border-purple-900/30">
                <h2 class="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Coordonnées
                </h2>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-2 gap-4">
                  <InfoItem label="Email" :value="user.email" color="purple" />
                  <InfoItem label="Téléphone" :value="user.tel || '—'" color="pink" />
                  <InfoItem label="Adresse" :value="user.adresse || '—'" class="col-span-2" color="indigo" />
                  <InfoItem label="Ville" :value="user.ville || '—'" color="blue" />
                  <InfoItem label="Pays" :value="user.pays || '—'" color="teal" />
                </dl>
              </div>
            </div>
          </div>

          <!-- Colonne latérale avec cartes colorées -->
          <div class="space-y-6">
            <!-- Informations académiques -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-emerald-100/50 dark:shadow-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-b border-emerald-100 dark:border-emerald-900/30">
                <h2 class="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  Académique
                </h2>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/10 rounded-lg">
                  <p class="text-xs text-emerald-600 dark:text-emerald-400">Matricule</p>
                  <p class="text-sm font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-2 py-1 rounded-lg">{{ user.matricule || '—' }}</p>
                </div>
                <div class="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-900/10 rounded-lg">
                  <p class="text-xs text-teal-600 dark:text-teal-400">Année d'admission</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ user.annee_admission || '—' }}</p>
                </div>
                <div class="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-900/10 rounded-lg">
                  <p class="text-xs text-cyan-600 dark:text-cyan-400">Superviseur</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ user.supervisor_type || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Statistiques compte avec dégradé -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-orange-100/50 dark:shadow-orange-900/10 border border-orange-100 dark:border-orange-900/30 overflow-hidden">
              <div class="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-b border-orange-100 dark:border-orange-900/30">
                <h2 class="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                  </svg>
                  Compte
                </h2>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-orange-600 dark:text-orange-400">Statut</span>
                  <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-sm">
                    <span class="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                    Actif
                  </span>
                </div>
                <div class="relative p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl">
                  <p class="text-xs text-orange-600 dark:text-orange-400 mb-1">Membre depuis</p>
                  <p class="text-lg font-light text-gray-900 dark:text-white">{{ formatDate(user.created_at, true) }}</p>
                </div>
                <div class="relative p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl">
                  <p class="text-xs text-amber-600 dark:text-amber-400 mb-1">Dernière modification</p>
                  <p class="text-lg font-light text-gray-900 dark:text-white">{{ formatDate(user.updated_at, true) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rôles avec cartes colorées -->
        <div v-if="currentTab === 'roles'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-purple-100/50 dark:shadow-purple-900/10 border border-purple-100 dark:border-purple-900/30 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-b border-purple-100 dark:border-purple-900/30">
            <h2 class="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Rôles et permissions
            </h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(role, index) in user.roles"
                :key="role.id"
                :class="[
                  'group relative rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1',
                  getRoleColor(index)
                ]"
              >
                <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full"></div>
                <div class="relative">
                  <div class="flex items-start justify-between mb-3">
                    <div class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <!-- <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/30 backdrop-blur-sm text-white">
                      Actif
                    </span> -->
                  </div>
                  <div>
                    <p class="font-medium text-white text-base mb-1">{{ role.nom }}</p>
                    <!-- <p class="text-xs text-white/80">{{ role.slug }}</p> -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Message si aucun rôle -->
            <div v-if="!user.roles?.length" class="text-center py-12">
              <div class="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-purple-400 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aucun rôle assigné</p>
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

// Données utilisateur
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const currentTab = ref('info');

const tabs = [
  { id: 'info', label: 'Informations' },
  { id: 'roles', label: 'Rôles' }
];

const userInitials = computed(() => {
  if (!user.value.prenom && !user.value.nom) return "U";
  const first = user.value.prenom?.[0] || '';
  const last = user.value.nom?.[0] || '';
  return (first + last).toUpperCase() || "U";
});

const formatDate = (date: string, withTime: boolean = false) => {
  if (!date) return "—";
  try {
    return withTime 
      ? format(new Date(date), "dd MMM yyyy", { locale: fr })
      : format(new Date(date), "dd MMM yyyy", { locale: fr });
  } catch {
    return "—";
  }
};

const getRoleColor = (index: number) => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-amber-600',
    'bg-gradient-to-br from-rose-500 to-red-600',
    'bg-gradient-to-br from-cyan-500 to-sky-600'
  ];
  return colors[index % colors.length];
};

const editProfile = () => {
  $toastr.info("Fonctionnalité d'édition du profil à venir");
};

onMounted(() => {
  if (!user.value.id) {
    $toastr.error("Vous devez être connecté pour voir cette page");
    navigateTo("/login");
  }
});
</script>

<!-- Composant InfoItem avec couleurs -->
<script lang="ts">
const InfoItem = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    color: {
      type: String,
      default: 'gray'
    }
  },
  setup(props) {
    const colorClasses = {
      blue: 'text-blue-600 dark:text-blue-400',
      indigo: 'text-indigo-600 dark:text-indigo-400',
      purple: 'text-purple-600 dark:text-purple-400',
      pink: 'text-pink-600 dark:text-pink-400',
      teal: 'text-teal-600 dark:text-teal-400',
      orange: 'text-orange-600 dark:text-orange-400',
      gray: 'text-gray-600 dark:text-gray-400'
    };
    
    return () => h('div', { class: 'space-y-1 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors' }, [
      h('p', { class: `text-xs ${colorClasses[props.color as keyof typeof colorClasses] || colorClasses.gray}` }, props.label),
      h('p', { class: 'text-sm text-gray-900 dark:text-white font-medium' }, props.value || '—')
    ]);
  }
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Transitions douces */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Effets de hover subtils */
.group:hover {
  transform: translateY(-2px);
}
</style>