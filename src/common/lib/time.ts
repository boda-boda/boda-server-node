export const timer = (second: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, second * 1000);
  });
};

export const toTimeString = (numb: number) => {
  return numb >= 10 ? `${numb}` : `0${numb}`;
};
