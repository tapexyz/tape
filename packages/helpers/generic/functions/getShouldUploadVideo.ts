import type { PrimaryPublication, VideoMetadataV3 } from '@tape.xyz/lens'

export const getShouldUploadVideo = (video: PrimaryPublication): boolean => {
  const metadata = video.metadata as VideoMetadataV3
  // check if video is older than 1 day and not optimized
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24
  const oneDayAgo = new Date(now.getTime() - oneDay)
  const createdAt = new Date(video.createdAt)

  const uri = metadata.asset.video.optimized?.uri ?? ''

  if (createdAt < oneDayAgo && (!Boolean(uri) || !uri.includes('.m3u8'))) {
    return true
  }
  return false
}
