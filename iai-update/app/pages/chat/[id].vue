<script setup>
const route = useRoute();
const conversationId = route.params.id;

const messages = ref([]);
const loading = ref(true);

const { $echo } = useNuxtApp();

const fetchMessages = async () => {
  const { data } = await useFetch(
    `http://localhost:8000/api/conversations/${conversationId}/messages`,
    { credentials: "include" }
  );

  messages.value = data.value;
  loading.value = false;
};

onMounted(async () => {
  await fetchMessages();

  // TEMPS REEL
  $echo.private(`conversation.${conversationId}`)
    .listen("MessageSent", (e) => {
      messages.value.push(e);
      scrollBottom();
    });
});

const scrollBottom = () => {
  nextTick(() => {
    const el = document.getElementById("chat-body");
    el.scrollTop = el.scrollHeight;
  });
};
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <ChatWindow :messages="messages" />

    <MessageInput
      :conversation-id="conversationId"
      @sent="messages.push($event)"
    />
  </div>
</template>