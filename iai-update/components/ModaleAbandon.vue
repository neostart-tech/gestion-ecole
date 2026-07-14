<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="close" class="relative z-[99]">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-2xl transition-all border border-slate-100 dark:border-gray-700">
              
              <!-- Header -->
              <div class="mb-8">
                <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mb-4 animate-bounce">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <DialogTitle class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  Déclarer Abandon de Dossier
                </DialogTitle>
                <p class="text-slate-500 dark:text-gray-400 text-sm font-semibold mt-1">
                  Arrêter les prélèvements et régulariser le compte de <span class="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-dotted">{{ student?.etudiant }}</span>
                </p>
              </div>

              <!-- Form -->
              <form @submit.prevent="submit" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date effective</label>
                    <input v-model="form.date_abandon" type="date" required class="w-full bg-slate-50 dark:bg-gray-700 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-red-500 transition-all outline-none" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Motif Principal</label>
                    <select v-model="form.motif" class="w-full bg-slate-50 dark:bg-gray-700 border-none rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-red-500 transition-all outline-none">
                      <option value="depart_volontaire">Départ volontaire</option>
                      <option value="difficultes_financieres">Difficultés financières</option>
                      <option value="exclusion">Exclusion administrative</option>
                      <option value="sante">Raison de santé</option>
                    </select>
                  </div>
                </div>

                <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20">
                  <p class="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-4">Régularisation Financière (Solde restant nul)</p>
                  <div class="flex items-center justify-between text-sm mb-4">
                    <span class="text-slate-600 dark:text-gray-300 font-bold">Dette Actuelle (Scolarité)</span>
                    <span class="text-slate-900 dark:text-white font-black">{{ formatMontant(student?.reste) }}</span>
                  </div>
                  <div class="relative">
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Dette effective à l'abandon (sera le montant final dû)</label>
                    <input v-model="form.montant_final" type="number" placeholder="Montant à conserver au dossier" class="w-full bg-white dark:bg-gray-800 border-2 border-red-100 dark:border-red-900/30 rounded-xl py-3 px-4 text-lg font-black text-red-600 focus:border-red-500 transition-all outline-none" />
                  </div>
                  <p class="text-[9px] text-red-400 mt-2 font-bold italic">Note: Le système annulera automatiquement les futures tranches au-delà de ce montant.</p>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Commentaire interne</label>
                  <textarea v-model="form.commentaire" rows="3" class="w-full bg-slate-50 dark:bg-gray-700 border-none rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-slate-300 transition-all outline-none resize-none" placeholder="Détails supplémentaires..."></textarea>
                </div>

                <!-- Footer Actions -->
                <div class="flex gap-4 pt-4">
                  <button type="button" @click="close" class="flex-1 py-4 bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 font-black rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest">
                    Annuler
                  </button>
                  <button type="submit" :disabled="loading" class="flex-[2] py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                     <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     {{ loading ? 'Synchronisation...' : 'Confirmer l\'Abandon' }}
                  </button>
                </div>
              </form>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';

const props = defineProps(['show', 'student']);
const emit = defineEmits(['close', 'success']);
const { $axios, $swal } = useNuxtApp();

const loading = ref(false);
const form = ref({
  date_abandon: new Date().toISOString().substr(0, 10),
  motif: 'depart_volontaire',
  montant_final: 0,
  commentaire: ''
});

onMounted(() => {
  if (props.student) {
    // Par défaut, on garde ce qui est déjà payé comme montant final du (dette soldée à l'état actuel)
    form.value.montant_final = props.student.montant_paye;
  }
});

const close = () => emit('close');

const formatMontant = (m) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(m).replace('XOF', 'FCFA');

const submit = async () => {
  loading.value = true;
  try {
    await $axios.post(`/finance/${props.student.id}/abandon`, {
      date_abandon: form.value.date_abandon,
      montant_scolarite: form.value.montant_final,
      montant_inscription: 0, // Optionnel ici car déjà payé en général
      commentaire: `[${form.value.motif}] ${form.value.commentaire}`
    });
    
    $swal.fire({
      icon: 'success',
      title: 'Abandon Acté',
      text: 'Le dossier a été clôturé et les finances synchronisées.',
      confirmButtonColor: '#4f46e5'
    });
    
    emit('success');
    close();
  } catch (e) {
    console.error(e);
    $swal.fire('Erreur', 'Impossible de clôturer le dossier.', 'error');
  } finally {
    loading.value = false;
  }
};
</script>
