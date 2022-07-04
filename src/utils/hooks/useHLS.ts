import Hls from 'hls.js'
import { Options } from 'plyr'
import { useEffect, useRef, useState } from 'react'

const useHls = (src: string, options: Options | null) => {
  const hls = useRef<Hls>(new Hls())
  const hasQuality = useRef<boolean>(false)
  const [plyrOptions, setPlyrOptions] = useState<Options | null>(options)

  useEffect(() => {
    hasQuality.current = false
  }, [options])

  useEffect(() => {
    hls.current.loadSource(src)
    hls.current.attachMedia(document.querySelector('.plyr-react')!)
    hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
      if (hasQuality.current) return

      const levels = hls.current.levels
      const quality: Options['quality'] = {
        default: levels[levels.length - 1].height,
        options: levels.map((level) => level.height),
        forced: true,
        onChange: (newQuality: number) => {
          levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hls.current.currentLevel = levelIndex
            }
          })
        }
      }
      setPlyrOptions({ ...plyrOptions, quality })
      hasQuality.current = true
    })
  })

  return { options: plyrOptions }
}

export default useHls
