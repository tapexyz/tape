import { omitKey } from './omitKey'

interface TypedData {
  domain: Record<string, any>
  types: Record<string, any>
  value: Record<string, any>
}

/**
 * Splits the given typed data into three parts, omitting the "__typename" property from each part.
 *
 * @param typedData The typed data to split.
 * @returns An object containing the three parts of the typed data.
 */
export const getSignature = (
  typedData: TypedData
): {
  domain: Record<string, any>
  message: Record<string, any>
  primaryType: string
  types: Record<string, any>
} => {
  const { domain, types, value } = typedData

  return {
    domain: omitKey(domain, '__typename'),
    message: omitKey(value, '__typename'),
    primaryType: Object.keys(omitKey(types, '__typename'))[0],
    types: omitKey(types, '__typename')
  }
}
