import MetaTags from '@components/Common/MetaTags'
import { STATIC_ASSETS, TAPE_APP_NAME } from '@dragverse/constants'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

const Custom404 = () => {
  return (
    <>
      <MetaTags title="Not found" />
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 text-center">
        <div className="mb-10">
          <img
            src={`${STATIC_ASSETS}/images/illustrations/404.gif`}
            draggable={false}
            height={200}
            width={200}
            alt={TAPE_APP_NAME}
          />
        </div>
        <h1 className="text-4xl font-bold">404 👀 FASHION EMERGENCY</h1>
        <div className="mb-6">This page you are looking for could not be found. Maybe Drag Delusion? 💅 </div>
        <Link href="/">
          <Button highContrast variant="surface">
            Go Home
          </Button>
        </Link>
      </div>
    </>
  )
}

export default Custom404
