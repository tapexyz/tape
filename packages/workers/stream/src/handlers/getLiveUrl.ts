export default async (channelId?: string) => {
  try {
    const destinationURL =
      'https://gw.ipfs-lens.dev/ipfs/bafybeiem5h5h2fj56ip7qbbmbay5qqiqp7qd6av6jpex2gc3jxu6ai4yv4'
    const statusCode = 302
    return Response.redirect(destinationURL, statusCode)
  } catch (error) {
    throw error
  }
}
