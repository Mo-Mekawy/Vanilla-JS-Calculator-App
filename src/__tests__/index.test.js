import { logArr, createPromise } from "../index";

describe("test are cute", () => {
  test("logArr tests", async () => {
    const promise = Promise.resolve([1, 2, 3]);
    const result = await logArr(promise);
    expect(result).toEqual(`this is the final array: 1,2,3`);
  });

  test("craetePromise", () => {
    expect(createPromise()).toEqual(expect.any(Promise));
  });
});
