/**
 * @param bytes number of bytes
 * @returns formatted bytes (eg. 1000 bytes, 1 KB, 1 MB, 1 GB, 1 TB)
 */
export const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return "0 bytes";
  if (bytes < 1_000) {
    return `${bytes} bytes`;
  }

  const mb = bytes / 1_000_000;
  if (mb < 1) {
    const kb = bytes / 1_000;
    return `${kb.toFixed(2)} KB`;
  }

  const gb = mb / 1_000;
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  }

  return `${mb.toFixed(2)} MB`;
};
