const getSourceBuffer = (): typeof self.SourceBuffer => {
  return self.SourceBuffer || (self as any).WebKitSourceBuffer
}
const getMediaSource = (): typeof MediaSource | undefined => {
  return self.MediaSource || ((self as any).WebKitMediaSource as MediaSource)
}

export const getIsHlsSupported = (mimeType: string): boolean => {
  const mediaSource = getMediaSource()
  if (!mediaSource) {
    return false
  }
  const sourceBuffer = getSourceBuffer()
  const isTypeSupported =
    mediaSource &&
    typeof mediaSource.isTypeSupported === 'function' &&
    mediaSource.isTypeSupported(mimeType)

  // if SourceBuffer is exposed ensure its API is valid
  // safari and old version of Chrome doe not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
  const sourceBufferValidAPI =
    !sourceBuffer ||
    (sourceBuffer.prototype &&
      typeof sourceBuffer.prototype.appendBuffer === 'function' &&
      typeof sourceBuffer.prototype.remove === 'function')
  return !!isTypeSupported && !!sourceBufferValidAPI
}
