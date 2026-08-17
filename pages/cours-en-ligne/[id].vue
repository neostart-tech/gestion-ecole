<template>
  <div>
    <LiveKitClassroom
      :room-name="`cours-${courseId}`"
      :room-title="`Cours en ligne #${courseId}`"
      @leave="handleLeave"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import LiveKitClassroom from '~/components/cours/LiveKitClassroom.vue'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const courseId = route.params.id

const handleLeave = () => {
  router.push('/dashboard')
}
</script>
