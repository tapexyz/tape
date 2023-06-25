export const formatNumber = (num: number) => {
  if (num < 0) {
    num = Math.abs(num)
  }
  if (num > 999 && num < 1000000) {
    return `${(num / 1000).toPrecision(3)}k`
  } else if (num > 1000000) {
    return `${(num / 1000000).toPrecision(3)}m`
  } else if (num < 1000) {
    return num
  }
}
