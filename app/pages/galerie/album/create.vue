<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">
    <div class="max-w-3xl mx-auto">

      <!-- Fil d'Ariane -->
      <nav class="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <NuxtLink to="/galerie" class="flex items-center gap-1.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Galerie
        </NuxtLink>
        <svg class="w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span class="text-gray-600 dark:text-gray-300">Nouvel album</span>
      </nav>

      <!-- En-tête -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <PlusIcon class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Créer un nouvel album</h1>
        </div>
        <p class="text-sm text-gray-400 dark:text-gray-500 pl-12">
          Définissez un nom, une description et une image de couverture.
        </p>
      </div>

      <!-- Grid principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Formulaire -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <form @submit.prevent="sauvegarder" class="space-y-5">

              <!-- Nom -->
              <div>
                <label class="form-label">Nom de l'album <span class="text-red-500">*</span></label>
                <UiInput
                  v-model="form.name"
                  placeholder="Ex : Remise des diplômes 2024"
                  :error="soumis && !form.name ? 'Le nom est requis' : ''"
                  required
                />
              </div>

              <!-- Description -->
              <div>
                <label class="form-label">Description</label>
                <textarea
                  v-model="form.description"
                  rows="5"
                  placeholder="Racontez l'histoire de cet album…"
                  maxlength="500"
                  class="field w-full resize-none"
                />
                <p class="text-[11px] text-gray-400 dark:text-gray-500 text-right mt-1">
                  {{ form.description.length }} / 500 caractères
                </p>
              </div>

              <hr class="border-gray-100 dark:border-gray-800" />

              <!-- Actions -->
              <div class="flex justify-end gap-2">
                <button type="button" @click="$router.push('/galerie')" class="btn-ghost">
                  Annuler
                </button>
                <button type="submit" :disabled="loading" class="btn-primary">
                  <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
                    <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ loading ? 'Création…' : "Créer l'album" }}
                </button>
              </div>

            </form>
          </div>
        </div>

        <!-- Sidebar couverture -->
        <div>
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <span class="form-label block mb-4">Image de couverture</span>

            <!-- Zone d'upload -->
            <label
              for="album-cover"
              class="upload-zone group"
              :class="{ 'upload-zone-active': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="onDrop"
            >
              <!-- Prévisualisation -->
              <div v-if="previewUrl" class="w-full">
                <img :src="previewUrl" alt="Couverture" class="w-full h-36 object-cover rounded-lg mb-3"/>
                <p class="text-xs text-center text-gray-400">Cliquer pour changer</p>
              </div>

              <!-- Upload vide -->
              <template v-else>
                <div class="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-950/60 transition-colors">
                  <svg class="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Déposer une image</p>
                <p class="text-xs text-gray-400">ou cliquer pour parcourir</p>
                <p class="text-[11px] text-gray-300 dark:text-gray-600 mt-0.5">JPG, PNG, WEBP · max 5 Mo</p>
              </template>
            </label>

            <input
              id="album-cover"
              type="file"
              accept="image/*"
              class="sr-only"
              @change="onFileChange"
            />

            <!-- Info -->
            <div class="mt-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-lg p-3 flex gap-2">
              <svg class="w-4 h-4 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
                Choisissez une image représentative. Elle sera affichée sur la page principale de la galerie.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { PlusIcon } from "@heroicons/vue/24/outline";
import { useGalerieStore } from "~~/stores/galerie";
import { useToast } from "primevue/usetoast";
import Swal from "sweetalert2";

const router = useRouter();
const toast = useToast();
const galerieStore = useGalerieStore();

const form = ref({ name: "", description: "", cover: null });
const loading = ref(false);
const soumis = ref(false);
const previewUrl = ref(null);
const isDragging = ref(false);

const handleFile = (file) => {
  if (!file || !file.type.startsWith("image/")) return;
  if (file.size > 5 * 1024 * 1024) {
    toast.add({ severity: "warn", summary: "Fichier trop lourd", detail: "Max 5 Mo autorisé", life: 3000 });
    return;
  }
  form.value.cover = file;
  previewUrl.value = URL.createObjectURL(file);
};

const onFileChange = (e) => handleFile(e.target.files[0]);
const onDrop = (e) => {
  isDragging.value = false;
  handleFile(e.dataTransfer.files[0]);
};

const sauvegarder = async () => {
  soumis.value = true;
  if (!form.value.name) return;

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("description", form.value.description || "");
    if (form.value.cover) formData.append("cover", form.value.cover);

    await galerieStore.addAlbum(formData);

    await Swal.fire({
      title: "Album créé !",
      text: "L'album a été créé avec succès.",
      icon: "success",
      confirmButtonColor: "#7c3aed",
    });

    router.push("/galerie");
  } catch (error) {
    console.error("Erreur création album:", error);
    toast.add({ severity: "error", summary: "Erreur", detail: "Impossible de créer l'album", life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@reference "~/assets/css/main.css";

.form-label {
  @apply text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5;
}
.field {
  @apply w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all;
}
.btn-primary {
  @apply inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium
    hover:bg-violet-700 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-ghost {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
    text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}
.upload-zone {
  @apply flex flex-col items-center gap-2 p-5 rounded-xl border border-dashed
    border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50
    cursor-pointer transition-all text-center;
}
.upload-zone:hover,
.upload-zone-active {
  @apply border-violet-400 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20;
}
</style>