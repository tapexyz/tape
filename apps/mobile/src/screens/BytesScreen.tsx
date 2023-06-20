import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Image as ExpoImage } from 'expo-image'
import { MotiView } from 'moti'
import React from 'react'
import { ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  byteCard: {
    justifyContent: 'center',
    borderRadius: 45
  }
})

export const BytesScreen = (props: BytesScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props

  const bottomTabBarHeight = useBottomTabBarHeight()
  const { height, width } = useWindowDimensions()

  const Card = ({ item }: { item: number }) => {
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
        style={[
          styles.byteCard,
          { height: height - bottomTabBarHeight, width }
        ]}
      >
        <ExpoImage
          source="https://picsum.photos/seed/696/3000/2000"
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
        <Text style={{ position: 'absolute', top: '50%', left: '50%' }}>
          {item}
        </Text>
      </MotiView>
    )
  }

  return (
    <ScrollView
      pagingEnabled
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {Array(10)
        .fill(1)
        .map((e, i) => (
          <Card key={i} item={i} />
        ))}
    </ScrollView>
  )
}
