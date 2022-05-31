import Layout from '@components/common/Layout'
import { Button } from '@components/ui/Button'
import { HOME } from '@utils/url-path'
import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
        <img
          src="/vercel.svg"
          alt="LensTube"
          draggable={false}
          height={100}
          width={100}
        />
        <div className="py-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">Oops, Lost‽</h1>
          <div className="mb-6">This page could not be found.</div>
          <Link href={HOME} passHref={true}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
