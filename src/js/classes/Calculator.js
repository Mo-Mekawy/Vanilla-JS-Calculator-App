/**
 * @module Calculator
 */

import { Parser } from "expr-eval";
import beautifyInput from "../helpers/beautifyInput";
import validateDotAddition from "../helpers/validateDotAddition";
import handleErrMsg from "../helpers/handleErrorMessage";

/**
 * Class to create a Calculator object
 * that does appending input, computing result and displaying output
 */
export default class Calculator {
  /**
   *
   * @param {Element} inputEl
   * @param {Element} outputEl
   * @description validates the constructor arguments
   * @returns {void}
   * @throws {SyntaxError} if missing an argument
   * @throws {TypeError} if arguments weren't of type Elements
   * @throws {TypeError} if arguments weren't different elements
   */
  static checkArgumentErrors(inputEl, outputEl) {
    // check for missing arguments
    if (inputEl === undefined || outputEl === undefined)
      throw new SyntaxError("Missing argument (should pass two Dom elements)");

    // if input or output weren't Dom elements
    if (!(inputEl instanceof Element) || !(outputEl instanceof Element))
      throw new TypeError("Both parameters must be a Dom Element");

    // if input and output are the same element
    if (inputEl === outputEl)
      throw new TypeError("Both parameters must be different elements");
  }

  /**
   *
   * @param {Element} inputEl the element to display the input in
   * @param {Element} outputEl the element to display the output in
   */
  constructor(inputEl, outputEl) {
    Calculator.checkArgumentErrors(inputEl, outputEl);

    /**
     *
     * @property {Element} inputEl the element to display the input in
     */
    this.inputEl = inputEl;
    /**
     * @property {Element} outputEl the element to display the output in
     */
    this.outputEl = outputEl;

    this.clearAll();
  }

  /**
   * @property {Function} comput computes the equation in this.input and returns the result
   * @returns {(string|number)} a number representing the result or a string in case an error happened
   */
  comput() {
    if (this.input === "") return 0;

    try {
      const result = Parser.evaluate(this.input);
      if (Number.isNaN(result)) throw new Error("NaN");
      return result;
    } catch (err) {
      return handleErrMsg(err);
    }
  }

  /**
   * @property {Function} appendInput appends the char to the end of the equation and displays it
   * @param {string} val
   * @returns {void}
   */
  appendInput(val) {
    if (typeof val !== "string") return;

    if (val === "." && !validateDotAddition(this.input)) return;

    // if the last input was an operator and trying to add another one
    // replace the last one with the new instead of just adding it
    const isOperator = (str) => ["+", "-", "/", "*"].includes(str);
    if (isOperator(val) && isOperator(this.input[this.input.length - 1]))
      this.removeLast();

    this.input += val;
    this.inputEl.innerHTML += beautifyInput(val);
  }

  /**
   * @property {Function} displayOutput display the formatted sum or the error message
   * @param {(string|number)} sum string in case it were an error and number if it were the actual sum
   * @returns {void}
   */
  displayOutput(sum) {
    // if sum is NaN as a string then it is an error message element
    if (typeof sum === "string" && Number.isNaN(parseFloat(sum))) {
      this.outputEl.innerHTML = sum;
      return;
    }

    // Convert to number if the sum were in string format
    const sumAsNumber = typeof sum === "string" ? parseFloat(sum) : sum;
    this.outputEl.innerHTML = sumAsNumber.toLocaleString("en-US");
  }

  /**
   * @property {Function} removeLast removes the last input char
   * @returns {void}
   */
  removeLast() {
    // check if there is an input to remove from
    if (this.input === "") return;

    this.input = this.input.slice(0, -1); // remove last char

    // remove last child if it were an element (bracket or operator)
    if (this.inputEl.lastChild.nodeType === 1) {
      this.inputEl.removeChild(this.inputEl.lastChild);
      return;
    }

    // remove the last char if it was a number or dot (text node)
    this.inputEl.innerHTML = this.inputEl.innerHTML.slice(0, -1);
  }

  /**
   * @property {Function} clearAll clears the input and output (elements and strings)
   * @returns {void}
   */
  clearAll() {
    // the input equation and the output num
    /**
     * @property {string} input the user input equation
     */
    this.input = "";
    /**
     * @property {string} output the output to work on
     */
    this.output = "";

    this.inputEl.innerHTML = "";
    this.outputEl.innerHTML = "";
  }
}
