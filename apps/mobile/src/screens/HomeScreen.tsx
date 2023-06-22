import React, { useCallback } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import Container from '../components/common/Container'
import ByteCards from '../components/home/ByteCards'
import FirstSteps from '../components/home/FirstSteps'
import Timeline from '../components/home/Timeline'
import TimelineFilters from '../components/home/TimelineFilters'
import { theme } from '../constants/theme'

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
        <TimelineFilters />
        <Timeline />
        <TouchableOpacity style={{ padding: 10 }} onPress={navigateToDetails}>
          <Text style={{ color: theme.colors.primary }}>
            {'home_screen > details'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  )
}
