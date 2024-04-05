const createArrayBufferFromFile = async (file: File): Promise<Uint8Array> => {
  const fileReader = new FileReader()
  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort()
      reject(new DOMException('Error parsing input file.'))
    }
    fileReader.onload = () => {
      resolve(fileReader.result as Uint8Array)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

export default createArrayBufferFromFile
