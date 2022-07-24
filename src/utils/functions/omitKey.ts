const omitKey = (object: any, key: string) => {
  delete object[key]
  return object
}

export default omitKey
