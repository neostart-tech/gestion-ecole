<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">

    <!-- Loading -->
    <div v-if="pending" class="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div class="w-10 h-10 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 rounded-full animate-spin"></div>
      <p class="text-xs text-slate-500 dark:text-slate-400">Chargement de votre espace de rédaction…</p>
    </div>

    <template v-else-if="data">

      <!-- Top Bar -->
      <header class="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <NuxtLink to="/enseignant/syllabuses" class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-wider">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Mes enseignements
        </NuxtLink>

        <span class="hidden sm:inline text-xs font-bold text-slate-600 dark:text-slate-300">Édition du syllabus</span>

        <div class="flex items-center gap-3">
          <NuxtLink :to="`/enseignant/syllabuses/view/${data.uv.slug || data.uv.id}`" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition duration-200" title="Voir le rendu final">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Aperçu
          </NuxtLink>

          <div class="hidden md:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span class="w-2 h-2 rounded-full" :class="isSaving ? 'bg-amber-500 animate-pulse' : lastSaved ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'"></span>
            {{ isSaving ? 'Synchronisation…' : lastSaved ? `Sauvegardé à ${lastSaved}` : 'Non enregistré' }}
          </div>

          <button class="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2" :disabled="isSaving" @click="saveSyllabus">
            <template v-if="isSaving">
              <div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Publication...</span>
            </template>
            <template v-else>
              <span>Publier les modifications</span>
            </template>
          </button>
        </div>
      </header>

      <!-- Course Hero -->
      <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 py-8">
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              <span class="text-purple-600 dark:text-purple-400 font-bold">{{ data.uv.unite_enseignement?.nom || 'Unité d\'Enseignement' }}</span>
              <span>·</span>
              <span>{{ data.uv.periode?.nom || 'Semestre' }}</span>
              <span>·</span>
              <span>{{ new Date().getFullYear() }}</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-1">
              {{ data.uv.nom }}
            </h1>
            <div class="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {{ data.uv.code }}
            </div>
          </div>

          <div class="self-start md:self-auto bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-right flex flex-col items-end min-w-[160px]">
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white">
              {{ filledCount }}<span class="text-lg text-slate-400 font-medium">/ {{ sections.length }}</span>
            </div>
            <div class="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mt-0.5 mb-2">sections renseignées</div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div class="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-500" :style="{ width: completionRate + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Persistent Navigation Tabs (Sticky) -->
      <nav class="sticky top-14 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 shadow-sm">
        <div class="max-w-5xl mx-auto flex overflow-x-auto no-scrollbar space-x-6">
          <a
            v-for="section in sections"
            :key="section.key"
            :href="`#${section.key}`"
            class="py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors duration-150"
            :class="activeTab === section.key ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            @click.prevent="scrollTo(section.key)"
          >
            {{ section.label }}
          </a>
        </div>
      </nav>

      <!-- Content Area -->
      <main class="max-w-5xl mx-auto px-6 md:px-10 py-10 space-y-12">
        <div
          v-for="(section, i) in sections"
          :key="section.key"
          :id="section.key"
          class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-32"
        >
          <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/50">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ section.label }}</h2>
              <p class="text-xs text-slate-400 dark:text-slate-400">{{ section.hint }}</p>
            </div>
          </div>

          <!-- Custom Quill Editor Component -->
          <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CustomQuillEditor v-model="form[section.key]" @update:modelValue="autoSave" />
          </div>

          <!-- Integrated File Explorer in Ressources Section -->
          <div v-if="section.key === 'ressources'" class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div class="mb-4">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Gestionnaire de fichiers & supports</h3>
              <p class="text-xs text-slate-400 dark:text-slate-400">Gérez l'arborescence des documents partagés pour ce cours</p>
            </div>

            <div class="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div class="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs">
                <div class="flex items-center space-x-1 text-slate-600 dark:text-slate-300 font-semibold">
                  <span class="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400" @click="resetPath">Racine</span>
                  <template v-for="(crumb, i) in breadcrumbs" :key="i">
                    <span class="text-slate-400">/</span>
                    <span class="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400" @click="navigateToLevel(i)">{{ crumb.name }}</span>
                  </template>
                </div>

                <div class="flex items-center space-x-2">
                  <button class="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-slate-700" title="Nouveau dossier" @click="promptNewFolder">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                  </button>
                  <label class="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-slate-700 cursor-pointer" title="Uploader des fichiers">
                    <input type="file" class="hidden" multiple @change="handleFileUpload" />
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </label>
                </div>
              </div>

              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div v-if="currentFiles.length === 0" class="col-span-full py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  Ce dossier est vide.
                </div>
                <div
                  v-for="(item, index) in currentFiles"
                  :key="index"
                  class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition cursor-pointer"
                  @click="handleFileClick(item, index)"
                >
                  <div class="flex items-center space-x-3 min-w-0">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 flex-shrink-0">
                      <svg v-if="item.type === 'folder'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                      <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                    </div>
                    <div class="truncate">
                      <div class="text-xs font-semibold text-slate-900 dark:text-white truncate">{{ item.name }}</div>
                      <div class="text-[10px] text-slate-400">{{ item.type === 'folder' ? `${item.children?.length || 0} éléments` : formatSize(item.size) }}</div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-1" @click.stop>
                    <button class="p-1 text-slate-400 hover:text-red-500 transition" title="Supprimer" @click="confirmDelete(index)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </template>

    <!-- Headless UI Modal for Folder Creation -->
    <TransitionRoot appear :show="isFolderModalOpen" as="template">
      <Dialog as="div" @close="closeFolderModal" class="relative z-[110]">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                <DialogTitle as="h3" class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  Nouveau dossier
                </DialogTitle>
                
                <div class="mt-4">
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Entrez le nom du dossier à créer dans "{{ breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length-1].name : 'Racine' }}".
                  </p>
                  <input
                    ref="folderInputRef"
                    v-model="newFolderName"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs text-slate-900 dark:text-white"
                    placeholder="Ex: Supports de cours, Travaux dirigés..."
                    @keyup.enter="confirmNewFolder"
                  />
                </div>

                <div class="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    @click="closeFolderModal"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="px-5 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
                    :disabled="!newFolderName.trim() || isSaving"
                    @click="confirmNewFolder"
                  >
                    {{ isSaving ? 'Création...' : 'Créer le dossier' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { useSyllabusStore } from '~~/stores/syllabus'
import CustomQuillEditor from '~/components/CustomQuillEditor.vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const route = useRoute()
const router = useRouter()
const { $swal } = useNuxtApp()
const syllabusStore = useSyllabusStore()

const isSaving = ref(false)
const lastSaved = ref(null)
const activeTab = ref('description')
const currentPath = ref([])

// Helper to extract clean error message
const getErrorMessage = (error) => {
  if (error.message === 'Network Error') {
    return "Erreur réseau : Le fichier est probablement trop volumineux pour le serveur ou votre connexion a été interrompue.";
  }
  if (error.response) {
    if (error.response.status === 413) {
      return "Le fichier est trop volumineux (Limite serveur dépassée). Veuillez réduire sa taille ou contacter l'administration.";
    }
    if (error.response.data?.errors) {
      return Object.values(error.response.data.errors).flat().join('\n');
    }
    return error.response.data?.message || error.response.data?.error || `Erreur serveur (${error.response.status})`;
  }
  return error.message || "Une erreur inconnue est survenue.";
}

// Folder Modal state
const isFolderModalOpen = ref(false)
const newFolderName = ref('')
const folderInputRef = ref(null)

const data = computed(() => syllabusStore.currentSyllabus)
const pending = computed(() => syllabusStore.isLoading)

const sections = [
  { key: 'description', label: 'Description', hint: 'Introduction et cadre de la matière' },
  { key: 'objectifs', label: 'Objectifs', hint: 'Savoirs visés en fin de cours' },
  { key: 'competences', label: 'Compétences', hint: 'Aptitudes pratiques acquises' },
  { key: 'plan_cours', label: 'Plan de cours', hint: 'Séquençage des chapitres et séances' },
  { key: 'evaluation', label: 'Évaluation', hint: 'Modalités de contrôle et coefficients' },
  { key: 'ressources', label: 'Ressources & Supports', hint: 'Bibliographie et documents partagés' },
]

const form = ref(Object.fromEntries(sections.map(s => [s.key, ''])))

const filledCount = computed(() =>
  sections.filter(s => form.value[s.key] && form.value[s.key].length > 10).length
)

const completionRate = computed(() =>
  Math.round((filledCount.value / sections.length) * 100)
)

onMounted(async () => {
  await syllabusStore.fetchSyllabusDetail(route.params.slug)

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) activeTab.value = e.target.id
    })
  }, { threshold: 0.4, rootMargin: '-140px 0px -50% 0px' })

  sections.forEach(s => {
    const el = document.getElementById(s.key)
    if (el) observer.observe(el)
  })
})

watch(data, (val) => {
  if (val?.syllabus) {
    sections.forEach(s => {
      form.value[s.key] = val.syllabus[s.key] || ''
    })
  }
}, { immediate: true })

const scrollTo = (key) => {
  activeTab.value = key
  document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// File explorer helpers
const currentFiles = computed(() => {
  if (!data.value?.syllabus?.files) return []
  let items = data.value.syllabus.files
  for (const index of currentPath.value) {
    if (items[index]?.type === 'folder') items = items[index].children
  }
  return items
})

const breadcrumbs = computed(() => {
  if (!data.value?.syllabus?.files) return []
  let items = data.value.syllabus.files
  const crumbs = []
  for (const index of currentPath.value) {
    if (items[index]?.type === 'folder') {
      crumbs.push({ name: items[index].name })
      items = items[index].children
    }
  }
  return crumbs
})

const navigateInto = (i) => currentPath.value.push(i)
const resetPath = () => { currentPath.value = [] }
const navigateToLevel = (i) => { currentPath.value = currentPath.value.slice(0, i + 1) }

const handleFileClick = (item, index) => {
  if (item.type === 'folder') {
    navigateInto(index)
  } else {
    window.open(item.url, '_blank')
  }
}

// Auto-save logic
let saveTimeout = null
const autoSave = () => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveSyllabus(true)
  }, 2000)
}

const saveSyllabus = async (isAuto = false) => {
  if (isSaving.value) return
  isSaving.value = true

  try {
    const payload = {
      ...form.value,
      files: data.value?.syllabus?.files || []
    }

    await syllabusStore.saveSyllabus(route.params.slug, payload)
    
    const now = new Date()
    lastSaved.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    if (!isAuto) {
      $swal.fire({
        title: 'Syllabus publié !',
        text: 'Les modifications ont bien été enregistrées.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error("Save error:", error)
    if (!isAuto) {
      $swal.fire({
        title: 'Erreur d\'enregistrement',
        text: getErrorMessage(error),
        icon: 'error'
      })
    }
  } finally {
    isSaving.value = false
  }
}

// Folder Modal actions
const promptNewFolder = () => {
  newFolderName.value = ''
  isFolderModalOpen.value = true
  setTimeout(() => folderInputRef.value?.focus(), 100)
}

const closeFolderModal = () => {
  isFolderModalOpen.value = false
  newFolderName.value = ''
}

const confirmNewFolder = async () => {
  if (!newFolderName.value.trim()) return

  const folderName = newFolderName.value.trim()
  const newFolder = {
    name: folderName,
    type: 'folder',
    children: []
  }

  if (!data.value.syllabus) data.value.syllabus = {}
  if (!data.value.syllabus.files) data.value.syllabus.files = []

  let current = data.value.syllabus.files
  for (const index of currentPath.value) {
    current = current[index].children
  }
  current.push(newFolder)

  await saveSyllabus(true)
  closeFolderModal()
}

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  isSaving.value = true
  try {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)

      const result = await syllabusStore.uploadAttachment(route.params.slug, formData)
      const newFile = {
        name: result.name,
        type: 'file',
        size: result.size,
        url: result.url,
        path: result.path
      }

      if (!data.value.syllabus) data.value.syllabus = {}
      if (!data.value.syllabus.files) data.value.syllabus.files = []

      let current = data.value.syllabus.files
      for (const index of currentPath.value) {
        current = current[index].children
      }
      current.push(newFile)
    }

    await saveSyllabus(true)

    $swal.fire({
      title: 'Fichiers ajoutés',
      text: `${files.length} fichier(s) mis en ligne.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error("Upload error:", error)
    $swal.fire('Erreur', getErrorMessage(error), 'error')
  } finally {
    event.target.value = ''
    isSaving.value = false
  }
}

const confirmDelete = async (index) => {
  const item = currentFiles.value[index]
  const result = await $swal.fire({
    title: 'Supprimer ?',
    text: `Voulez-vous vraiment supprimer "${item.name}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  })

  if (result.isConfirmed) {
    let current = data.value.syllabus.files
    for (const pIdx of currentPath.value) {
      current = current[pIdx].children
    }
    current.splice(index, 1)
    await saveSyllabus(true)
  }
}

const formatSize = (bytes) => {
  if (!bytes) return '—'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

definePageMeta({ layout: 'default' })
</script>