import { Input } from '@components/UIElements/Input'
import { Button } from '@radix-ui/themes'
import { FALLBACK_COVER_URL } from '@tape.xyz/constants'
import { imageCdn } from '@tape.xyz/generic'
import React from 'react'

const Bangers = () => {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url("${imageCdn(FALLBACK_COVER_URL)}")`
        }}
        className="relative h-44 w-full bg-gray-300 bg-cover bg-center bg-no-repeat dark:bg-gray-700 md:h-[20vh]"
      >
        <div className="container mx-auto flex h-full max-w-screen-md flex-col justify-center px-4 md:px-0">
          <div className="flex items-end space-x-2">
            <Input label="Post a banger" placeholder="Paste a link" />
            <Button highContrast>Post</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-screen-lg">Bangers</div>
    </div>
  )
}

export default Bangers
