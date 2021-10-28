export const once = <A extends any[], R, T>(
  fn: (this: T, ...arg: A) => R,
): ((this: T, ...arg: A) => R | undefined) => {
  let done = false;
  let result: R;
  return function (this: T, ...args: A) {
    if (!done) {
      result = fn.apply(this, args);
      done = true;
    }
    return result;
  };
};
