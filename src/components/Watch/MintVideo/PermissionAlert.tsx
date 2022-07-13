import Alert from '@components/Common/Alert'
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
    <div className="flex-1">
      <Alert variant="warning">
        <Link href={SETTINGS_PERMISSIONS}>
          <a className="flex justify-center mx-auto">
            <span className="flex items-center justify-center">
              Allow {collectModule.type} for{' '}
              {collectModule?.amount?.asset?.symbol} <BiChevronRight />
            </span>
          </a>
        </Link>
      </Alert>
    </div>
  )
}

export default PermissionAlert
