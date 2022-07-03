import MetaTags from '@components/Common/MetaTags'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import dynamic from 'next/dynamic'
import { Profile } from 'src/types'

const Activities = dynamic(() => import('./Activities'))
const BasicInfo = dynamic(() => import('./BasicInfo'))

const Channel = ({ channel }: { channel: Profile }) => {
  return (
    <>
      <MetaTags
        title={channel?.handle}
        description={channel.bio || 'Lenstube channel'}
        image={imageCdn(getProfilePicture(channel))}
      />
      <BasicInfo channel={channel} />
      <Activities channel={channel} />
    </>
  )
}

export default Channel
