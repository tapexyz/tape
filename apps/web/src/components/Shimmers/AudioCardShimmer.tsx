import { tw } from '@tape.xyz/browser'

export const AudioCardShimmer = ({ rounded = true }) => {
  return (
    <div className={tw('w-full', rounded && 'rounded-xl')}>
      <div className="animate-shimmer flex flex-col space-x-2">
        <div
          className={tw(
            'h-24 w-full bg-gray-200 md:h-40 dark:bg-gray-800',
            rounded && 'rounded-large'
          )}
        />
      </div>
    </div>
  )
}
