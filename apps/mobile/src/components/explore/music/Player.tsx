import Ionicons from '@expo/vector-icons/Ionicons'
import { getPublicationMediaUrl } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { AVPlaybackStatus } from 'expo-av'
import { Audio } from 'expo-av'
import type { FC } from 'react'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import WaveForm from '~/components/common/WaveForm'
import AnimatedPressable from '~/components/ui/AnimatedPressable'
import haptic from '~/helpers/haptic'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  icon: {
    backgroundColor: theme.colors.white,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60
  }
})

type Props = {
  audio: Publication
}

const Player: FC<Props> = ({ audio }) => {
  const [playbackObj, setPlaybackObj] = useState<AVPlaybackStatus>()
  const [soundObj, setSoundObj] = useState<Audio.Sound>()

  const loadAudio = async () => {
    const soundInstance = new Audio.Sound()
    const result = await soundInstance.loadAsync(
      {
        uri: getPublicationMediaUrl(audio)
      },
      { shouldPlay: false },
      false
    )
    if (result.isLoaded) {
      result.isLoaded = true
    }
    setPlaybackObj(result)
    setSoundObj(soundInstance)
  }

  const stopAudio = async () => {
    // const result = await soundObj?.setStatusAsync({ shouldPlay: false })
    // console.log('🚀 ~ file: Item.tsx:126 ~ stopAudio ~ result:', result)
    // if (result?.isLoaded) {
    //   result.isPlaying = false
    // }
    soundObj?.pauseAsync()
    soundObj?.unloadAsync()
    // setPlaybackObj(result)
  }

  const playAudio = async () => {
    const result = await soundObj?.playAsync()
    if (result?.isLoaded) {
      result.isPlaying = true
    }
    setPlaybackObj(result)
  }

  const handlePlay = async () => {
    if (!playbackObj) {
      await loadAudio().then(() => playAudio())
    }
    console.log(
      '🚀 ~ file: Player.tsx:76 ~ handlePlay ~ playbackObj:',
      playbackObj
    )
    if (playbackObj?.isLoaded && playbackObj.isPlaying) {
      await stopAudio()
    }

    if (playbackObj?.isLoaded && !playbackObj.isPlaying) {
      await playAudio()
    }
  }
  return (
    <>
      <WaveForm />
      <AnimatedPressable
        onPress={() => {
          haptic()
          handlePlay()
        }}
        style={styles.icon}
      >
        <Ionicons
          name={
            playbackObj?.isLoaded && playbackObj.isPlaying ? 'pause' : 'play'
          }
          color={theme.colors.black}
          size={30}
          style={{ paddingLeft: 4 }}
        />
      </AnimatedPressable>
    </>
  )
}

export default Player
