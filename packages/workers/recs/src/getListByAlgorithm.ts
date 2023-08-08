import { error } from 'itty-router'
import { k3lScores } from './providers/k3l'

export default async (
  provider: string,
  strategy: string,
  limit: string,
  offset = '0'
) => {
  if (!provider || !strategy) {
    return error(400, 'Bad request!')
  }

  try {
    let items: string[] = []
    switch (provider) {
      case 'k3l-score':
        items = await k3lScores(strategy, limit, offset)
        break
      default:
        error(400, 'Bad request!')
    }

    let response = new Response(JSON.stringify({ success: true, items }))

    response.headers.set('Cache-Control', 'max-age=1000')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
