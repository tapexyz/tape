const FREE_UPLOAD_LIMIT = 500

const canUploadedToIpfs = (bytes: number | undefined) => {
  return bytes ? (bytes / 1024 ** 2 < FREE_UPLOAD_LIMIT ? true : false) : false
}

export default canUploadedToIpfs
