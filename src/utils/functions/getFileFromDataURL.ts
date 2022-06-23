export const getFileFromDataURL = async (dataUrl: string, fileName: string) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataUrl.split(',')[1])
  // separate out the mime component
  var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length)
  // create a view into the buffer
  var ia = new Uint8Array(ab)
  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString })
  const file = new File([blob], fileName)
  return file
}
