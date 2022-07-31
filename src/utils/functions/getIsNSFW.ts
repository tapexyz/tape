import logger from '@lib/logger'
import type { predictionType } from 'nsfwjs'

const SENSITIVE_CONTENT_LIMIT = 20
const SEXY_CONTENT_LIMIT = 90

export const getIsNSFW = (predictions: predictionType[]): boolean => {
  const porn = predictions.find((i) => i.className === 'Porn')?.probability || 0
  const hentai =
    predictions.find((i) => i.className === 'Hentai')?.probability || 0
  const sexy = predictions.find((i) => i.className === 'Sexy')?.probability || 0
  const isNSFW =
    Number((porn * 100).toFixed(2)) > SENSITIVE_CONTENT_LIMIT ||
    Number((hentai * 100).toFixed(2)) > SENSITIVE_CONTENT_LIMIT ||
    Number((sexy * 100).toFixed(2)) > SEXY_CONTENT_LIMIT

  if (isNSFW)
    logger.error('[Error NSFW Detected]', {
      porn: Number((porn * 100).toFixed(2)),
      sexy: Number((sexy * 100).toFixed(2)),
      hentai: Number((hentai * 100).toFixed(2))
    })

  return isNSFW
}
