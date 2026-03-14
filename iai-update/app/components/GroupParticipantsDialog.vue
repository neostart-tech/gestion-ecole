<!-- components/GroupParticipantsDialog.vue -->
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
              <div class="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-xl font-semibold text-white flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Gérer les participants
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

              <!-- Corps -->
              <div class="p-6 max-h-[70vh] overflow-y-auto">
                <!-- Stats -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                  <div class="bg-blue-50 rounded-lg p-4 text-center">
                    <p class="text-2xl font-bold text-blue-600">{{ participants.length }}</p>
                    <p class="text-xs text-gray-600">Total</p>
                  </div>
                  <div class="bg-green-50 rounded-lg p-4 text-center">
                    <p class="text-2xl font-bold text-green-600">{{ admins.length }}</p>
                    <p class="text-xs text-gray-600">Admins</p>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-4 text-center">
                    <p class="text-2xl font-bold text-purple-600">{{ members.length }}</p>
                    <p class="text-xs text-gray-600">Membres</p>
                  </div>
                </div>

                <!-- Ajouter des participants -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter des participants
                  </label>
                  <div class="flex gap-2">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none transition"
                    />
                    <button
                      @click="showUserSelector = !showUserSelector"
                      class="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors flex items-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter
                    </button>
                  </div>

                  <!-- Sélecteur d'utilisateurs -->
                  <div v-if="showUserSelector" class="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                    <div class="max-h-60 overflow-y-auto divide-y divide-gray-200">
                      <label
                        v-for="user in filteredAvailableUsers"
                        :key="user.id"
                        class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          :value="user.id"
                          v-model="selectedNewUsers"
                          class="w-4 h-4 text-[#25D366] border-gray-300 rounded focus:ring-[#25D366]"
                        />
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-bold">
                          {{ user.initials }}
                        </div>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ user.displayName }}</p>
                          <p class="text-xs text-gray-500">{{ user.role }}</p>
                        </div>
                      </label>

                      <div v-if="filteredAvailableUsers.length === 0" class="p-4 text-center text-gray-500">
                        Aucun utilisateur disponible
                      </div>
                    </div>

                    <div v-if="selectedNewUsers.length" class="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                      <button
                        @click="addParticipants"
                        class="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors text-sm"
                      >
                        Ajouter ({{ selectedNewUsers.length }})
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Liste des participants actuels -->
                <div>
                  <h4 class="font-medium text-gray-900 mb-3">Participants actuels</h4>
                  <div class="space-y-2">
                    <div
                      v-for="participant in participants"
                      :key="participant.id"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div class="flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-medium">
                          {{ participant.initials }}
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ participant.name }}</p>
                          <p class="text-xs text-gray-500">{{ participant.role }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span
                          class="px-2 py-1 text-xs rounded-full"
                          :class="participant.isAdmin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                        >
                          {{ participant.isAdmin ? 'Admin' : 'Membre' }}
                        </span>
                        
                        <!-- Actions (si l'utilisateur est admin) -->
                        <template v-if="isCurrentUserAdmin && participant.id !== userStore.user?.id">
                          <button
                            v-if="!participant.isAdmin"
                            @click="makeAdmin(participant)"
                            class="p-1 text-gray-500 hover:text-[#25D366] transition-colors"
                            title="Nommer admin"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            @click="removeParticipant(participant)"
                            class="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Retirer du groupe"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pied de page -->
              <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  @click="closeDialog"
                  class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fermer
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
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useUserStore } from '~~/stores/user'
import { useChatStore } from '~~/stores/chat'
import { useToast } from '~/composables/useToast'

const props = defineProps({
  modelValue: Boolean,
  conversation: Object
})

const emit = defineEmits(['update:modelValue', 'updated'])

const userStore = useUserStore()
const chatStore = useChatStore()
const toast = useToast()

const showUserSelector = ref(false)
const searchQuery = ref('')
const selectedNewUsers = ref([])
const loading = ref(false)

// Participants formatés
const participants = computed(() => {
  if (!props.conversation?.participants) return []
  return props.conversation.participants.map(p => ({
    id: p.id,
    name: `${p.prenom || ''} ${p.nom || ''}`.trim(),
    initials: ((p.prenom?.[0] || '') + (p.nom?.[0] || '')).toUpperCase(),
    role: p.pivot?.role === 'admin' ? 'Admin' : 'Membre',
    isAdmin: p.pivot?.role === 'admin'
  }))
})

const admins = computed(() => participants.value.filter(p => p.isAdmin))
const members = computed(() => participants.value.filter(p => !p.isAdmin))

const isCurrentUserAdmin = computed(() => {
  const currentUser = participants.value.find(p => p.id === userStore.user?.id)
  return currentUser?.isAdmin || false
})

// Utilisateurs disponibles pour ajout
const availableUsers = computed(() => {
  // Logique pour récupérer les utilisateurs non participants
  // À adapter selon votre logique métier
  return []
})

const filteredAvailableUsers = computed(() => {
  if (!searchQuery.value) return availableUsers.value
  const query = searchQuery.value.toLowerCase()
  return availableUsers.value.filter(u => 
    u.displayName.toLowerCase().includes(query) ||
    u.role.toLowerCase().includes(query)
  )
})

const addParticipants = async () => {
  if (!selectedNewUsers.value.length) return
  
  loading.value = true
  try {
    for (const userId of selectedNewUsers.value) {
      await chatStore.addParticipant(props.conversation.id, { user_id: userId })
    }
    
    toast.success(`${selectedNewUsers.value.length} participant(s) ajouté(s)`)
    selectedNewUsers.value = []
    showUserSelector.value = false
    emit('updated')
    
  } catch (error) {
    toast.error('Erreur lors de l\'ajout des participants')
  } finally {
    loading.value = false
  }
}

const makeAdmin = async (participant) => {
  try {
    await chatStore.updateParticipantRole(props.conversation.id, participant.id, 'admin')
    toast.success(`${participant.name} est maintenant admin`)
    emit('updated')
  } catch (error) {
    toast.error('Erreur lors de la modification du rôle')
  }
}

const removeParticipant = async (participant) => {
  if (!confirm(`Retirer ${participant.name} du groupe ?`)) return
  
  try {
    await chatStore.removeParticipant(props.conversation.id, participant.id)
    toast.success(`${participant.name} a été retiré du groupe`)
    emit('updated')
  } catch (error) {
    toast.error('Erreur lors du retrait du participant')
  }
}

const closeDialog = () => {
  emit('update:modelValue', false)
  showUserSelector.value = false
  searchQuery.value = ''
  selectedNewUsers.value = []
}
</script>