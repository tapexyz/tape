import type { PrimaryPublication, VideoMetadataV3 } from '@tape.xyz/lens'

export const getShouldUploadVideo = (video: PrimaryPublication): boolean => {
  const metadata = video.metadata as VideoMetadataV3
  // check if video is older than 1 week
  const now = new Date()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  const oneWeekAgo = new Date(now.getTime() - oneWeek)
  const createdAt = new Date(video.createdAt)
  if (createdAt > oneWeekAgo && !Boolean(metadata.asset.video.optimized?.uri)) {
    return true
  }
  return false
}
