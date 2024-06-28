import type { PrimaryPublication, VideoMetadataV3 } from '@tape.xyz/lens'

export const getShouldUploadVideo = (video: PrimaryPublication): boolean => {
  const metadata = video.metadata as VideoMetadataV3
  // Define the time threshold for video optimization (4 hours ago)
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000)
  const createdAt = new Date(video.createdAt)

  // Check if the video's URI is not optimized (not ending with .m3u8)
  const isNotOptimized = !metadata.asset.video.optimized?.uri?.endsWith('.m3u8')

  // Return true if the video is older than 4 hours and not optimized
  return createdAt < fourHoursAgo && isNotOptimized
}
