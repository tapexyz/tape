import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import type { FC, PropsWithChildren } from 'react'
import React, { useCallback, useMemo, useRef } from 'react'

import { theme } from '~/helpers/theme'

type Props = {
  sheetRef?: React.RefObject<BottomSheetModalMethods>
  snap?: string[]
  marginX?: number
}

const Sheet: FC<PropsWithChildren & Props> = ({
  snap,
  marginX,
  children,
  sheetRef
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => snap ?? ['40%'], [snap])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  return (
    <BottomSheetModal
      index={0}
      ref={sheetRef ?? bottomSheetModalRef}
      handleComponent={null}
      backgroundStyle={{
        borderRadius: 40,
        backgroundColor: theme.colors.backdrop,
        borderColor: theme.colors.grey,
        borderWidth: 0.5
      }}
      animationConfigs={{
        duration: 200
      }}
      style={{
        marginHorizontal: marginX ?? 3,
        overflow: 'hidden',
        borderRadius: 40
      }}
      detached={true}
      bottomInset={20}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      {children}
    </BottomSheetModal>
  )
}

export default Sheet
