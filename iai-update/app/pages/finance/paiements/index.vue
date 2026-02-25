<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h2 class="text-2xl font-bold mb-4">Paiements étudiants</h2>

    <div class="flex justify-between mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher..."
        class="px-4 py-2 border rounded w-64"
      />
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Ajouter un paiement
      </button>
    </div>

    <Vue3Datatable
      :columns="columns"
      :rows="paiements"
      :search="searchQuery"
      skin="bh-table-striped bh-table-hover"
    >
      <template #action="{ value }">
        <div class="flex gap-2">
          <button
            @click="openEditModal(value)"
            class="px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Edit
          </button>
          <button
            @click="deletePayment(value.id)"
            class="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </template>
    </Vue3Datatable>

    <!-- Modal d'ajout/édition -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <div class="fixed inset-0 bg-black/60" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md bg-white p-5 rounded-xl">
            <DialogTitle class="text-lg font-bold mb-4">
              {{ modalTitle }}
            </DialogTitle>

            <form @submit.prevent="savePayment" class="space-y-4">
              <div>
                <label class="block mb-1">Étudiant</label>
                <select v-model="form.etudiant" class="w-full border rounded px-3 py-2">
                  <option v-for="e in etudiants" :key="e.id" :value="e.nom">
                    {{ e.nom }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block mb-1">Mode de paiement</label>
                <select v-model="form.mode" class="w-full border rounded px-3 py-2">
                  <option value="caisse">À la caisse</option>
                  <option value="banque">Banque</option>
                </select>
              </div>

              <div v-if="form.mode === 'banque'">
                <div>
                  <label class="block mb-1">Nom de la banque</label>
                  <input v-model="form.banque" type="text" class="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label class="block mb-1">Numéro du reçu</label>
                  <input v-model="form.numero_recu" type="text" class="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label class="block mb-1">Date du paiement</label>
                  <input v-model="form.date_paiement" type="date" class="w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div class="flex justify-end gap-3">
                <button type="button" @click="closeModal" class="px-4 py-2 border rounded">Annuler</button>
                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded">
                  Enregistrer
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from "@headlessui/vue";

// Simulation des étudiants
const etudiants = ref([
  { id: 1, nom: "Alice" },
  { id: 2, nom: "Bob" },
  { id: 3, nom: "Charlie" },
]);

// Paiements par défaut (simulation)
const paiements = ref([
  { id: 1, etudiant: "Alice", mode: "caisse", banque: "", numero_recu: "", date_paiement: "" },
  { id: 2, etudiant: "Bob", mode: "banque", banque: "UBA", numero_recu: "12345", date_paiement: "2026-02-19" },
]);

const searchQuery = ref("");
const showModal = ref(false);
const modalTitle = ref("Ajouter un paiement");
const form = ref({ id: null, etudiant: "", mode: "caisse", banque: "", numero_recu: "", date_paiement: "" });

const columns = [
  { field: "etudiant", title: "Étudiant", visible: true },
  { field: "mode", title: "Mode de paiement", visible: true },
  { field: "banque", title: "Banque", visible: true },
  { field: "numero_recu", title: "Numéro du reçu", visible: true },
  { field: "date_paiement", title: "Date de paiement", visible: true },
  { field: "action", title: "Actions", visible: true },
];

const openAddModal = () => {
  modalTitle.value = "Ajouter un paiement";
  form.value = { id: null, etudiant: "", mode: "caisse", banque: "", numero_recu: "", date_paiement: "" };
  showModal.value = true;
};

const openEditModal = (p) => {
  modalTitle.value = "Modifier le paiement";
  form.value = { ...p };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const savePayment = () => {
  if(form.value.id) {
    // Modifier
    const index = paiements.value.findIndex(p => p.id === form.value.id);
    if(index !== -1) paiements.value[index] = { ...form.value };
  } else {
    // Ajouter
    form.value.id = paiements.value.length + 1;
    paiements.value.push({ ...form.value });
  }
  closeModal();
};

const deletePayment = (id) => {
  if(confirm("Voulez-vous supprimer ce paiement ?")) {
    paiements.value = paiements.value.filter(p => p.id !== id);
  }
};
</script>
