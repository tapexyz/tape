import { CURRENT_STREAMS } from '../helper/constants'

export default async (channelId?: string) => {
  try {
    const channelNumber = Number(channelId)
    const stream = CURRENT_STREAMS.find((c) => c.channel === channelNumber)
    if (!stream) {
      return
    }
    const destinationURL = stream.posterUrl
    const statusCode = 301
    return Response.redirect(destinationURL, statusCode)
  } catch (error) {
    throw error
  }
}
