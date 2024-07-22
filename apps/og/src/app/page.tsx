import { TAPE_APP_DESCRIPTION, TAPE_APP_NAME } from '@tape.xyz/constants'
import React from 'react'

const Home = () => {
  return (
    <main>
      <div>{TAPE_APP_NAME}</div>
      <p>{TAPE_APP_DESCRIPTION}</p>
    </main>
  )
}

export default Home
