import Link from 'next/link'
import React from 'react'
import {
  GIT_DEPLOYED_BRANCH,
  GIT_DEPLOYED_COMMIT_SHA,
  IS_MAINNET,
  VERCEL_DEPLOYED_ENV
} from 'utils'

const Deployment = () => {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <span className="bg-secondary dark:bg-theme rounded-lg bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl">
        {IS_MAINNET ? 'mainnet' : 'testnet'}
      </span>
      {GIT_DEPLOYED_BRANCH && (
        <span className="bg-secondary dark:bg-theme rounded-lg bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl">
          {GIT_DEPLOYED_BRANCH}
        </span>
      )}
      {VERCEL_DEPLOYED_ENV && (
        <span className="bg-secondary dark:bg-theme rounded-lg bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl">
          {VERCEL_DEPLOYED_ENV}
        </span>
      )}
      {GIT_DEPLOYED_COMMIT_SHA && (
        <span className="bg-secondary dark:bg-theme rounded-lg bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl">
          <Link
            href={`https://github.com/lenstube-xyz/lenstube/commit/${GIT_DEPLOYED_COMMIT_SHA}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            <span className="text-xs text-indigo-500">
              {GIT_DEPLOYED_COMMIT_SHA?.substring(0, 6)}
            </span>
          </Link>
        </span>
      )}
    </div>
  )
}

export default Deployment
