const NOTION_API_KEY = 'your_notion_api_key'
const NOTION_DATABASE_ID = 'your_notion_database_id'
const MAX_REQUESTS_ALLOWED = 50

interface NotionRecord {
  id: string
  // Add other properties as needed
}

const fetchBatch = async (
  startCursor: string | null
): Promise<string | null> => {
  const url = new URL(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`
  )

  if (startCursor) {
    url.searchParams.set('start_cursor', startCursor)
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      page_size: 100
    })
  })

  const data = (await response.json()) as any
  const records: NotionRecord[] = data.results

  // Store the records in Cloudflare KV (replace with your Cloudflare KV storage code)
  for (const record of records) {
    console.log('Storing record:', record.id)
  }

  return data.next_cursor
}

const handleScheduled = async () => {
  let startCursor: string | null = null
  let requests: Promise<string | null>[] = []

  for (let i = 0; i < MAX_REQUESTS_ALLOWED; i++) {
    requests.push(fetchBatch(startCursor))
  }

  const cursors = await Promise.all(requests)
  const nextStartCursor = cursors.find((cursor) => cursor !== null)

  if (nextStartCursor) {
    // Schedule another fetchData() call or handle the next batch of data
    console.log('Next start_cursor:', nextStartCursor)
  }
}

export default handleScheduled
