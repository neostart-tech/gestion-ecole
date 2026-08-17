<template>
  <div class="p-6 md:p-10 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-200">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mes <span class="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Enseignements</span>
        </h1>
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
          Gérez les syllabuses de vos matières pour guider vos étudiants
        </p>
      </div>
      <div class="self-start md:self-center px-4 py-2 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-2xl shadow-sm border border-purple-100 dark:border-slate-800">
        Espace Enseignant
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col items-center justify-center p-16 space-y-4">
      <div class="w-10 h-10 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 rounded-full animate-spin"></div>
      <p class="text-xs text-slate-500 dark:text-slate-400">Chargement de vos matières...</p>
    </div>

    <!-- UVs Grid -->
    <div v-else-if="uvs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="uv in uvs"
        :key="uv.id"
        class="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
      >
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div>
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-6 gap-2">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/50 flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <!-- Badges Filière + Semestre côte à côte -->
            <div class="flex flex-wrap items-center justify-end gap-1.5">
              <span v-if="getFiliereName(uv)" class="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-[10px] font-extrabold tracking-wider uppercase rounded-lg border border-sky-200/60 dark:border-sky-800/50">
                {{ getFiliereName(uv) }}
              </span>
              <span v-if="getSemestreName(uv)" class="px-2.5 py-1 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold tracking-wider uppercase rounded-lg border border-purple-200/60 dark:border-purple-800/50">
                {{ getSemestreName(uv) }}
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="space-y-2 mb-6">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-400 dark:text-slate-500">{{ uv.code || 'UV' }}</span>
            </div>

            <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
              {{ uv.nom }}
            </h3>

            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ uv.unite_enseignement?.nom }}
            </p>

            <div
              :class="uv.syllabus ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'"
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold mt-2"
            >
              <svg v-if="uv.syllabus" class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ uv.syllabus ? 'Syllabus Finalisé' : 'En attente de rédaction' }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <NuxtLink
            :to="`/enseignant/syllabuses/view/${uv.slug || uv.id}`"
            class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition duration-200 flex items-center justify-center"
            title="Visualiser le rendu"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </NuxtLink>

          <NuxtLink
            :to="`/enseignant/syllabuses/${uv.slug || uv.id}`"
            :class="uv.syllabus ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/50' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20'"
            class="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition duration-200"
          >
            <span>{{ uv.syllabus ? 'Mettre à jour' : 'Rédiger' }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4 max-w-2xl mx-auto">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-slate-900 dark:text-white">Vos enseignements apparaîtront ici</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400">Aucune matière ne vous est actuellement assignée dans le système.</p>
    </div>
  </div>
</template>

<script setup>
import { useSyllabusStore } from '~~/stores/syllabus'
import { useFiliereStore } from '~~/stores/filiere'

const syllabusStore = useSyllabusStore()
const filiereStore = useFiliereStore()

const pending = computed(() => syllabusStore.isLoading)
const uvs = computed(() => syllabusStore.enseignantSyllabuses || [])

const getFiliereName = (uv) => {
  if (uv.filiere?.nom) return uv.filiere.nom
  if (uv.filiere && typeof uv.filiere === 'string') return uv.filiere
  
  if (uv.filiere_id && filiereStore.filieres.length > 0) {
    const f = filiereStore.filieres.find(f => f.id === uv.filiere_id)
    if (f) return f.nom
  }
  return null
}

const getSemestreName = (uv) => {
  if (!uv || typeof uv !== 'object') return null
  const p = uv.periode || uv.semestre || uv.unite_enseignement?.periode || uv.unite_enseignement?.semestre || uv.ue?.periode || uv.ue?.semestre
  if (p) {
    if (typeof p === 'string') return p
    if (typeof p === 'object') return p.nom || p.libelle || p.name || null
  }
  if (uv.periode_nom) return uv.periode_nom
  if (uv.semestre_nom) return uv.semestre_nom
  return null
}

onMounted(async () => {
  await syllabusStore.fetchEnseignantSyllabuses()
  if (filiereStore.filieres.length === 0) {
    await filiereStore.fetchFilieres()
  }
})

definePageMeta({
  layout: 'default'
})
</script>