<template>
  <div class="card">
    <!-- En-tête avec titre et bouton d'ajout -->
    <div class="flex justify-between items-center mb-4 p-4">
      <div>
        <h2 class="text-xl font-semibold">Galerie d'images</h2>
        <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">
          Gérez vos albums et images
        </p>
      </div>
      <Button 
        label="Nouvel album" 
        icon="pi pi-plus" 
        @click="ajouterAlbum"
        class="p-button-success"
      />
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-4">
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <InputText 
          v-model="filtreGlobal" 
          placeholder="Rechercher un album..." 
          class="p-inputtext-sm w-full sm:w-64"
        />
        <Select 
          v-model="filtreCategorie" 
          :options="categories" 
          optionLabel="label" 
          optionValue="value"
          placeholder="Toutes catégories" 
          class="w-full sm:w-48"
          showClear
        />
      </div>
      <Select 
        v-model="sortKey" 
        :options="sortOptions" 
        optionLabel="label" 
        placeholder="Trier par" 
        @change="onSortChange($event)" 
        class="w-full sm:w-48"
      />
    </div>

    <!-- Vue principale : Albums ou Images -->
    <div v-if="!albumSelectionne">
      <!-- Vue Albums -->
      <DataView 
        :value="albumsFiltres" 
        :layout="layout"
        :sortOrder="sortOrder" 
        :sortField="sortField"
        dataKey="id"
        :paginator="true"
        :rows="perPage"
        :rowsPerPageOptions="[6, 12, 24, 48]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <!-- En-tête avec choix d'affichage -->
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-surface-600 dark:text-surface-300">
              {{ albumsFiltres.length }} album(s) trouvé(s)
            </span>
            <div class="flex items-center gap-2">
              <SelectButton 
                v-model="layout" 
                :options="optionsLayout" 
                optionLabel="label" 
                optionValue="value"
                :allowEmpty="false"
              >
                <template #option="{ option }">
                  <i :class="option.icon"></i>
                </template>
              </SelectButton>
            </div>
          </div>
        </template>

        <!-- Mode Liste - Albums -->
        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(album, index) in slotProps.items" :key="album.id">
              <div class="flex flex-col lg:flex-row lg:items-center p-6 gap-4" 
                   :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                
                <!-- Couverture de l'album -->
                <div class="lg:w-32 relative flex justify-center cursor-pointer" @click="voirAlbum(album)">
                  <div class="w-28 h-28 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      v-if="album.couverture" 
                      :src="album.couverture" 
                      :alt="album.nom"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
                      <i class="pi pi-images text-4xl text-primary-500"></i>
                    </div>
                  </div>
                  <div class="absolute -top-2 -right-2">
                    <Tag :value="album.nbImages + ' photos'" severity="info" rounded />
                  </div>
                </div>
                
                <!-- Informations de l'album -->
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-col gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                        {{ album.categorie || 'Album' }}
                      </span>
                      <div class="text-lg font-medium mt-1">{{ album.nom }}</div>
                    </div>
                    
                    <!-- Métadonnées -->
                    <div class="flex flex-wrap gap-3 text-sm text-surface-600 dark:text-surface-400">
                      <div class="flex items-center gap-1">
                        <i class="pi pi-calendar"></i>
                        <span>{{ formatDate(album.dateCreation) }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <i class="pi pi-images"></i>
                        <span>{{ album.nbImages }} images</span>
                      </div>
                      <div v-if="album.taille" class="flex items-center gap-1">
                        <i class="pi pi-database"></i>
                        <span>{{ formatTaille(album.taille) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex gap-2">
                    <Button 
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text p-button-sm" 
                      @click="voirAlbum(album)"
                      v-tooltip.top="'Voir l\'album'"
                    />
                    <Button 
                      icon="pi pi-pencil" 
                      class="p-button-rounded p-button-text p-button-sm p-button-info" 
                      @click="modifierAlbum(album)"
                      v-tooltip.top="'Modifier l\'album'"
                    />
                    <Button 
                      icon="pi pi-trash" 
                      class="p-button-rounded p-button-text p-button-sm p-button-danger" 
                      @click="confirmerSuppressionAlbum(album)"
                      v-tooltip.top="'Supprimer l\'album'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Mode Grille - Albums -->
        <template #grid="slotProps">
          <div class="grid grid-cols-12 gap-4 p-4">
            <div v-for="album in slotProps.items" :key="album.id" 
                 class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
              <div class="card p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                   @click="voirAlbum(album)">
                <!-- Couverture -->
                <div class="relative mb-4">
                  <div class="w-full h-40 rounded-lg overflow-hidden">
                    <img 
                      v-if="album.couverture" 
                      :src="album.couverture" 
                      :alt="album.nom"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div v-else class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
                      <i class="pi pi-images text-5xl text-primary-500"></i>
                    </div>
                  </div>
                  <div class="absolute top-2 right-2">
                    <Tag :value="album.nbImages + ' photos'" severity="info" />
                  </div>
                </div>

                <!-- Informations -->
                <div class="mb-4">
                  <h3 class="font-semibold text-lg mb-1 truncate" :title="album.nom">
                    {{ album.nom }}
                  </h3>
                  <p class="text-sm text-surface-600 dark:text-surface-400 mb-2 line-clamp-2">
                    {{ album.description || 'Aucune description' }}
                  </p>
                  
                  <div class="space-y-1 text-sm">
                    <div class="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                      <i class="pi pi-calendar w-4"></i>
                      <span>{{ formatDate(album.dateCreation) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-2 pt-2 border-t border-surface-200 dark:border-surface-700">
                  <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" @click.stop="voirAlbum(album)" />
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm p-button-info" @click.stop="modifierAlbum(album)" />
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm p-button-danger" @click.stop="confirmerSuppressionAlbum(album)" />
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Template pour liste vide - Albums -->
        <template #empty>
          <div class="text-center py-12">
            <i class="pi pi-images text-4xl text-surface-400 mb-3"></i>
            <p class="text-surface-500 dark:text-surface-400">Aucun album trouvé</p>
            <Button 
              label="Créer un album" 
              icon="pi pi-plus" 
              @click="ajouterAlbum" 
              class="p-button-outlined mt-4"
            />
          </div>
        </template>
      </DataView>
    </div>

    <!-- Vue Images d'un album -->
    <div v-else>
      <!-- En-tête de l'album -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <Button 
              icon="pi pi-arrow-left" 
              class="p-button-rounded p-button-text" 
              @click="retourAlbums"
              v-tooltip.right="'Retour aux albums'"
            />
            <div>
              <h2 class="text-xl font-semibold">{{ albumSelectionne.nom }}</h2>
              <p class="text-sm text-surface-600 dark:text-surface-400">
                {{ albumSelectionne.nbImages }} images • {{ formatDate(albumSelectionne.dateCreation) }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <Button 
              label="Ajouter des images" 
              icon="pi pi-upload" 
              @click="ajouterImages"
              class="p-button-success"
            />
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-info" 
              @click="modifierAlbum(albumSelectionne)"
              v-tooltip.top="'Modifier l\'album'"
            />
          </div>
        </div>

        <!-- Description de l'album -->
        <p v-if="albumSelectionne.description" class="text-surface-600 dark:text-surface-400 mb-4">
          {{ albumSelectionne.description }}
        </p>

        <!-- Barre de recherche d'images -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex gap-2 w-full sm:w-auto">
            <InputText 
              v-model="filtreImages" 
              placeholder="Rechercher une image..." 
              class="p-inputtext-sm w-full sm:w-64"
            />
            <Select 
              v-model="triImages" 
              :options="optionsTriImages" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Trier par" 
              class="w-full sm:w-40"
            />
          </div>
          <span class="text-sm text-surface-600 dark:text-surface-400">
            {{ imagesFiltrees.length }} image(s)
          </span>
        </div>
      </div>

      <!-- Grille d'images -->
      <div class="grid grid-cols-12 gap-4">
        <div v-for="image in imagesPaginees" :key="image.id" 
             class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
          <div class="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <!-- Image -->
            <div class="relative aspect-square cursor-pointer" @click="voirImage(image)">
              <img 
                :src="image.url" 
                :alt="image.titre"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              <!-- Overlay au survol -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button icon="pi pi-search-plus" class="p-button-rounded p-button-text text-white" @click.stop="voirImage(image)" />
              </div>
            </div>

            <!-- Informations -->
            <div class="p-3">
              <h4 class="font-medium text-sm truncate" :title="image.titre">{{ image.titre }}</h4>
              <p class="text-xs text-surface-600 dark:text-surface-400 mt-1">
                {{ formatDate(image.dateUpload) }}
              </p>
              
              <!-- Actions -->
              <div class="flex justify-end gap-1 mt-2">
                <Button 
                  icon="pi pi-download" 
                  class="p-button-rounded p-button-text p-button-sm" 
                  @click="telechargerImage(image)"
                  v-tooltip.top="'Télécharger'"
                />
                <Button 
                  icon="pi pi-pencil" 
                  class="p-button-rounded p-button-text p-button-sm p-button-info" 
                  @click="modifierImage(image)"
                  v-tooltip.top="'Modifier'"
                />
                <Button 
                  icon="pi pi-trash" 
                  class="p-button-rounded p-button-text p-button-sm p-button-danger" 
                  @click="confirmerSuppressionImage(image)"
                  v-tooltip.top="'Supprimer'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination des images -->
      <div class="flex justify-between items-center mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
        <span class="text-sm text-surface-600 dark:text-surface-400">
          Affichage {{ (pageCourante - 1) * imagesParPage + 1 }} - 
          {{ Math.min(pageCourante * imagesParPage, imagesFiltrees.length) }} 
          sur {{ imagesFiltrees.length }} images
        </span>
        <Paginator 
          :rows="imagesParPage"
          :totalRecords="imagesFiltrees.length"
          :first="(pageCourante - 1) * imagesParPage"
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>

      <!-- Template pour liste vide - Images -->
      <div v-if="imagesFiltrees.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
        <i class="pi pi-image text-4xl text-surface-400 mb-3"></i>
        <p class="text-surface-500 dark:text-surface-400">Aucune image dans cet album</p>
        <Button 
          label="Ajouter des images" 
          icon="pi pi-upload" 
          @click="ajouterImages" 
          class="p-button-outlined mt-4"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

// États
const albums = ref([]);
const albumSelectionne = ref(null);
const layout = ref('grid');
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const filtreGlobal = ref('');
const filtreCategorie = ref(null);
const filtreImages = ref('');
const triImages = ref('recent');
const pageCourante = ref(1);
const imagesParPage = ref(12);

// Options
const optionsLayout = ref([
  { label: 'Liste', value: 'list', icon: 'pi pi-list' },
  { label: 'Grille', value: 'grid', icon: 'pi pi-th-large' }
]);

const categories = ref([
  { label: 'Événements', value: 'evenements' },
  { label: 'Conférences', value: 'conferences' },
  { label: 'Ateliers', value: 'ateliers' },
  { label: 'Formations', value: 'formations' }
]);

const sortOptions = ref([
  { label: 'Date (récent → ancien)', value: '!dateCreation' },
  { label: 'Date (ancien → récent)', value: 'dateCreation' },
  { label: 'Nom (A → Z)', value: 'nom' },
  { label: 'Nom (Z → A)', value: '!nom' },
  { label: '+ de photos', value: '!nbImages' },
  { label: '- de photos', value: 'nbImages' },
]);

const optionsTriImages = ref([
  { label: 'Plus récentes', value: 'recent' },
  { label: 'Plus anciennes', value: 'ancien' },
  { label: 'Nom (A → Z)', value: 'nomAsc' },
  { label: 'Nom (Z → A)', value: 'nomDesc' },
  { label: 'Taille (plus grande)', value: 'tailleDesc' },
  { label: 'Taille (plus petite)', value: 'tailleAsc' }
]);

// Albums filtrés
const albumsFiltres = computed(() => {
  let data = [...albums.value];
  
  // Filtre global
  if (filtreGlobal.value) {
    const searchTerm = filtreGlobal.value.toLowerCase();
    data = data.filter(album => 
      album.nom?.toLowerCase().includes(searchTerm) ||
      album.description?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filtre par catégorie
  if (filtreCategorie.value) {
    data = data.filter(album => album.categorie === filtreCategorie.value);
  }
  
  return data;
});

// Images filtrées de l'album sélectionné
const imagesFiltrees = computed(() => {
  if (!albumSelectionne.value || !albumSelectionne.value.images) return [];
  
  let images = [...albumSelectionne.value.images];
  
  // Filtre par recherche
  if (filtreImages.value) {
    const searchTerm = filtreImages.value.toLowerCase();
    images = images.filter(img => 
      img.titre?.toLowerCase().includes(searchTerm) ||
      img.description?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Tri
  switch (triImages.value) {
    case 'recent':
      images.sort((a, b) => new Date(b.dateUpload) - new Date(a.dateUpload));
      break;
    case 'ancien':
      images.sort((a, b) => new Date(a.dateUpload) - new Date(b.dateUpload));
      break;
    case 'nomAsc':
      images.sort((a, b) => a.titre.localeCompare(b.titre));
      break;
    case 'nomDesc':
      images.sort((a, b) => b.titre.localeCompare(a.titre));
      break;
    case 'tailleDesc':
      images.sort((a, b) => (b.taille || 0) - (a.taille || 0));
      break;
    case 'tailleAsc':
      images.sort((a, b) => (a.taille || 0) - (b.taille || 0));
      break;
  }
  
  return images;
});

// Images paginées
const imagesPaginees = computed(() => {
  const debut = (pageCourante.value - 1) * imagesParPage.value;
  const fin = debut + imagesParPage.value;
  return imagesFiltrees.value.slice(debut, fin);
});

// Charger les données
onMounted(() => {
  chargerDonneesFictives();
});

// Données fictives
const chargerDonneesFictives = () => {
  albums.value = [
    {
      id: 1,
      nom: "Conférence IA 2024",
      description: "Photos de la conférence sur l'intelligence artificielle",
      categorie: "conferences",
      dateCreation: new Date(2024, 5, 15),
      nbImages: 24,
      taille: 45.2, // MB
      couverture: "https://picsum.photos/400/300?random=1",
      images: genererImages(24, 1)
    },
    {
      id: 2,
      nom: "Atelier Développement Web",
      description: "Captures et photos de l'atelier pratique",
      categorie: "ateliers",
      dateCreation: new Date(2024, 6, 10),
      nbImages: 18,
      taille: 32.8,
      couverture: "https://picsum.photos/400/300?random=2",
      images: genererImages(18, 2)
    },
    {
      id: 3,
      nom: "Hackathon Innovation",
      description: "Moments forts du hackathon de 48h",
      categorie: "evenements",
      dateCreation: new Date(2024, 7, 5),
      nbImages: 36,
      taille: 78.5,
      couverture: "https://picsum.photos/400/300?random=3",
      images: genererImages(36, 3)
    },
    {
      id: 4,
      nom: "Formation UX/UI",
      description: "Supports et exercices pratiques",
      categorie: "formations",
      dateCreation: new Date(2024, 8, 20),
      nbImages: 15,
      taille: 28.3,
      couverture: "https://picsum.photos/400/300?random=4",
      images: genererImages(15, 4)
    },
    {
      id: 5,
      nom: "Meetup Développeurs",
      description: "Rencontre mensuelle des développeurs",
      categorie: "evenements",
      dateCreation: new Date(2024, 9, 5),
      nbImages: 12,
      taille: 22.1,
      couverture: "https://picsum.photos/400/300?random=5",
      images: genererImages(12, 5)
    },
    {
      id: 6,
      nom: "Conférence Cybersecurity",
      description: "Sécurité informatique et bonnes pratiques",
      categorie: "conferences",
      dateCreation: new Date(2024, 4, 22),
      nbImages: 30,
      taille: 62.4,
      couverture: "https://picsum.photos/400/300?random=6",
      images: genererImages(30, 6)
    }
  ];
};

// Générer des images fictives
const genererImages = (nb, albumId) => {
  const images = [];
  for (let i = 1; i <= nb; i++) {
    images.push({
      id: `${albumId}-${i}`,
      titre: `Image ${i} - Album ${albumId}`,
      description: `Description de l'image ${i}`,
      url: `https://picsum.photos/800/600?random=${albumId}${i}`,
      dateUpload: new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1),
      taille: Math.floor(Math.random() * 5) + 1, // MB
      dimensions: `${800}x${600}`,
      format: 'JPEG'
    });
  }
  return images;
};

// Gestion du tri
const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1);
    sortKey.value = sortValue;
  } else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};

// Formatage
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatTaille = (taille) => {
  if (taille < 1024) return taille + ' MB';
  return (taille / 1024).toFixed(2) + ' GB';
};

// Pagination
const onPageChange = (event) => {
  pageCourante.value = event.page + 1;
};

// Actions Albums
const ajouterAlbum = () => {
  console.log('Ajouter un album');
  toast.add({ 
    severity: 'info', 
    summary: 'Nouvel album', 
    detail: 'Fonctionnalité d\'ajout à implémenter', 
    life: 3000 
  });
};

const voirAlbum = (album) => {
  albumSelectionne.value = album;
  pageCourante.value = 1;
  filtreImages.value = '';
  triImages.value = 'recent';
};

const retourAlbums = () => {
  albumSelectionne.value = null;
};

const modifierAlbum = (album) => {
  console.log('Modifier album:', album);
  toast.add({ 
    severity: 'info', 
    summary: 'Modification', 
    detail: `Modification de l'album ${album.nom}`, 
    life: 3000 
  });
};

const confirmerSuppressionAlbum = (album) => {
  confirm.require({
    message: `Voulez-vous vraiment supprimer l'album "${album.nom}" ?<br>Toutes les images seront également supprimées.`,
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Annuler',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Supprimer',
    accept: () => {
      supprimerAlbum(album);
    }
  });
};

const supprimerAlbum = (album) => {
  albums.value = albums.value.filter(a => a.id !== album.id);
  if (albumSelectionne.value?.id === album.id) {
    albumSelectionne.value = null;
  }
  toast.add({ 
    severity: 'success', 
    summary: 'Succès', 
    detail: `L'album "${album.nom}" a été supprimé`, 
    life: 3000 
  });
};

// Actions Images
const ajouterImages = () => {
  console.log('Ajouter des images');
  toast.add({ 
    severity: 'info', 
    summary: 'Ajout d\'images', 
    detail: 'Fonctionnalité d\'ajout à implémenter', 
    life: 3000 
  });
};

const voirImage = (image) => {
  console.log('Voir image:', image);
  // Ici vous pourriez ouvrir un modal avec l'image en grand
  toast.add({ 
    severity: 'info', 
    summary: 'Image', 
    detail: `Visualisation de ${image.titre}`, 
    life: 3000 
  });
};

const telechargerImage = (image) => {
  console.log('Télécharger:', image);
  toast.add({ 
    severity: 'info', 
    summary: 'Téléchargement', 
    detail: `Téléchargement de ${image.titre}`, 
    life: 3000 
  });
};

const modifierImage = (image) => {
  console.log('Modifier image:', image);
  toast.add({ 
    severity: 'info', 
    summary: 'Modification', 
    detail: `Modification de ${image.titre}`, 
    life: 3000 
  });
};

const confirmerSuppressionImage = (image) => {
  confirm.require({
    message: `Voulez-vous vraiment supprimer l'image "${image.titre}" ?`,
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Annuler',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Supprimer',
    accept: () => {
      supprimerImage(image);
    }
  });
};

const supprimerImage = (image) => {
  if (albumSelectionne.value) {
    albumSelectionne.value.images = albumSelectionne.value.images.filter(i => i.id !== image.id);
    albumSelectionne.value.nbImages--;
  }
  toast.add({ 
    severity: 'success', 
    summary: 'Succès', 
    detail: `L'image "${image.titre}" a été supprimée`, 
    life: 3000 
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>