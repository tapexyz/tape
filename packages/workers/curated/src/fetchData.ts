import { CATEGORIES_KEY, EnvType } from '.'

type Record = {
  fields: {
    profileId: string
    handle: string
    category: string
  }
}

const AIRTABLE_BASE = 'appUaQQeQ2MqKQsnP'
// tblKmClxKJMiHvG56 -> prod
// tblT94C2q3uYoQjM8 -> test
const AIRTABLE_TABLE = 'tblT94C2q3uYoQjM8'
const AIRTABLE_API = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?pageSize=100`

const NEXT_FETCH_OFFSET_KEY = 'NEXT_OFFSET'
const MAX_REQUESTS_ALLOWED = 50

const fetchRecordsBatch = async (
  url: string,
  token: string,
  allRecords: Record[] = [],
  currentOffset: string | null,
  requestsMade = 1
) => {
  if (currentOffset) {
    url = `${AIRTABLE_API}&offset=${currentOffset}`
  }
  const response = await fetch(url, {
    headers: {
      Authorization: token
    }
  })
  const result = (await response.json()) as any
  const offset: string = result.offset
  const records: Record[] = result.records
  allRecords.push(...records)

  if (offset && requestsMade < MAX_REQUESTS_ALLOWED) {
    await fetchRecordsBatch(
      `${AIRTABLE_API}&offset=${offset}`,
      token,
      allRecords,
      offset,
      requestsMade + 1
    )
  } else {
    return { records: allRecords, nextOffset: offset }
  }
  return { records: allRecords, nextOffset: offset }
}

const fetchData = async (_request: Request, env: EnvType) => {
  try {
    const NEXT_OFFSET_KEY = await env.CURATED.get(NEXT_FETCH_OFFSET_KEY)
    const AIRTABLE_AUTHORIZATION = `Bearer ${env.AIRTABLE_PAT}`

    const { records, nextOffset } = await fetchRecordsBatch(
      AIRTABLE_API,
      AIRTABLE_AUTHORIZATION,
      [],
      NEXT_OFFSET_KEY
    )
    if (nextOffset) {
      await env.CURATED.put(NEXT_FETCH_OFFSET_KEY, nextOffset)
    }

    const grouped = records?.reduce((data: any, item) => {
      const key = item.fields.category
      if (!data[key]) {
        data[key] = []
      }
      data[key].push(item.fields.profileId)
      return data
    }, {})

    const categories: string[] = []
    for (const category in grouped) {
      const key = category.toLowerCase()
      const newRecords: string[] = grouped[category]
      const prev = await env.CURATED.get(key)
      let prevRecords = []
      if (prev) {
        prevRecords = JSON.parse(prev)
        prevRecords.push(...newRecords)
      } else {
        prevRecords.push(...newRecords)
      }
      const value = JSON.stringify(Array.from(new Set(prevRecords)))
      await env.CURATED.put(key, value)
      categories.push(key)
    }
    await env.CURATED.put(CATEGORIES_KEY, JSON.stringify(categories))

    return new Response(
      JSON.stringify({
        success: true
      })
    )
  } catch (error) {
    console.log('🚀 ~ file: fetchData.ts ~ fetchData ~ error:', error)
    return new Response(
      JSON.stringify({
        success: false
      })
    )
  }
}

export default fetchData
