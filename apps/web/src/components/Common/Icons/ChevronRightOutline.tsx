import type { SVGProps } from 'react'
import React from 'react'

const ChevronRightOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 8 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.51192 0.430571C0.826414 0.161005 1.29989 0.197426 1.56946 0.51192L7.56946 7.51192C7.8102 7.79279 7.8102 8.20724 7.56946 8.48811L1.56946 15.4881C1.29989 15.8026 0.826414 15.839 0.51192 15.5695C0.197426 15.2999 0.161005 14.8264 0.430571 14.5119L6.01221 8.00001L0.430571 1.48811C0.161005 1.17361 0.197426 0.700138 0.51192 0.430571Z"
      fill="currentColor"
    />
  </svg>
)

export default ChevronRightOutline
