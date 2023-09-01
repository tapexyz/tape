import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet'
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import type { FC, PropsWithChildren } from 'react'
import React, { useCallback, useMemo, useRef } from 'react'

import { useMobileTheme } from '~/hooks'

type Props = {
  sheetRef?: React.RefObject<BottomSheetModalMethods>
  marginX?: number
  backdropOpacity?: number
}

const BORDER_RADIUS = 35

const Sheet: FC<PropsWithChildren & Props> = ({
  marginX,
  children,
  sheetRef,
  backdropOpacity = 0.5
}) => {
  const { themeConfig } = useMobileTheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], [])

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={backdropOpacity}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="none"
      />
    ),
    [backdropOpacity]
  )

  return (
    <BottomSheetModal
      index={0}
      keyboardBehavior="interactive"
      ref={sheetRef ?? bottomSheetModalRef}
      handleIndicatorStyle={{
        backgroundColor: themeConfig.sheetBorderColor
      }}
      backgroundStyle={{
        borderRadius: BORDER_RADIUS,
        backgroundColor: themeConfig.sheetBackgroundColor,
        borderColor: themeConfig.sheetBorderColor,
        borderWidth: 0.5
      }}
      style={{
        marginHorizontal: marginX ?? 7,
        overflow: 'hidden',
        borderRadius: BORDER_RADIUS
      }}
      detached={true}
      bottomInset={20}
      backdropComponent={renderBackdrop}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <BottomSheetScrollView
          contentContainerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default Sheet
