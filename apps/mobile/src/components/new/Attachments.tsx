import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobilePublicationStore from '~/store/publication'

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: theme.colors.grey,
    overflow: 'hidden',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  image: {
    aspectRatio: 16 / 9,
    height: 60,
    borderRadius: 5
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const Attachments = () => {
  const { navigate } = useNavigation()
  const { mainFocus, poster } = useMobilePublicationStore(
    (state) => state.draftedPublication
  )

  return (
    <View style={styles.container}>
      {poster ? (
        <>
          <Pressable onPress={() => navigate('PickerModal', { mainFocus })}>
            <ExpoImage
              source={{
                uri: poster
              }}
              contentFit="cover"
              transition={200}
              style={styles.image}
            />
          </Pressable>
          <View style={{ paddingHorizontal: 15 }}>
            <Text style={styles.text}>0%</Text>
          </View>
        </>
      ) : (
        <Pressable
          onPress={() => navigate('PickerModal', { mainFocus })}
          style={{
            height: 60,
            flex: 1,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons
            name="file-tray-outline"
            color={theme.colors.white}
            size={20}
          />
          <Text style={styles.text}>Choose a {mainFocus.toLowerCase()}</Text>
        </Pressable>
      )}
    </View>
  )
}

export default Attachments
