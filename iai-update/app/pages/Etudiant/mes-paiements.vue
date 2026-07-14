<template>
  <div class="paiement-page">

    <!-- NAV BREADCRUMB -->
    <nav class="paiement-nav">
      <NuxtLink to="/frais-scolarite" class="nav-link">Frais de scolarité</NuxtLink>
      <span class="nav-sep">›</span>
      <span class="nav-cur">Mes paiements</span>
    </nav>

    <!-- LOADING STATE PREMIUM -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPageLoading"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm"
      >
        <div class="relative flex items-center justify-center">
          <div class="absolute w-32 h-32 bg-indigo-500/20 rounded-full animate-ping"></div>
          <div class="absolute w-24 h-24 bg-indigo-600/30 rounded-full animate-pulse delay-75"></div>
          <div class="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12">
            <svg class="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-8 flex flex-col items-center">
          <h2 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 animate-pulse">
            Chargement de vos finances...
          </h2>
          <p class="text-sm text-gray-500 mt-2 font-medium tracking-widest uppercase">
            Mise à jour de vos paiements
          </p>
        </div>
      </div>
    </Transition>

    <div class="page-inner" v-if="!errorState">

      <!-- PAGE HEADER -->
      <div class="page-header">
        <div class="flex justify-between items-end">
          <div>
            <p class="page-eyebrow">Finances</p>
            <h1 class="page-title">Paiement des <em>frais de scolarité</em></h1>
          </div>
          <button @click="loadData(true)" class="refresh-btn" :disabled="isPageLoading">
            <svg :class="{ 'spin': isPageLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      <!-- STATS CARDS -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon due">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Scolarité</p>
            <h3 class="stat-value">{{ formatAmount(paiementStore.recap?.montant_total) }} <small>FCFA</small></h3>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon paid">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Payé</p>
            <h3 class="stat-value text-emerald">{{ formatAmount(paiementStore.recap?.total_paye) }} <small>FCFA</small></h3>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon rest">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Reste à payer</p>
            <h3 class="stat-value text-violet">{{ formatAmount(paiementStore.recap?.reste_a_payer) }} <small>FCFA</small></h3>
          </div>
        </div>
      </div>

      <!-- COLONNE GAUCHE -->
      <div class="left-col">

        <!-- FORMULAIRE -->
        <div class="card form-card">
          <div class="card-hd">
            <div class="card-hd-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <div>
              <p class="card-hd-title">Effectuer un paiement</p>
              <p class="card-hd-sub">Complétez les informations ci-dessous</p>
            </div>
          </div>

          <div class="form-body">
            <form @submit.prevent="submitPayment">
              <div class="frow">
                <div>
                  <label class="fl">Nom</label>
                  <input v-model="form.lastname" type="text" class="fi" placeholder="Nom" required />
                </div>
                <div>
                  <label class="fl">Prénom</label>
                  <input v-model="form.firstname" type="text" class="fi" placeholder="Prénom" required />
                </div>
              </div>

              <div class="fg">
                <label class="fl">Téléphone</label>
                <div class="phone-wrap">
                  <div class="phone-prefix">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 004.516 4.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span>+228</span>
                  </div>
                  <input v-model="form.phone" type="tel" class="fi" placeholder="90000000" maxlength="8" @input="form.phone = form.phone.replace(/\D/g, '').slice(0, 8)" required />
                </div>
              </div>

              <!-- NATURE DU PAIEMENT (Masqué si inscription déjà payée) -->
              <div class="fg" v-if="paiementStore.recap && !paiementStore.recap.inscription_payee">
                <label class="fl">Nature du paiement</label>
                <select v-model="form.nature_paiement" class="fi select-fi" required>
                  <option value="inscription">Frais d'inscription</option>
                  <option value="scolarite">Frais de scolarité</option>
                </select>
              </div>

              <div class="fg">
                <label class="fl">Montant</label>
                <div class="amount-wrap">
                  <input 
                    v-model.number="form.montant" 
                    type="number" 
                    min="100" 
                    :max="maxAmount"
                    @input="handleAmountInput"
                    class="fi" 
                    :class="{ 'fi-disabled': form.nature_paiement === 'inscription', 'fi-error': isAmountTooHigh }"
                    placeholder="0" 
                    :disabled="form.nature_paiement === 'inscription'"
                    required 
                  />
                  <span class="amount-suffix">FCFA</span>
                </div>
                <p v-if="isAmountTooHigh" class="error-tip">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Le montant dépasse le reste à payer ({{ formatAmount(maxAmount) }} FCFA).
                </p>
                <p v-if="form.nature_paiement === 'inscription'" class="info-tip">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Le montant des frais d'inscription est fixe.
                </p>
              </div>

              <!-- MODE DE PAIEMENT (Commenté pour utiliser un mode par défaut) -->
              <!-- 
              <div class="fg">
                <span class="fl">Mode de paiement</span>
                <div class="method-grid">
                  <div v-for="method in paymentMethods" :key="method.value" class="method-card" :class="{ active: form.payment_method === method.value }" @click="form.payment_method = method.value">
                    <div class="method-card-icon">
                      <img v-if="method.logo" :src="method.logo" :alt="method.label" class="method-logo" />
                      <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="method.iconPath" class="method-svg" width="14" height="14" />
                    </div>
                    <div class="method-card-info">
                      <div class="method-card-name">{{ method.label }}</div>
                      <div class="method-card-sub">{{ method.sub }}</div>
                    </div>
                  </div>
                </div>
              </div>
              -->

              <div class="submit-wrap">
                <button type="submit" class="submit-btn" :disabled="paiementStore.isLoading || isAmountTooHigh">
                  <svg v-if="!paiementStore.isLoading" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  <svg v-else class="spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  <span v-if="paiementStore.isLoading">Traitement...</span>
                  <span v-else>Payer · {{ formatAmount(form.montant) }} FCFA</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- HISTORIQUE -->
        <div class="card history-card" style="margin-top: 20px;">
          <div class="history-hd">
            <div class="history-hd-title"><span class="hd-dot"></span> Historique</div>
            <span class="history-count">{{ historiqueList.length }} paiements</span>
          </div>
          <div v-if="historiqueList.length > 0">
            <div v-for="pay in historiqueList" :key="pay.id" class="hrow">
              <div class="hrow-icon">
                <img v-if="getModeLogo(pay.mode_label)" :src="getModeLogo(pay.mode_label)" :alt="pay.mode_label" class="hrow-logo" />
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getModeIcon(pay.mode_label)" class="hrow-icon-svg" width="14" height="14" />
              </div>
              <div class="hrow-info">
                <div class="hrow-libelle">{{ pay.libelle }}</div>
                <div class="hrow-meta">{{ pay.date_formatted }} · {{ pay.mode_label }}</div>
              </div>
              <div class="hrow-right">
                <div class="hrow-right-top">
                  <span class="hrow-amount">{{ formatAmount(pay.montant) }} FCFA</span>
                  <a v-if="pay.status === 'valide' && pay.recu" :href="pay.recu" target="_blank" class="receipt-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </a>
                </div>
                <span class="spill" :class="getStatusClass(pay.status)">{{ pay.status_label }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty">
            <p>Aucun paiement trouvé.</p>
          </div>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div class="right-col">
        <div class="card summary-card">
          <div class="summary-strip">
            <p class="summary-eyebrow">Montant à régler</p>
            <div class="summary-amount">{{ formatAmount(form.montant) }} <span class="summary-currency">FCFA</span></div>
          </div>
          <div class="summary-rows">
            <div class="srow"><span>Étudiant</span><span>{{ form.lastname }} {{ form.firstname }}</span></div>
            <div class="srow"><span>Nature</span><span class="hi">{{ form.nature_paiement === 'inscription' ? "Inscription" : "Scolarité" }}</span></div>
            <div class="srow"><span>Mode</span><span>{{ selectedMethodLabel }}</span></div>
          </div>
          <div class="total-row"><span>Total TTC</span><span>{{ formatAmount(form.montant) }} FCFA</span></div>
          <div class="secure-row">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Paiement sécurisé via SEMOA</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR STATE -->
    <div v-else class="error-container">
      <div class="error-card">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="48" height="48"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2>Oups ! Problème de profil</h2>
        <p>{{ errorMessage }}</p>
        <button @click="retryLoad" class="retry-btn">Réessayer</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from "primevue/usetoast"
import Swal from "sweetalert2"
import { usePaiementGlobalStore } from '../../../stores/paiement'

const toast = useToast()
const paiementStore = usePaiementGlobalStore()

const errorState = ref(false)
const isPageLoading = ref(true)
const errorMessage = ref('')

const paymentMethods = [
  { value: '016eb63c-f29d-4384-92e4-b1bd37ef69f8', label: 'Flooz', sub: 'Moov Africa', logo: '/logo/moovmonye.jpg' },
  { value: 'e2daf18d-b8d8-42b7-ac42-e3ab8bdb95c1', label: 'Yas', sub: 'Mix By Yas', logo: '/logo/mixbyyas.png' },
  { value: '64369062-817c-43a5-9615-5683296a8497', label: 'Ecobank', sub: 'Mobile Banking', logo: '/logo/ecobank.png' },
  { value: 'f7bbfaef-eba3-4b82-ac31-61eb2b772289', label: 'Orabank', sub: 'Virement Orabank', logo: '/logo/orabank.jpg' }
]

const form = ref({ 
  etudiant_id: '', 
  lastname: '', 
  firstname: '', 
  phone: '', 
  montant: '', 
  nature_paiement: 'scolarite',
  payment_method: '14f4597d-ef96-4263-8107-1e1970959133' 
})

// Surveillance de l'état de l'inscription pour ajuster la nature par défaut
watch(() => paiementStore.recap, (newRecap) => {
  if (newRecap) {
    if (newRecap.inscription_payee) {
      form.value.nature_paiement = 'scolarite'
    } else {
      form.value.nature_paiement = 'inscription'
      // Si on vient de charger les données et qu'on est en mode inscription, on force le montant
      if (newRecap.montant_inscription) {
        form.value.montant = newRecap.montant_inscription
      }
    }
  }
}, { immediate: true, deep: true })

// Surveillance de la nature du paiement pour forcer le montant de l'inscription
watch(() => form.value.nature_paiement, (nature) => {
  if (nature === 'inscription' && paiementStore.recap?.montant_inscription) {
    form.value.montant = paiementStore.recap.montant_inscription
  } else if (nature === 'scolarite' && form.value.montant === paiementStore.recap?.montant_inscription) {
    // Optionnel: on peut vider le montant si on repasse en scolarité pour laisser l'étudiant choisir
    form.value.montant = ''
  }
})

const selectedMethodLabel = computed(() => {
  const m = paymentMethods.find(m => m.value === form.value.payment_method)
  return m ? m.label : '—'
})

const historiqueList = computed(() => {
  return paiementStore.historiquePaiements || []
})

const isAmountTooHigh = computed(() => {
  const m = parseFloat(form.value.montant) || 0
  return m > maxAmount.value
})

const maxAmount = computed(() => {
  return form.value.nature_paiement === 'scolarite' 
    ? (paiementStore.recap?.reste_a_payer || 0) 
    : (paiementStore.recap?.montant_inscription || 0)
})

const handleAmountInput = (e) => {
  let val = parseFloat(e.target.value) || 0
  if (val > maxAmount.value) {
    form.value.montant = maxAmount.value
  }
}

const formatAmount = (val) => (parseInt(val) || 0).toLocaleString('fr-FR')
const getStatusClass = (s) => (s === 'valide' ? 'sp-ok' : s === 'en_attente' ? 'sp-wait' : 'sp-err')

const getModeLogo = (l) => {
  const m = paymentMethods.find(m => (l || '').toLowerCase().includes(m.label.toLowerCase()))
  return m ? m.logo : null
}

const getModeIcon = (l) => {
  const m = paymentMethods.find(m => (l || '').toLowerCase().includes(m.label.toLowerCase()))
  return m ? m.iconPath : '<path stroke="currentColor" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>'
}

const submitPayment = async () => {
  // Validation du téléphone
  let p = form.value.phone.replace(/\D/g, '')
  if (p.length !== 8) return toast.add({ severity: 'warn', summary: '8 chiffres requis', life: 3000 })

  // Validation du montant (Garde-fou)
  const reste = form.value.nature_paiement === 'scolarite' 
    ? (paiementStore.recap?.reste_a_payer || 0) 
    : (paiementStore.recap?.montant_inscription || 0)

  if (form.value.montant > reste) {
    return Swal.fire({
      icon: 'warning',
      title: 'Montant trop élevé',
      text: `Vous ne pouvez pas payer plus que votre reste à payer (${formatAmount(reste)} FCFA).`,
      confirmButtonColor: '#6c52e3'
    })
  }

  try {
    const res = await paiementStore.initierPaiementSemoa({ ...form.value, phone: '+228' + p })
    if (res.success) window.open(res.payment_url, '_blank')
    else Swal.fire("Erreur", res.message, "error")
  } catch { Swal.fire("Erreur", "Connexion impossible", "error") }
}

const loadData = async (isManual = false) => {
  if (isManual) isPageLoading.value = true
  const user = JSON.parse(localStorage.getItem('gest-ecole-user')) || JSON.parse(localStorage.getItem('user'))
  if (user) {
    form.value.etudiant_id = user.etudiant_id || user.id
    form.value.lastname = user.nom || user.name || ''
    form.value.firstname = user.prenom || ''
    form.value.phone = user.tel || user.phone || ''
    
    try {
      const resRecap = await paiementStore.getRecap()
      if (!resRecap.success) {
        errorState.value = true
        errorMessage.value = resRecap.message
        isPageLoading.value = false
        return
      }
      await paiementStore.getHistorique()
      errorState.value = false
    } catch (err) {
      errorState.value = true
      errorMessage.value = "Une erreur est survenue lors de la récupération des données."
    } finally {
      // Un petit délai pour que l'animation soit visible si c'est trop rapide
      setTimeout(() => {
        isPageLoading.value = false
      }, 500)
    }
  }
}

const retryLoad = () => {
  errorState.value = false
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.paiement-page {
  --violet: #6c52e3; --ink: #0e0d1a; --ink-3: #7e7c96; --ink-4: #b8b6cc; --surface-2: #f7f6fc; --border: rgba(108,82,227,0.1);
  font-family: 'DM Sans', sans-serif; background: var(--surface-2); min-height: 100vh; color: var(--ink);
}
.paiement-nav { padding: 12px 24px; border-bottom: 1px solid var(--border); display: flex; gap: 8px; font-size: 11px; font-weight: 600; }
.nav-link { color: var(--ink-3); text-decoration: none; }
.page-inner { display: grid; grid-template-columns: 1fr 340px; gap: 24px; padding: 24px 22px; align-items: start; max-width: 1280px; margin: 0 auto; }
.page-header { grid-column: 1/-1; margin-bottom: 10px; }
.page-eyebrow { font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--violet); letter-spacing: .2em; }
.page-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; }
.page-title em { font-style: italic; color: var(--violet); }

.stats-grid { grid-column: 1/-1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px; }
.stat-card { background: #fff; padding: 20px; border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: center; gap: 16px; }
.stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.due { background: #fff5f5; color: #ff5a5a; }
.stat-icon.paid { background: #f0fdf4; color: #10b981; }
.stat-icon.rest { background: #f5f3ff; color: var(--violet); }
.stat-label { font-size: 10px; font-weight: 700; color: var(--ink-4); text-transform: uppercase; }
.stat-value { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; }

.left-col { display: flex; flex-direction: column; gap: 20px; }
.card { background: #fff; border-radius: 20px; border: 1px solid var(--border); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
.card-hd { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
.card-hd-icon { width: 32px; height: 32px; background: var(--violet); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.card-hd-icon svg { width: 15px; height: 15px; }
.form-body { padding: 20px; }
.frow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.fg { margin-bottom: 15px; }
.fl { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px; }
.fi { width: 100%; padding: 10px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; outline: none; transition: 0.2s; }
.fi:focus { border-color: var(--violet); box-shadow: 0 0 0 4px rgba(108,82,227,0.05); }
.fi-disabled { background: #f9f9fb; color: var(--ink-3); cursor: not-allowed; border-color: var(--border); }
.info-tip { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--violet); margin-top: 6px; font-weight: 600; }

.select-fi { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237e7c96'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 14px; padding-right: 40px; }

.phone-wrap { position: relative; }
.phone-prefix { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-weight: 700; font-size: 12px; display: flex; align-items: center; gap: 4px; }
.phone-wrap .fi { padding-left: 55px; }
.amount-wrap { position: relative; }
.amount-suffix { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 10px; font-weight: 700; color: var(--ink-4); }
.method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.method-card { padding: 10px; border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.method-card:hover { border-color: var(--violet); }
.method-card.active { border-color: var(--violet); background: #f5f3ff; }
.method-card-icon { width: 34px; height: 34px; background: var(--surface-2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.method-logo { width: 100%; height: 100%; object-fit: contain; }
.method-card-name { font-size: 11px; font-weight: 700; }
.method-card-sub { font-size: 9px; color: var(--ink-3); }
.submit-btn { width: 100%; padding: 14px; background: var(--violet); color: #fff; border: none; border-radius: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 11px; transition: 0.2s; }
.submit-btn:hover:not(:disabled) { background: #5a42cc; transform: translateY(-2px); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn svg { width: 16px; height: 16px; }

.history-hd { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.history-hd-title { font-size: 11px; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.hd-dot { width: 5px; height: 5px; background: var(--violet); border-radius: 50%; }
.hrow { padding: 12px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; transition: 0.2s; }
.hrow:hover { background: #fafafa; }
.hrow-icon { width: 36px; height: 36px; background: var(--surface-2); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.hrow-logo { width: 80%; height: 80%; object-fit: contain; }
.hrow-info { flex: 1; }
.hrow-libelle { font-size: 13px; font-weight: 600; }
.hrow-meta { font-size: 10px; color: var(--ink-3); }
.hrow-right { text-align: right; }
.hrow-amount { font-size: 13px; font-weight: 700; }
.spill { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
.sp-ok { background: #ecfdf5; color: #10b981; }
.sp-wait { background: #fffbeb; color: #b45309; }
.sp-err { background: #fff1f2; color: #e11d48; }
.receipt-link { width: 26px; height: 26px; background: #f5f3ff; color: var(--violet); border-radius: 6px; display: flex; align-items: center; justify-content: center; display: inline-flex; margin-left: 6px; vertical-align: middle; transition: 0.2s; }
.receipt-link:hover { background: var(--violet); color: #fff; }

.empty { padding: 30px; text-align: center; color: var(--ink-3); font-size: 13px; }

.summary-strip { padding: 20px; background: linear-gradient(135deg, #3d2daf, #7053d9); color: #fff; }
.summary-amount { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; }
.summary-rows { padding: 15px 20px; }
.srow { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 11px; }
.total-row { padding: 14px 20px; display: flex; justify-content: space-between; font-weight: 700; border-top: 1px solid var(--border); }
.secure-row { padding: 12px 20px; display: flex; align-items: center; gap: 8px; color: #10b981; font-size: 10px; font-weight: 600; }
.secure-row svg { width: 14px; height: 14px; flex-shrink: 0; }

.error-container { display: flex; align-items: center; justify-content: center; min-height: 80vh; padding: 20px; }
.error-card { background: #fff; padding: 40px; border-radius: 24px; text-align: center; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid var(--border); }
.error-icon { color: #f43f5e; margin-bottom: 20px; }
.error-card h2 { font-family: 'Playfair Display', serif; margin-bottom: 12px; color: var(--ink); }
.error-card p { color: var(--ink-3); font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
.retry-btn { padding: 12px 24px; background: var(--violet); color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.retry-btn:hover { background: #5a42cc; transform: translateY(-2px); }

.refresh-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #fff; border: 1px solid var(--border); border-radius: 10px; color: var(--violet); font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: 0.2s; }
.refresh-btn:hover:not(:disabled) { background: var(--surface-2); border-color: var(--violet); }
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.refresh-btn svg { width: 14px; height: 14px; }

.fi-error { border-color: #ef4444 !important; background: #fef2f2 !important; }
.error-tip { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #ef4444; margin-top: 6px; font-weight: 600; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>