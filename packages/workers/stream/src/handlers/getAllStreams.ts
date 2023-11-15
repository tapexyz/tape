import { CURRENT_STREAMS } from '../helper/constants'

export default async () => {
  try {
    const items = CURRENT_STREAMS
    const response = new Response(JSON.stringify({ success: true, items }))

    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
