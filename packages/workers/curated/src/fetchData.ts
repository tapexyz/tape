import { CATEGORIES_KEY, EnvType } from '.'

type Record = {
  fields: {
    profileId: string
    handle: string
    category: string
  }
}

 const AIRTABLE_API =
   'https://api.airtable.com/v0/appUaQQeQ2MqKQsnP/tblKmClxKJMiHvG56?pageSize=100'

 const fetchPages = async (
   url: string,
   token: string,
   allRecords: Record[] = []
 ) => {
   const response = await fetch(url, {
     headers: {
       Authorization: token
     }
   })
   const result = (await response.json()) as any
   const offset: string = result.offset
   const records: Record[] = result.records
   allRecords.push(...records)

   if (offset) {
     await fetchPages(`${AIRTABLE_API}&offset=${offset}`, token, allRecords)
   } else {
     return allRecords
   }
   return allRecords
 }

 const fetchData = async (_request: Request, env: EnvType) => {
   try {
     const AIRTABLE_AUTHORIZATION = `Bearer ${env.AIRTABLE_PAT}`

     const records: Record[] =
       (await fetchPages(AIRTABLE_API, AIRTABLE_AUTHORIZATION)) ?? []

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
