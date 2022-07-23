import { useLazyQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { Tab } from '@headlessui/react'
import { SEARCH_CHANNELS_QUERY, SEARCH_VIDEOS_QUERY } from '@utils/gql/queries'
import useDebounce from '@utils/hooks/useDebounce'
import useOutsideClick from '@utils/hooks/useOutsideClick'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const Videos = dynamic(() => import('./Videos'))
const Channels = dynamic(() => import('./Channels'))

export default function GlobalSearchBar() {
  const [activeSearch, setActiveSearch] = useState('PUBLICATION')
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce<string>(keyword, 500)
  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => setKeyword(''))

  const [searchChannels, { data: channels, loading }] = useLazyQuery(
    activeSearch === 'PROFILE' ? SEARCH_CHANNELS_QUERY : SEARCH_VIDEOS_QUERY
  )

  useEffect(() => {
    if (keyword.trim().length)
      searchChannels({
        variables: {
          request: { type: activeSearch, query: keyword, limit: 10 }
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, activeSearch])

  return (
    <div className="lg:w-96 md:w-80">
      <div ref={resultsRef}>
        <div className="relative mt-1">
          <div className="relative w-full overflow-hidden border border-gray-200 cursor-default dark:border-gray-800 rounded-xl sm:text-sm">
            <input
              className="w-full py-2 pl-3 pr-10 text-sm bg-transparent focus:outline-none"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by hashtag / channel"
              value={keyword}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <AiOutlineSearch
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            className={clsx(
              'absolute w-full mt-1 overflow-auto text-base bg-white dark:bg-[#181818] rounded-xl max-h-[80vh] ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
              { hidden: debouncedValue.length === 0 }
            )}
          >
            <Tab.Group>
              <Tab.List className="flex justify-center overflow-x-auto rounded no-scrollbar">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'px-4 py-2 border-b-2 text-sm focus:outline-none w-full',
                      selected
                        ? 'border-indigo-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch('PUBLICATION')
                  }}
                >
                  Videos
                </Tab>
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'px-4 py-2 border-b-2 text-sm focus:outline-none w-full',
                      selected
                        ? 'border-indigo-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch('PROFILE')
                  }}
                >
                  Channels
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel className="py-3 focus:outline-none">
                  <Videos
                    results={channels?.search?.items}
                    loading={loading}
                    clearSearch={() => setKeyword('')}
                  />
                </Tab.Panel>
                <Tab.Panel className="py-3 focus:outline-none">
                  <Channels
                    results={channels?.search?.items}
                    loading={loading}
                    clearSearch={() => setKeyword('')}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {loading && (
              <div className="flex justify-center p-4">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
