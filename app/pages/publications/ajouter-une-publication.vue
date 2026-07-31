<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
      <NuxtLink to="/publications/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">Publications</NuxtLink>
      <span>/</span>
      <NuxtLink to="/publications/liste" class="cursor-pointer hover:text-indigo-600 transition-colors">Liste des publications</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 dark:text-white font-medium cursor-default">Ajouter une publication</span>
    </div>

    <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">
      Ajouter une publication
    </h1>

    <!-- Formulaire -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <form @submit.prevent="savePublication" class="space-y-6">

        <!-- Titre -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre de la publication <span class="text-rose-500">*</span>
          </label>
          <input v-model="form.title" type="text" required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Titre de votre publication" />
        </div>

        <!-- Statut et Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Statut <span class="text-rose-500">*</span>
            </label>
            <select v-model="form.status" required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de publication</label>
            <input v-model="form.created_at" type="datetime-local"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
            <p class="text-xs text-gray-500">Laissez vide pour la date d'aujourd'hui.</p>
          </div>
        </div>

        <!-- Image du blog avec cropper -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Image du blog</label>

          <!-- Zone upload -->
          <div @click="triggerFileInput" @dragover.prevent="dragover = true" @dragleave="dragover = false" @drop.prevent="handleDrop"
            :class="['border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
              dragover ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : imagePreview ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400']">

            <!-- Prévisualisation image rognée -->
            <div v-if="imagePreview" class="mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
              <img :src="imagePreview" class="max-h-64 mx-auto rounded-lg object-contain shadow-sm" alt="Aperçu" />
            </div>

            <!-- Icône -->
            <div v-else class="py-4">
              <svg :class="['w-12 h-12 mx-auto mb-4', dragover ? 'text-indigo-500' : 'text-gray-400']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-gray-600 dark:text-gray-400 mb-2">
                <span class="font-medium text-indigo-600">Cliquez pour télécharger</span> ou glissez-déposez
              </p>
              <p class="text-sm text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>

            <!-- Boutons action image -->
            <div v-if="imagePreview" class="mt-4 flex items-center justify-center gap-3" @click.stop>
              <button type="button" @click="openCropper"
                class="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Rogner l'image
              </button>
              <button type="button" @click="triggerFileInput"
                class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Changer
              </button>
              <button type="button" @click="removeImage"
                class="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors">
                Supprimer
              </button>
            </div>
          </div>

          <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
          <p class="text-xs text-gray-500 dark:text-gray-400">Format recommandé : 1200×630px</p>
        </div>

        <!-- Contenu -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contenu de la publication <span class="text-rose-500">*</span>
            </label>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ contentLength }}/{{ contentLimit }} caractères</div>
          </div>
          <CustomQuillEditor v-model="form.content" />
        </div>

        <!-- Boutons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <NuxtLink to="/publications/liste"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
            Annuler
          </NuxtLink>
          <Can action="create-blog">
            <button type="submit" :disabled="isSubmitting"
              class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="!isSubmitting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-if="isSubmitting">Enregistrement...</span>
              <span v-else>Enregistrer</span>
            </button>
          </Can>
        </div>
      </form>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!--  MODALE CROPPER                        -->
    <!-- ═══════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showCropper"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        @click.self="cancelCrop">

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rogner l'image</h3>
              <p class="text-xs text-gray-500 mt-0.5">Déplacez et zoomez pour cadrer votre image</p>
            </div>
            <button @click="cancelCrop" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Zone de crop -->
          <div class="p-6">
            <!-- Canvas container avec overflow hidden pour le crop -->
            <div class="relative bg-gray-900 rounded-xl overflow-hidden select-none"
              style="height: 340px;"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="stopDrag"
              @mouseleave="stopDrag"
              @touchstart.prevent="startTouch"
              @touchmove.prevent="onTouch"
              @touchend="stopDrag"
              ref="cropZone">

              <!-- Image déplaçable -->
              <img
                ref="cropImg"
                :src="originalSrc"
                :style="{
                  position: 'absolute',
                  left: imgX + 'px',
                  top: imgY + 'px',
                  width: (imgNaturalW * imgScale) + 'px',
                  height: (imgNaturalH * imgScale) + 'px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }"
                alt="crop"
                draggable="false"
              />

              <!-- Overlay grille de cadrage -->
              <div class="absolute inset-0 pointer-events-none" style="border: 2px solid rgba(99,102,241,0.7);">
                <!-- Lignes tiers horizontales -->
                <div class="absolute left-0 right-0" style="top:33.33%; border-top: 1px dashed rgba(255,255,255,0.3);"></div>
                <div class="absolute left-0 right-0" style="top:66.66%; border-top: 1px dashed rgba(255,255,255,0.3);"></div>
                <!-- Lignes tiers verticales -->
                <div class="absolute top-0 bottom-0" style="left:33.33%; border-left: 1px dashed rgba(255,255,255,0.3);"></div>
                <div class="absolute top-0 bottom-0" style="left:66.66%; border-left: 1px dashed rgba(255,255,255,0.3);"></div>
                <!-- Coins -->
                <div class="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-indigo-400"></div>
                <div class="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-indigo-400"></div>
                <div class="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-400"></div>
                <div class="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-400"></div>
              </div>
            </div>

            <!-- Contrôle zoom -->
            <div class="mt-5">
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
                <input type="range" v-model.number="imgScale" :min="minScale" :max="minScale * 4" :step="0.01"
                  class="flex-1 h-2 bg-gray-200 rounded-full accent-indigo-600 cursor-pointer" />
                <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <span class="text-xs text-gray-500 w-10 text-right tabular-nums">{{ Math.round(imgScale / minScale * 100) }}%</span>
              </div>
              <div class="mt-2 flex justify-end">
                <button type="button" @click="resetCrop"
                  class="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          <!-- Footer boutons -->
          <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <button type="button" @click="cancelCrop"
              class="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Annuler
            </button>
            <button type="button" @click="applyCrop"
              class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Appliquer le rognage
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Canvas caché pour le rendu du crop -->
    <canvas ref="cropCanvas" class="hidden"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { useBlogStore } from "~~/stores/blog";
import { useThemeStore } from "~~/stores/theme";

const themeStore = useThemeStore();
const blogStore = useBlogStore();
const { $toastr } = useNuxtApp();
const route = useRoute();

// ── Formulaire ──────────────────────────────────────────────
const form = ref({ title: "", imageFile: null, content: "", status: "draft", created_at: "", id: null });
const imagePreview = ref(null);
const dragover = ref(false);
const fileInput = ref(null);
const isSubmitting = ref(false);
const contentLimit = 10000;

const contentLength = computed(() => {
  if (!form.value.content) return 0;
  return form.value.content.replace(/<[^>]*>?/gm, '').length;
});

// ── Cropper state ────────────────────────────────────────────
const showCropper = ref(false);
const originalSrc = ref('');         // dataURL de l'image originale
const originalFile = ref(null);      // fichier File original

const cropZone = ref(null);
const cropImg = ref(null);
const cropCanvas = ref(null);

const imgNaturalW = ref(0);
const imgNaturalH = ref(0);
const imgScale = ref(1);
const minScale = ref(1);
const imgX = ref(0);
const imgY = ref(0);

// Drag
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragStartImgX = ref(0);
const dragStartImgY = ref(0);

// ── Edition mode ─────────────────────────────────────────────
if (route.query.id) {
  form.value.id = route.query.id;
  loadBlogForEdit(route.query.id);
}

async function loadBlogForEdit(id) {
  try {
    const blog = await blogStore.fetchBlog(id);
    if (blog) {
      form.value.title = blog.title || "";
      form.value.content = blog.content || "";
      form.value.status = blog.status || "draft";
      if (blog.image) imagePreview.value = blog.image;
    }
  } catch { $toastr.error("Erreur lors du chargement"); }
}

// ── Upload ────────────────────────────────────────────────────
const triggerFileInput = () => fileInput.value?.click();

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  processImageFile(file);
};

const handleDrop = (e) => {
  dragover.value = false;
  processImageFile(e.dataTransfer.files[0]);
};

function processImageFile(file) {
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { $toastr.warning("Fichier trop volumineux (max 10 MB)"); return; }
  if (!file.type.startsWith("image/")) { $toastr.warning("Veuillez sélectionner une image"); return; }

  originalFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => {
    originalSrc.value = ev.target.result;
    imagePreview.value = ev.target.result;
    form.value.imageFile = file;
  };
  reader.readAsDataURL(file);
}

const removeImage = () => {
  form.value.imageFile = null;
  imagePreview.value = null;
  originalSrc.value = '';
  if (fileInput.value) fileInput.value.value = "";
};

// ── Cropper open/close ────────────────────────────────────────
const openCropper = async () => {
  showCropper.value = true;
  await nextTick();

  // Charger les dimensions naturelles
  const tmp = new Image();
  tmp.onload = () => {
    imgNaturalW.value = tmp.naturalWidth;
    imgNaturalH.value = tmp.naturalHeight;

    // Scale minimal pour remplir la zone (340px de haut, 600px de large)
    const zoneW = cropZone.value?.clientWidth || 560;
    const zoneH = 340;
    const scaleW = zoneW / tmp.naturalWidth;
    const scaleH = zoneH / tmp.naturalHeight;
    const s = Math.max(scaleW, scaleH);
    minScale.value = s;
    imgScale.value = s;

    // Centrer
    imgX.value = (zoneW - tmp.naturalWidth * s) / 2;
    imgY.value = (zoneH - tmp.naturalHeight * s) / 2;
  };
  tmp.src = originalSrc.value;
};

const cancelCrop = () => { showCropper.value = false; };

const resetCrop = () => {
  imgScale.value = minScale.value;
  const zoneW = cropZone.value?.clientWidth || 560;
  const zoneH = 340;
  imgX.value = (zoneW - imgNaturalW.value * minScale.value) / 2;
  imgY.value = (zoneH - imgNaturalH.value * minScale.value) / 2;
};

// ── Drag dans le cropper ──────────────────────────────────────
const startDrag = (e) => {
  isDragging.value = true;
  dragStartX.value = e.clientX;
  dragStartY.value = e.clientY;
  dragStartImgX.value = imgX.value;
  dragStartImgY.value = imgY.value;
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  imgX.value = dragStartImgX.value + (e.clientX - dragStartX.value);
  imgY.value = dragStartImgY.value + (e.clientY - dragStartY.value);
};

const stopDrag = () => { isDragging.value = false; };

// Touch support
const startTouch = (e) => {
  const t = e.touches[0];
  isDragging.value = true;
  dragStartX.value = t.clientX;
  dragStartY.value = t.clientY;
  dragStartImgX.value = imgX.value;
  dragStartImgY.value = imgY.value;
};

const onTouch = (e) => {
  if (!isDragging.value) return;
  const t = e.touches[0];
  imgX.value = dragStartImgX.value + (t.clientX - dragStartX.value);
  imgY.value = dragStartImgY.value + (t.clientY - dragStartY.value);
};

// ── Appliquer le crop ─────────────────────────────────────────
const applyCrop = () => {
  const zoneW = cropZone.value?.clientWidth || 560;
  const zoneH = 340;
  const canvas = cropCanvas.value;
  canvas.width = zoneW;
  canvas.height = zoneH;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, zoneW, zoneH);
    ctx.drawImage(img, imgX.value, imgY.value, imgNaturalW.value * imgScale.value, imgNaturalH.value * imgScale.value);

    canvas.toBlob((blob) => {
      // Convertir en File
      const croppedFile = new File([blob], originalFile.value?.name || 'image.jpg', { type: 'image/jpeg' });
      form.value.imageFile = croppedFile;

      // Afficher la prévisualisation rognée
      imagePreview.value = canvas.toDataURL('image/jpeg', 0.92);
      showCropper.value = false;
      $toastr.success("Image rognée avec succès");
    }, 'image/jpeg', 0.92);
  };
  img.src = originalSrc.value;
};

// ── Sauvegarder ───────────────────────────────────────────────
const savePublication = async () => {
  try {
    if (!form.value.title?.trim()) { $toastr.warning("Le titre est obligatoire"); return; }
    if (!form.value.content?.trim()) { $toastr.warning("Le contenu est obligatoire"); return; }
    isSubmitting.value = true;

    const formData = new FormData();
    formData.append("title", form.value.title.trim());
    formData.append("content", form.value.content);
    formData.append("status", form.value.status);
    if (form.value.created_at) formData.append("created_at", form.value.created_at);
    if (form.value.imageFile) formData.append("image", form.value.imageFile);

    let response;
    if (form.value.id) {
      response = await blogStore.updateBlog(form.value.id, formData);
      if (form.value.status === 'published' && response?.status !== 'published') {
        await blogStore.publishBlog(response.slug || response.id);
      }
      $toastr.success("Publication modifiée avec succès");
    } else {
      response = await blogStore.createBlog(formData);
      if (form.value.status === 'published') {
        await blogStore.publishBlog(response.slug || response.id);
      }
      $toastr.success("Publication créée avec succès");
    }
    navigateTo("/publications/liste");
  } catch (error) {
    if (error.response?.data?.errors) {
      const e = error.response.data.errors;
      $toastr.error([e.image, e.content, e.title].flat().filter(Boolean).join("\n") || "Erreur de validation");
    } else {
      $toastr.error(error?.message || "Erreur lors de l'opération");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>