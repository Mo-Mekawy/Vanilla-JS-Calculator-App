const createPromise = () => {
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

const logArr = async (promise) => {
  try {
    const finalArr = await promise;
    alert(`this is the final array: ${finalArr}`);
  } catch (error) {
    console.log(error);
  }
};

const promise = createPromise();
logArr(promise);
