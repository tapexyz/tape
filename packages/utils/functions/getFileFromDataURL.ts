export const getFileFromDataURL = (dataUrl: string, fileName: string) => {
  const byteString = Buffer.from(dataUrl.split(',')[1], 'base64')
  if (dataUrl.length > 0) {
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString[i]
    }
    const blob = new Blob([ab], { type: mimeString })
    return new File([blob], fileName)
  }
}
