import { getPublicationHlsUrl, getThumbnailUrl } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { ResizeMode, Video } from 'expo-av'
import type { FC } from 'react'
import React from 'react'

import { theme } from '~/helpers/theme'

type Props = {
  video: Publication
}

const VideoPlayer: FC<Props> = ({ video }) => {
  return (
    <Video
      usePoster
      shouldPlay
      useNativeControls
      isMuted={false}
      isLooping={false}
      resizeMode={ResizeMode.CONTAIN}
      source={{
        uri: getPublicationHlsUrl(video)
      }}
      posterSource={{ uri: getThumbnailUrl(video) }}
      style={{
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: theme.colors.backdrop
      }}
    />
  )
}

export default VideoPlayer
