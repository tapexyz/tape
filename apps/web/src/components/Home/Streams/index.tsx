import 'keen-slider/keen-slider.min.css'

import Badge from '@components/Common/Badge'
import { Button } from '@radix-ui/themes'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
import type { KeenSliderInstance } from 'keen-slider/react'
import { useKeenSlider } from 'keen-slider/react'
import Link from 'next/link'
import React from 'react'

const Streams = () => {
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
          className="keen-slider rounded-medium tape-border ultrawide:h-[500px] bg-black text-white md:h-[400px]"
        >
          <div className="keen-slider__slide relative flex justify-between">
            <div className="absolute z-[6] flex h-full flex-col justify-evenly space-y-6 bg-black bg-opacity-50 p-6 lg:static">
              <div className="space-y-3">
                <h1 className="laptop:text-4xl text-2xl font-bold">
                  Watch ETH India, Exclusively on Tape
                </h1>
                <p className="ultrawide:line-clamp-5 line-clamp-1 md:line-clamp-3">
                  ETHIndia Online is a 3-day virtual hackathon that brings
                  together developers, designers, and entrepreneurs to build
                  decentralized applications and services using Ethereum, IPFS,
                  and other related technologies.
                </p>
                <div>
                  <Link
                    href={`/u/`}
                    className="inline-flex items-center space-x-1"
                  >
                    <img
                      className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800"
                      src="https://gw.ipfs-lens.dev/ipfs/bafybeigjzxth756zl32nfrb3nbjyqeb2tne2hdqj5aqhjz3l47o2zzivhu"
                      height={50}
                      width={50}
                      alt="ETH India"
                      draggable={false}
                    />
                    <span className="flex items-center space-x-1 font-medium">
                      <span>streameth</span>
                      <Badge id={'0x2d'} size="xs" />
                    </span>
                  </Link>
                </div>
              </div>
              <span>
                <Link href="/stream/channel/rad">
                  <Button color="tomato">Watch Now</Button>
                </Link>
              </span>
            </div>
            <div className="relative aspect-[16/9]">
              <div className="absolute inset-0 z-[5] bg-gradient-to-r from-black via-transparent to-transparent" />
              <VideoPlayer
                url="https://gw.ipfs-lens.dev/ipfs/bafybeiem5h5h2fj56ip7qbbmbay5qqiqp7qd6av6jpex2gc3jxu6ai4yv4"
                posterUrl="https://gw.ipfs-lens.dev/ipfs/bafybeigjzxth756zl32nfrb3nbjyqeb2tne2hdqj5aqhjz3l47o2zzivhu"
                showControls={false}
                options={{
                  autoPlay: true,
                  muted: true,
                  loadingSpinner: true,
                  maxHeight: true
                }}
              />
            </div>
          </div>
          {/* <div className="keen-slider__slide">2</div> */}
        </div>
      </div>
      <div className="rounded-medium tape-border flex-1">
        <h1 className="px-5 py-4 text-lg font-bold">Creators to follow</h1>
      </div>
    </div>
  )
}

export default Streams
