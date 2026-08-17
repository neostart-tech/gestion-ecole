<template>
  <FraisInscriptionLockOverlay>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      
      <!-- Header Banner -->
      <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-900 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-blue-500/10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="space-y-2 max-w-xl">
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mon Programme <span class="font-light text-blue-100">Académique</span>
          </h1>
          <p class="text-sm sm:text-base text-blue-100/90 font-medium">
            Consultez les syllabuses de vos matières organisés par semestre
          </p>
        </div>

        <div v-if="data" class="flex items-center gap-3 self-stretch sm:self-auto justify-start">
          <div class="bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center min-w-[100px]">
            <span class="block text-2xl font-bold leading-none">{{ Object.keys(data.semestres || {}).length }}</span>
            <span class="text-[11px] uppercase tracking-wider font-semibold text-blue-100/80 mt-1 block">Semestres</span>
          </div>
          <div class="bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center min-w-[100px]">
            <span class="block text-2xl font-bold leading-none">{{ totalCourses }}</span>
            <span class="text-[11px] uppercase tracking-wider font-semibold text-blue-100/80 mt-1 block">Matières</span>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="pending" class="space-y-10 animate-pulse">
        <div v-for="s in 2" :key="s" class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="h-8 bg-slate-200 dark:bg-slate-700/70 rounded-xl w-36"></div>
            <div class="h-0.5 bg-slate-200 dark:bg-slate-800 flex-1"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 flex gap-4 shadow-sm">
              <div class="h-14 w-14 bg-slate-100 dark:bg-slate-700/80 rounded-2xl flex-shrink-0"></div>
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div class="h-4 bg-slate-100 dark:bg-slate-700/60 rounded w-1/2"></div>
                <div class="flex justify-between items-center pt-2">
                  <div class="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-20"></div>
                  <div class="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div v-else-if="data && Object.keys(data.semestres || {}).length > 0" class="space-y-12">
        <div v-for="(uvs, semestre) in data.semestres" :key="semestre" class="space-y-6">
          
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700/80 shadow-sm">
              {{ semestre }}
            </span>
            <div class="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-700/80 to-transparent"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink 
              v-for="uv in uvs" 
              :key="uv.id" 
              :to="`/etudiant/syllabuses/${uv.slug}`"
              class="group relative bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 flex gap-4 text-inherit no-underline shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <!-- Colored edge indicator on hover -->
              <div class="absolute top-0 right-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div class="w-13 h-13 sm:w-14 sm:h-14 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all duration-300 shadow-inner">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              <div class="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-1">
                    {{ uv.nom }}
                  </h3>
                  <p v-if="uv.code" class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                    {{ uv.code }}
                  </p>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-2">
                  <span class="inline-flex items-center gap-1.5 text-xs font-semibold" :class="uv.syllabus ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'">
                    <template v-if="uv.syllabus">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      Syllabus disponible
                    </template>
                    <template v-else>
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      En attente
                    </template>
                  </span>

                  <span class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    Voir 
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

            </NuxtLink>
          </div>

        </div>
      </div>

      <!-- Empty State Card -->
      <div v-else class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-12 space-y-6">
        <div class="w-20 h-20 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Votre programme est en cours de préparation</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Il semble que vous ne soyez pas encore inscrit à des unités de valeur pour cette session. Contactez l'administration si vous pensez qu'il s'agit d'une erreur.
          </p>
        </div>
        <button @click="refreshData" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-300 hover:text-white dark:hover:text-white rounded-xl text-sm font-bold transition-all shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser mon programme
        </button>
      </div>

    </div>
  </FraisInscriptionLockOverlay>
</template>

<script setup>
import { useSyllabusStore } from '~~/stores/syllabus'
const syllabusStore = useSyllabusStore()
const data = computed(() => syllabusStore.etudiantSyllabuses)
const pending = computed(() => syllabusStore.isLoading)

onMounted(async () => {
  await syllabusStore.fetchEtudiantSyllabuses()
})

const refreshData = async () => {
  await syllabusStore.fetchEtudiantSyllabuses()
}

const totalCourses = computed(() => {
  if (!data.value || !data.value.semestres) return 0
  return Object.values(data.value.semestres).reduce((acc, curr) => acc + curr.length, 0)
})

definePageMeta({
  layout: 'default'
})
</script>
