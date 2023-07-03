import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useCallback, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import Sheet from '~/components/ui/Sheet'

export const DetailsScreen = (props: DetailsScreenProps): JSX.Element => {
  const {
    route: {}
  } = props

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <View>
      <TouchableOpacity style={{ padding: 30 }} onPress={openModal}>
        <Text>open_bottom_sheet</Text>
      </TouchableOpacity>
      <Sheet sheetRef={bottomSheetModalRef}>
        <View style={{ padding: 10 }}>
          <Text>bottomsheet</Text>
        </View>
      </Sheet>
    </View>
  )
}
