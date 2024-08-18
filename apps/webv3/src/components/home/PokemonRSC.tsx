// import { rqClient } from '@/app/providers/react-query'

// import { Pokemon } from './Pokemon'
// import { pokemonOptions2 } from './query'

// async function withDelay<T>(promise: Promise<T>, delay: number): Promise<T> {
//   // Ensure we throw if this throws
//   const ret = await promise
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(ret)
//     }, delay)
//   })
// }

// export const PokemonRSC = async () => {
//   await withDelay(rqClient.prefetchQuery(pokemonOptions2), 1000)

//   return (
//     <div>
//       <Pokemon item={2} />
//     </div>
//   )
// }
