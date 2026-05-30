import { defineStore } from "pinia";
import axios from "axios";

export const useExamStore = defineStore("exam", {
  state: () => ({
    // Données de l'examen
    currentEvaluation: null,
    parts: [],
    currentPart: null,
    questions: [],
    currentQuestion: null,
    
    // Soumissions et session
    submissions: [],
    currentSession: null,
    examStats: {},
    
    // États de chargement
    isLoading: false,
    isSubmitting: false,
    error: null,
    
    // Progression
    progress: {
      total: 0,
      answered: 0,
      percentage: 0
    },
    
    questionsComplexData: {},
    questionsStructuredData: {},
    questionsMultiParts: {},
    questionsGuidedWriting: {}
  }),

  getters: {
    // ========== INFORMATIONS GÉNÉRALES ==========
    examTitle: (state) => state.currentEvaluation?.matiere?.nom || "Examen",
    examDuration: (state) => {
      if (!state.currentEvaluation?.debut || !state.currentEvaluation?.fin) return 0;
      const debut = new Date(state.currentEvaluation.debut);
      const fin = new Date(state.currentEvaluation.fin);
      return Math.floor((fin - debut) / 60000); // en minutes
    },
    
    // ========== PARTIES ==========
    totalParts: (state) => state.parts.length,
    sortedParts: (state) => [...state.parts].sort((a, b) => a.order - b.order),
    
    getPartById: (state) => (partId) => {
      return state.parts.find(p => p.id === partId);
    },
    
    getQuestionsByPart: (state) => (partId) => {
      return state.questions.filter(q => q.part_id === partId)
                           .sort((a, b) => a.order - b.order);
    },
    
    partProgress: (state) => (partId) => {
      const partQuestions = state.questions.filter(q => q.part_id === partId);
      const total = partQuestions.length;
      const answered = partQuestions.filter(q => {
        return state.submissions.some(s => s.question_id === q.id && s.submitted_at);
      }).length;
      
      return {
        total,
        answered,
        percentage: total > 0 ? Math.round((answered / total) * 100) : 0
      };
    },
    
    // ========== QUESTIONS ==========
    totalQuestions: (state) => state.questions.length,
    answeredQuestions: (state) => {
      return state.questions.filter(q => {
        return state.submissions.some(s => s.question_id === q.id && s.submitted_at);
      }).length;
    },
    
    unansweredQuestions: (state) => {
      return state.questions.filter(q => {
        return !state.submissions.some(s => s.question_id === q.id && s.submitted_at);
      });
    },
    
    getQuestionById: (state) => (questionId) => {
      return state.questions.find(q => q.id === questionId);
    },
    
    getSubmissionForQuestion: (state) => (questionId) => {
      return state.submissions.find(s => s.question_id === questionId);
    },
    
    getComplexDataForQuestion: (state) => (questionId) => {
      return state.questionsComplexData[questionId] || null;
    },
    
    getStructuredDataForQuestion: (state) => (questionId) => {
      return state.questionsStructuredData[questionId] || null;
    },
    
    getMultiPartsForQuestion: (state) => (questionId) => {
      return state.questionsMultiParts[questionId] || null;
    },
    
    getGuidedWritingForQuestion: (state) => (questionId) => {
      return state.questionsGuidedWriting[questionId] || null;
    },
    
    // ========== SESSION ==========
    isExamActive: (state) => {
      return state.currentSession?.status === 'en_cours';
    },
    
    timeRemaining: (state) => {
      if (!state.currentEvaluation?.fin) return 0;
      const now = new Date();
      const fin = new Date(state.currentEvaluation.fin);
      const remaining = Math.max(0, Math.floor((fin - now) / 1000)); // en secondes
      
      return {
        seconds: remaining,
        minutes: Math.floor(remaining / 60),
        hours: Math.floor(remaining / 3600),
        isExpired: remaining <= 0
      };
    },
    
   // Version plus robuste avec gestion des erreurs
    totalPoints: (state) => {
      return state.questions.reduce((sum, q) => {
        let questionPoints = 0;
        
        // Points de base de la question
        if (q.points !== null && q.points !== undefined) {
          if (typeof q.points === 'number') {
            questionPoints = q.points;
          } else if (typeof q.points === 'string') {
            const parsed = parseFloat(q.points);
            questionPoints = isNaN(parsed) ? 0 : parsed;
          }
        }

        // Ajout des points de justification si activée
        if (q.config?.requireJustification && q.config?.justificationPoints) {
          const jPoints = parseFloat(q.config.justificationPoints);
          if (!isNaN(jPoints)) {
            questionPoints += jPoints;
          }
        }
        
        return sum + questionPoints;
      }, 0);
    },
    
    obtainedPoints: (state) => {
      return state.submissions.reduce((sum, s) => sum + (s.points_obtenus || 0), 0);
    },
    
    scorePercentage: (state) => {
      const total = state.questions.reduce((sum, q) => sum + (q.points || 0), 0);
      const obtained = state.submissions.reduce((sum, s) => sum + (s.points_obtenus || 0), 0);
      return total > 0 ? Math.round((obtained / total) * 100) : 0;
    }
  },

  actions: {
    authHeaders() {
      const token = localStorage.getItem("gest-ecole-token");
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    },

    handleError(error, defaultMessage) {
      console.error(defaultMessage, error);
      this.error = error.response?.data?.message || defaultMessage;
      throw error;
    },

    async loadExam(evaluationId) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Charger l'évaluation
        const evalResponse = await axios.get(
          `/evaluations/${evaluationId}/detail`,
          this.authHeaders()
        );
        this.currentEvaluation = evalResponse.data.data;
        
        // Charger les parties
        const partsResponse = await axios.get(
          `/evaluations/${evaluationId}/parts`,
          this.authHeaders()
        );
        this.parts = partsResponse.data.data;
        
        // Charger toutes les questions
        const questionsPromises = this.parts.map(part =>
          axios.get(`/exam-parts/${part.id}/questions`, this.authHeaders())
        );
        
        const questionsResponses = await Promise.all(questionsPromises);
        this.questions = questionsResponses.flatMap(res => res.data.data);
        
        this.extractComplexDataFromQuestions();
        
        // Mettre à jour la progression
        this.updateProgress();
        
        return {
          evaluation: this.currentEvaluation,
          parts: this.parts,
          questions: this.questions
        };
      } catch (error) {
        this.handleError(error, "Erreur lors du chargement de l'examen");
      } finally {
        this.isLoading = false;
      }
    },

    extractComplexDataFromQuestions() {
      this.questionsComplexData = {};
      this.questionsStructuredData = {};
      this.questionsMultiParts = {};
      this.questionsGuidedWriting = {};
      
      this.questions.forEach(question => {
        if (question.complex_data) {
          this.questionsComplexData[question.id] = question.complex_data;
        }
        if (question.structured_data) {
          this.questionsStructuredData[question.id] = question.structured_data;
        }
        if (question.multi_parts) {
          this.questionsMultiParts[question.id] = question.multi_parts;
        }
        if (question.guided_writing) {
          this.questionsGuidedWriting[question.id] = question.guided_writing;
        }
      });
    },

    async fetchAllSubmissions(evaluationId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/exam/${evaluationId}/submissions/all`,
          this.authHeaders()
        );
        
        this.submissions = response.data.data.etudiants || [];
        this.examStats = response.data.data.stats || {};
        this.questions = response.data.data.questions || [];

        if (response.data.data.has_anonymat !== undefined) {
          if (!this.currentEvaluation) this.currentEvaluation = {};
          this.currentEvaluation.has_anonymat = response.data.data.has_anonymat;
        }
        
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur chargement soumissions");
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSubmittedSubmissions(evaluationId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/exam/${evaluationId}/submissions/submitted`,
          this.authHeaders()
        );
        
        this.submissions = response.data.data.etudiants || [];
        this.examStats = response.data.data.stats || {};
        this.questions = response.data.data.questions || [];

        if (response.data.data.has_anonymat !== undefined) {
          if (!this.currentEvaluation) this.currentEvaluation = {};
          this.currentEvaluation.has_anonymat = response.data.data.has_anonymat;
        }
        
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur chargement soumissions envoyées");
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllSessions(evaluationId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evaluations/${evaluationId}/sessions`,
          this.authHeaders()
        );
        
        return response.data.data.sessions || [];
      } catch (error) {
        this.handleError(error, "Erreur chargement des sessions");
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // ========== GESTION DES PARTIES ==========
    async fetchParts(evaluationId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evaluations/${evaluationId}/parts`,
          this.authHeaders()
        );
        this.parts = response.data.data;
        return this.parts;
      } catch (error) {
        this.handleError(error, "Erreur chargement des parties");
      } finally {
        this.isLoading = false;
      }
    },

    async addPart(partData) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/exam-parts",
          partData,
          this.authHeaders()
        );
        
        this.parts.push(response.data.data);
        this.parts.sort((a, b) => a.order - b.order);
        
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur création partie");
      } finally {
        this.isLoading = false;
      }
    },

    async updatePart(partId, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/exam-parts/${partId}`,
          updatedData,
          this.authHeaders()
        );

        const index = this.parts.findIndex(p => p.id === partId);
        if (index !== -1) {
          this.parts[index] = response.data.data;
        }

        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur mise à jour partie");
      } finally {
        this.isLoading = false;
      }
    },

    async deletePart(partId) {
      this.isLoading = true;
      try {
        await axios.delete(`/exam-parts/${partId}`, this.authHeaders());
        this.parts = this.parts.filter(p => p.id !== partId);
      } catch (error) {
        this.handleError(error, "Erreur suppression partie");
      } finally {
        this.isLoading = false;
      }
    },

    async reorderParts(orderedParts) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/exam-parts/reorder",
          { parts: orderedParts },
          this.authHeaders()
        );
        
        orderedParts.forEach(({ id, order }) => {
          const part = this.parts.find(p => p.id === id);
          if (part) part.order = order;
        });
        this.parts.sort((a, b) => a.order - b.order);
        
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur réorganisation");
      } finally {
        this.isLoading = false;
      }
    },

    // Dans stores/exam.js
    async fetchQuestions(partId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/exam-parts/${partId}/questions`,
          this.authHeaders()
        );
        
        const newQuestions = response.data.data;
        
        // Mettre à jour les questions
        newQuestions.forEach(newQ => {
          const index = this.questions.findIndex(q => q.id === newQ.id);
          if (index !== -1) {
            this.questions[index] = newQ;
          } else {
            this.questions.push(newQ);
          }
        });
        
        this.extractComplexDataFromQuestions();
        
        return newQuestions;
      } catch (error) {
        this.handleError(error, "Erreur chargement questions");
      } finally {
        this.isLoading = false;
      }
    },

    async addQuestion(questionData) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/exam-questions",
          questionData,
          this.authHeaders()
        );
        
        const newQuestion = response.data.data;
        this.questions.push(newQuestion);
        
        if (newQuestion.complex_data) {
          this.questionsComplexData[newQuestion.id] = newQuestion.complex_data;
        }
        if (newQuestion.structured_data) {
          this.questionsStructuredData[newQuestion.id] = newQuestion.structured_data;
        }
        if (newQuestion.multi_parts) {
          this.questionsMultiParts[newQuestion.id] = newQuestion.multi_parts;
        }
        if (newQuestion.guided_writing) {
          this.questionsGuidedWriting[newQuestion.id] = newQuestion.guided_writing;
        }
        
        return newQuestion;
      } catch (error) {
        this.handleError(error, "Erreur création question");
      } finally {
        this.isLoading = false;
      }
    },

    async updateQuestion(questionId, questionData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/exam-questions/${questionId}`,
          questionData,
          this.authHeaders()
        );

        const index = this.questions.findIndex(q => q.id === questionId);
        if (index !== -1) {
          this.questions[index] = response.data.data;
          
          const updatedQuestion = response.data.data;
          if (updatedQuestion.complex_data) {
            this.questionsComplexData[questionId] = updatedQuestion.complex_data;
          }
          if (updatedQuestion.structured_data) {
            this.questionsStructuredData[questionId] = updatedQuestion.structured_data;
          }
          if (updatedQuestion.multi_parts) {
            this.questionsMultiParts[questionId] = updatedQuestion.multi_parts;
          }
          if (updatedQuestion.guided_writing) {
            this.questionsGuidedWriting[questionId] = updatedQuestion.guided_writing;
          }
        }

        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur mise à jour question");
      } finally {
        this.isLoading = false;
      }
    },

    async deleteQuestion(questionId) {
      this.isLoading = true;
      try {
        await axios.delete(`/exam-questions/${questionId}`, this.authHeaders());
        this.questions = this.questions.filter(q => q.id !== questionId);
        
        delete this.questionsComplexData[questionId];
        delete this.questionsStructuredData[questionId];
        delete this.questionsMultiParts[questionId];
        delete this.questionsGuidedWriting[questionId];
        
      } catch (error) {
        this.handleError(error, "Erreur suppression question");
      } finally {
        this.isLoading = false;
      }
    },

    async toggleQuestionActive(questionId) {
      this.isLoading = true;
      try {
        const response = await axios.patch(
          `/exam-questions/${questionId}/toggle-active`,
          {},
          this.authHeaders()
        );

        const index = this.questions.findIndex(q => q.id === questionId);
        if (index !== -1) {
          this.questions[index].is_active = response.data.data.is_active;
        }

        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur activation/désactivation");
      } finally {
        this.isLoading = false;
      }
    },

    // ========== GESTION DES OPTIONS ==========
    async addOption(optionData) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "/exam-question-options",
          optionData,
          this.authHeaders()
        );
        
        const newOption = response.data.data;
        const question = this.questions.find(q => q.id === optionData.question_id);
        if (question) {
          if (!question.options) question.options = [];
          question.options.push(newOption);
          question.options.sort((a, b) => a.order - b.order);
        }
        
        return newOption;
      } catch (error) {
        this.handleError(error, "Erreur création option");
      } finally {
        this.isLoading = false;
      }
    },

    async updateOption(optionId, updatedData) {
      this.isLoading = true;
      try {
        const response = await axios.put(
          `/exam-question-options/${optionId}`,
          updatedData,
          this.authHeaders()
        );

        // Trouver la question contenant cette option
        for (const question of this.questions) {
          if (question.options) {
            const index = question.options.findIndex(o => o.id === optionId);
            if (index !== -1) {
              question.options[index] = response.data.data;
              break;
            }
          }
        }

        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur mise à jour option");
      } finally {
        this.isLoading = false;
      }
    },

    async deleteOption(optionId, questionId) {
      this.isLoading = true;
      try {
        await axios.delete(`/exam-question-options/${optionId}`, this.authHeaders());
        
        const question = this.questions.find(q => q.id === questionId);
        if (question?.options) {
          question.options = question.options.filter(o => o.id !== optionId);
        }
      } catch (error) {
        this.handleError(error, "Erreur suppression option");
      } finally {
        this.isLoading = false;
      }
    },

    async markOptionCorrect(optionId, questionId) {
      this.isLoading = true;
      try {
        const response = await axios.patch(
          `/exam-question-options/${optionId}/mark-correct`,
          {},
          this.authHeaders()
        );

        // Mettre à jour localement
        const question = this.questions.find(q => q.id === questionId);
        if (question?.options) {
          // Pour QCM unique, démarker les autres
          if (question.type === 'qcm_unique') {
            question.options.forEach(o => o.is_correct = false);
          }
          
          const option = question.options.find(o => o.id === optionId);
          if (option) option.is_correct = true;
        }

        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur marquage correct");
      } finally {
        this.isLoading = false;
      }
    },

    // ========== GESTION DES SESSIONS ==========
    async startExam(evaluationId, etudiantId) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/exam/${evaluationId}/start`,
          { etudiant_id: etudiantId },
          this.authHeaders()
        );
        
        this.currentSession = response.data.data.session;
        return this.currentSession;
      } catch (error) {
        this.handleError(error, "Erreur démarrage examen");
      } finally {
        this.isLoading = false;
      }
    },

    async getProgress(evaluationId, etudiantId) {
      try {
        const response = await axios.get(
          `/exam/${evaluationId}/progress`,
          { 
            params: { etudiant_id: etudiantId },
            ...this.authHeaders()
          }
        );
        
        this.progress = response.data.data;
        return this.progress;
      } catch (error) {
        this.handleError(error, "Erreur récupération progression");
      }
    },

    async pingSession(sessionId) {
      try {
        await axios.post(`/exam-sessions/${sessionId}/ping`, {}, this.authHeaders());
      } catch (error) {
        console.error("Erreur ping session:", error);
      }
    },

    // ========== GESTION DES SOUMISSIONS ==========
    async fetchSubmissions(evaluationId, etudiantId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/exam/${evaluationId}/student/${etudiantId}/submissions`,
          this.authHeaders()
        );
        
        this.submissions = response.data.data.all || [];
        this.updateProgress();
        
        return this.submissions;
      } catch (error) {
        this.handleError(error, "Erreur chargement soumissions");
      } finally {
        this.isLoading = false;
      }
    },

    async saveResponse(evaluationId, questionId, reponse, etudiantId) {
      try {
        const response = await axios.post(
          `/exam/${evaluationId}/save`,
          {
            question_id: questionId,
            reponse: reponse,
            etudiant_id: etudiantId
          },
          this.authHeaders()
        );

        // Mettre à jour ou ajouter la soumission
        const submission = response.data.data.submission;
        const index = this.submissions.findIndex(s => s.question_id === questionId);
        
        if (index !== -1) {
          this.submissions[index] = submission;
        } else {
          this.submissions.push(submission);
        }

        return submission;
      } catch (error) {
        this.handleError(error, "Erreur sauvegarde réponse");
      }
    },

    async submitQuestion(evaluationId, questionId, reponse, etudiantId) {
      this.isSubmitting = true;
      try {
        const response = await axios.post(
          `/exam/${evaluationId}/submit-question`,
          {
            question_id: questionId,
            reponse: reponse,
            etudiant_id: etudiantId
          },
          this.authHeaders()
        );

        const submission = response.data.data.submission;
        const index = this.submissions.findIndex(s => s.question_id === questionId);
        
        if (index !== -1) {
          this.submissions[index] = submission;
        } else {
          this.submissions.push(submission);
        }

        this.updateProgress();
        return submission;
      } catch (error) {
        this.handleError(error, "Erreur soumission réponse");
      } finally {
        this.isSubmitting = false;
      }
    },

    async submitComplexResponse(evaluationId, questionId, reponse, etudiantId) {
      this.isSubmitting = true;
      try {
        const response = await axios.post(
          `/exam/${evaluationId}/submit-complex`,
          {
            question_id: questionId,
            reponse: reponse,
            etudiant_id: etudiantId
          },
          this.authHeaders()
        );

        const submission = response.data.data;
        const index = this.submissions.findIndex(s => s.question_id === questionId);
        
        if (index !== -1) {
          this.submissions[index] = submission;
        } else {
          this.submissions.push(submission);
        }

        this.updateProgress();
        return submission;
      } catch (error) {
        this.handleError(error, "Erreur soumission complexe");
      } finally {
        this.isSubmitting = false;
      }
    },

    async submitAllExam(evaluationId, etudiantId) {
      this.isSubmitting = true;
      try {
        const response = await axios.post(
          `/exam/${evaluationId}/submit-all`,
          { etudiant_id: etudiantId },
          this.authHeaders()
        );

        // Marquer toutes les soumissions comme soumises
        this.submissions.forEach(s => {
          if (!s.submitted_at) {
            s.submitted_at = new Date().toISOString();
          }
        });

        if (this.currentSession) {
          this.currentSession.status = 'termine';
          this.currentSession.submitted_at = new Date().toISOString();
        }

        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur soumission finale");
      } finally {
        this.isSubmitting = false;
      }
    },

    async gradeSubmission(submissionId, points, commentaire) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/exam-submissions/${submissionId}/grade`,
          {
            points_obtenus: points,
            commentaire: commentaire
          },
          this.authHeaders()
        );

        const submission = response.data.data;
        const index = this.submissions.findIndex(s => s.id === submissionId);
        if (index !== -1) {
          this.submissions[index] = submission;
        }

        return submission;
      } catch (error) {
        this.handleError(error, "Erreur notation");
      } finally {
        this.isLoading = false;
      }
    },

    async suggestGrade(submissionId) {
      try {
        const response = await axios.post(
          `/exam-submissions/${submissionId}/suggest-grade`,
          {},
          this.authHeaders()
        );
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur lors de la suggestion IA");
      }
    },

    async generateQuestionsAI(payload) {
      try {
        const response = await axios.post(
          '/exam-questions/generate-ai',
          payload,
          this.authHeaders()
        );
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur génération IA");
      }
    },

    async refineQuestionAI(payload) {
      try {
        const response = await axios.post(
          '/exam-questions/refine-ai',
          payload,
          this.authHeaders()
        );
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur aide IA");
      }
    },

    async finalizeGrade(evaluationId, etudiantId) {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `/exam/${evaluationId}/finalize-grade/${etudiantId}`,
          {},
          this.authHeaders()
        );
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur finalisation de la note");
      } finally {
        this.isLoading = false;
      }
    },

    async publishEvaluation(evaluationId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/evaluations/${evaluationId}/publier`,
          this.authHeaders()
        );
        
        if (this.currentEvaluation && (this.currentEvaluation.id == evaluationId || this.currentEvaluation.slug == evaluationId)) {
          this.currentEvaluation.published = 1;
        }
        
        return response.data;
      } catch (error) {
        this.handleError(error, "Erreur lors de la publication des résultats");
      } finally {
        this.isLoading = false;
      }
    },

    // ========== STATISTIQUES ==========
    async getExamStatistics(evaluationId) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `/exam/${evaluationId}/statistics`,
          this.authHeaders()
        );
        return response.data.data;
      } catch (error) {
        this.handleError(error, "Erreur récupération statistiques");
      } finally {
        this.isLoading = false;
      }
    },

    // ========== UTILITAIRES ==========
    updateProgress() {
      const total = this.questions.length;
      const answered = this.questions.filter(q => {
        return this.submissions.some(s => s.question_id === q.id && s.submitted_at);
      }).length;
      
      this.progress = {
        total,
        answered,
        percentage: total > 0 ? Math.round((answered / total) * 100) : 0
      };
    },

    setCurrentPart(part) {
      this.currentPart = part;
    },

    setCurrentQuestion(question) {
      this.currentQuestion = question;
    },

    clearExam() {
      this.currentEvaluation = null;
      this.parts = [];
      this.currentPart = null;
      this.questions = [];
      this.currentQuestion = null;
      this.submissions = [];
      this.currentSession = null;
      this.progress = { total: 0, answered: 0, percentage: 0 };
      this.error = null;
      
      this.questionsComplexData = {};
      this.questionsStructuredData = {};
      this.questionsMultiParts = {};
      this.questionsGuidedWriting = {};
    },

    // ========== AUTO-SAVE TIMER ==========
    startAutoSave(evaluationId, etudiantId, intervalSeconds = 30) {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer);
      }
      
      this.autoSaveTimer = setInterval(() => {
        // Sauvegarder toutes les réponses non soumises
        const unsavedQuestions = this.questions.filter(q => {
          const submission = this.submissions.find(s => s.question_id === q.id);
          return !submission?.submitted_at;
        });

        unsavedQuestions.forEach(question => {
          const submission = this.submissions.find(s => s.question_id === question.id);
          if (submission?.reponse) {
            if (['complex_data', 'structured_data', 'multi_parts', 'guided_writing'].includes(question.type)) {
              this.submitComplexResponse(evaluationId, question.id, submission.reponse, etudiantId);
            } else {
              this.saveResponse(evaluationId, question.id, submission.reponse, etudiantId);
            }
          }
        });
      }, intervalSeconds * 1000);
    },

    stopAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer);
        this.autoSaveTimer = null;
      }
    }
  }
});