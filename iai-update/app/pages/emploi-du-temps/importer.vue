<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- En-tête élégant -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11v4m0 0l-2-2m2 2l2-2" />
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
          Import planning
        </h1>
        <p class="text-slate-500 text-base sm:text-lg">
          Importez votre emploi du temps au format Excel
        </p>
      </div>

      <!-- Carte principale -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        
        <!-- Zone de dépôt de fichier -->
        <div class="p-6 sm:p-8">
          <div 
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            @drop.prevent="handleDrop"
            :class="[
              'relative rounded-xl transition-all duration-300 cursor-pointer',
              dragOver 
                ? 'bg-blue-50 border-2 border-blue-400 shadow-lg scale-[1.01]' 
                : 'bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-slate-50',
              file ? 'bg-green-50/50 border-green-300 border-2' : ''
            ]"
            @click="triggerFileInput"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx,.xls"
              @change="handleFile"
              class="hidden"
            />
            
            <div class="p-8 sm:p-12 text-center">
              <!-- État sans fichier -->
              <div v-if="!file" class="space-y-4">
                <div class="flex justify-center">
                  <div class="relative">
                    <div class="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20"></div>
                    <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-slate-700 font-medium text-lg">Déposez votre fichier ici</p>
                  <p class="text-slate-400 text-sm mt-1">ou cliquez pour parcourir</p>
                </div>
                <div class="flex justify-center gap-3 text-xs text-slate-400">
                  <span class="px-2 py-1 bg-slate-100 rounded-md">.xlsx</span>
                  <span class="px-2 py-1 bg-slate-100 rounded-md">.xls</span>
                  <span class="px-2 py-1 bg-slate-100 rounded-md">Max 10MB</span>
                </div>
              </div>

              <!-- État avec fichier -->
              <div v-else class="space-y-4">
                <div class="flex justify-center">
                  <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-green-600 font-medium text-lg">Fichier prêt</p>
                  <div class="flex items-center justify-center gap-2 mt-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-slate-600 text-sm font-medium">{{ file.name }}</span>
                    <span class="text-slate-400 text-xs">({{ formatFileSize(file.size) }})</span>
                    <button 
                      @click.stop="removeFile"
                      class="ml-1 p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton d'import -->
          <button
            @click="importer"
            :disabled="!file || calendarStore.isLoading"
            class="mt-8 w-full py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
            :class="[
              !file || calendarStore.isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 active:translate-y-0'
            ]"
          >
            <svg v-if="calendarStore.isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <svg v-else class="w-5 h-5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>{{ calendarStore.isLoading ? 'Importation en cours...' : 'Importer l\'emploi du temps' }}</span>
          </button>

          <!-- Message de succès -->
          <transition 
            enter-active-class="transition duration-300 ease-out" 
            enter-from-class="transform opacity-0 -translate-y-2" 
            enter-to-class="opacity-100 translate-y-0" 
            leave-active-class="transition duration-200 ease-in" 
            leave-from-class="opacity-100 translate-y-0" 
            leave-to-class="transform opacity-0 -translate-y-2"
          >
            <div v-if="successMessage" class="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-sm text-emerald-800 flex-1">{{ successMessage }}</p>
                <button @click="successMessage = ''" class="text-emerald-600 hover:text-emerald-800">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </transition>

          <!-- Messages d'erreur -->
          <div v-if="errors.length" class="mt-6 space-y-2">
            <div v-for="(err, idx) in errors" :key="idx" class="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-sm text-rose-800 flex-1">{{ err }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section guide -->
        <div class="border-t border-slate-200 bg-slate-50/50 px-6 py-5 sm:px-8">
          <div class="flex flex-col sm:flex-row gap-6">
            <!-- Format requis -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-sm font-semibold text-slate-700">Structure du fichier</h3>
              </div>
              <ul class="space-y-1.5 text-xs text-slate-500">
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Jour • Heure début • Heure fin • Cours</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Salle • Enseignant • Classe</span>
                </li>
              </ul>
            </div>

            <!-- Format dates -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 class="text-sm font-semibold text-slate-700">Formats acceptés</h3>
              </div>
              <ul class="space-y-1.5 text-xs text-slate-500">
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Date : <code class="px-1.5 py-0.5 bg-white rounded text-blue-600 font-mono">JJ/MM/AAAA</code></span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Heure : <code class="px-1.5 py-0.5 bg-white rounded text-blue-600 font-mono">HH:MM</code> (24h)</span>
                </li>
              </ul>
            </div>

            <!-- Télécharger modèle -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <h3 class="text-sm font-semibold text-slate-700">Besoin d'aide ?</h3>
              </div>
              <button 
                @click="downloadTemplate"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 group"
              >
                <span>Télécharger le modèle Excel</span>
                <svg class="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer discret -->
      <div class="mt-8 text-center">
        <p class="text-xs text-slate-400">
          Les données sont traitées de manière sécurisée
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCalendarStore } from "~~/stores/calendar";

const calendarStore = useCalendarStore();
const fileInput = ref(null);
const file = ref(null);
const dragOver = ref(false);
const errors = ref([]);
const successMessage = ref("");

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFile = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    validateAndSetFile(selectedFile);
  }
};

const handleDrop = (e) => {
  dragOver.value = false;
  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) {
    validateAndSetFile(droppedFile);
  }
};

const validateAndSetFile = (selectedFile) => {
  const maxSize = 10 * 1024 * 1024;
  if (selectedFile.size > maxSize) {
    errors.value = ["Le fichier dépasse la taille maximale de 10MB"];
    setTimeout(() => { errors.value = []; }, 5000);
    return;
  }

  const validExtensions = [".xlsx", ".xls"];
  const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
  
  if (validExtensions.includes(extension)) {
    file.value = selectedFile;
    errors.value = [];
    successMessage.value = "";
  } else {
    errors.value = ["Format non supporté. Veuillez utiliser un fichier Excel (.xlsx ou .xls)"];
    setTimeout(() => { errors.value = []; }, 5000);
  }
};

const removeFile = () => {
  file.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const downloadTemplate = () => {
  // À implémenter selon votre besoin
  // window.open('/template-emploi-du-temps.xlsx', '_blank');
};

const importer = async () => {
  errors.value = [];
  successMessage.value = "";

  if (!file.value) {
    errors.value.push("Veuillez sélectionner un fichier Excel");
    setTimeout(() => { errors.value = []; }, 5000);
    return;
  }

  try {
    const response = await calendarStore.importCalendar(file.value);
    successMessage.value = response.data.message || "L'emploi du temps a été importé avec succès";
    
    setTimeout(() => {
      removeFile();
      setTimeout(() => {
        successMessage.value = "";
      }, 4000);
    }, 2000);

    if (response.data.errors) {
      errors.value = response.data.errors;
    }
  } catch (error) {
    console.error(error);
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      errors.value.push("Une erreur est survenue lors de l'import. Vérifiez le format du fichier.");
    }
    setTimeout(() => { errors.value = []; }, 5000);
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>