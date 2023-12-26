import clsx from 'clsx'
import type { SVGProps } from 'react'
import React from 'react'

const ThreeDotsOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 20 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={clsx(props.className, 'rotate-90')}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.25 3C0.25 1.48122 1.48122 0.25 3 0.25C4.51878 0.25 5.75 1.48122 5.75 3C5.75 4.51878 4.51878 5.75 3 5.75C1.48122 5.75 0.25 4.51878 0.25 3ZM3 1.75C2.30964 1.75 1.75 2.30964 1.75 3C1.75 3.69036 2.30964 4.25 3 4.25C3.69036 4.25 4.25 3.69036 4.25 3C4.25 2.30964 3.69036 1.75 3 1.75Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.25 3C7.25 1.48122 8.48122 0.25 10 0.25C11.5188 0.25 12.75 1.48122 12.75 3C12.75 4.51878 11.5188 5.75 10 5.75C8.48122 5.75 7.25 4.51878 7.25 3ZM10 1.75C9.30964 1.75 8.75 2.30964 8.75 3C8.75 3.69036 9.30964 4.25 10 4.25C10.6904 4.25 11.25 3.69036 11.25 3C11.25 2.30964 10.6904 1.75 10 1.75Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 0.25C15.4812 0.25 14.25 1.48122 14.25 3C14.25 4.51878 15.4812 5.75 17 5.75C18.5188 5.75 19.75 4.51878 19.75 3C19.75 1.48122 18.5188 0.25 17 0.25ZM15.75 3C15.75 2.30964 16.3096 1.75 17 1.75C17.6904 1.75 18.25 2.30964 18.25 3C18.25 3.69036 17.6904 4.25 17 4.25C16.3096 4.25 15.75 3.69036 15.75 3Z"
      fill="currentColor"
    />
  </svg>
)

export default ThreeDotsOutline
