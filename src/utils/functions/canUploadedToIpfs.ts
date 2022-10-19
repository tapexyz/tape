export const FREE_UPLOAD_LIMIT = 100

const canUploadedToIpfs = (bytes: number | undefined) => {
  return bytes ? (bytes / 1024 ** 2 < FREE_UPLOAD_LIMIT ? true : false) : false
}

export default canUploadedToIpfs
