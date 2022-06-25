import Hls from 'hls.js'
import { Options } from 'plyr'
import React, { useEffect } from 'react'

const useHls = (src: string, options: Options | null) => {
  const hls = React.useRef<Hls>(new Hls())
  const hasQuality = React.useRef<boolean>(false)
  const [plyrOptions, setPlyrOptions] = React.useState<Options | null>(options)

  useEffect(() => {
    hasQuality.current = false
  }, [options])

  useEffect(() => {
    hls.current.loadSource(src)
    // NOTE: although it is more reactive to use the ref, but it seems that plyr wants to use the old as lazy process
    hls.current.attachMedia(document.querySelector('.plyr-react')!)
    /**
     * You can all your custom event listener here
     * For this example we iterate over the qualities and pass them to plyr player
     * ref.current.plyr.play() ❌
     * console.log.bind(console, 'MANIFEST_PARSED') ✅
     * NOTE: you can only start play the audio here
     * Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
     */
    hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
      if (hasQuality.current) return // early quit if already set

      const levels = hls.current.levels
      const quality: Options['quality'] = {
        default: levels[levels.length - 1].height,
        options: levels.map((level) => level.height),
        forced: true,
        onChange: (newQuality: number) => {
          console.log('changes', newQuality)
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
