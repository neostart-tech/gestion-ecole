<template>
  <div class="relative flex flex-col gap-2">
    <!-- Barre d'actions Tableau -->
    <div v-if="selectedTable && !isReadOnly" class="flex flex-wrap items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 rounded-t-xl z-20">
      <span class="font-medium flex items-center gap-1 text-[#00b3d4]">
        Tableau :
      </span>
      <button type="button" @click.stop="addRow" class="table-action-btn px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded border border-slate-300 dark:border-slate-600 font-medium transition-colors">
        + Ligne
      </button>
      <button type="button" @click.stop="addColumn" class="table-action-btn px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded border border-slate-300 dark:border-slate-600 font-medium transition-colors">
        + Colonne
      </button>
      <button type="button" @click.stop="deleteRow" class="table-action-btn px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded border border-red-200 dark:border-red-800 font-medium transition-colors">
        - Ligne
      </button>
      <button type="button" @click.stop="deleteColumn" class="table-action-btn px-2.5 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded border border-red-200 dark:border-red-800 font-medium transition-colors">
        - Colonne
      </button>
      <button type="button" @click.stop="deleteTable" class="table-action-btn px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded font-medium transition-colors ml-auto">
        Supprimer le tableau
      </button>
    </div>

    <div class="relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 w-full min-h-[250px]" ref="editorWrapper">
      <!-- Popover de Grille Visuelle pour insérer un Tableau -->
      <div v-if="showGridPicker && !isReadOnly" class="absolute z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-3.5 top-14 left-4 w-auto min-w-[220px] transition-all duration-200 grid-picker-container">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span>Insérer un tableau</span>
          <button @click.stop="showGridPicker = false" type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-1">
            ✕
          </button>
        </div>

        <!-- Indication dimensions -->
        <div class="text-center text-xs font-bold text-[#00b3d4] dark:text-[#6cc6e2] mb-2.5 bg-slate-50 dark:bg-slate-900/70 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
          {{ hoveredRows }} × {{ hoveredCols }} Tableau
        </div>

        <!-- Matrice Grille -->
        <div class="grid gap-1.5 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg cursor-pointer border border-slate-100 dark:border-slate-700/50"
             :style="{ gridTemplateColumns: `repeat(${gridMaxCols}, minmax(0, 1fr))` }"
             @mouseleave="hoveredRows = 3; hoveredCols = 3;">
          <template v-for="r in gridMaxRows" :key="'r-'+r">
            <div v-for="c in gridMaxCols"
                 :key="'c-'+r+'-'+c"
                 @mouseenter="hoveredRows = r; hoveredCols = c;"
                 @click.stop="insertCustomTable(r, c)"
                 class="w-4 h-4 rounded-sm border transition-colors duration-100"
                 :class="[
                   r <= hoveredRows && c <= hoveredCols
                     ? 'bg-[#00b3d4] border-[#00b3d4] shadow-sm'
                     : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                 ]"
            ></div>
          </template>
        </div>
      </div>

      <ClientOnly>
        <QuillEditor
          v-model:content="localContent"
          contentType="html"
          :toolbar="isReadOnly ? false : toolbarOptions"
          :readOnly="isReadOnly"
          theme="snow"
          class="w-full text-slate-900 dark:text-slate-100 quill-custom-editor"
          style="min-height: 250px;"
          @ready="onEditorReady"
        />
      </ClientOnly>

      <!-- Overlay de redimensionnement fait maison -->
      <div v-if="selectedImage && !isReadOnly" 
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const isReadOnly = computed(() => props.readOnly || props.disabled);

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
  ['link', 'image', 'video', 'table'],
  ['clean']
];

const editorWrapper = ref(null);
const selectedImage = ref(null);
const overlayStyle = ref({ top: '0px', left: '0px', width: '0px', height: '0px' });

let startX = 0, startY = 0;
let startWidth = 0, startHeight = 0;
let resizeDirection = '';

const selectedTable = ref(null);
const selectedTd = ref(null);

const showGridPicker = ref(false);
const hoveredRows = ref(3);
const hoveredCols = ref(3);
const gridMaxRows = 8;
const gridMaxCols = 10;

let currentQuill = null;

const onEditorReady = async (quill) => {
  currentQuill = quill;
  try {
    const Size = quill.constructor.import('attributors/style/size');
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
    quill.constructor.register(Size, true);

    const FontStyle = quill.constructor.import('attributors/style/font');
    FontStyle.whitelist = ['sans-serif', 'serif', 'monospace', 'arial', 'times', 'courier', 'georgia', 'verdana', 'trebuchet'];
    quill.constructor.register(FontStyle, true);

    const toolbar = quill.getModule('toolbar');
    if (toolbar) {
      toolbar.addHandler('table', () => {
        if (!isReadOnly.value) {
          showGridPicker.value = !showGridPicker.value;
        }
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation des polices/tableaux Quill :", error);
  }
};

const insertCustomTable = (rows, cols) => {
  if (!currentQuill || isReadOnly.value) return;

  showGridPicker.value = false;

  const range = currentQuill.getSelection(true) || { index: 0 };

  let headerCells = '';
  for (let c = 1; c <= cols; c++) {
    headerCells += `<th style="border: 1px solid #cbd5e1; padding: 8px 12px; background-color: #f1f5f9; text-align: left; font-weight: 600;">En-tête ${c}</th>`;
  }

  let bodyRows = '';
  for (let r = 1; r <= rows; r++) {
    let rowCells = '';
    for (let c = 1; c <= cols; c++) {
      rowCells += `<td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Cellule ${r}.${c}</td>`;
    }
    bodyRows += `<tr>${rowCells}</tr>`;
  }

  const tableHTML = `<table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
    <thead><tr>${headerCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table><p><br></p>`;

  currentQuill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
  triggerEditorUpdate();
};

const handleEditorClick = (e) => {
  if (isReadOnly.value) {
    selectedTd.value = null;
    selectedTable.value = null;
    showGridPicker.value = false;
    selectedImage.value = null;
    return;
  }

  const td = e.target.closest('td, th');
  const table = e.target.closest('table');
  if (td && table && editorWrapper.value?.contains(table)) {
    selectedTd.value = td;
    selectedTable.value = table;
  } else if (!e.target.closest('.table-action-btn')) {
    selectedTd.value = null;
    selectedTable.value = null;
  }

  if (!e.target.closest('.grid-picker-container') && !e.target.closest('.ql-table')) {
    showGridPicker.value = false;
  }

  if (e.target.tagName === 'IMG' && e.target.closest('.ql-editor')) {
    selectedImage.value = e.target;
    updateOverlayPosition();
  } else if (!e.target.closest('.pointer-events-auto')) {
    selectedImage.value = null;
  }
};

const addRow = () => {
  if (!selectedTable.value || isReadOnly.value) return;
  const tr = selectedTd.value?.closest('tr') || selectedTable.value.querySelector('tr:last-child');
  if (!tr) return;
  const colCount = tr.children.length;
  const newTr = document.createElement('tr');
  for (let i = 0; i < colCount; i++) {
    const td = document.createElement('td');
    td.style.border = '1px solid #cbd5e1';
    td.style.padding = '8px 12px';
    td.innerHTML = 'Nouvelle cellule';
    newTr.appendChild(td);
  }
  tr.after(newTr);
  triggerEditorUpdate();
};

const addColumn = () => {
  if (!selectedTable.value || isReadOnly.value) return;
  const trs = selectedTable.value.querySelectorAll('tr');
  const targetIndex = selectedTd.value ? Array.from(selectedTd.value.parentElement.children).indexOf(selectedTd.value) : -1;
  trs.forEach((tr, index) => {
    const isHeader = tr.parentElement.tagName === 'THEAD' || (index === 0 && tr.querySelector('th'));
    const cell = document.createElement(isHeader ? 'th' : 'td');
    cell.style.border = '1px solid #cbd5e1';
    cell.style.padding = '8px 12px';
    if (isHeader) {
      cell.style.backgroundColor = '#f1f5f9';
      cell.style.fontWeight = '600';
      cell.innerHTML = 'En-tête';
    } else {
      cell.innerHTML = 'Nouvelle cellule';
    }
    if (targetIndex >= 0 && tr.children[targetIndex]) {
      tr.children[targetIndex].after(cell);
    } else {
      tr.appendChild(cell);
    }
  });
  triggerEditorUpdate();
};

const deleteRow = () => {
  if (!selectedTable.value || !selectedTd.value || isReadOnly.value) return;
  const tr = selectedTd.value.closest('tr');
  if (tr) {
    tr.remove();
    selectedTd.value = null;
    if (!selectedTable.value.querySelector('tr')) {
      selectedTable.value.remove();
      selectedTable.value = null;
    }
    triggerEditorUpdate();
  }
};

const deleteColumn = () => {
  if (!selectedTable.value || !selectedTd.value || isReadOnly.value) return;
  const targetIndex = Array.from(selectedTd.value.parentElement.children).indexOf(selectedTd.value);
  if (targetIndex < 0) return;
  const trs = selectedTable.value.querySelectorAll('tr');
  trs.forEach(tr => {
    if (tr.children[targetIndex]) {
      tr.children[targetIndex].remove();
    }
  });
  selectedTd.value = null;
  triggerEditorUpdate();
};

const deleteTable = () => {
  if (selectedTable.value && !isReadOnly.value) {
    selectedTable.value.remove();
    selectedTable.value = null;
    selectedTd.value = null;
    triggerEditorUpdate();
  }
};

const triggerEditorUpdate = () => {
  const editor = editorWrapper.value?.querySelector('.ql-editor');
  if (editor) {
    localContent.value = editor.innerHTML;
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
  if (isReadOnly.value) return;
  resizeDirection = direction;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = selectedImage.value.offsetWidth;
  startHeight = selectedImage.value.offsetHeight;
  
  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
};

const onResize = (e) => {
  if (!selectedImage.value || isReadOnly.value) return;
  
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

/* Table styling for Quill editor */
.ql-editor table {
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 1rem 0 !important;
}

.ql-editor td,
.ql-editor th {
  border: 1px solid #cbd5e1 !important;
  padding: 8px 12px !important;
  min-width: 40px !important;
}

.dark .ql-editor td,
.dark .ql-editor th {
  border-color: #334155 !important;
}
</style>
