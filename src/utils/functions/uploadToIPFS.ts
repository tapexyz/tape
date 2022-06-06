import { IPFS_GATEWAY } from '@utils/constants'
import { IPFSUploadResult } from 'src/types/local'

const uploadDataToIPFS = async (data: any) => {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData
  })
  const { Hash }: { Hash: string } = await upload.json()

  return {
    ipfsUrl: `${IPFS_GATEWAY}/${Hash}`,
    hash: Hash
  }
}

const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  const formData = new FormData()
  formData.append('file', file, 'img')
  const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData
  })
  const { Hash }: { Hash: string } = await upload.json()

  return {
    ipfsUrl: `https://ipfs.infura.io/ipfs/${Hash}`,
    type: file.type,
    hash: Hash
  }
}

export { uploadDataToIPFS, uploadImageToIPFS }
