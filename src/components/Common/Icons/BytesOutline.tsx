import React from 'react'
import { SVGProps } from 'react'

const BytesOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={22}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 1.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5Zm5.48 18.5A10.745 10.745 0 0 0 21.75 11C21.75 5.063 16.937.25 11 .25S.25 5.063.25 11 5.063 21.75 11 21.75h10a.75.75 0 0 0 0-1.5h-4.52ZM11 5.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM6.5 10.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 11a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Zm11.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM11 14.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z"
      fill="#1C274C"
    />
  </svg>
)

export default BytesOutline
