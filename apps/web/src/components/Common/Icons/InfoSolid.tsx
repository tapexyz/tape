import type { SVGProps } from 'react'
import React from 'react'

const InfoSolid = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM10 15.75C10.4142 15.75 10.75 15.4142 10.75 15V9C10.75 8.58579 10.4142 8.25 10 8.25C9.58579 8.25 9.25 8.58579 9.25 9V15C9.25 15.4142 9.58579 15.75 10 15.75ZM10 5C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7C9.44771 7 9 6.55228 9 6C9 5.44772 9.44771 5 10 5Z"
      fill="currentColor"
    />
  </svg>
)

export default InfoSolid
