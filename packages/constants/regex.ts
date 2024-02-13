export const COMMON_REGEX = {
  ZORA: /https:\/\/(?:testnet\.)?zora\.co\/collect\/(eth|oeth|base|zora|gor|ogor|basegor|zgor):(0x[\dA-Fa-f]{40})((?:\/(\d+))?|$)/,
  URL: /\b(http|https):\/\/([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+))([\p{L}\p{N}_.,@?^=%&:\/~+#-]*[\p{L}\p{N}_@?^=%&\/~+#-])/gu,
  MENTION_MATCHER_REGEX: /(@[a-zA-Z0-9-_.]+(?:\/[a-zA-Z0-9-_.]+)?)/,
  HANDLE: /^[\dA-Za-z]\w{4,25}$/g,
  TAPE_WATCH:
    /^https?:\/\/tape\.xyz\/watch\/([\dA-Za-z-]+)(\?si=[\dA-Za-z]+)?$/,
  YOUTUBE_WATCH:
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+(?:\?.*)?$/,
  VIMEO_WATCH: /^https?:\/\/(?:www\.)?vimeo\.com\/[\d]+(?:\?.*)?$/
}
