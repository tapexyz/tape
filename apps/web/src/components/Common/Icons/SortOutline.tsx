import type { SVGProps } from 'react'
import React from 'react'

const SortOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 18 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H17C17.4142 0.25 17.75 0.585786 17.75 1C17.75 1.41421 17.4142 1.75 17 1.75H1C0.585786 1.75 0.25 1.41421 0.25 1ZM0.25 6C0.25 5.58579 0.585786 5.25 1 5.25H12C12.4142 5.25 12.75 5.58579 12.75 6C12.75 6.41421 12.4142 6.75 12 6.75H1C0.585786 6.75 0.25 6.41421 0.25 6ZM0.25 11C0.25 10.5858 0.585786 10.25 1 10.25H6C6.41421 10.25 6.75 10.5858 6.75 11C6.75 11.4142 6.41421 11.75 6 11.75H1C0.585786 11.75 0.25 11.4142 0.25 11Z"
      fill="currentColor"
    />
  </svg>
)

export default SortOutline
