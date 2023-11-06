import 'keen-slider/keen-slider.min.css'

import { useQuery } from '@tanstack/react-query'
import { WORKER_STREAM_URL } from '@tape.xyz/constants'
import type { ChannelStreamType } from '@tape.xyz/lens/custom-types'
import axios from 'axios'
import type { KeenSliderInstance } from 'keen-slider/react'
import { useKeenSlider } from 'keen-slider/react'
import React from 'react'

import Creators from './Creators'
import Item from './Item'

const Streams = () => {
  const fetchStreams = async () => {
    const { data } = await axios.get(`${WORKER_STREAM_URL}/streams`)
    return data?.items ?? []
  }

  const { data: streams } = useQuery({
    queryKey: ['streams'],
    queryFn: fetchStreams
  })

  const autoSwitchPlugin = (slider: KeenSliderInstance) => {
    if (slider.slides.length <= 1) {
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

  const [sliderRef] = useKeenSlider({ loop: true }, [autoSwitchPlugin])

  return (
    <div className="laptop:pt-6 flex flex-wrap gap-4 pt-4">
      <div className="w-full md:w-3/4">
        <div
          ref={sliderRef}
          className="keen-slider rounded-medium tape-border bg-black text-white md:h-[400px]"
        >
          {streams?.map((stream: ChannelStreamType) => (
            <Item key={stream.uid} stream={stream} />
          ))}
        </div>
      </div>
      <Creators />
    </div>
  )
}

export default Streams
