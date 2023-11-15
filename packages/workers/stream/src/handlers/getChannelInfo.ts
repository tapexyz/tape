import { CURRENT_STREAMS } from '../helper/constants'

export default async (channelId?: string) => {
  try {
    const channelNumber = Number(channelId)
    const item = CURRENT_STREAMS.find((c) => c.channel === channelNumber)
    const response = new Response(
      JSON.stringify({
        success: true,
        item
      })
    )

    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
