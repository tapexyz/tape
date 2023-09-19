import type { AnyPublication } from '@lenstube/lens'
import type { LenstubePublication } from '@lenstube/lens/custom-types'

/**
 * Returns structured publication metadata
 *
 * @param publication any publication - Post, Mirror, Comment, Quote
 * @returns An object with structued keys requried to render interface - LenstubePublication
 */
export const getPublicationMetadata = (
  publication: AnyPublication
): LenstubePublication => {
  return {}
}
