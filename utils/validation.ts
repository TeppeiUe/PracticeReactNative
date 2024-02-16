/**
 * 自然数チェック
 */
export const checkNaturalNumber = (val: string) => {
  const regExp = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return regExp.test(val);
};

/**
 * 正の数チェック
 */
export const checkPositiveNumber = (val: string) => {
  const regExp = new RegExp(/^([1-9]\d*|0)(\.\d+)?$/);
  return regExp.test(val);
};
