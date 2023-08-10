import { type MutableRefObject } from 'react'
import { Animated } from 'react-native'

const shakeForm = (shakeRef: MutableRefObject<Animated.Value>) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(shakeRef.current, {
        toValue: -2,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeRef.current, {
        toValue: 2,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeRef.current, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]),
    { iterations: 2 }
  ).start()
}

export default shakeForm
