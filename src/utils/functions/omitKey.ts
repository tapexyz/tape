const omitKey = (object: { [key: string]: any }, key: string) => {
  const cloned = { ...object } // cloning to fix a reference issue recently after v13
  delete cloned[key]
  return cloned
}

export default omitKey
