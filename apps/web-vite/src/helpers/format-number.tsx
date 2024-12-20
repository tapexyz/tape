/**
 * @param bytes number of bytes
 * @returns formatted bytes (eg. 1000 bytes, 1 KB, 1 MB, 1 GB, 1 TB)
 */
export const formatBytes = (bytes: number) => {
  if (bytes && bytes > 0) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.min(
      Number.parseInt(
        Math.floor(Math.log(bytes) / Math.log(1024)).toString(),
        10
      ),
      sizes.length - 1
    );
    return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`;
  }
  return "n/a";
};
