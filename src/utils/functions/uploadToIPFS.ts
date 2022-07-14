import { IPFS_GATEWAY, IPFS_HTTP_API } from '@utils/constants'
import axios from 'axios'
import { IPFSUploadResult } from 'src/types/local'

const uploadDataToIPFS = async (data: any): Promise<IPFSUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    const uploaded = await axios(IPFS_HTTP_API, {
      method: 'POST',
      data: formData
    })
    const { Hash }: { Hash: string } = await uploaded.data
    return {
      ipfsUrl: `${IPFS_GATEWAY}/${Hash}`,
      hash: Hash,
      type: 'application/json'
    }
  } catch (error) {
    console.log(error)
    return {
      ipfsUrl: '',
      hash: '',
      type: 'application/json'
    }
  }
}

const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('file', file, 'img')
    const uploaded = await axios(IPFS_HTTP_API, {
      method: 'POST',
      data: formData
    })
    const { Hash }: { Hash: string } = await uploaded.data

    return {
      ipfsUrl: `https://ipfs.infura.io/ipfs/${Hash}`,
      type: file.type || 'image/jpeg',
      hash: Hash
    }
  } catch (error) {
    console.log(error)
    return {
      ipfsUrl: '',
      hash: '',
      type: file.type
    }
  }
}

export { uploadDataToIPFS, uploadImageToIPFS }
