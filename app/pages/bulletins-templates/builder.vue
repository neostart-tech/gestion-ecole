<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors">
    <Breadcrumb
      :items="[
        { label: 'Modèles', to: '/bulletins-templates' },
        { label: route.query.slug ? 'Modifier' : 'Créer', to: null },
      ]"
      :title="route.query.slug ? 'Modifier le modèle de bulletin' : 'Créer un modèle de bulletin'"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <div class="flex justify-between items-center mb-6">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Glissez-déposez ou cliquez sur les blocs pour configurer la structure du document PDF final.
      </div>
      <button 
        @click="save" 
        :disabled="isSaving"
        class="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
      >
        <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Options globales & Palette de Blocs -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        
        <!-- Paramètres -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Paramètres
          </h2>
          <div class="space-y-5">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-gray-500 uppercase">Nom du modèle</label>
              <input v-model="form.nom" type="text" class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" placeholder="Ex: Bulletin Trimestre 1" />
            </div>
            
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-gray-500 uppercase">Type de Période visée</label>
              <select v-model="form.type_periode" class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white">
                <option value="">-- Sélectionner --</option>
                <option value="trimestre_1">Trimestre 1</option>
                <option value="trimestre_2">Trimestre 2</option>
                <option value="trimestre_3">Trimestre 3</option>
                <option value="semestre_1">Semestre 1</option>
                <option value="semestre_2">Semestre 2</option>
                <option value="annuel">Annuel / Bilan</option>
              </select>
            </div>
            
            <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <input v-model="form.is_default" type="checkbox" class="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-900 dark:text-white">Modèle par défaut</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Sera utilisé automatiquement si aucun autre n'est défini.</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Blocs disponibles -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sticky top-6">
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Ajouter un Bloc
          </h2>
          <div class="space-y-2">
            <button 
              v-for="block in availableBlocks" 
              :key="block.type"
              @click="addBlock(block.type)"
              class="w-full text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm flex items-center justify-between group transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="p-1.5 bg-white dark:bg-gray-700 rounded-md shadow-sm border border-gray-100 dark:border-gray-600">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ block.label }}</span>
              </div>
            </button>
          </div>
        </div>

      </div>

      <!-- Constructeur (Builder) Zone de dépôt -->
      <div class="lg:col-span-8 bg-gray-100/50 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-4 sm:p-8 min-h-[600px] flex flex-col">
        <h2 class="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-white">Structure du Bulletin</h2>
        
        <div v-if="form.layout_json.length === 0" class="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <p>Aucun bloc n'a été ajouté.</p>
          <p class="text-sm mt-1">Utilisez le menu de gauche pour construire la structure.</p>
        </div>

        <div v-else class="space-y-4 max-w-3xl mx-auto w-full">
          <div 
            v-for="(block, index) in form.layout_json" 
            :key="block.id"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col group hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
          >
            <!-- En-tête du bloc (cliquable pour accordion) -->
            <div class="p-4 flex items-center justify-between cursor-pointer" @click="toggleBlock(index)">
              <div class="flex items-center space-x-4">
                <!-- Ordre controls -->
                <div class="flex flex-col space-y-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1" @click.stop>
                  <button @click="moveBlock(index, -1)" :disabled="index === 0" class="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-30 disabled:hover:bg-transparent">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                  </button>
                  <button @click="moveBlock(index, 1)" :disabled="index === form.layout_json.length - 1" class="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-30 disabled:hover:bg-transparent">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                </div>

                <!-- Bloc info -->
                <div>
                  <div class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs">{{ index + 1 }}</span>
                    {{ availableBlocks.find(b => b.type === block.type)?.label || block.type }}
                  </div>
                  <div class="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-8">Type: {{ block.type }}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button @click.stop="removeBlock(index)" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100" title="Supprimer ce bloc">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
                <div class="p-2 text-gray-400">
                  <svg v-if="expandedBlockIndex === index" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <!-- Contenu de l'accordéon (Options) -->
            <div v-if="expandedBlockIndex === index" class="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-xl cursor-default" @click.stop>
              
              <!-- Options pour ENTETE -->
              <div v-if="block.type === 'entete'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-semibold text-gray-500 uppercase">Alignement du Logo</label>
                  <select v-model="block.options.logo_align" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="gauche">À gauche</option>
                    <option value="centre">Au centre</option>
                    <option value="droite">À droite</option>
                  </select>
                </div>
                <div class="flex items-center gap-2 mt-6">
                  <input type="checkbox" v-model="block.options.show_slogan" id="show_slogan" class="rounded text-indigo-600 border-gray-300" />
                  <label for="show_slogan" class="text-sm font-medium text-gray-700 dark:text-gray-300">Afficher la devise / slogan</label>
                </div>
              </div>

              <!-- Options pour INFO_ETUDIANT -->
              <div v-else-if="block.type === 'info_etudiant'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-semibold text-gray-500 uppercase">Disposition</label>
                  <select v-model="block.options.layout" class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="1_colonne">1 Colonne</option>
                    <option value="2_colonnes">2 Colonnes</option>
                  </select>
                </div>
                <div class="flex items-center gap-2 mt-6">
                  <input type="checkbox" v-model="block.options.show_photo" id="show_photo" class="rounded text-indigo-600 border-gray-300" />
                  <label for="show_photo" class="text-sm font-medium text-gray-700 dark:text-gray-300">Afficher la photo de l'étudiant</label>
                </div>
              </div>

              <!-- Options pour TABLEAU_NOTES et CUMUL -->
              <div v-else-if="block.type === 'tableau_notes' || block.type === 'tableau_notes_cumul'" class="space-y-4">
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="block.options.group_by_ue" :id="'group_ue_' + index" class="rounded text-indigo-600 border-gray-300" />
                  <label :for="'group_ue_' + index" class="text-sm font-medium text-gray-700 dark:text-gray-300">Grouper les matières par Unité d'Enseignement (UE)</label>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <label class="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="checkbox" v-model="block.options.show_coef" class="rounded text-indigo-600 border-gray-300" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Colonne Coefficient</span>
                  </label>
                  <label class="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="checkbox" v-model="block.options.show_rank" class="rounded text-indigo-600 border-gray-300" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Colonne Rang</span>
                  </label>
                  <label class="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="checkbox" v-model="block.options.show_appreciation" class="rounded text-indigo-600 border-gray-300" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Colonne Appréciation</span>
                  </label>
                </div>
              </div>

              <!-- Options pour BILAN -->
              <div v-else-if="block.type === 'bilan'" class="space-y-4">
                 <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="block.options.show_attendance" :id="'show_attendance_' + index" class="rounded text-indigo-600 border-gray-300" />
                  <label :for="'show_attendance_' + index" class="text-sm font-medium text-gray-700 dark:text-gray-300">Afficher le récapitulatif des absences et retards</label>
                </div>
              </div>

              <!-- Options pour SIGNATURES -->
              <div v-else-if="block.type === 'signatures'" class="space-y-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Sélectionnez les signataires qui apparaîtront au bas du bulletin. Les noms seront récupérés automatiquement depuis les paramètres.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label class="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input type="checkbox" v-model="block.options.sign_dir_etudes" class="rounded text-indigo-600 border-gray-300" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Direction des études</span>
                  </label>
                </div>
              </div>
              
              <!-- Message par défaut si pas d'options spécifiques -->
              <div v-else class="text-sm text-gray-500 italic">
                Ce bloc ne possède pas d'options configurables supplémentaires pour le moment.
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from "~/components/Breadcrumb.vue"

const { $api, $swal } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const form = ref({
  nom: '',
  type_periode: '',
  layout_json: [],
  is_default: false
})
const isSaving = ref(false)

const expandedBlockIndex = ref(null)

const toggleBlock = (index) => {
  if (expandedBlockIndex.value === index) {
    expandedBlockIndex.value = null
  } else {
    expandedBlockIndex.value = index
  }
}

const availableBlocks = [
  { type: 'entete', label: 'En-tête de l\'école' },
  { type: 'info_etudiant', label: 'Informations Étudiant' },
  { type: 'tableau_notes', label: 'Tableau des Notes (Semestre)' },
  { type: 'tableau_notes_cumul', label: 'Tableau des Notes (Annuel / Cumulé)' },
  { type: 'bilan', label: 'Bilan de travail / Décision' },
  { type: 'signatures', label: 'Signatures' }
]

const addBlock = (blockType) => {
  form.value.layout_json.push({
    id: Date.now(),
    type: blockType,
    options: {}
  })
}

const removeBlock = (index) => {
  form.value.layout_json.splice(index, 1)
}

const moveBlock = (index, direction) => {
  if (direction === -1 && index > 0) {
    const temp = form.value.layout_json[index]
    form.value.layout_json[index] = form.value.layout_json[index - 1]
    form.value.layout_json[index - 1] = temp
  } else if (direction === 1 && index < form.value.layout_json.length - 1) {
    const temp = form.value.layout_json[index]
    form.value.layout_json[index] = form.value.layout_json[index + 1]
    form.value.layout_json[index + 1] = temp
  }
}

const save = async () => {
  if (!form.value.nom) {
    $swal.fire('Attention', 'Veuillez renseigner le nom du modèle.', 'warning')
    return
  }
  if (form.value.layout_json.length === 0) {
    $swal.fire('Attention', 'Veuillez ajouter au moins un bloc au modèle.', 'warning')
    return
  }
  
  try {
    isSaving.value = true
    if (route.query.slug) {
      await $api.put(`/bulletin-templates/${route.query.slug}`, form.value)
    } else {
      await $api.post('/bulletin-templates', form.value)
    }
    $swal.fire({
      icon: 'success',
      title: 'Enregistré',
      text: 'Le modèle a été enregistré avec succès.',
      timer: 2000,
      showConfirmButton: false
    })
    router.push('/bulletins-templates')
  } catch (error) {
    console.error('Erreur de sauvegarde', error)
    $swal.fire('Erreur', 'Une erreur est survenue lors de la sauvegarde.', 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  if (route.query.slug) {
    try {
      const response = await $api.get(`/bulletin-templates/${route.query.slug}`)
      form.value = {
        nom: response.data.nom,
        type_periode: response.data.type_periode || '',
        layout_json: response.data.layout_json || [],
        is_default: response.data.is_default
      }
    } catch (error) {
      console.error('Erreur lors du chargement', error)
    }
  }
})
</script>
