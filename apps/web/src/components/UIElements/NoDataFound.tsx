import { TAPE_LOGO } from '@dragverse/constants'
import clsx from 'clsx'

export const NoDataFound = ({
  text = 'No Data Found',
  withImage = false,
  isCenter = false,
  className = ''
}) => {
  return (
    <div
      className={clsx('flex flex-col space-y-6 rounded-lg p-6', className, {
        'items-center justify-center': isCenter
      })}
    >
      {withImage && (
        <img
          src={`${TAPE_LOGO}`}
          height={70}
          width={70}
          alt="zero trace!"
          draggable={false}
        />
      )}
      <div
        className={clsx('text-sm font-medium', {
          'text-center': isCenter
        })}
      >
        {text}
      </div>
    </div>
  )
}
