<template>
  <div>
    <LiveKitClassroom
      :room-name="courseSlug"
      :room-title="formattedTitle"
      @leave="handleLeave"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LiveKitClassroom from '~/components/cours/LiveKitClassroom.vue'

const route = useRoute()
const router = useRouter()

// Slug récupéré depuis l'URL (ex: /cours-en-ligne/maths-l1-info)
const courseSlug = computed(() => route.params.id || route.params.slug || 'demo')

// Formater le titre joliment (ex: "maths-l1-info" -> "Cours : Maths L1 Info")
const formattedTitle = computed(() => {
  const raw = courseSlug.value
  const formatted = raw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return `Cours : ${formatted}`
})

const handleLeave = () => {
  router.push('/cours-en-ligne')
}
</script>
