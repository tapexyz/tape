import { K3LFeedItem, K3LProfile } from '../types'

export const k3lFeed = async (
  strategy: string,
  limit: string = '50',
  offset: string = '0',
  exclude?: string
) => {
  try {
    const response = await fetch(
      `https://lens-api.k3l.io/feed/${strategy}?limit=${limit}&offset=${offset}&contentFocus=AUDIO&contentFocus=VIDEO`,
      { headers: { 'User-Agent': 'Lenstube' } }
    )
    const json: K3LFeedItem[] = await response.json()
    const ids = json.map((item: K3LFeedItem) => item.postId)
    return ids.filter((el) => el !== exclude)
  } catch (error) {
    console.log(error)
    return []
  }
}

export const k3lScores = async (
  strategy: string,
  limit: string = '49',
  offset: string = '0'
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
