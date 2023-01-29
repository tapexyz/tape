import { FastAverageColor } from 'fast-average-color'
import { useCallback, useEffect, useState } from 'react'

import logger from '../logger'

const fac = new FastAverageColor()

export const getAverageColor = async (src: string) => {
  try {
    const color = await fac.getColorAsync(src)
    return color.hex
  } catch (e) {
    logger.error('[Error getAverageColor]', e)
    return ''
  }
}

const useAverageColor = (src: string, check: boolean) => {
  const [color, setColor] = useState('')

  const getColors = useCallback(async () => {
    if (!check) {
      return
    }
    return fac
      .getColorAsync(src)
      .then((color) => {
        setColor(color.hex)
      })
      .catch((e) => {
        logger.error('[Error useAverageColor]', e)
      })
  }, [src, check])

  useEffect(() => {
    getColors()
  }, [getColors])

  return { color }
}

export default useAverageColor
