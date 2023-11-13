import { COMMON_REGEX } from './constants'
import constructIframe from './constructIframe'
import { Document } from 'linkedom'

const extractOgTags = async (document: Document, url: string) => {
  const ogTags = {
    title: '',
    description: '',
    image: '',
    html: '' as string | null
  }

  const titleTag = document.querySelector('title')
  ogTags.title = titleTag ? titleTag.textContent || '' : ''

  const descriptionTag = document.querySelector('meta[name="description"]')
  ogTags.description = descriptionTag
    ? descriptionTag.getAttribute('content') || ''
    : ''

  const imageTag = document.querySelector('meta[property="og:image"]')
  ogTags.image = imageTag ? imageTag.getAttribute('content') || '' : ''

  const iframeHTML = await constructIframe(document, url)
  ogTags.html = iframeHTML

  return ogTags
}

export default extractOgTags
