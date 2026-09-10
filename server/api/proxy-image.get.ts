export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'Paramètre url manquant' })
  }

  let fetchUrl = url
  try {
    const parsed = new URL(url)
    // Correction uniquement pour l'environnement de développement local (Node.js IPv6 bug)
    if (parsed.hostname === 'localhost') {
      parsed.hostname = '127.0.0.1'
      fetchUrl = parsed.toString()
    }
  } catch (e) {
    // Si l'URL est mal formatée, on garde la valeur d'origine
  }

  const response = await fetch(fetchUrl)

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Image introuvable' })
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || 'image/jpeg'

  setResponseHeader(event, 'Content-Type', contentType)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')

  return buffer
})
