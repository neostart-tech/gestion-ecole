<template>
  <div class="syllabus-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Mon Programme <span>Académique</span></h1>
        <p class="page-subtitle">Consultez les syllabuses de vos matières organisés par semestre</p>
      </div>
      <div class="header-stats" v-if="data">
        <div class="stat-card">
          <span class="stat-value">{{ Object.keys(data.semestres).length }}</span>
          <span class="stat-label">Semestres</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalCourses }}</span>
          <span class="stat-label">Matières</span>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton (Synchronisé avec le style Emploi du Temps) -->
    <div v-if="pending" class="space-y-12 animate-pulse mt-8">
      <div v-for="s in 2" :key="s" class="space-y-6">
        <!-- Semestre Header Skeleton -->
        <div class="flex items-center gap-4">
          <div class="h-8 bg-gray-200 rounded-xl w-32"></div>
          <div class="h-0.5 bg-gray-100 flex-1"></div>
        </div>
        <!-- Courses Grid Skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-white border border-gray-100 rounded-3xl p-6 flex gap-4">
            <div class="h-14 w-14 bg-gray-100 rounded-2xl flex-shrink-0"></div>
            <div class="flex-1 space-y-3">
              <div class="h-5 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-100 rounded w-1/2"></div>
              <div class="flex justify-between items-center pt-2">
                <div class="h-3 bg-gray-50 rounded w-20"></div>
                <div class="h-3 bg-gray-50 rounded w-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="data && Object.keys(data.semestres).length > 0" class="semestres-container">
      <div v-for="(uvs, semestre) in data.semestres" :key="semestre" class="semestre-section">
        <div class="semestre-header">
          <div class="semestre-badge">{{ semestre }}</div>
          <div class="semestre-line"></div>
        </div>

        <div class="courses-grid">
          <NuxtLink 
            v-for="uv in uvs" 
            :key="uv.id" 
            :to="`/etudiant/syllabuses/${uv.slug}`"
            class="course-card"
          >
            <div class="card-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="card-body">
              <h3 class="course-name">{{ uv.nom }}</h3>
              <div class="card-footer">
                <span class="syllabus-status" :class="{ 'has-syllabus': uv.syllabus }">
                  <template v-if="uv.syllabus">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                    Syllabus disponible
                  </template>
                  <template v-else>
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    En attente de rédaction
                  </template>
                </span>
                <div class="view-btn">Voir <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="empty-state-card">
      <div class="empty-illustration">
        <div class="circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
        <div class="icon-box">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
      <h2 class="empty-title">Votre programme est en cours de préparation</h2>
      <p class="empty-description">Il semble que vous ne soyez pas encore inscrit à des unités de valeur pour cette session. Contactez l'administration si vous pensez qu'il s'agit d'une erreur.</p>
      <button @click="refreshData" class="refresh-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        Actualiser mon programme
      </button>
    </div>
  </div>
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Outfit:wght@400;600;700&display=swap');

.syllabus-page {
  padding: 30px;
  background-color: #f8faff;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  padding: 40px;
  border-radius: 24px;
  color: white;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
}

.page-title {
  font-family: 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-title span {
  color: #e0e7ff;
  font-weight: 400;
}

.page-subtitle {
  opacity: 0.9;
  font-size: 16px;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 15px 25px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;
  opacity: 0.8;
}

.semestre-section {
  margin-bottom: 50px;
}

.semestre-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.semestre-badge {
  background: white;
  color: #6366f1;
  padding: 8px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.semestre-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #e2e8f0 0%, transparent 100%);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.course-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #edf2f7;
  position: relative;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: #6366f1;
}

.course-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: #6366f1;
  opacity: 0;
  transition: 0.3s;
}

.course-card:hover::after {
  opacity: 1;
}

.card-icon {
  width: 54px;
  height: 54px;
  background: #f0f4ff;
  color: #6366f1;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: 0.3s;
}

.course-card:hover .card-icon {
  background: #6366f1;
  color: white;
  transform: scale(1.1);
}

.card-icon svg {
  width: 28px;
  height: 28px;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-name {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
  line-height: 1.3;
}

.course-ue {
  font-size: 14px;
  color: #718096;
  margin-bottom: 15px;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.syllabus-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #a0aec0;
}

.syllabus-status svg {
  width: 14px;
  height: 14px;
}

.has-syllabus {
  color: #10b981;
}

.view-btn {
  font-size: 13px;
  font-weight: 700;
  color: #6366f1;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: translateX(10px);
  transition: 0.3s;
}

.course-card:hover .view-btn {
  opacity: 1;
  transform: translateX(0);
}

.view-btn svg {
  width: 14px;
  height: 14px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;
}

.empty-state-card {
  background: white;
  border-radius: 32px;
  padding: 60px 40px;
  text-align: center;
  max-width: 600px;
  margin: 40px auto;
  border: 1px solid #edf2f7;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.empty-illustration {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circles {
  position: absolute;
  inset: 0;
}

.circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid #6366f1;
  opacity: 0;
  animation: pulse 3s infinite;
}

.circle-2 { animation-delay: 1s; }
.circle-3 { animation-delay: 2s; }

@keyframes pulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { opacity: 0.2; }
  100% { transform: scale(1.5); opacity: 0; }
}

.icon-box {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 1;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.icon-box svg {
  width: 40px;
  height: 40px;
}

.empty-title {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 12px;
}

.empty-description {
  color: #718096;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #f0f4ff;
  color: #6366f1;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.refresh-btn:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-2px);
}

.refresh-btn svg {
  width: 18px;
  height: 18px;
}
</style>
