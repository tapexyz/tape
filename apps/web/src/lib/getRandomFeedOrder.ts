import { ExplorePublicationsOrderByType } from '@tape.xyz/lens'

export const getRandomFeedOrder = () => {
  const orders = [
    ExplorePublicationsOrderByType.TopMirrored,
    ExplorePublicationsOrderByType.TopCommented,
    ExplorePublicationsOrderByType.TopReacted,
    ExplorePublicationsOrderByType.TopQuoted,
    ExplorePublicationsOrderByType.TopCollectedOpenAction
  ]
  const randomOrder = orders[Math.floor(Math.random() * orders.length)]
  return randomOrder
}
