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
    ipfsUrl: `https://ipfs.infura.io/ipfs/${Hash}`,
    hash: Hash
  }
}

const uploadImageToIPFS = async (
  files: FileList
): Promise<IPFSUploadResult> => {
  const formData = new FormData()
  formData.append('file', files[0], 'img')
  const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData
  })
  const { Hash }: { Hash: string } = await upload.json()

  return {
    ipfsUrl: `https://ipfs.infura.io/ipfs/${Hash}`,
    type: files[0].type,
    hash: Hash
  }
}

export { uploadDataToIPFS, uploadImageToIPFS }
