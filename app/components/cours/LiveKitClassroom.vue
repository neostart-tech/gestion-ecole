<template>
  <div class="h-screen w-full bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
    <!-- Header Salle de Cours -->
    <header class="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
      <div class="flex items-center space-x-3">
        <div class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <div>
          <h1 class="font-bold text-base md:text-lg text-slate-100">{{ roomTitle }}</h1>
          <p class="text-xs text-slate-400">{{ participantCount }} participant(s) en ligne</p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <div v-if="isScreenSharing || hasRemoteScreenShare" class="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-xs flex items-center space-x-1.5 animate-pulse">
          <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
          <span>Partage d'écran actif</span>
        </div>

        <button
          @click="copyRoomInvite"
          class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-2 transition"
          title="Copier le lien d'invitation au cours"
        >
          <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span class="hidden md:inline">{{ linkCopied ? 'Lien copié !' : 'Copier l\'invitation' }}</span>
        </button>

        <button
          @click="showParticipants = !showParticipants; showChat = false"
          class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-2 transition relative"
        >
          <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="hidden md:inline">Participants ({{ participantCount }})</span>
        </button>

        <button
          @click="showChat = !showChat; showParticipants = false"
          class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-2 transition relative"
        >
          <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="hidden md:inline">Chat</span>
        </button>

        <button
          @click="leaveRoom"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition"
        >
          Quitter le cours
        </button>
      </div>
    </header>

    <!-- Zone principale Video + Panels latéraux -->
    <div class="flex-1 flex relative overflow-hidden bg-slate-950">
      <!-- Zone Vidéo / Screen Share -->
      <div class="flex-1 flex flex-col p-4 relative">
        <div v-if="loading" class="flex-1 flex flex-col items-center justify-center space-y-4">
          <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-slate-400 font-medium text-sm">Connexion au cours en direct via LiveKit...</p>
        </div>

        <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center space-y-4">
          <div class="p-6 bg-red-950/40 border border-red-800/60 rounded-3xl text-center max-w-md space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-red-900/50 text-red-400 flex items-center justify-center mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p class="text-red-400 font-bold text-base">Accès Refusé / Erreur</p>
            <p class="text-slate-300 text-xs leading-relaxed">{{ error }}</p>
            <button @click="connectToRoom" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition">
              Réessayer
            </button>
          </div>
        </div>

        <!-- Mode Écran Partagé Principal -->
        <div v-else-if="isScreenSharing || hasRemoteScreenShare" class="flex-1 flex flex-col lg:flex-row gap-4 h-full w-full overflow-hidden">
          <!-- Vue Partage d'Écran Géante -->
          <div class="flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative flex items-center justify-center shadow-xl">
            <video ref="screenShareVideoRef" autoplay playsinline class="w-full h-full object-contain bg-black"></video>
            <div class="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 text-xs font-semibold flex items-center space-x-2">
              <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{{ isScreenSharing ? 'Votre écran partagé' : 'Écran de ' + activePresenterName }}</span>
            </div>
          </div>

          <!-- Bandeau latéral miniature des caméras -->
          <div class="w-full lg:w-72 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-48 lg:max-h-full shrink-0">
            <!-- Vignette Caméra Locale -->
            <div class="w-44 lg:w-full h-28 lg:h-40 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative shrink-0">
              <video ref="localVideoRef" autoplay playsinline muted class="w-full h-full object-cover"></video>
              <div v-if="!isCameraOn" class="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <span class="text-xs text-slate-400">Caméra OFF</span>
              </div>
              <div class="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium">
                Vous
              </div>
            </div>

            <!-- Vignettes Participants Distants -->
            <div
              v-for="p in remoteParticipants"
              :key="p.identity"
              class="w-44 lg:w-full h-28 lg:h-40 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative shrink-0"
            >
              <video :ref="el => setRemoteVideoRef(p.identity, el)" autoplay playsinline class="w-full h-full object-cover"></video>
              <div class="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium">
                {{ p.name || p.identity }}
              </div>
            </div>
          </div>
        </div>

        <!-- Mode Grille des participants -->
        <div v-else class="flex-1 grid gap-4 h-full w-full" :class="gridColumnsClass">
          <!-- Vignette Vidéo Locale (Vous) -->
          <div class="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex items-center justify-center group">
            <video ref="localVideoRef" autoplay playsinline muted class="w-full h-full object-cover"></video>
            <div v-if="!isCameraOn" class="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center space-y-2">
              <div class="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-300">
                {{ userInitials }}
              </div>
              <span class="text-xs text-slate-400">Caméra désactivée</span>
            </div>

            <div class="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800/80 text-xs font-medium flex items-center space-x-2">
              <span>Vous ({{ isTeacher ? 'Enseignant' : 'Étudiant' }})</span>
              <span :class="isMicOn ? 'text-emerald-400' : 'text-red-400'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="isMicOn" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </span>
            </div>
          </div>

          <!-- Vignettes des Participants Distants -->
          <div
            v-for="p in remoteParticipants"
            :key="p.identity"
            class="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex items-center justify-center group"
          >
            <video :ref="el => setRemoteVideoRef(p.identity, el)" autoplay playsinline class="w-full h-full object-cover"></video>
            
            <div class="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800/80 text-xs font-medium flex items-center space-x-2">
              <span>{{ p.name || p.identity }}</span>
            </div>
          </div>
        </div>

        <!-- Barre d'outils vidéo (Control Bar) -->
        <div class="h-20 flex items-center justify-center space-x-4 z-20">
          <button
            @click="toggleMicrophone"
            :class="isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'"
            class="p-4 rounded-2xl shadow-lg transition flex items-center justify-center"
            title="Activer/Désactiver le Micro"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="isMicOn" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>

          <button
            @click="toggleCamera"
            :class="isCameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'"
            class="p-4 rounded-2xl shadow-lg transition flex items-center justify-center"
            title="Activer/Désactiver la Caméra"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="isCameraOn" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </button>

          <button
            @click="toggleScreenShare"
            :class="isScreenSharing ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/40' : 'bg-slate-800 hover:bg-slate-700 text-white'"
            class="p-4 rounded-2xl shadow-lg transition flex items-center justify-center"
            title="Partager l'écran"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Drawer Liste des Participants + Exclusions -->
      <div v-if="showParticipants" class="w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-20">
        <div class="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 class="font-semibold text-sm">Participants ({{ participantCount }})</h3>
          <button @click="showParticipants = false" class="text-slate-400 hover:text-white p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 p-4 overflow-y-auto space-y-3">
          <!-- Participant Local (Vous) -->
          <div class="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {{ userInitials }}
              </div>
              <div>
                <p class="text-xs font-semibold text-white">Vous</p>
                <p class="text-[10px] text-indigo-400 font-medium">{{ isTeacher ? 'Enseignant / Hôte' : 'Étudiant' }}</p>
              </div>
            </div>
          </div>

          <!-- Participants Distants -->
          <div
            v-for="p in remoteParticipants"
            :key="p.identity"
            class="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
          >
            <div class="flex items-center space-x-2.5 min-w-0">
              <div class="w-8 h-8 rounded-full bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                {{ (p.name || p.identity).substring(0, 2).toUpperCase() }}
              </div>
              <div class="truncate">
                <p class="text-xs font-medium text-slate-200 truncate">{{ p.name || p.identity }}</p>
                <p class="text-[10px] text-slate-400">Élève en ligne</p>
              </div>
            </div>

            <!-- Bouton Retirer du cours (Visible uniquement pour l'enseignant) -->
            <button
              v-if="isTeacher"
              @click="kickParticipant(p)"
              class="px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg border border-red-500/30 text-[11px] font-semibold transition shrink-0 flex items-center space-x-1"
              title="Retirer cet élève de la classe"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6h12m7-5l-4 4m0-4l4 4" />
              </svg>
              <span>Retirer</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Drawer Chat en direct -->
      <div v-if="showChat" class="w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-20">
        <div class="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 class="font-semibold text-sm">Chat du cours</h3>
          <button @click="showChat = false" class="text-slate-400 hover:text-white p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 p-4 overflow-y-auto space-y-3">
          <div v-for="(msg, index) in messages" :key="index" class="text-xs space-y-0.5">
            <p class="font-bold text-indigo-400">{{ msg.sender }}</p>
            <p class="text-slate-200 bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">{{ msg.text }}</p>
          </div>
        </div>
        <div class="p-3 border-t border-slate-800 flex space-x-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Écrire un message..."
            class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button @click="sendMessage" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs font-semibold">
            Envoi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLiveKitStore } from '~/stores/livekit'

const props = defineProps({
  roomName: { type: String, required: true },
  roomTitle: { type: String, default: 'Cours en Ligne' }
})

const emit = defineEmits(['leave'])

const liveKitStore = useLiveKitStore()

const loading = ref(true)
const error = ref('')
const isMicOn = ref(true)
const isCameraOn = ref(true)
const isScreenSharing = ref(false)
const hasRemoteScreenShare = ref(false)
const activePresenterName = ref('')
const isTeacher = ref(false)
const showChat = ref(false)
const showParticipants = ref(false)
const remoteParticipants = ref([])
const messages = ref([])
const newMessage = ref('')
const linkCopied = ref(false)

const copyRoomInvite = () => {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2500)
  }
}

const localVideoRef = ref(null)
const screenShareVideoRef = ref(null)
const remoteVideoRefs = ref({})

let roomInstance = null
let localVideoTrack = null
let localAudioTrack = null
let localScreenTrack = null

const userInitials = ref('MO')

const participantCount = computed(() => remoteParticipants.value.length + 1)
const gridColumnsClass = computed(() => {
  const total = participantCount.value
  if (total <= 1) return 'grid-cols-1'
  if (total <= 4) return 'grid-cols-2'
  return 'grid-cols-3'
})

const setRemoteVideoRef = (identity, el) => {
  if (el) {
    remoteVideoRefs.value[identity] = el
  }
}

const connectToRoom = async () => {
  loading.value = true
  error.value = ''

  try {
    const { Room, RoomEvent, Track, createLocalVideoTrack, createLocalAudioTrack } = await import('livekit-client')

    const data = await liveKitStore.fetchRoomToken(props.roomName)

    if (!data || !data.token) {
      throw new Error('Impossible d\'obtenir le jeton d\'accès au cours.')
    }

    const { token, url, is_teacher, name } = data
    isTeacher.value = is_teacher
    if (name) {
      userInitials.value = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    roomInstance = new Room()

    roomInstance.on(RoomEvent.ParticipantConnected, (participant) => {
      if (!remoteParticipants.value.find(p => p.identity === participant.identity)) {
        remoteParticipants.value.push(participant)
      }
    })

    roomInstance.on(RoomEvent.ParticipantDisconnected, (participant) => {
      remoteParticipants.value = remoteParticipants.value.filter(p => p.identity !== participant.identity)
    })

    roomInstance.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      if (publication.source === Track.Source.ScreenShare) {
        hasRemoteScreenShare.value = true
        activePresenterName.value = participant.name || participant.identity
        nextTick(() => {
          if (screenShareVideoRef.value) {
            track.attach(screenShareVideoRef.value)
          }
        })
      } else if (track.kind === Track.Kind.Video) {
        nextTick(() => {
          const el = remoteVideoRefs.value[participant.identity]
          if (el) {
            track.attach(el)
          }
        })
      } else if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach()
        document.body.appendChild(audioElement)
      }
    })

    roomInstance.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
      if (publication.source === Track.Source.ScreenShare) {
        hasRemoteScreenShare.value = false
        activePresenterName.value = ''
      }
      track.detach().forEach(el => el.remove())
    })

    // Écoute des paquets de données (Chat + Modération / Exclusions)
    roomInstance.on(RoomEvent.DataReceived, (payload, participant) => {
      const str = new TextDecoder().decode(payload)
      try {
        const packet = JSON.parse(str)
        if (packet.action === 'KICK' && packet.target === roomInstance.localParticipant.identity) {
          alert('Vous avez été retiré du cours par l\'enseignant (Scolarité non à jour ou modération).')
          leaveRoom()
        } else if (packet.action === 'CHAT') {
          messages.value.push({ sender: participant?.name || 'Participant', text: packet.text })
        }
      } catch (e) {}
    })

    await roomInstance.connect(url, token)

    // Attacher caméra & micro locaux
    localVideoTrack = await createLocalVideoTrack()
    localAudioTrack = await createLocalAudioTrack()

    await roomInstance.localParticipant.publishTrack(localVideoTrack)
    await roomInstance.localParticipant.publishTrack(localAudioTrack)

    nextTick(() => {
      if (localVideoRef.value) {
        localVideoTrack.attach(localVideoRef.value)
      }
    })

    loading.value = false
  } catch (err) {
    console.error(err)
    error.value = liveKitStore.error || err.message || 'Erreur lors de l\'initialisation de la visioconférence.'
    loading.value = false
  }
}

const toggleMicrophone = async () => {
  if (localAudioTrack) {
    if (isMicOn.value) {
      await localAudioTrack.mute()
      isMicOn.value = false
    } else {
      await localAudioTrack.unmute()
      isMicOn.value = true
    }
  }
}

const toggleCamera = async () => {
  if (localVideoTrack) {
    if (isCameraOn.value) {
      await localVideoTrack.mute()
      isCameraOn.value = false
    } else {
      await localAudioTrack.unmute()
      isCameraOn.value = true
    }
  }
}

const toggleScreenShare = async () => {
  if (!roomInstance) return
  try {
    const newState = !isScreenSharing.value
    const publishedTracks = await roomInstance.localParticipant.setScreenShareEnabled(newState)
    isScreenSharing.value = newState

    if (newState) {
      await nextTick()
      let vTrack = null
      if (Array.isArray(publishedTracks)) {
        const pub = publishedTracks.find(p => p.kind === 'video' || p.track?.kind === 'video')
        vTrack = pub?.track || pub
      } else if (publishedTracks) {
        vTrack = publishedTracks.track || publishedTracks
      }

      localScreenTrack = vTrack
      if (vTrack && screenShareVideoRef.value) {
        vTrack.attach(screenShareVideoRef.value)
      }
    } else {
      if (localScreenTrack) {
        localScreenTrack.detach().forEach(el => el.remove())
        localScreenTrack = null
      }
    }
  } catch (err) {
    console.error('Erreur partage d\'écran:', err)
    isScreenSharing.value = false
  }
}

// Fonction de modération pour l'enseignant (Retirer un élève)
const kickParticipant = async (participant) => {
  if (!roomInstance || !isTeacher.value) return
  if (confirm(`Voulez-vous vraiment retirer ${participant.name || participant.identity} du cours ?`)) {
    const data = new TextEncoder().encode(JSON.stringify({ action: 'KICK', target: participant.identity }))
    await roomInstance.localParticipant.publishData(data, { reliable: true })
    remoteParticipants.value = remoteParticipants.value.filter(p => p.identity !== participant.identity)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !roomInstance) return
  const text = newMessage.value.trim()
  messages.value.push({ sender: 'Vous', text })
  
  const data = new TextEncoder().encode(JSON.stringify({ action: 'CHAT', text }))
  await roomInstance.localParticipant.publishData(data, { reliable: true })
  newMessage.value = ''
}

const leaveRoom = () => {
  if (roomInstance) {
    roomInstance.disconnect()
  }
  emit('leave')
}

onMounted(() => {
  connectToRoom()
})

onUnmounted(() => {
  if (roomInstance) {
    roomInstance.disconnect()
  }
})
</script>
