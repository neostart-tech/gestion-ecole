<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
	onMounted(() => {
		console.log("Theme debug:");
		console.log("HTML classes:", document.documentElement.classList);
		console.log(
			"Dark mode enabled?",
			document.documentElement.classList.contains("dark"),
		);
		console.log("Tailwind darkMode config:", "class");
	});
</script>
