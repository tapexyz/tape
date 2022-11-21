export const getShowFullScreen = (pathname: string) => {
  return pathname === '/bytes' || pathname === '/bytes/[id]'
}
