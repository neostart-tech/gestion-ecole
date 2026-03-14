// stores/chat.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user' 
import config from '~~/config'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    participants: [],
    isLoading: false,
    isSending: false,
    isUploading: false,
    uploadProgress: 0,
    error: null,
    typingUsers: [],
    echoConnected: false,
    canSendMessageStatus: {
      can_send: true,
      reason: null
    }
  }),

  actions: {
    // URL de base pour l'API
    getBaseUrl() {
      return config.app_local ? config.app_dev_url : config.app_prod_url
    },

    // URL de base pour le storage
    getStorageUrl() {
      return config.app_local ? config.app_dev_storage_url : config.app_prod_storage_url
    },

    // Headers pour les requêtes API
    authHeaders() {
      const token = localStorage.getItem('gest-ecole-token')
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      }
    },

    // Headers multipart pour l'upload de fichiers
    multipartHeaders() {
      const token = localStorage.getItem('gest-ecole-token')
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      }
    },

    // ========== ROUTES CONVERSATIONS ==========

    // GET /conversations
    async fetchConversations() {
      this.isLoading = true
      try {
        const response = await axios.get(
          `${this.getBaseUrl()}/conversations`,
          this.authHeaders()
        )
        this.conversations = response.data
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement'
        console.error('fetchConversations:', error)
      } finally {
        this.isLoading = false
      }
    },

    // POST /conversations
    async createConversation(data) {
      this.isLoading = true
      try {
        const response = await axios.post(
          `${this.getBaseUrl()}/conversations`,
          data,
          this.authHeaders()
        )
        this.conversations.unshift(response.data)
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur création'
        console.error('createConversation:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // GET /conversations/{conversation}
    async fetchConversationById(conversationId) {
      this.isLoading = true
      try {
        const response = await axios.get(
          `${this.getBaseUrl()}/conversations/${conversationId}`,
          this.authHeaders()
        )
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement'
        console.error('fetchConversationById:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // PUT /conversations/{conversation}
    async updateConversation(conversationId, data) {
      this.isLoading = true
      try {
        const response = await axios.put(
          `${this.getBaseUrl()}/conversations/${conversationId}`,
          data,
          this.authHeaders()
        )
        
        // Mettre à jour la conversation dans la liste
        const index = this.conversations.findIndex(c => c.id === conversationId)
        if (index !== -1) {
          this.conversations[index] = response.data.conversation || response.data
        }
        
        // Mettre à jour la conversation courante si c'est la même
        if (this.currentConversation?.id === conversationId) {
          this.currentConversation = response.data.conversation || response.data
        }
        
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de mise à jour'
        console.error('updateConversation:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // DELETE /conversations/{conversation}
    async deleteConversation(conversationId) {
      this.isLoading = true
      try {
        const response = await axios.delete(
          `${this.getBaseUrl()}/conversations/${conversationId}`,
          this.authHeaders()
        )
        
        // Retirer la conversation de la liste
        this.conversations = this.conversations.filter(c => c.id !== conversationId)
        
        // Si c'est la conversation courante, la réinitialiser
        if (this.currentConversation?.id === conversationId) {
          this.resetCurrentConversation()
        }
        
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de suppression'
        console.error('deleteConversation:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ========== ROUTES MESSAGES ==========

    // GET /conversations/{conversation}/messages
    async fetchMessages(conversationId) {
      this.isLoading = true
      try {
        const response = await axios.get(
          `${this.getBaseUrl()}/conversations/${conversationId}/messages`,
          this.authHeaders()
        )
        
        // Traiter les messages pour ajouter les URLs complètes des pièces jointes
        const messages = response.data.map(message => {
          if (message.attachments && message.attachments.length) {
            message.attachments = message.attachments.map(attachment => ({
              ...attachment,
              full_url: this.getAttachmentFullUrl(attachment, conversationId, message.id),
              preview_url: this.getAttachmentPreviewUrl(conversationId, message.id, attachment.id),
              download_url: this.getAttachmentDownloadUrl(conversationId, message.id, attachment.id),
              is_image: attachment.mime_type?.startsWith('image/') || false
            }))
          }
          return message
        })
        
        this.messages = messages
        this.error = null
        return messages
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement'
        console.error('fetchMessages:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // POST /conversations/{conversation}/messages (texte)
    async sendMessage(conversationId, content) {
      if (!content.trim()) return

      this.isSending = true
      try {
        const response = await axios.post(
          `${this.getBaseUrl()}/conversations/${conversationId}/messages`,
          { body: content },
          this.authHeaders()
        )
        
        // Traiter les pièces jointes du message retourné
        const message = response.data
        if (message.attachments && message.attachments.length) {
          message.attachments = message.attachments.map(attachment => ({
            ...attachment,
            full_url: this.getAttachmentFullUrl(attachment, conversationId, message.id),
            preview_url: this.getAttachmentPreviewUrl(conversationId, message.id, attachment.id),
            download_url: this.getAttachmentDownloadUrl(conversationId, message.id, attachment.id),
            is_image: attachment.mime_type?.startsWith('image/') || false
          }))
        }
        
        return message
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur d'envoi"
        console.error('sendMessage:', error)
        throw error
      } finally {
        this.isSending = false
      }
    },

    // POST /conversations/{conversation}/messages (avec fichiers)
    async sendMessageWithAttachments(conversationId, content, files) {
      if (!files || files.length === 0) {
        return this.sendMessage(conversationId, content)
      }

      this.isUploading = true
      this.uploadProgress = 0

      const formData = new FormData()
      
      if (content && content.trim()) {
        formData.append('body', content)
      }
      
      for (let i = 0; i < files.length; i++) {
        formData.append('attachments[]', files[i])
      }

      try {
        const response = await axios.post(
          `${this.getBaseUrl()}/conversations/${conversationId}/messages`,
          formData,
          {
            ...this.multipartHeaders(),
            onUploadProgress: (progressEvent) => {
              this.uploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
            }
          }
        )
        
        this.uploadProgress = 0
        
        // Traiter les pièces jointes du message retourné
        const message = response.data
        if (message.attachments && message.attachments.length) {
          message.attachments = message.attachments.map(attachment => ({
            ...attachment,
            full_url: this.getAttachmentFullUrl(attachment, conversationId, message.id),
            preview_url: this.getAttachmentPreviewUrl(conversationId, message.id, attachment.id),
            download_url: this.getAttachmentDownloadUrl(conversationId, message.id, attachment.id),
            is_image: attachment.mime_type?.startsWith('image/') || false
          }))
        }
        
        return message
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur d'envoi des fichiers"
        console.error('sendMessageWithAttachments:', error)
        throw error
      } finally {
        this.isUploading = false
      }
    },

    // GET /conversations/{conversation}/messages/{message}
    async fetchMessage(conversationId, messageId) {
      this.isLoading = true
      try {
        const response = await axios.get(
          `${this.getBaseUrl()}/conversations/${conversationId}/messages/${messageId}`,
          this.authHeaders()
        )
        
        // Traiter les pièces jointes du message
        const message = response.data
        if (message.attachments && message.attachments.length) {
          message.attachments = message.attachments.map(attachment => ({
            ...attachment,
            full_url: this.getAttachmentFullUrl(attachment, conversationId, message.id),
            preview_url: this.getAttachmentPreviewUrl(conversationId, message.id, attachment.id),
            download_url: this.getAttachmentDownloadUrl(conversationId, message.id, attachment.id),
            is_image: attachment.mime_type?.startsWith('image/') || false
          }))
        }
        
        this.error = null
        return message
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement du message'
        console.error('fetchMessage:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // DELETE /conversations/{conversation}/messages/{message}
    async deleteMessage(conversationId, messageId) {
      this.isSending = true
      try {
        await axios.delete(
          `${this.getBaseUrl()}/conversations/${conversationId}/messages/${messageId}`,
          this.authHeaders()
        )
        
        // Retirer le message de la liste
        this.messages = this.messages.filter(m => m.id !== messageId)
        
        this.error = null
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de suppression du message'
        console.error('deleteMessage:', error)
        throw error
      } finally {
        this.isSending = false
      }
    },

    // PUT /conversations/{conversation}/messages/{message}
    async updateMessage(conversationId, messageId, newContent) {
      this.isSending = true
      try {
        const response = await axios.put(
          `${this.getBaseUrl()}/conversations/${conversationId}/messages/${messageId}`,
          { body: newContent },
          this.authHeaders()
        )
        
        // Mettre à jour le message dans la liste
        const index = this.messages.findIndex(m => m.id === messageId)
        if (index !== -1) {
          this.messages[index] = {
            ...this.messages[index],
            ...response.data,
            is_edited: true,
            edited_at: new Date().toISOString()
          }
        }
        
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur de modification"
        console.error('updateMessage:', error)
        throw error
      } finally {
        this.isSending = false
      }
    },

    // ========== ROUTES PIÈCES JOINTES ==========

    // GET /conversations/{conversation}/messages/{message}/attachments/{attachment}/download
  // stores/chat.ts

// Dans downloadAttachment
async downloadAttachment(conversationId, messageId, attachmentId) {
  try {
    // Utiliser axios avec responseType: 'blob'
    const response = await axios.get(
      `${this.getBaseUrl()}/conversations/${conversationId}/messages/${messageId}/attachments/${attachmentId}/download`,
      {
        ...this.authHeaders(),
        responseType: 'blob'
      }
    )
    
    // Créer un blob avec le type MIME correct
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] 
    })
    
    // Créer l'URL
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Récupérer le nom du fichier depuis les en-têtes
    let filename = 'fichier'
    const contentDisposition = response.headers['content-disposition']
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }
    
    // Décoder les caractères spéciaux dans le nom
    try {
      filename = decodeURIComponent(escape(filename))
    } catch (e) {
      console.warn('Erreur décodage nom fichier:', e)
    }
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('downloadAttachment:', error)
    this.error = error.response?.data?.message || "Erreur de téléchargement"
    throw error
  }
},

    // GET /conversations/{conversation}/messages/{message}/attachments/{attachment}/preview
    async previewAttachment(conversationId, messageId, attachmentId) {
      const url = this.getAttachmentPreviewUrl(conversationId, messageId, attachmentId)
      window.open(url, '_blank')
    },

    // DELETE /conversations/{conversation}/messages/{message}/attachments/{attachment}
    async deleteAttachment(conversationId, messageId, attachmentId) {
      this.isUploading = true
      try {
        await axios.delete(
          `${this.getBaseUrl()}/conversations/${conversationId}/messages/${messageId}/attachments/${attachmentId}`,
          this.authHeaders()
        )
        
        // Mettre à jour le message pour retirer la pièce jointe
        const messageIndex = this.messages.findIndex(m => m.id === messageId)
        if (messageIndex !== -1) {
          this.messages[messageIndex].attachments = 
            this.messages[messageIndex].attachments.filter(a => a.id !== attachmentId)
        }
        
        this.error = null
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de suppression de la pièce jointe'
        console.error('deleteAttachment:', error)
        throw error
      } finally {
        this.isUploading = false
      }
    },

    // ========== ROUTES PARTICIPANTS ==========

    // GET /conversations/{conversation}/participants
    async fetchParticipants(conversationId) {
      this.isLoading = true
      try {
        const response = await axios.get(
          `${this.getBaseUrl()}/conversations/${conversationId}/participants`,
          this.authHeaders()
        )
        this.participants = response.data
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement des participants'
        console.error('fetchParticipants:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // POST /conversations/{conversation}/participants
    async addParticipant(conversationId, participantData) {
      this.isLoading = true
      try {
        const response = await axios.post(
          `${this.getBaseUrl()}/conversations/${conversationId}/participants`,
          participantData,
          this.authHeaders()
        )
        
        // Mettre à jour la liste des participants
        this.participants.push(response.data)
        
        // Mettre à jour la conversation courante si nécessaire
        if (this.currentConversation?.id === conversationId) {
          this.currentConversation.participants = [
            ...(this.currentConversation.participants || []),
            response.data
          ]
        }
        
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur d'ajout du participant"
        console.error('addParticipant:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // DELETE /conversations/{conversation}/participants/{user}
    async removeParticipant(conversationId, userId) {
      this.isLoading = true
      try {
        await axios.delete(
          `${this.getBaseUrl()}/conversations/${conversationId}/participants/${userId}`,
          this.authHeaders()
        )
        
        // Retirer le participant de la liste
        this.participants = this.participants.filter(p => p.id !== userId)
        
        // Mettre à jour la conversation courante si nécessaire
        if (this.currentConversation?.id === conversationId && this.currentConversation.participants) {
          this.currentConversation.participants = 
            this.currentConversation.participants.filter(p => p.id !== userId)
        }
        
        this.error = null
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de suppression du participant'
        console.error('removeParticipant:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ========== NOUVELLES ROUTES POUR LA GESTION DES RÔLES ==========

    /**
     * Changer le rôle d'un participant (admin/membre)
     * PUT /conversations/{conversation}/participants/{user}/role
     */
    async changeParticipantRole(conversationId, userId, role) {
      this.isLoading = true
      try {
        const response = await axios.put(
          `${this.getBaseUrl()}/conversations/${conversationId}/participants/${userId}/role`,
          { role },
          this.authHeaders()
        )
        
        // Mettre à jour la liste des participants
        const participantIndex = this.participants.findIndex(p => p.id === userId)
        if (participantIndex !== -1) {
          this.participants[participantIndex].role = role
        }
        
        // Mettre à jour la conversation courante si nécessaire
        if (this.currentConversation?.id === conversationId && this.currentConversation.participants) {
          const convParticipantIndex = this.currentConversation.participants.findIndex(p => p.id === userId)
          if (convParticipantIndex !== -1) {
            this.currentConversation.participants[convParticipantIndex].pivot.role = role
          }
        }
        
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors du changement de rôle"
        console.error('changeParticipantRole:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Activer/désactiver le mode "seuls les admins peuvent parler"
     * POST /conversations/{conversation}/toggle-admin-only
     */
    async toggleAdminOnly(conversationId, adminOnly) {
      this.isLoading = true
      try {
        const response = await axios.post(
          `${this.getBaseUrl()}/conversations/${conversationId}/toggle-admin-only`,
          { admin_only: adminOnly },
          this.authHeaders()
        )
        
        // Mettre à jour la conversation courante
        if (this.currentConversation?.id === conversationId) {
          this.currentConversation.admin_only = adminOnly
        }
        
        // Mettre à jour la conversation dans la liste
        const index = this.conversations.findIndex(c => c.id === conversationId)
        if (index !== -1) {
          this.conversations[index].admin_only = adminOnly
        }
        
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || "Erreur lors de la modification du mode"
        console.error('toggleAdminOnly:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Vérifier si l'utilisateur courant peut envoyer un message
     * GET /conversations/{conversation}/can-send-message
     */
    async checkCanSendMessage(conversationId) {
      try {
        const response = await axios.get(
          `${this.getBaseUrl()}/conversations/${conversationId}/can-send-message`,
          this.authHeaders()
        )
        
        this.canSendMessageStatus = {
          can_send: response.data.can_send,
          reason: response.data.reason || null,
          role: response.data.role
        }
        
        return response.data
      } catch (error) {
        console.error('checkCanSendMessage:', error)
        return { can_send: false, reason: 'Erreur de vérification' }
      }
    },

    /**
     * Récupérer les statistiques d'une conversation
     * GET /conversations/{conversation}/stats
     */
    async fetchConversationStats(conversationId) {
      try {
        const response = await axios.get(
          `${this.getBaseUrl()}/conversations/${conversationId}/stats`,
          this.authHeaders()
        )
        return response.data
      } catch (error) {
        console.error('fetchConversationStats:', error)
        throw error
      }
    },

    // ========== MÉTHODES UTILITAIRES POUR LES FICHIERS ==========

    getAttachmentFullUrl(attachment, conversationId, messageId) {
      if (!attachment) return ''
      
      if (attachment.url && attachment.url.startsWith('http')) {
        return attachment.url
      }
      
      if (attachment.url && attachment.url.startsWith('/storage')) {
        return `${this.getStorageUrl()}${attachment.url}`
      }
      
      if (attachment.file_path) {
        return `${this.getStorageUrl()}/storage/${attachment.file_path}`
      }
      
      return this.getAttachmentPreviewUrl(conversationId, messageId, attachment.id)
    },

    getAttachmentPreviewUrl(conversationId, messageId, attachmentId) {
      const token = localStorage.getItem('gest-ecole-token')
      return `${this.getBaseUrl()}/conversations/${conversationId}/messages/${messageId}/attachments/${attachmentId}/preview?token=${token}`
    },

    getAttachmentDownloadUrl(conversationId, messageId, attachmentId) {
      const token = localStorage.getItem('gest-ecole-token')
      return `${this.getBaseUrl()}/conversations/${conversationId}/messages/${messageId}/attachments/${attachmentId}/download?token=${token}`
    },

    // ========== MÉTHODES ECHO (WEBSOCKET) ==========

    // Écouter les nouvelles conversations
    listenForNewConversations() {
      if (!process.client) return;

      const { $echo } = useNuxtApp();
      const userStore = useUserStore();
      
      if (!$echo || !userStore.user) return;

      console.log(`🔌 Écoute des nouvelles conversations pour l'utilisateur ${userStore.user.id}`);
      
      $echo.private(`user.${userStore.user.id}`)
        .listen('.conversation.created', async (e) => {
          console.log('📩 Nouvelle conversation reçue (ID):', e.conversation_id);
          
          if (!e.conversation_id) {
            console.error('❌ Pas d\'ID de conversation reçu');
            return;
          }
          
          const exists = this.conversations.some(c => c.id === e.conversation_id);
          
          if (!exists) {
            try {
              const conversation = await this.fetchConversationById(e.conversation_id);
              this.conversations.unshift(conversation);
              console.log('✅ Nouvelle conversation ajoutée à la liste');
            } catch (error) {
              console.error('❌ Erreur lors de la récupération de la conversation:', error);
            }
          }
        })
        .error((error) => {
          console.error('❌ Erreur écoute conversations:', error);
        });
    },

    // Écouter les nouveaux messages
    listenForMessages(conversationId) {
      if (!process.client) return;

      const { $echo } = useNuxtApp()
      const userStore = useUserStore()
      
      if (!$echo) {
        console.warn('⚠️ Echo non disponible')
        return
      }

      if (this.currentConversation && this.currentConversation.id !== conversationId) {
        console.log('👋 Quitte l\'ancien canal:', this.currentConversation.id)
        $echo.leave(`conversation.${this.currentConversation.id}`)
      }

      console.log('🎧 Écoute du canal conversation:', conversationId)

      $echo.private(`conversation.${conversationId}`)
        .listen('.message.sent', (e) => {
          console.log('📨 Nouveau message reçu:', e)
          
          if (e.sender.id === userStore.user?.id) {
            console.log('⏭️ Message ignoré (le mien)')
            return
          }
          
          const exists = this.messages.some(m => m.id === e.id);
          if (!exists) {
            if (e.attachments && e.attachments.length) {
              e.attachments = e.attachments.map(attachment => ({
                ...attachment,
                full_url: this.getAttachmentFullUrl(attachment, conversationId, e.id),
                preview_url: this.getAttachmentPreviewUrl(conversationId, e.id, attachment.id),
                download_url: this.getAttachmentDownloadUrl(conversationId, e.id, attachment.id),
                is_image: attachment.mime_type?.startsWith('image/') || false
              }))
            }
            this.messages.push(e);
            console.log('✅ Message ajouté à la liste')
          }
        })
        
        .listen('.message.updated', (e) => {
          console.log('✏️ Message modifié reçu:', e)
          
          const index = this.messages.findIndex(m => m.id === e.id)
          if (index !== -1) {
            this.messages[index] = {
              ...this.messages[index],
              ...e,
              is_edited: true,
              edited_at: e.edited_at || new Date().toISOString()
            }
            console.log('✅ Message mis à jour')
          }
        })
        
        .listen('.message.deleted', (e) => {
          console.log('🗑️ Message supprimé reçu:', e)
          
          const index = this.messages.findIndex(m => m.id === e.message_id)
          if (index !== -1) {
            this.messages.splice(index, 1)
            console.log('✅ Message retiré de la liste')
          }
        })
        
        .error((error) => {
          console.error('❌ Erreur écoute messages:', error);
          this.echoConnected = false;
        })
        
        .subscribed(() => {
          this.echoConnected = true;
          console.log('✅ Connecté au canal conversation:', conversationId)
        });
    },

    // Écouter les indicateurs de frappe
    listenForTyping(conversationId) {
      if (!process.client) return

      const { $echo } = useNuxtApp()
      const userStore = useUserStore()
      
      if (!$echo) return

      $echo.private(`conversation.${conversationId}`)
        .listenForWhisper('typing', (e) => {
          if (e.userId !== userStore.user?.id) {
            if (!this.typingUsers.includes(e.userName)) {
              this.typingUsers.push(e.userName)
              
              setTimeout(() => {
                this.typingUsers = this.typingUsers.filter(name => name !== e.userName)
              }, 3000)
            }
          }
        })
    },

    // Envoyer un indicateur de frappe
    sendTyping(conversationId) {
      if (!process.client) return

      const { $echo } = useNuxtApp()
      const userStore = useUserStore()
      
      if (!$echo || !userStore.user) return

      $echo.private(`conversation.${conversationId}`)
        .whisper('typing', {
          userId: userStore.user.id,
          userName: `${userStore.user.prenom} ${userStore.user.nom}`
        })
    },

    // Vérifier la connexion Echo
    checkEchoConnection() {
      if (!process.client) return false
      
      try {
        const { $echo } = useNuxtApp()
        
        if ($echo) {
          if ($echo.connector && $echo.connector.pusher) {
            this.echoConnected = $echo.connector.pusher.connection.state === 'connected'
          } else if ($echo.connector && $echo.connector.socket) {
            this.echoConnected = $echo.connector.socket.connected
          } else if ($echo.connector && $echo.connector.connection) {
            this.echoConnected = $echo.connector.connection.state === 'connected'
          } else {
            this.echoConnected = true
          }
          
          console.log('🔌 État Echo:', this.echoConnected ? 'Connecté' : 'Déconnecté')
          return this.echoConnected
        }
      } catch (error) {
        console.error('Erreur lors de la vérification Echo:', error)
      }
      
      this.echoConnected = false
      return false
    },

    // Quitter un canal
    leaveChannel(conversationId) {
      if (!process.client) return
      
      const { $echo } = useNuxtApp()
      if (!$echo) return
      
      $echo.leave(`conversation.${conversationId}`)
      this.typingUsers = []
    },

    // ========== MÉTHODES UTILITAIRES ==========

    // Mettre à jour la conversation courante
    setCurrentConversation(conversation) {
      this.currentConversation = conversation
    },

    // Réinitialiser la conversation courante
    resetCurrentConversation() {
      this.currentConversation = null
      this.messages = []
      this.participants = []
      this.typingUsers = []
      this.canSendMessageStatus = { can_send: true, reason: null }
    },

    // Mettre à jour les URLs des pièces jointes d'un message
    updateMessageAttachments(message) {
      if (!message || !message.attachments || !this.currentConversation) return message
      
      message.attachments = message.attachments.map(attachment => ({
        ...attachment,
        full_url: this.getAttachmentFullUrl(attachment, this.currentConversation.id, message.id),
        preview_url: this.getAttachmentPreviewUrl(this.currentConversation.id, message.id, attachment.id),
        download_url: this.getAttachmentDownloadUrl(this.currentConversation.id, message.id, attachment.id),
        is_image: attachment.mime_type?.startsWith('image/') || false
      }))
      
      return message
    },

    // Rafraîchir les URLs des pièces jointes de tous les messages
    refreshAllAttachmentsUrls() {
      if (!this.currentConversation) return
      
      this.messages = this.messages.map(message => 
        this.updateMessageAttachments(message)
      )
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    }
  },

  getters: {
    // Obtenir les messages avec les URLs complètes des pièces jointes
    getMessagesWithFullUrls: (state) => {
      return state.messages.map(message => {
        if (message.attachments && message.attachments.length) {
          message.attachments = message.attachments.map(attachment => ({
            ...attachment,
            full_url: attachment.full_url || 
                     (attachment.url?.startsWith('http') ? attachment.url :
                      attachment.url?.startsWith('/storage') ? `${config.app_local ? config.app_dev_storage_url : config.app_prod_storage_url}${attachment.url}` :
                      attachment.file_path ? `${config.app_local ? config.app_dev_storage_url : config.app_prod_storage_url}/storage/${attachment.file_path}` : ''),
            is_image: attachment.mime_type?.startsWith('image/') || false
          }))
        }
        return message
      })
    },

    // Vérifier si une conversation a des messages non lus
    hasUnreadMessages: (state) => (conversationId) => {
      const conversation = state.conversations.find(c => c.id === conversationId)
      return conversation ? (conversation.unread_count || 0) > 0 : false
    },

    // Obtenir le dernier message d'une conversation
    lastMessage: (state) => (conversationId) => {
      const conversation = state.conversations.find(c => c.id === conversationId)
      return conversation?.last_message || null
    },

    // Compter le nombre total de participants dans la conversation courante
    currentConversationParticipantsCount: (state) => {
      return state.currentConversation?.participants?.length || 0
    },

    // Vérifier si l'utilisateur courant est admin de la conversation
    isCurrentUserAdmin: (state) => {
      if (!state.currentConversation || !state.currentConversation.participants) return false
      const userStore = useUserStore()
      const participant = state.currentConversation.participants.find(
        p => p.id === userStore.user?.id
      )
      return participant?.pivot?.role === 'admin'
    },

    // Vérifier si le mode admin-only est activé
    isAdminOnlyEnabled: (state) => {
      return state.currentConversation?.admin_only || false
    },

    // Vérifier si l'utilisateur courant peut envoyer un message
    canCurrentUserSendMessage: (state) => {
      if (!state.currentConversation) return false
      
      // Si pas de mode admin-only, tout le monde peut envoyer
      if (!state.currentConversation.admin_only) return true
      
      // Si mode admin-only, seuls les admins peuvent envoyer
      const userStore = useUserStore()
      const participant = state.currentConversation.participants?.find(
        p => p.id === userStore.user?.id
      )
      return participant?.pivot?.role === 'admin'
    }
  }
})