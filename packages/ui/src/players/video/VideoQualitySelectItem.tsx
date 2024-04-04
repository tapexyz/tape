import * as Player from '@livepeer/react/player'
import { tw } from '@tape.xyz/browser'
import { forwardRef } from 'react'

import { CheckOutline } from '../../icons'

const VideoQualitySelectItem = forwardRef<
  HTMLDivElement,
  Player.VideoQualitySelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Player.VideoQualitySelectItem
      className={tw(
        'relative flex h-7 select-none items-center rounded pl-6 text-xs leading-none text-white data-[disabled]:pointer-events-none data-[highlighted]:bg-white/20 data-[highlighted]:outline-none',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckOutline className="size-3" />
      </Player.SelectItemIndicator>
    </Player.VideoQualitySelectItem>
  )
})

VideoQualitySelectItem.displayName = 'VideoQualitySelectItem'

export default VideoQualitySelectItem
