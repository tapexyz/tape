export const getFileFromDataURL = (dataUrl: string, fileName: string) => {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataUrl.split(',')[1])
  // separate out the mime component
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  // create a view into the buffer
  const ia = new Uint8Array(ab)
  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString })
  const file = new File([blob], fileName)
  return file
}
