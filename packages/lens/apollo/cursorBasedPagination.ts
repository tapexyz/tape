import type { FieldPolicy, StoreValue } from '@apollo/client/core'
import type { PaginatedResultInfo } from '@lenstube/lens'

type CursorBasedPagination<T = StoreValue> = {
  items: T[]
  pageInfo: PaginatedResultInfo
}

type SafeReadonly<T> = T extends object ? Readonly<T> : T

/**
 * @param obj Object to search for a __ref property.
 * @returns the __ref property if found, otherwise null.
 */
const getRef = (obj: any): string | null => {
  if (typeof obj === 'object' && obj !== null) {
    if ('__ref' in obj) {
      return obj['__ref']
    } else {
      for (const key in obj) {
        const ref = getRef(obj[key])
        if (ref) {
          return ref
        }
      }
    }
  }
  return null
}

function cursorBasedPagination<T extends CursorBasedPagination>(
  keyArgs: FieldPolicy['keyArgs']
): FieldPolicy<T> {
  return {
    keyArgs,

    read(existing: SafeReadonly<T> | undefined) {
      if (!existing) {
        return existing
      }
      const { items, pageInfo } = existing
      return {
        ...existing,
        items,
        pageInfo: {
          ...pageInfo
        }
      } as SafeReadonly<T>
    },

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>) {
      if (!existing) {
        return incoming
      }
      const { items: existingItems, pageInfo: existingPageInfo } = existing
      const { items: incomingItems, pageInfo: incomingPageInfo } = incoming

      const items = [...existingItems, ...incomingItems]
      const pageInfo = { ...existingPageInfo, ...incomingPageInfo }

      // remove duplicates from items
      const seen = new Set()
      const dedupedItems = items.filter((item) => {
        const ref = getRef(item)
        if (ref && seen.has(ref)) {
          return false
        }
        seen.add(ref)
        return true
      })
      return {
        ...incoming,
        items: dedupedItems,
        pageInfo
      } as SafeReadonly<T>
    }
  }
}

export default cursorBasedPagination
