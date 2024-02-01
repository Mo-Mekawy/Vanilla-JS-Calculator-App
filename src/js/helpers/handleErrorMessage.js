// @ts-check
/**
 * @module  js/helpers/handleErrMsg
 *
 */

/**
 * @function handleErrMsg
 * @param {Error} err the err object containing the message
 * @returns {string} an element containing the error message
 */
export default function handleErrMsg(err) {
  /**
   * @param {string} msg the message to wrap in an element
   * @returns {string} an element containing the message
   */
  const wrapMsg = (msg) =>
    `<span style='color:#F44336;word-wrap:normal;word-break:normal'>${msg}</span>`;

  if (!(err instanceof Error) || err.message === undefined)
    return wrapMsg("Unknown Error occurred");

  if (err.message.toLowerCase() === "nan")
    return wrapMsg("Math error. Not a Number");

  if (err.message.includes("(") || err.message.includes(")"))
    return wrapMsg("syntax Error. Please check your parentheses.");

  if (err.message === "unexpected TEOF: EOF")
    return wrapMsg("syntax Error. Please write the next operand.");

  if (err.message.includes("function"))
    return wrapMsg(
      "syntax Error. An operator must separate between parentheses and numbers"
    );

  if (err.message.includes("."))
    return wrapMsg("Invalid value. Single dot without a number.");

  if (
    err.message.includes("Expected TNAME") ||
    err.message.includes("Expected EOF")
  )
    return wrapMsg("syntax Error. unexpected symbol at end of equation.");

  return wrapMsg("syntax Error. Please check your equation.");
}
