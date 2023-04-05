import { expect, test } from '@playwright/test'
import formatBytes from 'utils/functions/formatBytes'

test('Format bytes', async () => {
  const result = formatBytes(1024)
  expect(result).toBe('1 KB')
})

test('Format bytes: zero bytes', async () => {
  const result = formatBytes(0)
  expect(result).toBe('n/a')
})

test('Format bytes: MB', async () => {
  const result = formatBytes(1048576)
  expect(result).toBe('1 MB')
})

test('Format bytes: GB', async () => {
  const result = formatBytes(1073741824)
  expect(result).toBe('1 GB')
})

test('Format bytes: TB', async () => {
  const result = formatBytes(1099511627776)
  expect(result).toBe('1 TB')
})
