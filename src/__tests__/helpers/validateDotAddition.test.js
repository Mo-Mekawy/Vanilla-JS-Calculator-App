import validateDotAddition from "../../js/helpers/validateDotAddition";

describe("tests that return true", () => {
  it("return true when called with an integer as last number", () => {
    expect(validateDotAddition("213")).toBe(true);
    expect(validateDotAddition("213 + 34")).toBe(true);
    expect(validateDotAddition("213+4")).toBe(true);
    expect(validateDotAddition("213+4000")).toBe(true);
    expect(validateDotAddition("213+4000)34")).toBe(true);
    expect(validateDotAddition("213+4000)34.35+53")).toBe(true);
    expect(validateDotAddition("213+4000)34.35+53 ")).toBe(true);
    expect(validateDotAddition("  213+4000)34.35+53 ")).toBe(true);
  });

  it("return true when called with an operator or parentheses as last input", () => {
    expect(validateDotAddition("213.235+")).toBe(true);
    expect(validateDotAddition("213.235+20-")).toBe(true);
    expect(validateDotAddition("213.235+20)")).toBe(true);
    expect(validateDotAddition("213.235+20) ")).toBe(true);
    expect(validateDotAddition(" (213.235+20)20* ")).toBe(true);
    expect(validateDotAddition(" (213.235+20)20/ ")).toBe(true);
    expect(validateDotAddition(" (213.235+20)(20/3) ")).toBe(true);
    expect(validateDotAddition(" (213.235+20)(20/3)( ")).toBe(true);
  });
});

describe("tests that return false", () => {
  it("return false when called with a float as last number", () => {
    expect(validateDotAddition("213.")).toBe(false);
    expect(validateDotAddition(".213")).toBe(false);
    expect(validateDotAddition(".")).toBe(false);
    expect(validateDotAddition(" . ")).toBe(false);
    expect(validateDotAddition(" 324.53 ")).toBe(false);
    expect(validateDotAddition(" .0 ")).toBe(false);
    expect(validateDotAddition(" 0.0 ")).toBe(false);
    expect(validateDotAddition(" 0. ")).toBe(false);
    expect(validateDotAddition(" 235+235.5")).toBe(false);
    expect(validateDotAddition(" (235+235.5)*23.5 ")).toBe(false);
  });
});
