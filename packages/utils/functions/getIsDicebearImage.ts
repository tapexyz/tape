export const getIsDicebearImage = (url: string) => {
  return url && url.split('.').includes('dicebear')
}
