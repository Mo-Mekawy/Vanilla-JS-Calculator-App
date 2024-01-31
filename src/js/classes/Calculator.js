import { Parser } from "expr-eval";
import beautifyInput from "../helpers/beautifyInput";
import validateDotAddition from "../helpers/validateDotAddition";
import handleErrMsg from "../helpers/handleErrorMessage";

export default class Calculator {
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

  constructor(inputEl, outputEl) {
    Calculator.checkArgumentErrors(inputEl, outputEl);

    this.inputEl = inputEl;
    this.outputEl = outputEl;
    this.clearAll();
  }

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

  clearAll() {
    // the input equation and the output num
    this.input = "";
    this.output = "";

    this.inputEl.innerHTML = "";
    this.outputEl.innerHTML = "";
  }
}
