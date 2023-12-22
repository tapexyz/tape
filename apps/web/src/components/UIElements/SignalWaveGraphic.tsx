import React from 'react'

const SignalWaveGraphic = () => {
  return (
    <div className="absolute right-0 top-0 flex translate-x-2 items-center justify-center opacity-60">
      <div className="absolute size-96 rounded-full border-2 border-black opacity-10 dark:border-white" />
      <div className="absolute size-80 rounded-full border-2 border-black opacity-10 dark:border-white" />
      <div className="absolute size-64 rounded-full border-2 border-black opacity-20 dark:border-white" />
      <div className="absolute size-48 rounded-full border-2 border-black opacity-20 dark:border-white" />
      <div className="absolute size-32 rounded-full border-2 border-black opacity-30 dark:border-white" />
      <div className="absolute size-20 rounded-full border-2 border-black opacity-30 dark:border-white" />
      <div className="absolute size-10 rounded-full border-2 border-black opacity-40 dark:border-white" />
    </div>
  )
}

export default SignalWaveGraphic
