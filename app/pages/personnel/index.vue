<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  middleware: [
    () => {
      return navigateTo('/personnel/utilisateurs')
    }
  ]
})
</script>
