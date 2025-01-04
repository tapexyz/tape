import type {
  AccountMetadata,
  AppMetadata,
  AudioMetadata,
  VideoMetadata
} from "@lens-protocol/metadata";
import { LENS_STORAGE_NODE_URL } from "@tape.xyz/constants";

type Result = {
  gateway_url: string;
  storage_key: string;
  uri: string;
};

export const uploadJson = async (
  metadata: AppMetadata | AccountMetadata | VideoMetadata | AudioMetadata
): Promise<Result> => {
  const response = await fetch(LENS_STORAGE_NODE_URL, {
    method: "POST",
    body: JSON.stringify(metadata)
  });
  const data = await response.json();
  return data[0] as Result;
};

export const uploadMedia = async (file: File): Promise<Result> => {
  const response = await fetch(LENS_STORAGE_NODE_URL, {
    method: "POST",
    body: file
  });
  const data = await response.json();
  return data[0] as Result;
};
