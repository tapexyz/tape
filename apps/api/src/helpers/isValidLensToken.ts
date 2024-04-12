import { LENS_API_URL } from './constants'

const isValidLensToken = async (accessToken: string) => {
  if (!accessToken) {
    return false
  }

  try {
    const lensResponse = await fetch(LENS_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        query: `
            query Verify {
              verify(request: { accessToken: "${accessToken}" })
            }
          `
      }),
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Tape.xyz'
      }
    })
    const response: any = await lensResponse.json()

    if (response?.data.verify) {
      return true
    }

    return false
  } catch {
    return false
  }
}

export default isValidLensToken
