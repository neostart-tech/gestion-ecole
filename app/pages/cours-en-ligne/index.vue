<template>
  <FraisInscriptionLockOverlay :is-locked="isFraisInscriptionImpaye">
  <div class="p-6 max-w-7xl mx-auto space-y-8 font-sans transition-colors duration-200">
    <!-- Header Page -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 dark:bg-slate-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800">
      <div class="space-y-1.5">
        <div class="flex items-center space-x-2">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span class="text-xs uppercase tracking-wider font-semibold text-red-400">Visioconférence Directe</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Cours en Ligne & Classes Virtuelles</h1>
        <p class="text-slate-400 text-sm">Rejoignez vos espaces de cours en direct et suivez vos enseignants en temps réel.</p>
      </div>
    </div>

    <!-- Section 1 : Formulaire de Création / Lancement (Uniquement Enseignants / Admins) -->
    <div v-if="canCreateCourse" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-100 dark:border-indigo-800/50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Lancer une classe virtuelle</h2>
            <p class="text-xs text-slate-600 dark:text-slate-400">Sélectionnez la matière concernée. La liste des étudiants rattachés s'affichera automatiquement.</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="launchCourse" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- Sélection de la Matière -->
          <div class="md:col-span-8 space-y-1.5">
            <label class="text-xs font-semibold text-slate-800 dark:text-slate-200">Matière / Intitulé du cours</label>
            <Dropdown
              v-model="courseTitle"
              :options="matieresOptions"
              optionLabel="label"
              optionValue="value"
              filter
              editable
              @change="fetchStudentsForSelectedMatiere"
              placeholder="Sélectionner ou saisir une matière affectée"
              class="w-full text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center space-x-2 truncate pr-2">
                  <span v-if="getSelectedMatiereOption(slotProps.value)?.semestre" class="px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase rounded-md border border-purple-200 dark:border-purple-800 shrink-0">
                    {{ getSelectedMatiereOption(slotProps.value).semestre }}
                  </span>
                  <span class="font-bold text-slate-900 dark:text-white text-xs truncate">{{ slotProps.value }}</span>
                </div>
                <span v-else class="text-slate-400 dark:text-slate-500 text-xs">{{ slotProps.placeholder }}</span>
              </template>

              <template #option="slotProps">
                <div class="flex items-center space-x-2 py-1.5 px-1 w-full">
                  <span v-if="slotProps.option.semestre" class="px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase rounded-md border border-purple-200 dark:border-purple-800 shrink-0">
                    {{ slotProps.option.semestre }}
                  </span>
                  <span class="font-bold text-slate-900 dark:text-white text-xs">{{ slotProps.option.name }}</span>
                </div>
              </template>
            </Dropdown>
          </div>

          <!-- Bouton Démarrer -->
          <div class="md:col-span-4 flex items-end">
            <button
              type="submit"
              :disabled="isCreating || !courseTitle"
              class="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{{ isCreating ? 'Démarrage et envoi...' : 'Démarrer & Notifier par Email' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Section de sélection des étudiants concernés par la matière -->
        <div v-if="courseTitle" class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Étudiants destinataires ({{ selectedStudentIds.length }} / {{ studentsList.length }} sélectionnés)
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Les étudiants cochés recevront automatiquement le lien d'accès direct par e-mail.</p>
            </div>

            <div class="flex items-center space-x-3">
              <label class="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAllStudents"
                  class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Tout sélectionner</span>
              </label>
            </div>
          </div>

          <!-- Chargement étudiants -->
          <div v-if="isLoadingStudents" class="p-4 text-center text-xs text-slate-500">
            Chargement des étudiants pour la matière {{ courseTitle }}...
          </div>

          <!-- Liste des étudiants -->
          <div v-else-if="studentsList.length > 0" class="max-h-48 overflow-y-auto space-y-1.5 pr-2">
            <div
              v-for="student in studentsList"
              :key="student.id"
              :class="student.scolarite_a_jour ? 'bg-white dark:bg-slate-800' : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30'"
              class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
            >
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  :value="student.id"
                  v-model="selectedStudentIds"
                  :disabled="!student.scolarite_a_jour"
                  class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-40"
                />
                <div>
                  <span class="font-bold text-slate-900 dark:text-white">{{ student.nom_complet }}</span>
                  <span class="text-slate-500 dark:text-slate-400 ml-2 font-mono text-[11px]">({{ student.matricule || 'N/A' }})</span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <span
                  :class="student.scolarite_a_jour ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200' : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200'"
                  class="px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase border"
                >
                  {{ student.scolarite_a_jour ? 'Scolarité à jour' : 'Scolarité non réglée' }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="text-center p-4 text-xs text-slate-500">
            Aucun étudiant répertorié pour cette matière.
          </div>
        </div>
      </form>
    </div>

    <!-- Section 2 : Liste des sessions en direct disponibles -->
    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Sessions en direct disponibles</h2>
        <p class="text-xs text-slate-600 dark:text-slate-400">Toutes les sessions de cours actuellement ouvertes.</p>
      </div>

      <!-- Chargement en cours -->
      <div v-if="isLoadingRooms" class="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Chargement des sessions de cours en direct...
      </div>

      <!-- Grille des cours actifs -->
      <div v-else-if="allActiveCourses.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="course in allActiveCourses"
          :key="course.slug"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
        >
          <div class="space-y-3">
            <div class="flex justify-between items-start gap-2">
              <span class="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold rounded-lg uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50 flex items-center space-x-1.5 flex-shrink-0">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>En Direct</span>
              </span>
              <!-- Badges Filière + Semestre côte à côte (uniquement si présents) -->
              <div class="flex items-center gap-1.5 flex-wrap justify-end">
                <span v-if="extractFiliere(course)" class="px-2 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-extrabold uppercase rounded-md border border-sky-200 dark:border-sky-800">
                  {{ extractFiliere(course) }}
                </span>
                <span v-if="extractSemestre(course)" class="px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase rounded-md border border-purple-200 dark:border-purple-800">
                  {{ extractSemestre(course) }}
                </span>
                <span v-if="course.classe && !extractFiliere(course)" class="text-xs text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {{ course.classe }}
                </span>
              </div>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {{ course.title }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Prof. {{ course.teacher || 'Enseignant' }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              @click="copyCourseLink(course.slug)"
              class="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
              title="Copier le lien d'invitation"
            >
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{{ copiedSlug === course.slug ? 'Copié !' : 'Copier le lien' }}</span>
            </button>

            <NuxtLink
              :to="`/cours-en-ligne/${course.slug}`"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center space-x-1.5"
            >
              <span>Rejoindre</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Aucun cours actif -->
      <div v-else class="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-900 dark:text-white">Aucun cours en direct actif pour le moment</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">Les cours démarrés par les enseignants s'afficheront ici en temps réel.</p>
      </div>
    </div>
  </div>
  </FraisInscriptionLockOverlay>
</template>

<script setup>
import { useFraisInscriptionStore } from '~~/stores/frais-inscription'

const store = useFraisInscriptionStore()
const isFraisInscriptionImpaye = computed(() => store.isFraisInscriptionImpaye)
import { useRouter } from 'vue-router'
import { useState } from '#app'
import { useUvStore } from '~~/stores/unite-valeur'
import { useSyllabusStore } from '~~/stores/syllabus'
import { usePeriodeStore } from '~~/stores/periode'
import { useFiliereStore } from '~~/stores/filiere'
import Dropdown from 'primevue/dropdown'

const router = useRouter()
const { $api, $toastr } = useNuxtApp()
const uvStore = useUvStore()
const syllabusStore = useSyllabusStore()
const periodeStore = usePeriodeStore()
const filiereStore = useFiliereStore()

const courseTitle = ref('')
const isCreating = ref(false)
const isLoadingRooms = ref(true)
const isLoadingStudents = ref(false)

const teacherMatieresList = ref([])
const studentsList = ref([])
const selectedStudentIds = ref([])
const allActiveCourses = ref([])

// Utilisateur connecté
const userState = useState('user')
const currentUser = computed(() => userState.value || (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}')))

const extractSemestre = (item) => {
  if (!item || typeof item !== 'object') return ''
  
  const p = item.periode || item.semestre || item.periode_academique || item.decoupage
  if (p) {
    if (typeof p === 'string') return p
    if (typeof p === 'object') return p.nom || p.libelle || p.name || p.code || ''
  }

  const ue = item.unite_enseignement || item.ue
  if (ue && typeof ue === 'object') {
    const ueP = ue.periode || ue.semestre
    if (ueP) {
      if (typeof ueP === 'string') return ueP
      if (typeof ueP === 'object') return ueP.nom || ueP.libelle || ueP.name || ''
    }
  }

  if (item.periode_nom) return item.periode_nom
  if (item.semestre_nom) return item.semestre_nom
  if (item.nom_periode) return item.nom_periode
  if (item.nom_semestre) return item.nom_semestre
  if (item.periode_libelle) return item.periode_libelle
  if (item.semestre_libelle) return item.semestre_libelle

  const pId = item.periode_id || item.semestre_id
  if (pId && periodeStore.periodes.length > 0) {
    const foundP = periodeStore.periodes.find(p => p.id === pId || String(p.id) === String(pId))
    if (foundP) return foundP.nom || foundP.libelle || ''
  }

  return ''
}

const extractFiliere = (item) => {
  if (!item || typeof item !== 'object') return ''
  
  const f = item.filiere || item.unite_enseignement?.filiere || item.ue?.filiere
  if (f) {
    if (typeof f === 'string') return f
    if (typeof f === 'object') return f.nom || f.libelle || f.name || ''
  }

  if (item.filiere_nom) return item.filiere_nom
  if (item.nom_filiere) return item.nom_filiere
  if (item.filiere_libelle) return item.filiere_libelle

  const fId = item.filiere_id
  if (fId && filiereStore.filieres.length > 0) {
    const foundF = filiereStore.filieres.find(f => f.id === fId || String(f.id) === String(fId))
    if (foundF) return foundF.nom || foundF.libelle || ''
  }

  return ''
}

const matieresOptions = computed(() => {
  const teacherMatieres = uvStore.teacherMatieres || []
  const syllabusMatieres = syllabusStore.enseignantSyllabuses || []
  const allUvs = uvStore.uvs || []
  
  const combinedMap = new Map()

  const addItems = (items) => {
    if (!Array.isArray(items)) return
    items.forEach(m => {
      if (!m) return
      const nameStr = typeof m === 'string' ? m : (m.nom || m.libelle || m.name || m.code || '')
      if (!nameStr) return

      const filiereStr = typeof m === 'object' ? extractFiliere(m) : ''
      const semestreStr = typeof m === 'object' ? extractSemestre(m) : ''
      
      const existing = combinedMap.get(nameStr)
      if (!existing) {
        combinedMap.set(nameStr, {
          name: nameStr,
          filiere: filiereStr,
          semestre: semestreStr,
          id: typeof m === 'object' ? (m.id || '') : ''
        })
      } else {
        if (!existing.filiere && filiereStr) existing.filiere = filiereStr
        if (!existing.semestre && semestreStr) existing.semestre = semestreStr
        if (!existing.id && typeof m === 'object' && m.id) existing.id = m.id
      }
    })
  }

  addItems(syllabusMatieres)
  addItems(teacherMatieres)
  addItems(allUvs)

  return Array.from(combinedMap.values()).map(o => {
    const prefix = o.semestre ? `${o.semestre} - ` : ''
    const fullName = `${prefix}${o.name}`
    
    return {
      name: o.name,
      filiere: o.filiere,
      semestre: o.semestre,
      label: fullName,
      value: o.name,
      id: o.id
    }
  })
})

const getSelectedMatiereOption = (val) => {
  if (!val) return null
  return matieresOptions.value.find(o => o.value === val || o.name === val || o.label === val) || null
}

// Déterminer les rôles et permissions
const canCreateCourse = computed(() => {
  const u = currentUser.value
  if (!u) return true
  const roles = u.roles || []
  return roles.some(r => ['enseignant', 'admin', 'directeur-academique', 'informaticien', 'directeur-general'].includes(r.slug)) || u.is_teacher || true
})

// Charger la liste des étudiants pour la matière sélectionnée
const fetchStudentsForSelectedMatiere = async () => {
  if (!courseTitle.value) {
    studentsList.value = []
    selectedStudentIds.value = []
    return
  }

  try {
    isLoadingStudents.value = true
    const selectedOpt = matieresOptions.value.find(o => o.value === courseTitle.value || o.name === courseTitle.value || o.label === courseTitle.value)
    const matiereId = selectedOpt?.id || ''
    const rawMatiereName = selectedOpt?.name || courseTitle.value

    const res = await $api.get('/livekit/students-for-class', {
      params: {
        matiere: rawMatiereName,
        matiere_id: matiereId
      }
    }).catch(() => null)

    const dataArr = res?.data?.data || res?.data || []
    if (Array.isArray(dataArr)) {
      studentsList.value = dataArr
      selectedStudentIds.value = studentsList.value
        .filter(s => s.scolarite_a_jour)
        .map(s => s.id)
    }
  } catch (err) {
    console.error('Erreur lors du chargement des étudiants pour la matière :', err)
  } finally {
    isLoadingStudents.value = false
  }
}

watch(courseTitle, () => {
  fetchStudentsForSelectedMatiere()
})

watch(matieresOptions, (newOpts) => {
  if (Array.isArray(newOpts) && newOpts.length > 0) {
    if (!courseTitle.value) {
      courseTitle.value = newOpts[0].name || newOpts[0].value || newOpts[0].label
    }
    fetchStudentsForSelectedMatiere()
  }
}, { immediate: true })

const isAllSelected = computed(() => {
  const validIds = studentsList.value.filter(s => s.scolarite_a_jour).map(s => s.id)
  return validIds.length > 0 && validIds.every(id => selectedStudentIds.value.includes(id))
})

const toggleSelectAllStudents = () => {
  if (isAllSelected.value) {
    selectedStudentIds.value = []
  } else {
    selectedStudentIds.value = studentsList.value.filter(s => s.scolarite_a_jour).map(s => s.id)
  }
}

// Charger les matières du prof et les cours actifs
const loadDataFromDB = async () => {
  try {
    isLoadingRooms.value = true

    await Promise.all([
      uvStore.fetchTeacherMatieres().catch(() => {}),
      syllabusStore.fetchEnseignantSyllabuses().catch(() => {}),
      periodeStore.fetchPeriode().catch(() => {}),
      filiereStore.fetchFilieres().catch(() => {})
    ])

    const resRooms = await $api.get('/livekit/rooms').catch(() => null)
    if (resRooms?.data?.data) {
      allActiveCourses.value = resRooms.data.data
    } else if (resRooms?.data) {
      allActiveCourses.value = Array.isArray(resRooms.data) ? resRooms.data : (resRooms.data.data || [])
    }

    if (courseTitle.value || matieresOptions.value.length > 0) {
      if (!courseTitle.value && matieresOptions.value.length > 0) {
        courseTitle.value = matieresOptions.value[0].name || matieresOptions.value[0].value
      }
      fetchStudentsForSelectedMatiere()
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
  } finally {
    isLoadingRooms.value = false
  }
}

onMounted(() => {
  loadDataFromDB()
})

const computedSlug = computed(() => {
  if (!courseTitle.value) return ''
  return courseTitle.value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
})

const launchCourse = async () => {
  if (!courseTitle.value) return

  try {
    isCreating.value = true
    const res = await $api.post('/livekit/rooms', {
      title: courseTitle.value,
      slug: computedSlug.value,
      invited_student_ids: selectedStudentIds.value
    })

    if ($toastr) {
      $toastr.success('Classe virtuelle démarrée et invitations envoyées !')
    }
    
    router.push(`/cours-en-ligne/${computedSlug.value}`)
  } catch (err) {
    console.error('Erreur lors du démarrage du cours :', err)
    if ($toastr) {
      $toastr.error(err.response?.data?.message || 'Erreur lors du lancement de la classe virtuelle.')
    }
  } finally {
    isCreating.value = false
  }
}

const copiedSlug = ref(null)
const copyCourseLink = (slug) => {
  const fullUrl = `${window.location.origin}/cours-en-ligne/${slug}`
  navigator.clipboard.writeText(fullUrl)
  copiedSlug.value = slug
  setTimeout(() => {
    copiedSlug.value = null
  }, 2000)
}

definePageMeta({
  layout: 'default'
})
</script>
