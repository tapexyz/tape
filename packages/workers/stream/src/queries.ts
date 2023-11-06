export const UNLONELY_LIVE_FEED = `query GetUnlonelyFeed {
  getChannelFeed(data: {limit:5,orderBy: createdAt}) {
    name
    description
    playbackUrl
    thumbnailUrl
    id
    slug
    isLive
    owner {
      isLensUser
      lensHandle
      lensImageUrl
      address
    }
    updatedAt
  }
}`

export const UNLONELY_LIVE_DETAIL = `query GetChannelBySlug($slug: String!) {
  getChannelBySlug(slug: $slug) {
     name
    description
    playbackUrl
    thumbnailUrl
    id
    slug
    isLive
    owner {
      isLensUser
      lensHandle
      lensImageUrl
      address
    }
    updatedAt
  }
}`
