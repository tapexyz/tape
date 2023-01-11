export const getRandomProfilePicture = (address: string) => {
  return `https://cdn.stamp.fyi/avatar/eth:${address.toLowerCase()}?s=300`
}
