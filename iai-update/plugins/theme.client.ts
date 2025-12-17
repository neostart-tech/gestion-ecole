// plugins/theme.client.ts
export default defineNuxtPlugin(async (nuxtApp) => {
	// S'exécute uniquement côté client
	if (process.client) {
		try {
			// Chemin relatif depuis le dossier plugins
			const { useThemeStore } = await import('../stores/theme')
			const themeStore = useThemeStore()
			
			// Charger l'état
			themeStore.loadState()
			
			console.log('🎨 Plugin de thème initialisé')
			console.log('📊 Paramètres:', themeStore.themeSettings)
			
			// Écouter les changements système
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
			
			const handleSystemThemeChange = () => {
				if (themeStore.themeSettings.mode === 'auto') {
					console.log('🔄 Changement de thème système détecté')
					themeStore.applyTheme()
				}
			}
			
			mediaQuery.addEventListener('change', handleSystemThemeChange)
			
			// Nettoyage
			nuxtApp.hook('app:beforeUnmount', () => {
				mediaQuery.removeEventListener('change', handleSystemThemeChange)
			})
			
		} catch (error) {
			console.error('❌ Erreur dans le plugin de thème:', error)
		}
	}
})