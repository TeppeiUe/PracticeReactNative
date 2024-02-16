export const checkNaturalNumber = (val: string) => {
  const regExp = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return regExp.test(val);
};

export const checkPositiveNumber = (val: string) => {
  const regExp = new RegExp(/^([1-9]\d*|0)(\.\d+)?$/);
  return regExp.test(val);
};
