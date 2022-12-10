import React from 'react'

const SignalWave = () => {
  return (
    <div className="absolute top-0 right-0 flex items-center justify-center translate-x-2 opacity-60">
      <div className="absolute border-2 border-black rounded-full dark:border-white w-96 h-96 opacity-10" />
      <div className="absolute border-2 border-black rounded-full dark:border-white w-80 h-80 opacity-10" />
      <div className="absolute w-64 h-64 border-2 border-black rounded-full dark:border-white opacity-20" />
      <div className="absolute w-48 h-48 border-2 border-black rounded-full dark:border-white opacity-20" />
      <div className="absolute w-32 h-32 border-2 border-black rounded-full dark:border-white opacity-30" />
      <div className="absolute w-20 h-20 border-2 border-black rounded-full dark:border-white opacity-30" />
      <div className="absolute w-10 h-10 border-2 border-black rounded-full dark:border-white opacity-40" />
    </div>
  )
}

export default SignalWave
