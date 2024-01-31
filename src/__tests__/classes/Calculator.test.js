import Calculator from "../../js/classes/Calculator";
import beautifyInput from "../../js/helpers/beautifyInput";
import validateDotAddition from "../../js/helpers/validateDotAddition";
import handleErrMsg from "../../js/helpers/handleErrorMessage";

// mock the beautifyInput function
jest.mock("../../js/helpers/beautifyInput", () => jest.fn((input) => input));
// mock the validateDotAddition function
jest.mock("../../js/helpers/validateDotAddition");
// mock the handleErrMsg function
jest.mock("../../js/helpers/handleErrorMessage", () =>
  jest.fn().mockReturnValue("TestError")
);

let mockInputEl;
let mockOutputEl;
let calculatorInstance;

beforeEach(() => {
  mockInputEl = document.createElement("div");
  mockOutputEl = document.createElement("div");
  calculatorInstance = new Calculator(mockInputEl, mockOutputEl);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Calculator class instantiation", () => {
  it("should instantiate a Calculator object with the required properties", () => {
    expect(calculatorInstance.inputEl).toBe(mockInputEl);
    expect(calculatorInstance.outputEl).toBe(mockOutputEl);
    expect(calculatorInstance.input).toBe("");
    expect(calculatorInstance.output).toBe("");
  });

  it("should throw a TypeError when instantiated with invalid arguments", () => {
    expect(() => new Calculator(mockInputEl, "test")).toThrow(TypeError);
    expect(() => new Calculator("test", mockInputEl)).toThrow(
      "Both parameters must be a Dom Element"
    );

    expect(() => new Calculator(mockInputEl, mockInputEl)).toThrow(TypeError);
    expect(() => new Calculator(mockInputEl, mockInputEl)).toThrow(
      "Both parameters must be different elements"
    );
  });

  it("should throw a SyntaxError when instantiated with missing arguments", () => {
    const errorMessage = "Missing argument (should pass two Dom elements)";

    expect(() => new Calculator()).toThrow(SyntaxError);
    expect(() => new Calculator()).toThrow(errorMessage);

    expect(() => new Calculator(mockInputEl)).toThrow(SyntaxError);
    expect(() => new Calculator(mockInputEl)).toThrow(errorMessage);
  });

  it("should instantiate a Calculator object with the required methods", () => {
    expect(calculatorInstance.appendInput).toEqual(expect.any(Function));
    expect(calculatorInstance.comput).toEqual(expect.any(Function));
    expect(calculatorInstance.displayOutput).toEqual(expect.any(Function));
    expect(calculatorInstance.removeLast).toEqual(expect.any(Function));
    expect(calculatorInstance.clearAll).toEqual(expect.any(Function));
  });
});

describe("Calculator class instance methods", () => {
  describe("comput instance method", () => {
    it("should calculate the sum correctly for each valid equation", () => {
      const validEquations = [
        { equation: "1+1", result: 2 },
        { equation: "2*3", result: 6 },
        { equation: "10/2", result: 5 },
        { equation: "3-2", result: 1 },
        { equation: "5*5+3", result: 28 },
        { equation: "-5*5+3", result: -22 },
        { equation: "10-5*2", result: 0 },
        { equation: "100/10+5-2", result: 13 },
        { equation: "2^3", result: 8 }, // Exponentiation
        { equation: "sqrt(16)", result: 4 }, // Square root
        { equation: "2+3*4-5/2", result: 11.5 }, // Combination of operations
        { equation: "10%3", result: 1 }, // Modulus
        { equation: "abs(-5)", result: 5 }, // Absolute value
        { equation: "(2+3)*4", result: 20 }, // Parentheses
        { equation: "10/0", result: Infinity }, // Division by zero
        { equation: "-10/0", result: -Infinity }, // negative Division by zero
        { equation: "1e1000", result: Infinity }, // Big numbers
      ];

      validEquations.forEach(({ equation, result }) => {
        calculatorInstance.input = equation;
        expect(calculatorInstance.comput()).toBe(result);
      });
    });

    it("should return 0 if input is empty", () => {
      calculatorInstance.input = "";
      expect(calculatorInstance.comput()).toBe(0);
    });

    it("should call handleErrMsg for each invalid equation", () => {
      const invalidEquations = [
        "3*4/", // Trailing operator
        "(2+3)*", // Missing operand after operator
        "sqrt(9))", // Unbalanced parentheses
        "5^2+3*", // Operator without operand
        "10%abc", // Operand not a number
        "0/0", // Division of zero by zero
      ];

      invalidEquations.forEach((equation, index) => {
        calculatorInstance.input = equation;
        calculatorInstance.comput();
        expect(handleErrMsg).toHaveBeenCalledTimes(index + 1);
      });
    });
  });

  describe("appendInput instance method", () => {
    it("should append the value to input and inputEl and call beautifyInput function", () => {
      calculatorInstance.appendInput("(");
      expect(beautifyInput).toHaveBeenCalledTimes(1);
      expect(mockInputEl.innerHTML).toBe("(");
      expect(calculatorInstance.input).toBe("(");

      calculatorInstance.appendInput("1");
      expect(beautifyInput).toHaveBeenCalledTimes(2);
      expect(mockInputEl.innerHTML).toBe("(1");
      expect(calculatorInstance.input).toBe("(1");

      calculatorInstance.appendInput("*");
      expect(beautifyInput).toHaveBeenCalledTimes(3);
      expect(mockInputEl.innerHTML).toBe("(1*");
      expect(calculatorInstance.input).toBe("(1*");

      calculatorInstance.appendInput("3");
      expect(beautifyInput).toHaveBeenCalledTimes(4);
      expect(mockInputEl.innerHTML).toBe("(1*3");
      expect(calculatorInstance.input).toBe("(1*3");

      calculatorInstance.appendInput(")");
      expect(beautifyInput).toHaveBeenCalledTimes(5);
      expect(mockInputEl.innerHTML).toBe("(1*3)");
      expect(calculatorInstance.input).toBe("(1*3)");
    });

    it("should append a dot when validateDotAddition function returns true", () => {
      validateDotAddition.mockReturnValue(true);
      calculatorInstance.appendInput(".");
      expect(validateDotAddition).toHaveBeenCalledTimes(1);
      expect(mockInputEl.innerHTML).toBe(".");
      expect(calculatorInstance.input).toBe(".");

      validateDotAddition.mockReturnValue(false);
      calculatorInstance.appendInput(".");
      expect(validateDotAddition).toHaveBeenCalledTimes(2);
      expect(mockInputEl.innerHTML).toBe(".");
      expect(calculatorInstance.input).toBe(".");

      validateDotAddition.mockReturnValue(true);
      calculatorInstance.appendInput(".");
      expect(validateDotAddition).toHaveBeenCalledTimes(3);
      expect(mockInputEl.innerHTML).toBe("..");
      expect(calculatorInstance.input).toBe("..");
    });

    it("should call removeLast when passed a second operator", () => {
      // mock the removeLast method
      const removeLastSpy = jest
        .spyOn(calculatorInstance, "removeLast")
        .mockImplementation(() => {
          calculatorInstance.inputEl.innerHTML =
            calculatorInstance.inputEl.innerHTML.slice(0, -1);
          calculatorInstance.input = calculatorInstance.input.slice(0, -1);
        });

      calculatorInstance.appendInput("+");
      expect(mockInputEl.innerHTML).toBe("+");
      expect(calculatorInstance.input).toBe("+");

      calculatorInstance.appendInput("-");
      expect(removeLastSpy).toHaveBeenCalledTimes(1);
      expect(mockInputEl.innerHTML).toBe("-");
      expect(calculatorInstance.input).toBe("-");

      calculatorInstance.appendInput("*");
      expect(removeLastSpy).toHaveBeenCalledTimes(2);
      expect(mockInputEl.innerHTML).toBe("*");
      expect(calculatorInstance.input).toBe("*");
    });

    it("shouldn't append any type other than string", () => {
      calculatorInstance.appendInput(1);
      calculatorInstance.appendInput();
      calculatorInstance.appendInput(["1", "%", "*"]);

      expect(beautifyInput).toHaveBeenCalledTimes(0);
      expect(mockInputEl.innerHTML).toBe("");
      expect(calculatorInstance.input).toBe("");
    });
  });

  describe("displayOutput instance method", () => {
    it("should display a formatted string in the outputEl if called with string convertable to number", () => {
      calculatorInstance.displayOutput("123456");
      expect(calculatorInstance.outputEl.innerHTML).toBe("123,456");
      calculatorInstance.displayOutput("12.3455");
      expect(calculatorInstance.outputEl.innerHTML).toBe("12.346");
      calculatorInstance.displayOutput("12.3454");
      expect(calculatorInstance.outputEl.innerHTML).toBe("12.345");
      calculatorInstance.displayOutput("12500.3454");
      expect(calculatorInstance.outputEl.innerHTML).toBe("12,500.345");
    });

    it("should display a formatted string in the outputEl if called with number", () => {
      calculatorInstance.displayOutput(123456);
      expect(calculatorInstance.outputEl.innerHTML).toBe("123,456");
      calculatorInstance.displayOutput(12.3455);
      expect(calculatorInstance.outputEl.innerHTML).toBe("12.346");
      calculatorInstance.displayOutput(12.3454);
      expect(calculatorInstance.outputEl.innerHTML).toBe("12.345");
      calculatorInstance.displayOutput(12500.3454);
      expect(calculatorInstance.outputEl.innerHTML).toBe("12,500.345");
      calculatorInstance.displayOutput(Infinity);
      expect(calculatorInstance.outputEl.innerHTML).toBe("∞");
    });

    it("should display input as it is in the outputEl if called with a string not convertable to number", () => {
      const testInputs = [
        "test",
        "<span>Error</span>",
        '<span style="color:#F44336;word-wrap:normal;word-break:normal">syntax Error. Please check your equation.</span>',
      ];

      testInputs.forEach((testInput) => {
        calculatorInstance.displayOutput(testInput);
        expect(calculatorInstance.outputEl.innerHTML).toBe(testInput);
      });
    });
  });

  describe("removeLast instance method", () => {
    it("shouldn't do anything if input were empty", () => {
      calculatorInstance.input = "";
      calculatorInstance.inputEl.innerHTML = "";
      calculatorInstance.removeLast();
      expect(calculatorInstance.input).toBe("");
      expect(calculatorInstance.inputEl.innerHTML).toBe("");

      calculatorInstance.input = "";
      calculatorInstance.inputEl.innerHTML = "<span>a</span>";
      calculatorInstance.removeLast();
      expect(calculatorInstance.input).toBe("");
      expect(calculatorInstance.inputEl.innerHTML).toBe("<span>a</span>");
    });

    it("should remove last char from input and last char from inputEl if it were text", () => {
      calculatorInstance.input = "ab";
      calculatorInstance.inputEl.innerHTML = "ab";

      calculatorInstance.removeLast();
      expect(calculatorInstance.input).toBe("a");
      expect(calculatorInstance.inputEl.innerHTML).toBe("a");

      calculatorInstance.removeLast();
      expect(calculatorInstance.input).toBe("");
      expect(calculatorInstance.inputEl.innerHTML).toBe("");
    });

    it("should remove last char from input and last child from inputEl if it were an element", () => {
      calculatorInstance.input = "()";
      calculatorInstance.inputEl.innerHTML =
        '<span class="operator"> ( </span><span class="operator"> ) </span>';

      calculatorInstance.removeLast();
      expect(calculatorInstance.input).toBe("(");
      expect(calculatorInstance.inputEl.innerHTML).toBe(
        '<span class="operator"> ( </span>'
      );

      calculatorInstance.removeLast();
      expect(calculatorInstance.input).toBe("");
      expect(calculatorInstance.inputEl.innerHTML).toBe("");
    });
  });

  describe("clearAll instance method", () => {
    it("should empty all properties", () => {
      calculatorInstance.input = "any test text";
      calculatorInstance.inputEl.innerHTML = "any test text";
      calculatorInstance.output = "any test text";
      calculatorInstance.outputEl.innerHTML = "any test text";

      calculatorInstance.clearAll();

      expect(calculatorInstance.input).toBe("");
      expect(calculatorInstance.inputEl.innerHTML).toBe("");
      expect(calculatorInstance.output).toBe("");
      expect(calculatorInstance.outputEl.innerHTML).toBe("");
    });
  });
});
