<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">

    <!-- ===================== Breadcrumb ===================== -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
      <NuxtLink to="/admin/partenaires" class="cursor-pointer hover:text-indigo-600 transition-colors">
        Partenaires
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium cursor-default">Ajouter un partenaire</span>
    </div>

    <!-- ===================== Titre ===================== -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">Ajouter un partenaire</h1>
      <button @click="goBack" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour
      </button>
    </div>

    <!-- ===================== Formulaire ===================== -->
    <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <form @submit.prevent="submitForm" class="space-y-6">

        <!-- ===== Informations principales ===== -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom <span class="text-rose-500">*</span></label>
            <input v-model="form.nom" type="text" required class="w-full px-4 py-3 border rounded-lg" :class="{ 'border-rose-500': errors.nom }" />
            <p v-if="errors.nom" class="text-sm text-rose-600">{{ errors.nom }}</p>
          </div>
        </div>

        <!-- ===== Contact ===== -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email <span class="text-rose-500">*</span></label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-3 border rounded-lg" :class="{ 'border-rose-500': errors.email }" />
            <p v-if="errors.email" class="text-sm text-rose-600">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input v-model="form.telephone" type="tel" class="w-full px-4 py-3 border rounded-lg" />
          </div>
        </div>

        <!-- ===== Site web ===== -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Site web</label>
          <input v-model="form.siteWeb" type="url" class="w-full px-4 py-3 border rounded-lg" />
        </div>

        <!-- ===== Localisation ===== -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Localisation <span class="text-rose-500">*</span></label>
          <input v-model="form.localisation" type="text" required class="w-full px-4 py-3 border rounded-lg" :class="{ 'border-rose-500': errors.localisation }" />
        </div>

        <!-- ===== Biographie ===== -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Biographie <span class="text-rose-500">*</span></label>
          <Editor v-model="form.biographie" :api-key="tinymceApiKey" :init="editorConfig" />
          <p v-if="errors.biographie" class="text-sm text-rose-600">{{ errors.biographie }}</p>
        </div>

        <!-- ===== Domaines ===== -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Domaines</label>
          <div class="flex gap-2">
            <input v-model="newDomaine" @keyup.enter="addDomaine" class="flex-1 px-4 py-2 border rounded-lg" />
            <button type="button" @click="addDomaine" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Ajouter</button>
          </div>
        </div>

        <!-- ===== Actions ===== -->
        <div class="flex justify-end gap-4 pt-6 border-t">
          <button type="button" @click="goBack" class="px-6 py-3 border rounded-lg">Annuler</button>
          <button type="submit" class="px-6 py-3 bg-indigo-600 text-white rounded-lg">Publier</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const tinymceApiKey = 'zg2zugks07aopv32g7tny5709pnqww29mxbvn1oa8x7d78c7'

const editorConfig = { height: 400, menubar: true }

const form = ref({
  nom: '',
  email: '',
  telephone: '',
  siteWeb: '',
  localisation: '',
  biographie: '',
  domaines: []
})

const errors = ref({})
const newDomaine = ref('')

const addDomaine = () => {
  if (newDomaine.value) {
    form.value.domaines.push(newDomaine.value)
    newDomaine.value = ''
  }
}

const submitForm = () => {}
const goBack = () => navigateTo('/admin/partenaires')

onMounted(() => {
  form.value.biographie = '<p>Description du partenaire...</p>'
})
</script>

<style scoped>
:deep(.tox-tinymce) {
  border-radius: 0.5rem;
}
</style>
