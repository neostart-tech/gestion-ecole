<template>
	<div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-6">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
				<div>
					<h1 class="text-2xl md:text-3xl font-bold text-gray-900">
						Dashboard Universitaire
					</h1>
					<p class="text-gray-600 mt-2">
						Vue d'ensemble des statistiques académiques
					</p>
				</div>
				
				<div class="flex items-center gap-3">
					<div class="text-right">
						<p class="text-sm font-medium text-gray-900">Année 2023-2024</p>
						<p class="text-xs text-gray-500">Semestre 2</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Cartes de Statistiques Principales -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Effectif Total -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 mb-1">Étudiants</p>
						<p class="text-3xl font-bold text-gray-900">8,542</p>
					</div>
					<div class="p-3 bg-blue-100 rounded-xl">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
						</svg>
					</div>
				</div>
				<div class="mt-4 flex items-center">
					<svg class="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
					</svg>
					<span class="text-sm text-green-600 font-medium">+5.2%</span>
					<span class="text-sm text-gray-500 ml-2">vs 2023</span>
				</div>
			</div>

			<!-- Filières -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 mb-1">Filières</p>
						<p class="text-3xl font-bold text-gray-900">24</p>
					</div>
					<div class="p-3 bg-green-100 rounded-xl">
						<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
						</svg>
					</div>
				</div>
				<div class="mt-4 flex items-center">
					<svg class="w-4 h-4 text-orange-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<span class="text-sm text-orange-600 font-medium">+2 nouvelles</span>
				</div>
			</div>

			<!-- Taux de Réussite -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 mb-1">Réussite</p>
						<p class="text-3xl font-bold text-gray-900">88.7%</p>
					</div>
					<div class="p-3 bg-purple-100 rounded-xl">
						<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
				</div>
				<div class="mt-4 flex items-center">
					<svg class="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
					</svg>
					<span class="text-sm text-green-600 font-medium">+3.1%</span>
					<span class="text-sm text-gray-500 ml-2">vs S1</span>
				</div>
			</div>

			<!-- Enseignants -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 mb-1">Enseignants</p>
						<p class="text-3xl font-bold text-gray-900">312</p>
					</div>
					<div class="p-3 bg-orange-100 rounded-xl">
						<svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
						</svg>
					</div>
				</div>
				<div class="mt-4">
					<div class="flex items-center justify-between text-sm">
						<span class="text-gray-600">Permanents</span>
						<span class="font-medium text-gray-900">248</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Cartes de Répartition -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
			<!-- Répartition par Cycle -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par Cycle</h3>
				<div class="space-y-4">
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span class="text-gray-700">Licence</span>
							<span class="font-medium text-gray-900">5,128 étudiants</span>
						</div>
						<div class="h-3 bg-gray-200 rounded-full overflow-hidden">
							<div class="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style="width: 60%"></div>
						</div>
					</div>
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span class="text-gray-700">Master</span>
							<span class="font-medium text-gray-900">3,414 étudiants</span>
						</div>
						<div class="h-3 bg-gray-200 rounded-full overflow-hidden">
							<div class="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" style="width: 40%"></div>
						</div>
					</div>
				</div>
				<div class="mt-6 grid grid-cols-2 gap-4">
					<div class="text-center p-3 bg-blue-50 rounded-xl">
						<p class="text-2xl font-bold text-blue-600">5,128</p>
						<p class="text-sm text-gray-600">Licence</p>
					</div>
					<div class="text-center p-3 bg-purple-50 rounded-xl">
						<p class="text-2xl font-bold text-purple-600">3,414</p>
						<p class="text-sm text-gray-600">Master</p>
					</div>
				</div>
			</div>

			<!-- Performance par Faculté -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Performance par Faculté</h3>
				<div class="space-y-4">
					<div v-for="faculty in faculties" :key="faculty.id">
						<div class="flex justify-between text-sm mb-1">
							<span class="text-gray-700">{{ faculty.name }}</span>
							<span class="font-medium text-gray-900">{{ faculty.rate }}%</span>
						</div>
						<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
							<div 
								:class="['h-full rounded-full', faculty.color]" 
								:style="{ width: `${faculty.rate}%` }"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Cartes de Détails -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<!-- Groupes -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Groupes Pédagogiques</h3>
				<div class="text-center mb-4">
					<p class="text-4xl font-bold text-gray-900">186</p>
					<p class="text-sm text-gray-600">Groupes actifs</p>
				</div>
				<div class="space-y-3">
					<div class="flex justify-between items-center">
						<span class="text-gray-600">Taux d'occupation</span>
						<span class="font-medium text-gray-900">85%</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-gray-600">Moyenne/groupe</span>
						<span class="font-medium text-gray-900">46 étudiants</span>
					</div>
				</div>
			</div>

			<!-- Cours du Jour -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Cours Aujourd'hui</h3>
				<div class="space-y-3">
					<div v-for="(course, index) in todayCourses" :key="index" class="p-3 bg-gray-50 rounded-lg">
						<div class="flex justify-between items-start">
							<div>
								<p class="font-medium text-gray-900">{{ course.name }}</p>
								<div class="flex items-center gap-2 mt-1">
									<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
									<span class="text-sm text-gray-600">{{ course.time }}</span>
								</div>
							</div>
							<span :class="[
								'px-2 py-1 rounded text-xs font-medium',
								course.type === 'cours' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
							]">
								{{ course.type }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Prochaines Échéances -->
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Prochaines Échéances</h3>
				<div class="space-y-3">
					<div v-for="deadline in deadlines" :key="deadline.id" class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
						<div class="p-2 bg-indigo-100 rounded-lg">
							<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path v-if="deadline.type === 'exam'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
								<path v-if="deadline.type === 'meeting'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
							</svg>
						</div>
						<div>
							<p class="font-medium text-gray-900">{{ deadline.title }}</p>
							<p class="text-sm text-gray-600">{{ deadline.date }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-12 pt-8 border-t border-gray-200">
			<div class="text-center text-sm text-gray-500">
				© 2024 Université Excellence - Dashboard académique
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

// Données des facultés
const faculties = ref([
	{ id: 1, name: 'Sciences & Tech', rate: 92, color: 'bg-blue-500' },
	{ id: 2, name: 'Droit', rate: 87, color: 'bg-purple-500' },
	{ id: 3, name: 'Économie', rate: 89, color: 'bg-green-500' },
	{ id: 4, name: 'Lettres', rate: 85, color: 'bg-orange-500' },
]);

// Cours du jour
const todayCourses = ref([
	{ name: 'Algorithmique', time: '08:30-10:30', type: 'cours' },
	{ name: 'Comptabilité', time: '10:45-12:45', type: 'td' },
	{ name: 'Droit des sociétés', time: '14:00-16:00', type: 'cours' },
]);

// Échéances
const deadlines = ref([
	{ id: 1, title: 'Examens finaux', date: 'Dans 15 jours', type: 'exam' },
	{ id: 2, title: 'Conseil de faculté', date: 'Demain', type: 'meeting' },
	{ id: 3, title: 'Rentrée universitaire', date: '2 septembre', type: 'meeting' },
]);
</script>

<style scoped>
/* Animations simples */
.hover-lift {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
	.grid-cols-4 {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 640px) {
	.grid-cols-4 {
		grid-template-columns: 1fr;
	}
}
</style>