import type { FC } from 'react'
import React, { memo, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

type Props = {
  url: string
  progressColor?: string
  waveColor?: string
  isPlaying?: boolean
}

const AudioPlayer: FC<Props> = (props) => {
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (waveformRef.current && !waveSurferRef.current) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: props.waveColor ?? 'white',
        progressColor: props.progressColor ?? '#39c4ff',
        cursorColor: 'transparent',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 0,
        height: 100,
        barGap: 3,
        normalize: true,
        dragToSeek: true,
        url: props.url,
        renderFunction: (channels, ctx) => {
          const { width, height } = ctx.canvas
          const scale = channels[0].length / width
          const step = 10

          ctx.lineWidth = 3 // line width (stroke width)

          ctx.translate(0, height / 2)
          ctx.strokeStyle = ctx.fillStyle
          ctx.beginPath()

          for (let i = 0; i < width; i += step * 2) {
            const index = Math.floor(i * scale)
            const value = Math.abs(channels[0][index])
            let x = i
            let y = value * (height / 2) // added /2 to reduce cut off

            ctx.moveTo(x, 0)
            ctx.lineTo(x, y)
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true)
            ctx.lineTo(x + step, 0)

            x = x + step
            y = -y
            ctx.moveTo(x, 0)
            ctx.lineTo(x, y)
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false)
            ctx.lineTo(x + step, 0)
          }

          ctx.stroke()
          ctx.closePath()
        }
      })

      ws.on('interaction', () => {
        ws.play()
      })

      waveSurferRef.current = ws

      return () => {
        ws.destroy()
        waveSurferRef.current = null
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url])

  useEffect(() => {
    if (waveSurferRef.current) {
      if (props.isPlaying) {
        waveSurferRef.current.play()
      } else {
        waveSurferRef.current.pause()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isPlaying])

  return <div id="waveform" ref={waveformRef} />
}

export default memo(AudioPlayer)
