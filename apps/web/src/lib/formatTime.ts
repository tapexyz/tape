import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import dayjsTwitter from 'dayjs-twitter'

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(dayjsTwitter)

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
  if (seconds === 'Infinity' || !seconds) {
    return null
  }
  const parsed = parseFloat(seconds)
  if (parsed < 3600) {
    return new Date(parsed * 1000)?.toISOString().slice(14, 19)
  }
  return new Date(parsed * 1000)?.toISOString().slice(11, 19)
}

export const getReadableTimeFromSeconds = (seconds: string) => {
  if (seconds === 'Infinity' || !seconds) {
    return null
  }
  const totalSeconds = parseInt(seconds, 10)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export const getRelativeTime = (timeString: string) => {
  return dayjs(new Date(timeString)).fromNow()
}

export const getShortHandTime = (timeString: string) => {
  return dayjs(new Date(timeString)).twitter()
}

export const getAddedDaysFromToday = (days: number) => {
  return dayjs().add(days, 'day').utc().format()
}

export const getUnixTimestampForDaysAgo = (days: number) => {
  return dayjs().subtract(days, 'day').unix()
}

export const getDateString = (timestamp: string) => {
  return dayjs(timestamp).format('dddd, MMMM D, YYYY h:mm A')
}
