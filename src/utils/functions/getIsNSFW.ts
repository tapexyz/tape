import type { predictionType } from 'nsfwjs'

const SENSITIVE_CONTENT_LIMIT = 15
const SEXY_CONTENT_LIMIT = 90

export const getIsNSFW = (predictions: predictionType[]): boolean => {
  const nsfwPercentage =
    predictions.find((i) => i.className === 'Porn')?.probability || 0
  const hentaiPercentage =
    predictions.find((i) => i.className === 'Hentai')?.probability || 0
  const sexyPercentage =
    predictions.find((i) => i.className === 'Sexy')?.probability || 0
  const isNSFW =
    Number((nsfwPercentage * 100).toFixed(2)) > SENSITIVE_CONTENT_LIMIT ||
    Number((hentaiPercentage * 100).toFixed(2)) > SENSITIVE_CONTENT_LIMIT ||
    Number((sexyPercentage * 100).toFixed(2)) > SEXY_CONTENT_LIMIT
  return isNSFW
}
