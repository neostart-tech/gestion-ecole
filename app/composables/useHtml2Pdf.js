// composables/useHtml2Pdf.js

export const useHtml2Pdf = () => {
  const isGenerating = ref(false)
  const error = ref(null)

  const generatePDF = async (element, options = {}) => {
    isGenerating.value = true
    error.value = null

    try {
      // Import dynamique
      const html2pdf = (await import('html2pdf.js')).default

      // S'assurer que l'élément est valide
      if (!element) {
        throw new Error("L'élément source n'existe pas")
      }

      // Vérifier que l'élément a du contenu
      if (element.children.length === 0) {
        console.warn("L'élément source est vide")
      }

      // Configuration de base
      const defaultOptions = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        enableLinks: true,
        
        // Options importantes pour html2canvas
        html2canvas: { 
          scale: 2,
          letterRendering: true,
          useCORS: true,
          logging: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200
        },
        
        // Options pour jsPDF
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'landscape',
          compress: true
        },
        
        pagebreak: { mode: ['css', 'legacy'] }
      }

      const mergedOptions = { ...defaultOptions, ...options }
      
      console.log('Génération PDF avec options:', mergedOptions)
      console.log('Élément source:', element)

      // Méthode alternative: créer une copie pour éviter les problèmes de DOM
      const worker = html2pdf()
        .set(mergedOptions)
        .from(element)
      
      await worker.save()
      
      return { success: true }
    } catch (err) {
      console.error('Erreur détaillée:', err)
      error.value = err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating: readonly(isGenerating),
    error: readonly(error),
    generatePDF
  }
}