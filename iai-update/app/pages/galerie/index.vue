<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">

    <!-- ─── Vue Albums ─── -->
    <div v-if="!albumSelectionne">

      <!-- En-tête -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <PhotoIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white leading-tight">Galerie multimédia</h1>
            <p class="text-sm text-gray-400 dark:text-gray-500">Gérez vos albums et partagez les moments forts</p>
          </div>
        </div>
        <button @click="$router.push('/galerie/album/create')" class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v14M5 12h14"/>
          </svg>
          Nouvel album
        </button>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="relative max-w-xs w-full">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          <UiInput
            v-model="filtreGlobal"
            placeholder="Rechercher un album…"
            class-name="pl-9"
          />
        </div>
        <div class="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
          <button
            @click="layout = 'grid'"
            :class="['w-9 h-9 flex items-center justify-center transition-colors', layout === 'grid' ? 'bg-gray-100 dark:bg-gray-800 text-violet-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300']"
          >
            <Squares2X2Icon class="w-4 h-4"/>
          </button>
          <button
            @click="layout = 'list'"
            :class="['w-9 h-9 flex items-center justify-center transition-colors', layout === 'list' ? 'bg-gray-100 dark:bg-gray-800 text-violet-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300']"
          >
            <ListBulletIcon class="w-4 h-4"/>
          </button>
        </div>
      </div>

      <!-- État vide -->
      <div v-if="albumsFiltres.length === 0" class="empty-state">
        <div class="empty-icon">
          <PhotoIcon class="w-7 h-7 text-gray-400 dark:text-gray-500"/>
        </div>
        <p class="empty-title">Aucun album</p>
        <p class="empty-sub">Il n'y a aucun album pour le moment.</p>
        <button @click="$router.push('/galerie/album/create')" class="btn-primary">
          Créer mon premier album
        </button>
      </div>

      <!-- Grille albums -->
      <div v-else-if="layout === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div
          v-for="album in albumsFiltres"
          :key="album.id"
          class="album-card group"
          @click="voirAlbum(album)"
        >
          <div class="album-thumb">
            <img v-if="album.cover_url" :src="album.cover_url" :alt="album.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div v-else class="w-full h-full flex items-center justify-center bg-violet-50 dark:bg-violet-950/30">
              <PhotoIcon class="w-8 h-8 text-violet-200 dark:text-violet-800"/>
            </div>
            <span class="photo-count-badge">{{ album.photos_count ?? 0 }} photos</span>
          </div>
          <div class="p-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">{{ album.name }}</p>
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ formatDate(album.created_at) }}</span>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="$router.push(`/galerie/album/${album.id}/edit`)" class="icon-btn">
                  <PencilSquareIcon class="w-3.5 h-3.5"/>
                </button>
                <button @click.stop="confirmerSuppressionAlbum(album)" class="icon-btn-danger">
                  <TrashIcon class="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste albums -->
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="album in albumsFiltres"
          :key="album.id"
          class="album-row group"
          @click="voirAlbum(album)"
        >
          <div class="album-row-thumb">
            <img v-if="album.cover_url" :src="album.cover_url" :alt="album.name" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center">
              <PhotoIcon class="w-5 h-5 text-gray-300 dark:text-gray-600"/>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ album.name }}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{{ album.description || 'Aucune description' }}</p>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0">
            <span class="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
              {{ album.photos_count ?? 0 }} photos · {{ formatDate(album.created_at) }}
            </span>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="$router.push(`/galerie/album/${album.id}/edit`)" class="icon-btn">
                <PencilSquareIcon class="w-3.5 h-3.5"/>
              </button>
              <button @click.stop="confirmerSuppressionAlbum(album)" class="icon-btn-danger">
                <TrashIcon class="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ─── Vue Détail album ─── -->
    <div v-else>

      <!-- Header album -->
      <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 mb-4">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <button @click="retourAlbums" class="btn-ghost mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Retour aux albums
            </button>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ albumSelectionne.name }}</h2>
            <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <span class="inline-flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/40 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                <PhotoIcon class="w-3 h-3"/>
                {{ imagesFiltrees.length }} photos
              </span>
              <span>{{ formatDate(albumSelectionne.created_at) }}</span>
            </div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button @click="$router.push(`/galerie/album/${albumSelectionne.id}/photos/upload`)" class="btn-primary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              Ajouter des photos
            </button>
            <button @click="$router.push(`/galerie/album/${albumSelectionne.id}/edit`)" class="icon-btn">
              <PencilSquareIcon class="w-4 h-4"/>
            </button>
            <button @click="confirmerSuppressionAlbum(albumSelectionne)" class="icon-btn-danger">
              <TrashIcon class="w-4 h-4"/>
            </button>
          </div>
        </div>

        <div v-if="albumSelectionne.description" class="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-800 mb-4">
          {{ albumSelectionne.description }}
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div class="relative max-w-xs w-full">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <UiInput v-model="filtreImages" placeholder="Rechercher une photo…" class-name="pl-9"/>
          </div>
          <span class="text-xs text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0">{{ imagesFiltrees.length }} clichés</span>
        </div>
      </div>

      <!-- Grille photos -->
      <div v-if="imagesPaginees.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        <div
          v-for="image in imagesPaginees"
          :key="image.id"
          class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
        >
          <div class="relative aspect-square cursor-pointer group" @click="voirImage(image)">
            <img :src="image.file_url" :alt="image.title" class="w-full h-full object-cover" loading="lazy"/>
            <div class="absolute inset-0 bg-violet-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          <div class="px-2.5 py-2 flex items-center justify-between gap-2">
            <span class="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">{{ image.title || 'Sans titre' }}</span>
            <div class="flex gap-1 flex-shrink-0">
              <button @click="telechargerImage(image)" class="icon-btn">
                <ArrowDownTrayIcon class="w-3.5 h-3.5"/>
              </button>
              <button @click="confirmerSuppressionImage(image)" class="icon-btn-danger">
                <TrashIcon class="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="imagesFiltrees.length > imagesParPage" class="mt-5 flex justify-center">
        <Paginator
          :rows="imagesParPage"
          :totalRecords="imagesFiltrees.length"
          :first="(pageCourante - 1) * imagesParPage"
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          class="paginator-clean"
        />
      </div>

      <!-- Vide -->
      <div v-if="imagesFiltrees.length === 0" class="empty-state">
        <div class="empty-icon">
          <PhotoIcon class="w-7 h-7 text-gray-400 dark:text-gray-500"/>
        </div>
        <p class="empty-title">Aucune photo</p>
        <p class="empty-sub">Importez vos premières images dans cet album.</p>
        <button @click="$router.push(`/galerie/album/${albumSelectionne.id}/photos/upload`)" class="btn-primary">
          Importer des images
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useGalerieStore } from "~~/stores/galerie";
import {
  PhotoIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";
import Swal from "sweetalert2";

const route  = useRoute();
const router = useRouter();
const toast  = useToast();
const galerieStore = useGalerieStore();

useHead({
  title: "Galerie Multimédia | Edu-Manager",
  meta: [{ name: "description", content: "Explorez et gérez la galerie photos de l'établissement." }],
});

const albums            = computed(() => galerieStore.albums);
const images            = computed(() => galerieStore.photos);
const albumSelectionne  = ref(null);
const layout            = ref("grid");
const filtreGlobal      = ref("");
const filtreImages      = ref("");
const pageCourante      = ref(1);
const imagesParPage     = ref(18);

onMounted(async () => {
  await chargerAlbums();
  if (route.query.album) {
    const album = albums.value.find(a => a.id == route.query.album);
    if (album) voirAlbum(album);
  }
});

watch(() => route.query.album, (id) => {
  if (id) {
    const album = albums.value.find(a => a.id == id);
    if (album) voirAlbum(album);
  } else {
    albumSelectionne.value = null;
  }
});

const chargerAlbums = async () => {
  try { await galerieStore.fetchAlbums(); } catch (e) { console.error(e); }
};

const chargerPhotos = async (albumId) => {
  try { await galerieStore.fetchPhotos(albumId); } catch (e) { console.error(e); }
};

const albumsFiltres = computed(() => {
  if (!filtreGlobal.value) return albums.value;
  const q = filtreGlobal.value.toLowerCase();
  return albums.value.filter(a => a.name?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q));
});

const imagesFiltrees = computed(() => {
  if (!filtreImages.value) return images.value;
  const q = filtreImages.value.toLowerCase();
  return images.value.filter(i => i.title?.toLowerCase().includes(q) || i.caption?.toLowerCase().includes(q));
});

const imagesPaginees = computed(() => {
  const start = (pageCourante.value - 1) * imagesParPage.value;
  return imagesFiltrees.value.slice(start, start + imagesParPage.value);
});

const voirAlbum = (album) => {
  albumSelectionne.value = album;
  chargerPhotos(album.id);
  router.push({ query: { album: album.id } });
};

const retourAlbums = () => {
  albumSelectionne.value = null;
  router.push({ query: {} });
};

const voirImage = (image) => window.open(image.file_url, "_blank");

const telechargerImage = (image) => {
  const a = document.createElement("a");
  a.href = image.file_url;
  a.download = image.title || "photo";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const confirmerSuppressionAlbum = (album) => {
  Swal.fire({
    title: "Supprimer l'album ?",
    text: `Toutes les photos de "${album.name}" seront définitivement supprimées.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e24b4a",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await galerieStore.deleteAlbum(album.id);
        if (albumSelectionne.value?.id === album.id) retourAlbums();
        Swal.fire({ title: "Supprimé", text: "L'album a été retiré.", icon: "success", confirmButtonColor: "#7c3aed" });
      } catch {
        Swal.fire("Erreur", "Impossible de supprimer l'album.", "error");
      }
    }
  });
};

const confirmerSuppressionImage = (image) => {
  Swal.fire({
    title: "Supprimer cette photo ?",
    text: "Cette action est irréversible.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#e24b4a",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Supprimer",
    cancelButtonText: "Garder",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await galerieStore.deletePhoto(image.id);
        chargerPhotos(albumSelectionne.value.id);
        chargerAlbums();
        toast.add({ severity: "success", summary: "Supprimé", detail: "Photo retirée", life: 3000 });
      } catch {
        toast.add({ severity: "error", summary: "Erreur", detail: "Échec de la suppression", life: 3000 });
      }
    }
  });
};

const onPageChange = (e) => (pageCourante.value = e.page + 1);

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};
</script>

<style scoped>
@reference "tailwindcss";

/* ── Boutons ── */
.btn-primary {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium
    hover:bg-violet-700 transition-colors active:scale-95;
}
.btn-ghost {
  @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700
    text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}
.icon-btn {
  @apply w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center
    text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}
.icon-btn-danger {
  @apply w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center
    text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900 transition-colors;
}

/* ── Album card (grille) ── */
.album-card {
  @apply bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer transition-colors;
}
.album-card:hover {
  @apply border-violet-200 dark:border-violet-900/50;
}
.album-thumb {
  @apply relative h-36 bg-gray-100 dark:bg-gray-800 overflow-hidden;
}
.photo-count-badge {
  @apply absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full;
}

/* ── Album row (liste) ── */
.album-row {
  @apply bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl
    px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors;
}
.album-row:hover {
  @apply border-violet-200 dark:border-violet-900/50;
}
.album-row-thumb {
  @apply w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden;
}

/* ── Empty state ── */
.empty-state {
  @apply flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900
    border border-gray-100 dark:border-gray-800 rounded-xl text-center gap-2;
}
.empty-icon {
  @apply w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2;
}
.empty-title {
  @apply text-base font-medium text-gray-900 dark:text-white;
}
.empty-sub {
  @apply text-sm text-gray-400 dark:text-gray-500 mb-2;
}

/* ── Paginator ── */
:deep(.paginator-clean .p-paginator) {
  background: transparent !important;
  border: none !important;
}
:deep(.paginator-clean .p-paginator-page.p-highlight) {
  background: #7c3aed !important;
  color: white !important;
  border-radius: 8px !important;
}
:deep(.paginator-clean .p-paginator-page),
:deep(.paginator-clean .p-paginator-next),
:deep(.paginator-clean .p-paginator-prev),
:deep(.paginator-clean .p-paginator-first),
:deep(.paginator-clean .p-paginator-last) {
  border-radius: 8px !important;
  min-width: 2.25rem !important;
  height: 2.25rem !important;
}
</style>