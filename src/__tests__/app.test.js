// Import the init function
import init from "../js/app";
import Calculator from "../js/classes/Calculator";
import scrollOnChange from "../js/animations/scrollOnChange";

// Mock the scrollOnChange function
jest.mock("../js/animations/scrollOnChange", () => jest.fn());

// Mock the Calculator class
const mockAppendInput = jest.fn();
const mockComput = jest.fn(() => "mock comput");
const mockDisplayOutput = jest.fn();
const mockClearAll = jest.fn();
const mockRemoveLast = jest.fn();
jest.mock("../js/classes/Calculator", () =>
  jest.fn().mockImplementation(() => ({
    appendInput: mockAppendInput,
    comput: mockComput,
    displayOutput: mockDisplayOutput,
    clearAll: mockClearAll,
    removeLast: mockRemoveLast,
  }))
);

let clearBtn;
let delBtn;
let equalBtn;
let inputEL;
let outputEl;
let keyBtns;
const keys = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "+",
  "-",
  "*",
  "/",
  "(",
  ")",
];

// Mock DOM elements and clear the calculator mock
beforeEach(() => {
  keyBtns = [];
  jest.clearAllMocks();

  // add the clear, delete and equals buttons
  clearBtn = document.createElement("button");
  clearBtn.setAttribute("data-clear", "");
  document.body.appendChild(clearBtn);

  delBtn = document.createElement("button");
  delBtn.setAttribute("data-delete", "");
  document.body.appendChild(delBtn);

  equalBtn = document.createElement("button");
  equalBtn.setAttribute("data-equals", "");
  document.body.appendChild(equalBtn);

  // add input and output Elemetns
  inputEL = document.createElement("input");
  inputEL.setAttribute("data-input", "");
  document.body.appendChild(inputEL);

  outputEl = document.createElement("output");
  outputEl.setAttribute("data-output", "");
  document.body.appendChild(outputEl);

  // add key buttons
  keys.forEach((key) => {
    const btn = document.createElement("button");
    btn.setAttribute("data-key", key);
    document.body.appendChild(btn);
    keyBtns.push(btn);
  });
});

afterEach(() => {
  clearBtn.remove();
  delBtn.remove();
  equalBtn.remove();
  keyBtns.forEach((btn) => btn.remove());
  inputEL.remove();
  outputEl.remove();
});
// =========== KEYBOARD TEST MUST BE THE FIRST TEST =========== (since it depends on the event listeners set on the document which aren't reset with each test)
describe("clicks the button corresponding to the keyboard key pressed", () => {
  function simulateKeyPress(key) {
    // Create a new keyboard event
    const event = new KeyboardEvent("keydown", {
      key,
      keyCode: key.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });

    // Dispatch the event
    document.dispatchEvent(event);
  }

  it("click the button with dataset='key' when that 'key' is pressed", () => {
    init();

    keys.forEach((key, index) => {
      const btn = keyBtns[index];
      btn.click = jest.fn();

      simulateKeyPress(key);
      expect(btn.click).toHaveBeenCalledTimes(1);
    });
  });

  it("click the equalBtn when '=' or 'Enter' keys are pressed", () => {
    init();
    equalBtn.click = jest.fn();

    simulateKeyPress("Enter");
    simulateKeyPress("=");
    expect(equalBtn.click).toHaveBeenCalledTimes(2);
  });

  it("click the clearBtn when 'Escape' key is pressed", () => {
    init();
    clearBtn.click = jest.fn();

    simulateKeyPress("Escape");
    expect(clearBtn.click).toHaveBeenCalledTimes(1);
  });

  it("click the delBtn when 'Backspace' key is pressed", () => {
    init();
    delBtn.click = jest.fn();

    simulateKeyPress("Backspace");
    expect(delBtn.click).toHaveBeenCalledTimes(1);
  });
});

describe("init function basic behavior", () => {
  it("initializes calculator object", () => {
    init();
    expect(Calculator).toHaveBeenCalledWith(inputEL, outputEl);
  });

  it("calls scrollOnChange with input element", () => {
    init();
    expect(scrollOnChange).toHaveBeenCalledWith(inputEL);
  });
});

describe("test adding click event listeners to each button", () => {
  it("calls the appendInput method with the right value when a button with the key dataset is clicked", () => {
    // Call the init function
    init();

    // Simulate click event on all btns
    keyBtns.forEach((btn, index) => {
      btn.click();
      expect(mockAppendInput).toHaveBeenNthCalledWith(
        index + 1,
        btn.dataset.key
      );
    });
  });

  it("calls the comput and displayOutput methods when equalBtn is clicked", () => {
    init();

    equalBtn.click();

    expect(mockComput).toHaveBeenCalled();
    expect(mockDisplayOutput).toHaveBeenCalledWith("mock comput");
  });

  it("calls the clearAll method when clearBtn is clicked", () => {
    init();

    clearBtn.click();

    expect(mockClearAll).toHaveBeenCalled();
  });

  it("calls the removeLast method when delBtn is clicked", () => {
    init();

    delBtn.click();

    expect(mockRemoveLast).toHaveBeenCalled();
  });
});
