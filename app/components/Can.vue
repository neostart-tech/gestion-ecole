<script setup>
import { computed } from "vue";
import { useAccess } from "~/composables/useAccess";

const props = defineProps({
  action: {
    type: [String, Array],
    required: true,
  },
  mode: {
    type: String,
    default: "and",
  },
});

const { can } = useAccess();
const userLoaded = useState("userLoaded");

console.log("[Can.vue] props.action:", props.action, "props.mode:", props.mode);
const allowed = computed(() => {
  if (!userLoaded.value) return false;

  if (Array.isArray(props.action)) {
    return props.mode === "or"
      ? props.action.some(can)
      : props.action.every(can);
  }

  return can(props.action);
});
</script>

<template>
  <slot v-if="userLoaded && allowed" />
</template>
