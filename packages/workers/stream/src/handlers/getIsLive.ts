import { CURRENT_STREAMS } from '../helper/constants'

export default async (channelId?: string) => {
  try {
    const channelNumber = Number(channelId)
    const stream = CURRENT_STREAMS.find((c) => c.channel === channelNumber)
    if (!stream) {
      return
    }
    return new Response(
      JSON.stringify({
        isLive: stream.isLive
      })
    )
  } catch (error) {
    throw error
  }
}
