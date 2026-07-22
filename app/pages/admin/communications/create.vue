<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/admin/communications" class="inline-flex items-center text-sm text-gray-500 hover:text-violet-600 mb-4 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à la liste
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Nouvelle Annonce</h1>
      <p class="text-gray-500 mt-1">Diffusez une information importante à votre communauté.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-[5px] shadow-sm border border-gray-100">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Ex: Fermeture exceptionnelle de l'établissement"
                class="block w-full px-3 py-2 border border-gray-200 rounded-[5px] focus:ring-violet-500 focus:border-violet-500 text-sm transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type d'annonce</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="type in types"
                  :key="type.id"
                  @click="form.type = type.id"
                  type="button"
                  :class="[
                    'flex flex-col items-center justify-center p-3 border rounded-[5px] transition-all',
                    form.type === type.id 
                      ? 'border-violet-600 bg-violet-50 text-violet-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  ]"
                >
                  <span class="text-xs font-semibold">{{ type.label }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contenu du message</label>
              <textarea
                v-model="form.content"
                rows="8"
                placeholder="Écrivez votre message ici..."
                class="block w-full px-3 py-2 border border-gray-200 rounded-[5px] focus:ring-violet-500 focus:border-violet-500 text-sm transition-all"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pièces jointes</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-[5px] hover:border-violet-400 transition-colors cursor-pointer" @click="$refs.fileInput.click()">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <span class="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500">
                      Cliquez pour ajouter des fichiers
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">PDF, DOC, PNG, JPG jusqu'à 10MB</p>
                </div>
                <input type="file" ref="fileInput" multiple class="hidden" @change="handleFileUpload" />
              </div>

              <!-- File List -->
              <div v-if="files.length > 0" class="mt-4 space-y-2">
                <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between p-2 bg-gray-50 rounded-[5px] border border-gray-100">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 012 0h4a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm text-gray-600 truncate max-w-xs">{{ file.name }}</span>
                    <span class="text-xs text-gray-400 ml-2">({{ formatSize(file.size) }})</span>
                  </div>
                  <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l18 18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Sidebar -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-[5px] shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Ciblage</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Destinataires</label>
              <div class="space-y-2">
                <label v-for="target in targets" :key="target.id" class="flex items-center p-3 border border-gray-100 rounded-[5px] hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="radio" v-model="form.target_type" :value="target.id" class="text-violet-600 focus:ring-violet-500" />
                  <span class="ml-3 text-sm text-gray-700">{{ target.label }}</span>
                </label>
              </div>
            </div>

            <!-- Role Selection -->
            <div v-if="form.target_type === 'roles'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sélectionner les rôles</label>
              <div class="max-h-48 overflow-y-auto border border-gray-100 rounded-[5px] p-2 space-y-1 custom-scroll">
                <label v-for="role in roleStore.roles" :key="role.id" class="flex items-center p-2 hover:bg-violet-50 rounded-[5px] transition-colors cursor-pointer">
                  <input type="checkbox" :value="role.id" v-model="form.target_data" class="text-violet-600 focus:ring-violet-500 rounded" />
                  <span class="ml-2 text-xs text-gray-600">{{ role.nom }}</span>
                </label>
              </div>
            </div>

            <div v-if="form.target_type === 'specific_users'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Rechercher un utilisateur</label>
              <div class="relative">
                <input
                  v-model="searchUserQuery"
                  type="text"
                  placeholder="Nom, prénom ou email..."
                  class="block w-full px-3 py-2 border border-gray-200 rounded-[5px] focus:ring-violet-500 focus:border-violet-500 text-sm transition-all"
                  @focus="showUserDropdown = true"
                  @blur="setTimeout(() => showUserDropdown = false, 200)"
                />
                <div v-if="showUserDropdown && searchUserQuery.length > 0" class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-48 rounded-[5px] py-1 text-sm overflow-auto border border-gray-100">
                  <div v-if="filteredUsers.length === 0" class="px-4 py-2 text-gray-500 text-xs">Aucun résultat trouvé</div>
                  <div
                    v-for="user in filteredUsers"
                    :key="user.id"
                    @click="addUserToTarget(user)"
                    class="cursor-pointer select-none relative px-4 py-2 hover:bg-violet-50 text-gray-700 hover:text-violet-900"
                  >
                    {{ user.nom_complet || user.nom }} <span class="text-xs text-gray-400">({{ user.email }})</span>
                  </div>
                </div>
              </div>

              <!-- Selected Users List -->
              <div v-if="selectedUsers.length > 0" class="mt-3 space-y-2">
                <div v-for="user in selectedUsers" :key="user.id" class="flex items-center justify-between p-2 bg-violet-50 border border-violet-100 rounded-[5px]">
                  <span class="text-xs font-medium text-violet-800">{{ user.nom_complet || user.nom }}</span>
                  <button type="button" @click="removeUserFromTarget(user.id)" class="text-violet-400 hover:text-violet-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l18 18"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[5px] shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Publication</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Publier immédiatement</span>
              <button 
                @click="form.is_published = !form.is_published"
                :class="form.is_published ? 'bg-violet-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
              >
                <span :class="form.is_published ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date d'expiration (optionnel)</label>
              <input
                v-model="form.expires_at"
                type="datetime-local"
                class="block w-full px-3 py-2 border border-gray-200 rounded-[5px] focus:ring-violet-500 focus:border-violet-500 text-sm transition-all"
              />
              <p class="text-[10px] text-gray-400 mt-1">L'annonce sera archivée après cette date.</p>
            </div>
          </div>

          <div class="mt-8 space-y-3">
            <Can action="create-communication">
              <button
                @click="submit"
                :disabled="communicationStore.isLoading"
                class="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-[5px] transition-all shadow-md disabled:opacity-50 flex items-center justify-center"
              >
                <svg v-if="communicationStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ form.is_published ? 'Publier l\'annonce' : 'Enregistrer en brouillon' }}
              </button>
            </Can>
            <NuxtLink
              to="/admin/communications"
              class="block w-full py-3 text-center text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              Annuler
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useCommunicationStore } from '~~/stores/communication';
import { useRoleStore } from '~~/stores/role';
import { useUserStore } from '~~/stores/user';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

definePageMeta({
  layout: 'default',
});

const router = useRouter();
const communicationStore = useCommunicationStore();
const roleStore = useRoleStore();
const userStore = useUserStore();

const form = ref({
  title: '',
  content: '',
  type: 'info',
  target_type: 'all',
  target_data: [],
  is_published: true,
  expires_at: '',
});

const files = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const types = [
  { id: 'info', label: 'Information' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'event', label: 'Événement' },
];

const targets = [
  { id: 'all', label: 'Tout le monde' },
  { id: 'roles', label: 'Rôles spécifiques' },
  { id: 'specific_users', label: 'Utilisateurs ciblés' },
];

onMounted(() => {
  roleStore.fetchRoles();
  userStore.fetchUsers();
});

const searchUserQuery = ref('');
const showUserDropdown = ref(false);
const selectedUsers = ref<any[]>([]);

watch(() => form.value.target_type, () => {
  form.value.target_data = [];
  selectedUsers.value = [];
});

const filteredUsers = computed(() => {
  if (!searchUserQuery.value) return [];
  const query = searchUserQuery.value.toLowerCase();
  return userStore.users.filter(u => 
    (u.nom_complet?.toLowerCase().includes(query) || 
     u.nom?.toLowerCase().includes(query) || 
     u.email?.toLowerCase().includes(query)) &&
    !selectedUsers.value.find(su => su.id === u.id)
  ).slice(0, 10);
});

const addUserToTarget = (user: any) => {
  selectedUsers.value.push(user);
  form.value.target_data.push(user.id as never);
  searchUserQuery.value = '';
  showUserDropdown.value = false;
};

const removeUserFromTarget = (userId: number) => {
  selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId);
  form.value.target_data = form.value.target_data.filter(id => id !== userId);
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    for (let i = 0; i < target.files.length; i++) {
      files.value.push(target.files[i]);
    }
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const submit = async () => {
  if (!form.value.title || !form.value.content) {
    Swal.fire({
      icon: 'error',
      title: 'Champs requis',
      text: 'Le titre et le contenu sont obligatoires.',
      borderRadius: '5px'
    });
    return;
  }

  try {
    const payload = {
      ...form.value,
      attachments: files.value,
    };
    
    await communicationStore.createCommunication(payload);
    
    Swal.fire({
      icon: 'success',
      title: 'Succès !',
      text: form.value.is_published ? 'Annonce publiée avec succès.' : 'Brouillon enregistré.',
      timer: 2000,
      showConfirmButton: false,
      borderRadius: '5px'
    });
    
    router.push('/admin/communications');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de l\'enregistrement.',
      borderRadius: '5px'
    });
  }
};
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #f3f4f6;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #ddd6fe;
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #c4b5fd;
}
</style>
