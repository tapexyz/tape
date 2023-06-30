import { parseJwt } from '@lenstube/generic'
import { expect, test } from '@playwright/test'

test('parseJwt', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU'
  const expectedReturn = { exp: 1645106031 }
  const actualReturn = parseJwt(token)
  expect(actualReturn).toMatchObject(expectedReturn)
})

test('parse invalid jwt', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  const expectedReturn = { exp: 0 }
  const actualReturn = parseJwt(token)
  expect(actualReturn).toMatchObject(expectedReturn)
})
