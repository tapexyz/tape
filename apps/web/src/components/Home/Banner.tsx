import React from 'react'
import { BANNER_URL } from 'utils'

const Banner: React.FC = () => {
  return (
    <div className="mb-4 w-full">
      <div
        className="aspect-[1400/400] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${BANNER_URL})` }}
      />
    </div>
  )
}

export default Banner
