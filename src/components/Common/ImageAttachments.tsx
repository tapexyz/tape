import React, { FC } from 'react'

type Props = {
  attachments: Array<{ original: { url: string } }>
}

const ImageAttachments: FC<Props> = ({ attachments }) => {
  return (
    <div className="flex flex-wrap items-center space-x-2">
      {attachments.map((attachment) => (
        <span key={`${attachment.original}_key`}>
          <img
            src={attachment.original?.url}
            alt="attachment"
            className="object-cover w-10 h-10 rounded"
          />
        </span>
      ))}
    </div>
  )
}

export default ImageAttachments
