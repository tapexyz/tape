import {
  GIT_DEPLOYED_BRANCH,
  GIT_DEPLOYED_COMMIT_SHA,
  IS_MAINNET,
  VERCEL_DEPLOYED_ENV
} from '@utils/constants'
import { Link } from 'interweave-autolink'
import React from 'react'

const Deployment = () => {
  return (
    <div className="flex items-center mb-4 space-x-2">
      <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
        {IS_MAINNET ? 'polygon' : 'mumbai'}
      </span>
      {GIT_DEPLOYED_BRANCH && (
        <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
          {GIT_DEPLOYED_BRANCH}
        </span>
      )}
      {VERCEL_DEPLOYED_ENV && (
        <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
          {VERCEL_DEPLOYED_ENV}
        </span>
      )}
      {GIT_DEPLOYED_COMMIT_SHA && (
        <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
          <Link
            href={`https://github.com/sasicodes/lenstube/commit/${GIT_DEPLOYED_COMMIT_SHA}`}
          >
            <a target="_blank" rel="noreferer noreferrer">
              <span className="p-1 px-3 text-xs text-indigo-500 bg-gray-100 rounded-lg">
                {GIT_DEPLOYED_COMMIT_SHA?.substring(0, 6)}
              </span>
            </a>
          </Link>
        </span>
      )}
    </div>
  )
}

export default Deployment
