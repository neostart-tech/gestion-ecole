<template>
  <div :class="isfull ? 'md:col-span-2' : ''" class="group">
    <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 group-hover:text-purple-400 transition-colors">
      {{ label }}
    </p>
    <p class="text-md font-bold text-gray-800 dark:text-gray-200 bg-gray-50/30 dark:bg-gray-900/30 p-4 rounded-none border-l-2 border-gray-100 dark:border-gray-800 group-hover:border-purple-500 transition-all">
      {{ value || '—' }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  isfull: {
    type: Boolean,
    default: false
  }
})
</script>
