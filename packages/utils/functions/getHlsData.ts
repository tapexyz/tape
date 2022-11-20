import axios from 'axios'

import sanitizeLvprUrl from './sanitizeLvprUrl'

type HLSData = {
  hrn: string
  url: string
  type: string
}

const getHlsData = async (playbackId: string) => {
  try {
    const { data } = await axios.get(
      `https://livepeer.studio/api/playback/${playbackId}`
    )
    const hlsInfo: HLSData = data.meta?.source[0]
    return { ...hlsInfo, url: sanitizeLvprUrl(hlsInfo.url) }
  } catch (error) {
    return null
  }
}

export default getHlsData
