import { ALGO_PROVIDER, AlgoType } from '@tape.xyz/lens/custom-types'

export const FEED_ALGORITHMS = [
  {
    algorithms: [
      {
        name: 'Karma Crowdsourced',
        strategy: AlgoType.K3L_CROWDSOURCED
      },
      {
        name: 'Karma Popular',
        strategy: AlgoType.K3L_POPULAR
      },
      {
        name: 'Karma Recommended',
        strategy: AlgoType.K3L_RECOMMENDED
      }
    ],
    provider: ALGO_PROVIDER.K3L
  }
]
