import { Profile } from 'src/types'

type Props = {
  channel: Profile
}
const Permissions = ({ channel }: Props) => {
  return (
    <div className="p-3 bg-white rounded-md dark:bg-black">
      <h1>WIP - {channel.handle}</h1>
    </div>
  )
}

export default Permissions
