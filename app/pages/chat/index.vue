<template>
  <div class="chat-root min-h-screen p-3 sm:p-4 md:p-6 transition-colors">
    <div
      v-if="isMobile && showMobileSidebar"
      class="overlay"
      @click="showMobileSidebar = false"
    />

    <aside
      class="sidebar"
      :class="{
        'sidebar--open': showMobileSidebar,
        'sidebar--mobile': isMobile,
      }"
    >
      <div class="flex items-center justify-between px-4 py-3 bg-[#25d366]">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <span class="text-white font-semibold text-lg tracking-tight" style="color: #fff !important">Annonce</span>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 bg-white/20 rounded-full pl-3 pr-1.5 py-1.5 hover:bg-white/30 transition-colors duration-200 cursor-pointer">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style="color: white !important">
              {{ userInitials }}
            </div>
            <div class="w-2.5 h-2.5 rounded-full border-2 border-[#7F46FE] -ml-1" :class="chatStore.echoConnected ? 'bg-[#25D366]' : 'bg-[#F44336]'"></div>
          </div>

          <button v-if="isMobile" @click="showMobileSidebar = false" class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="sidebar-new p-3 bg-white border-b border-gray-200">
        <button @click="showCreateDialog = true" class="mt-10 w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-[#25d366] hover:bg-[#25D366] text-white font-semibold text-sm rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="stroke-white">
            <path d="M12 4v16M4 12h16" />
          </svg>
          <span>Nouvelle conversation</span>
        </button>
      </div>

      <div class="conv-list">
        <template v-if="chatStore.isLoading">
          <div v-for="i in 6" :key="i" class="conv-skeleton">
            <div class="conv-skeleton__avatar sk" />
            <div class="conv-skeleton__lines">
              <div class="sk sk--line sk--w70" />
              <div class="sk sk--line sk--w45" style="margin-top: 8px" />
            </div>
          </div>
        </template>

        <div v-else-if="chatStore.conversations.length === 0" class="conv-empty">
          <div class="conv-empty__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <p>Aucune conversation</p>
          <span>Créez-en une nouvelle</span>
        </div>

        <template v-else>
          <div v-for="conv in chatStore.conversations" :key="conv.id" class="flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-gray-100 hover:bg-gray-50 relative group" :class="{ 'bg-gray-100 hover:bg-[#DCF8C6]': chatStore.currentConversation?.id === conv.id }" @click="selectConversation(conv)">
            <div class="relative flex-shrink-0">
              <div class="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center font-semibold text-base shadow-sm" :class="{ 'ring-2 ring-white shadow-md scale-[1.02]': chatStore.currentConversation?.id === conv.id }">
                {{ getConversationInitials(conv) }}
              </div>
              <div v-if="conv.unread_count" class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-[#25D366] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {{ conv.unread_count }}
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-baseline mb-1">
                <strong class="text-sm font-semibold text-gray-900 truncate max-w-[160px]" :class="{ 'text-gray-900': chatStore.currentConversation?.id === conv.id }">
                  {{ getConversationName(conv) }}
                </strong>
                <time class="text-[11px] text-gray-500 flex-shrink-0">
                  {{ getLastMessageTime(conv) }}
                </time>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-600 truncate flex-1">
                  {{ getLastMessagePreview(conv) }}
                </span>
                <span v-if="conv.type === 'group'" class="text-[10px] font-semibold px-2 py-0.5 bg-[#DCF8C6] text-gray-800 rounded-full border border-[#25D366] uppercase flex-shrink-0">
                  Groupe
                </span>
              </div>
            </div>

            <div v-if="chatStore.currentConversation?.id === conv.id" class="absolute left-0 top-2 bottom-2 w-1 bg-[#25D366] rounded-r-full shadow-sm"></div>
          </div>
        </template>
      </div>
    </aside>

    <main class="chat-main">
      <template v-if="chatStore.currentConversation">
        <header class="chat-topbar" style="background-color: #25D366 !important; color: black !important">
          <button v-if="isMobile" class="topbar-menu-btn" @click="showMobileSidebar = true" aria-label="Menu" style="color: white !important">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div class="topbar-avi" style="color: white !important">
            {{ getConversationInitials(chatStore.currentConversation) }}
          </div>
          <div class="topbar-info" style="color: black !important">
            <h2 style="color: white !important">
              {{ getConversationName(chatStore.currentConversation) }}
            </h2>
            <p>
              {{ conversationParticipants.length }} participant{{ conversationParticipants.length > 1 ? "s" : "" }}
            </p>
          </div>
          <button class="icon-btn icon-btn--accent" @click="showParticipantsDialog = true" title="Participants">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </button>
        </header>

        <div ref="messagesContainer" class="messages-area">
          <template v-if="chatStore.isLoading">
            <div v-for="i in 7" :key="i" class="msg-skeleton" :class="i % 3 === 0 ? 'msg-skeleton--right' : ''" :style="{ animationDelay: i * 0.06 + 's' }">
              <div v-if="i % 3 !== 0" class="msg-skeleton__avi sk" />
              <div class="msg-skeleton__bubble sk" :style="{ width: 38 + ((i * 7) % 28) + '%' }" />
            </div>
          </template>

          <template v-else>
            <div v-for="message in chatStore.messages" :key="message.id" class="msg-row" :class="message.sender_id === userStore.user?.id ? 'msg-row--mine' : 'msg-row--theirs'">
              <div v-if="message.sender_id !== userStore.user?.id && chatStore.currentConversation?.type === 'group'" class="msg-avi">
                {{ getSenderInitials(message) }}
              </div>

              <div class="msg-wrap">
                <div v-if="message.sender_id !== userStore.user?.id" class="msg-sender-name">
                  {{ message.sender_name || getSenderName(message) }}
                </div>
                <div v-else class="msg-sender-name">
                  Vous
                </div>

                <div class="msg-bubble" :class="[message.sender_id === userStore.user?.id ? 'msg-bubble--out' : 'msg-bubble--in', message.status === 'sending' ? 'msg-bubble--sending' : '', message.status === 'error' ? 'msg-bubble--error' : '']">
                  <p v-if="message.body">{{ message.body }}</p>
                  
                  <!-- Pièces jointes -->
                  <div v-if="message.attachments && message.attachments.length" class="message-attachments">
                    <div 
                      v-for="attachment in message.attachments" 
                      :key="attachment.id" 
                      class="attachment-item"
                      :class="{ 
                        'attachment-image': attachment.is_image,
                        'attachment-pdf': attachment.is_pdf,
                        'attachment-excel': attachment.is_excel,
                        'attachment-word': attachment.is_word,
                        'attachment-powerpoint': attachment.is_powerpoint,
                        'attachment-archive': attachment.is_archive,
                        'attachment-video': attachment.is_video,
                        'attachment-audio': attachment.is_audio,
                        'attachment-text': attachment.is_text
                      }"
                    >
                      <!-- Images - affichées directement -->
                      <div 
                        v-if="attachment.is_image"
                        class="image-preview" 
                        @click="chatStore.previewAttachment(currentConversationId, message.id, attachment.id, attachment.file_type)"
                      >
                        <img 
                          :src="attachment.full_url || attachment.preview_url" 
                          :alt="attachment.file_name"
                          @error="handleImageError"
                          loading="lazy"
                        >
                        <div class="image-overlay">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Fichiers non-image - affichés sous forme de liste -->
                      <div 
                        v-else
                        class="file-attachment"
                        @click="chatStore.downloadAttachment(currentConversationId, message.id, attachment.id)"
                      >
                        <div class="file-icon-container" v-html="attachment.file_icon"></div>
                        <div class="file-info">
                          <span class="file-name">{{ attachment.file_name }}</span>
                          <span class="file-meta">
                            <span class="file-type-badge" :class="'file-type-' + attachment.file_type">
                              {{ getFileTypeLabel(attachment.file_type) }}
                            </span>
                            <span class="file-size">{{ attachment.formatted_size }}</span>
                          </span>
                        </div>
                        <button class="download-btn" @click.stop="chatStore.downloadAttachment(currentConversationId, message.id, attachment.id)">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <footer class="msg-footer">
                    <time>{{ formatTime(message.created_at) }}</time>
                    <span v-if="message.sender_id === userStore.user?.id" class="msg-tick">
                      <svg v-if="message.status === 'sending'" class="spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="9" opacity=".2" />
                        <path d="M12 3a9 9 0 019 9" stroke-linecap="round" />
                      </svg>
                      <span v-else-if="message.status === 'error'">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      </span>
                      <span v-else-if="message.status === 'sent'">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span v-else>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </span>
                      <div v-if="message.sender_id === userStore.user?.id" class="msg-actions">
    <button class="msg-action-btn" @click.stop="openEditMessage(message)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    </button>
    <button class="msg-action-btn" @click.stop="confirmDeleteMessage(message)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    </button>
  </div>

                  </footer>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div v-if="typingUsers.length > 0" class="typing-bar">
          <div class="typing-dots"><span /><span /><span /></div>
          <span>{{ typingText }}</span>
        </div>

        <div class="input-bar">
          <div class="input-wrap">
            <input ref="messageInput" v-model="newMessage" type="text" placeholder="Écrire un message…" class="msg-input" @keydown.enter.prevent="sendMessageWithFiles" @keydown="handleTyping" />
            
            <button class="attach-btn" @click="triggerFileInput" type="button" title="Joindre des fichiers">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            
            <input ref="fileInput" type="file" multiple class="hidden-file-input" @change="handleFileSelect" accept="*/*" />
            
            <button class="emoji-toggle" @click="showEmojiPicker = !showEmojiPicker" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
            
            <div v-if="showEmojiPicker" class="emoji-picker">
              <div class="emoji-categories">
                <button v-for="(category, index) in emojiCategories" :key="index" class="emoji-category" :class="{ active: selectedEmojiCategory === index }" @click="toggleEmojiCategory(index)">
                  <span v-html="getCategoryIcon(category.name)"></span>
                </button>
              </div>
              <div v-if="selectedEmojiCategory !== null" class="emoji-grid">
                <button v-for="emoji in emojiCategories[selectedEmojiCategory].list" :key="emoji" class="emoji-picker__btn" @click="addEmoji(emoji)">
                  {{ emoji }}
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="chatStore.isUploading" class="upload-progress">
            <div class="progress-bar" :style="{ width: chatStore.uploadProgress + '%' }"></div>
            <span>{{ chatStore.uploadProgress }}%</span>
          </div>
          
          <div v-if="selectedFiles.length" class="file-previews">
            <div v-for="(file, index) in selectedFiles" :key="index" class="file-preview">
              <div class="file-preview-icon">
                <svg v-if="file.type.startsWith('image/')" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <svg v-else-if="file.type === 'application/pdf'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M9 15h6" />
                  <path d="M9 18h6" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span class="file-preview-name">{{ file.name }}</span>
              <span class="file-preview-size">{{ formatFileSize(file.size) }}</span>
              <button class="file-preview-remove" @click="removeFile(index)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          
          <button class="send-btn" :disabled="(!newMessage.trim() && !selectedFiles.length) || chatStore.isUploading" @click="sendMessageWithFiles">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </template>

      <div v-else class="empty-state">
        <div class="empty-state__graphic">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <h3>Bienvenue</h3>
        <p>Sélectionnez une conversation ou démarrez-en une nouvelle.</p>
        <button class="btn-new btn-new--outline" @click="showCreateDialog = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 4v16M4 12h16" />
          </svg>
          Nouvelle conversation
        </button>
        <button v-if="isMobile" class="btn-ghost-sm" @click="showMobileSidebar = true" style="margin-top: 10px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          Voir les conversations
        </button>
      </div>
    </main>

    <!-- <Teleport to="body">
      <div v-if="showCreateDialog" class="dialog-bg" @click.self="showCreateDialog = false">
        <div class="dialog">
          <div class="dialog-head">
            <h3>Nouvelle conversation</h3>
            <button class="icon-btn" @click="showCreateDialog = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="dialog-body">
            <div class="field">
              <label class="field-label">Type de conversation</label>
              <div class="radio-row">
                <label class="radio-card" :class="{ active: newConversation.type === 'private' }">
                  <input type="radio" v-model="newConversation.type" value="private" hidden />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Privée
                </label>
                <label class="radio-card" :class="{ active: newConversation.type === 'group' }">
                  <input type="radio" v-model="newConversation.type" value="group" hidden />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Groupe
                </label>
              </div>
            </div>
            <div v-if="newConversation.type === 'group'" class="field">
              <label class="field-label">Nom du groupe</label>
              <input v-model="newConversation.name" type="text" placeholder="Ex : L3 Informatique" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Filtrer</label>
              <div class="filter-grid">
                <select v-model="selectedFiliere" @change="onFiliereChange" class="field-select">
                  <option value="">Toutes les filières</option>
                  <option v-for="f in filiereStore.filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
                </select>
                <select v-model="selectedNiveau" @change="onNiveauChange" class="field-select" :disabled="!selectedFiliere">
                  <option value="">Tous les niveaux</option>
                  <option v-for="n in filteredNiveaux" :key="n.id" :value="n.id">{{ n.libelle }}</option>
                </select>
                <select v-model="selectedGroupe" @change="onGroupeChange" class="field-select" :disabled="!selectedNiveau">
                  <option value="">Tous les groupes</option>
                  <option v-for="g in filteredGroupes" :key="g.id" :value="g.id">{{ g.nom }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="field-label">Sélection rapide</label>
              <div class="quick-row">
                <button class="pill-btn" @click="selectAllEnseignants">Enseignants</button>
                <button class="pill-btn" @click="selectAllEtudiants">Étudiants</button>
                <button class="pill-btn" @click="selectAllUsers">Tous</button>
                <button class="pill-btn pill-btn--danger" @click="selectedUsers = []">Effacer</button>
              </div>
            </div>
            <div class="field">
              <label class="field-label" style="background-color: white !important">
                Participants
                <span class="count-badge" v-if="selectedUsers.length">{{ selectedUsers.length }}</span>
              </label>
              <div class="user-list">
                <label v-for="user in availableUsers" :key="user.id" class="user-row" :class="{ selected: isUserSelected(user.id) }" @click="toggleUser(user.id)">
                  <div class="user-row__avi">{{ user.initials }}</div>
                  <div class="user-row__info">
                    <strong>{{ user.displayName }}</strong>
                    <span>{{ user.role }}</span>
                  </div>
                  <div class="user-row__check" :class="{ on: isUserSelected(user.id) }">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>
            <div v-if="selectedUsers.length" class="chips">
              <span v-for="id in selectedUsers" :key="id" class="chip">
                {{ getUserDisplayName(id) }}
                <button @click.stop="removeUser(id)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
          <div class="dialog-foot">
            <button class="btn-ghost" @click="showCreateDialog = false">Annuler</button>
            <button class="btn-primary" @click="createConversation" :disabled="!canCreate || creating">
              {{ creating ? "Création…" : "Créer la conversation" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport> -->
<CreateConversationDialog
  v-model="showCreateDialog"
  @conversation-created="handleConversationCreated"
/>

    <Teleport to="body">
      <div v-if="showParticipantsDialog" class="dialog-bg" @click.self="showParticipantsDialog = false">
        <div class="dialog dialog--sm">
          <div class="dialog-head">
            <h3 style="color: black !important;">
              Participants
              <span class="count-badge">{{ conversationParticipants.length }}</span>
            </h3>
            <button class="icon-btn" @click="showParticipantsDialog = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="dialog-body">
            <div v-for="p in conversationParticipants" :key="p.id" class="participant-row">
              <div class="participant-row__avi">{{ p.initials }}</div>
              <div class="participant-row__info">
                <strong>{{ p.name }}</strong>
                <span>{{ p.role }}</span>
              </div>
              <span class="role-tag" :class="p.isAdmin ? 'role-tag--admin' : ''">
                {{ p.isAdmin ? "Admin" : "Membre" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- Modal d'édition de message -->
<Teleport to="body">
  <div v-if="showEditDialog" class="dialog-bg" @click.self="closeEditDialog">
    <div class="dialog dialog--sm">
      <div class="dialog-head">
        <h3 style="color: black !important;">Modifier le message</h3>
        <button class="icon-btn" @click="closeEditDialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="dialog-body">
        <div class="field">
          <label class="field-label">Votre message</label>
          <textarea 
            v-model="editMessageContent" 
            class="field-input" 
            rows="4"
            placeholder="Écrivez votre message..."
          ></textarea>
        </div>
        
        <!-- Aperçu des pièces jointes si présentes -->
        <div v-if="editingMessage?.attachments?.length" class="edit-attachments">
          <label class="field-label">Pièces jointes</label>
          <div class="edit-attachments-list">
            <div v-for="att in editingMessage.attachments" :key="att.id" class="edit-attachment-item">
              <span class="attachment-name">{{ att.file_name }}</span>
              <button class="remove-attachment" @click="removeAttachment(att.id)" title="Supprimer cette pièce jointe">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <button class="btn-ghost" @click="closeEditDialog">Annuler</button>
        <button 

          class="btn-primary" 
          @click="saveEditedMessage" 
          :disabled="!editMessageContent.trim() || isEditing"
        >
          {{ isEditing ? "Modification..." : "Enregistrer" }}
        </button>
      </div>
    </div>
  </div>
</Teleport>
<!-- Modal de confirmation de suppression -->
<Teleport to="body">
  <div v-if="showDeleteConfirmDialog" class="dialog-bg" @click.self="closeDeleteConfirmDialog">
    <div class="dialog dialog--sm">
      <div class="dialog-head" style="background-color: #f44336 !important">
        <h3 style="color: white !important">Confirmer la suppression</h3>
        <button class="icon-btn" @click="closeDeleteConfirmDialog" style="color: white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="dialog-body">
        <p class="delete-confirm-text">
          Êtes-vous sûr de vouloir supprimer ce message ?
        </p>
        <div v-if="messageToDelete?.attachments?.length" class="delete-warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Ce message contient {{ messageToDelete.attachments.length }} pièce(s) jointe(s) qui seront également supprimées.</span>
        </div>
      </div>
      <div class="dialog-foot">
        <button class="btn-ghost" @click="closeDeleteConfirmDialog">Annuler</button>
        <button class="btn-primary" style="background-color: #f44336" @click="deleteMessage" :disabled="isDeleting">
          {{ isDeleting ? "Suppression..." : "Supprimer" }}
        </button>
      </div>
    </div>
  </div>
</Teleport>

<!-- Dans votre template principal, après le dernier Teleport -->
<Teleport to="body">
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <Toast
      v-for="toast in toast.toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      @close="toast.remove(toast.id)"
    />
  </div>
</Teleport>

<GroupParticipantsDialog
  v-model="showParticipantsDialog"
  :conversation="chatStore.currentConversation"
  @updated="refreshCurrentConversation"
/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useChatStore } from "~~/stores/chat";
import { useUserStore } from "~~/stores/user";
import { useFiliereStore } from "~~/stores/filiere";
import { useNiveauStore } from "~~/stores/niveau";
import { useGroupeStore } from "~~/stores/group";
import { useEtudiantStore } from "~~/stores/etudiant";
import CreateConversationDialog from "~/components/CreateConversation.vue";
import GroupParticipantsDialog from "~/components/GroupParticipantsDialog.vue";
import Toast from "~/components/Toast.vue";


const chatStore = useChatStore();
const userStore = useUserStore();
const filiereStore = useFiliereStore();
const niveauStore = useNiveauStore();
const groupeStore = useGroupeStore();
const etudiantStore = useEtudiantStore();
const toast = useToast()

// États
const showCreateDialog = ref(false);
const showParticipantsDialog = ref(false);
const showMobileSidebar = ref(false);
const showEmojiPicker = ref(false);
const selectedEmojiCategory = ref(0);
const newMessage = ref("");
const messagesContainer = ref(null);
const messageInput = ref(null);
const creating = ref(false);
const isMobile = ref(false);

const showEditDialog = ref(false)
const showDeleteConfirmDialog = ref(false)
const editingMessage = ref(null)
const messageToDelete = ref(null)
const editMessageContent = ref("")
const isEditing = ref(false)
const isDeleting = ref(false)

// États fichiers
const fileInput = ref(null);
const selectedFiles = ref([]);

// États filtres
const selectedFiliere = ref(null);
const selectedNiveau = ref(null);
const selectedGroupe = ref(null);
const selectedUsers = ref([]);
const newConversation = ref({ type: "private", name: "" });

const handleConversationCreated = async (conversation) => {
  await selectConversation(conversation)
}

const refreshCurrentConversation = async () => {
  if (chatStore.currentConversation) {
    await chatStore.fetchConversationById(chatStore.currentConversation.id)
    await chatStore.fetchMessages(chatStore.currentConversation.id)
  }
}

// Catégories d'emojis
const emojiCategories = ref([
  {
    name: "Smileys",
    icon: "😊",
    list: ["😊", "😂", "😍", "🥰", "😎", "🤔", "😢", "😭", "😴", "🤢", "🥳", "😱", "🤯", "😇", "🥺", "😡", "🤬", "🥶", "🥵", "🤢"]
  },
  {
    name: "Gestes",
    icon: "👍",
    list: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤙", "👊", "✊", "👏", "🙌", "🤝", "🙏", "👆", "👇", "👈", "👉", "🖕"]
  },
  {
    name: "Cœurs",
    icon: "❤️",
    list: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖"]
  },
  {
    name: "Animaux",
    icon: "🐶",
    list: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐮", "🐸", "🐙", "🦄", "🐧", "🐦", "🐤", "🐣"]
  },
  {
    name: "Nourriture",
    icon: "🍔",
    list: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🥭", "🥝", "🍔", "🍕", "🌮", "🌯", "🍜"]
  },
  {
    name: "Activités",
    icon: "⚽",
    list: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🏒", "🥊", "🎮", "🎲", "♠️", "♥️", "♦️", "♣️"]
  },
  {
    name: "Voyages",
    icon: "✈️",
    list: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "✈️", "🚀", "🚁", "⛵", "🚤", "🚲", "🛵", "🏍️"]
  },
  {
    name: "Objets",
    icon: "💻",
    list: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "📹", "🎥", "📺", "📻", "🎧", "🎤", "💡", "🔦", "🕯️"]
  }
]);

const openEditMessage = (message) => {
  editingMessage.value = message
  editMessageContent.value = message.body
  showEditDialog.value = true
}

// Fermer le dialogue d'édition
const closeEditDialog = () => {
  showEditDialog.value = false
  editingMessage.value = null
  editMessageContent.value = ""
}

// Computed properties
const userInitials = computed(() => {
  if (!userStore.user) return "?";
  return ((userStore.user.prenom?.[0] || "") + (userStore.user.nom?.[0] || "")).toUpperCase();
});


const saveEditedMessage = async () => {
  if (!editingMessage.value || !editMessageContent.value.trim() || isEditing.value) return
  
  isEditing.value = true
  try {
    await chatStore.updateMessage(
      currentConversationId.value,
      editingMessage.value.id,
      editMessageContent.value.trim()
    )
    closeEditDialog()
  } catch (error) {
    console.error('Erreur modification:', error)
    alert(error.response?.data?.message || "Erreur lors de la modification")
  } finally {
    isEditing.value = false
  }
}

const confirmDeleteMessage = (message) => {
  messageToDelete.value = message
  showDeleteConfirmDialog.value = true
}

// Fermer la confirmation de suppression
const closeDeleteConfirmDialog = () => {
  showDeleteConfirmDialog.value = false
  messageToDelete.value = null
}

// Supprimer le message
const deleteMessage = async () => {
  if (!messageToDelete.value || isDeleting.value) return
  
  isDeleting.value = true
  try {
    await chatStore.deleteMessage(
      currentConversationId.value,
      messageToDelete.value.id
    )
    closeDeleteConfirmDialog()
  } catch (error) {
    console.error('Erreur suppression:', error)
    alert(error.response?.data?.message || "Erreur lors de la suppression")
  } finally {
    isDeleting.value = false
  }
}

// Supprimer une pièce jointe spécifique
const removeAttachment = async (attachmentId) => {
  if (!editingMessage.value || !currentConversationId.value) return
  
  if (!confirm("Voulez-vous supprimer cette pièce jointe ?")) return
  
  try {
    await chatStore.deleteAttachment(
      currentConversationId.value,
      editingMessage.value.id,
      attachmentId
    )
    // Mettre à jour l'affichage
    editingMessage.value.attachments = editingMessage.value.attachments.filter(
      a => a.id !== attachmentId
    )
  } catch (error) {
    console.error('Erreur suppression pièce jointe:', error)
    alert("Erreur lors de la suppression de la pièce jointe")
  }
}
const conversationParticipants = computed(() => {
  if (!chatStore.currentConversation?.participants) return [];
  return chatStore.currentConversation.participants.map((p) => ({
    id: p.id,
    name: `${p.prenom || ""} ${p.nom || ""}`.trim(),
    initials: ((p.prenom?.[0] || "") + (p.nom?.[0] || "")).toUpperCase(),
    role: p.pivot?.role === "admin" ? "Admin" : "Membre",
    isAdmin: p.pivot?.role === "admin",
  }));
});

const typingUsers = computed(() => chatStore.typingUsers || []);
const typingText = computed(() => {
  if (!typingUsers.value.length) return "";
  if (typingUsers.value.length === 1) return `${typingUsers.value[0]} écrit…`;
  return `${typingUsers.value.length} personnes écrivent…`;
});

const filteredNiveaux = computed(() =>
  !selectedFiliere.value ? niveauStore.niveaux : niveauStore.niveaux.filter((n) => n.filiere_id === selectedFiliere.value)
);

const filteredGroupes = computed(() =>
  !selectedNiveau.value ? groupeStore.groupes : groupeStore.groupes.filter((g) => g.niveau_id === selectedNiveau.value)
);

const availableUsers = computed(() => {
  let users = [];
  userStore.enseignants?.forEach((e) => users.push(formatUser(e, "enseignant", "Enseignant")));
  etudiantStore.etudiants?.forEach((e) => users.push(formatUser(e, "etudiant", "Étudiant")));
  if (selectedFiliere.value) users = users.filter((u) => u.filiere_id === selectedFiliere.value);
  if (selectedNiveau.value) users = users.filter((u) => u.niveau_id === selectedNiveau.value);
  if (selectedGroupe.value) users = users.filter((u) => u.groupe_id === selectedGroupe.value);
  return users.filter((u) => u.id !== userStore.user?.id);
});

const canCreate = computed(() => {
  if (!selectedUsers.value.length) return false;
  if (newConversation.value.type === "group" && !newConversation.value.name) return false;
  return true;
});

const currentConversationId = computed(() => chatStore.currentConversation?.id);

// Méthodes
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const formatUser = (user, type, role) => ({
  id: user.id,
  type,
  role,
  displayName: `${user.prenom || ""} ${user.nom || ""}`.trim(),
  email: user.email,
  initials: ((user.prenom?.[0] || "") + (user.nom?.[0] || "")).toUpperCase(),
  filiere_id: user.filiere_id,
  niveau_id: user.niveau_id,
  groupe_id: user.groupe_id,
});

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeLabel = (type) => {
  const labels = {
    image: 'IMAGE',
    pdf: 'PDF',
    excel: 'EXCEL',
    word: 'WORD',
    powerpoint: 'PPT',
    archive: 'ARCHIVE',
    video: 'VIDÉO',
    audio: 'AUDIO',
    text: 'TEXTE',
    unknown: 'FICHIER'
  };
  return labels[type] || 'FICHIER';
};

const getCategoryIcon = (categoryName) => {
  const icons = {
    Smileys: '😊',
    Gestes: '👍',
    'Cœurs': '❤️',
    Animaux: '🐶',
    Nourriture: '🍔',
    Activités: '⚽',
    Voyages: '✈️',
    Objets: '💻'
  };
  return icons[categoryName] || '😊';
};

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/200?text=Image+non+disponible';
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  selectedFiles.value = [...selectedFiles.value, ...files];
  event.target.value = '';
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const toggleEmojiCategory = (index) => {
  selectedEmojiCategory.value = selectedEmojiCategory.value === index ? null : index;
};

const sendMessageWithFiles = async () => {
  if ((!newMessage.value.trim() && !selectedFiles.value.length) || !chatStore.currentConversation) return;
  
  const content = newMessage.value;
  const files = [...selectedFiles.value];
  
  newMessage.value = '';
  selectedFiles.value = [];
  showEmojiPicker.value = false;
  selectedEmojiCategory.value = 0;
  
  const tmpId = 'tmp-' + Date.now();
  const tmpMessage = {
    id: tmpId,
    body: content || (files.length ? '📎 Fichier joint' : ''),
    sender_id: userStore.user.id,
    sender: {
      id: userStore.user.id,
      prenom: userStore.user.prenom,
      nom: userStore.user.nom,
    },
    attachments: files.map(f => ({
      file_name: f.name,
      file_size: f.size,
      mime_type: f.type,
      is_temp: true,
      is_image: f.type.startsWith('image/')
    })),
    created_at: new Date().toISOString(),
    status: 'sending',
  };
  
  chatStore.messages.push(tmpMessage);
  await nextTick();
  scrollToBottom();
  
  try {
    const sent = await chatStore.sendMessageWithAttachments(
      chatStore.currentConversation.id,
      content,
      files
    );
    
    const index = chatStore.messages.findIndex(m => m.id === tmpId);
    if (index !== -1) {
      chatStore.messages[index] = { ...sent, status: 'sent' };
    }
  } catch (error) {
    const index = chatStore.messages.findIndex(m => m.id === tmpId);
    if (index !== -1) {
      chatStore.messages[index].status = 'error';
    }
    console.error('Erreur envoi:', error);
  }
  
  await nextTick();
  scrollToBottom();
};

const handleTyping = () => {
  if (!chatStore.currentConversation) return;
  chatStore.sendTyping(chatStore.currentConversation.id);
};

const onFiliereChange = () => {
  selectedNiveau.value = null;
  selectedGroupe.value = null;
};

const onNiveauChange = () => {
  selectedGroupe.value = null;
};

const onGroupeChange = () => {
  if (selectedGroupe.value) groupeStore.fetchGroupEtudiants(selectedGroupe.value);
};

const isUserSelected = (id) => selectedUsers.value.includes(id);

const toggleUser = (id) => {
  if (isUserSelected(id)) {
    selectedUsers.value = selectedUsers.value.filter((i) => i !== id);
  } else {
    selectedUsers.value.push(id);
  }
};

const removeUser = (id) => {
  selectedUsers.value = selectedUsers.value.filter((i) => i !== id);
};

const getUserDisplayName = (id) => availableUsers.value.find((u) => u.id === id)?.displayName || "";

const selectAllEnseignants = () => {
  selectedUsers.value = availableUsers.value.filter((u) => u.role === "Enseignant").map((u) => u.id);
};

const selectAllEtudiants = () => {
  selectedUsers.value = availableUsers.value.filter((u) => u.role === "Étudiant").map((u) => u.id);
};

const selectAllUsers = () => {
  selectedUsers.value = availableUsers.value.map((u) => u.id);
};

const createConversation = async () => {
  if (!canCreate.value || creating.value) return;
  creating.value = true;
  try {
    const participants = selectedUsers.value.map((id) => {
      const u = availableUsers.value.find((u) => u.id === id);
      return {
        id,
        type: u.type === "etudiant" ? "Etudiant" : u.type === "enseignant" ? "Enseignant" : "User",
      };
    });
    participants.push({ id: userStore.user.id, type: "User" });
    const data = { type: newConversation.value.type, participants };
    if (data.type === "group") data.name = newConversation.value.name || "Nouveau groupe";
    const conv = await chatStore.createConversation(data);
    selectedFiliere.value = null;
    selectedNiveau.value = null;
    selectedGroupe.value = null;
    selectedUsers.value = [];
    newConversation.value = { type: "private", name: "" };
    showCreateDialog.value = false;
    await selectConversation(conv);
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.message || e.message);
  } finally {
    creating.value = false;
  }
};

const selectConversation = async (conv) => {
  if (chatStore.currentConversation) chatStore.leaveChannel(chatStore.currentConversation.id);
  chatStore.currentConversation = conv;
  await chatStore.fetchMessages(conv.id);
  chatStore.listenForMessages(conv.id);
  chatStore.listenForTyping(conv.id);
  if (isMobile.value) showMobileSidebar.value = false;
  await nextTick();
  scrollToBottom();
  messageInput.value?.focus();
};

const addEmoji = (emoji) => {
  newMessage.value += emoji;
};

const getConversationName = (conv) => {
  if (!conv) return "";
  if (conv.type === "private") {
    const o = conv.participants?.find((p) => p.id !== userStore.user?.id);
    return o ? `${o.prenom || ""} ${o.nom || ""}`.trim() : "Discussion privée";
  }
  return conv.nom || "Groupe";
};

const getConversationInitials = (conv) => {
  const n = getConversationName(conv);
  return n.split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2);
};

const getSenderInitials = (msg) => {
  if (!msg.sender) return "?";
  return ((msg.sender.prenom?.[0] || "") + (msg.sender.nom?.[0] || "")).toUpperCase();
};

const getSenderName = (msg) => {
  if (!msg.sender) return "Inconnu";
  return `${msg.sender.prenom || ""} ${msg.sender.nom || ""}`.trim() || "Inconnu";
};

const getLastMessagePreview = (conv) => {
  if (!conv.last_message) return "Aucun message";
  const b = conv.last_message.body || "Message";
  return b.length > 38 ? b.substring(0, 38) + "…" : b;
};

const getLastMessageTime = (conv) => {
  if (!conv.updated_at) return "";
  const d = new Date(conv.updated_at);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "maintenant";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const formatTime = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const scrollToBottom = () => {
  if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

// Lifecycle
onMounted(async () => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      userStore.user = JSON.parse(userStr);
    } catch (e) {}
  }
  if (!userStore.user) {
    alert("Utilisateur non connecté");
    return;
  }
  try {
    await Promise.all([
      filiereStore.fetchFilieres(),
      niveauStore.fetchNiveaux(),
      groupeStore.fetchGroupes(),
      userStore.fetchUsersEnseignant(),
      etudiantStore.fetchEtudiants(),
      chatStore.fetchConversations(),
    ]);
    chatStore.listenForNewConversations();
    setTimeout(() => chatStore.checkEchoConnection(), 2000);
  } catch (e) {
    console.error(e);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Watchers
watch(() => chatStore.messages.length, () => nextTick(scrollToBottom));
</script>

<style scoped>
/* Vos styles CSS existants restent ici */
:root {
  --c-bg: #e5ded8;
  --c-surf: #ffffff;
  --c-hover: #f5f5f5;
  --c-active: #e8f5e8;
  --c-border: #e0e0e0;
  --c-border2: #d0d0d0;
  --c-wa-green: #25d366;
  --c-wa-green-dk: #25d366;
  --c-wa-green-lt: #dcf8c6;
  --c-wa-blue: #34b7f1;
  --c-wa-teal: #075e54;
  --c-text: #303030;
  --c-text2: #4a4a4a;
  --c-text3: #5e5e5e;
  --c-text4: #7a7a7a;
  --c-text5: #9e9e9e;
  --c-green: #25d366;
  --c-red: #f44336;
  --c-success: #25d366;
  --c-warning: #ff9800;
  --c-info: #34b7f1;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 18px;
  --r-xl: 24px;
  --r-full: 999px;
  --shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 10px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 20px rgba(0, 0, 0, 0.12);
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --t: 0.18s;
  --font:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
}

/* ═══ LAYOUT PRINCIPAL ═══ */
.chat-root {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--c-bg) !important;
  background-image:
    radial-gradient(
      circle at 20% 30%,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 30%
    ),
    linear-gradient(135deg, #e5ded8 0%, #d9d2cc 100%) !important;
  font-family: var(--font);
  color: var(--c-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ═══ TYPOGRAPHIE GLOBALE ═══ */
h1, h2, h3, h4, h5, h6 {
  color: var(--c-text);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

p, span, div, li, a {
  color: inherit;
}

/* ═══ OVERLAY ═══ */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  animation: fade-in 0.2s var(--ease);
}

/* ═══ SIDEBAR - STYLE WHATSAPP ═══ */
.sidebar {
  width: 320px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  background: var(--c-surf);
  border-right: 1px solid var(--c-border);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s var(--ease);
  z-index: 50;
}

.sidebar--mobile {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  transform: translateX(-100%);
}

.sidebar--mobile.sidebar--open {
  transform: translateX(0);
  box-shadow: var(--shadow-lg);
}

/* ═══ LISTE DES CONVERSATIONS ═══ */
.conv-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
  background: white;
}

.conv-list::-webkit-scrollbar {
  width: 4px;
}

.conv-list::-webkit-scrollbar-track {
  background: transparent;
}

.conv-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: var(--r-full);
}

/* Skeletons */
.conv-skeleton {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 10px;
  border-radius: var(--r-md);
  margin-bottom: 4px;
}

.conv-skeleton__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.conv-skeleton__lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sk {
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--r-sm);
}

.sk--line {
  height: 14px;
  border-radius: var(--r-full);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* État vide */
.conv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  text-align: center;
  gap: 8px;
}

.conv-empty__icon {
  width: 64px;
  height: 64px;
  background: var(--c-wa-green-lt);
  border: 2px solid var(--c-wa-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-wa-green-dk);
  margin-bottom: 12px;
}

.conv-empty p {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text2);
}

.conv-empty span {
  font-size: 13px;
  color: var(--c-text4);
}

/* ═══ ZONE PRINCIPALE ═══ */
.chat-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)"/></svg>');
  background-repeat: repeat;
}

/* Top bar */
.chat-topbar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: var(--c-wa-teal);
  color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.topbar-menu-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--t) var(--ease);
}

.topbar-menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.topbar-avi {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--c-wa-green);
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.topbar-info {
  flex: 1;
  min-width: 0;
}

.topbar-info h2 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.topbar-info p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--t) var(--ease);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* ═══ ZONE DES MESSAGES ═══ */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
  background: transparent;
}

.messages-area::-webkit-scrollbar {
  width: 5px;
}

.messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: var(--r-full);
}

/* Skeletons de messages */
.msg-skeleton {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  animation: fade-up 0.4s var(--ease) both;
}

.msg-skeleton--right {
  justify-content: flex-end;
}

.msg-skeleton__avi {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.msg-skeleton__bubble {
  height: 46px;
  border-radius: 18px;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Messages réels */
.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  animation: msg-pop 0.25s var(--ease) both;
}

@keyframes msg-pop {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.msg-row--mine {
  justify-content: flex-end;
}

.msg-row--theirs {
  justify-content: flex-start;
}

.msg-avi {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--c-wa-green);
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.msg-wrap {
  max-width: 65%;
  display: flex;
  flex-direction: column;
}

.msg-row--mine .msg-wrap {
  align-items: flex-end;
}

.msg-row--theirs .msg-wrap {
  align-items: flex-start;
}

.msg-sender-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-wa-teal);
  margin-bottom: 2px;
  padding: 0 8px;
}

.msg-bubble {
  padding: 8px 12px;
  border-radius: 12px;
  word-break: break-word;
  transition: all var(--t) var(--ease);
  max-width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.msg-bubble--out {
  background: #25d366 !important;
  color: white;
  border-bottom-right-radius: 4px;
}

.msg-bubble--out p {
  color: white;
  font-size: 14px;
  line-height: 1.5;
}

.msg-bubble--in {
  background: white;
  color: var(--c-text);
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.msg-bubble--in p {
  color: var(--c-text);
  font-size: 14px;
  line-height: 1.5;
}

.msg-bubble--sending {
  opacity: 0.7;
}

.msg-bubble--error {
  background: #fce4e4 !important;
  color: #c62828 !important;
  border: 1px solid #ef9a9a !important;
}

.msg-bubble--error p {
  color: #c62828 !important;
}

.msg-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
}

.msg-footer time {
  font-size: 10px;
  opacity: 0.7;
  font-weight: 400;
}

.msg-bubble--in .msg-footer time {
  color: var(--c-text4);
}

.msg-bubble--out .msg-footer time {
  color: rgba(255, 255, 255, 0.8);
}

.msg-tick {
  font-size: 11px;
  opacity: 0.9;
  font-weight: 400;
}

.msg-bubble--out .msg-tick {
  color: rgba(255, 255, 255, 0.9);
}

.msg-bubble--in .msg-tick {
  color: var(--c-wa-green);
}

.spin {
  animation: spin-anim 1s linear infinite;
}

@keyframes spin-anim {
  to { transform: rotate(360deg); }
}

/* Styles pour les fichiers joints */
.hidden-file-input {
  display: none;
}

.attach-btn {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  opacity: 0.6;
  transition: all 0.2s;
  padding: 8px;
  color: #666;
  z-index: 2;
}

.attach-btn:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
  color: var(--c-wa-green);
}

.emoji-toggle {
  right: 40px !important;
}

.upload-progress {
  position: absolute;
  bottom: 70px;
  left: 16px;
  right: 16px;
  height: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.upload-progress .progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--c-wa-green);
  opacity: 0.3;
  transition: width 0.3s;
}

.upload-progress span {
  position: relative;
  z-index: 2;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-wa-green-dk);
}

.file-previews {
  position: absolute;
  bottom: 120px;
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 6px;
  animation: slide-up 0.2s ease;
}

.file-preview:last-child {
  margin-bottom: 0;
}

.file-preview-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview-name {
  flex: 1;
  font-size: 13px;
  color: var(--c-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-preview-size {
  font-size: 11px;
  color: var(--c-text4);
}

.file-preview-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.file-preview-remove:hover {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  transform: scale(1.1);
}

/* Styles pour les pièces jointes dans les messages */
.message-attachments {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.attachment-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
}

.attachment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Images */
.attachment-image {
  max-width: 250px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
}

.attachment-image:hover {
  border-color: var(--c-wa-green);
}

.image-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.image-preview:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(2px);
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.image-overlay svg {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Fichiers non-image */
.file-attachment {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  min-width: 280px;
}

.msg-bubble--out .file-attachment {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.msg-bubble--in .file-attachment {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.file-attachment:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--c-wa-green);
}

.msg-bubble--in .file-attachment:hover {
  background: #eeeeee;
}

.file-icon-container {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-icon-container svg {
  width: 32px;
  height: 32px;
}

.msg-bubble--out .file-icon-container svg {
  color: white;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-info .file-name {
  font-size: 13px;
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.msg-bubble--out .file-info .file-name {
  color: white;
}

.file-info .file-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.file-type-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 9px;
}

.file-type-image {
  background: #4caf50;
  color: white;
}

.file-type-pdf {
  background: #f44336;
  color: white;
}

.file-type-excel {
  background: #4caf50;
  color: white;
}

.file-type-word {
  background: #2196f3;
  color: white;
}

.file-type-powerpoint {
  background: #ff9800;
  color: white;
}

.file-type-archive {
  background: #9c27b0;
  color: white;
}

.file-type-video {
  background: #e91e63;
  color: white;
}

.file-type-audio {
  background: #00bcd4;
  color: white;
}

.file-type-text {
  background: #607d8b;
  color: white;
}

.file-type-unknown {
  background: #9e9e9e;
  color: white;
}

.file-size {
  color: var(--c-text4);
}

.msg-bubble--out .file-size {
  color: rgba(255, 255, 255, 0.8);
}

.download-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.7;
  transition: all 0.2s;
  color: inherit;
  flex-shrink: 0;
}

.download-btn:hover {
  opacity: 1;
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.msg-bubble--out .download-btn {
  color: white;
}

.msg-bubble--in .download-btn {
  color: var(--c-text);
}

/* Indicateur de frappe */
.typing-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 12px;
  color: var(--c-text4);
  font-style: italic;
  font-weight: 400;
  background: transparent;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-wa-green);
  opacity: 0.5;
  animation: typing-dot 1.4s ease-in-out infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-dot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* Barre d'entrée */
.input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--c-wa-teal);
  flex-shrink: 0;
  position: relative;
}

.input-wrap {
  flex: 1;
  position: relative;
}

.msg-input {
  width: 100%;
  padding: 12px 90px 12px 16px;
  background: white;
  color: var(--c-text);
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-family: var(--font);
  outline: none;
  transition: all var(--t) var(--ease);
}

.msg-input::placeholder {
  color: var(--c-text5);
  font-weight: 400;
}

.msg-input:focus {
  box-shadow: 0 0 0 2px var(--c-wa-green);
}

.emoji-toggle {
  position: absolute;
  right: 45px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: all var(--t);
  padding: 8px;
  color: #666;
  z-index: 2;
}

.emoji-toggle:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
  color: var(--c-wa-green);
}

.emoji-picker {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: white;
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 12px;
  box-shadow: var(--shadow-md);
  z-index: 60;
  min-width: 300px;
}

.emoji-categories {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 8px;
}

.emoji-category {
  flex: 1;
  padding: 8px 4px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--r-sm);
  color: var(--c-text4);
  transition: all var(--t);
  font-size: 18px;
}

.emoji-category:hover {
  background: var(--c-wa-green-lt);
  color: var(--c-wa-green-dk);
  transform: scale(1.1);
}

.emoji-category.active {
  background: var(--c-wa-green-lt);
  color: var(--c-wa-green-dk);
  border-bottom: 2px solid var(--c-wa-green);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-picker__btn {
  padding: 8px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--r-sm);
  transition: all var(--t);
}

.emoji-picker__btn:hover {
  background: var(--c-wa-green-lt);
  transform: scale(1.15);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--c-wa-green);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all var(--t) var(--ease);
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
  background: var(--c-wa-green-dk);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

/* ═══ ÉTAT VIDE ═══ */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 32px;
  background: transparent;
}

.empty-state__graphic {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 3px solid var(--c-wa-green);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-wa-green-dk);
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
}

.empty-state h3 {
  font-size: 22px;
  font-weight: 600;
  color: var(--c-wa-teal);
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 15px;
  color: var(--c-text3);
  max-width: 300px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.btn-ghost-sm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--r-md);
  background: white;
  border: 1px solid var(--c-border);
  color: var(--c-text3);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t) var(--ease);
}

.btn-ghost-sm:hover {
  background: var(--c-wa-green-lt);
  border-color: var(--c-wa-green);
  color: var(--c-wa-green-dk);
  transform: translateY(-2px);
}

/* ═══ BOÎTES DE DIALOGUE ═══ */
.dialog-bg {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fade-in 0.2s var(--ease);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog {
  background: white;
  border: none;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 620px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: dialog-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog--sm {
  max-width: 440px;
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
  flex-shrink: 0;
  background: var(--c-wa-teal);
  color: white;
}

.dialog-head h3 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-head .icon-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dialog-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--c-border);
  flex-shrink: 0;
  background: #fafafa;
}

/* Champs de formulaire */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-wa-teal);
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-input,
.field-select {
  padding: 12px 16px;
  background: #f5f5f5;
  color: var(--c-text);
  border: 1px solid var(--c-border2);
  border-radius: var(--r-md);
  font-size: 14px;
  font-family: var(--font);
  outline: none;
  transition: all var(--t) var(--ease);
}

.field-input:focus,
.field-select:focus {
  border-color: var(--c-wa-green);
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.2);
  background: white;
}

.field-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

/* Radio cards */
.radio-row {
  display: flex;
  gap: 12px;
}

.radio-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border: 1px solid var(--c-border2);
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text3);
  cursor: pointer;
  transition: all var(--t) var(--ease);
}

.radio-card.active {
  background: var(--c-wa-green-lt);
  border-color: var(--c-wa-green);
  color: var(--c-wa-green-dk);
  font-weight: 600;
}

/* Boutons rapides */
.quick-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-btn {
  padding: 8px 16px;
  border-radius: var(--r-full);
  background: #f5f5f5;
  border: 1px solid var(--c-border2);
  color: var(--c-text3);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t) var(--ease);
}

.pill-btn:hover {
  background: var(--c-wa-green-lt);
  border-color: var(--c-wa-green);
  color: var(--c-wa-green-dk);
  transform: translateY(-2px);
}

.pill-btn--danger:hover {
  background: #ffebee;
  border-color: var(--c-red);
  color: var(--c-red);
}

/* Liste des utilisateurs */
.user-list {
  border: 1px solid var(--c-border2);
  border-radius: var(--r-md);
  max-height: 240px;
  overflow-y: auto;
  background: white;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all var(--t) var(--ease);
  border-bottom: 1px solid var(--c-border);
}

.user-row:last-child {
  border-bottom: none;
}

.user-row:hover {
  background: var(--c-wa-green-lt);
}

.user-row.selected {
  background: var(--c-wa-green-lt);
}

.user-row__avi {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--c-wa-green);
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.user-row__info {
  flex: 1;
  min-width: 0;
}

.user-row__info strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text);
  display: block;
  margin-bottom: 2px;
}

.user-row__info span {
  font-size: 12px;
  color: var(--c-text4);
  font-weight: 400;
}

.user-row__check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--c-border2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  flex-shrink: 0;
  transition: all var(--t) var(--ease);
}

.user-row__check.on {
  background: var(--c-wa-green);
  border-color: var(--c-wa-green);
  color: white;
  box-shadow: 0 2px 5px rgba(37, 211, 102, 0.3);
  transform: scale(1.05);
}

/* Chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--r-full);
  background: var(--c-wa-green-lt);
  color: var(--c-wa-green-dk);
  border: 1px solid var(--c-wa-green);
  font-size: 13px;
  font-weight: 500;
  transition: all var(--t) var(--ease);
}

.chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.2);
}

.chip button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--c-wa-green-dk);
  font-size: 16px;
  line-height: 1;
  opacity: 0.7;
  transition: all var(--t);
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip button:hover {
  opacity: 1;
  transform: scale(1.2);
}

/* Badge de compteur */
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  background: var(--c-wa-green-lt);
  color: var(--c-wa-green-dk);
  border: 1px solid var(--c-wa-green);
  border-radius: var(--r-full);
  font-size: 12px;
  font-weight: 600;
}

/* Boutons génériques */
.btn-ghost {
  padding: 10px 22px;
  border-radius: var(--r-md);
  background: #f5f5f5;
  border: 1px solid var(--c-border2);
  color: var(--c-text3);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t) var(--ease);
}

.btn-ghost:hover {
  background: var(--c-wa-green-lt);
  border-color: var(--c-wa-green);
  color: var(--c-wa-green-dk);
  transform: translateY(-2px);
}

.btn-primary {
  padding: 10px 24px;
  border-radius: var(--r-md);
  /* background: var(--c-wa-green); */
  color: white;
  color:black;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(37, 211, 102, 0.3);
  /* transition: all var(--t) var(--ease); */
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(37, 211, 102, 0.4);
  background: var(--c-wa-green-dk);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* Participants */
.participant-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 10px;
  border-radius: var(--r-md);
  transition: all var(--t) var(--ease);
  background: white;
  border-bottom: 1px solid var(--c-border);
}

.participant-row:last-child {
  border-bottom: none;
}

.participant-row:hover {
  background: var(--c-wa-green-lt);
}

.participant-row__avi {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--c-wa-green);
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.participant-row__info {
  flex: 1;
}

.participant-row__info strong {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
  display: block;
  margin-bottom: 2px;
}

.participant-row__info span {
  font-size: 12px;
  color: var(--c-text4);
  font-weight: 400;
}

.role-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--r-full);
  background: #f5f5f5;
  color: var(--c-text4);
  border: 1px solid var(--c-border2);
  text-transform: uppercase;
}

.role-tag--admin {
  background: var(--c-wa-green-lt);
  color: var(--c-wa-green-dk);
  border-color: var(--c-wa-green);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .sidebar {
    width: 300px;
    min-width: 300px;
  }

  .user-pill__name {
    display: none;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .messages-area {
    padding: 12px 10px;
  }

  .input-bar {
    padding: 8px 12px;
  }

  .msg-wrap {
    max-width: 80%;
  }

  .topbar-info h2 {
    font-size: 15px;
  }

  .chat-topbar {
    padding: 8px 12px;
  }

  .dialog {
    max-width: 90%;
  }

  .dialog-head,
  .dialog-body,
  .dialog-foot {
    padding: 16px 20px;
  }

  .brand-name {
    font-size: 16px;
  }

  .attachment-image {
    max-width: 150px;
  }
  
  .file-previews {
    bottom: 100px;
    left: 10px;
    right: 10px;
  }
  
  .upload-progress {
    bottom: 60px;
  }
  
  .attach-btn {
    right: 60px;
  }
  
  .emoji-toggle {
    right: 35px !important;
  }
  
  .msg-input {
    padding: 12px 80px 12px 16px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    max-width: 280px;
  }

  .msg-wrap {
    max-width: 85%;
  }

  .msg-bubble p {
    font-size: 14px;
  }

  .empty-state h3 {
    font-size: 20px;
  }

  .empty-state p {
    font-size: 14px;
  }

  .dialog {
    max-width: 95%;
  }

  .radio-card {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .file-attachment {
    min-width: 200px;
  }
  
  .emoji-picker {
    min-width: 260px;
  }
  
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Styles pour les actions de message */
.msg-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
  position: relative;
}

.msg-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.msg-row:hover .msg-actions {
  opacity: 1;
}

.msg-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: inherit;
  opacity: 0.6;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg-action-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.msg-bubble--out .msg-action-btn {
  color: white;
}

.msg-bubble--in .msg-action-btn {
  color: var(--c-text);
}

.msg-edited {
  font-size: 10px;
  opacity: 0.7;
  font-style: italic;
  margin-right: 4px;
}

.msg-bubble--out .msg-edited {
  color: rgba(255, 255, 255, 0.7);
}

.msg-bubble--in .msg-edited {
  color: var(--c-text4);
}

/* Styles pour l'édition */
.edit-attachments {
  margin-top: 16px;
  border-top: 1px solid var(--c-border);
  padding-top: 16px;
}

.edit-attachments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.edit-attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid var(--c-border);
}

.attachment-name {
  font-size: 13px;
  color: var(--c-text);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-attachment {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.remove-attachment:hover {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  transform: scale(1.1);
}

/* Styles pour la confirmation de suppression */
.delete-confirm-text {
  font-size: 16px;
  color: var(--c-text);
  text-align: center;
  margin: 20px 0;
}

.delete-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #ffebee;
  border-radius: 8px;
  color: #c62828;
  font-size: 13px;
  margin-top: 16px;
}

.delete-warning svg {
  flex-shrink: 0;
}

/* Ajustements responsive */
@media (max-width: 768px) {
  .msg-actions {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
    padding: 2px;
    border-radius: 4px;
  }
  
  .msg-action-btn {
    padding: 6px;
  }
}

/* Pour les animations de scroll */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 999px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>