import CheckOutline from '@components/Common/Icons/CheckOutline'
import { Listbox, Transition } from '@headlessui/react'
import usePersistStore from '@lib/store/persist'
import React, { Fragment } from 'react'
import { CREATOR_VIDEO_CATEGORIES } from 'utils/data/categories'

const Category = () => {
  const uploadedVideo = usePersistStore((state) => state.uploadedVideo)
  const setUploadedVideo = usePersistStore((state) => state.setUploadedVideo)

  return (
    <>
      <div className="flex items-center mb-1 space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          Category
        </div>
      </div>
      <Listbox
        value={uploadedVideo.videoCategory}
        onChange={(category) => setUploadedVideo({ videoCategory: category })}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-2.5 pl-4 pr-10 text-left border dark:border-gray-700 border-gray-300 rounded-xl focus:outline-none sm:text-sm">
            <span className="block truncate">
              {uploadedVideo.videoCategory.name}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <CheckOutline className="w-3 h-3" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute shadow w-full py-1 mt-1 z-[1] overflow-auto text-base bg-white dark:bg-gray-900 rounded-xl max-h-52 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {CREATOR_VIDEO_CATEGORIES.map((category, categoryIdx) => (
                <Listbox.Option
                  key={categoryIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`
                  }
                  value={category}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {category.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckOutline className="w-3 h-3" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  )
}

export default Category
