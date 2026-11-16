<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Administration', to: '/' },
        { label: 'Membres', to: '/personnel/utilisateurs' },
        { label: 'Ajouter', to: null },
      ]"
      title="Ajouter un utilisateur"
      title-class="text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-6"
    />

    <!-- Formulaire -->
    <form
      @submit.prevent="submitUser"
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-5"
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
        <ClientOnly>
          <EditorTinyMCE
            v-model="form.biographie"
            :height="250"
            :menubar="false"
          />
        </ClientOnly>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Roles *
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

      <!-- Section spécifique Enseignant si le rôle sélectionné est un enseignant -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isEnseignantSelected"
          class="space-y-5 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <!-- Bannière informative -->
          <div
            class="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center space-x-3"
          >
            <div
              class="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                Informations complémentaires de l'enseignant
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Nationalité, fiscalité et documents justificatifs
              </p>
            </div>
          </div>

          <!-- Nationalité -->
          <div>
            <NationaliteSelector
              v-model="form.nationalite"
              label="Nationalité"
              helpText="Sélectionnez la nationalité de l'enseignant"
            />
          </div>

          <!-- NIF - Apparaît si nationalité est Togo -->
          <div
            v-if="form.nationalite === 'Togo'"
            class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/40"
          >
            <div class="flex items-center space-x-2 mb-2">
              <svg
                class="w-5 h-5 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Informations fiscales
              </h4>
            </div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Numéro d'identification fiscale (NIF)
              <span class="text-xs text-gray-500 font-normal">(Optionnel)</span>
            </label>
            <input
              v-model="form.nif"
              type="text"
              placeholder="Ex: 1234567890"
              class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Le numéro d'identification fiscale est optionnel pour les professeurs de nationalité togolaise
            </p>
          </div>

          <!-- Documents justificatifs (Tous optionnels) -->
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Documents justificatifs <span class="text-xs text-gray-500 font-normal">(Optionnels)</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Pièce d'identité -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Pièce d'identité ou passeport
                  <span class="text-xs text-gray-500 font-normal">(Optionnel)</span>
                </label>
                <FileUpload
                  id="user-identity-doc"
                  v-model="form.identity_document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :required="false"
                  :max-size="5"
                />
              </div>

              <!-- Document NIF (si Togo) -->
              <div v-if="form.nationalite === 'Togo'">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Justificatif du NIF
                  <span class="text-xs text-gray-500 font-normal">(Optionnel)</span>
                </label>
                <FileUpload
                  id="user-nif-doc"
                  v-model="form.nif_document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :required="false"
                  :max-size="5"
                />
              </div>

              <!-- Diplômes -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Diplômes et certificats
                  <span class="text-xs text-gray-500 font-normal">(Optionnel)</span>
                </label>
                <FileUpload
                  id="user-diploma-doc"
                  v-model="form.diploma_document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :required="false"
                  :max-size="10"
                />
              </div>

              <!-- CV -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Curriculum Vitae (CV)
                  <span class="text-xs text-gray-500 font-normal">(Optionnel)</span>
                </label>
                <FileUpload
                  id="user-cv-doc"
                  v-model="form.cv_document"
                  accept=".pdf,.doc,.docx"
                  :required="false"
                  :max-size="5"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>

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
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useUserStore } from "~~/stores/user";
import { useRoleStore } from "~~/stores/role";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
import EditorTinyMCE from "~/components/EditorTinyMCE.vue";
import FileUpload from "~/components/FileUpload.vue";
import NationaliteSelector from "~/components/NationaliteSelector.vue";
import { useNuxtApp } from "#app";

const userStore = useUserStore();
const roleStore = useRoleStore();
const router = useRouter();
const { $swal } = useNuxtApp();

const form = ref({
  nom: "",
  prenom: "",
  email: "",
  tel: "",
  genre: "",
  supervisor_type: "non_surveillant",
  biographie: "",
  roles: [],
  nationalite: "Togo",
  nif: "",
  identity_document: null,
  nif_document: null,
  diploma_document: null,
  cv_document: null,
});

// Détecte si le rôle sélectionné contient un rôle enseignant / professeur
const isEnseignantSelected = computed(() => {
  if (!form.value.roles || !form.value.roles.length) return false;
  return form.value.roles.some((roleId) => {
    const role = roleStore.roles.find((r) => r.id === roleId);
    if (!role) return false;
    const slug = (role.slug || "").toLowerCase();
    const nom = (role.nom || "").toLowerCase();
    return (
      role.id === 2 ||
      slug.includes("enseignant") ||
      slug.includes("professeur") ||
      nom.includes("enseignant") ||
      nom.includes("professeur")
    );
  });
});

// Watch pour réinitialiser le NIF si la nationalité n'est plus Togo
watch(
  () => form.value.nationalite,
  (newValue) => {
    if (newValue !== "Togo") {
      form.value.nif = "";
      form.value.nif_document = null;
    }
  }
);

const prepareFormData = () => {
  const formData = new FormData();
  const textFields = [
    "nom",
    "prenom",
    "email",
    "tel",
    "genre",
    "supervisor_type",
    "biographie",
  ];
  textFields.forEach((field) => {
    if (form.value[field]) formData.append(field, form.value[field]);
  });

  if (form.value.roles && form.value.roles.length) {
    form.value.roles.forEach((roleId) => {
      formData.append("roles[]", roleId);
    });
  }

  if (isEnseignantSelected.value) {
    if (form.value.nationalite) formData.append("nationalite", form.value.nationalite);
    if (form.value.nif?.trim()) formData.append("nif", form.value.nif.trim());
    if (form.value.identity_document) formData.append("identity_document", form.value.identity_document);
    if (form.value.nif_document) formData.append("nif_document", form.value.nif_document);
    if (form.value.diploma_document) formData.append("diploma_document", form.value.diploma_document);
    if (form.value.cv_document) formData.append("cv_document", form.value.cv_document);
  }

  return formData;
};

const submitUser = async () => {
  try {
    const payload = prepareFormData();
    await userStore.addUser(payload);

    $swal.fire({
      icon: "success",
      title: "Utilisateur créé avec succès",
      timer: 1500,
      showConfirmButton: false,
    });

    navigateTo("/personnel/utilisateurs");
  } catch (error) {
    // Gère uniquement les erreurs 422 de validation
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
      // Autres erreurs réseau / serveur
      if (typeof $swal !== "undefined") {
        $swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible d'ajouter l'utilisateur.",
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
  await roleStore.fetchRoles();
});
</script>
