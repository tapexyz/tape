import cookie from 'cookie-cutter'

export const setCookie = (key: string, value: string) => {
  cookie.set(key, value, {
    secure: true
  })
}
