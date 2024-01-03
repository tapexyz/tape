import type { IRequest } from 'itty-router'
import { error } from 'itty-router'

import { k3lFeed, k3lScores } from './k3l'

const getListByAlgorithm = async (request: IRequest) => {
  const { provider, strategy, limit, offset } = request.params
  const exclude = request.query.exclude as string

  if (!provider || !strategy) {
    return error(400, 'Bad request!')
  }

  try {
    let items: string[] = []
    switch (provider) {
      case 'k3l-score':
        items = await k3lScores(strategy, limit, offset)
        break
      case 'k3l-feed':
        items = await k3lFeed(strategy, limit, offset, exclude)
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

export default getListByAlgorithm
