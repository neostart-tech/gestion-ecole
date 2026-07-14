export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'Paramètre url manquant' })
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Image introuvable' })
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || 'image/jpeg'

  setResponseHeader(event, 'Content-Type', contentType)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')

  return buffer
})
