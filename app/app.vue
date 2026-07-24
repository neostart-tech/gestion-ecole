<!-- app.vue -->
<template>
	<div>
		<!-- Loader avec props personnalisables -->
		<AppLoader
			v-if="loading"
			:show-progress="true"
			:show-message="true"
			:type="loaderType"
			:subtitle="loaderSubtitle"
			:progress-text="loaderProgressText"
			:messages="loaderMessages"
			ref="loaderRef"
		/>

		<!-- App -->
		<NuxtLayout v-else>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import AppLoader from '~/components/AppLoader.vue'

const loading = ref(true)
const loaderRef = ref()

// Configuration du loader
const loaderType = ref<'full' | 'minimal' | 'compact'>('full')
const loaderSubtitle = 'Système de gestion académique'
const loaderProgressText = 'Initialisation...'
const loaderMessages = [
	'Chargement des données utilisateur...',
	'Configuration des préférences...',
	'Préparation de l\'interface...',
	'Vérification de la connexion...'
]

onMounted(() => {
	// Simuler le chargement
	const interval = setInterval(() => {
		if (loaderRef.value) {
			const currentProgress = loaderRef.value.getProgress()
			const newProgress = currentProgress + Math.random() * 15
			loaderRef.value.setProgress(newProgress)
			
			// Compléter à 100% après un certain temps
			if (newProgress >= 100) {
				clearInterval(interval)
				setTimeout(() => {
					loading.value = false
				}, 500)
			}
		}
	}, 300)
	
	// Changer un message après 2 secondes
	setTimeout(() => {
		if (loaderRef.value) {
			loaderRef.value.setMessage('Finalisation du chargement...')
		}
	}, 2000)
})

// Alternative simple
const simpleOnMounted = () => {
	setTimeout(() => {
		loading.value = false
	}, 1500)
}
</script>