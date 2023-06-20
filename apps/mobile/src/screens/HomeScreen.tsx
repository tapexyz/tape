import { Image as ExpoImage } from 'expo-image'
import { MotiView } from 'moti'
import React, { useCallback } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'

import Container from '../components/Container'
import { theme } from '../constants/theme'
import { useNotifications } from '../hooks'

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    width: 250,
    aspectRatio: 9 / 16,
    borderRadius: 25,
    marginVertical: 50,
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const {
    navigation: { navigate }
  } = props
  const { notify } = useNotifications()

  const Shape = () => {
    return (
      <MotiView
        from={{
          opacity: 0,
          scale: 0.6
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          type: 'timing',
          duration: 700
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

  const navigateToDetails = useCallback(() => {
    navigate('Details', { id: 'home-id' })
  }, [navigate])

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <Pressable
          onPress={() => {
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
          <Shape />
        </Pressable>
        <Pressable style={styles.container}>
          <Shape />
        </Pressable>
        <TouchableOpacity style={{ padding: 100 }} onPress={navigateToDetails}>
          <Text style={{ color: theme.colors.primary[100] }}>
            {'home_screen > details'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  )
}
