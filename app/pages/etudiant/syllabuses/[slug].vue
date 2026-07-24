<template>
  <div class="syllabus-detail">

    <!-- Loading Skeleton (Synchronisé avec le style Emploi du Temps) -->
    <div v-if="pending" class="loading-screen p-8 md:p-12">
      <div class="max-w-4xl mx-auto space-y-12 animate-pulse">
        <!-- Hero Skeleton -->
        <div class="space-y-4">
          <div class="flex gap-2">
            <div class="h-4 bg-gray-200 rounded w-20"></div>
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div class="h-12 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-100 rounded w-32"></div>
        </div>
        
        <!-- Tabs Skeleton -->
        <div class="flex gap-8 border-b border-gray-100 pb-4">
          <div v-for="i in 5" :key="i" class="h-4 bg-gray-100 rounded w-24"></div>
        </div>

        <!-- Content Sections Skeleton -->
        <div class="space-y-12">
          <div v-for="i in 3" :key="i" class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="h-8 bg-gray-100 rounded-lg w-12"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-48"></div>
                <div class="h-3 bg-gray-100 rounded w-32"></div>
              </div>
            </div>
            <div class="space-y-2 pl-16">
              <div class="h-4 bg-gray-50 rounded w-full"></div>
              <div class="h-4 bg-gray-50 rounded w-11/12"></div>
              <div class="h-4 bg-gray-50 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="data">

      <!-- Top Bar -->
      <header class="topbar">
        <NuxtLink to="/etudiant/syllabuses" class="back-link">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Mon programme
        </NuxtLink>

        <span class="topbar-brand">Programme Académique</span>

        <div class="topbar-right">
          <button class="btn-pdf" :disabled="isPrinting" @click="printSyllabus">
            <template v-if="isPrinting">
              <div class="btn-spinner"></div>
              Génération...
            </template>
            <template v-else>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Télécharger PDF
            </template>
          </button>
        </div>
      </header>

      <!-- Course Hero -->
      <div class="course-hero">
        <div class="hero-inner">
          <div class="hero-left">
            <div class="hero-eyebrow">
              <span class="eyebrow-period">{{ data.uv.periode?.nom || 'Semestre' }}</span>
              <span class="eyebrow-sep">·</span>
              <span class="eyebrow-year">{{ academicYear }}</span>
              <span v-if="data.uv.credits" class="eyebrow-sep">·</span>
              <span v-if="data.uv.credits" class="eyebrow-credits">{{ data.uv.credits }} crédits</span>
            </div>
            <h1 class="hero-title">{{ data.uv.nom }}</h1>
            <div class="hero-code">{{ data.uv.code || 'Code UV' }}</div>
          </div>
        </div>
      </div>

      <!-- Persistent Navigation Tabs -->
      <nav class="persistent-tabs">
        <div class="tabs-inner">
          <a href="#description" class="htab" :class="{ active: activeSection === 'description' }" @click.prevent="scrollTo('description')">Description</a>
          <a href="#objectifs" class="htab" :class="{ active: activeSection === 'objectifs' }" @click.prevent="scrollTo('objectifs')">Objectifs</a>
          <a href="#competences" class="htab" :class="{ active: activeSection === 'competences' }" @click.prevent="scrollTo('competences')">Compétences</a>
          <a href="#plan" class="htab" :class="{ active: activeSection === 'plan' }" @click.prevent="scrollTo('plan')">Plan de cours</a>
          <a href="#evaluation" class="htab" :class="{ active: activeSection === 'evaluation' }" @click.prevent="scrollTo('evaluation')">Évaluation</a>
          <a href="#ressources" class="htab" :class="{ active: activeSection === 'ressources' }" @click.prevent="scrollTo('ressources')">Ressources & Supports</a>
        </div>
      </nav>

      <!-- Content -->
      <main class="content-area" id="syllabus-print-zone">

        <div v-if="data.syllabus">
          <!-- Hidden PDF Component for export only -->
          <div style="display: none">
            <SyllabusPDF ref="pdfRef" :uv="data.uv" :content="data.syllabus" />
          </div>
          
          <div class="section-wrap" id="description">
            <div class="section-meta">
              <span class="section-index">01</span>
              <div class="section-info">
                <div class="section-name">Description du cours</div>
                <div class="section-hint">Introduction et cadre de la matière</div>
              </div>
            </div>
            <div class="rich-content" v-html="data.syllabus.description || '<p class=\'empty-field\'>Aucune description disponible.</p>'"></div>
          </div>

          <div class="section-wrap" id="objectifs">
            <div class="section-meta">
              <span class="section-index">02</span>
              <div class="section-info">
                <div class="section-name">Objectifs pédagogiques</div>
                <div class="section-hint">Savoirs visés en fin de cours</div>
              </div>
            </div>
            <div class="rich-content" v-html="data.syllabus.objectifs || '<p class=\'empty-field\'>Non renseignés.</p>'"></div>
          </div>

          <div class="section-wrap" id="competences">
            <div class="section-meta">
              <span class="section-index">03</span>
              <div class="section-info">
                <div class="section-name">Compétences visées</div>
                <div class="section-hint">Aptitudes pratiques acquises</div>
              </div>
            </div>
            <div class="rich-content" v-html="data.syllabus.competences || '<p class=\'empty-field\'>Non renseignées.</p>'"></div>
          </div>

          <div class="section-wrap" id="plan">
            <div class="section-meta">
              <span class="section-index">04</span>
              <div class="section-info">
                <div class="section-name">Plan de cours</div>
                <div class="section-hint">Séquençage des chapitres et séances</div>
              </div>
            </div>
            <div class="plan-content rich-content" v-html="data.syllabus.plan_cours || '<p class=\'empty-field\'>Plan non disponible.</p>'"></div>
          </div>

          <div class="section-wrap" id="evaluation">
            <div class="section-meta">
              <span class="section-index">05</span>
              <div class="section-info">
                <div class="section-name">Système d'évaluation</div>
                <div class="section-hint">Modalités de contrôle et coefficients</div>
              </div>
            </div>
            <div class="rich-content" v-html="data.syllabus.evaluation || '<p class=\'empty-field\'>Détails non disponibles.</p>'"></div>
          </div>

          <div class="section-wrap" id="ressources">
            <div class="section-meta">
              <span class="section-index">06</span>
              <div class="section-info">
                <div class="section-name">Ressources & Supports</div>
                <div class="section-hint">Bibliographie et documents partagés</div>
              </div>
            </div>
            
            <div class="rich-content mb-8" v-html="data.syllabus.ressources || '<p class=\'empty-field\'>Aucune ressource bibliographique indiquée.</p>'"></div>

            <!-- File explorer integrated in Resources -->
            <div v-if="data.syllabus?.files?.length" class="explorer">
              <div class="explorer-toolbar">
                <div class="expl-breadcrumb">
                  <span class="crumb" @click="resetPath">Racine</span>
                  <template v-for="(crumb, i) in breadcrumbs" :key="i">
                    <span class="crumb-sep">/</span>
                    <span class="crumb" @click="navigateToLevel(i)">{{ crumb.name }}</span>
                  </template>
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
                  <svg class="file-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Empty state -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="empty-title">Syllabus non disponible</h3>
          <p class="empty-sub">L'enseignant n'a pas encore publié le contenu pédagogique de cette matière.</p>
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

const data = computed(() => syllabusStore.currentSyllabus)
const pending = computed(() => syllabusStore.isLoading)

const activeSection = ref('description')
const currentPath = ref([])
const pdfRef = ref(null)
const isPrinting = ref(false)

const academicYear = computed(() => anneeStore.activeAnnee?.nom || `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`)

// File explorer
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
const navigateBack = () => currentPath.value.pop()
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

// Scroll & active tab
const scrollTo = (id) => {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Charger les détails du syllabus immédiatement pour éviter les délais sur accès direct
const loadSyllabus = async () => {
  if (route.params.slug) {
    await syllabusStore.fetchSyllabusDetail(route.params.slug)
  }
}

// Appel immédiat (setup)
loadSyllabus()

// Réagir aux changements de slug (navigation entre deux matières)
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) loadSyllabus()
})

onMounted(async () => {
  // Charger les paramètres de l'école pour le logo et le nom
  if (!parametreStore.parametres || parametreStore.parametres.length === 0) {
    parametreStore.fetchParametres()
  }

  const ids = ['description', 'objectifs', 'competences', 'plan', 'evaluation', 'ressources', 'attachments']
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
    
    element.parentElement.style.display = 'block'
    
    const options = {
      margin: [20, 10, 20, 10],
      filename: `Syllabus_${data.value.uv.nom}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    const worker = html2pdf().from(element).set(options).toPdf().get('pdf').then(function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        
        pdf.setDrawColor(230);
        pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
        
        const school = parametreStore.getAppName || 'IAI-Cameroun';
        pdf.text(school.toUpperCase(), 10, pageHeight - 10);
        
        const pageText = `Page ${i} sur ${totalPages}`;
        pdf.text(pageText, pageWidth - 10, pageHeight - 10, { align: 'right' });
      }
    }).save();

    await worker
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

/* ─── Base ─────────────────────────────────────────── */
.syllabus-detail {
  min-height: 100vh;
  background: #fafaf9;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
}

/* ─── Loading ──────────────────────────────────────── */
.loading-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-ring {
  width: 32px; height: 32px;
  border: 2px solid #ede9fe;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

/* ─── Top Bar ──────────────────────────────────────── */
.topbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 54px;
  background: #fff;
  border-bottom: 0.5px solid #e5e7eb;
}

.back-link {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; color: #9ca3af;
  text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase;
  transition: color 0.15s;
}
.back-link:hover { color: #1a1a1a; }

.topbar-brand { font-size: 13px; color: #6b7280; }

.topbar-right { display: flex; align-items: center; gap: 10px; }

.btn-pdf {
  display: flex; align-items: center; gap: 7px;
  height: 30px; padding: 0 14px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
  border-radius: 5px; cursor: pointer;
  background: #fff; color: #6b7280;
  border: 0.5px solid #e5e7eb;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, color 0.15s;
}
.btn-pdf:hover { background: #f9fafb; color: #1a1a1a; border-color: #d1d5db; }
.btn-pdf:disabled { cursor: not-allowed; opacity: 0.7; }

.btn-spinner {
  width: 12px; height: 12px;
  border: 1.5px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ─── Course Hero ──────────────────────────────────── */
.course-hero {
  background: #fff;
  padding: 40px 40px 30px;
}

.hero-inner {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 32px;
}

.hero-eyebrow {
  display: flex; align-items: center; gap: 8px;
  font-size: 11px; color: #9ca3af;
  letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 12px;
}
.eyebrow-period { color: #7c3aed; font-weight: 500; }
.eyebrow-sep { color: #d1d5db; }

.hero-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 34px; font-weight: 500;
  color: #111827; line-height: 1.15;
  letter-spacing: -0.02em; margin-bottom: 8px;
}

.hero-code {
  font-size: 11px; color: #9ca3af;
  letter-spacing: 0.1em; text-transform: uppercase;
}

/* ─── Persistent Tabs ──────────────────────────────── */
.persistent-tabs {
  position: sticky;
  top: 54px;
  background: #fff;
  z-index: 90;
  border-bottom: 0.5px solid #e5e7eb;
  padding: 0 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}
.tabs-inner {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs-inner::-webkit-scrollbar { display: none; }

.htab {
  padding: 13px 0; margin-right: 28px;
  font-size: 12px; color: #9ca3af;
  text-decoration: none; white-space: nowrap;
  border-bottom: 2px solid transparent;
  letter-spacing: 0.02em;
  transition: color 0.15s, border-color 0.15s;
  cursor: pointer;
}
.htab:hover { color: #4b5563; }
.htab.active { color: #7c3aed; border-bottom-color: #7c3aed; font-weight: 600; }

/* ─── Content ──────────────────────────────────────── */
.content-area {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 40px 80px;
}

/* ─── Section ──────────────────────────────────────── */
.section-wrap {
  padding: 40px 0;
  border-bottom: 0.5px solid #e5e7eb;
  scroll-margin-top: 80px;
}
.section-wrap:last-child { border-bottom: none; }

.section-meta {
  display: flex; align-items: baseline; gap: 16px;
  margin-bottom: 20px;
}

.section-index {
  font-size: 10px; font-weight: 500;
  color: #c4b5fd; letter-spacing: 0.14em; text-transform: uppercase;
  flex-shrink: 0; min-width: 22px;
}

.section-name {
  font-size: 15px; font-weight: 500;
  color: #111827; letter-spacing: -0.01em; margin-bottom: 2px;
}
.section-hint { font-size: 12px; color: #9ca3af; }

/* ─── Rich Content ─────────────────────────────────── */
.rich-content {
  font-size: 14px;
  line-height: 1.8;
  color: #374151;
}

.rich-content :deep(h1),
.rich-content :deep(h2),
.rich-content :deep(h3) {
  font-family: 'Lora', serif;
  font-weight: 500;
  color: #111827;
  letter-spacing: -0.01em;
  margin: 1.5em 0 0.6em;
}
.rich-content :deep(h2) { font-size: 18px; }
.rich-content :deep(h3) { font-size: 15px; }

.rich-content :deep(p) { margin-bottom: 0.9em; }

.rich-content :deep(ul),
.rich-content :deep(ol) {
  padding-left: 20px; margin-bottom: 0.9em;
}
.rich-content :deep(li) { margin-bottom: 0.3em; }

.rich-content :deep(strong) { font-weight: 500; color: #111827; }

.rich-content :deep(.empty-field) {
  color: #c4b5fd; font-style: italic; font-size: 13px;
}

/* ─── Plan accent ──────────────────────────────────── */
.plan-content {
  padding: 24px 28px;
  background: #faf9ff;
  border: 0.5px solid #e9d5ff;
  border-left: 2px solid #7c3aed;
  border-radius: 0 8px 8px 0;
}

/* ─── File Explorer ────────────────────────────────── */
.explorer {
  background: #fff;
  border: 0.5px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.explorer-toolbar {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  border-bottom: 0.5px solid #f3f4f6;
  background: #fafaf9;
}

.expl-back-btn {
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  background: #fff; border: 0.5px solid #e5e7eb;
  border-radius: 5px; color: #6b7280; cursor: pointer;
  transition: all 0.1s;
}
.expl-back-btn:hover:not(:disabled) { border-color: #c4b5fd; color: #7c3aed; }
.expl-back-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.expl-breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: #6b7280;
}
.crumb { cursor: pointer; transition: color 0.15s; }
.crumb:hover { color: #7c3aed; }
.crumb-sep { color: #d1d5db; }

.explorer-grid {
  display: flex; flex-direction: column;
  padding: 8px;
  gap: 2px;
}

.explorer-empty {
  padding: 32px; text-align: center;
  font-size: 13px; color: #9ca3af;
}

.file-card {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;
}
.file-card:hover { background: #f5f3ff; }
.file-card.folder .file-icon { color: #7c3aed; }

.file-icon {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; flex-shrink: 0;
}
.file-icon svg { width: 20px; height: 20px; }

.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 13px; font-weight: 500; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-meta { font-size: 11px; color: #9ca3af; margin-top: 1px; }

.file-arrow { width: 14px; height: 14px; color: #d1d5db; flex-shrink: 0; transition: color 0.15s, transform 0.15s; }
.file-card:hover .file-arrow { color: #7c3aed; transform: translateX(2px); }

/* ─── Empty state ──────────────────────────────────── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 80px 40px;
  background: #fff; border: 0.5px dashed #e5e7eb; border-radius: 12px;
  margin-top: 40px;
}
.empty-icon {
  width: 48px; height: 48px; border-radius: 10px;
  border: 0.5px solid #e5e7eb; display: flex; align-items: center; justify-content: center;
  color: #d1d5db; margin-bottom: 18px;
}
.empty-icon svg { width: 24px; height: 24px; }
.empty-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 500; color: #111827; margin-bottom: 8px; }
.empty-sub { font-size: 13px; color: #9ca3af; margin-bottom: 24px; }

/* ─── Animations ───────────────────────────────────── */
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Print ────────────────────────────────────────── */
@media print {
  .topbar, .hero-tabs { display: none; }
  .course-hero { padding: 0; border: none; }
  .content-area { padding: 0; max-width: 100%; }
}

/* ─── Responsive ───────────────────────────────────── */
@media (max-width: 768px) {
  .topbar { padding: 0 20px; }
  .topbar-brand { display: none; }
  .course-hero { padding: 24px 20px 0; }
  .hero-title { font-size: 26px; }
  .content-area { padding: 0 20px 60px; }
}
</style>
