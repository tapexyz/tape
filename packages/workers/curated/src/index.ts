type EnvType = {
  AIRTABLE_PAT: string
  curated_channels: KVNamespace
}

type Record = {
  fields: {
    profileId: string
    handle: string
    category: string
  }
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}

async function handleRequest(_request: Request, env: EnvType) {
  try {
    const AIRTABLE_AUTHORIZATION = `Bearer ${env.AIRTABLE_PAT}`
    const response = await fetch(
      'https://api.airtable.com/v0/appUaQQeQ2MqKQsnP/tblKmClxKJMiHvG56?fields[]=profileId',
      {
        headers: {
          Authorization: AIRTABLE_AUTHORIZATION
        }
      }
    )
    const result = (await response.json()) as any
    const records: Record[] = result.data

    const grouped = records.reduce((data: any, item) => {
      const key = item.fields.category
      if (!data[key]) {
        data[key] = []
      }
      data[key].push(item.fields.profileId)
      return data
    }, {})

    for (const category in grouped) {
      if (Object.hasOwnProperty.call(grouped, category)) {
        const key = category
        const value = grouped[category]
        await env.curated_channels.put(key, value)
      }
    }
    return new Response(
      JSON.stringify({
        success: true
      })
    )
  } catch {
    return new Response(
      JSON.stringify({
        success: false
      })
    )
  }
}

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env)
  }
}
