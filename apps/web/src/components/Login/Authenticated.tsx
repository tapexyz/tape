import useProfileStore from '@lib/store/idb/profile'
import { Avatar, Badge, Flex, Text } from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

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
        <Flex align="center" gap="2" justify="between">
          <Flex align="center" gap="3">
            <Avatar
              alt={getProfile(activeProfile)?.displayName}
              fallback={getProfile(activeProfile)?.slug[0] ?? ';)'}
              size="5"
              src={getProfilePicture(activeProfile, 'AVATAR')}
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
          <Badge color="green" size="1">
            Active
          </Badge>
        </Flex>
      </div>
      {as && <Authenticate />}
    </div>
  )
}

export default Authenticated
