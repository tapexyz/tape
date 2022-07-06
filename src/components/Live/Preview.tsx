import React from 'react'

const Preview = () => {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <video
        disablePictureInPicture
        className="w-full"
        controlsList="nodownload noplaybackrate nofullscreen"
        controls
        autoPlay={true}
        muted
      >
        <source src={'playback'} type="video/mp4" />
      </video>
      <span className="absolute px-3 py-0.5 mt-2 text-xs text-white bg-black rounded-full top-1 right-4">
        Idle
      </span>
    </div>
  )
}

export default Preview
