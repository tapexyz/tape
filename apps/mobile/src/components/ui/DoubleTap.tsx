import type { FC, ReactElement } from 'react'
import React from 'react'
import type {
  HandlerStateChangeEvent,
  TapGestureHandlerEventPayload
} from 'react-native-gesture-handler'
import { State, TapGestureHandler } from 'react-native-gesture-handler'

type Props = {
  onDoubleTap: () => void
  children: ReactElement
}

const DoubleTap: FC<Props> = ({ onDoubleTap, children }) => {
  const onHandlerStateChange = (
    e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  ) => {
    if (e.nativeEvent.state === State.ACTIVE) {
      onDoubleTap && onDoubleTap()
    }
  }

  return (
    <TapGestureHandler
      onHandlerStateChange={onHandlerStateChange}
      numberOfTaps={2}
    >
      {children}
    </TapGestureHandler>
  )
}

export default DoubleTap
