import { WebBundlr } from '@bundlr-network/client'

import { Comment, Post } from '.'

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

export type VideoUpload = {
  buffer: Buffer | null
  preview: string
  videoType: string
  file: File | null
}

export type LenstubePublication = Post & Comment & { pubId: string }

export type IPFSUploadResult = {
  hash: string
  ipfsUrl: string
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

export type BasicInfoSettings = {
  about: string
  website: string
  twitter: string
  cover: string
}
