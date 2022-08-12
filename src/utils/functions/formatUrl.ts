export const formatUrl = (url: string) =>
  url.indexOf('://') === -1 ? 'https://' + url : url
