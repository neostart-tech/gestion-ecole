<template>
  <div class="teacher-syllabus">
    <div class="page-header">
      <div class="header-info">
        <h1 class="title">Mes <span>Enseignements</span></h1>
        <p class="subtitle">Gérez les syllabuses de vos matières pour guider vos étudiants</p>
      </div>
      <div class="header-badge">
        Espace Enseignant
      </div>
    </div>

    <div v-if="pending" class="loading-box">
      <div class="loader"></div>
      <p>Chargement de vos matières...</p>
    </div>

    <div v-else-if="uvs.length > 0" class="uv-grid">
      <div v-for="uv in uvs" :key="uv.id" class="uv-card">
        <div class="uv-card-header">
          <div class="uv-icon-wrapper">
            <div class="uv-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          </div>
          <div class="uv-badge-periode">{{ uv.periode?.nom || 'Semestre' }}</div>
        </div>
        
        <div class="uv-card-body">
          <div class="uv-meta-top">
            <div class="uv-code">{{ uv.code || 'UV' }}</div>
            <div v-if="getFiliereName(uv)" class="uv-filiere">{{ getFiliereName(uv) }}</div>
          </div>
          <h3 class="uv-nom">{{ uv.nom }}</h3>
          <p class="uv-ue">{{ uv.unite_enseignement?.nom }}</p>
          
          <div class="status-pill" :class="{ 'completed': uv.syllabus }">
            <svg v-if="uv.syllabus" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ uv.syllabus ? 'Syllabus Finalisé' : 'En attente de rédaction' }}
          </div>
        </div>

        <div class="uv-card-footer">
          <div class="action-grid">
            <NuxtLink :to="`/enseignant/syllabuses/view/${uv.slug}`" class="action-btn view-btn" title="Visualiser le rendu">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </NuxtLink>
            <NuxtLink :to="`/enseignant/syllabuses/${uv.slug}`" class="action-btn edit-btn" :class="{ 'outline': uv.syllabus }">
              <span>{{ uv.syllabus ? 'Mettre à jour' : 'Rédiger' }}</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state-premium">
      <div class="empty-illustration">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
      </div>
      <h2>Vos enseignements apparaîtront ici</h2>
      <p>Aucune matière ne vous est actuellement assignée dans le système.</p>
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

<style scoped>
.teacher-syllabus {
  padding: 40px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.title span {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #64748b;
  font-size: 16px;
  margin-top: 4px;
}

.header-badge {
  background: white;
  color: #7c3aed;
  padding: 10px 20px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.1);
}

.uv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
}

.uv-card {
  background: white;
  border-radius: 28px;
  border: 1px solid #f1f5f9;
  padding: 30px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.uv-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6 0%, #d8b4fe 100%);
  opacity: 0;
  transition: 0.3s;
}

.uv-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
  border-color: #ddd6fe;
}

.uv-card:hover::before {
  opacity: 1;
}

.uv-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.uv-icon-wrapper {
  background: #f5f3ff;
  padding: 12px;
  border-radius: 18px;
  color: #8b5cf6;
}

.uv-icon svg {
  width: 24px;
  height: 24px;
}

.uv-badge-periode {
  font-size: 10px;
  font-weight: 800;
  color: #6d28d9;
  background: #ede9fe;
  padding: 4px 10px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.uv-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.uv-code {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.uv-filiere {
  font-size: 10px;
  font-weight: 700;
  color: #6366f1;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.uv-nom {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.3;
}

.uv-ue {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 6px 14px;
  border-radius: 99px;
}

.status-pill svg {
  width: 16px;
  height: 16px;
}

.status-pill.completed {
  color: #059669;
  background: #ecfdf5;
}

.uv-card-footer {
  margin-top: 30px;
}

.action-grid {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  font-weight: 700;
}

.view-btn {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.view-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: translateY(-2px);
}

.edit-btn {
  background: #8b5cf6;
  color: white;
  gap: 10px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.edit-btn.outline {
  background: white;
  color: #8b5cf6;
  border: 2px solid #8b5cf6;
  box-shadow: none;
}

.edit-btn:hover {
  background: #7c3aed;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.25);
}

.action-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.edit-btn:hover svg {
  transform: scale(1.1);
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

.loader {
  width: 45px;
  height: 45px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state-premium {
  text-align: center;
  padding: 100px 40px;
  background: white;
  border-radius: 40px;
  border: 2px dashed #e2e8f0;
}

.empty-illustration {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: #f8fafc;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.empty-illustration svg {
  width: 40px;
  height: 40px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  background: white;
  border-radius: 24px;
  border: 1px dashed #cbd5e1;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
}

.empty-state p {
  color: #64748b;
}
</style>