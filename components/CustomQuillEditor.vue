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

// Logique d'export Word
const exportToWord = () => {
  if (!localContent.value) return;
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Document Exporté</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + localContent.value + footer;
  
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `document_${new Date().getTime()}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

// Logique d'export PDF (Impression stylisée simplifiée)
const exportToPDF = () => {
  if (!localContent.value) return;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Export PDF</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${localContent.value}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
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
