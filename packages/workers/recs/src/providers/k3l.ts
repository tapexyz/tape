import { K3LFeedItem, K3LProfile } from '../types'

export const k3lFeed = async (
  strategy: string,
  limit: string,
  offset: string
) => {
  try {
    const response = await fetch(
      `https://lens-api.k3l.io/feed/${strategy}?limit=${limit}&offset=${offset}`,
      { headers: { 'User-Agent': 'Lenstube' } }
    )
    const json: K3LFeedItem[] = await response.json()
    return json.map((item: K3LFeedItem) => item.postId)
  } catch (error) {
    console.log(error)
    return []
  }
}

export const k3lScores = async (
  strategy: string,
  limit: string,
  offset: string
) => {
  try {
    const response = await fetch(
      `https://lens-api.k3l.io/profile/scores?strategy=${strategy}&limit=${limit}&offset=${offset}`,
      { headers: { 'User-Agent': 'Lenstube' } }
    )
    const json: K3LProfile[] = await response.json()
    return json.map((item: K3LProfile) => item.handle)
  } catch (error) {
    console.log(error)
    return []
  }
}
