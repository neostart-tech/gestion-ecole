<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Membres', to: '/personnel/utilisateurs' },
        { label: 'Modifier', to: null },
      ]"
      :title="`Modification des informations de: ${userStore.user ? userStore.user.nom + ' ' + userStore.user.prenom : 'Utilisateur inconnu'}`"
      title-class="text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <!-- Formulaire -->
    <div v-if="!loading" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <form
        @submit.prevent="submitUser"
        class="space-y-5"
      >
        <!-- Nom -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >Nom *</label
        >
        <input
          v-model="form.nom"
          type="text"
          placeholder="Nom"
          required
          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Prénoms -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >Prénoms *</label
        >
        <input
          v-model="form.prenom"
          type="text"
          placeholder="Prénom(s)"
          required
          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >Email *</label
        >
        <input
          v-model="form.email"
          type="email"
          placeholder="Adresse mail"
          required
          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Téléphone -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >Numéro de téléphone *</label
        >
        <input
          v-model="form.tel"
          type="text"
          placeholder="Numéro de téléphone"
          required
          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Genre -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >Genre *</label
        >
        <select
          v-model="form.genre"
          required
          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>Choisir le genre</option>
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
        </select>
      </div>

      <!-- Type de Surveillant -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >Type de Surveillant</label
        >
        <select
          v-model="form.supervisor_type"
          class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="non_surveillant">Non surveillant</option>
          <option value="interne">Interne</option>
          <option value="externe">Externe</option>
        </select>
      </div>

      <!-- Biographie -->
      <div>
        <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1"
          >Biographie</label
        >
        <Editor
          api-key="ktf8z0z55enm2wd9xyeoo6qzzoy7w9b629e51wii9y8lw4dx"
          v-model="form.biographie"
          :init="{
            height: 250,
            menubar: false,
            plugins: 'lists link image media table wordcount',
            toolbar:
              'undo redo | bold italic underline | bullist numlist | link image media | removeformat',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Roles
        </label>
        <MultiSelect
          v-model="form.roles"
          display="chip"
          :options="rolesOptions"
          optionLabel="label"
          optionValue="value"
          multiple
          filter
          placeholder="Sélectionner les roles"
          class="w-full"
        />
      </div>

      <!-- Bouton Soumettre -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="userStore.isLoading"
          class="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="userStore.isLoading">Enregistrement...</span>
          <span v-else>Soumettre</span>
        </button>
      </div>
      </form>
    </div>
    <!-- Loading Spinner -->
    <div v-else class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div class="py-10 text-center">
        <svg class="mx-auto h-10 w-10 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <p class="mt-3 text-gray-600 dark:text-gray-400">Chargement des données, veuillez patienter...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "~~/stores/user";
import { useRoleStore } from "~~/stores/role";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Editor from "@tinymce/tinymce-vue";
import { useNuxtApp } from "#app";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const roleStore = useRoleStore();
const router = useRouter();
const route = useRoute();
const { $swal, $toastr } = useNuxtApp();

const loading = ref(true);

const form = ref({
  nom: "",
  prenom: "",
  email: "",
  tel: "",
  genre: "",
  supervisor_type: "non_surveillant",
  biographie: "",
  roles: [],
});

const userSlug = ref(route.params.slug);

const submitUser = async () => {
  try {
    // Update existing user with PUT/PATCH
    await userStore.updateUser(userSlug.value, form.value);

    $swal.fire({
      icon: "success",
      title: "",
      timer: 1500,
      showConfirmButton: false,
    });

    navigateTo("/personnel/utilisateurs");
  } catch (error) {
    // Handle 422 validation errors
    if (error.response && error.response.status === 422) {
      const messages = Object.entries(error.response.data.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
        .join("<br>");
      if (typeof $swal !== "undefined") {
        $swal.fire({
          icon: "error",
          title: "Erreur de validation",
          html: messages,
        });
      }
    } else {
      // Other network / server errors
      if (typeof $swal !== "undefined") {
        $swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de modifier l'utilisateur.",
        });
      }
    }
  }
};

const rolesOptions = computed(() => {
  return roleStore.roles.map((r) => ({
    label: r.nom,
    value: r.id,
  }));
});



onMounted(async () => {
  try {
    loading.value = true;
    
    // Fetch roles and user data in parallel
    await Promise.all([
      roleStore.fetchRoles(),
      userStore.EditUser(userSlug.value),
    ]);

    // Populate form with fetched user data
    if (userStore.user) {
      const user = userStore.user;
      form.value = {
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        tel: user.tel || "",
        genre: user.genre || "",
        supervisor_type: user.supervisor_type || "non_surveillant",
        biographie: user.biographie || "",
        // Extract role IDs from roles array
        roles: user.roles?.map(r => r.id) || [],
      };
    }

    loading.value = false;
  } catch (error) {
    console.error("Error loading user data:", error);
    $toastr.error("Erreur lors du chargement des données");
    loading.value = false;
  }
});
</script>
