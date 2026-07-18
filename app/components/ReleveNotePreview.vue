<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800" id="releve-preview-content">
    <!-- Header: Entête Académique -->
    <div class="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
      <div class="flex justify-between items-start mb-8">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <img v-if="releve.logo_url" :src="releve.logo_url" alt="Logo" class="w-12 h-12 object-contain" />
            <span v-else class="text-white font-black text-2xl italic tracking-tighter">IAI</span>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">
              Institut Africain d'Informatique
            </h2>
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Excellence - Innovation - Leadership
            </p>
          </div>
        </div>
        <div class="text-right">
          <div class="px-3 py-1 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm mb-2 inline-block">
            Relevé de Notes Officiel
          </div>
          <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
            {{ releve.annee_scolaire }} • {{ releve.periode }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8 items-end">
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
            <img v-if="releve.etudiant?.image" :src="releve.etudiant.image" alt="Student" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
              <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
              {{ releve.etudiant?.nom }} {{ releve.etudiant?.prenom }}
            </h3>
            <p class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">
              Matricule: {{ releve.etudiant?.matricule || 'N/A' }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {{ releve.etudiant?.dernier_groupe?.filiere?.nom || releve.etudiant?.dernier_groupe?.filiere || 'Filière non définie' }} - 
              {{ releve.etudiant?.dernier_groupe?.niveau?.nom || releve.etudiant?.dernier_groupe?.niveau?.libelle || releve.etudiant?.dernier_groupe?.niveau || 'Niveau non défini' }}
            </p>
            <div class="mt-1 flex items-center gap-2">
              <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-bold uppercase">
                {{ releve.etudiant?.dernier_groupe?.group?.nom || releve.etudiant?.dernier_groupe?.group || 'Groupe non défini' }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center min-w-[120px]">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Moyenne Générale</p>
            <p class="text-3xl font-black text-indigo-600 dark:text-indigo-400">{{ releve.moyenne_generale }}</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center min-w-[120px]">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Crédits Validés</p>
            <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ releve.total_credits_valides }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table: Corps du Relevé -->
    <div class="p-8">
      <div class="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800 text-white">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Unité d'Enseignement / Matières</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Devoir</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Examen</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Moyenne</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Coef</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Note Pond.</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Crédit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <template v-for="(ue, index) in releve.ues" :key="index">
              <!-- Ligne UE (Section) -->
              <tr class="bg-slate-50/80 dark:bg-slate-800/40">
                <td colspan="3" class="px-6 py-3">
                  <span class="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{{ ue.ue }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="[
                    'text-[11px] font-black px-2 py-0.5 rounded-md',
                    parseFloat(ue.moyenne_ue) >= 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  ]">
                    {{ ue.moyenne_ue }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">-</td>
                <td class="px-4 py-3 text-center">-</td>
                <td class="px-4 py-3 text-center">
                   <span class="text-[11px] font-black text-slate-700 dark:text-slate-300">{{ ue.credit }}</span>
                </td>
              </tr>
              <!-- Lignes UV (Matières) -->
              <tr v-for="(uv, uvIdx) in ue.uvs" :key="uvIdx" class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                <td class="px-10 py-3">
                  <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">{{ uv.nom }}</span>
                </td>
                <td class="px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-500">{{ uv.devoir }}</td>
                <td class="px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-500">{{ uv.examen }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="[
                    'text-xs font-bold',
                    parseFloat(uv.moyenne_uv) >= 10 ? 'text-emerald-600' : 'text-rose-500'
                  ]">
                    {{ uv.moyenne_uv }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center text-xs font-medium text-slate-500">{{ uv.coefficient }}</td>
                <td class="px-4 py-3 text-center text-xs font-black text-slate-700 dark:text-slate-300">{{ uv.note_ponderee }}</td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center">
                    <svg v-if="parseFloat(uv.moyenne_uv) >= 10" class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    <svg v-else class="w-4 h-4 text-rose-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot class="bg-slate-50/50 dark:bg-slate-800/30">
            <tr>
              <td colspan="4" class="px-6 py-6">
                <div class="flex gap-10">
                   <div class="flex flex-col">
                     <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Coefficients</span>
                     <span class="text-xl font-black text-slate-700 dark:text-white">{{ releve.total_coefficients }}</span>
                   </div>
                   <div class="flex flex-col">
                     <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Notes Pondérées</span>
                     <span class="text-xl font-black text-slate-700 dark:text-white">{{ releve.total_notes_ponderees }}</span>
                   </div>
                   <div class="flex flex-col">
                     <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de Génération</span>
                     <span class="text-xs font-bold text-slate-500 mt-1">{{ formatDate(releve.date_generation) }}</span>
                   </div>
                </div>
              </td>
              <td colspan="3" class="px-6 py-6 text-right">
                <div class="inline-block text-left border-l-4 border-indigo-600 pl-6">
                  <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Décision Académique</p>
                  <div class="flex items-center gap-3">
                    <span :class="[
                      'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm',
                      parseFloat(releve.moyenne_generale) >= 10 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-rose-600 text-white'
                    ]">
                      {{ parseFloat(releve.moyenne_generale) >= 10 ? 'Admis(e)' : 'Échec' }}
                    </span>
                    <span v-if="parseFloat(releve.moyenne_generale) >= 16" class="text-[10px] font-black text-amber-500 uppercase">Mention Très Bien</span>
                    <span v-else-if="parseFloat(releve.moyenne_generale) >= 14" class="text-[10px] font-black text-indigo-500 uppercase">Mention Bien</span>
                    <span v-else-if="parseFloat(releve.moyenne_generale) >= 12" class="text-[10px] font-black text-blue-500 uppercase">Mention Assez Bien</span>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Footer Signatures -->
      <div class="mt-12 grid grid-cols-3 gap-8">
        <div class="text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-16">L'Étudiant(e)</p>
          <div class="w-32 h-px bg-slate-200 mx-auto"></div>
        </div>
        <div class="text-center pt-8">
          <div class="w-24 h-24 border-2 border-indigo-100 dark:border-slate-700 rounded-full mx-auto flex items-center justify-center opacity-20">
            <span class="text-[10px] font-black text-indigo-300 uppercase rotate-12">Sceau IAI</span>
          </div>
        </div>
        <div class="text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-16">Le Directeur Académique</p>
          <div class="text-xs font-black text-slate-800 dark:text-white uppercase mb-2">P.O. Le Secrétaire Général</div>
          <div class="w-32 h-px bg-slate-200 mx-auto"></div>
        </div>
      </div>
    </div>
    
    <!-- Actions bar (non-print) -->
    <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 no-print">
      <button @click="downloadPDF" class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Télécharger PDF
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  releve: {
    type: Object,
    required: true
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const downloadPDF = async () => {
  if (process.client) {
    const element = document.getElementById('releve-preview-content')
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Releve_${props.releve.etudiant?.nom}_${props.releve.periode}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    // Dynamically import html2pdf
    try {
      const html2pdf = (await import('html2pdf.js')).default
      html2pdf().set(opt).from(element).save()
    } catch (err) {
      console.error('Erreur PDF:', err)
      alert('Erreur lors de la génération du PDF. Assurez-vous que les dépendances sont chargées.')
    }
  }
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .bg-slate-50\/50 {
    background-color: #f8fafc !important;
    -webkit-print-color-adjust: exact;
  }
}

.tracking-tighter {
  letter-spacing: -0.05em;
}

/* Custom scrollbar for preview */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
