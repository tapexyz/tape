import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const getSecondsFromTime = (time: string) => {
  const timeSplitted: string[] = time.split(':')
  let seconds = 0
  let minute = 1
  while (timeSplitted.length > 0) {
    seconds += minute * parseInt(timeSplitted.pop() ?? '0', 10)
    minute *= 60
  }
  return seconds
}

export const getTimeFromSeconds = (seconds: string) => {
  if (seconds === 'Infinity') {
    return null
  }
  const parsed = parseFloat(seconds)
  if (parsed < 3600) {
    return new Date(parsed * 1000)?.toISOString().slice(14, 19)
  }
  return new Date(parsed * 1000)?.toISOString().slice(11, 19)
}

export const getRelativeTime = (timeString: string) => {
  return dayjs(new Date(timeString)).fromNow()
}
