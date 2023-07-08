import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import React from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    alignItems: 'center'
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
    gap: 30
  }
})

const CREATOR_VIDEO_CATEGORIES = [
  {
    name: 'People & Blogs',
    tag: 'people'
  },
  { name: 'Music', tag: 'music' },
  {
    name: 'Podcast',
    tag: 'podcast'
  },
  {
    name: 'Arts',
    tag: 'arts'
  },
  {
    name: 'Hobbies & Interests',
    tag: 'interests'
  },
  {
    name: 'Comedy',
    tag: 'comedy'
  },
  {
    name: 'Health & Fitness',
    tag: 'health'
  },
  {
    name: 'Lens Ecosystem',
    tag: 'lens'
  },
  {
    name: 'Food & Cooking',
    tag: 'food'
  },
  {
    name: 'Education',
    tag: 'education'
  },
  {
    name: 'Books & Literature',
    tag: 'literature'
  },
  {
    name: 'Entertainment',
    tag: 'entertainment'
  },
  {
    name: 'Home & Garden',
    tag: 'garden'
  },
  {
    name: 'Crypto currency',
    tag: 'crypto'
  },
  {
    name: 'Film & Animation',
    tag: 'film'
  },
  {
    name: 'Business',
    tag: 'business'
  },
  {
    name: 'Family & Parenting',
    tag: 'family'
  },
  {
    name: 'Gaming',
    tag: 'gaming'
  },
  {
    name: 'Blockchain',
    tag: 'blockchain'
  },
  {
    name: 'Howto & Style',
    tag: 'howto'
  },
  {
    name: 'News & Politics',
    tag: 'news'
  },
  {
    name: 'Nonprofits & Activism',
    tag: 'nonprofits'
  },
  {
    name: 'Promotions',
    tag: 'promotions'
  },
  {
    name: 'Pets & Animals',
    tag: 'pets'
  },
  {
    name: 'Wellness',
    tag: 'wellness'
  },
  {
    name: 'Science & Technology',
    tag: 'technology'
  },
  {
    name: 'Sports',
    tag: 'sports'
  },
  {
    name: 'Career',
    tag: 'career'
  },
  {
    name: 'Travel & Events',
    tag: 'travel'
  },
  {
    name: 'Gadgets',
    tag: 'gadgets'
  },
  {
    name: 'Autos & Vehicles',
    tag: 'vehicles'
  }
]

export const CategoriesModal = (): JSX.Element => {
  const { goBack } = useNavigation()
  const { top } = useSafeAreaInsets()
  const { height } = useWindowDimensions()
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
      <ScrollView
        contentContainerStyle={[
          styles.listContainer,
          {
            paddingTop: top * 2,
            paddingBottom: height / 3
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {CREATOR_VIDEO_CATEGORIES.map(({ tag, name }) => (
          <TouchableOpacity
            key={tag}
            activeOpacity={0.6}
            onPress={() => haptic()}
          >
            <Text
              style={[styles.text, { color: theme.colors.white, opacity: 0.7 }]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
