export const getSecondsFromTime = (time: string) => {
  let p: string[] = time.split(':'),
    seconds = 0,
    m = 1
  while (p.length > 0) {
    seconds += m * parseInt(p.pop() ?? '0', 10)
    m *= 60
  }
  return seconds
}
