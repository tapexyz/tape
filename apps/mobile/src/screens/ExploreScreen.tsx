import { Image as ExpoImage } from 'expo-image'
import { MotiView } from 'moti'
import React, { useReducer } from 'react'
import { Pressable, ScrollView, StyleSheet } from 'react-native'
import { useNotifications } from 'react-native-notificated'

import Container from '../components/common/Container'

const styles = StyleSheet.create({
  shape: {
    height: 500,
    width: 250,
    borderRadius: 20,
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

export const ExploreScreen = (props: ExploreScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props
  const [visible, toggle] = useReducer((s) => !s, true)
  const { notify } = useNotifications()

  function Shape() {
    return (
      <MotiView
        from={{
          opacity: 0,
          scale: 0.5
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          type: 'timing'
        }}
        style={styles.shape}
      >
        <ExpoImage
          source="https://picsum.photos/seed/696/3000/2000"
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </MotiView>
    )
  }

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <Pressable
          onPress={() => {
            toggle()
            notify('success', {
              params: {
                title: 'Hello',
                description: 'Wow, that was easy',
                hideCloseButton: true
              }
            })
          }}
          style={styles.container}
        >
          {visible && <Shape />}
        </Pressable>
      </ScrollView>
    </Container>
  )
}
