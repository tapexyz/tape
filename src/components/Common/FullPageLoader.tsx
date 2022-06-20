import React from 'react'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="animate-bounce">
        <img
          src="/lenstube.svg"
          draggable={false}
          className="w-10 h-10"
          alt=""
        />
      </div>
    </div>
  )
}

export default FullPageLoader
