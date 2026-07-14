<template>
  <div class="pdf-page" id="syllabus-pdf-template">

    <!-- Header -->
    <div class="pdf-header">
      <div class="school-identity">
        <div class="logo-box">
          <img v-if="schoolLogo" :src="schoolLogo" class="logo-img" alt="Logo">
          <span v-else class="logo-fallback">{{ schoolInitials }}</span>
        </div>
        <div class="school-info">
          <div class="school-name">{{ schoolName }}</div>
          <div class="school-dept">Direction des études et de la formation</div>
        </div>
      </div>
    </div>

    <div class="rule"></div>

    <!-- Title -->
    <div class="title-block">
      <div class="doc-label">Syllabus de cours</div>
      <div class="doc-title">{{ uv.code }} — {{ uv.nom }}</div>
    </div>

    <!-- Course identity -->
    <div class="course-block">
      <div class="course-top">
        <span class="ue-name">{{ uv.unite_enseignement?.nom || 'Unité d\'Enseignement' }}</span>
        <span class="course-code">{{ uv.code }}</span>
      </div>
      <div class="course-title">{{ uv.nom }}</div>
      <div class="meta-row">
        <div class="meta-cell">
          <div class="meta-label">Période</div>
          <div class="meta-val">{{ periodDisplay }}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-label">Coefficient</div>
          <div class="meta-val">{{ coefficientDisplay }}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-label">Date d'édition</div>
          <div class="meta-val">{{ today }}</div>
        </div>
      </div>
    </div>

    <!-- Sections -->
    <div v-for="section in sections" :key="section.id" class="section-block">
      <div class="section-head">
        <span class="s-num">{{ String(section.id).padStart(2, '0') }}</span>
        <span class="s-title">{{ section.label }}</span>
        <div class="s-rule"></div>
      </div>
      <div
        class="section-body rich-content"
        :class="{ plan: section.key === 'plan_cours' }"
        v-html="content[section.key] || '<i class=\'ph\'>Information non disponible.</i>'"
      ></div>
    </div>

  </div>
</template>

<script setup>
import { useParametreStore } from '~~/stores/parametre'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import { usePeriodeStore } from '~~/stores/periode'

const props = defineProps({
  uv:      { type: Object, required: true },
  content: { type: Object, required: true }
})

const parametreStore = useParametreStore()
const anneeStore = useAnneScolaireStore()
const periodeStore = usePeriodeStore()

const schoolName    = computed(() => parametreStore.getAppName || 'IAI-Cameroun')
const schoolLogo    = computed(() => parametreStore.getAppLogo)
const academicYear  = computed(() => anneeStore.activeAnnee?.nom || '2024–2025')

// Gestion flexible du coefficient
const coefficientDisplay = computed(() => {
  const c = props.uv.coefficient || props.uv.credits || props.uv.credit
  return c || '—'
})

// Gestion flexible de la période (résolution via store si besoin)
const periodDisplay = computed(() => {
  if (props.uv.periode?.nom) return props.uv.periode.nom
  if (props.uv.periode && typeof props.uv.periode === 'string') return props.uv.periode
  
  if (props.uv.periode_id && periodeStore.periodes.length > 0) {
    const p = periodeStore.periodes.find(p => p.id === props.uv.periode_id)
    if (p) return p.nom
  }
  
  return '—'
})

const schoolInitials = computed(() => {
  const name = schoolName.value || 'IAI'
  const words = name.split(/[\s\-]+/).filter(Boolean)
  return words.slice(0, 3).map(w => w[0].toUpperCase()).join('')
})

const today = computed(() => new Date().toLocaleDateString('fr-FR'))

const sections = [
  { id: 1, key: 'description',  label: 'Description du cours' },
  { id: 2, key: 'objectifs',    label: 'Objectifs pédagogiques' },
  { id: 3, key: 'competences',  label: 'Compétences visées' },
  { id: 4, key: 'plan_cours',   label: 'Plan détaillé du cours' },
  { id: 5, key: 'evaluation',   label: 'Modalités d\'évaluation' },
  { id: 6, key: 'ressources',   label: 'Ressources et bibliographie' },
]

onMounted(async () => {
  // S'assurer que les paramètres sont chargés
  if (!parametreStore.parametres || parametreStore.parametres.length === 0) {
    await parametreStore.fetchParametres()
  }
  // S'assurer que l'année scolaire est chargée
  if (!anneeStore.annneescolaires || anneeStore.annneescolaires.length === 0) {
    await anneeStore.fetchAnneeScolaire()
  }
  // Charger les périodes pour résoudre periode_id
  if (!periodeStore.periodes || periodeStore.periodes.length === 0) {
    await periodeStore.fetchPeriode()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

/* ─── Page container ───────────────────────────────── */
.pdf-page {
  width: 190mm; /* Largeur réduite pour les marges html2pdf */
  margin: 0 auto;
  background: #fff;
  color: #111;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  line-height: 1.6;
}

/* ─── Header ───────────────────────────────────────── */
.pdf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.school-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  background: #111;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-fallback {
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.school-name {
  font-size: 12px;
  font-weight: 500;
  color: #111;
  line-height: 1.3;
}

.school-dept {
  font-size: 8px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 2px;
}

.official-tag {
  font-size: 8px;
  font-weight: 500;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 3px 8px;
  border: 0.5px solid #ccc;
  border-radius: 2px;
}

/* ─── Horizontal rules ─────────────────────────────── */
.rule {
  height: 0.5px;
  background: #111;
  margin-bottom: 24px;
}

/* ─── Title block ──────────────────────────────────── */
.title-block {
  margin-bottom: 28px;
}

.doc-label {
  font-size: 8px;
  color: #888;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.doc-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 20px;
  font-weight: 500;
  color: #111;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.session-tag {
  font-size: 9px;
  color: #888;
  margin-top: 5px;
  letter-spacing: 0.06em;
}

/* ─── Course block ─────────────────────────────────── */
.course-block {
  border-top: 1px solid #111;
  border-bottom: 0.5px solid #e5e5e5;
  padding: 16px 0;
  margin-bottom: 28px;
}

.course-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.ue-name {
  font-size: 8px;
  color: #888;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
}

.course-code {
  font-size: 9px;
  font-weight: 500;
  color: #555;
  letter-spacing: 0.08em;
}

.course-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 18px;
  font-weight: 500;
  color: #111;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin-bottom: 14px;
}

.meta-row {
  display: flex;
  gap: 36px;
  padding-top: 12px;
  border-top: 0.5px solid #eee;
}

.meta-label {
  font-size: 7px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.meta-val {
  font-size: 10px;
  font-weight: 500;
  color: #111;
}

/* ─── Content sections ─────────────────────────────── */
.section-block {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.s-num {
  font-size: 8px;
  font-weight: 500;
  color: #aaa;
  letter-spacing: 0.1em;
  flex-shrink: 0;
  min-width: 16px;
}

.s-title {
  font-size: 8px;
  font-weight: 500;
  color: #555;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.s-rule {
  flex: 1;
  height: 0.5px;
  background: #e5e5e5;
}

.section-body {
  font-size: 11px;
  line-height: 1.75;
  color: #333;
  padding-left: 24px;
  text-align: justify;
}

.section-body.plan {
  border-left: 1.5px solid #111;
  border-radius: 0;
  padding-left: 12px;
  margin-left: 24px;
}

/* ─── Rich content ─────────────────────────────────── */
.rich-content :deep(p)  { margin-bottom: 6px; }
.rich-content :deep(ul),
.rich-content :deep(ol) { padding-left: 16px; margin-bottom: 6px; }
.rich-content :deep(li) { margin-bottom: 3px; }
.rich-content :deep(h2),
.rich-content :deep(h3) { font-size: 12px; font-weight: 500; margin: 8px 0 4px; color: #111; }
.rich-content :deep(strong) { font-weight: 500; color: #111; }
.rich-content :deep(.ph) { color: #bbb; font-style: italic; }
.rich-content :deep(i)  { color: #bbb; font-style: italic; }

/* ─── Footer ───────────────────────────────────────── */
.pdf-footer {
  margin-top: 36px;
  padding-top: 12px;
  border-top: 0.5px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.f-item {
  font-size: 8px;
  color: #aaa;
  letter-spacing: 0.06em;
}

.f-center { color: #ccc; }

/* ─── Print ────────────────────────────────────────── */
@media print {
  .pdf-page {
    width: 100%;
    padding: 18mm;
    box-shadow: none;
  }
}
</style>