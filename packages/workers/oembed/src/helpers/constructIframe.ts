import { Document } from 'linkedom'

const ALLOWED_SITES = ['youtube.com', 'youtu.be', 'embed.tape.xyz']

const constructIframe = (document: Document) => {
  const ogURLTag =
    document.querySelector('meta[property="twitter:player"]') ||
    document.querySelector('meta[property="og:video:secure_url"]') ||
    document.querySelector('meta[property="og:video:url"]')

  const embedUrl = ogURLTag ? ogURLTag.getAttribute('content') : null
  if (!embedUrl) {
    return null
  }
  const hostname = new URL(embedUrl).hostname.replace('www.', '')

  if (!ALLOWED_SITES.includes(hostname)) {
    return null
  }

  if (embedUrl) {
    return `<iframe src="${embedUrl}" class="aspect-[16/9] w-full" allow="accelerometer; encrypted-media" allowfullscreen></iframe>`
  } else {
    return 'No embed URL available.'
  }
}

export default constructIframe
