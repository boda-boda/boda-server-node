export const timer = (second: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, second * 1000);
  });
};
