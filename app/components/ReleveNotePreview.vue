<template>
  <div class="bg-white rounded-md overflow-hidden text-black font-serif relative shadow-sm" style="max-width: 800px; margin: 0 auto; padding: 40px; background: white; border: 1px solid #e2e8f0;">
    
    <div id="releve-preview-content" class="relative pb-8">
    
    <!-- Watermark Logo (placé sur la première page pour éviter la coupure du saut de page) -->
    <div v-if="releve.logo_url" class="absolute z-0 flex justify-center opacity-10 pointer-events-none" style="top: 300px; left: 0; width: 100%;">
      <img :src="'/api/proxy-image?url=' + encodeURIComponent(releve.logo_url)" style="width: 450px; max-width: 80%; object-fit: contain;" />
    </div>

    <div class="relative z-10">
      <!-- Headers -->
      <div class="flex justify-between items-start text-[11px] leading-tight">
        <div class="text-center w-64">
          <p class="whitespace-pre-line">{{ releve.configurations?.ministere_tutelle || 'MINISTERE DE L\'ENSEIGNEMENT\nSUPERIEUR ET DE LA RECHERCHE' }}</p>
          <!-- Logo can be dynamic -->
          <div class="mt-4 mb-2 flex justify-center">
            <img v-if="releve.logo_url" :src="'/api/proxy-image?url=' + encodeURIComponent(releve.logo_url)" class="h-24 object-contain" />
            <div v-else class="h-24 flex items-center justify-center flex-col leading-tight">
               <div class="flex items-end gap-1">
                 <div class="w-3 h-8" style="background-color: #3b82f6;"></div>
                 <div class="w-3 h-12" style="background-color: #22d3ee;"></div>
                 <div class="w-3 h-6" style="background-color: #3b82f6;"></div>
                 <div class="w-3 h-10" style="background-color: #22d3ee;"></div>
               </div>
               <span class="font-bold text-3xl mt-1 tracking-widest" style="color: #1e3a8a;">{{ releve.configurations?.sigle_etablissement || 'ESCEN' }}</span>
            </div>
          </div>
        </div>
        <div class="text-center w-72">
          <p>{{ releve.configurations?.republique || 'REPUBLIQUE TOGOLAISE' }}<br><span class="italic text-[10px]">{{ releve.configurations?.devise || 'Travail - Liberté - Patrie' }}</span></p>
          <div class="mt-6" style="color: #1e3a8a;">
            <h1 class="text-[15px] font-bold leading-tight uppercase whitespace-pre-line" style="font-family: 'Times New Roman', Times, serif;">{{ releve.configurations?.nom_de_etablissement || 'ÉCOLE SUPÉRIEURE DE COMMERCE\nET D\'ÉCONOMIE NUMÉRIQUE' }}</h1>
            <p class="text-[10px] mt-2 font-bold" style="color: #000000;">Agrément : {{ releve.configurations?.agrement || 'N° 0102/2021/MESR/SG/DES' }}</p>
          </div>
        </div>
      </div>

      <!-- Title Box -->
      <div class="mt-4 border border-black flex items-stretch">
        <div class="w-1/2 border-r border-black p-2 flex items-center justify-center">
          <h2 class="text-xl font-bold uppercase tracking-widest">{{ documentTitle }}</h2>
        </div>
        <div class="w-1/2 p-2 flex flex-col justify-center items-center text-xs">
          <span>Année académique</span>
          <span class="font-bold">{{ releve.annee_scolaire }}</span>
        </div>
      </div>

      <!-- Info Boxes -->
      <div class="mt-4 flex gap-4 text-xs">
        <!-- Left Box -->
        <div class="w-1/2 border border-black p-3 leading-relaxed flex flex-col justify-center">
          <div class="flex"><span class="w-[110px] text-right font-bold underline">Titulaire</span> <span class="font-bold ml-2 mr-4">:</span> <span></span></div>
          <div class="flex mt-1"><span class="w-[110px] text-right font-bold">Nom & Prénoms</span> <span class="font-bold ml-2 mr-4">:</span> <span class="uppercase font-bold flex-1">{{ releve.etudiant?.nom }} {{ releve.etudiant?.prenom }}</span></div>
          <div class="flex mt-1"><span class="w-[110px] text-right font-bold">Né le</span> <span class="font-bold ml-2 mr-4">:</span> <span class="font-bold flex-1"></span></div> 
          <div class="flex mt-1"><span class="w-[110px] text-right font-bold">Matricule</span> <span class="font-bold ml-2 mr-4">:</span> <span class="font-bold flex-1">{{ releve.etudiant?.matricule }}</span></div>
        </div>
        <!-- Right Box -->
        <div class="w-1/2 border border-black p-3 leading-relaxed flex flex-col justify-center">
          <div class="flex"><span class="w-[80px] text-right font-bold underline">Niveau</span> <span class="font-bold ml-2 mr-4">:</span> <span class="font-bold flex-1">{{ releve.etudiant?.dernier_groupe?.niveau?.nom || releve.etudiant?.dernier_groupe?.niveau?.libelle || '' }}</span></div>
          <div class="flex mt-1"><span class="w-[80px] text-right font-bold underline">Semestres</span> <span class="font-bold ml-2 mr-4">:</span> <span class="uppercase font-bold flex-1">{{ releve.periode }}</span></div>
          <div class="flex mt-1"><span class="w-[80px] text-right font-bold underline">Filière</span> <span class="font-bold ml-2 mr-4">:</span> <span class="uppercase font-bold flex-1">{{ releve.etudiant?.dernier_groupe?.filiere?.nom || releve.etudiant?.dernier_groupe?.filiere || '' }}</span></div>
        </div>
      </div>

      <!-- Grades Table -->
      <div class="mt-4">
        <table class="w-full text-[11px] border-collapse border border-black text-center">
          <thead>
            <tr class="font-bold" style="background-color: #f3f4f6;">
              <th class="border border-black p-1 w-16 uppercase">Code</th>
              <th class="border border-black p-1 text-left px-2 uppercase">Unite d'enseignement(ue)</th>
              <th class="border border-black p-1 w-14 uppercase">Credits</th>
              <th v-if="hasDevoirs" class="border border-black p-1 w-14 uppercase">Devoir</th>
              <th class="border border-black p-1 w-14 uppercase">Examen</th>
              <th class="border border-black p-1 w-16 uppercase">Moy/20</th>
              <th class="border border-black p-1 w-16 uppercase">Validee</th>
            </tr>
          </thead>
          <tbody>
            <!-- Semester Title Row (Gray) -->
            <tr class="font-bold uppercase" style="background-color: #e5e7eb;">
              <td :colspan="hasDevoirs ? 7 : 6" class="border border-black p-1">{{ releve.periode }}</td>
            </tr>
            
            <!-- Rows per UVs -->
            <template v-for="(ue, index) in releve.ues" :key="index">
              <template v-for="(uv, uvIdx) in ue.uvs" :key="ue.ue + '-' + uvIdx">
                <tr>
                  <td class="border border-black p-1 text-center font-bold">{{ uv.code }}</td>
                  <td class="border border-black p-1 text-left px-2 font-bold">{{ uv.nom }}</td>
                  <td class="border border-black p-1">{{ uv.coefficient }}</td>
                  <td v-if="hasDevoirs" class="border border-black p-1">{{ parseFloat(uv.poids_devoir) === 0 || uv.devoir === null ? '-' : uv.devoir }}</td>
                  <td class="border border-black p-1">{{ uv.examen === null ? '-' : uv.examen }}</td>
                  <td class="border border-black p-1 font-bold">{{ uv.moyenne_uv }}</td>
                  <td class="border border-black p-1">{{ parseFloat(uv.moyenne_uv) >= 10 ? 'V' : 'NV' }}</td>
                </tr>
              </template>
            </template>

            <!-- Totals Row -->
            <tr class="font-bold uppercase" style="background-color: #f3f4f6;">
              <td colspan="2" class="border border-black p-1 text-center">Total Credits</td>
              <td class="border border-black p-1">{{ releve.total_coefficients }}</td>
              <td :colspan="hasDevoirs ? 3 : 2" class="border border-black p-1 text-center">Total Valides</td>
              <td class="border border-black p-1">{{ releve.total_credits_valides }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Totals and Signature -->
      <div class="mt-6 flex justify-between text-xs items-end">
        <div class="w-2/5 border border-black flex flex-col text-[10px]">
          <div class="flex border-b border-black">
            <span class="w-[145px] shrink-0 whitespace-nowrap border-r border-black p-1 font-bold italic">Total crédits :</span>
            <span class="p-1 w-full text-center font-bold" style="background-color: #e5e7eb;">{{ releve.total_coefficients }}</span>
          </div>
          <div class="flex border-b border-black">
            <span class="w-[145px] shrink-0 whitespace-nowrap border-r border-black p-1 font-bold italic">Total crédits validés :</span>
            <span class="p-1 w-full text-center font-bold" style="background-color: #e5e7eb;">{{ releve.total_credits_valides }}</span>
          </div>
          <div class="flex border-b border-black">
            <span class="w-[145px] shrink-0 whitespace-nowrap border-r border-black p-1 font-bold italic">Total des points :</span>
            <span class="p-1 w-full text-center font-bold" style="background-color: #e5e7eb;">{{ releve.total_notes_ponderees }}</span>
          </div>
          <div class="flex border-b border-black">
            <span class="w-[145px] shrink-0 whitespace-nowrap border-r border-black p-1 font-bold italic">Moyenne générale :</span>
            <span class="p-1 w-full text-center font-bold" style="background-color: #e5e7eb;">{{ releve.moyenne_generale }}</span>
          </div>
          <div class="flex">
            <span class="w-[145px] shrink-0 whitespace-nowrap border-r border-black p-1 font-bold italic">Mention :</span>
            <span class="p-1 w-full text-center font-bold" style="background-color: #e5e7eb;">
              {{ getMention(releve.moyenne_generale) }}
            </span>
          </div>
        </div>
        
        <div class="w-1/5 flex justify-center pb-2">
          <img :src="'/api/proxy-image?url=' + encodeURIComponent(`https://quickchart.io/qr?text=${encodeURIComponent('http://localhost:3000/verify-releve/' + releve.slug)}&size=100`)" alt="QR Code" class="w-24 h-24" />
        </div>

        <div class="w-2/5 flex flex-col items-center text-[11px]">
            <p class="italic mb-6">Lomé, le {{ formatDate(releve.date_generation) }}</p>
            <p class="mb-12 font-bold">{{ releve.configurations?.titre_du_directeur_des_etudes || 'Le Directeur Académique,' }}</p>
            <p class="font-bold">{{ releve.configurations?.nom_complet_du_directeur_des_etudes || 'AGBODJAN-FIOVI Edoé Ata' }}</p>
        </div>
      </div>

      <!-- Very bottom footer -->
      <div class="mt-8 pt-2 border-t-[3px] text-center text-[10px] font-sans tracking-wide" style="color: #6b7280; border-color: #9ca3af;">
        {{ releve.configurations?.adresse_physique || 'Tokoin Wuiti' }}, Tél {{ releve.configurations?.telephone || '(228) 98 01 27 27 / 92 30 87 87' }} - 
        <span class="underline" style="color: #60a5fa;">{{ releve.configurations?.email_contact || 'hello@escen.university' }}</span> - 
        <span class="underline" style="color: #60a5fa;">{{ releve.configurations?.email_admission || 'admission@escen.university' }}</span> - 
      </div>
    </div>
  </div>
  </div>
  
  <!-- Actions bar (non-print) -->
  <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 no-print mt-4">
    <button @click="$emit('close')" :disabled="isDownloading" class="px-6 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
      Fermer
    </button>
    <button @click="downloadPDF" :disabled="isDownloading" class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
      <svg v-if="isDownloading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      {{ isDownloading ? 'Génération en cours...' : 'Télécharger PDF' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close'])

const props = defineProps({
  releve: {
    type: Object,
    required: true
  },
  documentTitle: {
    type: String,
    default: 'RELEVE DE NOTES'
  }
})

const hasDevoirs = computed(() => {
  if (props.releve?.configurations?.examens_uniquement == 1 || props.releve?.configurations?.examens_uniquement === '1' || props.releve?.configurations?.examens_uniquement === true) {
    return false;
  }
  if (!props.releve || !props.releve.ues) return true; // default
  for (const ue of props.releve.ues) {
    if (ue.uvs) {
      for (const uv of ue.uvs) {
        if (parseFloat(uv.poids_devoir) > 0) return true;
      }
    }
  }
  return false;
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const getMention = (moyenneGenerale) => {
  const moyenne = parseFloat(moyenneGenerale);
  if (isNaN(moyenne)) return '';
  if (moyenne < 10) return 'Médiocre';
  if (moyenne < 12) return 'Passable';
  if (moyenne < 14) return 'Assez Bien';
  if (moyenne < 16) return 'Bien';
  if (moyenne < 18) return 'Très Bien';
  return 'Excellent';
}

const isDownloading = ref(false)

const downloadPDF = async () => {
  if (process.client) {
    isDownloading.value = true;
    
    // Laisser le temps à Vue de mettre à jour l'UI
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const element = document.getElementById('releve-preview-content')
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Releve_${props.releve.etudiant?.nom}_${props.releve.periode}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          scrollY: 0,
          windowY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }
      
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule
      
      // Utilisation de callbacks/then pour éviter le blocage si la promesse ne se résout pas bien
      html2pdf().set(opt).from(element).save().then(() => {
        setTimeout(() => {
          isDownloading.value = false;
        }, 500); // Petit délai pour laisser le navigateur souffler
      }).catch((err) => {
        console.error('Erreur PDF:', err);
        alert('Erreur lors de la génération du PDF: ' + (err.message || 'Erreur inconnue'));
        isDownloading.value = false;
      });
    } catch (err) {
      console.error('Erreur PDF:', err)
      alert('Erreur lors de la génération du PDF: ' + (err.message || 'Erreur inconnue'))
      isDownloading.value = false;
    }
  }
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .bg-gray-200 {
    background-color: #e5e7eb !important;
    -webkit-print-color-adjust: exact;
  }
}
</style>
