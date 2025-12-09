<template>
	<div class="mb-1">
		<!-- Item sans enfants -->
		<div v-if="!item.children || item.children.length === 0">
			<a
				:href="item.path || '#'"
				class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
			>
				<!-- Icon -->
				<svg
					class="w-5 h-5 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						:d="item.icon"
					/>
				</svg>

				<!-- Texte -->
				<span
					v-if="themeStore.isSidebarOpen || themeStore.isMobileSidebarOpen"
					class="ml-3 flex-1"
					>{{ item.title }}</span
				>

				<!-- Badge -->
				<span
					v-if="item.badge"
					class="ml-auto bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium px-2 py-0.5 rounded-full"
				>
					{{ item.badge }}
				</span>
			</a>
		</div>

		<!-- Item avec enfants -->
		<div v-else>
			<!-- Bouton parent -->
			<button
				@click="toggleOpen"
				class="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
			>
				<div class="flex items-center">
					<!-- Icon -->
					<svg
						class="w-5 h-5 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							:d="item.icon"
						/>
					</svg>

					<!-- Texte -->
					<span
						v-if="themeStore.isSidebarOpen || themeStore.isMobileSidebarOpen"
						class="ml-3 text-left"
						>{{ item.title }}</span
					>
				</div>

				<!-- Flèche -->
				<svg
					v-if="themeStore.isSidebarOpen || themeStore.isMobileSidebarOpen"
					class="w-4 h-4 transition-transform duration-200"
					:class="{ 'transform rotate-180': isOpen }"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<!-- Sous-items -->
			<div
				v-if="
					(themeStore.isSidebarOpen || themeStore.isMobileSidebarOpen) && isOpen
				"
				class="ml-8 mt-1 space-y-1"
			>
				<a
					v-for="child in item.children"
					:key="child.title"
					:href="child.path || '#'"
					class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
				>
					{{ child.title }}
				</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { MenuItem } from "../../types";
	import { useThemeStore } from "../../stores/theme";

	const props = defineProps<{
		item: MenuItem;
	}>();

	const themeStore = useThemeStore();
	const isOpen = ref(false);

	const toggleOpen = () => {
		isOpen.value = !isOpen.value;
	};
</script>
