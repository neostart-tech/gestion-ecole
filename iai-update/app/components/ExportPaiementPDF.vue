<!-- components/ExportPaiementPDF.vue -->
<template>
  <div ref="pdfContent" class="pdf-container">
    <!-- En-tête -->
    <div class="pdf-header">
      <div class="header-top">
        <div class="logo-section">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="school-info">
            <h2>GESTION SCOLAIRE</h2>
            <p>Rapport de paiement des étudiants</p>
          </div>
        </div>
        <div class="report-badge">
          <span class="badge">{{ badgeTexte }}</span>
        </div>
      </div>

      <div class="header-divider"></div>

      <div class="header-grid">
        <div class="info-item">
          <span class="info-label">Date d'édition</span>
          <span class="info-value">{{ dateEdition }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Référence</span>
          <span class="info-value">RPT-{{ numeroReference }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Période</span>
          <span class="info-value">{{ periodeTexte || 'Toutes les périodes' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total étudiants</span>
          <span class="info-value">{{ etudiants.length }}</span>
        </div>
      </div>

      <!-- Titre principal -->
      <div class="title-section">
        <h1>{{ titre }}</h1>
        <p class="subtitle">{{ sousTitre }}</p>
      </div>
    </div>

    <!-- Tableau des paiements - COLONNES AJUSTÉES -->
    <table class="pdf-table">
      <thead>
        <tr>
          <th width="5%">N°</th>
          <th width="25%">Étudiant</th>
          <th width="10%">Initial</th>
          <th width="10%">Bourse</th>
          <th width="10%">Payé</th>
          <th width="10%">Reste</th>
          <th width="26%">Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(etudiant, index) in etudiants" :key="index" :class="getStatutClass(etudiant.statut)">
          <td class="text-center">{{ index + 1 }}</td>
          <td>{{ truncateName(etudiant.nom, etudiant.prenom) }}</td>
          <td class="text-right montant">{{ formatMontantCourt(etudiant.montant_initial) }}</td>
          <td class="text-right montant">{{ formatMontantCourt(etudiant.montant_apres_bourse) }}</td>
          <td class="text-right montant">{{ formatMontantCourt(etudiant.total_paye) }}</td>
          <td class="text-right montant">{{ formatMontantCourt(etudiant.reste_a_payer) }}</td>
          <td class="text-center">
            <span class="statut-badge text-center" :class="getStatutBadgeClass(etudiant.statut)">
              {{ getStatutComplet(etudiant.statut) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Section des totaux - 2 PAR LIGNE -->
    <div class="totaux-section">
      <div class="totaux-row">
        <div class="total-card">
          <span class="total-label">Total initial</span>
          <span class="total-value">{{ formatMontant(totaux.montant_initial) }}</span>
        </div>
        <div class="total-card">
          <span class="total-label">Après bourses</span>
          <span class="total-value">{{ formatMontant(totaux.montant_apres_bourse) }}</span>
        </div>
      </div>
      <div class="totaux-row">
        <div class="total-card">
          <span class="total-label">Total encaissé</span>
          <span class="total-value">{{ formatMontant(totaux.total_paye) }}</span>
        </div>
        <div class="total-card total-card-highlight">
          <span class="total-label">Reste à payer</span>
          <span class="total-value">{{ formatMontant(totaux.reste_a_payer) }}</span>
        </div>
      </div>
    </div>

    <!-- Stats et signature sur la même ligne avec signature décalée à gauche -->
    <div class="bottom-row">
      <!-- Stats à gauche -->
      <div class="stats-block">
        <h4>Récapitulatif par statut</h4>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-dot solde"></span>
            <span>Soldé: <strong>{{ stats.solde }}</strong></span>
          </div>
          <div class="stat-item">
            <span class="stat-dot cours"></span>
            <span>En cours: <strong>{{ stats.en_cours }}</strong></span>
          </div>
          <div class="stat-item">
            <span class="stat-dot retard"></span>
            <span>En retard: <strong>{{ stats.en_retard }}</strong></span>
          </div>
          <div class="stat-item">
            <span class="stat-dot aucun"></span>
            <span>Aucun frais: <strong>{{ stats.aucun_frais }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Signature à droite mais plus à gauche pour être visible -->
      <div class="signature-block">
        <p>Fait à _________________, le {{ dateSignature }}</p>
        <p class="responsable">Le responsable financier</p>
      </div>
    </div>

    <!-- Pied de page -->
    <div class="pdf-footer">
      <div>Document généré automatiquement - {{ dateCourt }}</div>
      <div>Page <span class="page-number"></span></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useParametreStore } from '~~/stores/parametre'

const parametreStore=useParametreStore()

const props = defineProps({
  etudiants: { type: Array, required: true, default: () => [] },
  totaux: { type: Object, required: true, default: () => ({ montant_initial: 0, montant_apres_bourse: 0, total_paye: 0, reste_a_payer: 0 }) },
  type: { type: String, required: true },
  selectedItemName: { type: String, default: '' },
  periodeDebut: { type: String, default: null },
  periodeFin: { type: String, default: null }
})

// Statistiques par statut
const stats = computed(() => {
  const stats = { solde: 0, en_cours: 0, en_retard: 0, aucun_frais: 0 }
  props.etudiants.forEach(e => {
    if (e.statut === 'solde') stats.solde++
    else if (e.statut === 'en_cours') stats.en_cours++
    else if (e.statut === 'en_retard') stats.en_retard++
    else stats.aucun_frais++
  })
  return stats
})

// Titre dynamique
const titre = computed(() => {
  switch (props.type) {
    case 'etudiant': return `RAPPORT INDIVIDUEL`
    case 'niveau': return `RAPPORT PAR NIVEAU - ${props.selectedItemName}`
    case 'filiere': return `RAPPORT PAR FILIÈRE - ${props.selectedItemName}`
    default: return 'RAPPORT GLOBAL DES PAIEMENTS'
  }
})

const sousTitre = computed(() => {
  if (props.type === 'etudiant') {
    return `Étudiant : ${props.selectedItemName}`
  }
  return `${props.etudiants.length} étudiant${props.etudiants.length > 1 ? 's' : ''}`
})

const badgeTexte = computed(() => {
  switch (props.type) {
    case 'etudiant': return 'INDIVIDUEL'
    case 'niveau': return 'PAR NIVEAU'
    case 'filiere': return 'PAR FILIÈRE'
    default: return 'GLOBAL'
  }
})

// Dates
const dateEdition = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { 
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
})

const dateCourt = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { 
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
})

const dateSignature = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { 
    day: '2-digit', month: 'long', year: 'numeric'
  })
})

const numeroReference = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`
})

const periodeTexte = computed(() => {
  if (props.periodeDebut && props.periodeFin) {
    return `du ${formatDate(props.periodeDebut)} au ${formatDate(props.periodeFin)}`
  } else if (props.periodeDebut) {
    return `à partir du ${formatDate(props.periodeDebut)}`
  } else if (props.periodeFin) {
    return `jusqu'au ${formatDate(props.periodeFin)}`
  }
  return ''
})

// Formats
const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return '-'
  return new Intl.NumberFormat('fr-FR').format(montant) + ' F CFA'
}

const formatMontantCourt = (montant) => {
  if (!montant && montant !== 0) return '-'
  if (montant >= 1000000) {
    return (montant / 1000000).toFixed(1) + ' M'
  }
  if (montant >= 1000) {
    return (montant / 1000).toFixed(0) + ' K'
  }
  return montant.toString()
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

// Troncature
const truncateName = (nom, prenom) => {
  const full = `${nom} ${prenom}`
  return full.length > 30 ? full.substring(0, 27) + '...' : full
}

const getStatutCourt = (statut) => {
  const labels = {
    'solde': 'Solde',
    'en_cours': 'Cours',
    'en_retard': 'Retard',
    'aucun_frais': 'Aucun'
  }
  return labels[statut] || statut
}

const getStatutComplet = (statut) => {
  const labels = {
    'solde': 'SOLDÉ',
    'en_cours': 'EN COURS',
    'en_retard': 'EN RETARD',
    'aucun_frais': 'AUCUN FRAIS'
  }
  return labels[statut] || statut
}

// Classes
const getStatutClass = (statut) => {
  return `statut-row-${statut || 'aucun'}`
}

const getStatutBadgeClass = (statut) => {
  const classes = {
    'solde': 'badge-solde',
    'en_cours': 'badge-cours',
    'en_retard': 'badge-retard',
    'aucun_frais': 'badge-aucun'
  }
  return classes[statut] || 'badge-aucun'
}

</script>

<style scoped>
.pdf-container {
  font-family: 'Helvetica', 'Arial', sans-serif;
  background: white;
  padding: 20px 30px; /* Augmenté les marges latérales */
  width: 1200px;
  color: #1e293b;
  line-height: 1.4;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Header */
.pdf-header { margin-bottom: 15px; }
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  background: #eef2ff;
  padding: 6px;
  border-radius: 8px;
}
.school-info h2 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.school-info p {
  font-size: 11px;
  color: #64748b;
  margin: 2px 0 0;
}
.report-badge .badge {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 4px 14px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
}
.header-divider {
  height: 2px;
  background: linear-gradient(90deg, #2563eb, #e2e8f0);
  margin: 10px 0;
}
.header-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 15px;
}
.info-item {
  display: flex;
  flex-direction: column;
}
.info-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
}
.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
.title-section {
  text-align: center;
  margin-bottom: 15px;
}
.title-section h1 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}
.title-section .subtitle {
  font-size: 13px;
  color: #475569;
  margin: 0;
}

/* Table - AJUSTÉE */
.pdf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  margin-bottom: 15px;
  table-layout: fixed;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.pdf-table th {
  background: #1e3a5f;
  color: white;
  font-weight: 600;
  padding: 10px 5px;
  text-align: left;
  font-size: 10px;
  text-transform: uppercase;
  border-right: 1px solid #2c4c7c;
}
.pdf-table th:last-child { border-right: none; }

.pdf-table td {
  padding: 8px 5px;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}
.pdf-table td:last-child { border-right: none; }

.text-center { text-align: center; }
.text-right { text-align: right; padding-right: 10px !important; }

.etudiant-nom {
  font-weight: 500;
  color: #0f172a;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.montant {
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
}

/* Statuts - PLUS LARGE POUR ÊTRE VISIBLE */
.statut-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 80px;
  text-align: center;
}
.badge-solde { background: #dcfce7; color: #166534; }
.badge-cours { background: #fef9c3; color: #854d0e; }
.badge-retard { background: #fee2e2; color: #991b1b; }
.badge-aucun { background: #f1f5f9; color: #475569; }

.statut-row-solde { background-color: #f0fdf4; }
.statut-row-en_cours { background-color: #fefce8; }
.statut-row-en_retard { background-color: #fef2f2; }
.statut-row-aucun_frais { background-color: #f8fafc; }

/* Totaux - 2 PAR LIGNE */
.totaux-section {
  margin: 15px 0;
  page-break-inside: avoid;
}
.totaux-row {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}
.totaux-row:last-child {
  margin-bottom: 0;
}
.total-card {
  flex: 1;
  background: #f8fafc;
  padding: 12px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  text-align: center;
}
.total-card-highlight {
  background: #1e3a5f;
  border-color: #1e3a5f;
}
.total-card-highlight .total-label,
.total-card-highlight .total-value {
  color: white;
}
.total-label {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 5px;
  font-weight: 600;
  text-transform: uppercase;
}
.total-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

/* Bottom row - Stats et signature */
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 5px;
  padding-top: 10px;
  border-top: 1px dashed #cbd5e1;
  page-break-inside: avoid;
}

.stats-block {
  width: 55%;
}
.stats-block h4 {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px;
}
.stats-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #475569;
}
.stat-item strong {
  color: #0f172a;
  margin-left: 2px;
}
.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.stat-dot.solde { background: #22c55e; }
.stat-dot.cours { background: #eab308; }
.stat-dot.retard { background: #ef4444; }
.stat-dot.aucun { background: #94a3b8; }

/* Signature - DÉCALÉE À GAUCHE POUR ÊTRE VISIBLE */
.signature-block {
  width: 40%;
  text-align: left; /* Changé de right à left */
  padding-left: 20px; /* Ajouté un padding pour la décaler un peu */
}
.signature-block p {
  margin: 3px 0;
  font-size: 11px;
  color: #475569;
}
.signature-block .responsable {
  font-weight: 600;
  color: #0f172a;
}

/* Footer */
.pdf-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  font-size: 9px;
  color: #94a3b8;
}

/* Impression */
@media print {
  .pdf-container { padding: 15px 25px; }
  .pdf-table { page-break-inside: auto; }
  thead { display: table-header-group; }
  .totaux-section, .bottom-row { page-break-inside: avoid; }
}
</style>