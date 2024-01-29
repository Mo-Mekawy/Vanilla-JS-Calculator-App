import handleErrMsg from "../../js/helpers/handleErrorMessage";

describe("test handleErrMsg", () => {
  const formatMsg = (msg) =>
    `<span style='color:#F44336;word-wrap:normal;word-break:normal'>${msg}</span>`;

  it("return unknow error when given invalid types", () => {
    expect(handleErrMsg({ message: "NaN" })).toBe(
      formatMsg("Unknown Error occurred")
    );

    expect(handleErrMsg(214)).toBe(formatMsg("Unknown Error occurred"));

    expect(handleErrMsg("any string")).toBe(
      formatMsg("Unknown Error occurred")
    );

    // should work because any error is an instance from Error class
    expect(handleErrMsg(new TypeError("nan"))).toBe(
      formatMsg("Math error. Not a Number")
    );
  });

  it("returns a math error when given NaN", () => {
    expect(handleErrMsg(new Error("nan"))).toBe(
      formatMsg("Math error. Not a Number")
    );

    expect(handleErrMsg(new Error("NAN"))).toBe(
      formatMsg("Math error. Not a Number")
    );
  });

  it("returns a syntax Error messages for each use case", () => {
    // parentheses error
    expect(handleErrMsg(new Error("test(test)test"))).toBe(
      formatMsg("syntax Error. Please check your parentheses.")
    );

    expect(handleErrMsg(new Error(")"))).toBe(
      formatMsg("syntax Error. Please check your parentheses.")
    );

    expect(handleErrMsg(new Error("("))).toBe(
      formatMsg("syntax Error. Please check your parentheses.")
    );

    // missing operand error
    expect(handleErrMsg(new Error("unexpected TEOF: EOF"))).toBe(
      formatMsg("syntax Error. Please write the next operand.")
    );

    // single dot error
    expect(handleErrMsg(new Error("any ."))).toBe(
      formatMsg("Invalid value. Single dot without a number.")
    );

    expect(handleErrMsg(new Error(".in expression"))).toBe(
      formatMsg("Invalid value. Single dot without a number.")
    );

    expect(handleErrMsg(new Error("."))).toBe(
      formatMsg("Invalid value. Single dot without a number.")
    );

    // extra symbol at end error
    expect(handleErrMsg(new Error("Expected TNAME"))).toBe(
      formatMsg("syntax Error. unexpected sybmol at end of equation.")
    );

    expect(handleErrMsg(new Error("Expected EOF"))).toBe(
      formatMsg("syntax Error. unexpected sybmol at end of equation.")
    );
  });

  it("return the default message when called with an unknown error.message", () => {
    expect(handleErrMsg(new Error("random message"))).toBe(
      formatMsg("syntax Error. Please check your equation.")
    );

    expect(handleErrMsg(new TypeError("random message"))).toBe(
      formatMsg("syntax Error. Please check your equation.")
    );

    expect(handleErrMsg(new Error("syntax error"))).toBe(
      formatMsg("syntax Error. Please check your equation.")
    );
  });
});
