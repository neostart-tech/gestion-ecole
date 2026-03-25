<template>
  <div class="nationalite-selector" ref="selectorRef">
    <label 
      v-if="label" 
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Bouton de sélection -->
    <div
      ref="triggerRef"
      @click="toggleDropdown"
      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer flex items-center justify-between transition-all duration-200 hover:border-indigo-500"
      :class="{ 'border-indigo-500 ring-2 ring-indigo-200': isOpen }"
    >
      <div class="flex items-center space-x-3">
        <span 
          v-if="selectedCountry && selectedCountry.flagCode !== 'unknown'" 
          :class="['fi', `fi-${selectedCountry.flagCode}`]"
          class="fi-icon"
        ></span>
        <span v-else class="fi-icon-placeholder"></span>
        <span class="text-gray-900 dark:text-white" :class="{ 'text-gray-400': !selectedCountry }">
          {{ selectedCountry?.name || placeholder }}
        </span>
      </div>
      <svg 
        class="h-5 w-5 text-gray-400 transition-transform duration-200" 
        :class="{ 'rotate-180': isOpen }" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
    <!-- Dropdown via Teleport -->
    <Teleport to="body">
      <div 
        v-if="isOpen" 
        class="fixed inset-0"
        style="z-index: 99998;"
        @click.self="closeDropdown"
      >
        <div 
          class="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden"
          :style="dropdownStyle"
        >
          <!-- Barre de recherche -->
          <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="relative">
              <input
                ref="searchInputRef"
                v-model="searchTerm"
                type="text"
                placeholder="Rechercher une nationalité..."
                class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @keydown.esc="closeDropdown"
              />
              <svg class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Liste des pays -->
          <div class="max-h-80 overflow-y-auto">
            <div
              v-for="country in filteredCountries"
              :key="country.code"
              @click="selectCountry(country)"
              class="px-3 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors flex items-center justify-between"
              :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': selectedCountry?.code === country.code }"
            >
              <div class="flex items-center space-x-3">
                <span 
                  v-if="country.flagCode !== 'unknown'" 
                  :class="['fi', `fi-${country.flagCode}`]"
                  class="fi-icon"
                ></span>
                <span v-else class="fi-icon-placeholder"></span>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ country.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ country.code }}
                  </div>
                </div>
              </div>
              <svg 
                v-if="selectedCountry?.code === country.code" 
                class="h-4 w-4 text-indigo-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <!-- Aucun résultat -->
            <div v-if="filteredCountries.length === 0" class="px-3 py-8 text-center">
              <svg class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aucune nationalité trouvée</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    
    <p v-if="helpText" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Nationalité'
  },
  placeholder: {
    type: String,
    default: 'Sélectionner une nationalité'
  },
  required: {
    type: Boolean,
    default: false
  },
  helpText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { $countries } = useNuxtApp()

const isOpen = ref(false)
const searchTerm = ref('')
const triggerRef = ref(null)
const selectorRef = ref(null)
const searchInputRef = ref(null)
const dropdownStyle = ref({})

// Trouver le Togo dans la liste des pays
const togoCountry = computed(() => {
  return $countries.find(c => c.name === 'Togo' || c.code === 'TG')
})

const selectedCountry = computed(() => {
  if (!props.modelValue) return null
  return $countries.find(c => c.name === props.modelValue)
})

const filteredCountries = computed(() => {
  if (!searchTerm.value) return $countries
  const term = searchTerm.value.toLowerCase()
  return $countries.filter(c => 
    c.name.toLowerCase().includes(term) || 
    (c.code && c.code.toLowerCase().includes(term))
  )
})

const toggleDropdown = async () => {
  if (isOpen.value) {
    closeDropdown()
  } else {
    isOpen.value = true
    await nextTick()
    updateDropdownPosition()
    if (searchInputRef.value) {
      searchInputRef.value.focus()
    }
  }
}

const closeDropdown = () => {
  isOpen.value = false
  searchTerm.value = ''
}

const updateDropdownPosition = () => {
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 400
    
    let top = rect.bottom + window.scrollY + 5
    
    if (top + dropdownHeight > window.scrollY + viewportHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 5
    }
    
    dropdownStyle.value = {
      top: `${top}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      maxHeight: `${Math.min(dropdownHeight, viewportHeight - 40)}px`
    }
  }
}

const selectCountry = (country) => {
  emit('update:modelValue', country.name)
  closeDropdown()
}

const handleScroll = () => {
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

const handleResize = () => {
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown()
  }
}

// Initialiser avec le Togo par défaut
onMounted(() => {
  // Si aucune valeur n'est sélectionnée, mettre Togo par défaut
  if (!props.modelValue && togoCountry.value) {
    emit('update:modelValue', togoCountry.value.name)
  }
  
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

.fi-icon {
  display: inline-block;
  width: 1.75rem;
  height: 1.75rem;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

.fi-icon-placeholder {
  display: inline-block;
  width: 1.75rem;
  height: 1.75rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

.dark .fi-icon-placeholder {
  background: #374151;
}
</style>