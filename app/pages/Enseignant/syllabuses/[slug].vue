<template>
  <div class="syllabus-editor">

    <!-- Loading -->
    <div v-if="pending" class="loading-screen">
      <div class="loader-ring"></div>
      <p class="loading-label">Chargement de votre espace de rédaction…</p>
    </div>

    <template v-else-if="data">

      <!-- Top Bar -->
      <header class="topbar">
        <NuxtLink to="/enseignant/syllabuses" class="back-link">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Mes enseignements
        </NuxtLink>

        <span class="topbar-brand">Édition du syllabus</span>

        <div class="topbar-right">
          <NuxtLink :to="`/enseignant/syllabuses/view/${data.uv.slug}`" class="btn-preview-mode" title="Voir le rendu final">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Aperçu
          </NuxtLink>
          <div class="autosave" :class="{ saving: isSaving }">
            <span class="autosave-dot"></span>
            {{ isSaving ? 'Synchronisation…' : lastSaved ? `Sauvegardé à ${lastSaved}` : 'Non enregistré' }}
          </div>
          <button class="btn-publish" :disabled="isSaving" @click="saveSyllabus">
            <template v-if="isSaving">
              <div class="btn-spinner"></div>
              Publication...
            </template>
            <template v-else>
              Publier les modifications
            </template>
          </button>
        </div>
      </header>

      <!-- Course Hero -->
      <div class="course-hero">
        <div class="hero-inner">
          <div class="hero-left">
            <div class="hero-eyebrow">
              <span class="eyebrow-ue">{{ data.uv.unite_enseignement?.nom || 'Unité d\'Enseignement' }}</span>
              <span class="eyebrow-sep">·</span>
              <span class="eyebrow-period">{{ data.uv.periode?.nom || 'Semestre' }}</span>
              <span class="eyebrow-sep">·</span>
              <span class="eyebrow-year">{{ new Date().getFullYear() }}</span>
            </div>
            <h1 class="hero-title">{{ data.uv.nom }}</h1>
            <div class="hero-code">{{ data.uv.code }}</div>
          </div>
          <div class="hero-right">
            <div class="completeness-block">
              <div class="comp-num">{{ filledCount }}<span class="comp-denom">/ {{ sections.length }}</span></div>
              <div class="comp-label">sections renseignées</div>
              <div class="comp-bar"><div class="comp-fill" :style="{ width: completionRate + '%' }"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Persistent Navigation Tabs (Sticky) -->
      <nav class="persistent-tabs">
        <div class="tabs-inner">
          <a
            v-for="section in sections"
            :key="section.key"
            :href="`#${section.key}`"
            class="htab"
            :class="{ active: activeTab === section.key }"
            @click.prevent="scrollTo(section.key)"
          >
            {{ section.label }}
          </a>
        </div>
      </nav>

      <div class="progress-bar-full">
        <div class="progress-bar-fill" :style="{ width: completionRate + '%' }"></div>
      </div>

      <!-- Content Area -->
      <main class="editor-body">
        <div
          v-for="(section, i) in sections"
          :key="section.key"
          :id="section.key"
          class="section-wrap"
        >
          <div class="section-meta">
            <span class="section-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="section-info">
              <div class="section-name">{{ section.label }}</div>
              <div class="section-hint">{{ section.hint }}</div>
            </div>
          </div>

          <div class="editor-box">
            <EditorTinyMCE v-model="form[section.key]" @update:modelValue="autoSave" />
          </div>

          <!-- Integrated File Explorer in Ressources Section -->
          <div v-if="section.key === 'ressources'" class="mt-12">
            <div class="section-info mb-6">
              <div class="section-name">Gestionnaire de fichiers & supports</div>
              <div class="section-hint">Gérez l'arborescence des documents partagés pour ce cours</div>
            </div>

            <div class="explorer">
              <div class="explorer-toolbar">
                <div class="expl-breadcrumb">
                  <span class="crumb" @click="resetPath">Racine</span>
                  <template v-for="(crumb, i) in breadcrumbs" :key="i">
                    <span class="crumb-sep">/</span>
                    <span class="crumb" @click="navigateToLevel(i)">{{ crumb.name }}</span>
                  </template>
                </div>

                <div class="expl-actions">
                  <button class="expl-action-btn" title="Nouveau dossier" @click="promptNewFolder">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                  </button>
                  <label class="expl-action-btn" title="Uploader des fichiers">
                    <input type="file" class="hidden" multiple @change="handleFileUpload" />
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </label>
                </div>
              </div>

              <div class="explorer-grid">
                <div v-if="currentFiles.length === 0" class="explorer-empty">
                  Ce dossier est vide.
                </div>
                <div
                  v-for="(item, index) in currentFiles"
                  :key="index"
                  class="file-card"
                  :class="{ folder: item.type === 'folder' }"
                  @click="handleFileClick(item, index)"
                >
                  <div class="file-icon">
                    <svg v-if="item.type === 'folder'" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                    <svg v-else fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  </div>
                  <div class="file-info">
                    <div class="file-name">{{ item.name }}</div>
                    <div class="file-meta">{{ item.type === 'folder' ? `${item.children?.length || 0} éléments` : formatSize(item.size) }}</div>
                  </div>
                  <div class="file-actions" @click.stop>
                    <button class="btn-delete-file" title="Supprimer" @click="confirmDelete(index)">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                    <svg class="file-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
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
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  Nouveau dossier
                </DialogTitle>
                
                <div class="mt-4">
                  <p class="text-sm text-gray-500 mb-4">
                    Entrez le nom du dossier à créer dans "{{ breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length-1].name : 'Racine' }}".
                  </p>
                  <input
                    ref="folderInputRef"
                    v-model="newFolderName"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all text-sm"
                    placeholder="Ex: Supports de cours, Travaux dirigés..."
                    @keyup.enter="confirmNewFolder"
                  />
                </div>

                <div class="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    @click="closeFolderModal"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="px-6 py-2 bg-violet-600 text-white text-sm font-bold rounded-lg hover:bg-violet-700 shadow-md shadow-violet-200 transition-all disabled:opacity-50"
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
import EditorTinyMCE from '~/components/EditorTinyMCE.vue'
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
      // Cas de validation Laravel
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
  const el = document.getElementById(key)
  if (el) {
    const offset = 140
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = el.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// File explorer logic
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

const formatSize = (bytes) => {
  if (!bytes) return '—'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const saveFileStructure = async () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const files = data.value?.syllabus?.files || []
    const payload = {
      ...form.value,
      files: files
    }
    const response = await syllabusStore.saveSyllabus(route.params.slug, payload)
    if (data.value && !data.value.syllabus) {
      data.value.syllabus = response.syllabus
    }
    lastSaved.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } catch (error) {
    console.error("Error saving:", error)
  } finally {
    isSaving.value = false
  }
}

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
  const newFolder = {
    name: newFolderName.value.trim(),
    type: 'folder',
    children: []
  }
  if (!data.value.syllabus) data.value.syllabus = { files: [] }
  if (!data.value.syllabus.files) data.value.syllabus.files = []
  
  let current = data.value.syllabus.files
  for (const index of currentPath.value) {
    current = current[index].children
  }
  current.push(newFolder)
  await saveFileStructure()
  closeFolderModal()
}

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  // Validation côté client (Ex: limite à 12 Mo pour éviter l'erreur réseau brutale)
  const MAX_SIZE = 12 * 1024 * 1024; 
  for (const file of files) {
    if (file.size > MAX_SIZE) {
      $swal.fire({
        title: 'Fichier trop volumineux',
        text: `Le fichier "${file.name}" dépasse la limite autorisée de 12 Mo.`,
        icon: 'warning'
      });
      event.target.value = '';
      return;
    }
  }

  if (!data.value.syllabus) data.value.syllabus = { files: [] }
  if (!data.value.syllabus.files) data.value.syllabus.files = []

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
      let current = data.value.syllabus.files
      for (const index of currentPath.value) {
        current = current[index].children
      }
      current.push(newFile)
    }
    await saveFileStructure()
    $swal.fire({ title: 'Succès', text: 'Fichiers ajoutés.', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (error) {
    console.error("Upload error:", error)
    const msg = getErrorMessage(error)
    $swal.fire('Erreur d\'upload', msg, 'error')
  } finally {
    event.target.value = ''
    isSaving.value = false
  }
}

const confirmDelete = async (index) => {
  if (!data.value?.syllabus?.files) return
  const item = currentFiles.value[index]
  const result = await $swal.fire({
    title: 'Supprimer ?',
    text: `Voulez-vous vraiment supprimer "${item.name}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
  })
  if (result.isConfirmed) {
    let current = data.value.syllabus.files
    for (const pIdx of currentPath.value) {
      current = current[pIdx].children
    }
    current.splice(index, 1)
    await saveFileStructure()
  }
}

const saveSyllabus = async () => {
  isSaving.value = true
  try {
    const payload = {
      ...form.value,
      files: data.value?.syllabus?.files || []
    }
    await syllabusStore.saveSyllabus(route.params.slug, payload)
    lastSaved.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    await $swal.fire({ title: 'Syllabus publié', text: 'Synchronisation réussie.', icon: 'success', timer: 2000, showConfirmButton: false })
    router.push(`/enseignant/syllabuses/view/${route.params.slug}`)
  } catch (error) {
    console.error("Save error:", error)
    const msg = getErrorMessage(error)
    $swal.fire({ title: 'Erreur', text: msg, icon: 'error' })
  } finally {
    isSaving.value = false
  }
}

const autoSaveTimer = ref(null)
const autoSave = () => {
  if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value)
  autoSaveTimer.value = setTimeout(() => {
    saveFileStructure()
  }, 3000)
}

definePageMeta({ layout: 'default' })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500;700&display=swap');

.syllabus-editor {
  min-height: 100vh;
  background: #fafaf9;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
}

/* ─── Loading ──────────────────────────────────────── */
.loading-screen {
  height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; background: #fff;
}
.loader-ring {
  width: 36px; height: 36px; border: 2px solid #ede9fe; border-top-color: #7c3aed; border-radius: 50%; animation: spin 0.9s linear infinite;
}
.loading-label { font-size: 13px; color: #9ca3af; }

/* ─── Top Bar ──────────────────────────────────────── */
.topbar {
  position: sticky; top: 0; z-index: 110; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 54px; background: #fff; border-bottom: 0.5px solid #e5e7eb;
}
.back-link {
  display: flex; align-items: center; gap: 7px; font-size: 11px; color: #9ca3af; text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase;
}
.topbar-brand { font-size: 13px; color: #6b7280; }
.topbar-right { display: flex; align-items: center; gap: 20px; }

.btn-preview-mode {
  display: flex; align-items: center; gap: 8px; padding: 0 14px; height: 30px; background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s;
}
.btn-preview-mode:hover { background: #f1f5f9; color: #7c3aed; border-color: #ddd6fe; }

.autosave {
  display: flex; align-items: center; gap: 7px; font-size: 11px; color: #9ca3af;
}
.autosave-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #10b981; transition: background 0.3s;
}
.autosave.saving .autosave-dot { background: #f59e0b; animation: pulse 1s infinite; }

.btn-publish {
  height: 32px; padding: 0 16px; background: #4c1d95; color: #fff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s;
}
.btn-publish:hover:not(:disabled) { background: #3b0764; transform: translateY(-1px); }
.btn-publish:disabled { opacity: 0.6; cursor: not-allowed; }

/* ─── Hero ─────────────────────────────────────────── */
.course-hero { background: #fff; padding: 48px 40px 32px; border-bottom: 0.5px solid #e5e7eb; }
.hero-inner { max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; gap: 40px; }
.hero-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #7c3aed; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; }
.eyebrow-sep { color: #ddd6fe; }
.hero-title { font-family: 'Lora', serif; font-size: 36px; color: #111827; margin-bottom: 8px; line-height: 1.2; }
.hero-code { font-size: 13px; color: #9ca3af; letter-spacing: 0.05em; }

.completeness-block { text-align: right; }
.comp-num { font-size: 32px; font-weight: 300; color: #111827; }
.comp-denom { font-size: 18px; color: #9ca3af; }
.comp-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; margin-bottom: 8px; }
.comp-bar { width: 120px; height: 4px; background: #f3f4f6; border-radius: 2px; overflow: hidden; }
.comp-fill { height: 100%; background: #7c3aed; transition: width 0.6s ease; }

/* ─── Persistent Navigation ────────────────────────── */
.persistent-tabs {
  position: sticky; top: 54px; z-index: 100; background: #fff; border-bottom: 0.5px solid #e5e7eb; padding: 0 40px;
}
.tabs-inner { display: flex; gap: 32px; max-width: 900px; margin: 0 auto; overflow-x: auto; scrollbar-width: none; }
.htab { padding: 16px 0; font-size: 12px; color: #9ca3af; text-decoration: none; border-bottom: 2px solid transparent; cursor: pointer; white-space: nowrap; }
.htab.active { color: #7c3aed; border-bottom-color: #7c3aed; font-weight: 700; }

.progress-bar-full { height: 2px; background: transparent; }
.progress-bar-fill { height: 100%; background: #7c3aed; transition: width 0.4s; }

/* ─── Content ──────────────────────────────────────── */
.editor-body { max-width: 900px; margin: 0 auto; padding: 40px; }
.section-wrap { padding: 50px 0; border-bottom: 1px solid #f1f5f9; scroll-margin-top: 140px; }
.section-wrap:last-child { border-bottom: none; }

.section-meta { display: flex; align-items: baseline; gap: 16px; margin-bottom: 24px; }
.section-index { font-size: 10px; font-weight: 700; color: #ddd6fe; text-transform: uppercase; }
.section-name { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
.section-hint { font-size: 12px; color: #94a3b8; }

.editor-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; transition: border-color 0.2s; }
.editor-box:focus-within { border-color: #7c3aed; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.06); }

/* ─── Explorer ─────────────────────────────────────── */
.explorer { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
.explorer-toolbar { padding: 12px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.expl-breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #64748b; }
.crumb { cursor: pointer; transition: color 0.2s; }
.crumb:hover { color: #7c3aed; }
.expl-actions { display: flex; gap: 8px; }
.expl-action-btn {
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #64748b; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
}
.expl-action-btn:hover { background: #fff; color: #7c3aed; border-color: #ddd6fe; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

.explorer-grid { padding: 20px; display: grid; grid-template-cols: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; background: #fdfdfd; }
.explorer-empty { grid-column: 1/-1; padding: 40px; text-align: center; color: #94a3b8; font-size: 13px; font-style: italic; }

.file-card {
  display: flex; align-items: center; gap: 12px; padding: 12px; background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; cursor: pointer; transition: all 0.2s; position: relative;
}
.file-card:hover { border-color: #ddd6fe; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(124,58,237,0.05); }
.file-icon { width: 32px; height: 32px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.folder .file-icon { color: #fbbf24; }
.file-icon { color: #8b5cf6; }

.file-name { font-size: 12px; font-weight: 500; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
.file-meta { font-size: 10px; color: #94a3b8; }

.btn-delete-file {
  position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; background: #fff; border: 1px solid #fee2e2; color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.file-card:hover .btn-delete-file { opacity: 1; }
.btn-delete-file:hover { background: #ef4444; color: #fff; }

.file-arrow { width: 14px; height: 14px; color: #cbd5e1; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

@media (max-width: 768px) {
  .topbar { padding: 0 20px; }
  .hero-inner { flex-direction: column; align-items: flex-start; gap: 24px; }
  .content-area { padding: 20px; }
}
</style>