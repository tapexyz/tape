import React, { useState } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'

import Filters from '~/components/managers/Filters'
import Managed from '~/components/managers/Managed'
import Managers from '~/components/managers/Managers'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5
  }
})

export const ManagersModal = (): JSX.Element => {
  const { height } = useWindowDimensions()
  const [showManagers, setShowManagers] = useState(true)

  return (
    <View style={styles.container}>
      <Filters showManagers={showManagers} setShowManagers={setShowManagers} />
      <View style={{ paddingHorizontal: 5, height }}>
        {showManagers ? <Managers /> : <Managed />}
      </View>
    </View>
  )
}
