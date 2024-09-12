export const formatNumber = (num: number) => {
  let numberToFormat = num;
  if (numberToFormat < 0) {
    numberToFormat = Math.abs(num);
  }
  if (numberToFormat > 999 && numberToFormat < 1000000) {
    return `${(numberToFormat / 1000).toPrecision(3)}k`;
  }
  if (numberToFormat > 1000000) {
    return `${(numberToFormat / 1000000).toPrecision(3)}m`;
  }
  if (numberToFormat < 1000) {
    return numberToFormat;
  }
};
