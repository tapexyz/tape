'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.UNLONELY_LIVE_DETAIL = exports.UNLONELY_LIVE_FEED = void 0
exports.UNLONELY_LIVE_FEED =
  'query GetUnlonelyFeed {\n  getChannelFeed(data: {limit:5,orderBy: createdAt}) {\n    name\n    description\n    playbackUrl\n    thumbnailUrl\n    id\n    slug\n    isLive\n    owner {\n      isLensUser\n      lensHandle\n      lensImageUrl\n      address\n    }\n    updatedAt\n  }\n}'
exports.UNLONELY_LIVE_DETAIL =
  'query GetChannelBySlug($slug: String!) {\n  getChannelBySlug(slug: $slug) {\n     name\n    description\n    playbackUrl\n    thumbnailUrl\n    id\n    slug\n    isLive\n    owner {\n      isLensUser\n      lensHandle\n      lensImageUrl\n      address\n    }\n    updatedAt\n  }\n}'
