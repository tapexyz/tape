import { Button } from '@components/UIElements/Button'
import { HOME } from '@utils/url-path'
import Head from 'next/head'
import Link from 'next/link'

export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
        <img
          src="/lenstube.svg"
          alt="Lenstube"
          draggable={false}
          height={50}
          width={50}
        />
        <div className="py-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">You are offline!</h1>
          <div className="mb-6">
            Please check your internet connection and retry.
          </div>
          <Link href={HOME} passHref={true}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
