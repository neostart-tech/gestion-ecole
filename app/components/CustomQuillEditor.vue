<template>
  <div class="relative flex flex-col gap-2">

    <div class="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 w-full min-h-[250px]" ref="editorWrapper">
      <ClientOnly>
        <QuillEditor
          v-model:content="localContent"
          contentType="html"
          :toolbar="toolbarOptions"
          theme="snow"
          class="w-full text-gray-900 dark:text-white quill-custom-editor"
          style="min-height: 250px;"
          @ready="onEditorReady"
        />
      </ClientOnly>

    <!-- Overlay de redimensionnement fait maison -->
    <div v-if="selectedImage" 
         class="absolute border-2 border-indigo-500 z-50 pointer-events-none"
         :style="overlayStyle">
         
         <!-- Poignée Droite -->
         <div class="absolute w-4 h-4 bg-indigo-600 border-2 border-white rounded-full cursor-e-resize pointer-events-auto"
              style="top: 50%; right: -8px; transform: translateY(-50%)"
              @mousedown.stop.prevent="startResize($event, 'right')"></div>
              
         <!-- Poignée Gauche -->
         <div class="absolute w-4 h-4 bg-indigo-600 border-2 border-white rounded-full cursor-w-resize pointer-events-auto"
              style="top: 50%; left: -8px; transform: translateY(-50%)"
              @mousedown.stop.prevent="startResize($event, 'left')"></div>
              
         <!-- Poignée Bas -->
         <div class="absolute w-4 h-4 bg-indigo-600 border-2 border-white rounded-full cursor-s-resize pointer-events-auto"
              style="left: 50%; bottom: -8px; transform: translateX(-50%)"
              @mousedown.stop.prevent="startResize($event, 'bottom')"></div>
              
         <!-- Poignée Haut -->
         <div class="absolute w-4 h-4 bg-indigo-600 border-2 border-white rounded-full cursor-n-resize pointer-events-auto"
              style="left: 50%; top: -8px; transform: translateX(-50%)"
              @mousedown.stop.prevent="startResize($event, 'top')"></div>
              
         <!-- Coin Bas-Droite -->
         <div class="absolute w-4 h-4 bg-indigo-600 border-2 border-white rounded-full cursor-se-resize pointer-events-auto"
              style="right: -8px; bottom: -8px;"
              @mousedown.stop.prevent="startResize($event, 'bottom-right')"></div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const localContent = ref(props.modelValue);

onMounted(() => {
  console.log("CustomQuillEditor MOUNTED!");
  document.addEventListener('click', handleEditorClick);
  window.addEventListener('resize', updateOverlayPosition);
});

watch(() => props.modelValue, (newVal) => {
  if (newVal !== localContent.value) {
    localContent.value = newVal;
  }
});

watch(localContent, (newVal) => {
  emit('update:modelValue', newVal);
});

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: ['sans-serif', 'serif', 'monospace', 'arial', 'times', 'courier', 'georgia', 'verdana', 'trebuchet'] }],
  [{ size: ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub'}, { script: 'super' }],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1'}, { indent: '+1' }],
  ['link', 'image', 'video'],
  ['clean']
];

const editorWrapper = ref(null);
const selectedImage = ref(null);
const overlayStyle = ref({ top: '0px', left: '0px', width: '0px', height: '0px' });

let startX = 0, startY = 0;
let startWidth = 0, startHeight = 0;
let resizeDirection = '';

const onEditorReady = async (quill) => {
  try {
    // Enregistrement des tailles personnalisées
    const Size = quill.constructor.import('attributors/style/size');
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
    quill.constructor.register(Size, true);

    // Enregistrement des polices personnalisées en style inline
    const FontStyle = quill.constructor.import('attributors/style/font');
    FontStyle.whitelist = ['sans-serif', 'serif', 'monospace', 'arial', 'times', 'courier', 'georgia', 'verdana', 'trebuchet'];
    quill.constructor.register(FontStyle, true);
  } catch (error) {
    console.error("Erreur lors de l'initialisation des polices Quill :", error);
  }
};

const handleEditorClick = (e) => {
  // On vérifie si l'utilisateur a cliqué sur une image dans l'éditeur
  if (e.target.tagName === 'IMG' && e.target.closest('.ql-editor')) {
    selectedImage.value = e.target;
    updateOverlayPosition();
  } else if (!e.target.closest('.pointer-events-auto')) {
    // Si on clique ailleurs (et pas sur une de nos poignées), on désélectionne
    selectedImage.value = null;
  }
};

const updateOverlayPosition = () => {
  if (!selectedImage.value || !editorWrapper.value) return;
  const imgRect = selectedImage.value.getBoundingClientRect();
  const wrapperRect = editorWrapper.value.getBoundingClientRect();
  
  overlayStyle.value = {
    top: `${imgRect.top - wrapperRect.top}px`,
    left: `${imgRect.left - wrapperRect.left}px`,
    width: `${imgRect.width}px`,
    height: `${imgRect.height}px`
  };
};

const startResize = (e, direction) => {
  resizeDirection = direction;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = selectedImage.value.offsetWidth;
  startHeight = selectedImage.value.offsetHeight;
  
  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
};

const onResize = (e) => {
  if (!selectedImage.value) return;
  
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  
  let newWidth = startWidth;
  let newHeight = startHeight;
  
  if (resizeDirection.includes('right')) newWidth = startWidth + dx;
  if (resizeDirection.includes('left')) newWidth = startWidth - dx; 
  if (resizeDirection.includes('bottom')) newHeight = startHeight + dy;
  if (resizeDirection.includes('top')) newHeight = startHeight - dy;

  if (newWidth < 20) newWidth = 20;
  if (newHeight < 20) newHeight = 20;
  
  selectedImage.value.style.width = `${newWidth}px`;
  selectedImage.value.style.height = `${newHeight}px`;
  
  updateOverlayPosition();
};

const stopResize = () => {
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
  // Simuler un input event pour forcer la mise à jour de Quill
  if (selectedImage.value) {
    const event = new Event('input', { bubbles: true });
    selectedImage.value.dispatchEvent(event);
    
    // Forcer la mise à jour du v-model avec la nouvelle taille d'image
    const editor = editorWrapper.value.querySelector('.ql-editor');
    if (editor) {
      localContent.value = editor.innerHTML;
    }
  }
};

onUnmounted(() => {
  document.removeEventListener('click', handleEditorClick);
  window.removeEventListener('resize', updateOverlayPosition);
});
</script>

<style>
/* Style des sélecteurs Font & Size façon "Moderne" (bg gris, coins arrondis) */
.ql-toolbar .ql-picker.ql-font,
.ql-toolbar .ql-picker.ql-size {
  background-color: #f3f4f6;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  padding: 0 4px;
  height: 28px !important;
  display: inline-flex;
  align-items: center;
  margin-right: 6px !important;
  width: 130px !important;
}

.dark .ql-toolbar .ql-picker.ql-font,
.dark .ql-toolbar .ql-picker.ql-size {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.ql-toolbar .ql-picker-label {
  border: none !important;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.ql-toolbar .ql-picker-options {
  border-radius: 6px !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  padding: 4px 0 !important;
}

.dark .ql-toolbar .ql-picker-options {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}

/* Noms d'affichage des Polices */
.ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before { content: 'System Font' !important; font-family: sans-serif; }

.ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="serif"]::before { content: 'Serif' !important; font-family: serif; }

.ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before { content: 'Monospace' !important; font-family: monospace; }

.ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="arial"]::before { content: 'Arial' !important; font-family: Arial, sans-serif; }

.ql-picker.ql-font .ql-picker-label[data-value="times"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="times"]::before { content: 'Times New Roman' !important; font-family: 'Times New Roman', Times, serif; }

.ql-picker.ql-font .ql-picker-label[data-value="courier"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="courier"]::before { content: 'Courier New' !important; font-family: 'Courier New', Courier, monospace; }

.ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before { content: 'Georgia' !important; font-family: Georgia, serif; }

.ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before { content: 'Verdana' !important; font-family: Verdana, sans-serif; }

.ql-picker.ql-font .ql-picker-label[data-value="trebuchet"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="trebuchet"]::before { content: 'Trebuchet MS' !important; font-family: 'Trebuchet MS', sans-serif; }

/* Noms d'affichage par défaut si aucun data-value (fallback) */
.ql-picker.ql-font .ql-picker-label:not([data-value])::before,
.ql-picker.ql-font .ql-picker-item:not([data-value])::before { content: 'System Font' !important; }

/* Noms d'affichage des Tailles (Size) */
.ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="10px"]::before { content: '10px' !important; font-size: 10px; }

.ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="12px"]::before { content: '12px' !important; font-size: 12px; }

.ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="14px"]::before { content: '14px' !important; font-size: 14px; }

.ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="16px"]::before { content: '16px' !important; font-size: 16px; }

.ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="18px"]::before { content: '18px' !important; font-size: 18px; }

.ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="20px"]::before { content: '20px' !important; font-size: 20px; }

.ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="24px"]::before { content: '24px' !important; font-size: 24px; }

.ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="32px"]::before { content: '32px' !important; font-size: 32px; }

.ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="48px"]::before { content: '48px' !important; font-size: 48px; }

.ql-picker.ql-size .ql-picker-label:not([data-value])::before,
.ql-picker.ql-size .ql-picker-item:not([data-value])::before { content: 'Normal' !important; }
</style>
