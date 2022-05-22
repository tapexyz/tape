import { WebBundlr } from "@bundlr-network/client";

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
  uploading: boolean;
};
