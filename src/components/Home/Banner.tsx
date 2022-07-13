import Alert from '@components/Common/Alert'
import { IS_MAINNET } from '@utils/constants'
import Link from 'next/link'
import React from 'react'

const Banner = () => {
  return !IS_MAINNET ? (
    <div className="mb-4">
      <Alert variant="success">
        <div className="flex justify-between w-full">
          <span>
            We are live on Polygon Mainnet 🎥 🌿. Head over to lenstube.xyz and
            try posting your content.
          </span>
          <Link href="https://lenstube.xyz">
            <a className="text-indigo-500">Try now</a>
          </Link>
        </div>
      </Alert>
    </div>
  ) : null
}

export default Banner
