const omitKey = (object: { [key: string]: any }, key: string) => {
  delete object[key]
  return object
}

export default omitKey
