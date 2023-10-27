import useAuthPersistStore from '@lib/store/auth'
import { Avatar, Badge, Flex, Text } from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { SimpleProfile } from '@tape.xyz/lens/custom-types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import Authenticate from './Authenticate'

const Authenticated = () => {
  const {
    query: { as }
  } = useRouter()

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  ) as SimpleProfile

  if (!selectedSimpleProfile) {
    return
  }

  return (
    <div>
      <div className="rounded-small tape-border my-6 p-3">
        <Flex gap="2" align="center" justify="between">
          <Flex gap="3" align="center">
            <Avatar
              size="5"
              src={getProfilePicture(selectedSimpleProfile)}
              fallback={getProfile(selectedSimpleProfile)?.slug[0] ?? ';)'}
              alt={getProfile(selectedSimpleProfile)?.slug}
            />
            <div className="text-left">
              <Text as="p" weight="bold" size="6">
                {getProfile(selectedSimpleProfile)?.displayName}
              </Text>
              <Link href={getProfile(selectedSimpleProfile)?.link}>
                <Text as="p" size="4">
                  {getProfile(selectedSimpleProfile)?.slug} (
                  {getProfile(selectedSimpleProfile)?.id})
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
