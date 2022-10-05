export const formatNumber = (num: number) => {
const attribute = 'k'
if (num > 999 && num < 1000000) {
    return `(num / 1000).toFixed(0) ${attribute}`
  } else if (num > 1000000) {
    return `(num / 1000000).toFixed(0) ${attribute}`
  } else if (num < 900) {
    return num
  }
}
