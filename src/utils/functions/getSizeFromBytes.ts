export const getSizeFromBytes = (bytes: number) => {
  if (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.min(
      parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10),
      sizes.length - 1
    )
    return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`
  }
  return 'n/a'
}

export const isLessThan100MB = (bytes: number | undefined) =>
  bytes ? (bytes / 1024 ** 2 < 100 ? true : false) : false
