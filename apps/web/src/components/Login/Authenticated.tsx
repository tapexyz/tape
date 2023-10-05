import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore, { signOut } from '@lib/store/auth'
import { Avatar, Button, Flex, Text } from '@radix-ui/themes'
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
        fallback={trimLensHandle(selectedSimpleProfile.handle)[0]}
        alt={trimLensHandle(selectedSimpleProfile.handle)}
      />
      <Text as="p" weight="bold">
        {trimLensHandle(selectedSimpleProfile.handle)}
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
