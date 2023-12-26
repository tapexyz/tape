import { del, get, set } from 'idb-keyval'
import type { StorageValue } from 'zustand/middleware'

const idbReviver = (_key: string, value: any) => {
  if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
    return new Map(value.value)
  }

  return value
}

const idbReplacer = (_key: string, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value]
    }
  }

  return value
}

const createIdbStorage = () => {
  return {
    getItem: async (name: string) =>
      JSON.parse((await get(name)) || '{}', idbReviver),
    removeItem: async (name: string) => await del(name),
    setItem: async (name: string, value: StorageValue<any>) => {
      const str = JSON.stringify({ state: { ...value.state } }, idbReplacer)
      return await set(name, str)
    }
  }
}

export default createIdbStorage
