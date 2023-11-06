export default async (channelId?: string) => {
  try {
    return new Response(JSON.stringify({ isLive: true }))
  } catch (error) {
    throw error
  }
}
