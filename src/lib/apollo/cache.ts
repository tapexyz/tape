import { InMemoryCache } from '@apollo/client'
import result from 'src/types'

const cache = new InMemoryCache({ possibleTypes: result.possibleTypes })

export default cache
