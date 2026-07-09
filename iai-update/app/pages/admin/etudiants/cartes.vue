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
            <select v-model="filters.groupe" :disabled="!filters.filiere" @change="onGroupeChange" class="fs">
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

    <!-- ── COULEURS ── -->
    <div class="color-panel">
      <button @click="showColorPanel = !showColorPanel" class="cp-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
        <span class="cp-label">Couleurs de la carte</span>
        <span class="cp-swatches">
          <span class="cp-swatch" :style="{ background: cardColors.primary }"></span>
          <span class="cp-swatch" :style="{ background: cardColors.dark }"></span>
        </span>
        <svg class="cp-chevron" :class="{ open: showColorPanel }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
      </button>

      <div v-if="showColorPanel" class="cp-body">
        <div class="cp-row">

          <!-- Groupe des deux sélecteurs -->
          <div class="cp-group">
            <div class="cp-field">
              <span class="cp-lbl">Couleur principale</span>
              <div class="cp-pick">
                <input type="color" v-model="cardColors.primary" class="cp-input"/>
                <span class="cp-hex">{{ cardColors.primary.toUpperCase() }}</span>
              </div>
            </div>
            <div class="cp-sep-v"></div>
            <div class="cp-field">
              <span class="cp-lbl">Couleur sombre</span>
              <div class="cp-pick">
                <input type="color" v-model="cardColors.dark" class="cp-input"/>
                <span class="cp-hex">{{ cardColors.dark.toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <!-- Mini carte aperçu -->
          <div class="cp-card-thumb">
            <div class="cp-thumb-inner">
              <div class="cp-thumb-stripe" :style="{ background: `linear-gradient(180deg, ${P.pL} 0%, ${P.p} 100%)` }"></div>
              <div class="cp-thumb-head" :style="{ background: `linear-gradient(108deg, ${P.d} 0%, ${P.dM} 100%)` }">
                <div class="cp-thumb-logo" :style="{ background: P.dM, border: `1px solid ${P.p}` }"></div>
                <div class="cp-thumb-title" :style="{ color: P.tOnDark }">Établissement</div>
                <div class="cp-thumb-badge" :style="{ background: P.dBadge, border: `1px solid ${P.p}`, color: P.dBadgeText }">2025</div>
              </div>
              <div class="cp-thumb-body">
                <div class="cp-thumb-photo" :style="{ background: `linear-gradient(135deg, ${P.pPale}, ${P.pPale2})`, color: P.p }">E</div>
                <div class="cp-thumb-info">
                  <div class="cp-thumb-name" :style="{ color: P.d }">ÉTUDIANT TEST</div>
                  <div class="cp-thumb-mat" :style="{ color: P.p }">MAT-2024-001</div>
                </div>
              </div>
              <div class="cp-thumb-foot" :style="{ borderTop: `1px solid ${P.pPale3}`, background: P.pPale }">
                <div class="cp-thumb-qr" :style="{ border: `1px solid ${P.pPale4}` }"></div>
                <div class="cp-thumb-bar" :style="{ background: P.pPale2 }"></div>
                <div class="cp-thumb-dots">
                  <span :style="{ background: P.pPale2, border: `1px solid ${P.pPale4}` }"></span>
                  <span :style="{ background: P.pPale2, border: `1px solid ${P.pPale4}` }"></span>
                </div>
              </div>
            </div>
            <span class="cp-thumb-label">Aperçu</span>
          </div>

          <button @click="resetColors" class="cp-reset-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Réinitialiser
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
        <div
          v-if="previewModal.show"
          class="modal-overlay"
          @click.self="previewModal.show = false"
          :style="{
            '--p': P.p, '--p-d': P.dBadgeBorder, '--p-dd': P.pD,
            '--p-l': P.pPale, '--p-mid': P.pL, '--p-soft': P.pPale2,
            '--ink': '#160a2e', '--ink-2': '#3d2a6b', '--ink-3': '#8070a8', '--ink-4': '#b8aed0',
            '--border': P.p18, '--border-2': P.p20, '--p30': P.p30, '--p35': P.p35,
            '--cd': P.d, '--cdm': P.dM, '--cdl': P.dL, '--cdb': P.dBorder,
          }"
        >
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
                  <div class="pv-contact">BP 12471 Lomé – Togo</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- Zone de rendu cachée pour PDF — CSS vars propagées depuis P computed -->
    <div
      id="cards-rendering-zone"
      v-show="cardsData.length > 0"
      :style="{
        '--cp':  P.p,  '--cpd': P.pD,  '--cpl': P.pL,
        '--cppale': P.pPale, '--cppale2': P.pPale2, '--cppale3': P.pPale3, '--cppale4': P.pPale4,
        '--cm': P.pMuted, '--tod': P.tOnDark, '--todm': P.tMuted,
        '--cd': P.d, '--cdm': P.dM, '--cdl': P.dL,
        '--cdb': P.dBorder, '--cdbadge': P.dBadge,
        '--cdbadgeb': P.dBadgeBorder, '--cdbadget': P.dBadgeText,
        '--p18': P.p18, '--p20': P.p20, '--p30': P.p30,
        position: 'fixed', left: '-9999px', top: '0',
        width: '440px', backgroundColor: '#ffffff', zIndex: '1',
        pointerEvents: 'none', padding: '24px',
        fontFamily: `'DM Sans', system-ui, sans-serif`,
      }"
    >
      <div v-for="card in cardsData" :key="card.id" style="margin-bottom: 24px; display: flex; flex-direction: column; align-items: center; gap: 20px; page-break-after: always;">

        <!-- RECTO -->
        <div style="width: 380px; height: auto; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; background: #ffffff; position: relative; box-shadow: 0 8px 30px var(--p18), 0 2px 6px rgba(0,0,0,.07);">
          <!-- Stripe gauche -->
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--cpl) 0%, var(--cp) 50%, var(--cpd) 100%); z-index: 3;"></div>

          <!-- Header -->
          <div style="display: flex; align-items: center; gap: 9px; padding: 10px 13px 10px 17px; background: linear-gradient(108deg, var(--cd) 0%, var(--cdm) 100%); position: relative; overflow: hidden; z-index: 2; flex-shrink: 0; min-height: 52px;">
            <div style="width: 28px; height: 28px; border-radius: 7px; background: var(--cdm); border: 1px solid var(--cdbadgeb); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
              <img :src="parametreStore.getAppLogo || '/logo/logo_escen.png'" crossorigin="anonymous" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div style="display: flex; flex-direction: column; flex: 1; min-width: 0; padding-right: 80px;">
              <div style="font-size: 11px; font-weight: 600; color: var(--tod); letter-spacing: .3px;">{{ parametreStore.getAppName || 'Établissement' }}</div>
              <div style="font-size: 7px; color: var(--todm); text-transform: uppercase; letter-spacing: 1.1px; margin-top: 2px;">Carte d'étudiant</div>
            </div>
            <div style="position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: var(--cdbadge); border: 1px solid var(--cp); color: var(--cdbadget); font-size: 8px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: .4px; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; line-height: 1;">{{ card.promotion }}</div>
          </div>

          <!-- Body -->
          <div style="display: flex; gap: 11px; padding: 12px 13px 12px 17px; flex-shrink: 0; position: relative; z-index: 1;">
            <div style="width: 62px; height: 85px; border-radius: 7px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: var(--cp); background: linear-gradient(135deg, var(--cppale), var(--cppale2));">
              <img v-if="card.image_url" :src="card.image_url" crossorigin="anonymous" style="width: 100%; height: 100%; object-fit: cover;" />
              <span v-else style="font-size: 22px; font-weight: 800; color: var(--cp);">{{ card.nom_complet?.charAt(0) }}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1;">
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 7px; font-weight: 600; color: var(--cm); text-transform: uppercase; letter-spacing: .8px;">Nom & Prénoms</span>
                <span style="font-size: 10.5px; font-weight: 600; color: var(--cd); text-transform: uppercase; line-height: 1.3;">{{ card.nom_complet }}</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 7px; font-weight: 600; color: var(--cm); text-transform: uppercase; letter-spacing: .8px;">Matricule</span>
                <span style="font-size: 11px; font-weight: 700; color: var(--cp); font-family: monospace; letter-spacing: .4px; line-height: 1.3;">{{ card.matricule }}</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 7px; font-weight: 600; color: var(--cm); text-transform: uppercase; letter-spacing: .8px;">Filière / Niveau</span>
                <span style="font-size: 10.5px; font-weight: 500; color: var(--cd); line-height: 1.3; white-space: normal; word-break: break-word;">{{ card.filiere }} ({{ card.niveau }})</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="display: flex; align-items: center; gap: 9px; padding: 6px 13px 7px 17px; border-top: 1px solid var(--cppale3); background: linear-gradient(90deg, var(--cppale), #fdfcff); flex-shrink: 0; position: relative; z-index: 2;">
            <div style="width: 30px; height: 30px; border-radius: 6px; overflow: hidden; background: #fff; border: 1px solid var(--cppale4); flex-shrink: 0;">
              <img :src="'https://quickchart.io/qr?size=60&text=' + encodeURIComponent(card.qr_data || '')" crossorigin="anonymous" style="width: 100%; height: 100%;" />
            </div>
            <div style="font-size: 7px; color: var(--cm); text-transform: uppercase; letter-spacing: .5px; line-height: 1.4;">Valide pour l'année scolaire {{ card.promotion }}</div>
            <div style="margin-left: auto; display: flex; gap: 3px; flex-shrink: 0;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--cppale); border: 1px solid var(--cppale2); display: flex; align-items: center; justify-content: center;">
                <div style="width: 3.5px; height: 3.5px; border-radius: 50%; background: var(--cp);"></div>
              </div>
              <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--cppale); border: 1px solid var(--cppale2); display: flex; align-items: center; justify-content: center;">
                <div style="width: 3.5px; height: 3.5px; border-radius: 50%; background: var(--cp);"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- VERSO -->
        <div style="width: 380px; height: 238px; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; background: linear-gradient(140deg, var(--cd) 0%, var(--cdl) 55%, var(--cdm) 100%); position: relative;">
          <svg style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.08; z-index: 0; pointer-events: none;" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" :stroke="P.p" stroke-width="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hatch)"/>
          </svg>

          <!-- Head -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 7px; padding: 14px 16px 10px; position: relative; z-index: 2; flex-shrink: 0;">
            <span style="width: 5px; height: 5px; border-radius: 50%; background: var(--cp); display: inline-block; flex-shrink: 0;"></span>
            <span style="font-size: 8px; font-weight: 600; color: var(--todm); text-transform: uppercase; letter-spacing: 1.4px;">Conditions d'utilisation</span>
            <span style="width: 5px; height: 5px; border-radius: 50%; background: var(--cp); display: inline-block; flex-shrink: 0;"></span>
          </div>

          <!-- Separator -->
          <div style="height: 1px; background: var(--cdb); margin: 0 18px 6px; position: relative; z-index: 2; flex-shrink: 0;"></div>

          <!-- Body -->
          <div style="flex: 1; padding: 8px 18px 5px; position: relative; z-index: 2; overflow: hidden;">
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px;">
              <li style="font-size: 9.5px; color: #ffffff; padding-left: 14px; position: relative; line-height: 1.45;"><span style="position: absolute; left: 0; top: 4px; width: 5px; height: 5px; border-radius: 50%; background: var(--cp); display: inline-block;"></span>Cette carte est strictement personnelle et incessible.</li>
              <li style="font-size: 9.5px; color: #ffffff; padding-left: 14px; position: relative; line-height: 1.45;"><span style="position: absolute; left: 0; top: 4px; width: 5px; height: 5px; border-radius: 50%; background: var(--cp); display: inline-block;"></span>Elle doit être présentée lors de tout contrôle administratif ou académique.</li>
              <li style="font-size: 9.5px; color: #ffffff; padding-left: 14px; position: relative; line-height: 1.45;"><span style="position: absolute; left: 0; top: 4px; width: 5px; height: 5px; border-radius: 50%; background: var(--cp); display: inline-block;"></span>En cas de perte, l'étudiant doit informer l'administration sans délai.</li>
              <li style="font-size: 9.5px; color: #ffffff; padding-left: 14px; position: relative; line-height: 1.45;"><span style="position: absolute; left: 0; top: 4px; width: 5px; height: 5px; border-radius: 50%; background: var(--cp); display: inline-block;"></span>Toute falsification expose son auteur à des sanctions disciplinaires.</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 18px 10px; border-top: 1px solid var(--p20); position: relative; z-index: 2; flex-shrink: 0;">
            <div>
              <div style="font-size: 7px; color: var(--todm); text-transform: uppercase; letter-spacing: .6px; margin-bottom: 5px;">Le Directeur Général</div>
              <div style="width: 40px; height: 1px; background: var(--cdb);"></div>
            </div>
            <div style="font-size: 7.5px; color: var(--todm); text-align: right; opacity: 0.8;">BP 12471 Lomé – Togo</div>
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

// ── Couleurs personnalisables de la carte ─────────────────────
const hexToRgb = (hex: string) => ({ r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) })
const toHex    = (r: number, g: number, b: number) =>
  '#' + [r,g,b].map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')
const lighten  = (hex: string, t: number) => { const {r,g,b}=hexToRgb(hex); return toHex(r+(255-r)*t, g+(255-g)*t, b+(255-b)*t) }
const darken   = (hex: string, t: number) => { const {r,g,b}=hexToRgb(hex); return toHex(r*(1-t), g*(1-t), b*(1-t)) }
const mixHex   = (h1: string, h2: string, w: number) => { const c1=hexToRgb(h1),c2=hexToRgb(h2); return toHex(c1.r*w+c2.r*(1-w), c1.g*w+c2.g*(1-w), c1.b*w+c2.b*(1-w)) }

const cardColors     = ref({ primary: '#7F22FE', dark: '#160a2e' })
const showColorPanel = ref(false)
const resetColors    = () => { cardColors.value = { primary: '#7F22FE', dark: '#160a2e' } }

const P = computed(() => {
  const p = cardColors.value.primary, d = cardColors.value.dark
  const {r,g,b} = hexToRgb(p)
  return {
    p,
    pD:    darken(p, .35),
    pL:    lighten(p, .25),
    pPale:  lighten(p, .88),
    pPale2: lighten(p, .76),
    pPale3: lighten(p, .93),
    pPale4: lighten(p, .83),
    pMuted: lighten(darken(p, .15), .38),
    tOnDark: lighten(p, .88),
    tMuted:  lighten(p, .55),
    d,
    dM: mixHex(d, p, .75),
    dL: mixHex(d, p, .87),
    dBorder: mixHex(p, d, .5),
    dBadge:  mixHex(d, p, .62),
    dBadgeBorder: darken(p, .14),
    dBadgeText:   lighten(p, .72),
    p18: `rgba(${r},${g},${b},.18)`,
    p20: `rgba(${r},${g},${b},.20)`,
    p30: `rgba(${r},${g},${b},.30)`,
    p35: `rgba(${r},${g},${b},.35)`,
  }
})

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

const onNiveauChange  = () => { filters.value.filiere = null; filters.value.groupe = null; selectedIds.value = [] }
const onFiliereChange = () => { filters.value.groupe = null; selectedIds.value = [] }
const resetFilters    = () => {
  filters.value = { niveau: null, filiere: null, groupe: null }
  searchQuery.value = ''
  currentPage.value = 1
  selectedIds.value = []
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
    selectedIds.value = []
  } else {
    selectedIds.value = filteredRows.value.map(e => e.id)
  }
}

// Auto-sélectionne tous les étudiants du groupe quand on choisit un groupe dans le filtre
const onGroupeChange = async () => {
  await nextTick()
  selectedIds.value = filters.value.groupe ? filteredRows.value.map((e: any) => e.id) : []
}

// ── Helpers PDF ───────────────────────────────────────────────
// Remplace les URLs externes par le proxy Nuxt (même origine → pas de CORS pour html2canvas)
const proxyImgSrc = (src: string) =>
  src && !src.startsWith('data:') && !src.startsWith(window.location.origin)
    ? `/api/proxy-image?url=${encodeURIComponent(src)}`
    : src

const buildHtmlForPDF = (element: HTMLElement | null): string => {
  if (!element) return ''
  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('img').forEach((img: HTMLImageElement) => {
    if (img.src) img.src = proxyImgSrc(img.src)
  })
  return `<div style="width:210mm;background:#fff;padding:20mm 0;font-family:sans-serif;">${clone.innerHTML}</div>`
}

// ── Actions ───────────────────────────────────────────────────
const previewCard = (etudiant: any) => {
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

// Capture un élément avec html2canvas.
// Clone l'élément dans un conteneur temporaire positionné à 0,0 (visible pour html2canvas)
// car html2canvas ne peut pas capturer des éléments hors viewport (left: -9999px).
const captureElement = async (el: HTMLElement): Promise<string> => {
  const html2canvas = (await import('html2canvas')).default

  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'position:fixed;left:0;top:0;z-index:9999;pointer-events:none;background:#fff;overflow:hidden;'
  // Propager les variables CSS de la zone de rendu vers le wrapper temporaire
  const zone = document.getElementById('cards-rendering-zone')
  if (zone) {
    Array.from(zone.style).filter((p: string) => p.startsWith('--')).forEach((p: string) => {
      wrapper.style.setProperty(p, zone.style.getPropertyValue(p))
    })
  }
  const clone = el.cloneNode(true) as HTMLElement
  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  // Proxifier les images cross-origin dans le clone
  const imgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[]
  imgs.forEach(img => { if (img.src) img.src = proxyImgSrc(img.src) })

  // Attendre que toutes les images soient chargées
  await Promise.all(imgs.map(img => new Promise<void>(res => {
    if (img.complete && img.naturalHeight > 0) { res(); return }
    img.onload = () => res()
    img.onerror = () => res()
  })))

  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  document.body.removeChild(wrapper)
  return canvas.toDataURL('image/jpeg', 0.92)
}

const downloadSingleCard = async () => {
  if (!previewModal.value.etudiant) return
  isGeneratingSingle.value = true
  try {
    await carteStore.fetchSelectedData([previewModal.value.etudiant.id])
    await nextTick()
    await new Promise(r => setTimeout(r, 600))

    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const zone = document.getElementById('cards-rendering-zone')
    const pair = zone?.children[0] as HTMLElement | undefined
    if (!pair) throw new Error('Carte introuvable')

    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgData = await captureElement(pair)
    const img = new Image()
    img.src = imgData
    await new Promise(r => { img.onload = r })
    const pdfH = Math.min(pageH, (img.naturalHeight / img.naturalWidth) * pageW)
    pdf.addImage(imgData, 'JPEG', 0, (pageH - pdfH) / 2, pageW, pdfH)
    pdf.save(`carte_${previewModal.value.etudiant.matricule}.pdf`)
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
    await new Promise(r => setTimeout(r, 800))

    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()

    const zone = document.getElementById('cards-rendering-zone')
    if (!zone) throw new Error('Zone de rendu introuvable')
    const cardPairs = Array.from(zone.children) as HTMLElement[]
    if (cardPairs.length === 0) throw new Error('Aucune carte à générer')

    for (let i = 0; i < cardPairs.length; i++) {
      if (i > 0) pdf.addPage()
      const imgData = await captureElement(cardPairs[i])
      const img = new Image()
      img.src = imgData
      await new Promise(r => { img.onload = r })
      const pdfH = Math.min(pageH, (img.naturalHeight / img.naturalWidth) * pageW)
      pdf.addImage(imgData, 'JPEG', 0, (pageH - pdfH) / 2, pageW, pdfH)
    }

    pdf.save(`cartes_etudiants_${Date.now()}.pdf`)
    $swal.fire('Succès', `${cardPairs.length} carte(s) générée(s) !`, 'success')
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
  --p:      v-bind('P.p');
  --p-d:    v-bind('P.dBadgeBorder');
  --p-dd:   v-bind('P.pD');
  --p-l:    v-bind('P.pPale');
  --p-mid:  v-bind('P.pL');
  --p-soft: v-bind('P.pPale2');
  --ink:   #160a2e;
  --ink-2: #3d2a6b;
  --ink-3: #8070a8;
  --ink-4: #b8aed0;
  --surface:   #fff;
  --surface-2: #faf8ff;
  --surface-3: v-bind('P.pPale');
  --border:   v-bind('P.p18');
  --border-2: v-bind('P.p20');
  --rose: #e11d48;
  --rose-l: #fff1f2;
  --font-d: 'Playfair Display', Georgia, serif;
  --font-b: 'DM Sans', system-ui, sans-serif;
  --sh: v-bind('`0 1px 3px ${P.p18}, 0 4px 18px ${P.p18}`');
  /* Couleurs sombres de la carte */
  --cd:  v-bind('P.d');
  --cdm: v-bind('P.dM');
  --cdl: v-bind('P.dL');
  --cdb: v-bind('P.dBorder');
  --p30: v-bind('P.p30');
  --p35: v-bind('P.p35');
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

/* ── COLOR PANEL ── */
.color-panel {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; margin-bottom: 16px; box-shadow: var(--sh); overflow: hidden;
}
.cp-toggle {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 12px 18px; background: none; border: none;
  cursor: pointer; font-family: var(--font-b); text-align: left;
}
.cp-toggle > svg:first-child { width: 15px; height: 15px; color: var(--p); flex-shrink: 0; }
.cp-label { font-size: 11px; font-weight: 700; letter-spacing: .06em; color: var(--ink); flex: 1; }
.cp-swatches { display: flex; gap: 4px; }
.cp-swatch { display: inline-block; width: 14px; height: 14px; border-radius: 4px; border: 1px solid rgba(0,0,0,.12); flex-shrink: 0; }
.cp-chevron { width: 13px; height: 13px; color: var(--ink-4); flex-shrink: 0; transition: transform .2s; }
.cp-chevron.open { transform: rotate(180deg); }

.cp-body { border-top: 1px solid var(--border); padding: 14px 18px; }
.cp-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

/* Groupe des deux pickers réunis dans une même boîte */
.cp-group {
  display: flex; align-items: stretch;
  border: 1.5px solid var(--border-2); border-radius: 12px;
  background: var(--surface-2); overflow: hidden;
}
.cp-field { display: flex; flex-direction: column; gap: 4px; padding: 9px 14px; }
.cp-lbl { font-size: 8px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-3); }
.cp-sep-v { width: 1px; background: var(--border); flex-shrink: 0; margin: 6px 0; }
.cp-pick { display: flex; align-items: center; gap: 8px; }
.cp-input {
  width: 26px; height: 26px; border: none; border-radius: 6px;
  padding: 0; cursor: pointer; background: none;
  -webkit-appearance: none; overflow: hidden; flex-shrink: 0;
}
.cp-input::-webkit-color-swatch-wrapper { padding: 0; }
.cp-input::-webkit-color-swatch { border: none; border-radius: 5px; }
.cp-hex { font-size: 12px; font-weight: 700; color: var(--ink-2); font-family: ui-monospace, monospace; letter-spacing: .04em; }

/* Mini aperçu carte */
.cp-card-thumb { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.cp-thumb-inner {
  width: 136px; border-radius: 7px; overflow: hidden; position: relative;
  border: 1px solid var(--border); background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.cp-thumb-stripe { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; z-index: 2; }
.cp-thumb-head {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 7px 5px 10px;
}
.cp-thumb-logo { width: 11px; height: 11px; border-radius: 3px; flex-shrink: 0; }
.cp-thumb-title { font-size: 6px; font-weight: 600; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cp-thumb-badge { font-size: 4px; font-weight: 600; padding: 1px 4px; border-radius: 6px; white-space: nowrap; flex-shrink: 0; }
.cp-thumb-body { display: flex; gap: 5px; padding: 5px 7px 5px 10px; }
.cp-thumb-photo {
  width: 20px; height: 28px; border-radius: 3px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800;
}
.cp-thumb-info { display: flex; flex-direction: column; gap: 3px; justify-content: center; }
.cp-thumb-name { font-size: 5.5px; font-weight: 600; }
.cp-thumb-mat  { font-size: 5.5px; font-weight: 700; font-family: monospace; }
.cp-thumb-foot {
  display: flex; align-items: center; gap: 5px;
  padding: 3px 7px 4px 10px;
}
.cp-thumb-qr { width: 9px; height: 9px; border-radius: 2px; background: #fff; flex-shrink: 0; }
.cp-thumb-bar { flex: 1; height: 3px; border-radius: 2px; }
.cp-thumb-dots { display: flex; gap: 2px; }
.cp-thumb-dots span { display: block; width: 5px; height: 5px; border-radius: 50%; }
.cp-thumb-label { font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-4); }

.cp-reset-btn {
  display: inline-flex; align-items: center; gap: 6px; margin-left: auto;
  padding: 9px 16px; border-radius: 10px;
  border: 1.5px solid var(--border-2); background: var(--surface);
  font-family: var(--font-b); font-size: 10px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3);
  cursor: pointer; transition: .15s; white-space: nowrap;
}
.cp-reset-btn:hover { border-color: rgba(225,29,72,.25); background: var(--rose-l); color: var(--rose); }
.cp-reset-btn svg { width: 12px; height: 12px; }

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
  padding: 8px 14px; background: var(--p); color: #fff; border: none; border-radius: 9px;
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  cursor: pointer; box-shadow: v-bind('`0 2px 10px ${P.p30}`'); transition: .15s;
}
.dl-btn:hover { background: var(--p-d); }
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
.m-tab.active { color: var(--p); border-bottom-color: var(--p); }

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
  background: linear-gradient(180deg, var(--p-mid) 0%, var(--p) 50%, var(--p-dd) 100%); z-index: 3;
}
.pr::after {
  content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 45%; opacity: .025;
  background-image: radial-gradient(circle, var(--p) 1px, transparent 1px);
  background-size: 11px 11px; pointer-events: none; z-index: 0;
}
.pr-head {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 13px 9px 17px;
  background: linear-gradient(108deg, var(--cd) 0%, var(--cdm) 100%);
  position: relative; overflow: hidden; z-index: 2; flex-shrink: 0;
}
.pr-logo { width: 28px; height: 28px; border-radius: 7px; background: var(--border-2); border: 1px solid var(--p30); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; z-index: 1; }
.pr-school     { font-size: 11px; font-weight: 600; color: v-bind('P.tOnDark'); letter-spacing: .3px; position: relative; z-index: 1; }
.pr-school-sub { font-size: 7px; color: v-bind('P.tMuted'); text-transform: uppercase; letter-spacing: 1.1px; margin-top: 2px; position: relative; z-index: 1; }
.pr-year       { margin-left: auto; background: var(--border); border: 1px solid var(--p30); color: v-bind('P.dBadgeText'); font-size: 8px; font-weight: 500; padding: 2px 9px; border-radius: 20px; letter-spacing: .4px; white-space: nowrap; position: relative; z-index: 1; }

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
  padding: 6px 13px 7px 17px; border-top: 1px solid var(--p-l);
  background: linear-gradient(90deg, var(--p-l), #fdfcff);
  flex-shrink: 0; position: relative; z-index: 2;
}
.pr-qr { width: 30px; height: 30px; border-radius: 6px; overflow: hidden; background: #fff; border: 1px solid var(--p-soft); flex-shrink: 0; }
.pr-qr img { width: 100%; height: 100%; }
.pr-validity { font-size: 7px; color: var(--ink-3); text-transform: uppercase; letter-spacing: .5px; line-height: 1.4; }
.pr-dots { margin-left: auto; display: flex; gap: 3px; }
.pr-dot  { width: 8px; height: 8px; border-radius: 50%; background: var(--p-l); border: 1px solid var(--p-soft); display: flex; align-items: center; justify-content: center; }
.pr-dot-inner { width: 3.5px; height: 3.5px; border-radius: 50%; background: var(--p); }

/* ════════════════════════
   VERSO APERÇU
════════════════════════ */
.pv {
  width: 380px; height: 238px; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column;
  background: linear-gradient(140deg, var(--cd) 0%, var(--cdl) 55%, var(--cdm) 100%);
  position: relative;
  box-shadow: v-bind('`0 8px 30px ${P.p35}, 0 2px 6px rgba(0,0,0,.2)`');
}
.pv-hatch {
  position: absolute; inset: 0; opacity: .055; pointer-events: none; z-index: 0;
  background-image:
    repeating-linear-gradient(45deg,  v-bind('P.dBorder') 0, v-bind('P.dBorder') .5px, transparent 0, transparent 50%),
    repeating-linear-gradient(-45deg, v-bind('P.dBorder') 0, v-bind('P.dBorder') .5px, transparent 0, transparent 50%);
  background-size: 18px 18px;
}
.pv-head  { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 12px 16px 8px; position: relative; z-index: 2; }
.pv-dot   { width: 5px; height: 5px; border-radius: 50%; background: var(--p); }
.pv-title { font-size: 8px; font-weight: 600; color: v-bind('P.tMuted'); text-transform: uppercase; letter-spacing: 1.4px; }
.pv-sep   { height: 1px; background: linear-gradient(90deg, transparent, var(--p30), transparent); margin: 0 18px 7px; position: relative; z-index: 2; }
.pv-body  { flex: 1; padding: 7px 18px 5px; position: relative; z-index: 2; }
.pv-list  { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.pv-list li { font-size: 10px; color: #ffffff; padding-left: 15px; position: relative; line-height: 1.5; }
.pv-list li::before { content: ''; position: absolute; left: 0; top: 5px; width: 5px; height: 5px; border-radius: 50%; background: var(--p); }
.pv-foot { display: flex; align-items: flex-end; justify-content: space-between; padding: 7px 18px 10px; border-top: 1px solid var(--border); position: relative; z-index: 2; }
.pv-sig-lbl  { font-size: 7px; color: v-bind('P.tMuted'); text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.pv-sig-line { width: 40px; height: 1px; background: var(--cdb); }
.pv-contact  { font-size: 7.5px; color: v-bind('P.tMuted'); text-align: right; line-height: 1.7; opacity: 0.7; }

/* ════════════════════════
   PDF ZONE CACHÉE (HEX ONLY)
════════════════════════ */
.card-container { display: flex; flex-wrap: wrap; gap: 10mm; justify-content: center; padding: 10mm; background-color: #ffffff; }
.page-break     { page-break-after: always; }
</style>