import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const DetailsScreen = (props: DetailsScreenProps): JSX.Element => {
  const {
    route: {}
  } = props

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], [])

  // callbacks
  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  return (
    <View>
      <Text>details_screen.title</Text>
      <TouchableOpacity onPress={openModal}>
        <Text>open_bottom_sheet</Text>
      </TouchableOpacity>
      <Text>details_screen.screen_params</Text>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <View>
          <Text>details_screen.awesome</Text>
        </View>
      </BottomSheetModal>
    </View>
  )
}
