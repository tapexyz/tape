import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import clsx from 'clsx'
import React, { useState } from 'react'

import StreamDetails from './StreamDetails'

const Details = () => {
  const [buttonText, setButtonText] = useState('Create')
  const [form, setForm] = useState({ title: '', description: '' })
  const [playback, setPlayback] = useState('')

  return (
    <div className="h-full">
      <div className="flex flex-wrap md:space-x-3">
        <div className="flex flex-col md:w-96">
          <div className="relative overflow-hidden rounded">
            <video
              disablePictureInPicture
              className="w-full"
              controlsList="nodownload noplaybackrate nofullscreen"
              controls
              autoPlay={true}
              muted
            >
              <source src={playback} type="video/mp4" />
            </video>
            <span className="absolute px-3 py-0.5 mt-2 text-xs text-white bg-black rounded-full top-1 right-4">
              Idle
            </span>
          </div>
          <div className="flex flex-col flex-1 mt-4">
            <div>
              <Input
                label="Title"
                type="text"
                placeholder="Title that describes your stream"
                autoComplete="off"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-1 space-x-1.5">
                <div className="text-[11px] font-semibold uppercase opacity-70">
                  Description
                </div>
              </div>
              <textarea
                placeholder="More about your stream"
                autoComplete="off"
                className={clsx(
                  'bg-white text-sm px-2.5 focus:ring-1 focus:ring-indigo-500 py-1 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full'
                )}
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <span className="mt-4">
              <Button
                onClick={() => {
                  setButtonText('Creating...')
                  setPlayback('')
                }}
              >
                {buttonText}
              </Button>
            </span>
          </div>
        </div>
        <StreamDetails />
      </div>
    </div>
  )
}

export default Details
