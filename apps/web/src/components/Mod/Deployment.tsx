import {
  GIT_DEPLOYED_BRANCH,
  GIT_DEPLOYED_COMMIT_SHA,
  IS_MAINNET,
  VERCEL_DEPLOYED_ENV
} from '@dragverse/constants'
import Link from 'next/link'

const Deployment = () => {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <span className="rounded-lg bg-gray-200 bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl dark:bg-brand-850">
        {IS_MAINNET ? 'mainnet' : 'testnet'}
      </span>
      {GIT_DEPLOYED_BRANCH && (
        <span className="rounded-lg bg-gray-200 bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl dark:bg-brand-850">
          {GIT_DEPLOYED_BRANCH}
        </span>
      )}
      {VERCEL_DEPLOYED_ENV && (
        <span className="rounded-lg bg-gray-200 bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl dark:bg-brand-850">
          {VERCEL_DEPLOYED_ENV}
        </span>
      )}
      {GIT_DEPLOYED_COMMIT_SHA && (
        <span className="rounded-lg bg-gray-200 bg-opacity-70 p-1 px-3 text-xs backdrop-blur-xl dark:bg-brand-850">
          <Link
            href={`https://github.com/dragverse/marsha-v2/commit/${GIT_DEPLOYED_COMMIT_SHA}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            {GIT_DEPLOYED_COMMIT_SHA?.substring(0, 6)}
          </Link>
        </span>
      )}
    </div>
  )
}

export default Deployment
