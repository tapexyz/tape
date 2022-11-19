import { formatNumber } from '@utils/functions/formatNumber'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'src/types'

import LikeOutline from '../Icons/LikeOutline'

interface Props {
  results: LenstubePublication[]
  loading: boolean
  clearSearch: () => void
}

const Videos: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <>
      {results?.map((result) => (
        <div
          onClick={() => clearSearch()}
          key={result.id}
          className="relative pl-3 pr-4 cursor-default select-none hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Link
            href={`/watch/${result?.id}`}
            key={result?.id}
            className="flex flex-col justify-center py-2 space-y-1 rounded-xl"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex items-center w-3/4 space-x-2">
                <p className="text-base truncate line-clamp-1">
                  {result?.metadata?.name}
                </p>
              </div>
              <span className="inline-flex items-center space-x-1 text-xs whitespace-nowrap opacity-60">
                <LikeOutline className="w-3 h-3" />
                <span>{formatNumber(result.stats.totalUpvotes)}</span>
              </span>
            </span>
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative p-5 text-center cursor-default select-none">
          No results found.
        </div>
      )}
    </>
  )
}

export default Videos
