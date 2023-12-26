export const COMMON_REGEX = {
  HANDLE: /^[\da-z]+$/g,
  MENTION_MATCHER_REGEX: /(@[a-zA-Z0-9-_.]+(?:\/[a-zA-Z0-9-_.]+)?)/,
  TAPE_WATCH:
    /^https?:\/\/tape\.xyz\/watch\/([\dA-Za-z-]+)(\?si=[\dA-Za-z]+)?$/,
  URL: /\b(http|https):\/\/([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+))([\p{L}\p{N}_.,@?^=%&:\/~+#-]*[\p{L}\p{N}_@?^=%&\/~+#-])/gu,
  VIMEO_WATCH: /^https?:\/\/(?:www\.)?vimeo\.com\/[\d]+(?:\?.*)?$/,
  YOUTUBE_WATCH:
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+(?:\?.*)?$/,
  ZORA: /https:\/\/(?:testnet\.)?zora\.co\/collect\/(eth|oeth|base|zora|gor|ogor|basegor|zgor):(0x[\dA-Fa-f]{40})((?:\/(\d+))?|$)/
}
