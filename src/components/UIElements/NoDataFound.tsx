import React from 'react'

export const NoDataFound = ({ text = 'No data found' }) => {
  return (
    <div className="p-1 space-y-1 rounded-lg">
      <div className="text-sm font-medium">{text}</div>
    </div>
  )
}
