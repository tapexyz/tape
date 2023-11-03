export const formatMB = (sizeInMB: number) => {
  if (sizeInMB >= 1024) {
    // Convert MB to GB if size is greater than or equal to 1 GB
    const sizeInGB = sizeInMB / 1024
    return Math.floor(sizeInGB) + ' GB'
  }
  return sizeInMB + ' MB'
}
