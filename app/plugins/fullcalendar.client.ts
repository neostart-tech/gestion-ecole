export default defineNuxtPlugin(() => {
  return {
    provide: {
      isClient: process.client
    }
  }
})
