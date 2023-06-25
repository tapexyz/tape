import type { ProfileInterest } from '@lenstube/lens/custom-types'

const sanitizeProfileInterests = (profileInterests: string[]) => {
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
          label: item.toLowerCase().split('__')[1].replaceAll('_', ' & '),
          id: item
        }
      })
    interests.push({
      category: {
        label: category.replaceAll('_', ' & ').toLowerCase(),
        id: category
      },
      subCategories
    })
  })
  return interests
}

export default sanitizeProfileInterests
