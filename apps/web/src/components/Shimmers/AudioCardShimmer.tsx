import clsx from 'clsx'

export const AudioCardShimmer = ({ rounded = true }) => {
  return (
    <div className={clsx('w-full', rounded && 'rounded-xl')}>
      <div className="flex animate-pulse flex-col space-x-2">
        <div
          className={clsx(
            'h-24 w-full bg-gray-200 md:h-40 dark:bg-gray-800',
            rounded && 'rounded-large'
          )}
        />
      </div>
    </div>
  )
}
