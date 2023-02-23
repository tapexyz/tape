import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
dayjs.extend(relativeTime)
dayjs.extend(utc)

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

export const getTimeAddedOneDay = () => {
  return dayjs().add(1, 'day').utc().format()
}

export const secondsToISO = (seconds: string | undefined) => {
  const SECONDS_PER_SECOND = 1
  const SECONDS_PER_MINUTE = 60
  const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE
  const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR

  const designations = [
    ['D', SECONDS_PER_DAY],
    ['H', SECONDS_PER_HOUR],
    ['M', SECONDS_PER_MINUTE],
    ['S', SECONDS_PER_SECOND]
  ]
  let duration = 'P'
  let remainder = seconds ? Number(seconds ?? 0) : 0

  designations.forEach(([sign, seconds]) => {
    const value = Math.floor(remainder / (seconds as number))
    remainder = remainder % (seconds as number)
    if (value) {
      duration += `${value}${sign}`
    }
  })
  if (duration == 'P') {
    duration = 'P0S'
  }
  return duration // ex: P2M47S
}
