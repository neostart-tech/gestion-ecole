<template>
  <div id="emploi-du-temps-pdf" class="edt-page" :style="backgroundStyle">
    <!-- Logo en filigrane (arrière-plan) -->
    <div v-if="logoFinal" class="logo-watermark" :style="watermarkStyle"></div>

    <!-- EN-TÊTE avec logo -->
    <div class="edt-entete">
      <div class="entete-gauche">
        <div v-if="logoFinal" class="logo-container">
          <img
            :src="logoFinal"
            alt="Logo établissement"
            crossorigin="anonymous"
            class="logo-image"
            @error="handleImageError"
            @load="handleImageLoad"
          />
        </div>
        <div class="etablissement">{{ appName || "Établissement" }}</div>
        <div class="annee-scolaire">Année scolaire {{ anneeScolaire }}</div>
      </div>
      <div class="entete-centre">
        <div class="edt-titre">EMPLOI DU TEMPS</div>
        <div class="edt-sous-titre" v-if="groupeInfo">
          {{ groupeInfo.nom
          }}<span v-if="groupeInfo.niveau">
            — {{ groupeInfo.niveau.libelle }}</span
          >
        </div>
      </div>
      <div class="entete-droite">
        <div class="periode-label">Période</div>
        <div class="periode-valeur">{{ periode }}</div>
      </div>
    </div>

    <!-- TABLEAU -->
    <table class="edt-table">
      <thead>
        <tr>
          <th class="col-horaire">Horaire</th>
          <th v-for="jour in joursUniques" :key="jour.jour_fr" class="col-jour">
            <div class="jour-th-nom">{{ jour.jour_fr }}</div>
            <div class="jour-th-date">{{ jour.date_formatted }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(slot, si) in creneaux" :key="si">
          <td class="td-horaire">{{ slot }}</td>
          <td v-for="(jour, ji) in joursUniques" :key="ji" class="td-cours">
            <div
              v-for="(cours, ci) in getCoursSlot(jour, slot)"
              :key="ci"
              class="cours-cell"
            >
              <div class="cours-matiere">{{ cours.matiere }}</div>
              <div class="cours-prof">
                {{ cours.professeur || "À définir" }}
              </div>
              <div class="cours-salle">
                <template v-if="cours.est_virtuelle">
                  <a
                    :href="cours.lien_salle"
                    target="_blank"
                    class="cours-lien"
                  >
                    {{ cours.plateforme || "Visio" }} → rejoindre
                  </a>
                </template>
                <span v-else>{{ cours.salle_affichage }}</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- DEBUG: Afficher l'URL du logo -->
    <div style="display: none">{{ logoFinal }}</div>

    <!-- LÉGENDE -->
    <div class="edt-legende">
      <div class="legende-sep"></div>
      <div class="legende-meta">Imprimé le {{ dateGeneration }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from "vue";
import { useParametreStore } from "~~/stores/parametre";

// Récupérer le store
const parametreStore = useParametreStore();

// Props reçues du composant parent
const props = defineProps({
  coursOrganises: { type: Array, required: true },
  groupeInfo: { type: Object, default: null },
  dateDebut: { type: [Date, String], required: true },
  dateFin: { type: [Date, String], default: null },
  typeExport: { type: String, default: "tous" },
});

// États réactifs pour le logo
const appName = ref("");
const logoBrut = ref("");
const logoFinal = ref("");
const logoError = ref(false);
const logoLoaded = ref(false);

// Ordre des jours de la semaine
const ordreJours = {
  LUNDI: 1,
  MARDI: 2,
  MERCREDI: 3,
  JEUDI: 4,
  VENDREDI: 5,
  SAMEDI: 6,
  DIMANCHE: 7,
};

const joursUniques = computed(() => {
  const map = new Map();

  coursOrganisesTries.value.forEach((jour) => {
    if (!map.has(jour.jour_fr)) {
      map.set(jour.jour_fr, {
        jour_fr: jour.jour_fr,
        date_formatted: jour.date_formatted,
      });
    }
  });

  return Array.from(map.values());
});

// Trier les cours par ordre chronologique
const coursOrganisesTries = computed(() => {
  if (!props.coursOrganises) return [];
  return [...props.coursOrganises].sort((a, b) => {
    if (a.date_obj && b.date_obj) {
      const dateA = new Date(a.date_obj);
      const dateB = new Date(b.date_obj);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    }
    const jourA = a.jour_fr?.toUpperCase() || "";
    const jourB = b.jour_fr?.toUpperCase() || "";
    return (ordreJours[jourA] || 99) - (ordreJours[jourB] || 99);
  });
});

// Formater une date
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Période formatée
const periode = computed(() => {
  const debut = formatDate(props.dateDebut);
  if (!props.dateFin || props.dateFin === props.dateDebut) return debut;
  return `du ${debut} au ${formatDate(props.dateFin)}`;
});

// Année scolaire
const anneeScolaire = computed(() => {
  const y = new Date(props.dateDebut).getFullYear();
  return `${y} / ${y + 1}`;
});

// Date de génération
const dateGeneration = computed(() =>
  new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
);

// Style pour le filigrane
const backgroundStyle = computed(() => {
  if (!logoFinal.value || logoError.value) return {};
  return {
    position: "relative",
    overflow: "hidden",
  };
});

// Style pour le watermark
const watermarkStyle = computed(() => {
  if (!logoFinal.value || logoError.value) return {};
  return {
    backgroundImage: `url('${logoFinal.value}')`,
    backgroundRepeat: "repeat",
    backgroundSize: "150px 150px",
    backgroundPosition: "center",
    opacity: "0.08",
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "0",
  };
});

// Gérer les erreurs de chargement
const handleImageError = (e) => {
  console.warn("Erreur de chargement du logo:", e);
  console.log("URL qui a échoué:", logoFinal.value);
  logoError.value = true;
};

// Gérer le chargement réussi
const handleImageLoad = () => {
  console.log("Logo chargé avec succès:", logoFinal.value);
  logoLoaded.value = true;
};

const convertirImageBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Erreur conversion base64", e);
    return "";
  }
};
// Créneaux horaires
const creneaux = computed(() => {
  const set = new Set();
  props.coursOrganises.forEach((jour) => {
    jour.cours.forEach((cours) => {
      const h = cours.horaire ?? `${cours.heure_debut} - ${cours.heure_fin}`;
      set.add(h);
    });
  });
  return [...set].sort((a, b) => {
    const heureA = a.split(/[-–]/)[0].trim();
    const heureB = b.split(/[-–]/)[0].trim();
    const minutesA = convertirHeureEnMinutes(heureA);
    const minutesB = convertirHeureEnMinutes(heureB);
    return minutesA - minutesB;
  });
});

// Convertir heure en minutes
const convertirHeureEnMinutes = (heure) => {
  if (!heure) return 0;
  const parties = heure.split(":");
  if (parties.length === 2) {
    return parseInt(parties[0]) * 60 + parseInt(parties[1]);
  }
  return 0;
};

// Récupérer les cours pour un créneau
const getCoursSlot = (jour, slot) => {
  const data = coursOrganisesTries.value.find(j => j.jour_fr === jour.jour_fr)
  if (!data) return []

  return data.cours.filter(cours => {
    const h = cours.horaire ?? `${cours.heure_debut} - ${cours.heure_fin}`
    return h === slot
  })
}

// Charger les paramètres au montage
onMounted(async () => {
  if (!parametreStore.parametres) {
    await parametreStore.fetchParametres();
  }

  appName.value = parametreStore.getAppName || "Établissement";

  const logo = parametreStore.getAppLogo;

  if (logo) {
    // conversion base64
    logoFinal.value = await convertirImageBase64(logo)
    // logoFinal.value = logo;
  }
});

// Surveiller les changements du store
watch(
  () => parametreStore.getAppLogo,
  (newLogo) => {
    if (newLogo) {
      console.log("Logo changé dans le store:", newLogo);
      logoBrut.value = newLogo;
      logoFinal.value = newLogo;
      logoError.value = false;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.edt-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 50px;
  padding: 30px 25px;
  background: #ffffff;
  font-family: "Arial", "Helvetica", sans-serif;
  font-size: 12px;
  color: #000000;
  line-height: 1.4;
  box-sizing: border-box;
  position: relative;
  min-height: 100%;
}

.logo-watermark {
  z-index: 0;
  background-color: transparent;
}

.logo-container {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  min-height: 60px;
}

.logo-image {
  max-width: 100px;
  max-height: 80px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border: 1px solid #eee;
  padding: 4px;
  background: white;
}

/* ── EN-TÊTE ── */
.edt-entete {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #000000;
  gap: 15px;
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 4px 4px 0 0;
}

.entete-gauche,
.entete-droite {
  flex: 1;
}

.entete-droite {
  text-align: right;
}

.entete-centre {
  text-align: center;
  flex: 1.5;
}

.etablissement {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000000;
}

.annee-scolaire {
  font-size: 12px;
  color: #444444;
  margin-top: 4px;
}

.edt-titre {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #000000;
}

.edt-sous-titre {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-top: 5px;
}

.periode-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #666666;
  letter-spacing: 0.5px;
}

.periode-valeur {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-top: 3px;
}

/* ── TABLEAU ── */
.edt-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 25px;
  border: 1px solid #000000;
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.95);
}

.edt-table thead tr {
  background-color: #f0f0f0;
  border-bottom: 2px solid #000000;
}

.edt-table th {
  padding: 12px 6px;
  text-align: center;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid #000000;
  vertical-align: middle;
  color: #000000;
}

.edt-table th.col-horaire {
  background: #e5e5e5;
  width: 100px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-right: 2px solid #000000;
}

.jour-th-nom {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000000;
  margin-bottom: 3px;
}

.jour-th-date {
  font-size: 11px;
  font-weight: 400;
  color: #555555;
}

.edt-table tbody tr {
  border-bottom: 1px solid #cccccc;
}

.td-horaire {
  font-size: 11px;
  font-weight: 600;
  color: #000000;
  text-align: center;
  background: #f5f5f5;
  border: 1px solid #000000;
  border-right: 2px solid #000000;
  padding: 8px 4px;
  white-space: nowrap;
  width: 100px;
}

.td-cours {
  border: 1px solid #000000;
  padding: 6px;
  vertical-align: top;
  height: auto;
  min-height: 80px;
  background-color: #ffffff;
}

.cours-cell {
  padding: 6px 8px;
  margin-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
}

.cours-cell:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.cours-matiere {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  line-height: 1.3;
  word-wrap: break-word;
  white-space: normal;
}

.cours-prof {
  font-size: 11px;
  color: #333333;
  margin-top: 3px;
  word-wrap: break-word;
}

.cours-salle {
  font-size: 10px;
  color: #444444;
  margin-top: 4px;
}

.cours-lien {
  color: #000000;
  text-decoration: underline;
  font-style: normal;
  font-weight: 500;
  display: inline-block;
  padding: 2px 0;
}

.cours-lien:hover {
  text-decoration: underline;
}

/* ── LÉGENDE ── */
.edt-legende {
  display: flex;
  align-items: center;
  gap: 25px;
  padding-top: 15px;
  border-top: 2px solid #000000;
  flex-wrap: wrap;
  margin-top: 10px;
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 0 0 4px 4px;
}

.legende-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #000000;
}

.legende-carre {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #000000;
  background-color: #ffffff;
}

.legende-carre.cours {
  background-color: #f0f0f0;
  border: 1px solid #000000;
}

.legende-carre.eval {
  background-color: #d0d0d0;
  border: 2px solid #000000;
}

.legende-carre.evenement {
  background-color: #e0e0e0;
  border: 1px dashed #000000;
}

.legende-carre.virtuel {
  background-color: #ffffff;
  border: 1px solid #000000;
  position: relative;
}

.legende-carre.virtuel::after {
  content: "→";
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.legende-sep {
  flex: 1;
}

.legende-meta {
  font-size: 10px;
  color: #666666;
  font-style: italic;
}

/* Impression */
@media print {
  .edt-page {
    padding: 1.2cm;
  }

  .edt-table th,
  .edt-table td {
    border-color: #000000 !important;
  }

  .edt-table thead tr {
    background-color: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .td-horaire {
    background-color: #f5f5f5 !important;
  }

  tr {
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  .cours-lien {
    color: #000000 !important;
    text-decoration: underline !important;
  }

  .logo-watermark {
    opacity: 0.1 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .logo-image {
    max-width: 80px;
    max-height: 80px;
  }
}

/* Affichage écran */
@media screen {
  .edt-page {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #eeeeee;
  }

  .td-cours:hover {
    background-color: #fafafa;
  }
}
</style>
