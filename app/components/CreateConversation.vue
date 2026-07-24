<!-- components/CreateConversationDialog.vue -->
<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
              <!-- En-tête -->
              <div class="bg-[#25D366] px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-xl font-semibold text-white flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle conversation
                  </DialogTitle>
                  <button
                    @click="closeDialog"
                    class="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Informations sur le rôle de l'utilisateur -->
              <div class="px-6 pt-4">
                <div class="flex items-center gap-2 text-sm p-3 rounded-lg" :class="{
                  'bg-purple-50 text-purple-700': isAdmin,
                  'bg-blue-50 text-blue-700': isEnseignant,
                  'bg-gray-50 text-gray-600': isEtudiant
                }">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>
                    Connecté en tant que : 
                    <span class="font-semibold">
                      {{ userRole }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- Corps -->
              <div class="p-6 max-h-[70vh] overflow-y-auto">
                <!-- Type de conversation -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Type de conversation
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Bouton Privée - toujours disponible -->
                    <button
                      type="button"
                      @click="newConversation.type = 'private'"
                      class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all"
                      :class="newConversation.type === 'private' 
                        ? 'border-[#25D366] bg-[#DCF8C6] text-[#075E54]' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="font-medium">Privée</span>
                      <span v-if="newConversation.type === 'private'" class="text-xs bg-white px-2 py-0.5 rounded-full">1 participant</span>
                    </button>

                    <!-- Bouton Groupe - désactivé pour les étudiants -->
                    <button
                      type="button"
                      @click="newConversation.type = 'group'"
                      :disabled="!canCreateGroup"
                      class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all relative"
                      :class="{
                        'border-[#25D366] bg-[#DCF8C6] text-[#075E54]': newConversation.type === 'group' && canCreateGroup,
                        'border-gray-200 hover:border-gray-300 text-gray-700': newConversation.type !== 'group' && canCreateGroup,
                        'border-gray-200 text-gray-400 cursor-not-allowed opacity-50': !canCreateGroup
                      }"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span class="font-medium">Groupe</span>
                      <span v-if="!canCreateGroup" class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Réservé
                      </span>
                    </button>
                  </div>

                  <!-- Message d'information pour les étudiants -->
                  <div v-if="newConversation.type === 'group' && !canCreateGroup" class="mt-3 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm flex items-center gap-2">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Seuls les administrateurs et enseignants peuvent créer des groupes.</span>
                  </div>
                </div>

                <!-- Nom du groupe (uniquement pour groupe) -->
                <div v-if="newConversation.type === 'group' && canCreateGroup" class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom du groupe
                  </label>
                  <div class="relative">
                    <input
                      v-model="newConversation.name"
                      type="text"
                      placeholder="Ex: L3 Informatique, Projet React, etc."
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <!-- FILTRES DIRECTS - Uniquement pour groupe et si autorisé -->
                <div v-if="newConversation.type === 'group' && canCreateGroup" class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Filtrer les participants
                  </label>
                  
                  <div class="space-y-4">
                    <!-- Filtre par Filière (indépendant) -->
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Filtrer par filière</label>
                      <Dropdown
                        v-model="filters.filiere"
                        :options="filiereStore.filieres"
                        optionLabel="nom"
                        optionValue="id"
                        placeholder="Toutes les filières"
                        class="w-full"
                        :filter="true"
                        filterPlaceholder="Rechercher une filière..."
                        :showClear="true"
                      >
                        <template #option="slotProps">
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{{ slotProps.option.nom }}</span>
                          </div>
                        </template>
                      </Dropdown>
                    </div>

                    <!-- Filtre par Niveau (indépendant) -->
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Filtrer par niveau</label>
                      <Dropdown
                        v-model="filters.niveau"
                        :options="niveauStore.niveaux"
                        optionLabel="libelle"
                        optionValue="id"
                        placeholder="Tous les niveaux"
                        class="w-full"
                        :filter="true"
                        filterPlaceholder="Rechercher un niveau..."
                        :showClear="true"
                      >
                        <template #option="slotProps">
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>{{ slotProps.option.libelle }}</span>
                          </div>
                        </template>
                      </Dropdown>
                    </div>

                    <!-- Filtre par Groupe (indépendant) -->
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Filtrer par groupe</label>
                      <Dropdown
                        v-model="filters.groupe"
                        :options="groupeStore.groupes"
                        optionLabel="nom"
                        optionValue="id"
                        placeholder="Tous les groupes"
                        class="w-full"
                        :filter="true"
                        filterPlaceholder="Rechercher un groupe..."
                        :showClear="true"
                      >
                        <template #option="slotProps">
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{{ slotProps.option.nom }}</span>
                          </div>
                        </template>
                      </Dropdown>
                    </div>

                    <!-- Bouton pour réinitialiser tous les filtres -->
                    <div v-if="hasActiveFilters" class="flex justify-end">
                      <button
                        @click="resetFilters"
                        class="text-sm text-[#25D366] hover:text-[#128C7E] flex items-center gap-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Réinitialiser les filtres
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Message pour les étudiants (filtres cachés) -->
                <div v-if="newConversation.type === 'group' && !canCreateGroup" class="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p>Vous n'avez pas les permissions pour créer un groupe.</p>
                  <p class="text-sm">Vous pouvez uniquement envoyer des messages privés aux enseignants et administrateurs.</p>
                </div>

                <!-- Sélection des participants -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700">
                      {{ getSelectionLabel }}
                    </label>
                    <span class="text-sm text-gray-500">
                      {{ selectedUsers.length }} sélectionné(s)
                    </span>
                  </div>

                  <!-- Message pour les étudiants en mode privé -->
                  <div v-if="newConversation.type === 'private' && isEtudiant" class="mb-3 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Vous pouvez uniquement contacter les enseignants et administrateurs
                    </span>
                  </div>

                  <!-- Barre de recherche avec PrimeVue Dropdown -->
                  <div class="mb-4">
                    <Dropdown
                      v-model="selectedUser"
                      :options="filteredAvailableUsers"
                      optionLabel="displayName"
                      optionValue="id"
                      :placeholder="getPlaceholder"
                      class="w-full"
                      :filter="true"
                      filterPlaceholder="Rechercher par nom, prénom ou email..."
                      :showClear="true"
                      :disabled="!canSelectUsers"
                      :virtualScrollerOptions="{ itemSize: 48 }"
                      @change="handleUserSelection"
                    >
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-bold">
                            {{ getUserById(slotProps.value)?.initials }}
                          </div>
                          <span>{{ getUserById(slotProps.value)?.displayName }}</span>
                          <span class="text-xs text-gray-500">({{ getUserById(slotProps.value)?.role }})</span>
                        </div>
                        <span v-else class="text-gray-400">{{ slotProps.placeholder }}</span>
                      </template>
                      <template #option="slotProps">
                        <div class="flex items-center gap-3 p-2">
                          <div class="flex-shrink-0 w-8 h-8 rounded-full" :class="{
                            'bg-purple-500': slotProps.option.role === 'Admin',
                            'bg-blue-500': slotProps.option.role === 'Enseignant',
                            'bg-green-500': slotProps.option.role === 'Étudiant'
                          }">
                            <div class="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                              {{ slotProps.option.initials }}
                            </div>
                          </div>
                          <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">{{ slotProps.option.displayName }}</p>
                            <p class="text-xs text-gray-500 flex items-center gap-2">
                              <span :class="{
                                'text-purple-600': slotProps.option.role === 'Admin',
                                'text-blue-600': slotProps.option.role === 'Enseignant',
                                'text-green-600': slotProps.option.role === 'Étudiant'
                              }">{{ slotProps.option.role }}</span>
                              <span v-if="slotProps.option.filiere" class="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span v-if="slotProps.option.filiere">{{ slotProps.option.filiere }}</span>
                              <span v-if="slotProps.option.niveau" class="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span v-if="slotProps.option.niveau">{{ slotProps.option.niveau }}</span>
                            </p>
                          </div>
                          <div v-if="isUserSelected(slotProps.option.id)" class="text-[#25D366]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </template>
                    </Dropdown>
                  </div>

                  <!-- Actions rapides - Uniquement pour groupe et si autorisé -->
                  <div v-if="newConversation.type === 'group' && canCreateGroup" class="mb-4 flex flex-wrap gap-2">
                    <button
                      @click="selectAllEnseignants"
                      class="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Enseignants
                    </button>
                    <button
                      @click="selectAllEtudiants"
                      class="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      Étudiants
                    </button>
                    <button
                      @click="selectAllUsers"
                      class="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Tous
                    </button>
                    <button
                      @click="selectedUsers = []"
                      class="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Effacer
                    </button>
                  </div>

                  <!-- Participants sélectionnés (pills) -->
                  <div v-if="selectedUsers.length" class="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                    <span
                      v-for="id in selectedUsers"
                      :key="id"
                      class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                      :class="{
                        'bg-purple-100 text-purple-700': getUserById(id)?.role === 'Admin',
                        'bg-blue-100 text-blue-700': getUserById(id)?.role === 'Enseignant',
                        'bg-green-100 text-green-700': getUserById(id)?.role === 'Étudiant'
                      }"
                    >
                      {{ getUserDisplayName(id) }}
                      <button @click.stop="removeUser(id)" class="hover:text-red-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </div>

                  <!-- Message pour conversation privée -->
                  <div v-if="newConversation.type === 'private' && selectedUsers.length === 0" class="text-sm text-gray-500 italic">
                    {{ getPrivateMessage }}
                  </div>
                </div>
              </div>

              <!-- Pied de page -->
              <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  @click="closeDialog"
                  class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  @click="createConversation"
                  :disabled="!canCreate || loading"
                  class="px-6 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{{ loading ? 'Création...' : 'Créer la conversation' }}</span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import Dropdown from 'primevue/dropdown'
import { useFiliereStore } from '~~/stores/filiere'
import { useNiveauStore } from '~~/stores/niveau'
import { useGroupeStore } from '~~/stores/group'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useChatStore } from '~~/stores/chat'
import { useUserStore } from '~~/stores/user'
import { useToast } from '~/composables/useToast'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'conversation-created'])

// Récupération directe de l'utilisateur depuis le localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
  } catch (e) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', e)
  }
  return null
}

const currentUser = ref(getUserFromStorage())

// Mettre à jour si le localStorage change
onMounted(() => {
  window.addEventListener('storage', () => {
    currentUser.value = getUserFromStorage()
  })
})

// Vérifications des rôles
const isAdmin = computed(() => {
  const user = currentUser.value
  if (!user?.roles) return false
  
  return user.roles.some(role => 
    role.nom?.toLowerCase().includes('admin') ||
    role.slug?.toLowerCase().includes('admin')
  )
})

const isEnseignant = computed(() => {
  const user = currentUser.value
  if (!user?.roles) return false
  
  return user.roles.some(role => 
    role.nom?.toLowerCase().includes('enseignant') ||
    role.slug?.toLowerCase().includes('enseignant')
  )
})

const isEtudiant = computed(() => {
  // Si pas d'utilisateur, on considère que c'est un étudiant par défaut
  if (!currentUser.value) return true
  
  // N'est ni admin ni enseignant
  return !isAdmin.value && !isEnseignant.value
})

const userRole = computed(() => {
  if (isAdmin.value) return 'Administrateur'
  if (isEnseignant.value) return 'Enseignant'
  return 'Étudiant'
})

const chatStore = useChatStore()
const filiereStore = useFiliereStore()
const niveauStore = useNiveauStore()
const groupeStore = useGroupeStore()
const etudiantStore = useEtudiantStore()
const userStore=useUserStore()
const toast = useToast()

// États
const loading = ref(false)
const selectedUsers = ref([])
const selectedUser = ref(null)
const newConversation = ref({ type: 'private', name: '' })

// État pour les filtres
const filters = ref({
  filiere: null,
  niveau: null,
  groupe: null
})

const canCreateGroup = computed(() => {
  return isAdmin.value || isEnseignant.value
})

const canSelectUsers = computed(() => {
  return true // Toujours true car on peut sélectionner des utilisateurs
})

// Computed pour les filtres actifs
const hasActiveFilters = computed(() => {
  return filters.value.filiere !== null || 
         filters.value.niveau !== null || 
         filters.value.groupe !== null
})

// Computed pour les labels selon le rôle
const getSelectionLabel = computed(() => {
  if (newConversation.value.type === 'private') {
    return 'Sélectionner un utilisateur'
  } else {
    return canCreateGroup.value ? 'Sélectionner des participants' : 'Participants disponibles'
  }
})

const getPlaceholder = computed(() => {
  if (newConversation.value.type === 'private') {
    return isEtudiant.value ? 'Rechercher un enseignant ou admin...' : 'Rechercher un utilisateur...'
  } else {
    return canCreateGroup.value ? 'Rechercher des participants...' : 'Non disponible'
  }
})

const getPrivateMessage = computed(() => {
  if (isEtudiant.value) {
    return 'Sélectionnez un enseignant ou administrateur pour démarrer une conversation'
  }
  return 'Sélectionnez un utilisateur pour démarrer une conversation privée'
})

// Computed pour les utilisateurs disponibles avec filtres de rôle
const availableUsers = computed(() => {
  let users = []
  
  // Ajouter les enseignants (toujours visibles)
  if (userStore.enseignants) {
    userStore.enseignants.forEach(e => {
      users.push(formatUser(e, 'enseignant', 'Enseignant'))
    })
  }
  
  // Ajouter les étudiants (visibles uniquement pour admin et enseignants)
  if ((isAdmin.value || isEnseignant.value) && etudiantStore.etudiants) {
    etudiantStore.etudiants.forEach(e => {
      users.push(formatUser(e, 'etudiant', 'Étudiant'))
    })
  }
  
  // Appliquer les filtres
  if (filters.value.filiere) {
    users = users.filter(u => u.filiere_id === filters.value.filiere)
  }
  if (filters.value.niveau) {
    users = users.filter(u => u.niveau_id === filters.value.niveau)
  }
  if (filters.value.groupe) {
    users = users.filter(u => u.groupe_id === filters.value.groupe)
  }
  
  // Exclure l'utilisateur courant
  return users.filter(u => u.id !== currentUser.value?.id)
})

const filteredAvailableUsers = computed(() => {
  let users = availableUsers.value
  
  // Pour les étudiants en mode privé, filtrer pour ne montrer que enseignants/admins
  if (newConversation.value.type === 'private' && isEtudiant.value) {
    users = users.filter(u => u.role === 'Enseignant' || u.role === 'Admin')
  }
  
  // Pour les conversations privées, exclure les utilisateurs déjà sélectionnés
  if (newConversation.value.type === 'private') {
    users = users.filter(u => !selectedUsers.value.includes(u.id))
  }
  
  return users
})

const canCreate = computed(() => {
  if (selectedUsers.value.length === 0) return false
  if (newConversation.value.type === 'private' && selectedUsers.value.length !== 1) return false
  if (newConversation.value.type === 'group') {
    if (!canCreateGroup.value) return false
    if (!newConversation.value.name) return false
  }
  return true
})

// Méthodes
const formatUser = (user, type, role) => ({
  id: user.id,
  type,
  role,
  displayName: `${user.prenom || ''} ${user.nom || ''}`.trim(),
  email: user.email,
  initials: ((user.prenom?.[0] || '') + (user.nom?.[0] || '')).toUpperCase(),
  filiere_id: user.filiere_id,
  niveau_id: user.niveau_id,
  groupe_id: user.groupe_id,
  filiere: user.filiere_nom || '',
  niveau: user.niveau_libelle || ''
})

const getUserById = (id) => {
  return availableUsers.value.find(u => u.id === id)
}

const getUserDisplayName = (id) => {
  const user = getUserById(id)
  return user?.displayName || ''
}

const isUserSelected = (id) => selectedUsers.value.includes(id)

const handleUserSelection = (event) => {
  if (!event.value) return
  
  const userId = event.value
  const targetUser = getUserById(userId)
  
  // Vérifier les permissions pour les étudiants
  if (isEtudiant.value && targetUser?.role !== 'Enseignant' && targetUser?.role !== 'Admin') {
    toast.error('Vous ne pouvez contacter que les enseignants et administrateurs')
    selectedUser.value = null
    return
  }
  
  if (newConversation.value.type === 'private') {
    selectedUsers.value = [userId]
  } else {
    if (!selectedUsers.value.includes(userId)) {
      selectedUsers.value.push(userId)
    }
  }
  
  selectedUser.value = null
}

const removeUser = (id) => {
  selectedUsers.value = selectedUsers.value.filter(i => i !== id)
}

const resetFilters = () => {
  filters.value = {
    filiere: null,
    niveau: null,
    groupe: null
  }
}

const selectAllEnseignants = () => {
  if (!canCreateGroup.value) return
  selectedUsers.value = availableUsers.value
    .filter(u => u.role === 'Enseignant')
    .map(u => u.id)
  toast.success(`${selectedUsers.value.length} enseignant(s) sélectionné(s)`)
}

const selectAllEtudiants = () => {
  if (!canCreateGroup.value) return
  selectedUsers.value = availableUsers.value
    .filter(u => u.role === 'Étudiant')
    .map(u => u.id)
  toast.success(`${selectedUsers.value.length} étudiant(s) sélectionné(s)`)
}

const selectAllUsers = () => {
  if (!canCreateGroup.value) return
  selectedUsers.value = availableUsers.value.map(u => u.id)
  toast.success(`${selectedUsers.value.length} participant(s) sélectionné(s)`)
}

const createConversation = async () => {
  if (!canCreate.value || loading.value) return
  
  loading.value = true
  try {
    const participants = selectedUsers.value.map(id => {
      const u = availableUsers.value.find(u => u.id === id)
      return {
        id,
        type: u.type === 'etudiant' ? 'Etudiant' : u.type === 'enseignant' ? 'Enseignant' : 'User'
      }
    })
    
    participants.push({ id: currentUser.value.id, type: 'User' })
    
    const data = {
      type: newConversation.value.type,
      participants
    }
    
    if (data.type === 'group') {
      data.name = newConversation.value.name || 'Nouveau groupe'
    }
    
    const conv = await chatStore.createConversation(data)
    
    // Réinitialiser
    resetFilters()
    selectedUsers.value = []
    selectedUser.value = null
    newConversation.value = { type: 'private', name: '' }
    
    toast.success('Conversation créée avec succès !')
    emit('conversation-created', conv)
    closeDialog()
    
  } catch (error) {
    console.error('Erreur création conversation:', error)
    toast.error(error.response?.data?.message || 'Erreur lors de la création de la conversation')
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  emit('update:modelValue', false)
}

// Reset quand le dialogue se ferme
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    resetFilters()
    selectedUsers.value = []
    selectedUser.value = null
    newConversation.value = { type: 'private', name: '' }
  }
})
</script>

<style scoped>
/* Styles PrimeVue */
:deep(.p-dropdown) {
  width: 100%;
  border-radius: 0.5rem;
  border-color: #e5e7eb;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #25D366;
}

:deep(.p-dropdown.p-focus) {
  border-color: #25D366;
  box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2);
}

:deep(.p-dropdown-panel) {
  border-radius: 0.5rem;
  margin-top: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-dropdown-panel .p-dropdown-items-wrapper) {
  max-height: 300px;
}

:deep(.p-dropdown-panel .p-dropdown-item) {
  padding: 0.75rem;
  transition: background-color 0.2s;
}

:deep(.p-dropdown-panel .p-dropdown-item:hover) {
  background-color: #DCF8C6;
}

:deep(.p-dropdown-panel .p-dropdown-item.p-highlight) {
  background-color: #25D366;
  color: white;
}

:deep(.p-dropdown-panel .p-dropdown-item.p-highlight:hover) {
  background-color: #128C7E;
}

:deep(.p-dropdown-filter-container) {
  padding: 0.5rem;
}

:deep(.p-dropdown-filter) {
  border-radius: 0.375rem;
  border-color: #e5e7eb;
  padding: 0.5rem;
}

:deep(.p-dropdown-filter:focus) {
  border-color: #25D366;
  box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2);
}

/* Scrollbar styles */
:deep(.p-dropdown-items-wrapper::-webkit-scrollbar) {
  width: 4px;
}

:deep(.p-dropdown-items-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.p-dropdown-items-wrapper::-webkit-scrollbar-thumb) {
  background: #ccc;
  border-radius: 999px;
}

:deep(.p-dropdown-items-wrapper::-webkit-scrollbar-thumb:hover) {
  background: #999;
}

/* Animation */
:deep(.p-dropdown-panel) {
  transform-origin: top;
  animation: dropdown-fade-in 0.2s ease-out;
}

@keyframes dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>