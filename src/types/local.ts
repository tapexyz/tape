import { WebBundlr } from "@bundlr-network/client";

import { Comment, Post } from ".";

export type VideoDraft = {
  preview: string;
  title: string;
  description: string;
};
export type BundlrDataState = {
  instance: WebBundlr | null;
  balance: string;
  estimatedPrice: string;
  deposit: number | null;
  depositing: boolean;
  showDeposit: boolean;
};

export type VideoUpload = {
  buffer: Buffer | null;
  preview: string;
};

export type LenstubePublication = Post & Comment & { pubId: string };

export type IPFSUploadResult = {
  hash: string;
  ipfsUrl: string;
  type: string;
};

export type BundlrResult = {
  id: string;
};

export type VideoUploadForm = {
  videoThumbnail: IPFSUploadResult | null;
  videoSource: BundlrResult | null;
  title: string;
  description: string;
};
