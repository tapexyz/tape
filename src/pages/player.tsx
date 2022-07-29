import dynamic from 'next/dynamic'
import React from 'react'
const LenstubePlayer = dynamic(() => import('../components/UIElements/Player'))

const player = () => {
  return <LenstubePlayer />
}

export default player
