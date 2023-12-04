import { Document } from 'linkedom'
import { COMMON_REGEX } from './constants'

const ALLOWED_EMBEDS = [
  'youtube.com',
  'youtu.be',
  'embed.tape.xyz',
  'player.vimeo.com'
]

const constructIframe = async (document: Document, url: string) => {
  const ogURLTag =
    document.querySelector('meta[property="twitter:player"]') ||
    document.querySelector('meta[property="og:video:secure_url"]') ||
    document.querySelector('meta[property="og:video:url"]')

  let embedUrl = ogURLTag ? ogURLTag.getAttribute('content') : null
  if (!embedUrl) {
    return null
  }
  const urlObj = new URL(embedUrl)
  const hostname = urlObj.hostname.replace('www.', '')

  if (!ALLOWED_EMBEDS.includes(hostname)) {
    return null
  }

  if (COMMON_REGEX.YOUTUBE_WATCH.test(embedUrl)) {
    urlObj.searchParams.set('color', 'white')
    urlObj.searchParams.set('modestbranding', '1')
    urlObj.searchParams.set('rel', '0')
    embedUrl = urlObj.href
  }

  if (COMMON_REGEX.VIMEO_WATCH.test(embedUrl)) {
    urlObj.searchParams.set('autoplay', '0')
    embedUrl = urlObj.href
  }

  if (embedUrl) {
    return `<iframe src="${embedUrl}" class="aspect-[16/9] w-full" allow="accelerometer; clipboard-write; encrypted-media" allowfullscreen></iframe>`
  } else {
    return 'No embed URL available.'
  }
}

export default constructIframe
