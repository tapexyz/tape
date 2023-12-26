import type { ProfileInterestTypes } from '@tape.xyz/lens'
import type { ProfileInterest } from '@tape.xyz/lens/custom-types'

export const sanitizeProfileInterests = (
  profileInterests: ProfileInterestTypes[]
) => {
  if (!profileInterests) {
    return []
  }
  const interests: Array<ProfileInterest> = []
  const categories = profileInterests.filter(
    (interest) => !interest.includes('__')
  )
  categories.forEach((category) => {
    const subCategories = profileInterests
      .filter(
        (interest) => interest.includes(category) && interest.includes('__')
      )
      .map((item) => {
        return {
          id: item,
          label: item.toLowerCase().split('__')[1].replaceAll('_', ' & ')
        }
      })
    interests.push({
      category: {
        id: category,
        label: category.replaceAll('_', ' & ').toLowerCase()
      },
      subCategories
    })
  })
  return interests
}
