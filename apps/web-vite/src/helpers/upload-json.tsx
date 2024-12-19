import type { AccountMetadata, AppMetadata } from "@lens-protocol/metadata";

const STORAGE_API_URL = "https://storage-api.testnet.lens.dev";

type Result = {
  gateway_url: string;
  storage_key: string;
  uri: string;
};

export const uploadJson = async (
  metadata: AppMetadata | AccountMetadata
): Promise<Result> => {
  const response = await fetch(STORAGE_API_URL, {
    method: "POST",
    body: JSON.stringify(metadata)
  });
  const data = await response.json();
  return data[0] as Result;
};
