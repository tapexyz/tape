import { tw } from '@dragverse/browser';
import { TAPE_LOGO } from '@dragverse/constants';

export const NoDataFound = ({
  text = 'No Data Found',
  withImage = false,
  isCenter = false,
  className = ''
}) => {
  return (
    <div
      className={tw('flex flex-col space-y-6 rounded-lg p-6', className, {
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
        className={tw('text-sm font-medium', {
          'text-center': isCenter
        })}
      >
        {text}
      </div>
    </div>
  )
}
