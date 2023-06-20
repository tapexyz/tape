import { Image as ExpoImage } from 'expo-image'
import { MotiView } from 'moti'
import React, { useReducer } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useNotifications } from 'react-native-notificated'

import { StatusBar } from '../components'

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 45,
    backgroundColor: 'black'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white'
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
          style={{ width: '100%', height: '100%', borderRadius: 45 }}
        />
      </MotiView>
    )
  }

  return (
    <View style={{ flex: 1 }}>
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
        <StatusBar style="auto" />
        {visible && <Shape />}
      </Pressable>
    </View>
  )
}
