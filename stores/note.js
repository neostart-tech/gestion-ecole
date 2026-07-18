// stores/note.js
import { defineStore } from "pinia"
import axios from "axios"

export const useNoteStore = defineStore("note", {
  state: () => ({
    notes: [], // Pour les notes de l'étudiant connecté
    allNotes: [], // Pour toutes les notes (admin)
    periode: null,
    isLoading: false,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token")
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    },

    // Récupérer toutes les notes (admin)
    async fetchNotes() {
      this.isLoading = true
      try {
        const response = await axios.get(
          "/decoupage-academique/liste",
          this.authHeaders()
        )
        this.allNotes = response.data.data
        return this.allNotes
      } catch (error) {
        console.error("Erreur chargement des notes:", error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Récupérer les notes de l'étudiant connecté
    async fetchAuthNote() {
      this.isLoading = true
      try {
        const response = await axios.get("/mes-notes", this.authHeaders())
        
        // Structure attendue de votre API
        // { data: [ { id, notation, anonymat, evaluation: { ... } } ] }
        
        this.notes = response.data.data || response.data
        
        console.log("Notes chargées:", this.notes) // Pour debug
        
        return this.notes
      } catch (error) {
        console.error("Erreur chargement des notes de l'étudiant:", error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Récupérer une note spécifique
    async fetchNoteById(id) {
      this.isLoading = true
      try {
        const response = await axios.get(`/notes/${id}`, this.authHeaders())
        return response.data.data || response.data
      } catch (error) {
        console.error("Erreur chargement de la note:", error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Calculer la moyenne de l'étudiant
    calculerMoyenne() {
      if (!this.notes.length) return 0
      
      const somme = this.notes.reduce((acc, note) => acc + (note.notation || 0), 0)
      return (somme / this.notes.length).toFixed(2)
    },

    // Filtrer les notes par période/semestre
    getNotesByPeriode(periodeId) {
      return this.notes.filter(note => 
        note.evaluation?.matiere?.ue?.periode?.id === periodeId
      )
    },

    // Vérifier si une note a une réclamation en cours
    noteHasActiveReclamation(noteId) {
      const note = this.notes.find(n => n.id === noteId)
      return note?.reclamation?.statut === 'en_attente'
    },

    // Reset du store
    resetStore() {
      this.notes = []
      this.allNotes = []
      this.periode = null
      this.isLoading = false
    }
  },

  getters: {
    // Nombre total de notes
    totalNotes: (state) => state.notes.length,

    // Notes par statut de réclamation
    notesSansReclamation: (state) => 
      state.notes.filter(n => !n.reclamation),

    notesAvecReclamationEnAttente: (state) => 
      state.notes.filter(n => n.reclamation?.statut === 'en_attente'),

    notesAvecReclamationApprouvee: (state) => 
      state.notes.filter(n => n.reclamation?.statut === 'approuvee'),

    notesAvecReclamationRejetee: (state) => 
      state.notes.filter(n => n.reclamation?.statut === 'rejetee'),

    // Moyenne par semestre
    moyenneSemestre1: (state) => {
      const notesSem1 = state.notes.filter(n => 
        n.evaluation?.matiere?.ue?.periode?.nom?.includes('Semestre 1')
      )
      if (!notesSem1.length) return 0
      const somme = notesSem1.reduce((acc, n) => acc + (n.notation || 0), 0)
      return (somme / notesSem1.length).toFixed(2)
    },

    moyenneSemestre2: (state) => {
      const notesSem2 = state.notes.filter(n => 
        n.evaluation?.matiere?.ue?.periode?.nom?.includes('Semestre 2')
      )
      if (!notesSem2.length) return 0
      const somme = notesSem2.reduce((acc, n) => acc + (n.notation || 0), 0)
      return (somme / notesSem2.length).toFixed(2)
    },

    // Meilleure note
    meilleureNote: (state) => {
      if (!state.notes.length) return null
      return state.notes.reduce((max, note) => 
        (note.notation > max.notation) ? note : max
      , state.notes[0])
    },

    // Moins bonne note
    moinsBonneNote: (state) => {
      if (!state.notes.length) return null
      return state.notes.reduce((min, note) => 
        (note.notation < min.notation) ? note : min
      , state.notes[0])
    },

    // Notes par matière
    notesGroupeesParMatiere: (state) => {
      const grouped = {}
      state.notes.forEach(note => {
        const matiere = note.evaluation?.matiere?.nom || 'Sans matière'
        if (!grouped[matiere]) {
          grouped[matiere] = []
        }
        grouped[matiere].push(note)
      })
      return grouped
    }
  }
})