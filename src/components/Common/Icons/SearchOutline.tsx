import React from 'react'
import { SVGProps } from 'react'

const SearchOutline = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10.5 1.75a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5ZM.25 10.5C.25 4.84 4.84.25 10.5.25S20.75 4.84 20.75 10.5c0 2.56-.939 4.902-2.491 6.698l3.271 3.272a.75.75 0 1 1-1.06 1.06l-3.272-3.271A10.21 10.21 0 0 1 10.5 20.75C4.84 20.75.25 16.16.25 10.5Z"
      fill="#1C274C"
    />
  </svg>
)

export default SearchOutline
