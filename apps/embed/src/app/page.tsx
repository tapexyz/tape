'use client'

import { TAPE_APP_DESCRIPTION, TAPE_APP_NAME } from '@tape.xyz/constants'

const Home = () => {
  return (
    <main>
      <div>{TAPE_APP_NAME}</div>
      <p>{TAPE_APP_DESCRIPTION}</p>
    </main>
  )
}

export default Home
