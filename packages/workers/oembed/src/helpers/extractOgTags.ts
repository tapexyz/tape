import { COMMON_REGEX } from './constants'
import constructIframe from './constructIframe'
import { Document } from 'linkedom'

const extractOgTags = async (document: Document, url: string) => {
  const ogTags = {
    title: '',
    description: '',
    html: '' as string | null
  }

  const titleTag = document.querySelector('title')
  ogTags.title = titleTag ? titleTag.textContent || '' : ''

  const descriptionTag = document.querySelector('meta[name="description"]')
  ogTags.description = descriptionTag
    ? descriptionTag.getAttribute('content') || ''
    : ''

  const iframeHTML = await constructIframe(document, url)
  ogTags.html = iframeHTML

  return ogTags
}

export default extractOgTags
