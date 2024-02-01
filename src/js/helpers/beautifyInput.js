// @ts-check
/**
 * @module  js/helpers/beautifyInput
 *
 */

/**
 * @function beautifyInput
 * @param {string} input the character format
 * @returns {string} the same input if it were a number
 * and a formatted element if it were a bracket or operator
 */
export default function beautifyInput(input) {
  const operators = { "+": "+", "/": "÷", "*": "×", "-": "−" };

  // if input is a bracket
  if (input === ")" || input === "(")
    return `<span class="bracket"> ${input} </span>`;

  // if input is an operator
  if (operators[input])
    return `<span class="operator"> ${operators[input]} </span>`;

  return input; // if it isn't an operator nor a bracket
}
