import { getProfile, getProfilePicture } from '@dragverse/generic'
import useProfileStore from '@lib/store/profile'
import { Avatar, Badge, Flex, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Authenticate from './Authenticate'

const Authenticated = () => {
  const {
    query: { as }
  } = useRouter()

  const { activeProfile } = useProfileStore()

  if (!activeProfile) {
    return
  }

  return (
    <div>
      <div className="rounded-small tape-border my-6 p-3">
        <Flex gap="2" align="center" justify="between">
          <Flex gap="3" align="center">
            <Avatar
              size="5"
              src={getProfilePicture(activeProfile, 'AVATAR')}
              fallback={getProfile(activeProfile)?.slug[0] ?? ';)'}
              alt={getProfile(activeProfile)?.displayName}
            />
            <div className="text-left">
              <h6 className="truncate text-xl font-bold">
                {getProfile(activeProfile)?.displayName}
              </h6>
              <Link href={getProfile(activeProfile)?.link}>
                <Text as="p" size="4">
                  {getProfile(activeProfile)?.slug} (
                  {getProfile(activeProfile)?.id})
                </Text>
              </Link>
            </div>
          </Flex>
          <Badge size="1" color="green">
            Active
          </Badge>
        </Flex>
      </div>
      {as && <Authenticate />}
    </div>
  )
}

export default Authenticated
