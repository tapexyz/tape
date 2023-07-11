import { formatNumber } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import LikeOutline from '../Icons/LikeOutline'

interface Props {
  results: Publication[]
  loading: boolean
  clearSearch: () => void
}

const Videos: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <>
      {results?.map((result) => (
        <div
          key={result.id}
          className="relative cursor-default select-none pl-3 pr-4 hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Link
            href={`/watch/${result?.id}`}
            key={result?.id}
            onClick={() => clearSearch()}
            className="flex flex-col justify-center space-y-1 rounded-xl py-2"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex w-3/4 items-center space-x-2">
                <p className="line-clamp-1 truncate text-base">
                  {result?.metadata?.name}
                </p>
              </div>
              <span className="inline-flex items-center space-x-1 whitespace-nowrap text-xs opacity-60">
                <LikeOutline className="h-3 w-3" />
                <span>{formatNumber(result.stats.totalUpvotes)}</span>
              </span>
            </span>
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative cursor-default select-none p-5 text-center">
          <Trans>No results found</Trans>
        </div>
      )}
    </>
  )
}

export default Videos
