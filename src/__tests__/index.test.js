// this function calls scrollTo method which is undefined when testing and there is really no need for animation when testing
jest.mock("../js/animations/scrollOnChange");

//  set up DOM elements
document.body.innerHTML = `
<div data-input></div>
<div data-output></div>
<button data-key="0"></button>
<button data-key="1"></button>
<button data-key="2"></button>
<button data-key="3"></button>
<button data-key="4"></button>
<button data-key="5"></button>
<button data-key="6"></button>
<button data-key="7"></button>
<button data-key="8"></button>
<button data-key="9"></button>
<button data-key="."></button>
<button data-key="+"></button>
<button data-key="-"></button>
<button data-key="*"></button>
<button data-key="/"></button>
<button data-key="("></button>
<button data-key=")"></button>
<button data-clear></button>
<button data-delete></button>
<button data-equals></button>
`;

const inputEl = document.querySelector("[data-input]");
const outputEl = document.querySelector("[data-output]");

require("../index");

describe("Calculator integration tests", () => {
  const getEl = (key, value = null) => {
    const dataVal = value === null ? "" : `="${value}"`;
    return document.querySelector(`[data-${key}${dataVal}]`);
  };

  describe("valid equation tests", () => {
    it("should update input element when numbers are clicked", () => {
      getEl("key", "1").click();
      expect(inputEl.innerHTML).toBe("1");

      getEl("key", "2").click();
      expect(inputEl.innerHTML).toBe("12");

      getEl("key", "3").click();
      expect(inputEl.innerHTML).toBe("123");
    });

    it("should replace old operator when new operator is clicked", () => {
      getEl("key", "+").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> + </span>');

      getEl("key", "-").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> − </span>');

      getEl("key", "*").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> × </span>');

      getEl("key", "/").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> ÷ </span>');
    });

    it("should update input element with decimal point when clicked", () => {
      getEl("key", ".").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> ÷ </span>.');

      getEl("key", "2").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> ÷ </span>.2');
    });

    it("should not add new decimal point when it already exists", () => {
      getEl("key", ".").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> ÷ </span>.2');

      getEl("key", "5").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> ÷ </span>.25');
    });

    it("should delete last character when delete button is clicked", () => {
      getEl("delete").click();
      expect(inputEl.innerHTML).toBe('123<span class="operator"> ÷ </span>.2');
    });

    it("should update output element with correct result when equals button is clicked", () => {
      // Input: 123 / .2 => 615
      getEl("equals").click();
      expect(outputEl.innerHTML).toBe("615");
    });

    it("should clear input element when clear button is clicked", () => {
      getEl("clear").click();
      expect(inputEl.innerHTML).toBe("");
    });
  });

  describe("invalid equation tests", () => {
    afterEach(() => getEl("clear").click());

    const formatMsg = (msg) =>
      `<span style="color:#F44336;word-wrap:normal;word-break:normal">${msg}</span>`;

    it("should display 'Math error' for (0 / 0)", () => {
      // Input: 0 / 0
      getEl("key", "0").click();
      getEl("key", "/").click();
      getEl("key", "0").click();
      getEl("equals").click();

      expect(outputEl.innerHTML).toBe(formatMsg("Math error. Not a Number"));
    });

    it("should display 'Syntax Error' for missing operand after operator", () => {
      // Input: 5 +
      getEl("key", "5").click();
      getEl("key", "+").click();
      getEl("equals").click();
      expect(outputEl.innerHTML).toBe(
        formatMsg("syntax Error. Please write the next operand.")
      );

      getEl("clear").click();

      // Input: 5 + (3 *
      getEl("key", "5").click();
      getEl("key", "+").click();
      getEl("key", "(").click();
      getEl("key", "3").click();
      getEl("key", "*").click();
      getEl("equals").click();
      expect(outputEl.innerHTML).toBe(
        formatMsg("syntax Error. Please write the next operand.")
      );
    });

    it("should display 'Syntax Error' for unbalanced parentheses", () => {
      // Input: (5 + 3
      getEl("key", "(").click();
      getEl("key", "5").click();
      getEl("key", "+").click();
      getEl("key", "3").click();
      getEl("equals").click();

      expect(outputEl.innerHTML).toBe(
        formatMsg("syntax Error. Please check your parentheses.")
      );

      getEl("clear").click();

      // Input: ((5 + 3)
      getEl("key", "(").click();
      getEl("key", "(").click();
      getEl("key", "5").click();
      getEl("key", "+").click();
      getEl("key", "3").click();
      getEl("key", ")").click();
      getEl("equals").click();

      expect(outputEl.innerHTML).toBe(
        formatMsg("syntax Error. Please check your parentheses.")
      );
    });

    it("should display 'Invalid value' for single dots without digits", () => {
      // Input: .
      getEl("key", ".").click();
      getEl("equals").click();
      expect(outputEl.innerHTML).toBe(
        formatMsg("Invalid value. Single dot without a number.")
      );

      getEl("clear").click();

      // Input: 25 + .
      getEl("key", "2").click();
      getEl("key", "5").click();
      getEl("key", "+").click();
      getEl("key", ".").click();
      getEl("equals").click();
      expect(outputEl.innerHTML).toBe(
        formatMsg("Invalid value. Single dot without a number.")
      );
    });

    it("should display 'Syntax Error' for unexpected symbol at equation end", () => {
      // Input: (5 + 3))
      getEl("key", "(").click();
      getEl("key", "5").click();
      getEl("key", "+").click();
      getEl("key", "3").click();
      getEl("key", ")").click();
      getEl("key", ")").click();
      getEl("equals").click();
      expect(outputEl.innerHTML).toBe(
        formatMsg("syntax Error. unexpected symbol at end of equation.")
      );
    });

    it("should display 'Syntax Error' for parentheses right after numbers", () => {
      // Input: 1()
      getEl("key", "1").click();
      getEl("key", "(").click();
      getEl("key", ")").click();
      getEl("equals").click();

      expect(outputEl.innerHTML).toBe(
        formatMsg(
          "syntax Error. An operator must separate between parentheses and numbers"
        )
      );
    });
  });
});
