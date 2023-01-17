import axios from 'axios'
import { useEffect, useState } from 'react'

import { LENSTUBE_API_URL } from '../constants'
import logger from '../logger'

const useVideoViews = (sourceUrl: string) => {
  const [loading, setLoading] = useState(false)
  const [views, setViews] = useState(0)

  const fetchVideoViews = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${LENSTUBE_API_URL}/video/views`, {
        sourceUrl
      })
      if (data && data.success) {
        setViews(data.views)
      }
    } catch (error) {
      logger.error('[Error useVideoViews.ts]', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideoViews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceUrl])

  return { views, loading }
}

export default useVideoViews
