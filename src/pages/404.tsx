import { Button } from '@components/UIElements/Button'
import { APP_NAME } from '@utils/constants'
import { HOME } from '@utils/url-path'
import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
        <img
          src="/lenstube.svg"
          alt={APP_NAME}
          draggable={false}
          height={50}
          width={50}
        />
        <div className="py-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">Oops!</h1>
          <div className="mb-6">This page could not be found.</div>
          <Link href={HOME} passHref>
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
