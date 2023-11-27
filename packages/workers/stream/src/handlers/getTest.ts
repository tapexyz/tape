export default async (channelId?: string) => {
  try {
    const destinationURL =
      'https://gw.ipfs-lens.dev/ipfs/bafybeia6adey4ywft3ta5nz6nf73krvcj5reckyjvpxo6ugt6znbcuk7dy'
    const statusCode = 302
    return Response.redirect(destinationURL, statusCode)
  } catch (error) {
    throw error
  }
}
