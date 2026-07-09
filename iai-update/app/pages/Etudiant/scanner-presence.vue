<template>
  <div class="scanner-page">

    <!-- ===== ÉTAT : SUCCÈS ===== -->
    <div v-if="success" class="state-overlay success-bg">
      <div class="state-content">
        <div class="success-icon-ring">
          <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="state-title">Présence validée !</h2>
        <p class="state-desc">Vous êtes bien enregistré comme présent pour ce cours.</p>
        <NuxtLink to="/etudiant" class="btn-white">
          Retour au tableau de bord
        </NuxtLink>
      </div>
    </div>

    <!-- ===== ÉTAT : ERREUR ===== -->
    <div v-else-if="error && !loading" class="state-overlay error-bg">
      <div class="state-content">
        <div class="error-icon-ring">
          <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="state-title">Échec du scan</h2>
        <p class="state-desc">{{ error }}</p>
        <div class="flex gap-3 flex-wrap justify-center">
          <button @click="resetScan" class="btn-white">
            Réessayer
          </button>
          <NuxtLink to="/etudiant" class="btn-outline-white">
            Tableau de bord
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ===== ÉTAT : VALIDATION EN COURS ===== -->
    <div v-else-if="loading" class="state-overlay loading-bg">
      <div class="state-content">
        <div class="loading-ring"></div>
        <h2 class="state-title">Validation...</h2>
        <p class="state-desc">Enregistrement de votre présence en cours.</p>
      </div>
    </div>

    <!-- ===== VUE SCANNER PRINCIPALE ===== -->
    <template v-else>
      <!-- Header flottant -->
      <div class="scanner-header">
        <NuxtLink to="/etudiant" class="back-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <div class="header-text">
          <h1>Scanner votre présence</h1>
          <p>Visez le QR code projeté par votre professeur</p>
        </div>
        <div class="w-9"></div>
      </div>

      <!-- Zone caméra plein écran -->
      <ClientOnly>
        <QrcodeStream
          @detect="onDetect"
          @camera-on="onCameraOn"
          @error="onError"
          class="camera-stream"
        >
          <!-- Chargement caméra -->
          <div v-if="cameraLoading" class="camera-loader">
            <div class="camera-loader-ring"></div>
            <p>Activation de la caméra...</p>
          </div>

          <!-- Overlay scanner actif -->
          <div v-else class="scanner-overlay">
            <!-- Zone sombre autour du cadre -->
            <div class="scan-shadow top-shadow"></div>
            <div class="scan-row">
              <div class="scan-shadow side-shadow"></div>

              <!-- Cadre de scan -->
              <div class="scan-frame">
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
                <div class="scan-line"></div>
              </div>

              <div class="scan-shadow side-shadow"></div>
            </div>
            <div class="scan-shadow bottom-shadow">
              <p class="scan-hint">Centrez le QR code dans le cadre</p>
            </div>
          </div>
        </QrcodeStream>
      </ClientOnly>
    </template>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import config from '../../../config'

const success = ref(false)
const error = ref('')
const loading = ref(false)
const cameraLoading = ref(true)

const baseUrl = config.app_local ? config.app_dev_url : config.app_prod_url

const resetScan = () => {
  error.value = ''
  success.value = false
  cameraLoading.value = true
}

const onDetect = async (detectedCodes) => {
  if (loading.value || success.value) return
  const qrToken = detectedCodes[0]?.rawValue
  if (!qrToken) return

  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('gest-ecole-token')
    const response = await $fetch(`${baseUrl}/presence/scan-qr`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { qr_token: qrToken }
    })

    if (response?.success) {
      success.value = true
    } else {
      error.value = response?.message || 'QR code invalide ou expiré.'
    }
  } catch (err) {
    error.value = err.data?.message || 'Erreur de connexion. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

const onCameraOn = () => { cameraLoading.value = false }

const onError = (err) => {
  cameraLoading.value = false
  const messages = {
    NotAllowedError:  "Autorisez l'accès à la caméra dans votre navigateur.",
    NotFoundError:    'Aucune caméra détectée sur cet appareil.',
    NotSupportedError:'Une connexion sécurisée (HTTPS) est requise.',
    NotReadableError: 'La caméra est déjà utilisée par une autre application.',
  }
  error.value = messages[err.name] || `Erreur caméra : ${err.message}`
}
</script>

<style scoped>
/* ── Page ── */
.scanner-page {
  position: fixed;
  inset: 0;
  background: #0a0a0f;
  overflow: hidden;
}

/* ── États (succès / erreur / loading) ── */
.state-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 30;
}
.success-bg { background: linear-gradient(135deg, #059669 0%, #065f46 100%); }
.error-bg   { background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); }
.loading-bg { background: linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%); }

.state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  max-width: 22rem;
}

.success-icon-ring,
.error-icon-ring {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop .4s cubic-bezier(.175,.885,.32,1.275) both;
}
.success-icon-ring { background: rgba(255,255,255,.2); box-shadow: 0 0 0 12px rgba(255,255,255,.1); }
.error-icon-ring   { background: rgba(255,255,255,.2); box-shadow: 0 0 0 12px rgba(255,255,255,.1); }

.loading-ring {
  width: 5rem;
  height: 5rem;
  border: 4px solid rgba(255,255,255,.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.state-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.state-desc {
  font-size: 1rem;
  color: rgba(255,255,255,.8);
  line-height: 1.6;
}

.btn-white {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 2rem;
  background: #fff;
  color: #1e1b4b;
  font-weight: 700;
  border-radius: 9999px;
  font-size: .95rem;
  transition: opacity .15s;
  text-decoration: none;
}
.btn-white:hover { opacity: .9; }

.btn-outline-white {
  display: inline-flex;
  align-items: center;
  padding: .75rem 2rem;
  border: 2px solid rgba(255,255,255,.5);
  color: #fff;
  font-weight: 600;
  border-radius: 9999px;
  font-size: .95rem;
  transition: background .15s;
  text-decoration: none;
}
.btn-outline-white:hover { background: rgba(255,255,255,.1); }

/* ── Header flottant ── */
.scanner-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(to bottom, rgba(0,0,0,.7) 0%, transparent 100%);
}
.back-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,.15);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  color: #fff;
  flex-shrink: 0;
  text-decoration: none;
  transition: background .15s;
}
.back-btn:hover { background: rgba(255,255,255,.25); }

.header-text {
  flex: 1;
  text-align: center;
}
.header-text h1 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}
.header-text p {
  font-size: .8rem;
  color: rgba(255,255,255,.7);
  margin-top: .1rem;
}

/* ── Caméra ── */
.camera-stream {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Loader caméra */
.camera-loader {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  background: #0a0a0f;
  color: rgba(255,255,255,.7);
  font-size: .9rem;
}
.camera-loader-ring {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(99,102,241,.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* ── Overlay scanner ── */
.scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.scan-shadow { background: rgba(0,0,0,.55); }
.top-shadow  { height: 20%; }
.bottom-shadow {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .75rem;
}
.scan-row {
  display: flex;
  align-items: stretch;
}
.side-shadow { width: 8%; }

/* Cadre de scan */
.scan-frame {
  position: relative;
  width: 84%;
  aspect-ratio: 1;
}

.corner {
  position: absolute;
  width: 2.25rem;
  height: 2.25rem;
  border-color: #6366f1;
  border-style: solid;
}
.corner.tl { top: 0;    left: 0;  border-width: 4px 0 0 4px; border-radius: 6px 0 0 0; }
.corner.tr { top: 0;    right: 0; border-width: 4px 4px 0 0; border-radius: 0 6px 0 0; }
.corner.bl { bottom: 0; left: 0;  border-width: 0 0 4px 4px; border-radius: 0 0 0 6px; }
.corner.br { bottom: 0; right: 0; border-width: 0 4px 4px 0; border-radius: 0 0 6px 0; }

.scan-line {
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #818cf8, #6366f1, #818cf8, transparent);
  box-shadow: 0 0 8px 2px rgba(99,102,241,.6);
  animation: scanMove 2.2s ease-in-out infinite;
}

.scan-hint {
  color: rgba(255,255,255,.75);
  font-size: .85rem;
  font-weight: 500;
  letter-spacing: .02em;
}

/* ── Animations ── */
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes pop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
@keyframes scanMove {
  0%   { top: 4px; }
  50%  { top: calc(100% - 6px); }
  100% { top: 4px; }
}
</style>
