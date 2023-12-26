import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import Link from 'next/link'

const Thanks = () => {
  return (
    <div className="space-y-5">
      <div className="flex h-[25vh] w-full items-center justify-center">
        <div className="relative text-center">
          <div className="flex items-center space-x-2 text-3xl font-bold md:text-4xl">
            Thanks for supporting our community!
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-xl grid-cols-2 place-items-start gap-12">
        <Link
          className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1"
          href={`https://cloudflare.com/?utm_source=${TAPE_APP_NAME}`}
        >
          <img
            alt="cloudflare"
            className="size-20 flex-none rounded-full"
            draggable={false}
            src={`${STATIC_ASSETS}/images/cloudflare.svg`}
          />
          <h6 className="px-5 text-xl">Cloudflare</h6>
        </Link>
        <Link
          className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1"
          href={`https://4everland.org/?utm_source=${TAPE_APP_NAME}`}
        >
          <img
            alt="lvpr"
            className="size-20 flex-none rounded-full"
            draggable={false}
            src={`${STATIC_ASSETS}/images/4everland.png`}
          />
          <h6 className="px-5 text-xl">4everland</h6>
        </Link>
        <Link
          className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1"
          href={`https://livepeer.studio/?utm_source=${TAPE_APP_NAME}`}
        >
          <img
            alt="lvpr"
            className="size-20 flex-none rounded-full"
            draggable={false}
            src={`${STATIC_ASSETS}/images/livepeer.png`}
          />
          <h6 className="px-5 text-xl">Livepeer</h6>
        </Link>
        <Link
          className="col-span-1 flex items-center justify-center md:col-span-2 lg:col-span-1"
          href={`https://betteruptime.com/?utm_source=${TAPE_APP_NAME}`}
        >
          <img
            alt="betteruptime"
            className="size-20 flex-none rounded-full"
            draggable={false}
            src={`${STATIC_ASSETS}/images/betteruptime.png`}
          />
          <h6 className="px-5 text-xl">Better Uptime</h6>
        </Link>
      </div>
    </div>
  )
}

export default Thanks
