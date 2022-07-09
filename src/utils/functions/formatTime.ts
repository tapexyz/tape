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

export const getTimeFromSeconds = (seconds: string) => {
  let parsed = parseFloat(seconds)
  if (parsed < 3600) {
    return new Date(parsed * 1000).toISOString().slice(14, 19)
  }
  return new Date(parsed * 1000).toISOString().slice(11, 19)
}
