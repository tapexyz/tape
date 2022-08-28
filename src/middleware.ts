import { LENSTUBE_EMBED_URL } from '@utils/constants'
import { NextRequest, NextResponse } from 'next/server'
import { userAgent } from 'next/server'

export const middleware = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname
  const splitted = pathname.split('/')
  const pubId = splitted[splitted.length - 1]
  const { os } = userAgent(request)
  const url = `${LENSTUBE_EMBED_URL}/${pubId}`
  if (!os.name) {
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: '/watch/:path*'
}
