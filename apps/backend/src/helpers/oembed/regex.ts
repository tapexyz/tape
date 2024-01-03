export const COMMON_REGEX = {
  TAPE_WATCH:
    /^https?:\/\/tape\.xyz\/watch\/([\dA-Za-z-]+)(\?si=[\dA-Za-z]+)?$/,
  YOUTUBE_WATCH:
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+(?:\?.*)?$/,
  VIMEO_WATCH:
    /^https?:\/\/(?:www\.|player\.)?vimeo\.com\/(?:video\/)?[\d]+(?:\?.*)?$/
}
