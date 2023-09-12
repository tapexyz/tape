import Ionicons from '@expo/vector-icons/Ionicons'
import { getPublicationMediaUrl } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { AVPlaybackStatus } from 'expo-av'
import { Audio } from 'expo-av'
import type { FC } from 'react'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import WaveForm from '~/components/common/WaveForm'
import AnimatedPressable from '~/components/ui/AnimatedPressable'
import haptic from '~/helpers/haptic'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    icon: {
      backgroundColor: themeConfig.contrastBackgroundColor,
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
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
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
      <WaveForm audio={audio} />
      <AnimatedPressable
        onPress={() => {
          haptic()
          handlePlay()
        }}
        style={style.icon}
      >
        <Ionicons
          name={
            playbackObj?.isLoaded && playbackObj.isPlaying ? 'pause' : 'play'
          }
          color={themeConfig.contrastTextColor}
          size={30}
          style={{ paddingLeft: 4 }}
        />
      </AnimatedPressable>
    </>
  )
}

export default Player
