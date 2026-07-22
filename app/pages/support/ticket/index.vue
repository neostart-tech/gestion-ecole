<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors duration-500">

    <!-- Fil d'Ariane & Titre -->
    <div class="mb-8">
      <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
        <NuxtLink to="/" class="hover:text-violet-600 transition-colors">Accueil</NuxtLink>
        <span class="opacity-30">/</span>
        <span class="text-violet-600 dark:text-violet-400">Support Client</span>
      </nav>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Assistance & Support</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos demandes et communiquez avec notre équipe technique.</p>
        </div>
        <button @click="openAddModal" class="btn-premium-violet">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v14M5 12h14"/>
          </svg>
          Créer un ticket
        </button>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="glass-card p-5 border-l-4 border-l-gray-400">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-black uppercase tracking-tighter text-gray-400">Total Demandes</span>
          <div class="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
        </div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">{{ ticketStore.nombreTickets }}</div>
      </div>

      <div class="glass-card p-5 border-l-4 border-l-violet-500">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-black uppercase tracking-tighter text-violet-500">Tickets Ouverts</span>
          <div class="p-1.5 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
            <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
        </div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">{{ ticketStore.ticketsOuverts }}</div>
      </div>

      <div class="glass-card p-5 border-l-4 border-l-amber-500">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-black uppercase tracking-tighter text-amber-500">En cours</span>
          <div class="p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">{{ ticketStore.ticketsEnCours }}</div>
      </div>

      <div class="glass-card p-5 border-l-4 border-l-emerald-500">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-black uppercase tracking-tighter text-emerald-500">Résolus</span>
          <div class="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        <div class="text-3xl font-black text-gray-900 dark:text-white">{{ ticketStore.ticketsResolus }}</div>
      </div>
    </div>

    <!-- Toolbar & Filters -->
    <div class="glass-card p-4 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex flex-col sm:flex-row gap-3 flex-1">
        <div class="relative group flex-1 max-w-md">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Référence ou titre du ticket..."
            class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-violet-600/20 transition-all dark:text-white"
          />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="statusFilter" class="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-600/20 transition-all dark:text-white min-w-[160px]">
            <option value="all">Tous les statuts</option>
            <option value="open">Ouverts</option>
            <option value="in_progress">En cours</option>
            <option value="waiting">En attente</option>
            <option value="resolved">Résolus</option>
            <option value="closed">Fermés</option>
          </select>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">Affichage :</span>
        <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button @click="itemsPerPage = 10" :class="itemsPerPage === 10 ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600' : 'text-gray-400'" class="px-3 py-1 rounded-md text-[10px] font-bold transition-all">10</button>
          <button @click="itemsPerPage = 25" :class="itemsPerPage === 25 ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600' : 'text-gray-400'" class="px-3 py-1 rounded-md text-[10px] font-bold transition-all">25</button>
          <button @click="itemsPerPage = 50" :class="itemsPerPage === 50 ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600' : 'text-gray-400'" class="px-3 py-1 rounded-md text-[10px] font-bold transition-all">50</button>
        </div>
      </div>
    </div>

    <!-- Main Table Container -->
    <div class="glass-card overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-violet-900/30"></div>
          <div class="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
        </div>
        <p class="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Synchronisation en cours...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTickets.length === 0" class="flex flex-col items-center justify-center py-32 gap-6 text-center px-6">
        <div class="w-20 h-20 rounded-3xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <svg class="w-10 h-10 text-violet-200 dark:text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Aucun ticket à afficher</h3>
          <p class="text-sm text-gray-400 max-w-xs mx-auto mt-1">Vous n'avez pas encore de demande d'assistance correspondant à vos filtres.</p>
        </div>
        <button @click="openAddModal" class="btn-premium-violet btn-sm">Ouvrir un ticket</button>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <Vue3Datatable
          :columns="columns"
          :rows="filteredTickets"
          :search="searchQuery"
          :per-page="itemsPerPage"
          skin="bh-table-hover bh-table-compact"
          class="premium-table"
        >
          <!-- Reference Column -->
          <template #reference="data">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-700">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              </div>
              <span class="font-mono text-[11px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-tighter">
                {{ data.value?.reference || data.row?.reference || data.reference }}
              </span>
            </div>
          </template>

          <!-- Subject/Category Column -->
          <template #title="data">
            <div class="py-2">
              <p class="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1 truncate max-w-[200px] lg:max-w-[400px]">
                {{ data.value?.title || data.row?.title || data.title }}
              </p>
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full" :style="{ background: (data.value?.category?.color || data.row?.category?.color || '#94a3b8') }"></div>
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {{ data.value?.category?.name || data.row?.category?.name || 'Assistance' }}
                </span>
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template #status="data">
            <div class="flex justify-center">
              <span :class="['status-chip', `status-${data.value?.status || data.row?.status || data.status}`]">
                {{ getStatusLabel(data.value?.status || data.row?.status || data.status) }}
              </span>
            </div>
          </template>

          <!-- Priority Column -->
          <template #priority="data">
            <div class="flex items-center justify-center gap-2">
              <div :class="['w-2 h-2 rounded-full', getPriorityDot(data.value?.priority || data.row?.priority || data.priority)]"></div>
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {{ getPriorityLabel(data.value?.priority || data.row?.priority || data.priority) }}
              </span>
            </div>
          </template>

          <!-- Date Column -->
          <template #created_at="data">
            <div class="text-center">
              <p class="text-[10px] font-black text-gray-500 dark:text-gray-400">{{ formatDate(data.value?.created_at || data.row?.created_at || data.created_at) }}</p>
            </div>
          </template>

          <!-- Action Column -->
          <template #action="data">
            <div class="flex items-center justify-center gap-2">
              <button @click="openDetails(data.value?.id || data.row?.id || data.id)" class="btn-icon-violet" title="Détails">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </button>
              <button
                v-if="['open', 'in_progress', 'waiting'].includes(data.value?.status || data.row?.status || data.status)"
                @click="confirmClose(data.value?.id || data.row?.id || data.id)"
                class="btn-icon-emerald"
                title="Clôturer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Modal Création Ticket -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-md" aria-hidden="true" @click="closeModal"/>
        </TransitionChild>
        
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95 translate-y-4" enter-to="opacity-100 scale-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 scale-100 translate-y-0" leave-to="opacity-0 scale-95 translate-y-4">
            <DialogPanel class="w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div class="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <DialogTitle class="text-xl font-black text-gray-900 dark:text-white">Nouvelle Demande</DialogTitle>
                <button @click="closeModal" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <form @submit.prevent="saveTicket" class="p-8 space-y-6">
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="input-label">Catégorie</label>
                    <select v-model="form.category_id" required class="premium-select w-full">
                      <option value="" disabled>Sélectionner...</option>
                      <option v-for="cat in ticketStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="input-label">Urgence</label>
                    <select v-model="form.priority" required class="premium-select w-full">
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute (Urgent)</option>
                      <option value="critical">Critique</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="input-label">Sujet de votre demande</label>
                  <input v-model="form.title" type="text" required placeholder="Ex: Problème d'accès à mes cours" class="premium-input w-full"/>
                </div>

                <div class="space-y-2">
                  <label class="input-label">Description détaillée</label>
                  <textarea v-model="form.description" required rows="5" placeholder="Décrivez votre problème le plus précisément possible..." class="premium-input w-full resize-none"></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button type="button" @click="closeModal" class="px-6 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Annuler</button>
                  <button type="submit" :disabled="ticketStore.isLoading" class="btn-premium-violet">
                    <span v-if="ticketStore.isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></span>
                    {{ ticketStore.isLoading ? 'Envoi en cours...' : 'Envoyer ma demande' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Panneau de Discussion Latéral -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" class="relative z-50" @close="showDetailsModal = false">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-md" aria-hidden="true" @click="showDetailsModal = false"/>
        </TransitionChild>

        <div class="fixed inset-0 flex justify-end">
          <TransitionChild as="template" enter="transform transition ease-out duration-400" enter-from="translate-x-full shadow-none" enter-to="translate-x-0 shadow-2xl" leave="transform transition ease-in duration-300" leave-from="translate-x-0" leave-to="translate-x-full">
            <DialogPanel class="w-full max-w-xl h-full bg-white dark:bg-gray-900 flex flex-col relative">
              
              <!-- Sidebar Header -->
              <div v-if="selectedTicket" class="px-6 py-6 border-b border-gray-50 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[10px] font-black text-gray-500">
                        {{ selectedTicket.reference }}
                      </span>
                      <span :class="['status-chip', `status-${selectedTicket.status}`]">
                        {{ getStatusLabel(selectedTicket.status) }}
                      </span>
                    </div>
                    <h2 class="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 truncate">{{ selectedTicket.title }}</h2>
                    
                    <div class="flex flex-wrap items-center gap-3">
                      <div v-if="selectedTicket.assigned_agent" class="flex items-center gap-2 px-2 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
                        <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
                        <span class="text-[10px] font-bold text-violet-600 dark:text-violet-400">Agent : {{ selectedTicket.assigned_agent.name }}</span>
                      </div>
                      <button v-else-if="isStaffUser" @click="assignToMe(selectedTicket.id)" class="text-[10px] font-black uppercase tracking-widest text-white bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded-xl shadow-lg shadow-violet-500/20 transition-all active:scale-95">
                        M'assigner ce ticket
                      </button>
                      <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Créé le {{ formatDate(selectedTicket.created_at) }}
                      </span>
                    </div>
                  </div>
                  <button @click="showDetailsModal = false" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              <!-- Chat Container -->
              <div v-if="ticketStore.isLoading && !selectedTicket" class="flex-1 flex flex-col items-center justify-center gap-4">
                <div class="w-12 h-12 rounded-full border-4 border-violet-100 dark:border-violet-900/30 border-t-violet-600 animate-spin"></div>
                <p class="text-sm font-black text-gray-400 uppercase tracking-widest">Chargement de la conversation...</p>
              </div>

              <div v-else-if="selectedTicket" class="flex-1 overflow-y-auto px-6 py-6 space-y-8 scroll-smooth custom-scrollbar" id="chat-container">
                <!-- Initial Description -->
                <div class="flex gap-4">
                  <div class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div class="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                    <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                      <span class="text-[10px] font-black uppercase tracking-widest text-violet-600">Description Initiale</span>
                      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ formatDate(selectedTicket.created_at) }}</span>
                    </div>
                    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{{ selectedTicket.description }}</p>
                  </div>
                </div>

                <!-- Chat Messages -->
                <div v-for="msg in selectedTicket.messages" :key="msg.id" :class="['flex gap-4 group', msg.user?.id === currentUser?.id ? 'flex-row-reverse' : '']">
                  <!-- Avatar Placeholder -->
                  <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-300', 
                    msg.user?.id === currentUser?.id 
                      ? 'bg-violet-600 border-violet-500 shadow-lg shadow-violet-500/20' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm']">
                    <span :class="['text-xs font-black uppercase tracking-widest', msg.user?.id === currentUser?.id ? 'text-white' : 'text-violet-600']">
                      {{ msg.user?.nom?.[0] || msg.user?.name?.[0] || 'S' }}
                    </span>
                  </div>

                  <!-- Bubble -->
                  <div :class="['flex-1 flex flex-col', msg.user?.id === currentUser?.id ? 'items-end' : 'items-start']">
                    <div :class="['relative max-w-[90%] rounded-3xl p-5 shadow-sm transition-all duration-300 group-hover:shadow-md', 
                      msg.user?.id === currentUser?.id 
                        ? 'bg-violet-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 rounded-tl-none']">
                      
                      <!-- Quick Actions (Self only) -->
                      <div v-if="msg.user?.id === currentUser?.id" class="absolute -top-3 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 z-10">
                        <div class="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1">
                          <button @click="editMessage(msg)" class="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/30 text-gray-400 hover:text-violet-600 transition-colors" title="Modifier">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button @click="deleteMessage(msg.id)" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </div>

                      <div class="flex items-center justify-between gap-6 mb-2 pb-2 border-b" :class="msg.user?.id === currentUser?.id ? 'border-white/10' : 'border-gray-50 dark:border-gray-700'">
                        <span class="text-[9px] font-black uppercase tracking-widest" :class="msg.user?.id === currentUser?.id ? 'text-violet-200' : 'text-violet-600'">
                          {{ msg.user?.name || msg.user?.nom || 'Agent Support' }}
                        </span>
                        <span class="text-[8px] font-bold opacity-60 uppercase tracking-tighter">{{ formatDate(msg.created_at) }}</span>
                      </div>

                      <p class="text-[13px] leading-relaxed font-medium whitespace-pre-wrap">{{ msg.message }}</p>

                      <!-- Attachments -->
                      <div v-if="msg.attachments?.length" class="mt-4 flex flex-wrap gap-2">
                        <a v-for="att in msg.attachments" :key="att.id" :href="config.app_dev_storage_url + '/storage/' + att.path" target="_blank" class="flex items-center gap-2 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[10px] font-bold transition-all border border-transparent hover:border-black/5">
                          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a6 6 0 108.485 8.485L20 10"/></svg>
                          <span class="truncate max-w-[120px]">{{ att.original_name }}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reply Area -->
              <div v-if="selectedTicket && !['closed', 'resolved'].includes(selectedTicket.status)" class="p-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 z-10">
                <!-- Mode Édition Banner -->
                <div v-if="editingMessageId" class="flex items-center justify-between px-4 py-2 bg-violet-50 dark:bg-violet-900/20 text-[10px] font-black text-violet-600 dark:text-violet-400 mb-4 rounded-xl border border-violet-100 dark:border-violet-800">
                  <div class="flex items-center gap-2">
                    <svg class="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    <span>Modification de votre message...</span>
                  </div>
                  <button @click="cancelEdit" class="hover:underline uppercase tracking-widest">Annuler</button>
                </div>

                <!-- File Preview Grid -->
                <div v-if="attachments.length || existingAttachments.length" class="flex flex-wrap gap-3 mb-4">
                  <!-- Existing -->
                  <div v-for="att in existingAttachments" :key="att.id" class="relative group">
                    <div class="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-violet-100 dark:border-violet-900 flex items-center justify-center overflow-hidden">
                      <svg class="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    </div>
                    <button @click="markForDeletion(att.id)" class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-lg shadow-red-500/20 transform hover:scale-110 transition-transform">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <!-- New -->
                  <div v-for="(file, idx) in attachments" :key="idx" class="relative group">
                    <div class="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shadow-sm">
                      <img v-if="file.type.startsWith('image/')" :src="getFilePreview(file)" class="w-full h-full object-cover" />
                      <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    </div>
                    <button @click="removeAttachment(idx)" class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-lg shadow-red-500/20 transform hover:scale-110 transition-transform">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>

                <!-- Input Box -->
                <div class="premium-reply-box" :class="{ 'ring-2 ring-violet-600/20 !border-violet-600': replyFocused }">
                  <textarea
                    v-model="replyMessage"
                    rows="4"
                    :disabled="!canMessage"
                    :placeholder="canMessage ? 'Votre réponse ici...' : 'Accès restreint à ce ticket'"
                    class="w-full bg-transparent outline-none text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none p-4 disabled:opacity-30"
                    @keydown.ctrl.enter.prevent="sendReply"
                    @focus="replyFocused = true"
                    @blur="replyFocused = false"
                  />
                  
                  <div class="px-4 pb-4 flex items-center justify-between border-t border-gray-100/50 dark:border-gray-800/50 pt-3">
                    <div class="flex items-center gap-2">
                      <button @click="$refs.fileInput.click()" class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all" title="Joindre un fichier">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a6 6 0 108.485 8.485L20 10"/></svg>
                      </button>
                      <input type="file" ref="fileInput" multiple @change="handleFiles" class="hidden" accept="image/*,application/pdf" />
                      <div class="hidden sm:block">
                        <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">
                          <kbd class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[8px]">Ctrl</kbd> + <kbd class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[8px]">Entrée</kbd>
                        </p>
                      </div>
                    </div>
                    
                    <button
                      @click="sendReply"
                      :disabled="(!replyMessage.trim() && !attachments.length) || sending || !canMessage"
                      class="btn-premium-violet btn-sm shadow-violet-500/10 disabled:opacity-30"
                    >
                      <svg v-if="sending" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                      <span class="font-black tracking-widest">{{ editingMessageId ? 'METTRE À JOUR' : 'RÉPONDRE' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Rating Area (If resolved) -->
              <div v-else-if="selectedTicket?.status === 'resolved' && !selectedTicket.rating" class="p-8 bg-violet-50 dark:bg-violet-950/20 border-t border-violet-100 dark:border-violet-900/40 z-10">
                <div class="text-center mb-6">
                  <h4 class="text-lg font-black text-violet-900 dark:text-violet-100 mb-2">Ticket Résolu !</h4>
                  <p class="text-sm text-violet-600 dark:text-violet-400">Votre avis est précieux pour nous aider à nous améliorer.</p>
                </div>
                
                <div class="flex justify-center gap-3 mb-8">
                  <button v-for="star in 5" :key="star" @click="rateTicket(star)" class="text-4xl transition-all duration-300 transform hover:scale-125 focus:outline-none">
                    <span :class="formRating >= star ? 'text-violet-500' : 'text-gray-200 dark:text-gray-700'">★</span>
                  </button>
                </div>

                <div class="space-y-4">
                  <textarea v-model="formFeedback" rows="3" placeholder="Votre expérience en quelques mots (optionnel)..." class="premium-input w-full resize-none text-sm"/>
                  <button @click="submitRating" :disabled="!formRating" class="btn-premium-violet w-full justify-center disabled:opacity-30">
                    Envoyer mon évaluation
                  </button>
                </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from "@headlessui/vue";
import config from "~~/config";
import { useTicketStore } from "~~/stores/ticket";
import { useAccess } from "~/composables/useAccess";

const { $toastr, $swal } = useNuxtApp();
const ticketStore = useTicketStore();

const searchQuery   = ref("");
const statusFilter  = ref("all");
const loading       = ref(true);
const showModal     = ref(false);
const showDetailsModal = ref(false);
const currentChannel = ref(null);
const itemsPerPage  = ref(10);
const replyMessage  = ref("");
const replyFocused  = ref(false);
const sending       = ref(false);
const formRating    = ref(0);
const formFeedback  = ref("");
const editingMessageId = ref(null);
const existingAttachments = ref([]);
const deletedAttachmentIds = ref([]);
const attachments = ref([]);
const fileInput = ref(null);

const form = ref({ title: "", description: "", priority: "medium", category_id: "" });

const columns = ref([
  { field: "reference", title: "Référence",   width: "140px", sort: true },
  { field: "title",     title: "Sujet / Demande",             sort: true },
  { field: "status",    title: "Statut",      textAlign: "center", sort: true },
  { field: "priority",  title: "Urgence",    textAlign: "center", sort: true },
  { field: "created_at",title: "Soumis le",  textAlign: "center", sort: true },
  { field: "action",    title: "Actions",     textAlign: "center", sort: false },
]);

const currentUser = ref(null);

const filteredTickets = computed(() => {
  let list = ticketStore.tickets;
  if (statusFilter.value !== "all") list = list.filter(t => t.status === statusFilter.value);
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(t => t.title?.toLowerCase().includes(q) || t.reference?.toLowerCase().includes(q));
  }
  return list;
});

const selectedTicket = computed(() => ticketStore.currentTicket);

const canMessage = computed(() => {
  if (!selectedTicket.value || !currentUser.value) return false;
  
  // Statut clos : personne ne peut écrire
  if (selectedTicket.value.status === 'closed') return false;

  const currentId = currentUser.value.id;
  
  // 1. Créateur du ticket (comparaison d'ID robuste avec ==)
  if (selectedTicket.value.ticketable?.id == currentId) return true;
  
  // 2. Agent assigné
  if (selectedTicket.value.assigned_agent?.id == currentId) return true;
  
  // 3. Staff technique (Informaticiens, Admin, etc.)
  const userRoles = currentUser.value.roles || [];
  const isStaff = userRoles.some(r => {
    const slug = (r.slug || '').toLowerCase();
    const nom = (r.nom || '').toLowerCase();
    return ['informaticien', 'admin', 'directeur', 'super-administrateur', 'coordonnateur'].some(key => 
      slug.includes(key) || nom.includes(key)
    );
  });
  
  if (isStaff) return true;

  return false;
});

const { can } = useAccess();
const isStaffUser = computed(() => can("update-ticket-support"));

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([ticketStore.fetchTickets(), ticketStore.fetchCategories()]);
    
    const userState = useState("user");
    if (userState.value) {
      currentUser.value = userState.value;
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) currentUser.value = JSON.parse(storedUser);
    }
  } finally {
    loading.value = false;
  }

  const { $echo } = useNuxtApp();
  if ($echo) {
    $echo.private('support.informaticiens')
      .listen('.App\\Events\\Support\\NewSupportMessage', (e) => {
        if (!selectedTicket.value || selectedTicket.value.id !== e.ticket_id) {
          ticketStore.fetchTickets();
        }
      })
      .listen('.App\\Events\\Support\\SupportTicketUpdated', (e) => {
        ticketStore.fetchTickets();
        if (selectedTicket.value && selectedTicket.value.id === e.ticket.id) {
           Object.assign(selectedTicket.value, e.ticket);
        }
      });
  }
});

onBeforeUnmount(() => {
  const { $echo } = useNuxtApp();
  if (currentChannel.value && $echo) $echo.leave(currentChannel.value);
  if ($echo) $echo.leave('support.informaticiens');
});

const getStatusLabel = (s) => ({ open: "Ouvert", in_progress: "En cours", waiting: "En attente", resolved: "Résolu", closed: "Fermé" }[s] || s);
const getPriorityLabel = (p) => ({ low: "Basse", medium: "Moyenne", high: "Urgente", critical: "Critique" }[p] || p);
const getPriorityDot = (p) => ({ low: "bg-gray-400", medium: "bg-blue-500", high: "bg-amber-500", critical: "bg-red-500 animate-pulse" }[p] || "bg-gray-400");

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

const openAddModal = () => {
  form.value = { title: "", description: "", priority: "medium", category_id: "" };
  showModal.value = true;
};
const closeModal = () => (showModal.value = false);

const saveTicket = async () => {
  try {
    await ticketStore.addTicket(form.value);
    $toastr.success("Votre demande a été enregistrée avec succès !");
    showModal.value = false;
  } catch (e) {
    $toastr.error(e.response?.data?.message || "Erreur lors de la création");
  }
};

const openDetails = async (id) => {
  showDetailsModal.value = true;
  const { $echo } = useNuxtApp();
  if ($echo) {
    if (currentChannel.value) $echo.leave(currentChannel.value);
    currentChannel.value = `support.ticket.${id}`;
    $echo.private(currentChannel.value)
      .listen('.App\\Events\\Support\\NewSupportMessage', (e) => {
        if (selectedTicket.value && selectedTicket.value.id === e.ticket_id) {
          const exists = selectedTicket.value.messages?.some(m => m.id === e.message.id);
          if (!exists) {
            if (!selectedTicket.value.messages) selectedTicket.value.messages = [];
            selectedTicket.value.messages.push(e.message);
            scrollToBottom();
          }
        }
      })
      .listen('.App\\Events\\Support\\SupportTicketUpdated', (e) => {
        if (selectedTicket.value && selectedTicket.value.id === e.ticket.id) {
           const currentMessages = selectedTicket.value.messages;
           Object.assign(selectedTicket.value, e.ticket);
           selectedTicket.value.messages = currentMessages;
        }
      })
      .listen('.App\\Events\\Support\\SupportMessageUpdated', (e) => {
        if (selectedTicket.value && selectedTicket.value.id === e.ticket_id) {
          const index = selectedTicket.value.messages?.findIndex(m => m.id === e.message.id);
          if (index !== -1) {
            selectedTicket.value.messages[index].message = e.message.message;
            selectedTicket.value.messages[index].attachments = e.message.attachments;
          }
        }
      })
      .listen('.App\\Events\\Support\\SupportMessageDeleted', (e) => {
        if (selectedTicket.value && selectedTicket.value.id === e.ticket_id) {
          selectedTicket.value.messages = selectedTicket.value.messages?.filter(m => m.id !== e.message_id);
        }
      });
  }
  await ticketStore.fetchTicketDetails(id);
  await scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  const el = document.getElementById("chat-container");
  if (el) el.scrollTop = el.scrollHeight;
};

const handleFiles = (e) => {
  attachments.value.push(...Array.from(e.target.files));
};
const removeAttachment = (idx) => attachments.value.splice(idx, 1);
const getFilePreview = (file) => URL.createObjectURL(file);

const sendReply = async () => {
  if ((!replyMessage.value.trim() && !attachments.value.length) || sending.value) return;
  sending.value = true;
  try {
    const formData = new FormData();
    formData.append('message', replyMessage.value);
    attachments.value.forEach(f => formData.append('attachments[]', f));
    
    if (editingMessageId.value) {
      deletedAttachmentIds.value.forEach(id => formData.append('delete_attachments[]', id));
      await ticketStore.updateMessage(editingMessageId.value, formData);
      cancelEdit();
    } else {
      await ticketStore.sendMessage(selectedTicket.value.id, formData);
      replyMessage.value = "";
      attachments.value = [];
    }
    await scrollToBottom();
  } catch {
    $toastr.error("Impossible d'envoyer le message");
  } finally {
    sending.value = false;
  }
};

const editMessage = (msg) => {
  editingMessageId.value = msg.id;
  replyMessage.value = msg.message;
  existingAttachments.value = [...(msg.attachments || [])];
  deletedAttachmentIds.value = [];
  nextTick(() => document.querySelector('textarea')?.focus());
};

const cancelEdit = () => {
  editingMessageId.value = null;
  replyMessage.value = "";
  existingAttachments.value = [];
  deletedAttachmentIds.value = [];
  attachments.value = [];
};

const markForDeletion = (id) => {
  deletedAttachmentIds.value.push(id);
  existingAttachments.value = existingAttachments.value.filter(a => a.id !== id);
};

const deleteMessage = async (msgId) => {
  const res = await $swal.fire({
    title: "Suppression",
    text: "Supprimer ce message définitivement ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Supprimer",
    confirmButtonColor: "#ef4444",
  });
  if (res.isConfirmed) await ticketStore.deleteMessage(msgId);
};

const assignToMe = async (id) => {
  try {
    await ticketStore.assignTicket(id, {});
    $toastr.success("Ticket assigné !");
  } catch (e) {
    $toastr.error("Échec de l'assignation");
  }
};

const confirmClose = async (id) => {
  const res = await $swal.fire({
    title: "Clôturer le ticket ?",
    text: "Cette action confirmera la résolution de votre demande.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, clôturer",
    confirmButtonColor: "#7c3aed",
  });
  if (res.isConfirmed) await ticketStore.updateTicketStatus(id, "closed");
};

const rateTicket = (star) => (formRating.value = star);
const submitRating = async () => {
  if (!formRating.value) return;
  try {
    await ticketStore.rateTicket(selectedTicket.value.id, { rating: formRating.value, feedback: formFeedback.value });
    $toastr.success("Merci !");
    showDetailsModal.value = false;
    await ticketStore.fetchTickets();
  } catch {
    $toastr.error("Erreur évaluation");
  }
};
</script>

<style scoped>
@reference "~/assets/css/main.css";

/* Glassmorphism Cards */
.glass-card {
  @apply bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300;
}

/* Premium Buttons */
.btn-premium-violet {
  @apply inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-violet-600 text-white text-sm font-black tracking-widest uppercase
    hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-500/20 transition-all active:scale-95 disabled:opacity-50;
}
.btn-premium-violet.btn-sm { @apply px-5 py-2.5 text-[10px]; }

.btn-icon-violet {
  @apply w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400
    hover:bg-violet-600 hover:text-white transition-all duration-300 border border-violet-100 dark:border-violet-800;
}
.btn-icon-emerald {
  @apply w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400
    hover:bg-emerald-600 hover:text-white transition-all duration-300 border border-emerald-100 dark:border-emerald-800;
}

/* Status Chips */
.status-chip {
  @apply px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm;
}
.status-open        { @apply bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800; }
.status-in_progress { @apply bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800; }
.status-waiting     { @apply bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800; }
.status-resolved    { @apply bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800; }
.status-closed      { @apply bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700; }

/* Premium Inputs */
.premium-input, .premium-select {
  @apply px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent text-sm text-gray-900 dark:text-white
    focus:bg-white dark:focus:bg-gray-900 focus:border-violet-600/30 focus:ring-4 focus:ring-violet-600/5 transition-all outline-none;
}
.input-label {
  @apply block text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1;
}

.premium-reply-box {
  @apply rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden transition-all;
}

/* Table Overrides */
/* @bhplugin/vue3-datatable ships hard-coded light colors (no dark: variants) on
   thead/tfoot backgrounds, tbody tr hover, striped rows and pagination — these
   :deep() rules override them so the table stays readable in dark mode. */
.premium-table :deep(.bh-table-responsive) { @apply rounded-none border-none; }
.premium-table :deep(thead tr),
.premium-table :deep(tfoot tr) { @apply bg-transparent; }
.premium-table :deep(thead th) {
  @apply bg-gray-50/50 dark:bg-gray-950/50 py-5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800;
}
.premium-table :deep(tbody tr) { @apply border-gray-50/50 dark:border-gray-800/50; }
.premium-table :deep(tbody td) {
  @apply py-4 px-6 border-b border-gray-50/50 dark:border-gray-800/50 transition-colors;
}
.premium-table :deep(tbody tr:hover) { @apply bg-violet-50/30 dark:bg-violet-900/20; }
.premium-table :deep(tbody tr:hover td) { @apply bg-violet-50/30 dark:bg-violet-900/20; }
.premium-table :deep(table.bh-table-striped tbody tr:nth-child(odd)) { @apply bg-gray-50/40 dark:bg-white/[0.03]; }

.premium-table :deep(.bh-pagination .bh-page-item) {
  @apply bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700;
}
.premium-table :deep(.bh-pagination .bh-page-item:hover),
.premium-table :deep(.bh-pagination .bh-page-item.bh-active) {
  @apply bg-violet-600 text-white border-violet-600;
}
.premium-table :deep(.bh-pagination-info .bh-pagesize) {
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700;
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-gray-200 dark:bg-gray-700 rounded-full; }

.kbd { @apply inline-block px-1.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[9px] shadow-sm; }
</style>