import type { Profile } from 'lens'
import { ProfileDocument } from 'lens'
import type { NextApiResponse } from 'next'
import { LENSTUBE_APP_DESCRIPTION } from 'utils'
import getApolloClient from 'utils/functions/getApolloClient'
import getMetaTags from 'utils/functions/getMetaTags'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getRandomProfilePicture } from 'utils/functions/getRandomProfilePicture'

const apolloClient = getApolloClient()

const getProfileMeta = async (res: NextApiResponse, handle: string) => {
  try {
    const { data } = await apolloClient.query({
      query: ProfileDocument,
      variables: { request: { handle } }
    })

    const profile: Profile = data?.profile
    const title = profile?.name ?? profile?.handle
    const description = profile?.bio || LENSTUBE_APP_DESCRIPTION
    const image = getProfilePicture(profile, 'avatar_lg')

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(
        getMetaTags({
          title,
          description: description.replaceAll('\n', ' '),
          image,
          page: 'PROFILE',
          handle
        })
      )
  } catch {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: 'Lenstube',
        description: LENSTUBE_APP_DESCRIPTION,
        image: getRandomProfilePicture('Lenstube')
      })
    )
  }
}

export default getProfileMeta
