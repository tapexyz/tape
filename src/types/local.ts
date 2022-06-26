import { WebBundlr } from '@bundlr-network/client'

import { Comment, Mirror, Post } from '.'

export type VideoDraft = {
  preview: string
  title: string
  description: string
}
export type BundlrDataState = {
  instance: WebBundlr | null
  balance: string
  estimatedPrice: string
  deposit: string | null
  depositing: boolean
  showDeposit: boolean
}

export type UploadedVideo = {
  buffer: Buffer | null
  preview: string
  videoType: string
  file: File | null
  title: string
  description: string
  thumbnail: string
  isAdultContent: boolean
}

export type LenstubePublication = Post &
  Comment &
  Mirror & { pubId: string } & { hls: HLSData }

export type IPFSUploadResult = {
  hash: string
  ipfsUrl: string
  type: string
}

export type HLSData = {
  hrn: string
  url: string
  type: string
}

export type VideoUploadForm = {
  videoThumbnail: IPFSUploadResult | null
  videoSource: string | null
  playbackId: string | null
  title: string
  description: string
  adultContent: boolean
}
