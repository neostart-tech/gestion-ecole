<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">

    <!-- Loading -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <div class="w-10 h-10 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 rounded-full animate-spin"></div>
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

        <span class="hidden sm:inline text-xs font-bold text-slate-600 dark:text-slate-300">Visualisation du syllabus</span>

        <div class="flex items-center gap-3">
          <button class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition duration-200 disabled:opacity-50" :disabled="isPrinting" @click="printSyllabus">
            <template v-if="isPrinting">
              <div class="w-3.5 h-3.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Génération...</span>
            </template>
            <template v-else>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              <span>Exporter PDF</span>
            </template>
          </button>

          <NuxtLink :to="`/enseignant/syllabuses/${data.uv.slug || data.uv.id}`" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <span>Modifier</span>
          </NuxtLink>
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
              <span>{{ academicYear }}</span>
              <template v-if="data.uv.credits">
                <span>·</span>
                <span>{{ data.uv.credits }} crédits</span>
              </template>
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
              {{ filledSections }}<span class="text-lg text-slate-400 font-medium">/ {{ totalSections }}</span>
            </div>
            <div class="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mt-0.5 mb-2">sections renseignées</div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div class="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-500" :style="{ width: (filledSections / totalSections * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Persistent Navigation Tabs -->
      <nav class="sticky top-14 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 shadow-sm">
        <div class="max-w-5xl mx-auto flex overflow-x-auto no-scrollbar space-x-6">
          <a href="#description" class="py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors duration-150" :class="activeSection === 'description' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'" @click.prevent="scrollTo('description')">Description</a>
          <a href="#objectifs" class="py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors duration-150" :class="activeSection === 'objectifs' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'" @click.prevent="scrollTo('objectifs')">Objectifs</a>
          <a href="#competences" class="py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors duration-150" :class="activeSection === 'competences' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'" @click.prevent="scrollTo('competences')">Compétences</a>
          <a href="#plan" class="py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors duration-150" :class="activeSection === 'plan' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'" @click.prevent="scrollTo('plan')">Plan de cours</a>
          <a href="#evaluation" class="py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors duration-150" :class="activeSection === 'evaluation' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'" @click.prevent="scrollTo('evaluation')">Évaluation</a>
          <a href="#ressources" class="py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors duration-150" :class="activeSection === 'ressources' ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'" @click.prevent="scrollTo('ressources')">Ressources & Supports</a>
        </div>
      </nav>

      <!-- Content Area -->
      <main class="max-w-5xl mx-auto px-6 md:px-10 py-10 space-y-12" id="syllabus-print-zone">
        <div v-if="data.syllabus" class="space-y-12">
          <!-- Hidden PDF Component for export only -->
          <div style="display: none">
            <SyllabusPDF ref="pdfRef" :uv="data.uv" :content="data.syllabus" />
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-32" id="description">
            <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/50">01</span>
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Description du cours</h2>
                <p class="text-xs text-slate-400 dark:text-slate-400">Introduction et cadre de la matière</p>
              </div>
            </div>
            <div class="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300" v-html="data.syllabus.description || '<p class=\'text-slate-400 italic\'>Aucune description disponible.</p>'"></div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-32" id="objectifs">
            <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/50">02</span>
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Objectifs pédagogiques</h2>
                <p class="text-xs text-slate-400 dark:text-slate-400">Savoirs visés en fin de cours</p>
              </div>
            </div>
            <div class="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300" v-html="data.syllabus.objectifs || '<p class=\'text-slate-400 italic\'>Non renseignés.</p>'"></div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-32" id="competences">
            <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/50">03</span>
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Compétences visées</h2>
                <p class="text-xs text-slate-400 dark:text-slate-400">Aptitudes pratiques acquises</p>
              </div>
            </div>
            <div class="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300" v-html="data.syllabus.competences || '<p class=\'text-slate-400 italic\'>Non renseignées.</p>'"></div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-32" id="plan">
            <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/50">04</span>
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Plan de cours</h2>
                <p class="text-xs text-slate-400 dark:text-slate-400">Séquençage des chapitres et séances</p>
              </div>
            </div>
            <div class="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300" v-html="data.syllabus.plan_cours || '<p class=\'text-slate-400 italic\'>Plan non disponible.</p>'"></div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-32" id="evaluation">
            <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/50">05</span>
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Système d'évaluation</h2>
                <p class="text-xs text-slate-400 dark:text-slate-400">Modalités de contrôle et coefficients</p>
              </div>
            </div>
            <div class="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300" v-html="data.syllabus.evaluation || '<p class=\'text-slate-400 italic\'>Détails non disponibles.</p>'"></div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 scroll-mt-32" id="ressources">
            <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span class="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/50">06</span>
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Ressources & Supports</h2>
                <p class="text-xs text-slate-400 dark:text-slate-400">Bibliographie et documents partagés</p>
              </div>
            </div>
            
            <div class="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-8" v-html="data.syllabus.ressources || '<p class=\'text-slate-400 italic\'>Aucune ressource bibliographique indiquée.</p>'"></div>

            <!-- File explorer -->
            <div class="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div class="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs">
                <div class="flex items-center space-x-1 text-slate-600 dark:text-slate-300 font-semibold">
                  <span class="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400" @click="resetPath">Racine</span>
                  <template v-for="(crumb, i) in breadcrumbs" :key="i">
                    <span class="text-slate-400">/</span>
                    <span class="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400" @click="navigateToLevel(i)">{{ crumb.name }}</span>
                  </template>
                </div>

                <div v-if="isTeacher" class="flex items-center space-x-2">
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

                  <div v-if="isTeacher" class="flex items-center space-x-1" @click.stop>
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

        <!-- Empty state -->
        <div v-else class="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Syllabus non rédigé</h3>
          <p class="text-xs text-slate-400 dark:text-slate-400">Vous n'avez pas encore rédigé le syllabus pour cette matière.</p>
          <NuxtLink :to="`/enseignant/syllabuses/${data.uv.slug || data.uv.id}`" class="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-600/20">
            Commencer la rédaction →
          </NuxtLink>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { useSyllabusStore } from '~~/stores/syllabus'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import { useParametreStore } from '~~/stores/parametre'
import SyllabusPDF from '~/components/SyllabusPDF.vue'

const route = useRoute()
const syllabusStore = useSyllabusStore()
const anneeStore = useAnneScolaireStore()
const parametreStore = useParametreStore()
const user = useState('user')

const data = computed(() => syllabusStore.currentSyllabus)
const pending = computed(() => syllabusStore.isLoading)
const isTeacher = computed(() => user.value?.roles?.some(r => r.name === 'enseignant' || r.name === 'admin' || r.name === 'professeur'))

const activeSection = ref('description')
const currentPath = ref([])
const isSaving = ref(false)
const pdfRef = ref(null)
const isPrinting = ref(false)

const sectionKeys = ['description', 'objectifs', 'competences', 'plan_cours', 'evaluation', 'ressources']
const totalSections = sectionKeys.length

const academicYear = computed(() => anneeStore.activeAnnee?.nom || `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`)

const filledSections = computed(() => {
  if (!data.value?.syllabus) return 0
  return sectionKeys.filter(k => data.value.syllabus[k] && data.value.syllabus[k].length > 10).length
})

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

const resetPath = () => { currentPath.value = [] }
const navigateToLevel = (i) => { currentPath.value = currentPath.value.slice(0, i + 1) }

const handleFileClick = (item, index) => {
  if (item.type === 'folder') {
    currentPath.value.push(index)
  } else {
    window.open(item.url, '_blank')
  }
}

const scrollTo = (id) => {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  await syllabusStore.fetchSyllabusDetail(route.params.slug)
  if (!parametreStore.parametres || parametreStore.parametres.length === 0) {
    await parametreStore.fetchParametres()
  }

  const ids = ['description', 'objectifs', 'competences', 'plan', 'evaluation', 'ressources']
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) activeSection.value = e.target.id }),
    { threshold: 0.3 }
  )
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

const printSyllabus = async () => {
  if (isPrinting.value) return
  isPrinting.value = true
  
  try {
    const html2pdf = (await import('html2pdf.js')).default
    const element = document.getElementById('syllabus-pdf-template')
    if (element) {
      element.parentElement.style.display = 'block'
      const options = {
        margin: [20, 10, 20, 10],
        filename: `Syllabus_${data.value.uv.nom}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      await html2pdf().from(element).set(options).save()
    }
  } catch (error) {
    console.error("Erreur PDF:", error)
  } finally {
    const element = document.getElementById('syllabus-pdf-template')
    if (element) element.parentElement.style.display = 'none'
    isPrinting.value = false
  }
}

definePageMeta({ layout: 'default' })
</script>