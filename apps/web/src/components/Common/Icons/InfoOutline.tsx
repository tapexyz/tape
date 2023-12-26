import type { SVGProps } from 'react'
import React from 'react'

const InfoOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 16.75C11.4142 16.75 11.75 16.4142 11.75 16V10C11.75 9.58579 11.4142 9.25 11 9.25C10.5858 9.25 10.25 9.58579 10.25 10V16C10.25 16.4142 10.5858 16.75 11 16.75Z"
      fill="currentColor"
    />
    <path
      d="M11 6C11.5523 6 12 6.44772 12 7C12 7.55228 11.5523 8 11 8C10.4477 8 10 7.55228 10 7C10 6.44772 10.4477 6 11 6Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.25 11C0.25 5.06294 5.06294 0.25 11 0.25C16.9371 0.25 21.75 5.06294 21.75 11C21.75 16.9371 16.9371 21.75 11 21.75C5.06294 21.75 0.25 16.9371 0.25 11ZM11 1.75C5.89137 1.75 1.75 5.89137 1.75 11C1.75 16.1086 5.89137 20.25 11 20.25C16.1086 20.25 20.25 16.1086 20.25 11C20.25 5.89137 16.1086 1.75 11 1.75Z"
      fill="currentColor"
    />
  </svg>
)

export default InfoOutline
