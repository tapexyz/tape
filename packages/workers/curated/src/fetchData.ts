import { CATEGORIES_KEY, EnvType } from '.'

type Record = {
  fields: {
    profileId: string
    handle: string
    category: string
  }
}

const fetchData = async (_request: Request, env: EnvType) => {
  try {
    const AIRTABLE_AUTHORIZATION = `Bearer ${env.AIRTABLE_PAT}`
    const response = await fetch(
      'https://api.airtable.com/v0/appUaQQeQ2MqKQsnP/tblKmClxKJMiHvG56',
      {
        headers: {
          Authorization: AIRTABLE_AUTHORIZATION
        }
      }
    )
    const result = (await response.json()) as any
    const records: Record[] = result.records

    const grouped = records.reduce((data: any, item) => {
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
      const value = grouped[category]
      await env.CURATED.put(key, JSON.stringify(value))
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
