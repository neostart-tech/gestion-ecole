/**
 * usePdfGenerator
 *
 * Composable réutilisable pour générer des PDFs depuis le DOM.
 * Résout automatiquement le problème CORS des images externes
 * en les faisant transiter par le proxy Nuxt (/api/proxy-image).
 *
 * Utilisation :
 *   const { downloadAsPdf, isGenerating } = usePdfGenerator()
 *   await downloadAsPdf(document.getElementById('mon-element'), 'mon-fichier.pdf')
 */

import { ref, readonly } from 'vue'

export interface PdfOptions {
  margin?: number
  scale?: number
  orientation?: 'portrait' | 'landscape'
  format?: string
  wrapperStyle?: string
}

export const usePdfGenerator = () => {
  const isGenerating = ref(false)

  /**
   * Proxifie une URL externe via /api/proxy-image.
   * - Les data URIs (base64) sont retournées telles quelles
   * - Les URLs du même domaine sont retournées telles quelles
   * - Seules les URLs cross-origin passent par le proxy
   */
  const proxyExternalUrl = (src: string): string => {
    if (!src) return src
    if (src.startsWith('data:')) return src
    if (src.startsWith('/') && !src.startsWith('//')) return src
    try {
      const parsed = new URL(src)
      if (parsed.origin === window.location.origin) return src
    } catch {
      return src
    }
    return `/api/proxy-image?url=${encodeURIComponent(src)}`
  }

  /**
   * Clone un élément DOM et remplace toutes les src d'images
   * par des URLs proxifiées pour éviter le CORS dans html2canvas.
   * Retourne le HTML en string prêt pour html2pdf.
   */
  const prepareHtmlForCapture = (
    element: HTMLElement,
    wrapperStyle = 'width:210mm;background:#fff;padding:20mm 0;font-family:sans-serif;'
  ): string => {
    const clone = element.cloneNode(true) as HTMLElement
    const imgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[]
    imgs.forEach((img) => {
      if (img.src) img.src = proxyExternalUrl(img.src)
    })
    return `<div style="${wrapperStyle}">${clone.innerHTML}</div>`
  }

  /**
   * Génère et télécharge un PDF depuis un élément HTML.
   * Applique automatiquement le proxy CORS sur toutes les images.
   *
   * @param element  - L'élément DOM à capturer
   * @param filename - Nom du fichier PDF à télécharger
   * @param options  - Options de mise en page (margin, scale, format...)
   */
  const downloadAsPdf = async (
    element: HTMLElement | null,
    filename: string,
    options: PdfOptions = {}
  ): Promise<void> => {
    if (!element) throw new Error('[usePdfGenerator] Élément DOM introuvable')

    isGenerating.value = true
    try {
      const {
        margin = 10,
        scale = 2,
        orientation = 'portrait',
        format = 'a4',
        wrapperStyle,
      } = options

      const html2pdf = (await import('html2pdf.js')).default
      const htmlContent = prepareHtmlForCapture(element, wrapperStyle)

      await html2pdf()
        .from(htmlContent)
        .set({
          margin,
          filename,
          html2canvas: { scale, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format, orientation },
        })
        .save()
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating: readonly(isGenerating),
    downloadAsPdf,
    proxyExternalUrl,
    prepareHtmlForCapture,
  }
}
