import Calculator from "./classes/Calculator";
import scrollOnChange from "./animations/inputEl";

export default function init() {
  // select all needed buttons and display elements
  const clearBtn = document.querySelector("[data-clear]");
  const delBtn = document.querySelector("[data-delete]");
  const equalBtn = document.querySelector("[data-equals]");
  const keyBtns = document.querySelectorAll("[data-key]");
  const inputEL = document.querySelector("[data-input]");
  const outputEl = document.querySelector("[data-output]");

  // always make the last input visible
  scrollOnChange(inputEL);

  // create the calculator object
  const calculator = new Calculator(inputEL, outputEl);

  // add event listeners for the buttons
  keyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      calculator.appendInput(e.target.dataset.key);
    });
  });

  equalBtn.addEventListener("click", () => {
    const result = calculator.comput();
    calculator.displayOutput(result);
  });

  clearBtn.addEventListener("click", () => {
    calculator.clearAll();
  });

  delBtn.addEventListener("click", () => {
    calculator.removeLast();
  });

  // allow keyboard use
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Enter":
      case "=":
        equalBtn.click();
        break;
      case "Backspace":
        delBtn.click();
        break;
      case "Escape":
        clearBtn.click();
        break;
      default:
        if (/^[0-9.+\-*/()]$/.test(e.key))
          document.querySelector(`[data-key="${e.key}"]`).click();
    }
  });
}
