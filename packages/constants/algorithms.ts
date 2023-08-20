import { ALGO_PROVIDER, AlgoType } from '@lenstube/lens/custom-types'

export const FEED_ALGORITHMS = [
  {
    provider: ALGO_PROVIDER.K3L,
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
    ]
  }
]
