import React from 'react'

import ProfileShimmer from './ProfileShimmer'

const RecommendedShimmer = () => {
  return (
    <div className="flex items-center pb-4 space-x-6 overflow-auto no-scrollbar">
      <ProfileShimmer />
      <ProfileShimmer />
      <ProfileShimmer />
      <ProfileShimmer />
      <ProfileShimmer />
      <ProfileShimmer />
      <ProfileShimmer />
      <ProfileShimmer />
    </div>
  )
}

export default RecommendedShimmer
