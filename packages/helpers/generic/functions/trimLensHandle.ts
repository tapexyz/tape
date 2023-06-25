export const trimLensHandle = (handle: string) => {
  if (!handle) {
    return handle
  }
  const name = handle.replace('.lens', '').replace('.test', '')
  return name
}
