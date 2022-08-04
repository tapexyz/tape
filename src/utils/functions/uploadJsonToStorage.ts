import { IS_MAINNET } from '@utils/constants'

import uploadToAr from './uploadToAr'
import { uploadDataToIPFS } from './uploadToIPFS'

const uploadJsonToStorage = async (
  data: Record<string, string | object[] | null>
) => {
  const { url } = !IS_MAINNET
    ? await uploadToAr(data)
    : await uploadDataToIPFS(data)
  return url
}

export default uploadJsonToStorage
