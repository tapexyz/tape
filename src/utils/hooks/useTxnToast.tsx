import { HashExplorerLink } from '@components/Common/ExplorerLink'
import React from 'react'
import toast from 'react-hot-toast'
import { CgSandClock } from 'react-icons/cg'

const useTxnToast = () => {
  const showToast = (txnHash: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 px-4 py-3">
            <div className="flex items-center">
              <div className="flex-none">
                <CgSandClock className="text-xl" />
              </div>
              <div className="flex-1 ml-3">
                <p className="text-sm font-medium">
                  Transaction Submitted. Indexing...
                </p>
              </div>
            </div>
          </div>
          <HashExplorerLink hash={txnHash}>
            <div className="flex flex-col justify-center flex-1 h-full border-l border-gray-200 dark:border-gray-900">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex items-center justify-center w-full p-4 text-sm font-medium text-indigo-500 border border-transparent rounded-none rounded-r-xl hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                View
              </button>
            </div>
          </HashExplorerLink>
        </div>
      ),
      {
        duration: 7000 // 7 secs
      }
    )
  }

  return { showToast }
}

export default useTxnToast
