import { IPFS_GATEWAY } from '@utils/constants'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'

const uploadDataToIPFS = async (data: any) => {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  const uploaded = await axios('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    data: formData
  })
  const { Hash }: { Hash: string } = await uploaded.data

  return {
    ipfsUrl: `${IPFS_GATEWAY}/${Hash}`,
    hash: Hash
  }
}

const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  const formData = new FormData()
  formData.append('file', file, 'img')
  const uploaded = await axios('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    data: formData
  })
  const { Hash }: { Hash: string } = await uploaded.data

  return {
    ipfsUrl: `https://ipfs.infura.io/ipfs/${Hash}`,
    type: file.type || 'image/jpeg',
    hash: Hash
  }
}

export { uploadDataToIPFS, uploadImageToIPFS }
