import React, { useCallback } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import Container from '~/components/common/Container'
import Timeline from '~/components/common/Timeline'
import ByteCards from '~/components/home/ByteCards'
import FirstSteps from '~/components/home/FirstSteps'
import PopularCreators from '~/components/home/PopularCreators'
import TimelineFilters from '~/components/home/TimelineFilters'
import { theme } from '~/helpers/theme'

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const {
    navigation: { navigate }
  } = props

  const navigateToDetails = useCallback(() => {
    navigate('Details', { id: 'home-id' })
  }, [navigate])

  return (
    <Container>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ByteCards />
        <FirstSteps />
        <PopularCreators />
        <TimelineFilters />
        <Timeline />
        <TouchableOpacity style={{ padding: 10 }} onPress={navigateToDetails}>
          <Text style={{ color: theme.colors.white }}>
            {'home_screen > details'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  )
}
