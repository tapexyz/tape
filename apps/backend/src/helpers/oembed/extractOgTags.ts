import type { Document } from 'linkedom/types/interface/document'

import constructIframe from './constructIframe'

const extractOgTags = async (document: Document) => {
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

  const iframeHTML = await constructIframe(document)
  ogTags.html = iframeHTML

  return ogTags
}

export default extractOgTags
