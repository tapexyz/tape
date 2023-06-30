import { LIVEPEER_VIEWS_URL } from '@lenstube/constants'
import axios from 'axios'
import { useEffect, useState } from 'react'

export const useVideoViews = (cid: string) => {
  const [loading, setLoading] = useState(false)
  const [views, setViews] = useState(0)

  const fetchVideoViews = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(LIVEPEER_VIEWS_URL, {
        cid
      })
      if (data && data.success) {
        setViews(data.views)
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideoViews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid])

  return { views, loading }
}
