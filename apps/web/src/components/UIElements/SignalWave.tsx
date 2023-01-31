import React from 'react'

const SignalWave = () => {
  return (
    <div className="absolute top-0 right-0 flex translate-x-2 items-center justify-center opacity-60">
      <div className="absolute h-96 w-96 rounded-full border-2 border-black opacity-10 dark:border-white" />
      <div className="absolute h-80 w-80 rounded-full border-2 border-black opacity-10 dark:border-white" />
      <div className="absolute h-64 w-64 rounded-full border-2 border-black opacity-20 dark:border-white" />
      <div className="absolute h-48 w-48 rounded-full border-2 border-black opacity-20 dark:border-white" />
      <div className="absolute h-32 w-32 rounded-full border-2 border-black opacity-30 dark:border-white" />
      <div className="absolute h-20 w-20 rounded-full border-2 border-black opacity-30 dark:border-white" />
      <div className="absolute h-10 w-10 rounded-full border-2 border-black opacity-40 dark:border-white" />
    </div>
  )
}

export default SignalWave
