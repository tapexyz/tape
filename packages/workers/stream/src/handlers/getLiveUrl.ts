import { CURRENT_STREAMS } from '../helper/constants'

export default async (channelId?: string) => {
  try {
    const channelNumber = Number(channelId)
    const stream = CURRENT_STREAMS.find((c) => c.channel === channelNumber)
    if (!stream) {
      return
    }
    const destinationURL = stream?.liveUrl
    const statusCode = 302
    return Response.redirect(destinationURL, statusCode)
  } catch (error) {
    throw error
  }
}
