/* eslint-disable no-unused-vars */
const omitKey = (object: any, key: string) => {
  const { [key]: omitted, ...rest } = object
  return rest
}

export default omitKey
