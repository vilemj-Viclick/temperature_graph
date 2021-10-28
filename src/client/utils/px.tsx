interface IPx {
  (num: 0): 0;

  (num: number): 0 | string;
}

const roundTo2Digits = (num: number) =>
  Math.round(num * 100) / 100;

export const px = (((num: number) => {
  if (Number.isFinite(num) && (Math.abs(num) <= Number.MAX_SAFE_INTEGER)) {
    const roundedNumber = roundTo2Digits(num);
    if (roundedNumber === 0) {
      return 0;
    }
    return `${roundedNumber}px`;
  }
  else {
    throw new Error(`${num} is not a valid value for conversion.`);
  }
}) as IPx);
