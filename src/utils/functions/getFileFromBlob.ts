export const getFileFromBlob = (theBlob: Blob, fileName: string): File => {
  return new File(
    [theBlob as any], // cast as any
    fileName,
    {
      lastModified: new Date().getTime(),
      type: theBlob.type
    }
  )
}
