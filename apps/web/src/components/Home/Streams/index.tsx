import type { ChannelStreamType } from '@tape.xyz/lens/custom-types'
import type { KeenSliderInstance } from 'keen-slider/react'

import { useQuery } from '@tanstack/react-query'
import { WORKER_STREAM_URL } from '@tape.xyz/constants'
import axios from 'axios'
import clsx from 'clsx'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import React, { useState } from 'react'

import Creators from './Creators'
import Item from './Item'

const Streams = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const fetchStreams = async () => {
    const { data } = await axios.get(`${WORKER_STREAM_URL}/streams`)
    return data?.items ?? []
  }

  const { data: streams } = useQuery({
    queryFn: fetchStreams,
    queryKey: ['streams']
  })

  const autoSwitchPlugin = (slider: KeenSliderInstance) => {
    if (slider.slides.length === 1) {
      return
    }
    let timeout: ReturnType<typeof setTimeout>
    let mouseOver = false
    function clearNextTimeout() {
      clearTimeout(timeout)
    }
    function nextTimeout() {
      clearTimeout(timeout)
      if (mouseOver) {
        return
      }
      timeout = setTimeout(() => {
        slider.next()
      }, 3000)
    }
    slider.on('created', () => {
      slider.container.addEventListener('mouseover', () => {
        mouseOver = true
        clearNextTimeout()
      })
      slider.container.addEventListener('mouseout', () => {
        mouseOver = false
        nextTimeout()
      })
      nextTimeout()
    })
    slider.on('dragStarted', clearNextTimeout)
    slider.on('animationEnded', nextTimeout)
    slider.on('updated', nextTimeout)
  }

  const [sliderRef, { current: slider }] = useKeenSlider(
    {
      loop: true,
      slideChanged: (slider) => {
        setCurrentSlide(slider.track.details.rel)
      }
    },
    [autoSwitchPlugin]
  )

  if (!streams?.length) {
    return null
  }

  return (
    <div className="laptop:pb-6 flex flex-wrap gap-4 pb-4">
      <div className="w-full lg:w-3/4">
        <div
          className="keen-slider rounded-medium tape-border relative bg-black text-white md:h-[400px]"
          ref={sliderRef}
        >
          {streams?.map((stream: ChannelStreamType) => (
            <Item key={stream.uid} stream={stream} />
          ))}
          {streams?.length > 1 && (
            <div className="absolute bottom-2 z-[1] w-full">
              <div className="flex justify-center space-x-1">
                {streams?.map((stream: ChannelStreamType, index: number) => (
                  <button
                    className={clsx(
                      'h-1 rounded-full',
                      currentSlide === index
                        ? 'bg-brand-400 w-6'
                        : 'w-2 bg-white'
                    )}
                    key={stream.uid}
                    onClick={() => slider?.moveToIdx(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Creators />
    </div>
  )
}

export default Streams
