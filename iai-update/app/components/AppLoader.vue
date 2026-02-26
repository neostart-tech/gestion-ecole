<!-- components/AppLoader.vue -->
<template>
	<div
		class="fixed inset-0 z-50 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 overflow-hidden"
	>
		<!-- Arrière-plan subtil avec motif géométrique -->
		<div class="absolute inset-0 opacity-5">
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--color-primary-300)_0%,transparent_50%)]"
			></div>
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,var(--color-primary-400)_0%,transparent_50%)]"
			></div>
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
		<div
			class="relative h-full flex flex-col items-center justify-center p-4 sm:p-8"
		>
			<!-- Logo animé élégant -->
			<div class="loader">
				<div class="loader__bar"></div>
				<div class="loader__bar"></div>
				<div class="loader__bar"></div>
				<div class="loader__bar"></div>
				<div class="loader__bar"></div>
				<div class="loader__ball"></div>
			</div>

			<!-- Contenu textuel raffiné -->
			<div class="text-center space-y-6 max-w-md">
				<!-- Nom de l'application avec effet de gradient raffiné -->
				<div class="relative inline-block">
					<h1
						class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
					></h1>
					<div
						class="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-glow"
					></div>
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
					<div
						class="relative h-1 w-48 sm:w-64 rounded-full bg-gray-200/50 dark:bg-gray-700/50 overflow-hidden"
					>
						<div
							class="absolute h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary-500/30"
							:style="{ width: `${progress}%` }"
						></div>
						<div
							class="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
						></div>
					</div>

					<!-- Pourcentage discret -->
					<div
						class="pt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium"
					>
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
					</div>
				</div>
			</div>
		</div>

		<!-- Élément décoratif en bas à droite -->
		<div class="absolute bottom-0 right-0 w-64 h-64">
			<div
				class="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-primary-500/5 to-transparent rounded-full blur-3xl"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from "vue";

	// Props
	interface Props {
		// Contrôle d'affichage
		showSubtitle?: boolean;
		showProgress?: boolean;
		showMessage?: boolean;
		showIndicator?: boolean;
		showFooter?: boolean;

		// Contenu personnalisable
		subtitle?: string;
		progressText?: string;
		indicatorText?: string;
		footerText?: string;
		version?: string;

		// Messages alternatifs
		messages?: string[];
		messageInterval?: number;

		// Configuration des particules
		particleCount?: number;
	}

	const props = withDefaults(defineProps<Props>(), {
		showSubtitle: true,
		showProgress: true,
		showMessage: true,
		showIndicator: true,
		showFooter: true,

		subtitle: "Système de gestion académique intelligent",
		progressText: "Chargement",
		indicatorText: "Initialisation en cours",
		footerText: "Digen Platform",
		version: "2.0",

		messages: () => [
			"Préparation de votre environnement",
			"Chargement des données pédagogiques",
			"Configuration des préférences utilisateur",
			"Vérification des modules disponibles",
			"Optimisation des performances",
			"Chargement des interfaces utilisateur",
			"Initialisation des services",
			"Mise en place du tableau de bord",
		],
		messageInterval: 2500,

		particleCount: 15,
	});

	// Réactives
	const progress = ref(0);
	const currentMessage = ref("");
	const messageIndex = ref(0);
	const messageTransitionClass = ref("");

	// Computed
	const messageTransitionClassFunctiontion = computed(() => {
		return messageTransitionClass.value;
	});

	// Méthodes
	const getParticleStyle = (index: number) => {
		const size = Math.random() * 4 + 1;
		const duration = 3 + Math.random() * 2;
		return {
			left: `${Math.random() * 100}%`,
			top: `${Math.random() * 100}%`,
			animationDelay: `${Math.random() * 2}s`,
			animationDuration: `${duration}s`,
			width: `${size}px`,
			height: `${size}px`,
			opacity: 0.3 + Math.random() * 0.3,
		};
	};

	const nextMessage = () => {
		if (!props.showMessage || props.messages.length <= 1) return;

		// Animation de sortie
		messageTransitionClass.value = "translate-y-6 opacity-0";

		setTimeout(() => {
			// Changer le message
			messageIndex.value = (messageIndex.value + 1) % props.messages.length;
			currentMessage.value = props.messages[messageIndex.value];

			// Animation d'entrée
			messageTransitionClass.value = "translate-y-0 opacity-100";

			// Réinitialiser la classe après l'animation
			setTimeout(() => {
				messageTransitionClass.value = "";
			}, 500);
		}, 300);
	};

	const updateProgress = () => {
		if (!props.showProgress || progress.value >= 100) return;

		const increment = 1 + Math.random() * 3;
		progress.value = Math.min(100, progress.value + increment);

		// Changer le message occasionnellement
		if (Math.random() > 0.85) {
			nextMessage();
		}
	};

	// Lifecycle
	let progressInterval: NodeJS.Timeout;
	let messageInterval: NodeJS.Timeout;

	onMounted(() => {
		// Initialiser le premier message
		if (props.showMessage && props.messages.length > 0) {
			currentMessage.value = props.messages[0];
			messageTransitionClass.value = "translate-y-0 opacity-100";
		}

		// Démarrer l'animation de progression
		if (props.showProgress) {
			progressInterval = setInterval(updateProgress, 150);
		}

		// Changer les messages automatiquement
		if (props.showMessage && props.messages.length > 1) {
			messageInterval = setInterval(nextMessage, props.messageInterval);
		}

		// Ajouter les animations CSS
		const style = document.createElement("style");
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
	`;
		style.id = "digen-loader-animations";
		document.head.appendChild(style);
	});

	onUnmounted(() => {
		if (progressInterval) clearInterval(progressInterval);
		if (messageInterval) clearInterval(messageInterval);

		const style = document.getElementById("digen-loader-animations");
		if (style) document.head.removeChild(style);
	});

	// Exposer des méthodes pour le contrôle externe
	defineExpose({
		setProgress: (value: number) => {
			progress.value = Math.min(100, Math.max(0, value));
		},
		getProgress: () => progress.value,
		setMessage: (message: string) => {
			currentMessage.value = message;
		},
		nextMessage,
		complete: () => {
			progress.value = 100;
			if (progressInterval) clearInterval(progressInterval);
		},
		isComplete: () => progress.value >= 100,
	});
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

	.loader {
		position: relative;
		width: 75px;
		height: 100px;
	}

	.loader__bar {
		position: absolute;
		bottom: 0;
		width: 10px;
		height: 50%;
		background: rgb(0, 0, 0);
		transform-origin: center bottom;
		box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
	}

	.loader__bar:nth-child(1) {
		left: 0px;
		transform: scale(1, 0.2);
		-webkit-animation: barUp1 4s infinite;
		animation: barUp1 4s infinite;
	}

	.loader__bar:nth-child(2) {
		left: 15px;
		transform: scale(1, 0.4);
		-webkit-animation: barUp2 4s infinite;
		animation: barUp2 4s infinite;
	}

	.loader__bar:nth-child(3) {
		left: 30px;
		transform: scale(1, 0.6);
		-webkit-animation: barUp3 4s infinite;
		animation: barUp3 4s infinite;
	}

	.loader__bar:nth-child(4) {
		left: 45px;
		transform: scale(1, 0.8);
		-webkit-animation: barUp4 4s infinite;
		animation: barUp4 4s infinite;
	}

	.loader__bar:nth-child(5) {
		left: 60px;
		transform: scale(1, 1);
		-webkit-animation: barUp5 4s infinite;
		animation: barUp5 4s infinite;
	}

	.loader__ball {
		position: absolute;
		bottom: 10px;
		left: 0;
		width: 10px;
		height: 10px;
		background: rgb(44, 143, 255);
		border-radius: 50%;
		-webkit-animation: ball624 4s infinite;
		animation: ball624 4s infinite;
	}

	@keyframes ball624 {
		0% {
			transform: translate(0, 0);
		}

		5% {
			transform: translate(8px, -14px);
		}

		10% {
			transform: translate(15px, -10px);
		}

		17% {
			transform: translate(23px, -24px);
		}

		20% {
			transform: translate(30px, -20px);
		}

		27% {
			transform: translate(38px, -34px);
		}

		30% {
			transform: translate(45px, -30px);
		}

		37% {
			transform: translate(53px, -44px);
		}

		40% {
			transform: translate(60px, -40px);
		}

		50% {
			transform: translate(60px, 0);
		}

		57% {
			transform: translate(53px, -14px);
		}

		60% {
			transform: translate(45px, -10px);
		}

		67% {
			transform: translate(37px, -24px);
		}

		70% {
			transform: translate(30px, -20px);
		}

		77% {
			transform: translate(22px, -34px);
		}

		80% {
			transform: translate(15px, -30px);
		}

		87% {
			transform: translate(7px, -44px);
		}

		90% {
			transform: translate(0, -40px);
		}

		100% {
			transform: translate(0, 0);
		}
	}

	@-webkit-keyframes barUp1 {
		0% {
			transform: scale(1, 0.2);
		}

		40% {
			transform: scale(1, 0.2);
		}

		50% {
			transform: scale(1, 1);
		}

		90% {
			transform: scale(1, 1);
		}

		100% {
			transform: scale(1, 0.2);
		}
	}

	@keyframes barUp1 {
		0% {
			transform: scale(1, 0.2);
		}

		40% {
			transform: scale(1, 0.2);
		}

		50% {
			transform: scale(1, 1);
		}

		90% {
			transform: scale(1, 1);
		}

		100% {
			transform: scale(1, 0.2);
		}
	}

	@-webkit-keyframes barUp2 {
		0% {
			transform: scale(1, 0.4);
		}

		40% {
			transform: scale(1, 0.4);
		}

		50% {
			transform: scale(1, 0.8);
		}

		90% {
			transform: scale(1, 0.8);
		}

		100% {
			transform: scale(1, 0.4);
		}
	}

	@keyframes barUp2 {
		0% {
			transform: scale(1, 0.4);
		}

		40% {
			transform: scale(1, 0.4);
		}

		50% {
			transform: scale(1, 0.8);
		}

		90% {
			transform: scale(1, 0.8);
		}

		100% {
			transform: scale(1, 0.4);
		}
	}

	@-webkit-keyframes barUp3 {
		0% {
			transform: scale(1, 0.6);
		}

		100% {
			transform: scale(1, 0.6);
		}
	}

	@keyframes barUp3 {
		0% {
			transform: scale(1, 0.6);
		}

		100% {
			transform: scale(1, 0.6);
		}
	}

	@-webkit-keyframes barUp4 {
		0% {
			transform: scale(1, 0.8);
		}

		40% {
			transform: scale(1, 0.8);
		}

		50% {
			transform: scale(1, 0.4);
		}

		90% {
			transform: scale(1, 0.4);
		}

		100% {
			transform: scale(1, 0.8);
		}
	}

	@keyframes barUp4 {
		0% {
			transform: scale(1, 0.8);
		}

		40% {
			transform: scale(1, 0.8);
		}

		50% {
			transform: scale(1, 0.4);
		}

		90% {
			transform: scale(1, 0.4);
		}

		100% {
			transform: scale(1, 0.8);
		}
	}

	@-webkit-keyframes barUp5 {
		0% {
			transform: scale(1, 1);
		}

		40% {
			transform: scale(1, 1);
		}

		50% {
			transform: scale(1, 0.2);
		}

		90% {
			transform: scale(1, 0.2);
		}

		100% {
			transform: scale(1, 1);
		}
	}

	@keyframes barUp5 {
		0% {
			transform: scale(1, 1);
		}

		40% {
			transform: scale(1, 1);
		}

		50% {
			transform: scale(1, 0.2);
		}

		90% {
			transform: scale(1, 0.2);
		}

		100% {
			transform: scale(1, 1);
		}
	}
</style>
