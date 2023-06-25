import { FastAverageColor } from 'fast-average-color'
import { useCallback, useEffect, useState } from 'react'

const fac = new FastAverageColor()

export const useAverageColor = (src: string, check: boolean) => {
  const [color, setColor] = useState('')

  const getColors = useCallback(async () => {
    if (!check || !src) {
      return
    }
    return fac
      .getColorAsync(src)
      .then((color) => {
        setColor(color.hex)
      })
      .catch(() => {})
  }, [src, check])

  useEffect(() => {
    getColors()
  }, [getColors])

  return { color }
}
