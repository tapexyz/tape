import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import React from 'react'
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(20),
    letterSpacing: 2,
    color: theme.colors.white
  },
  close: {
    position: 'absolute',
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    bottom: 50
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 30
  }
})

const TopsModal = (): JSX.Element => {
  const { goBack } = useNavigation()
  const isAndroid = Platform.OS === 'android'

  return (
    <BlurView
      intensity={100}
      tint="dark"
      style={[
        styles.container,
        {
          backgroundColor: isAndroid ? theme.colors.black : '#00000080'
        }
      ]}
    >
      <View style={styles.listContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => haptic()}>
          <Text style={[styles.text, { opacity: 0.7 }]}>Top Collected</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={() => haptic()}>
          <Text style={[styles.text, { opacity: 0.7 }]}>Top Commented</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={() => haptic()}>
          <Text style={[styles.text, { opacity: 0.7 }]}>Top Mirrored</Text>
        </TouchableOpacity>
      </View>

      <Pressable
        onPress={() => {
          haptic()
          goBack()
        }}
        style={styles.close}
      >
        <Ionicons name="close-outline" color={theme.colors.black} size={35} />
      </Pressable>
    </BlurView>
  )
}

export default TopsModal
