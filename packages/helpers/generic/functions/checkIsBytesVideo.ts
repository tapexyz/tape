export const checkIsBytesVideo = (durationInSeconds: number) => {
  const durationInMinutes = durationInSeconds / 60
  if (durationInMinutes < 2) {
    return true
  }
  return false
}
