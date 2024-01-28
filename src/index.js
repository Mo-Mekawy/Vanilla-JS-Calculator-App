import "./assets/scss/main.scss";
import Calculator from "./js/Calculator";
import scrollOnChange from "./js/animations/inputEl";

// select all needed buttons and display elements
const clearBtn = document.querySelector("[data-clear]");
const delBtn = document.querySelector("[data-delete]");
const equalBtn = document.querySelector("[data-equals]");
const keyBtns = document.querySelectorAll("[data-key]");
const inputEL = document.querySelector("[data-input]");
const outputEl = document.querySelector("[data-output]");

// always make the last input visible
scrollOnChange(inputEL);

const calculator = new Calculator(inputEL, outputEl);

keyBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    calculator.appendInput(e.target.dataset.key);
  });
});

equalBtn.addEventListener("click", () => {
  calculator.comput();
  calculator.displayOutput();
});

clearBtn.addEventListener("click", () => {
  calculator.clearAll();
});

delBtn.addEventListener("click", () => {
  calculator.removeLast();
});
