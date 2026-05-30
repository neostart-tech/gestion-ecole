<template>
  <div class="carte-page">

    <!-- ── TOPBAR ── -->
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
        </div>
        <div>
          <div class="topbar-title">Cartes <em>étudiants</em></div>
          <div class="topbar-sub">Sélectionnez les étudiants et générez leurs cartes recto-verso</div>
        </div>
      </div>
      <div class="topbar-right">
        <span v-if="selectedIds.length > 0" class="sel-count">{{ selectedIds.length }} sélectionné(s)</span>
        <button
          @click="generateCards"
          :disabled="selectedIds.length === 0 || isGenerating"
          class="generate-btn"
        >
          <svg v-if="!isGenerating" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          <svg v-else class="spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ isGenerating ? 'Génération…' : `Générer ${selectedIds.length} carte(s)` }}
        </button>
      </div>
    </div>

    <!-- ── FILTRES ── -->
    <div class="filters-card">
      <div class="filter-grid">
        <div>
          <label class="fl">Recherche</label>
          <div class="search-wrap">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="searchQuery" type="text" class="fi" placeholder="Nom, matricule…"/>
          </div>
        </div>
        <div>
          <label class="fl">Niveau</label>
          <select v-model="filters.niveau" @change="onNiveauChange" class="fs">
            <option :value="null">Tous les niveaux</option>
            <option v-for="n in niveauOptions" :key="n.value" :value="n.value">{{ n.label }}</option>
          </select>
        </div>
        <div>
          <label class="fl">Filière</label>
          <select v-model="filters.filiere" @change="onFiliereChange" :disabled="!filters.niveau" class="fs">
            <option :value="null">Toutes les filières</option>
            <option v-for="f in filiereOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
        </div>
        <div class="filter-last">
          <div class="flex-1">
            <label class="fl">Groupe</label>
            <select v-model="filters.groupe" :disabled="!filters.filiere" class="fs">
              <option :value="null">Tous les groupes</option>
              <option v-for="g in groupeOptions" :key="g.value" :value="g.value">{{ g.label }}</option>
            </select>
          </div>
          <button @click="resetFilters" class="reset-btn" title="Réinitialiser">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── TABLE ── -->
    <div class="table-card">

      <!-- Loading -->
      <div v-if="etudiantStore.isLoading" class="state-center">
        <div class="spinner"></div>
        <p class="state-sub">Chargement des étudiants…</p>
      </div>

      <!-- Vide -->
      <div v-else-if="filteredRows.length === 0" class="state-center">
        <div class="state-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </div>
        <p class="state-title">Aucun étudiant trouvé</p>
        <p class="state-sub">Modifiez vos filtres de recherche.</p>
      </div>

      <!-- Tableau -->
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="th-check">
                <input type="checkbox" @change="toggleAll" :checked="isAllSelected"/>
              </th>
              <th>Étudiant</th>
              <th>Matricule</th>
              <th>Filière / Niveau</th>
              <th>Promotion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="e in paginatedRows" :key="e.id">
              <td class="td-check">
                <input type="checkbox" v-model="selectedIds" :value="e.id"/>
              </td>
              <td>
                <div class="student-row">
                  <div class="avatar">
                    <img v-if="e.image_url" :src="e.image_url" class="avatar-img"/>
                    <span v-else>{{ e.nom_complet?.slice(0, 2).toUpperCase() }}</span>
                  </div>
                  <div>
                    <div class="s-name">{{ e.nom_complet }}</div>
                    <div class="s-email">{{ e.email }}</div>
                  </div>
                </div>
              </td>
              <td><span class="mat-badge">{{ e.matricule }}</span></td>
              <td>
                <div class="filiere-n">{{ e.filiere_nom || '—' }}</div>
                <div class="niveau-n">{{ e.niveau_nom || '—' }}</div>
              </td>
              <td class="td-promo">{{ e.promotion || e.annee_admission || '—' }}</td>
              <td class="td-action">
                <button @click="previewCard(e)" class="preview-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Aperçu
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <span class="pag-info">{{ paginatedRows.length }} sur {{ filteredRows.length }} étudiants</span>
        <div class="pag-btns">
          <button @click="currentPage--" :disabled="currentPage === 1" class="pag-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="pag-label">Page {{ currentPage }} / {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="pag-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── MODAL PRÉVISUALISATION ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="previewModal.show" class="modal-overlay" @click.self="previewModal.show = false">
          <div class="modal-box">

            <!-- Header -->
            <div class="modal-head">
              <div>
                <div class="mh-title">Aperçu de la carte</div>
                <div class="mh-sub">{{ previewModal.etudiant?.nom_complet }}</div>
              </div>
              <div class="mh-right">
                <button @click="downloadSingleCard" :disabled="isGeneratingSingle" class="dl-btn">
                  <svg v-if="!isGeneratingSingle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <svg v-else class="spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"/>
                  </svg>
                  {{ isGeneratingSingle ? 'Génération…' : 'Télécharger PDF' }}
                </button>
                <button @click="previewModal.show = false" class="close-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Tabs -->
            <div class="modal-tabs">
              <button @click="previewTab = 'recto'" class="m-tab" :class="{ active: previewTab === 'recto' }">Recto</button>
              <button @click="previewTab = 'verso'" class="m-tab" :class="{ active: previewTab === 'verso' }">Verso</button>
            </div>

            <!-- Card preview area -->
            <div class="card-area">

              <!-- RECTO -->
              <div v-if="previewTab === 'recto'" class="pr">
                <div class="pr-head">
                  <div class="pr-logo">
                    <img :src="parametreStore.getAppLogo || '/logo/logo_escen.png'" style="width: 100%; height: 100%; object-fit: contain;" />
                  </div>
                  <div>
                    <div class="pr-school">{{ parametreStore.getAppName || 'Établissement' }}</div>
                    <div class="pr-school-sub">Carte d'étudiant</div>
                  </div>
                  <div class="pr-year">{{ previewCardData?.promotion || '2024–2025' }}</div>
                </div>
                <div class="pr-body">
                  <div class="pr-photo">
                    <img v-if="previewModal.etudiant?.image_url" :src="previewModal.etudiant.image_url" class="pr-photo-img"/>
                    <span v-else>{{ previewCardData?.nom_complet?.slice(0, 2).toUpperCase() }}</span>
                  </div>
                  <div class="pr-fields">
                    <div class="pr-field">
                      <span class="pr-lbl">Nom & Prénoms</span>
                      <span class="pr-val up">{{ previewCardData?.nom_complet }}</span>
                    </div>
                    <div class="pr-field">
                      <span class="pr-lbl">Matricule</span>
                      <span class="pr-val mono">{{ previewCardData?.matricule }}</span>
                    </div>
                    <div class="pr-field">
                      <span class="pr-lbl">Filière / Niveau</span>
                      <span class="pr-val">{{ previewCardData?.filiere }} ({{ previewCardData?.niveau }})</span>
                    </div>
                  </div>
                </div>
                <div class="pr-foot">
                  <div class="pr-qr">
                    <img :src="'https://quickchart.io/qr?size=60&text=' + encodeURIComponent(previewCardData?.qr_data || '')" crossorigin="anonymous"/>
                  </div>
                  <div class="pr-validity">Valide pour l'année scolaire {{ previewCardData?.promotion }}</div>
                  <div class="pr-dots">
                    <div class="pr-dot"><div class="pr-dot-inner"></div></div>
                    <div class="pr-dot"><div class="pr-dot-inner"></div></div>
                  </div>
                </div>
              </div>

              <!-- VERSO -->
              <div v-if="previewTab === 'verso'" class="pv">
                <div class="pv-hatch"></div>
                <div class="pv-head">
                  <span class="pv-dot"></span>
                  <span class="pv-title">Conditions d'utilisation</span>
                  <span class="pv-dot"></span>
                </div>
                <div class="pv-sep"></div>
                <div class="pv-body">
                  <ul class="pv-list">
                    <li>Cette carte est strictement personnelle et incessible.</li>
                    <li>Elle doit être présentée lors de tout contrôle administratif ou académique.</li>
                    <li>En cas de perte, l'étudiant doit informer l'administration sans délai.</li>
                    <li>Toute falsification expose son auteur à des sanctions disciplinaires.</li>
                  </ul>
                </div>
                <div class="pv-foot">
                  <div>
                    <div class="pv-sig-lbl">Le Directeur Général</div>
                    <div class="pv-sig-line"></div>
                  </div>
                  <div class="pv-contact">BP 12471 Lomé – Togo<br/>www.iai-togo.tg</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Zone de rendu cachée pour PDF (BANNIR OKLAB, HEX ONLY) -->
    <div 
      id="cards-rendering-zone" 
      v-show="cardsData.length > 0" 
      style="position: fixed; left: 0; top: 0; width: 210mm; background-color: #ffffff; z-index: -500; pointer-events: none; padding: 20mm 0; font-family: sans-serif; opacity: 1;"
    >
      <div v-for="card in cardsData" :key="card.id" style="margin-bottom: 20mm; page-break-after: always; display: flex; flex-direction: column; align-items: center; gap: 40px;">
        
        <!-- CARTE RECTO PDF -->
        <div style="width: 86mm; height: 54mm; border-radius: 10px; overflow: hidden; background-color: #ffffff; border: 1px solid #eee; display: flex; flex-direction: column; position: relative;">
           <!-- Header PDF -->
           <div style="background-color: #26215c; height: 12mm; display: flex; align-items: center; padding: 0 4mm; color: #ffffff;">
             <div style="width: 8mm; height: 8mm; background-color: #1a1640; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 3mm; overflow: hidden;">
               <img 
                 :src="parametreStore.getAppLogo || '/logo/logo_escen.png'" 
                 crossorigin="anonymous" 
                 style="width: 100%; height: 100%; object-fit: contain;" 
                 @error="(e: any) => e.target.closest('.card-container').style.display = 'none'" 
               />
             </div>
             <div style="display: flex; flex-direction: column;">
               <div style="font-size: 8pt; font-weight: 800; text-transform: uppercase;">{{ parametreStore.getAppName || 'Établissement' }}</div>
               <div style="font-size: 6pt; color: #afa9ec; font-weight: 700;">CARTE D'ÉTUDIANT</div>
             </div>
             <div style="margin-left: auto; background-color: #3d3694; font-size: 7pt; padding: 2px 8px; border-radius: 10px;">{{ card.promotion }}</div>
           </div>
           
           <!-- Body PDF -->
           <div style="flex: 1; padding: 3mm 4mm; display: flex; align-items: center; gap: 4mm; background-color: #ffffff;">
             <div style="width: 20mm; height: 25mm; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #eee; flex-shrink: 0;">
               <img 
                 v-if="card.image_url" 
                 :src="card.image_url" 
                 crossorigin="anonymous" 
                 style="width: 100%; height: 100%; object-fit: cover;" 
                 @error="(e: any) => { e.target.parentElement.innerHTML = `<div style='width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:14pt;color:#8a82d4;font-weight:bold;'>${card.nom_complet?.charAt(0)}</div>` }" 
               />
               <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 14pt; color: #8a82d4; font-weight: bold;">{{ card.nom_complet?.charAt(0) }}</div>
             </div>
             <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
               <div style="font-size: 5pt; font-weight: 700; color: #94a3b8;">NOM & PRÉNOMS</div>
               <div style="font-size: 9pt; font-weight: 800; color: #1e1b4b; text-transform: uppercase;">{{ card.nom_complet }}</div>
               <div style="font-size: 5pt; font-weight: 700; color: #94a3b8; margin-top: 2px;">MATRICULE</div>
               <div style="font-size: 9pt; font-weight: 800; color: #534ab7; font-family: monospace;">{{ card.matricule }}</div>
               <div style="font-size: 5pt; font-weight: 700; color: #94a3b8; margin-top: 2px;">FILIÈRE / NIVEAU</div>
               <div style="font-size: 8pt; font-weight: 800; color: #1e1b4b;">{{ card.filiere }} ({{ card.niveau }})</div>
             </div>
           </div>

           <!-- Footer PDF -->
           <div style="height: 10mm; background-color: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; align-items: center; padding: 0 4mm;">
             <div style="width: 8mm; height: 8mm; background-color: #ffffff; padding: 1px; border: 1px solid #e2e8f0; border-radius: 2px; margin-right: 3mm;">
                <img :src="'https://quickchart.io/qr?size=100&text=' + encodeURIComponent(card.qr_data || '')" crossorigin="anonymous" style="width: 100%; height: 100%;" />
             </div>
             <div style="font-size: 6.5pt; color: #94a3b8; font-weight: 800;">VALIDE POUR L'ANNÉE {{ card.promotion }}</div>
             <div style="margin-left: auto; display: flex; gap: 4px;">
               <div style="width: 5px; height: 5px; background-color: #e0e7ff; border-radius: 50%;"></div>
               <div style="width: 5px; height: 5px; background-color: #818cf8; border-radius: 50%;"></div>
             </div>
           </div>
        </div>

        <!-- CARTE VERSO PDF -->
        <div style="width: 86mm; height: 54mm; border-radius: 12px; background-color: #1e1b4b; position: relative; overflow: hidden; display: flex; flex-direction: column;">
          <div style="padding-top: 6mm; text-align: center; color: #afa9ec; font-size: 8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">CONDITIONS D'UTILISATION</div>
          <div style="height: 1px; background-color: #3d3694; margin: 3mm 8mm;"></div>
          <div style="flex: 1; padding: 2mm 10mm;">
            <ul style="list-style: none; padding: 0; margin: 0; color: #ffffff; font-size: 9pt; line-height: 1.6;">
              <li style="margin-bottom: 4mm; padding-left: 4mm; position: relative;"><span style="position: absolute; left: 0; color: #7b6ee8;">•</span>Cette carte est strictement personnelle.</li>
              <li style="margin-bottom: 4mm; padding-left: 4mm; position: relative;"><span style="position: absolute; left: 0; color: #7b6ee8;">•</span>À présenter lors de tout contrôle académique.</li>
              <li style="margin-bottom: 4mm; padding-left: 4mm; position: relative;"><span style="position: absolute; left: 0; color: #7b6ee8;">•</span>Signaler toute perte sans délai.</li>
            </ul>
          </div>
          <div style="padding: 0 10mm 8mm; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="display: flex; flex-direction: column;">
              <div style="color: #afa9ec; font-size: 8.5pt; font-weight: 800;">LE DIRECTEUR GÉNÉRAL</div>
              <div style="width: 20mm; height: 1px; background-color: #3d3694; margin-top: 2px;"></div>
            </div>
            <div style="color: #afa9ec; font-size: 7pt; text-align: right; opacity: 0.7; font-weight: 700;">BP 12471 Lomé – Togo<br/>www.iai-togo.tg</div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useGroupeStore }        from '~~/stores/group'
import { useEtudiantStore }      from '~~/stores/etudiant'
import { useNiveauStore }        from '~~/stores/niveau'
import { useFiliereStore }       from '~~/stores/filiere'
import { useCarteEtudiantStore } from '~~/stores/carte-etudiant'
import { useParametreStore }     from '~~/stores/parametre'

const { $swal }      = useNuxtApp()
const groupeStore    = useGroupeStore()
const niveauStore    = useNiveauStore()
const filiereStore   = useFiliereStore()
const etudiantStore  = useEtudiantStore()
const carteStore     = useCarteEtudiantStore()
const parametreStore = useParametreStore()

const isGenerating       = ref(false)
const isGeneratingSingle = ref(false)
const selectedIds        = ref<number[]>([])
const cardsData          = computed(() => carteStore.cardsData)
const previewCardData    = computed(() => carteStore.previewCardData)

const previewModal = ref({ show: false, etudiant: null as any })
const previewTab   = ref<'recto' | 'verso'>('recto')
const currentPage  = ref(1)
const itemsPerPage = 20
const searchQuery  = ref('')
const filters      = ref({ niveau: null as any, filiere: null as any, groupe: null as any })

// ── Init ──────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    etudiantStore.fetchEtudiants(),
    filiereStore.fetchFilieres(),
    niveauStore.fetchNiveaux(),
    groupeStore.fetchGroupes(),
    parametreStore.fetchParametres(),
  ])
})

// ── Options filtres ───────────────────────────────────────────
const niveauOptions = computed(() =>
  niveauStore.niveaux.map(n => ({ label: n.libelle, value: n.id }))
)

const filiereOptions = computed(() => {
  if (!filters.value.niveau) return []
  const gids = groupeStore.groupes
    .filter(g => g.niveau.id === filters.value.niveau)
    .flatMap(g => g.filieres.map(f => f.id))
  const ids = [...new Set(gids)]
  return filiereStore.filieres.filter(f => ids.includes(f.id)).map(f => ({ label: f.nom, value: f.id }))
})

const groupeOptions = computed(() => {
  if (!filters.value.filiere) return []
  return groupeStore.groupes
    .filter(g =>
      (!filters.value.niveau || g.niveau.id === filters.value.niveau) &&
      g.filieres.some(f => f.id === filters.value.filiere)
    )
    .map(g => ({ label: `${g.nom} (${g.niveau.libelle})`, value: g.id }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

const onNiveauChange  = () => { filters.value.filiere = null; filters.value.groupe = null }
const onFiliereChange = () => { filters.value.groupe = null }
const resetFilters    = () => {
  filters.value = { niveau: null, filiere: null, groupe: null }
  searchQuery.value = ''
  currentPage.value = 1
}

// ── Données filtrées ──────────────────────────────────────────
const filteredRows = computed(() => {
  let list = etudiantStore.etudiants.map(e => ({
    ...e,
    nom_complet: `${e.nom} ${e.prenom}`,
    email:       e.email || 'Non renseigné',
    groupe_id:   e?.dernier_groupe?.group?.id   || null,
    filiere_nom: e?.dernier_groupe?.filiere?.nom || null,
    niveau_nom:  e?.dernier_groupe?.niveau?.nom  || null,
    image_url:   e.photo_url || e.photo          || null,
  }))

  if (filters.value.niveau)
    list = list.filter(e => groupeStore.groupes.find(g => g.id === e.groupe_id)?.niveau.id === filters.value.niveau)
  if (filters.value.filiere)
    list = list.filter(e => groupeStore.groupes.find(g => g.id === e.groupe_id)?.filieres.some(f => f.id === filters.value.filiere))
  if (filters.value.groupe)
    list = list.filter(e => e.groupe_id === filters.value.groupe)

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(e =>
      e.matricule?.toLowerCase().includes(q) ||
      e.nom_complet?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q)
    )
  }
  return list
})

const totalPages    = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage))
const paginatedRows = computed(() =>
  filteredRows.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
)

const isAllSelected = computed(() =>
  filteredRows.value.length > 0 && filteredRows.value.every(e => selectedIds.value.includes(e.id))
)

const toggleAll = () => {
  if (isAllSelected.value) {
    // On retire tout
    selectedIds.value = []
  } else {
    // On ajoute tous les étudiants actuellement filtrés (le groupe entier par exemple)
    selectedIds.value = filteredRows.value.map(e => e.id)
  }
}

// ── Actions ───────────────────────────────────────────────────
const previewCard = (etudiant: any) => {
  // Aperçu instantané sans API
  carteStore.previewCardData = {
    id: etudiant.id,
    nom_complet: etudiant.nom_complet,
    matricule: etudiant.matricule,
    filiere: etudiant.filiere_nom || 'Non définie',
    niveau: etudiant.niveau_nom || 'Non défini',
    promotion: etudiant.dernier_groupe?.group?.promotion?.libelle || '2024–2025',
    qr_data: etudiant.matricule,
    image_url: etudiant.image_url
  }
  previewModal.value.etudiant = etudiant
  previewTab.value = 'recto'
  previewModal.value.show = true
}

const downloadSingleCard = async () => {
  if (!previewModal.value.etudiant) return
  isGeneratingSingle.value = true
  try {
    await carteStore.fetchSelectedData([previewModal.value.etudiant.id])
    await nextTick()
    await new Promise(r => setTimeout(r, 2500))
    const html2pdf = (await import('html2pdf.js')).default
    const element = document.getElementById('cards-rendering-zone')
    console.log('[PDF-DEBUG] Elément trouvé:', !!element, 'Contenu:', element?.innerHTML?.slice(0, 100))
    
    await html2pdf().from(element).set({
      margin: 10,
      filename: `carte_${previewModal.value.etudiant.matricule}.pdf`,
      html2canvas: { scale: 2, useCORS: true, logging: true, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save()
    previewModal.value.show = false
  } catch (e: any) {
    $swal.fire('Erreur', e.message, 'error')
  } finally {
    isGeneratingSingle.value = false
  }
}

const generateCards = async () => {
  if (selectedIds.value.length === 0) return
  isGenerating.value = true
  try {
    await carteStore.fetchSelectedData(selectedIds.value)
    await nextTick()
    await new Promise(r => setTimeout(r, 3000))
    const html2pdf = (await import('html2pdf.js')).default
    const element = document.getElementById('cards-rendering-zone')
    console.log('[PDF-DEBUG] Génération de masse, élément:', !!element)

    await html2pdf().from(element).set({
      margin: 10,
      filename: `cartes_etudiants_${Date.now()}.pdf`,
      html2canvas: { scale: 2, useCORS: true, logging: true, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save()
    $swal.fire('Succès', 'Cartes générées avec succès !', 'success')
  } catch (e: any) {
    $swal.fire('Erreur', e.message, 'error')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
/* ── VARIABLES ── */
.carte-page {
  --p: #7F22FE;
  --p-d: #6518d4;
  --p-dd: #4a0fa0;
  --p-l: #f3ebff;
  --p-mid: #c89afd;
  --p-soft: #e8d5ff;
  --ink: #160a2e;
  --ink-2: #3d2a6b;
  --ink-3: #8070a8;
  --ink-4: #b8aed0;
  --surface: #fff;
  --surface-2: #faf8ff;
  --surface-3: #f3ebff;
  --border: rgba(127,34,254,.10);
  --border-2: rgba(127,34,254,.20);
  --rose: #e11d48;
  --rose-l: #fff1f2;
  --font-d: 'Playfair Display', Georgia, serif;
  --font-b: 'DM Sans', system-ui, sans-serif;
  --sh: 0 1px 3px rgba(127,34,254,.07), 0 4px 18px rgba(127,34,254,.09);
  font-family: var(--font-b);
  background: var(--surface-2);
  color: var(--ink);
  font-size: 14px;
  line-height: 1.6;
  padding: 20px 22px 48px;
}

/* ── TOPBAR ── */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 18px; padding: 16px 20px; margin-bottom: 18px;
  box-shadow: var(--sh); gap: 12px; flex-wrap: wrap;
}
.topbar-left  { display: flex; align-items: center; gap: 12px; }
.topbar-right { display: flex; align-items: center; gap: 10px; }
.topbar-icon  {
  width: 38px; height: 38px; border-radius: 11px;
  background: var(--p); display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: 0 3px 10px rgba(127,34,254,.3);
}
.topbar-icon svg { width: 17px; height: 17px; color: #fff; }
.topbar-title { font-family: var(--font-d); font-size: 18px; font-weight: 700; color: var(--ink); line-height: 1.1; }
.topbar-title em { font-style: italic; color: var(--p); }
.topbar-sub { font-size: 10px; color: var(--ink-3); margin-top: 2px; }

.sel-count {
  font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  background: var(--p-l); color: var(--p);
  padding: 3px 10px; border-radius: 99px; border: 1px solid var(--p-soft);
}
.generate-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 18px; background: var(--p); color: #fff; border: none;
  border-radius: 10px; font-family: var(--font-b);
  font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
  cursor: pointer; box-shadow: 0 3px 14px rgba(127,34,254,.3);
  transition: background .15s, transform .1s;
}
.generate-btn:hover { background: var(--p-d); transform: translateY(-1px); }
.generate-btn:disabled { opacity: .35; cursor: not-allowed; transform: none; }
.generate-btn svg { width: 14px; height: 14px; }

/* ── FILTRES ── */
.filters-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 16px 18px; margin-bottom: 16px; box-shadow: var(--sh);
}
.filter-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 12px; align-items: end;
}
.filter-last { display: flex; gap: 8px; align-items: flex-end; }

.fl { display: block; font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 5px; }
.fi, .fs {
  width: 100%; padding: 9px 12px;
  border: 1.5px solid rgba(127,34,254,.12); border-radius: 10px;
  background: var(--surface); font-family: var(--font-b);
  font-size: 13px; font-weight: 500; color: var(--ink);
  outline: none; transition: border-color .15s, box-shadow .15s;
  -webkit-appearance: none;
}
.fi:focus, .fs:focus { border-color: var(--p); box-shadow: 0 0 0 3px rgba(127,34,254,.09); }
.fi::placeholder { color: var(--ink-4); font-weight: 400; }

.search-wrap { position: relative; }
.search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); width: 13px; height: 13px; color: var(--ink-4); pointer-events: none; }
.search-wrap .fi { padding-left: 32px; }

.reset-btn {
  width: 36px; height: 36px; border-radius: 10px;
  border: 1.5px solid rgba(127,34,254,.12); background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink-3); transition: .15s;
}
.reset-btn:hover { border-color: rgba(225,29,72,.2); background: var(--rose-l); color: var(--rose); }
.reset-btn svg { width: 12px; height: 12px; }

/* ── TABLE ── */
.table-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; box-shadow: var(--sh); overflow: hidden;
}
.table-wrap { overflow-x: auto; }
table { width: 100%; text-align: left; border-collapse: collapse; font-size: 13px; }
thead tr { background: var(--surface-2); border-bottom: 1px solid var(--border); }
thead th {
  padding: 10px 14px; font-size: 9px; font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase; color: var(--ink-3); white-space: nowrap;
}
.th-check { width: 44px; text-align: center !important; }
tbody tr { border-bottom: 1px solid rgba(127,34,254,.05); transition: background .12s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--surface-3); }
td { padding: 11px 14px; color: var(--ink-2); vertical-align: middle; }
.td-check, .td-action { text-align: center; }
.td-promo { font-size: 12px; color: var(--ink-3); }

input[type="checkbox"] {
  width: 15px; height: 15px; border-radius: 4px;
  border: 1.5px solid rgba(127,34,254,.2); accent-color: var(--p); cursor: pointer;
}

.student-row { display: flex; align-items: center; gap: 9px; }
.avatar {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--p-l); border: 1px solid var(--p-soft);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: var(--p);
  flex-shrink: 0; overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.s-name  { font-size: 13px; font-weight: 600; color: var(--ink); }
.s-email { font-size: 10px; color: var(--ink-4); }

.mat-badge {
  font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700;
  background: var(--surface-2); border: 1px solid var(--border-2);
  color: var(--ink-3); padding: 2px 8px; border-radius: 6px; letter-spacing: .04em; white-space: nowrap;
}
.filiere-n { font-size: 12px; font-weight: 600; color: var(--ink); }
.niveau-n  { font-size: 10px; color: var(--ink-4); }

.preview-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: .06em;
  padding: 5px 11px; border-radius: 8px;
  background: var(--p-l); color: var(--p);
  border: 1px solid var(--p-soft); cursor: pointer; transition: .15s;
  font-family: var(--font-b);
}
.preview-btn:hover { background: var(--p-soft); }
.preview-btn svg { width: 12px; height: 12px; }

/* ── PAGINATION ── */
.pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; border-top: 1px solid var(--border); background: var(--surface-2);
}
.pag-info  { font-size: 10px; color: var(--ink-4); }
.pag-btns  { display: flex; align-items: center; gap: 4px; }
.pag-label { font-size: 11px; color: var(--ink-3); padding: 0 10px; }
.pag-btn {
  width: 28px; height: 28px; border-radius: 7px;
  border: 1px solid var(--border-2); background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink-3); transition: .12s;
}
.pag-btn:hover { background: var(--surface-3); color: var(--p); }
.pag-btn:disabled { opacity: .3; cursor: default; }
.pag-btn svg { width: 13px; height: 13px; }

/* ── STATES ── */
.state-center { padding: 56px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.state-icon { width: 44px; height: 44px; border-radius: 13px; background: var(--p-l); display: flex; align-items: center; justify-content: center; }
.state-icon svg { width: 20px; height: 20px; color: var(--p); }
.state-title { font-size: 14px; font-weight: 700; color: var(--ink); }
.state-sub   { font-size: 11px; color: var(--ink-3); }
.spinner { width: 34px; height: 34px; border: 3px solid var(--p-l); border-top-color: var(--p); border-radius: 50%; animation: spin 1s linear infinite; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  background: rgba(22,10,46,.78); backdrop-filter: blur(7px);
}
.modal-box {
  background: #ffffff; border-radius: 22px; width: 100%; max-width: 640px;
  box-shadow: 0 24px 64px rgba(127,34,254,.22), 0 6px 18px rgba(0,0,0,.18);
  overflow: hidden;
}
.modal-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 18px 20px 16px; border-bottom: 1px solid rgba(127,34,254,0.1);
  background: #ffffff;
}
.mh-title { font-size: 13px; font-weight: 700; color: #160a2e; }
.mh-sub   { font-size: 10px; color: #8070a8; margin-top: 2px; }
.mh-right { display: flex; align-items: center; gap: 8px; }

.dl-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; background: #7F22FE; color: #fff; border: none; border-radius: 9px;
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  cursor: pointer; box-shadow: 0 2px 10px rgba(127,34,254,.25); transition: .15s;
}
.dl-btn:hover { background: #6518d4; }
.dl-btn svg { width: 13px; height: 13px; }

.close-btn {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid rgba(127,34,254,0.2); background: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #8070a8; transition: .12s;
}
.close-btn:hover { background: #fff1f2; color: #e11d48; border-color: rgba(225,29,72,.2); }
.close-btn svg { width: 13px; height: 13px; }

.modal-tabs { display: flex; border-bottom: 1px solid rgba(127,34,254,0.1); background: #ffffff; }
.m-tab {
  flex: 1; padding: 10px; border: none; background: none;
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  color: #b8aed0; cursor: pointer; border-bottom: 2px solid transparent; transition: .15s;
}
.m-tab:hover { color: #3d2a6b; }
.m-tab.active { color: #7F22FE; border-bottom-color: #7F22FE; }

.card-area {
  background: #faf8ff; padding: 28px 20px;
  display: flex; align-items: center; justify-content: center; min-height: 220px;
}

/* ════════════════════════
   RECTO APERÇU
════════════════════════ */
.pr {
  width: 380px; height: 238px; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column; background: #fff; position: relative;
  box-shadow: 0 8px 30px rgba(127,34,254,.18), 0 2px 6px rgba(0,0,0,.07);
}
.pr::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(180deg, #a855f7 0%, var(--p) 50%, var(--p-dd) 100%); z-index: 3;
}
.pr::after {
  content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 45%; opacity: .025;
  background-image: radial-gradient(circle, var(--p) 1px, transparent 1px);
  background-size: 11px 11px; pointer-events: none; z-index: 0;
}
.pr-head {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 13px 9px 17px;
  background: linear-gradient(108deg, #160a2e 0%, #2d1260 100%);
  position: relative; overflow: hidden; z-index: 2; flex-shrink: 0;
}
.pr-logo { width: 28px; height: 28px; border-radius: 7px; background: rgba(127,34,254,.2); border: 1px solid rgba(127,34,254,.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; z-index: 1; }
.pr-school     { font-size: 11px; font-weight: 600; color: #ede8ff; letter-spacing: .3px; position: relative; z-index: 1; }
.pr-school-sub { font-size: 7px; color: #9d7fce; text-transform: uppercase; letter-spacing: 1.1px; margin-top: 2px; position: relative; z-index: 1; }
.pr-year       { margin-left: auto; background: rgba(127,34,254,.18); border: 1px solid rgba(127,34,254,.3); color: #d4b8ff; font-size: 8px; font-weight: 500; padding: 2px 9px; border-radius: 20px; letter-spacing: .4px; white-space: nowrap; position: relative; z-index: 1; }

.pr-body { display: flex; gap: 11px; padding: 11px 13px 9px 17px; flex: 1; position: relative; z-index: 1; }
.pr-photo {
  width: 62px; height: 74px; border-radius: 7px; overflow: hidden; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(127,34,254,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; color: var(--p);
  background: linear-gradient(135deg, var(--p-l), var(--p-soft));
}
.pr-photo-img { width: 100%; height: 100%; object-fit: cover; }
.pr-fields  { display: flex; flex-direction: column; gap: 10px; min-width: 0; flex: 1; }
.pr-field   { display: flex; flex-direction: column; }
.pr-lbl     { font-size: 7px; font-weight: 600; color: #8c7ab0; text-transform: uppercase; letter-spacing: .8px; }
.pr-val     { font-size: 10.5px; font-weight: 500; color: #160a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
.pr-val.up  { text-transform: uppercase; font-weight: 600; }
.pr-val.mono { font-family: ui-monospace, monospace !important; color: var(--p) !important; font-weight: 700 !important; font-size: 11px !important; letter-spacing: .4px; }

.pr-foot {
  display: flex; align-items: center; gap: 9px;
  padding: 6px 13px 7px 17px; border-top: 1px solid #ede8ff;
  background: linear-gradient(90deg, #faf8ff, #fdfcff);
  flex-shrink: 0; position: relative; z-index: 2;
}
.pr-qr { width: 30px; height: 30px; border-radius: 6px; overflow: hidden; background: #fff; border: 1px solid #ddd5f7; flex-shrink: 0; }
.pr-qr img { width: 100%; height: 100%; }
.pr-validity { font-size: 7px; color: #8c7ab0; text-transform: uppercase; letter-spacing: .5px; line-height: 1.4; }
.pr-dots { margin-left: auto; display: flex; gap: 3px; }
.pr-dot  { width: 8px; height: 8px; border-radius: 50%; background: var(--p-l); border: 1px solid var(--p-soft); display: flex; align-items: center; justify-content: center; }
.pr-dot-inner { width: 3.5px; height: 3.5px; border-radius: 50%; background: var(--p); }

/* ════════════════════════
   VERSO APERÇU
════════════════════════ */
.pv {
  width: 380px; height: 238px; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column;
  background: linear-gradient(140deg, #160a2e 0%, #220d45 55%, #2d1260 100%);
  position: relative;
  box-shadow: 0 8px 30px rgba(127,34,254,.35), 0 2px 6px rgba(0,0,0,.2);
}
.pv-hatch {
  position: absolute; inset: 0; opacity: .055; pointer-events: none; z-index: 0;
  background-image:
    repeating-linear-gradient(45deg,  #3d3694 0, #3d3694 .5px, transparent 0, transparent 50%),
    repeating-linear-gradient(-45deg, #3d3694 0, #3d3694 .5px, transparent 0, transparent 50%);
  background-size: 18px 18px;
}
.pv-head  { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 12px 16px 8px; position: relative; z-index: 2; }
.pv-dot   { width: 5px; height: 5px; border-radius: 50%; background: #7F22FE; }
.pv-title { font-size: 8px; font-weight: 600; color: #afa9ec; text-transform: uppercase; letter-spacing: 1.4px; }
.pv-sep   { height: 1px; background: linear-gradient(90deg, transparent, rgba(127,34,254,0.4), transparent); margin: 0 18px 7px; position: relative; z-index: 2; }
.pv-body  { flex: 1; padding: 7px 18px 5px; position: relative; z-index: 2; }
.pv-list  { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.pv-list li { font-size: 10px; color: #ffffff; padding-left: 15px; position: relative; line-height: 1.5; }
.pv-list li::before { content: ''; position: absolute; left: 0; top: 5px; width: 5px; height: 5px; border-radius: 50%; background: #7F22FE; }
.pv-foot { display: flex; align-items: flex-end; justify-content: space-between; padding: 7px 18px 10px; border-top: 1px solid rgba(127,34,254,0.12); position: relative; z-index: 2; }
.pv-sig-lbl  { font-size: 7px; color: #afa9ec; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.pv-sig-line { width: 40px; height: 1px; background: #3d3694; }
.pv-contact  { font-size: 7.5px; color: #afa9ec; text-align: right; line-height: 1.7; opacity: 0.7; }

/* ════════════════════════
   PDF ZONE CACHÉE (HEX ONLY)
════════════════════════ */
.card-container { display: flex; flex-wrap: wrap; gap: 10mm; justify-content: center; padding: 10mm; background-color: #ffffff; }
.page-break     { page-break-after: always; }
</style>