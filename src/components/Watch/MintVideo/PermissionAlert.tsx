import { Button } from '@components/UIElements/Button'
import { SETTINGS_PERMISSIONS } from '@utils/url-path'
import Link from 'next/link'
import React from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { LenstubeCollectModule } from 'src/types/local'

const PermissionAlert = ({
  collectModule
}: {
  collectModule: LenstubeCollectModule
}) => {
  return (
    <Link href={SETTINGS_PERMISSIONS}>
      <a>
        <Button variant="secondary">
          <span className="flex items-center">
            Allow {collectModule.type} for{' '}
            {collectModule?.amount?.asset?.symbol} <BiChevronRight />
          </span>
        </Button>
      </a>
    </Link>
  )
}

export default PermissionAlert
