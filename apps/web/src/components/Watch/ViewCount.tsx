import React from 'react'
import useVideoViews from 'utils/hooks/useVideoViews'

const ViewCount = ({ url }: { url: string }) => {
  const { views } = useVideoViews(url)

  return (
    <>
      <span>{views} views</span>
      <span className="middot px-1" />
    </>
  )
}

export default ViewCount
