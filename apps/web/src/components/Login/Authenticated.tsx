import useAuthPersistStore, { signOut } from '@lib/store/auth'
import { Avatar, Button, Flex, Text } from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import Link from 'next/link'
import React from 'react'
import toast from 'react-hot-toast'
import { useDisconnect } from 'wagmi'

const Authenticated = () => {
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  if (!selectedSimpleProfile) {
    return
  }

  return (
    <Flex className="py-10" direction="column" align="center">
      <Avatar
        size="7"
        src={getProfilePicture(selectedSimpleProfile as Profile)}
        fallback={getProfile(selectedSimpleProfile as Profile)?.slug[0] ?? ''}
        alt={getProfile(selectedSimpleProfile as Profile)?.slug}
      />
      <Text as="p" weight="bold">
        {getProfile(selectedSimpleProfile as Profile)?.slug}
      </Text>
      <Flex gap="3" mt="5">
        <Link href="/">
          <Button highContrast>Go Home</Button>
        </Link>
        <Button
          onClick={() => {
            signOut()
            disconnect?.()
          }}
          color="red"
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  )
}

export default Authenticated
