<!-- components/AppLoader.vue -->
<template>
	<div
		class="fixed inset-0 z-50 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 overflow-hidden"
	>
		<!-- Arrière-plan subtil avec motif géométrique -->
		<div class="absolute inset-0 opacity-5">
			<div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--color-primary-300)_0%,transparent_50%)]"></div>
			<div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,var(--color-primary-400)_0%,transparent_50%)]"></div>
		</div>

		<!-- Effet de particules délicates -->
		<div class="absolute inset-0">
			<div
				v-for="i in particleCount"
				:key="i"
				:style="getParticleStyle(i)"
				class="absolute rounded-full bg-gradient-to-r from-primary-400/30 to-primary-500/30 animate-float"
			></div>
		</div>

		<!-- Contenu principal centré -->
		<div class="relative h-full flex flex-col items-center justify-center p-4 sm:p-8">
			<!-- Logo animé élégant -->
			<div class="relative mb-8 sm:mb-12">
				<!-- Cercles concentriques animés -->
				<div class="relative">
					<!-- Cercle extérieur subtil -->
					<div class="absolute inset-0 animate-spin-slow">
						<div class="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-gray-300/30 dark:border-gray-600/30"></div>
					</div>
					
					<!-- Cercle de lumière -->
					<div class="absolute inset-0 animate-pulse-slow">
						<div class="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-primary-500/10 to-primary-600/5 blur-xl"></div>
					</div>

					<!-- Logo principal -->
					<div class="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50">
						<!-- Forme abstraite élégante -->
						<div class="relative w-20 h-20 sm:w-24 sm:h-24">
							<!-- Forme principale (lettre D stylisée) -->
							<div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl transform rotate-3 shadow-lg"></div>
							
							<!-- Détail intérieur -->
							<div class="absolute inset-2 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg"></div>
							
							<!-- Accent de couleur -->
							<div class="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full animate-pulse"></div>
							
							<!-- Ligne décorative -->
							<div class="absolute -bottom-2 -left-2 w-10 h-1 bg-gradient-to-r from-primary-400 to-transparent rounded-full"></div>
						</div>

						<!-- Points animés orbitaux -->
						<div class="absolute inset-0 animate-orbit">
							<div
								v-for="dot in 3"
								:key="dot"
								:style="{
									animationDelay: `${dot * 0.5}s`,
									transform: `rotate(${dot * 120}deg) translateX(60px)`
								}"
								class="absolute top-1/2 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-400"
							></div>
						</div>
					</div>

					<!-- Reflet subtil -->
					<div class="absolute -inset-4 bg-gradient-to-br from-primary-500/5 to-transparent rounded-3xl blur-2xl"></div>
				</div>
			</div>

			<!-- Contenu textuel raffiné -->
			<div class="text-center space-y-6 max-w-md">
				<!-- Nom de l'application avec effet de gradient raffiné -->
				<div class="relative inline-block">
					<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
						
					</h1>
					<div class="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-glow"></div>
				</div>

				<!-- Tagline élégant -->
				<p
					v-if="showSubtitle"
					class="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light tracking-wide"
				>
					{{ subtitle }}
				</p>

				<!-- Barre de progression minimaliste -->
				<div v-if="showProgress" class="pt-6">
					<div class="relative h-1 w-48 sm:w-64 rounded-full bg-gray-200/50 dark:bg-gray-700/50 overflow-hidden">
						<div
							class="absolute h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary-500/30"
							:style="{ width: `${progress}%` }"
						></div>
						<div class="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
					</div>
					
					<!-- Pourcentage discret -->
					<div class="pt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
						<span class="uppercase tracking-wider">{{ progressText }}</span>
						<span class="text-primary-600 dark:text-primary-400 font-semibold">
							{{ Math.round(progress) }}%
						</span>
					</div>
				</div>

				<!-- Message avec transition fluide -->
				<div v-if="showMessage && currentMessage" class="pt-4">
					<div class="relative h-6 overflow-hidden">
						<p
							class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic transition-all duration-500 ease-in-out absolute inset-0"
							:class="messageTransitionClass"
						>
							{{ currentMessage }}
						</p>
					</div>
				</div>

				<!-- Indicateur d'activité discret -->
				<div v-if="showIndicator" class="pt-8">
					<div class="flex items-center justify-center space-x-3">
						<div class="flex space-x-1.5">
							<div
								v-for="n in 3"
								:key="n"
								:style="{ animationDelay: `${n * 0.2}s` }"
								class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 animate-pulse"
							></div>
						</div>
						<span class="text-xs text-gray-400 dark:text-gray-500 tracking-wide">
							{{ indicatorText }}
						</span>
					</div>
				</div>
			</div>

			<!-- Information de version discrète -->
			<div
				v-if="showFooter"
				class="absolute bottom-6 sm:bottom-8 left-0 right-0"
			>
				<div class="text-center">
					<div class="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30">
						<span class="text-xs text-gray-500 dark:text-gray-400">
							{{ footerText }}
						</span>
						<div class="w-1 h-1 rounded-full bg-gray-400"></div>
						<span class="text-xs text-primary-500 dark:text-primary-400 font-medium">
							v{{ version }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Élément décoratif en bas à droite -->
		<div class="absolute bottom-0 right-0 w-64 h-64">
			<div class="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-primary-500/5 to-transparent rounded-full blur-3xl"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
interface Props {
	// Contrôle d'affichage
	showSubtitle?: boolean
	showProgress?: boolean
	showMessage?: boolean
	showIndicator?: boolean
	showFooter?: boolean
	
	// Contenu personnalisable
	subtitle?: string
	progressText?: string
	indicatorText?: string
	footerText?: string
	version?: string
	
	// Messages alternatifs
	messages?: string[]
	messageInterval?: number
	
	// Configuration des particules
	particleCount?: number
}

const props = withDefaults(defineProps<Props>(), {
	showSubtitle: true,
	showProgress: true,
	showMessage: true,
	showIndicator: true,
	showFooter: true,
	
	subtitle: 'Système de gestion académique intelligent',
	progressText: 'Chargement',
	indicatorText: 'Initialisation en cours',
	footerText: 'Digen Platform',
	version: '2.0',
	
	messages: () => [
		'Préparation de votre environnement',
		'Chargement des données pédagogiques',
		'Configuration des préférences utilisateur',
		'Vérification des modules disponibles',
		'Optimisation des performances',
		'Chargement des interfaces utilisateur',
		'Initialisation des services',
		'Mise en place du tableau de bord',
	],
	messageInterval: 2500,
	
	particleCount: 15,
})

// Réactives
const progress = ref(0)
const currentMessage = ref('')
const messageIndex = ref(0)
const messageTransitionClass = ref('')

// Computed
const messageTransitionClassFunctiontion = computed(() => {
	return messageTransitionClass.value
})

// Méthodes
const getParticleStyle = (index: number) => {
	const size = Math.random() * 4 + 1
	const duration = 3 + Math.random() * 2
	return {
		left: `${Math.random() * 100}%`,
		top: `${Math.random() * 100}%`,
		animationDelay: `${Math.random() * 2}s`,
		animationDuration: `${duration}s`,
		width: `${size}px`,
		height: `${size}px`,
		opacity: 0.3 + Math.random() * 0.3,
	}
}

const nextMessage = () => {
	if (!props.showMessage || props.messages.length <= 1) return
	
	// Animation de sortie
	messageTransitionClass.value = 'translate-y-6 opacity-0'
	
	setTimeout(() => {
		// Changer le message
		messageIndex.value = (messageIndex.value + 1) % props.messages.length
		currentMessage.value = props.messages[messageIndex.value]
		
		// Animation d'entrée
		messageTransitionClass.value = 'translate-y-0 opacity-100'
		
		// Réinitialiser la classe après l'animation
		setTimeout(() => {
			messageTransitionClass.value = ''
		}, 500)
	}, 300)
}

const updateProgress = () => {
	if (!props.showProgress || progress.value >= 100) return
	
	const increment = 1 + Math.random() * 3
	progress.value = Math.min(100, progress.value + increment)
	
	// Changer le message occasionnellement
	if (Math.random() > 0.85) {
		nextMessage()
	}
}

// Lifecycle
let progressInterval: NodeJS.Timeout
let messageInterval: NodeJS.Timeout

onMounted(() => {
	// Initialiser le premier message
	if (props.showMessage && props.messages.length > 0) {
		currentMessage.value = props.messages[0]
		messageTransitionClass.value = 'translate-y-0 opacity-100'
	}
	
	// Démarrer l'animation de progression
	if (props.showProgress) {
		progressInterval = setInterval(updateProgress, 150)
	}
	
	// Changer les messages automatiquement
	if (props.showMessage && props.messages.length > 1) {
		messageInterval = setInterval(nextMessage, props.messageInterval)
	}
	
	// Ajouter les animations CSS
	const style = document.createElement('style')
	style.textContent = `
		@keyframes float {
			0%, 100% { transform: translateY(0) scale(1); }
			50% { transform: translateY(-10px) scale(1.05); }
		}
		
		@keyframes spin-slow {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}
		
		@keyframes pulse-slow {
			0%, 100% { opacity: 0.5; transform: scale(1); }
			50% { opacity: 0.8; transform: scale(1.05); }
		}
		
		@keyframes orbit {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}
		
		@keyframes glow {
			0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
			50% { opacity: 0.8; transform: scaleX(1); }
		}
		
		@keyframes shimmer {
			0% { transform: translateX(-100%); }
			100% { transform: translateX(100%); }
		}
		
		.animate-float {
			animation: float 3s ease-in-out infinite;
		}
		
		.animate-spin-slow {
			animation: spin-slow 20s linear infinite;
		}
		
		.animate-pulse-slow {
			animation: pulse-slow 4s ease-in-out infinite;
		}
		
		.animate-orbit {
			animation: orbit 6s linear infinite;
		}
		
		.animate-glow {
			animation: glow 2s ease-in-out infinite;
		}
		
		.animate-shimmer {
			animation: shimmer 2s ease-in-out infinite;
		}
	`
	style.id = 'digen-loader-animations'
	document.head.appendChild(style)
})

onUnmounted(() => {
	if (progressInterval) clearInterval(progressInterval)
	if (messageInterval) clearInterval(messageInterval)
	
	const style = document.getElementById('digen-loader-animations')
	if (style) document.head.removeChild(style)
})

// Exposer des méthodes pour le contrôle externe
defineExpose({
	setProgress: (value: number) => {
		progress.value = Math.min(100, Math.max(0, value))
	},
	getProgress: () => progress.value,
	setMessage: (message: string) => {
		currentMessage.value = message
	},
	nextMessage,
	complete: () => {
		progress.value = 100
		if (progressInterval) clearInterval(progressInterval)
	},
	isComplete: () => progress.value >= 100
})
</script>

<style scoped>
/* Transitions d'entrée/sortie fluides */
.v-enter-active {
	transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.v-enter-from {
	opacity: 0;
	transform: scale(0.95);
}

.v-leave-to {
	opacity: 0;
	transform: scale(1.05);
}
</style>