<!-- components/Breadcrumb.vue -->
<template>
	<div class="w-full">
		<!-- Breadcrumb -->
		<nav class="w-full" aria-label="Fil d'Ariane">
			<ol
				class="flex items-center flex-wrap list-none p-0 m-0 cursor-pointer"
				:class="[textSize, alignClasses]"
			>
				<li
					v-for="(item, index) in items"
					:key="index"
					class="flex items-center"
				>
					<component
						:is="item.to ? 'NuxtLink' : 'span'"
						:to="item.to"
						class="transition-colors duration-200 no-underline whitespace-nowrap"
						:class="[
							index === items.length - 1
								? ['cursor-pointer', activeColor]
								: [linkColor, 'hover:underline'],
						]"
					>
						{{ item.label }}
					</component>
					<span
						v-if="index < items.length - 1"
						class="mx-2 text-gray-400"
						aria-hidden="true"
					>
						{{ separator }}
					</span>
				</li>
			</ol>
		</nav>

		<!-- Titre -->
		<h1
			v-if="title"
			class="font-semibold text-gray-900 text-xl md:text-2xl text-gray-800 mt-2"
			:class="[titleClass, spacing]"
		>
			{{ title }}
		</h1>
		<slot v-else name="title" />
	</div>
</template>

<script setup>
	// Props du composant
	const props = defineProps({
		// Tableau des items du breadcrumb
		items: {
			type: Array,
			required: true,
			validator: (items) => {
				return items.every(
					(item) =>
						typeof item === "object" &&
						item.label &&
						typeof item.label === "string",
				);
			},
		},

		// Titre de la page (optionnel)
		title: {
			type: String,
			default: null,
		},

		// Classes supplémentaires pour le titre
		titleClass: {
			type: [String, Array, Object],
			default: "",
		},

		// Séparateur personnalisé
		separator: {
			type: String,
			default: "/",
		},

		// Couleur des liens (tailwind classes)
		linkColor: {
			type: String,
			default: "text-gray-500 hover:text-gray-700",
		},

		// Couleur du lien actif
		activeColor: {
			type: String,
			default: "text-gray-900",
		},

		// Espacement entre le breadcrumb et le titre
		spacing: {
			type: String,
			default: "mb-4",
		},

		// Taille du texte
		textSize: {
			type: String,
			default: "text-sm",
		},

		// Alignement
		align: {
			type: String,
			default: "left",
			validator: (value) => ["left", "center", "right"].includes(value),
		},
	});

	// Classes d'alignement basées sur la prop align
	const alignClasses = computed(() => {
		const alignMap = {
			left: "justify-start text-left",
			center: "justify-center text-center",
			right: "justify-end text-right",
		};
		return alignMap[props.align];
	});
</script>
