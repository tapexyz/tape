import { useEffect, useState } from 'react'

type ScreenSize = {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
}

export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: false,
    isTablet: false
  })

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      const isMobile = newWidth <= 768 // Adjust this breakpoint as needed
      const isTablet = newWidth > 768 && newWidth <= 1024 // Adjust this breakpoint as needed

      setScreenSize({
        width: newWidth,
        height: newHeight,
        isMobile,
        isTablet
      })
    }

    window.addEventListener('resize', handleResize)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Initial device type detection
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 // Adjust this breakpoint as needed
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024 // Adjust this breakpoint as needed

    setScreenSize((prevScreenSize) => ({
      ...prevScreenSize,
      isMobile,
      isTablet
    }))
  }, [])

  return screenSize
}
