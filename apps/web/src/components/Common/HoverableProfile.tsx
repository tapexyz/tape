import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HoverCard,
  Link,
  Text
} from '@radix-ui/themes'
import type { FC } from 'react'
import React from 'react'

import Badge from './Badge'

type Props = {
  profile: Profile
  hideImage?: boolean
  fontSize?: '1' | '2'
}

const HoverableProfile: FC<Props> = ({
  profile,
  hideImage = false,
  fontSize = '2'
}) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Link href={`/channel/${trimLensHandle(profile.handle)}`}>
          <Flex gap="1" align="center">
            {!hideImage && (
              <img
                className="h-4 w-4 flex-none rounded-full object-cover"
                src={getProfilePicture(profile)}
                alt={trimLensHandle(profile.handle)[0]}
                draggable={false}
              />
            )}
            <Flex align="center" gap="1">
              <Text size={fontSize} highContrast color="gray">
                {trimLensHandle(profile.handle)}
              </Text>
              <Badge id={profile?.id} size="xs" />
            </Flex>
          </Flex>
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <Flex gap="3">
          <Avatar
            size="3"
            fallback={trimLensHandle(profile.handle)[0]}
            radius="full"
            src={getProfilePicture(profile)}
          />
          <Box>
            <Heading size="3" as="h3">
              {profile.metadata?.displayName}
            </Heading>

            <Flex align="center" gap="1">
              <Text>@{trimLensHandle(profile.handle)}</Text>
              <Badge id={profile?.id} size="sm" />
            </Flex>

            <Text as="div" size="2" style={{ maxWidth: 300 }} mt="3">
              {profile.metadata?.bio}
            </Text>
          </Box>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}

export default HoverableProfile
