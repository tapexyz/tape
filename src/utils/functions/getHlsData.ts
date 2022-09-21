import axios from 'axios'

const getHlsData = async (playbackId: string) => {
  try {
    const { data } = await axios.get(
      `https://livepeer.studio/api/playback/${playbackId}`
    )
    return data.meta?.source[0]
  } catch (error) {
    return null
  }
}

export default getHlsData
