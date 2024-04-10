/**
 * 自然数チェック
 */
export const checkNaturalNumber = (val: string) => {
  const regExp = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return regExp.test(val);
};
