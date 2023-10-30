import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import { imageCdn } from '@tape.xyz/generic'
import React from 'react'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <img
        src={imageCdn(`${STATIC_ASSETS}/brand/logo.svg`)}
        draggable={false}
        className="h-12 w-12 md:h-16 md:w-16"
        alt={TAPE_APP_NAME}
      />
    </div>
  )
}

export default FullPageLoader
