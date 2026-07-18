<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <NuxtLink to="/partenaires/liste" class="hover:text-indigo-600 transition-colors">Partenaires</NuxtLink>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        <span class="text-slate-900">Ajouter un partenaire</span>
      </div>

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Ajouter un partenaire</h1>
          <p class="text-slate-500 mt-1 font-medium">Enregistrez un nouveau partenaire institutionnel ou commercial.</p>
        </div>
        <NuxtLink to="/partenaires/liste" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour à la liste
        </NuxtLink>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100">
        <form @submit.prevent="saveAdvertiser" class="space-y-10">
          
          <!-- Section Logo -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">01</div>
              <h2 class="text-lg font-black text-slate-800 uppercase tracking-wider">Logo du partenaire</h2>
            </div>
            <ImageUpload
              v-model="form.logo"
              label="Logo Officiel (Optionnel)"
              :error="uploadError"
              @error="uploadError = $event"
              class="max-w-xs"
            />
          </div>

          <!-- Section Détails -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">02</div>
              <h2 class="text-lg font-black text-slate-800 uppercase tracking-wider">Informations d'identification</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <label class="block text-sm font-black text-slate-700 uppercase tracking-tighter">Nom de l'entreprise <span class="text-rose-500">*</span></label>
                <input
                  v-model="form.nom"
                  type="text"
                  required
                  class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800 outline-none"
                  placeholder="Ex: Orange Cameroun"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-sm font-black text-slate-700 uppercase tracking-tighter">Adresse Email <span class="text-rose-500">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800 outline-none"
                  placeholder="contact@partenaire.com"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-sm font-black text-slate-700 uppercase tracking-tighter">Ville (Optionnel)</label>
                <input
                  v-model="form.ville"
                  type="text"
                  class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800 outline-none"
                  placeholder="Ex: Douala"
                />
              </div>

              <div class="space-y-4">
                <label class="block text-sm font-black text-slate-700 uppercase tracking-tighter">Site Web (Optionnel)</label>
                <input
                  v-model="form.site"
                  type="url"
                  class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800 outline-none"
                  placeholder="https://www.partenaire.com"
                />
              </div>
            </div>
          </div>

          <!-- Section Contenu -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">03</div>
              <h2 class="text-lg font-black text-slate-800 uppercase tracking-wider">Description & Partenariat</h2>
            </div>
            <div class="space-y-4">
              <label class="block text-sm font-black text-slate-700 uppercase tracking-tighter">Détails du partenariat (Optionnel)</label>
              <div class="editor-wrapper bg-slate-50 rounded-[2rem] overflow-hidden">
                <ClientOnly>
                  <EditorTinyMCE v-model="form.details" />
                </ClientOnly>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100">
            <button
               type="button"
               @click="navigateTo('/partenaires/liste')"
               class="flex-1 px-8 py-5 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="advertiserStore.isLoading"
              class="flex-[2] px-8 py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg v-if="advertiserStore.isLoading" class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>{{ advertiserStore.isLoading ? 'Enregistrement...' : "Ajouter le partenaire" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ImageUpload from "~/components/ImageUpload.vue";
import EditorTinyMCE from "~/components/EditorTinyMCE.vue";
import { useAdvertiserStore } from "~~/stores/adverstiser";

const advertiserStore = useAdvertiserStore();
const { $toastr } = useNuxtApp();

const form = ref({
  nom: "",
  email: "",
  ville: "",
  site: "",
  details: "",
  logo: null
});

const uploadError = ref("");

const validateForm = () => {
  if (!form.value.nom?.trim()) return $toastr.warning("Le nom est requis");
  if (!form.value.email?.trim()) return $toastr.warning("L'email est requis");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) return $toastr.warning("Format d'email invalide");
  return true;
};

const saveAdvertiser = async () => {
  if (!validateForm()) return;
  
  try {
    const formData = new FormData();
    formData.append('nom', form.value.nom);
    formData.append('email', form.value.email);
    formData.append('ville', form.value.ville || ''); // Envoyé comme vide si non saisi
    formData.append('site', form.value.site || '');
    formData.append('details', form.value.details || '');
    
    if (form.value.logo instanceof File) {
      formData.append('logo', form.value.logo);
    }

    await advertiserStore.addAdvertiser(formData);
    $toastr.success("Partenaire enregistré avec succès");
    navigateTo("/partenaires/liste");
  } catch (error) {
    console.error("Error save partner:", error);
    $toastr.error("Une erreur est survenue lors de l'enregistrement.");
  }
};
</script>