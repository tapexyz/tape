export default async () => {
  try {
    const items = [
      {
        title: 'Rad',
        content: 'Rad is a live stream of curated content from the internet.',
        posterUrl:
          'https://gw.ipfs-lens.dev/ipfs/bafybeigjzxth756zl32nfrb3nbjyqeb2tne2hdqj5aqhjz3l47o2zzivhu',
        playbackUrl:
          'https://gw.ipfs-lens.dev/ipfs/bafybeiem5h5h2fj56ip7qbbmbay5qqiqp7qd6av6jpex2gc3jxu6ai4yv4',
        liveUrl:
          'https://gw.ipfs-lens.dev/ipfs/bafybeiem5h5h2fj56ip7qbbmbay5qqiqp7qd6av6jpex2gc3jxu6ai4yv4',
        uid: '23de4f5a-5c0a-4c0a-8b0a-5c0a4c0a8b0a',
        pid: '0x2d-0xee',
        streamer: 'lens/streameth',
        channel: 1
      }
    ]
    const response = new Response(JSON.stringify({ success: true, items }))

    response.headers.set('Cache-Control', 'max-age=1000')
    response.headers.set('Content-Type', 'application/json')

    return response
  } catch (error) {
    throw error
  }
}
