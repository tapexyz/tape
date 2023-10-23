import React, { useEffect, useState } from 'react'

export const Countdown = ({ timestamp }: { timestamp: string }) => {
  const calculateRemainingTime = () => {
    const now = new Date().getTime()
    const targetTime = new Date(timestamp).getTime()
    const timeDifference = targetTime - now

    if (timeDifference <= 0) {
      // Handle case when the timestamp has passed
      return 0
    }

    return timeDifference
  }

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime())

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime()

      if (newRemainingTime === 0) {
        clearInterval(interval)
      } else {
        setRemainingTime(newRemainingTime)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp])

  const formatTime = (time: number) => {
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const seconds = Math.floor((time / 1000) % 60)

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  return remainingTime !== 0 && <span>{formatTime(remainingTime)}</span>
}
