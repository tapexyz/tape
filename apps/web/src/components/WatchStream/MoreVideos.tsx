import Feed from '@components/Home/Feed'
import React from 'react'

const MoreVideos = () => {
  return (
    <div className="py-3">
      <h1 className="laptop:text-2xl text-xl font-bold">More Videos</h1>
      <Feed showFilter={false} />
    </div>
  )
}

export default MoreVideos
