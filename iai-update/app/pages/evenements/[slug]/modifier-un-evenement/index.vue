<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8 md:py-12">
      
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <NuxtLink to="/evenements/liste" class="hover:text-[#7C86FF] transition-colors">Événements</NuxtLink>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-700">Modifier l'événement</span>
      </div>

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight">
            Modifier : {{ form.nom || 'Chargement...' }}
          </h1>
          <p class="text-gray-500 mt-1">Mettez à jour les détails de votre événement.</p>
        </div>
        <button 
          @click="goBack" 
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 hover:border-[#7C86FF]/30 transition-all text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la liste
        </button>
      </div>

      <!-- Loader -->
      <div v-if="isLoading" class="border border-gray-200 rounded-2xl bg-white p-12 flex flex-col items-center justify-center">
        <div class="w-10 h-10 border-2 border-gray-200 border-t-[#7C86FF] rounded-full animate-spin"></div>
        <p class="text-gray-500 mt-4 font-medium text-sm">Chargement de l'événement...</p>
      </div>

      <!-- Form Card -->
      <div v-else class="border border-gray-200 rounded-2xl bg-white">
        <form @submit.prevent="submitForm" class="p-6 md:p-8 space-y-8">
          
          <!-- Section 01 : Informations de base -->
          <div class="space-y-5">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div class="w-6 h-6 rounded-full bg-[#7C86FF]/10 text-[#7C86FF] flex items-center justify-center text-xs font-semibold">1</div>
              <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Informations Générales</h2>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'événement <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.nom"
                type="text"
                required
                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C86FF]/20 focus:border-[#7C86FF] transition-all text-gray-800 placeholder:text-gray-400"
                placeholder="Ex: Conférence sur l'IA 2026"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date de début <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="form.start_date"
                  type="datetime-local"
                  required
                  class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C86FF]/20 focus:border-[#7C86FF] transition-all text-gray-800"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin <span class="text-gray-400 text-xs font-normal">(Optionnel)</span>
                </label>
                <input
                  v-model="form.end_date"
                  type="datetime-local"
                  class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C86FF]/20 focus:border-[#7C86FF] transition-all text-gray-800"
                />
              </div>
            </div>
          </div>

          <!-- Section 02 : Paramètres de visibilité -->
          <div class="space-y-5">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div class="w-6 h-6 rounded-full bg-[#7C86FF]/10 text-[#7C86FF] flex items-center justify-center text-xs font-semibold">2</div>
              <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Ciblage & Visibilité</h2>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Visibilité & Diffusion <span class="text-red-400">*</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  type="button" 
                  v-for="d in destinations" :key="d.value"
                  @click="form.destination = d.value"
                  class="px-4 py-3 rounded-lg border transition-all text-sm font-medium text-left"
                  :class="form.destination === d.value 
                    ? 'border-[#7C86FF] bg-[#7C86FF]/5 text-[#7C86FF]' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'"
                >
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-3 h-3 rounded-full"
                      :class="form.destination === d.value ? 'bg-[#7C86FF]' : 'bg-gray-300'"
                    ></div>
                    {{ d.label }}
                  </div>
                </button>
              </div>
              <p class="text-xs text-gray-400 mt-2">
                Précisez si l'événement doit être visible par les utilisateurs internes ou sur le site public.
              </p>
            </div>
          </div>

          <!-- Section 03 : Media & Contenu -->
          <div class="space-y-5">
            <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div class="w-6 h-6 rounded-full bg-[#7C86FF]/10 text-[#7C86FF] flex items-center justify-center text-xs font-semibold">3</div>
              <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Médias & Contenu</h2>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Image de couverture <span class="text-gray-400 text-xs font-normal">(Optionnel)</span>
              </label>
              <div 
                @click="$refs.imageInput.click()"
                class="relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 hover:border-[#7C86FF]/50 transition-all aspect-video flex items-center justify-center bg-gray-50"
              >
                <img v-if="imagePreview || form.image_url" :src="imagePreview || form.image_url" class="w-full h-full object-cover" />
                <div v-else class="text-center p-6">
                  <div class="w-12 h-12 rounded-full bg-white border border-gray-200 mx-auto mb-3 flex items-center justify-center text-gray-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-sm font-medium text-gray-500">Cliquez pour modifier l'image</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG ou GIF (Max. 5Mo)</p>
                </div>
                <input type="file" ref="imageInput" class="hidden" accept="image/*" @change="handleImage" />
              </div>
            </div>

            <!-- Rich Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description de l'événement <span class="text-red-400">*</span>
              </label>
              <div class="min-h-[300px] border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#7C86FF]/20 focus-within:border-[#7C86FF] transition-all">
                <ClientOnly>
                  <EditorTinyMCE v-model="form.details" />
                  <template #fallback>
                    <div class="h-64 flex items-center justify-center bg-gray-50 text-gray-400 font-medium">
                      Chargement de l'éditeur...
                    </div>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              @click="goBack"
              class="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2.5 rounded-lg bg-[#7C86FF] text-white font-medium hover:bg-[#6B76F0] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Mise à jour en cours...' : "Mettre à jour l'événement" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvenementStore } from "~~/stores/evenement";
import EditorTinyMCE from "~/components/EditorTinyMCE.vue";

const route = useRoute();
const router = useRouter();
const evenementStore = useEvenementStore();
const { $toastr } = useNuxtApp();

const isLoading = ref(true);
const isSubmitting = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);

const form = ref({
  id: null,
  nom: "",
  start_date: "",
  end_date: "",
  details: "",
  type: "internal",
  destination: "all",
  image_url: null
});

const destinations = [
  { label: 'Intranet', value: 'intranet' },
  { label: 'Site web', value: 'website' },
  { label: 'Partout (Public)', value: 'all' }
];

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const loadEvenement = async () => {
  isLoading.value = true;
  try {
    const slug = route.params.slug;
    const data = await evenementStore.fetchEvenement(slug);
    form.value = {
      id: data.id,
      nom: data.nom || "",
      start_date: formatDateForInput(data.date_debut || data.start_date),
      end_date: data.date_fin ? formatDateForInput(data.date_fin) : "",
      details: data.details || "",
      type: data.type || "internal",
      destination: data.destination || "all",
      image_url: data.image_url || null
    };
  } catch (error) {
    $toastr.error("Impossible de charger l'événement");
    goBack();
  } finally {
    isLoading.value = false;
  }
};

const handleImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    $toastr.warning("Fichier trop lourd (Max 5Mo)");
    return;
  }
  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => imagePreview.value = ev.target.result;
  reader.readAsDataURL(file);
};

const submitForm = async () => {
  if (!form.value.nom?.trim() || !form.value.details?.trim() || !form.value.start_date) {
    return $toastr.warning("Veuillez remplir tous les champs obligatoires");
  }

  isSubmitting.value = true;
  try {
    const fd = new FormData();
    fd.append("nom", form.value.nom);
    fd.append("start_date", form.value.start_date);
    fd.append("end_date", form.value.end_date || "");
    fd.append("details", form.value.details);
    fd.append("type", form.value.destination === 'intranet' ? 'internal' : 'public');
    fd.append("destination", form.value.destination);
    fd.append("_method", "PUT");

    if (imageFile.value) {
      fd.append("image", imageFile.value);
    }

    await evenementStore.updateEvenement(form.value.id, fd);
    $toastr.success("Événement mis à jour avec succès !");
    goBack();
  } catch (error) {
    console.error("Erreur update event:", error);
    $toastr.error("Erreur lors de la mise à jour de l'événement.");
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => router.push("/evenements/liste");

onMounted(loadEvenement);
</script>

<style scoped>
/* Styles pour l'éditeur TinyMCE avec la couleur personnalisée */
:deep(.tox-tinymce) {
  border: none !important;
}

:deep(.tox-editor-header) {
  border-bottom: 1px solid #e5e7eb !important;
  background-color: #fafafa !important;
}

:deep(.tox .tox-edit-area__iframe) {
  background-color: white !important;
}

:deep(.tox .tox-toolbar__primary) {
  background-color: #fafafa !important;
}

:deep(.tox .tox-button--primary) {
  background-color: #7C86FF !important;
}

:deep(.tox .tox-button--primary:hover) {
  background-color: #6B76F0 !important;
}

:deep(.tox .tox-collection__item--active) {
  background-color: #7C86FF20 !important;
}

:deep(.tox .tox-statusbar) {
  border-top: 1px solid #e5e7eb !important;
}
</style>