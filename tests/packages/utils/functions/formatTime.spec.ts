import { expect, test } from '@playwright/test'
import dayjs from 'dayjs'
import {
  getRelativeTime,
  getSecondsFromTime,
  getTimeFromSeconds,
  secondsToISO
} from 'utils/functions/formatTime'

test('getSecondsFromTime should return the given time in seconds', async ({}) => {
  const time = '2:30'
  const seconds = getSecondsFromTime(time)

  expect(seconds).toBe(150)
})

test('returns null for Infinity', () => {
  expect(getTimeFromSeconds('Infinity')).toBeNull()
})

test('returns ISO string for seconds less than 3600', () => {
  expect(getTimeFromSeconds('120')).toEqual('02:00')
})

test('returns ISO string for seconds more than 3600', () => {
  expect(getTimeFromSeconds('3600')).toEqual('01:00:00')
})

test('getRelativeTime should return time relative to now', () => {
  const timeString = '2020-07-07T16:00:00'
  const expectedResult = dayjs(new Date(timeString)).fromNow()

  expect(getRelativeTime(timeString)).toBe(expectedResult)
})

test('getTimeAddedOneDay', async () => {
  const getTimeAddedOneDay = () => {
    return dayjs().add(1, 'day').utc().format()
  }

  const expectedTime = dayjs().add(1, 'day').utc().format()
  const result = getTimeAddedOneDay()

  expect(result).toEqual(expectedTime)
})

test('Converts seconds to ISO format (1 day)', () => {
  const seconds = '86400'
  const expectedResult = 'P1D'
  const result = secondsToISO(seconds)
  expect(result).toEqual(expectedResult)
})

test('Converts seconds to ISO format (1 hour)', () => {
  const seconds = '3600'
  const expectedResult = 'P1H'
  const result = secondsToISO(seconds)
  expect(result).toEqual(expectedResult)
})

test('Converts seconds to ISO format (1 minute)', () => {
  const seconds = '60'
  const expectedResult = 'P1M'
  const result = secondsToISO(seconds)
  expect(result).toEqual(expectedResult)
})

test('Converts seconds to ISO format (1 second)', () => {
  const seconds = '1'
  const expectedResult = 'P1S'
  const result = secondsToISO(seconds)
  expect(result).toEqual(expectedResult)
})

test('Converts seconds to ISO format (mixed values)', () => {
  const seconds = '93784'
  const expectedResult = 'P1D2H3M4S'
  const result = secondsToISO(seconds)
  expect(result).toEqual(expectedResult)
})

test('Returns P0S when input is undefined', () => {
  const seconds = undefined
  const expectedResult = 'P0S'
  const result = secondsToISO(seconds)
  expect(result).toEqual(expectedResult)
})
