<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
                Mon Application
              </NuxtLink>
            </div>
            <nav class="ml-10 flex space-x-4">
              <NuxtLink 
                to="/admin" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Administration
              </NuxtLink>
              <NuxtLink 
                to="/admin/filieres" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Filières
              </NuxtLink>
            </nav>
          </div>
          <div class="flex items-center">
            <ColorMode />
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <!-- Notifications -->
    <UNotifications />
  </div>
</template>