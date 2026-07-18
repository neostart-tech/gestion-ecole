<template>
	<div></div>
</template>

<script setup>
	import { useParametreStore } from "~~/stores/parametre";

	const parametreStore = useParametreStore();
	const logoUrl = computed(() => parametreStore.getAppLogo);

	// Injecte le favicon dans le <head> une fois le logo chargé
	onMounted(async () => {
		if (parametreStore.parametres.length === 0) {
			await parametreStore.fetchParametres();
		}
		if (logoUrl.value) {
			const link =
				document.querySelector("link[rel*='icon']") ||
				document.createElement("link");
			link.rel = "icon";
			link.href = logoUrl.value;
			document.head.appendChild(link);
		}
	});
</script>
