<template>
  <div class="relative flex flex-col gap-2">

    <div class="relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 w-full min-h-[250px]" ref="editorWrapper">
      <ClientOnly>
        <QuillEditor
          v-model:content="localContent"
          contentType="html"
          :toolbar="toolbarOptions"
          theme="snow"
          class="w-full text-slate-900 dark:text-slate-100 quill-custom-editor"
          style="min-height: 250px;"
          @ready="onEditorReady"
        />
      </ClientOnly>

    <!-- Overlay de redimensionnement fait maison -->
    <div v-if="selectedImage" 
         class="absolute border-2 border-purple-500 z-50 pointer-events-none"
         :style="overlayStyle">
         
         <!-- Poignée Droite -->
         <div class="absolute w-4 h-4 bg-purple-600 border-2 border-white rounded-full cursor-e-resize pointer-events-auto"
              style="top: 50%; right: -8px; transform: translateY(-50%)"
              @mousedown.stop.prevent="startResize($event, 'right')"></div>
              
         <!-- Poignée Gauche -->
         <div class="absolute w-4 h-4 bg-purple-600 border-2 border-white rounded-full cursor-w-resize pointer-events-auto"
              style="top: 50%; left: -8px; transform: translateY(-50%)"
              @mousedown.stop.prevent="startResize($event, 'left')"></div>
              
         <!-- Poignée Bas -->
         <div class="absolute w-4 h-4 bg-purple-600 border-2 border-white rounded-full cursor-s-resize pointer-events-auto"
              style="left: 50%; bottom: -8px; transform: translateX(-50%)"
              @mousedown.stop.prevent="startResize($event, 'bottom')"></div>
              
         <!-- Poignée Haut -->
         <div class="absolute w-4 h-4 bg-purple-600 border-2 border-white rounded-full cursor-n-resize pointer-events-auto"
              style="left: 50%; top: -8px; transform: translateX(-50%)"
              @mousedown.stop.prevent="startResize($event, 'top')"></div>
              
         <!-- Coin Bas-Droite -->
         <div class="absolute w-4 h-4 bg-purple-600 border-2 border-white rounded-full cursor-se-resize pointer-events-auto"
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
    const Size = quill.constructor.import('attributors/style/size');
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
    quill.constructor.register(Size, true);

    const FontStyle = quill.constructor.import('attributors/style/font');
    FontStyle.whitelist = ['sans-serif', 'serif', 'monospace', 'arial', 'times', 'courier', 'georgia', 'verdana', 'trebuchet'];
    quill.constructor.register(FontStyle, true);
  } catch (error) {
    console.error("Erreur lors de l'initialisation des polices Quill :", error);
  }
};

const handleEditorClick = (e) => {
  if (e.target.tagName === 'IMG' && e.target.closest('.ql-editor')) {
    selectedImage.value = e.target;
    updateOverlayPosition();
  } else if (!e.target.closest('.pointer-events-auto')) {
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
  if (selectedImage.value) {
    const event = new Event('input', { bubbles: true });
    selectedImage.value.dispatchEvent(event);
    
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
/* ==========================================================================
   QUILL EDITOR - ESPACEMENT ET SUPPRESSION DES EFFETS HOVER
   ========================================================================== */

/* Alignement flex et espacement vertical/horizontal entre lignes de la toolbar */
.ql-toolbar.ql-snow {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 12px 14px !important;
  padding: 12px 16px !important;
  border-top-left-radius: 0.75rem !important;
  border-top-right-radius: 0.75rem !important;
  border-color: #e2e8f0 !important;
  background-color: #f8fafc !important;
}

.dark .ql-toolbar.ql-snow {
  border-color: #1e293b !important;
  background-color: #0f172a !important;
}

/* Espacement interne des groupes d'outils (.ql-formats) */
.ql-toolbar.ql-snow .ql-formats {
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
}

/* Container & Zone de saisie */
.ql-container.ql-snow {
  border-bottom-left-radius: 0.75rem !important;
  border-bottom-right-radius: 0.75rem !important;
  border-color: #e2e8f0 !important;
  background-color: #ffffff !important;
}

.dark .ql-container.ql-snow {
  border-color: #1e293b !important;
  background-color: #0b0f19 !important;
  color: #f8fafc !important;
}

.dark .ql-editor {
  color: #f8fafc !important;
}

.dark .ql-editor.ql-blank::before {
  color: #64748b !important;
}

/* Couleurs statiques des icônes SVG Quill */
.dark .ql-snow .ql-stroke {
  stroke: #cbd5e1 !important;
}

.dark .ql-snow .ql-fill {
  fill: #cbd5e1 !important;
}

.dark .ql-snow .ql-picker {
  color: #cbd5e1 !important;
}

/* SUPPRESSION TOTALE DES EFFETS AU SURVOL (HOVER) SUR BOUTONS ET SELECTEURS */
.ql-toolbar button:hover,
.ql-toolbar button:focus,
.ql-toolbar .ql-picker-label:hover,
.ql-toolbar .ql-picker-item:hover,
.dark .ql-toolbar button:hover,
.dark .ql-toolbar button:focus,
.dark .ql-toolbar .ql-picker-label:hover,
.dark .ql-toolbar .ql-picker-item:hover {
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

.dark .ql-snow .ql-picker-label:hover .ql-stroke,
.dark .ql-snow .ql-toolbar button:hover .ql-stroke,
.dark .ql-snow .ql-toolbar button:focus .ql-stroke {
  stroke: #cbd5e1 !important;
}

.dark .ql-snow .ql-picker-label:hover .ql-fill,
.dark .ql-snow .ql-toolbar button:hover .ql-fill,
.dark .ql-snow .ql-toolbar button:focus .ql-fill {
  fill: #cbd5e1 !important;
}

/* Sélecteurs (Dropdowns Header, Font, Size) */
.ql-toolbar .ql-picker {
  height: 34px !important;
  display: inline-flex !important;
  align-items: center !important;
  border-radius: 8px !important;
  border: 1px solid #cbd5e1 !important;
  background-color: #ffffff !important;
  margin-right: 0 !important;
  padding: 0 8px !important;
}

.ql-toolbar .ql-picker.ql-header {
  width: 110px !important;
}

.ql-toolbar .ql-picker.ql-font {
  width: 135px !important;
}

.ql-toolbar .ql-picker.ql-size {
  width: 100px !important;
}

.dark .ql-toolbar .ql-picker {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

.ql-toolbar .ql-picker-label {
  border: none !important;
  font-weight: 600 !important;
  font-size: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  padding: 0 !important;
  color: #334155 !important;
}

.dark .ql-toolbar .ql-picker-label {
  color: #f8fafc !important;
}

/* Menus déroulants d'options */
.ql-toolbar .ql-picker-options {
  border-radius: 8px !important;
  border: 1px solid #e2e8f0 !important;
  padding: 4px !important;
  background-color: #ffffff !important;
  z-index: 100 !important;
  margin-top: 4px !important;
}

.dark .ql-toolbar .ql-picker-options {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

.ql-toolbar .ql-picker-item {
  border-radius: 4px !important;
  padding: 4px 8px !important;
  font-size: 12px !important;
}

.dark .ql-toolbar .ql-picker-item {
  color: #cbd5e1 !important;
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

.ql-picker.ql-font .ql-picker-label:not([data-value])::before,
.ql-picker.ql-font .ql-picker-item:not([data-value])::before { content: 'System Font' !important; }

/* Noms d'affichage des Tailles */
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
.ql-picker.ql-size .ql-picker-item[data-value="16px"]::before,
.ql-picker.ql-size .ql-picker-item:not([data-value])::before { content: 'Normal' !important; }
</style>
