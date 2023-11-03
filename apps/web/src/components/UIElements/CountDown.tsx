import React, { useEffect, useState } from 'react'

export const Countdown = ({
  timestamp,
  endText
}: {
  timestamp: string
  endText: string
}) => {
  const calculateRemainingTime = () => {
    const now = new Date().getTime()
    const targetTime = new Date(timestamp).getTime()
    const timeDifference = targetTime - now

    if (timeDifference <= 0) {
      // Handle case when the timestamp has passed
      return 0
    }

    return Math.max(timeDifference, 0) // Ensure remainingTime is non-negative
  }

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime())

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime()

      if (newRemainingTime === 0) {
        clearInterval(interval)
      } else {
        setRemainingTime(newRemainingTime) // Update remainingTime
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp])

  const formatTime = (time: number) => {
    const years = Math.floor(time / (365 * 24 * 60 * 60 * 1000)) // Calculate years
    const days = Math.floor(
      (time % (365 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
    ) // Calculate days
    const hours = Math.floor((time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)) // Calculate hours
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000)) // Calculate minutes
    const seconds = Math.floor((time % (60 * 1000)) / 1000) // Calculate seconds

    if (years > 0) {
      return `${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`
    }

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  return remainingTime !== 0 ? (
    <span>{formatTime(remainingTime)}</span>
  ) : (
    <span>{endText}</span>
  )
}
