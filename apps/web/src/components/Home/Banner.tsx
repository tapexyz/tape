import Carousel from '@components/UIElements/Carousel'
import React from 'react'
import { BUILDING_PROUDLY_URL, DRAGVERSE_BANNER_URL } from 'utils'

const Banner: React.FC = () => {
  const images = [
    {
      id: 'building-proudly',
      src: BUILDING_PROUDLY_URL,
      alt: 'building proudly banner'
    },
    {
      id: 'dragverse-banner',
      src: DRAGVERSE_BANNER_URL,
      alt: 'dragverse banner'
    }
  ]
  return <Carousel images={images} />
}

export default Banner
