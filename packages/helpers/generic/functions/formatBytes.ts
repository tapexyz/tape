export const formatBytes = (bytes: number) => {
  if (bytes && bytes > 0) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.min(
      parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10),
      sizes.length - 1
    )
    return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`
  }
  return 'n/a'
}
