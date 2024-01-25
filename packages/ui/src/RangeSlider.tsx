import * as SliderPrimitive from '@radix-ui/react-slider'
import { tw } from '@tape.xyz/browser'
import type { ElementRef } from 'react'
import React, { forwardRef } from 'react'

type RangeSliderProps = SliderPrimitive.SliderProps & {
  className?: string
}

export const RangeSlider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      className={tw(
        'relative flex h-5 w-full touch-none select-none items-center',
        className
      )}
      max={100}
      step={1}
      ref={ref}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[3px] grow rounded-full bg-gray-200 dark:bg-gray-800">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-gray-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 rounded-sm bg-black px-1 text-xs font-bold text-white focus:outline-none active:scale-110 dark:bg-white dark:text-black">
        {props.value}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
})

RangeSlider.displayName = 'RangeSlider'
