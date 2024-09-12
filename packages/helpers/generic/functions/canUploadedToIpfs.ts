import { IPFS_FREE_UPLOAD_LIMIT } from "@tape.xyz/constants";
import type { Profile } from "@tape.xyz/lens";

export const canUploadedToIpfs = (
  bytes: number,
  activeProfile: Profile | null,
) => {
  if (!activeProfile || bytes === null || bytes === undefined) {
    return false;
  }

  // Calculate the size of the file in megabytes
  const megaBytes = bytes / 1024 ** 2;

  // Check if the file size is within the allowed limit
  return megaBytes < IPFS_FREE_UPLOAD_LIMIT;
};
