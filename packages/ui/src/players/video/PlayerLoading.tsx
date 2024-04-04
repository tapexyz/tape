import type { ReactNode } from 'react'

export const PlayerLoading = ({
  title,
  description
}: {
  title?: ReactNode
  description?: ReactNode
}) => (
  <div className="relative flex aspect-video h-full w-full flex-col-reverse gap-3 overflow-hidden rounded-sm bg-gray-100 px-3 py-2 dark:bg-gray-900">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-16 animate-pulse overflow-hidden rounded-lg bg-gray-200 md:h-7 md:w-20 dark:bg-gray-800" />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
    <div className="h-2 w-full animate-pulse overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800" />

    {title && (
      <div className="absolute inset-10 flex flex-col items-center justify-center gap-1 text-center">
        <span className="text-lg font-medium text-white">{title}</span>
        {description && (
          <span className="text-sm text-white/80">{description}</span>
        )}
      </div>
    )}
  </div>
)
