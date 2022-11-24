import getProfileMeta from 'lib/getProfileMeta'
import getPublicationMeta from 'lib/getPublicationMeta'
import type { NextApiRequest, NextApiResponse } from 'next'
import { LENSTUBE_APP_DESCRIPTION } from 'utils'
import getMetaTags from 'utils/functions/getMetaTags'
import { getRandomProfilePicture } from 'utils/functions/getRandomProfilePicture'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Invalid method' })
  }

  const uri = req.query.uri as string

  if (!uri) {
    return res.status(400).json({ success: false, message: 'Invalid URI' })
  }

  const isChannel = uri.includes('/channel/')
  const isVideo = uri.includes('/watch/')

  try {
    if (isChannel) {
      const handle = uri.replace('/channel/', '')
      return getProfileMeta(res, handle)
    }

    if (isVideo) {
      const pubId = uri.replace('/watch/', '')
      return getPublicationMeta(res, pubId)
    }

    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Lenstube',
        description: LENSTUBE_APP_DESCRIPTION,
        image: getRandomProfilePicture('Lenstube')
      })
    )
  } catch (error) {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Lenstube',
        description: LENSTUBE_APP_DESCRIPTION,
        image: getRandomProfilePicture('Lenstube')
      })
    )
  }
}

export default handler
