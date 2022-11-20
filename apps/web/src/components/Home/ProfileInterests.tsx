import Topics from '@components/Settings/ProfileInterests/Topics'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import SignalWave from '@components/UIElements/SignalWave'
import useAppStore from '@lib/store'
import React, { useState } from 'react'
import { HiOutlineSparkles } from 'react-icons/hi'

const ProfileInterests = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [showModal, setShowModal] = useState(
    !selectedChannel?.interests?.length
  )

  if (!selectedChannel || selectedChannel?.interests?.length) {
    return null
  }

  return (
    <Modal show={showModal} panelClassName="max-w-xl !p-0">
      <div className="relative flex w-full flex-col p-4 overflow-hidden rounded-xl">
        <div className="absolute inset-0 w-full h-full bg-gray-100 bg-gradient-to-b dark:from-gray-800 dark:to-gray-900" />
        <div className="relative z-[1] flex flex-col items-start space-y-4 text-left">
          <div className="flex text-black items-center px-3 py-1 space-x-1 text-xs font-medium rounded-full bg-gradient-to-br from-orange-200 to-orange-300">
            <SignalWave />
            <HiOutlineSparkles className="text-base" />
            <span>What interests you most?</span>
          </div>
          <div className="flex flex-wrap items-center justify-between flex-1 w-full gap-y-3 dark:text-gray-100">
            <p className="text-sm">
              Interests are now off-chain and will be used only to curate the
              way that API serves content.
              <span className="text-yellow-700"> (Maximum 12 interests)</span>
            </p>
            <div className="max-h-96 w-full no-scrollbar overflow-y-auto">
              <Topics />
            </div>
            <div className="flex w-full justify-end">
              <Button onClick={() => setShowModal(false)}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileInterests
