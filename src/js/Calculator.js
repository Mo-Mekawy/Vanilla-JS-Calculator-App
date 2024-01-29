import { Parser } from "expr-eval";
import beautifyInput from "./helpers/beautifyInput";
import validateDotAddition from "./helpers/validateDotAddition";

export default class Calculator {
  constructor(inputEl, outputEl) {
    this.inputEl = inputEl;
    this.outputEl = outputEl;

    this.clearAll();
  }

  comput() {
    if (this.input === "") return 0;

    return Parser.evaluate(this.input);
  }

  appendInput(val) {
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
    this.outputEl.innerText = sum.toLocaleString("en-US");
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
    this.outputEl.innerText = "";
  }
}
