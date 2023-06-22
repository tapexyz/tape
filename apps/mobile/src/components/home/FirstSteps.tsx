import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import { theme } from '../../constants/theme'
import haptic from '../../helpers/haptic'
import normalizeFont from '../../helpers/normalize-font'

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 25,
    width: 170,
    height: 170,
    padding: 18,
    marginRight: 6
  },
  title: {
    fontFamily: 'font-extrabold',
    color: theme.colors.white,
    fontSize: normalizeFont(14)
  },
  subheading: {
    fontFamily: 'font-normal',
    color: theme.colors.secondary,
    fontSize: normalizeFont(12)
  },
  cardTitle: {
    fontFamily: 'font-bold',
    opacity: 0.7,
    letterSpacing: 2,
    fontSize: normalizeFont(8),
    color: theme.colors.black,
    textTransform: 'uppercase'
  },
  cardDescription: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(14),
    color: theme.colors.black
  },
  icon: {
    width: 35,
    height: 35
  }
})

const FirstSteps = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>First steps with Pripe</Text>
      <Text style={styles.subheading}>Unleash New Social Horizons</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          paddingTop: 20
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => haptic()}
          style={[styles.card, { backgroundColor: '#ACD8AA' }]}
        >
          <ExpoImage
            source={require('assets/icons/arrow-with-scribble.png')}
            style={styles.icon}
          />
          <View>
            <Text style={styles.cardTitle}>SIWL</Text>
            <Text style={styles.cardDescription}>Sign in with Lens</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => haptic()}
          style={[styles.card, { backgroundColor: '#F0E2A3' }]}
        >
          <ExpoImage
            source={require('assets/icons/two-way-arrows.png')}
            style={styles.icon}
          />
          <View>
            <Text style={styles.cardTitle}>Wallet</Text>
            <Text style={styles.cardDescription}>Enable Dispatcher</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => haptic()}
          style={[styles.card, { backgroundColor: '#B3B3F1' }]}
        >
          <ExpoImage
            source={require('assets/icons/play-button.png')}
            style={styles.icon}
          />
          <View>
            <Text style={styles.cardTitle}>Lens</Text>
            <Text style={styles.cardDescription}>Share your first Byte</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default FirstSteps
