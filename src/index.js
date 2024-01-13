export const createPromise = () => {
  const arr1 = [1, 2, 3, 4];
  const arr2 = [1, 3, 6, 2];

  const myPromise = new Promise((resolve) => {
    setTimeout(() => {
      const arr3 = arr1.filter((num) => arr2.includes(num));
      resolve(arr3);
    }, 2000);
  });

  return myPromise;
};

export const logArr = async (promise) => {
  try {
    const finalArr = await promise;
    return `this is the final array: ${finalArr}`;
  } catch (error) {
    return error;
  }
};

const promise = createPromise();
alert(logArr(promise));
