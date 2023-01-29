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
    <div className="flex items-center mb-4 space-x-2">
      <span className="p-1 px-3 text-xs bg-secondary backdrop-blur-xl bg-opacity-70 rounded-lg dark:bg-theme">
        {IS_MAINNET ? 'mainnet' : 'testnet'}
      </span>
      {GIT_DEPLOYED_BRANCH && (
        <span className="p-1 px-3 text-xs bg-secondary backdrop-blur-xl bg-opacity-70 rounded-lg dark:bg-theme">
          {GIT_DEPLOYED_BRANCH}
        </span>
      )}
      {VERCEL_DEPLOYED_ENV && (
        <span className="p-1 px-3 text-xs bg-secondary backdrop-blur-xl bg-opacity-70 rounded-lg dark:bg-theme">
          {VERCEL_DEPLOYED_ENV}
        </span>
      )}
      {GIT_DEPLOYED_COMMIT_SHA && (
        <span className="p-1 px-3 text-xs bg-secondary backdrop-blur-xl bg-opacity-70 rounded-lg dark:bg-theme">
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
