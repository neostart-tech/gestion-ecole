<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
    <div class="py-10 text-center">
      <svg
        class="mx-auto h-10 w-10 text-indigo-500 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p class="mt-3 text-gray-600 dark:text-gray-400">
        Chargement des données, veuillez patienter...
      </p>
    </div>
  </div>
</template>
