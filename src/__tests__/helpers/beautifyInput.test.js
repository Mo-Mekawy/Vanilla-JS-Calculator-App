import beautifyInput from "../../js/helpers/beautifyInput";

describe("test the beautifyInput function", () => {
  it("returns a span with class bracket when called with a parentheses", () => {
    expect(beautifyInput("(")).toBe('<span class="bracket"> ( </span>');
    expect(beautifyInput(")")).toBe('<span class="bracket"> ) </span>');
  });

  it("returns a span with class operator when called with an operator", () => {
    expect(beautifyInput("+")).toBe('<span class="operator"> + </span>');
    expect(beautifyInput("/")).toBe('<span class="operator"> ÷ </span>');
    // note '-' isn't the same as '−'
    expect(beautifyInput("-")).toBe('<span class="operator"> − </span>');
    expect(beautifyInput("-")).not.toBe('<span class="operator"> - </span>');
    // note 'x' isn't the same as '×'
    expect(beautifyInput("*")).toBe('<span class="operator"> × </span>');
    expect(beautifyInput("*")).not.toBe('<span class="operator"> x </span>');
  });

  it("returns the same input if it wasn't a parentheses or an operator", () => {
    expect(beautifyInput("1")).toBe("1");
    expect(beautifyInput("10")).toBe("10");
    expect(beautifyInput("-1")).toBe("-1");
    expect(beautifyInput("test")).toBe("test");
    expect(beautifyInput(2)).toBe(2);
    expect(beautifyInput(-23)).toBe(-23);
    expect(beautifyInput({ hello: "world" })).toEqual({ hello: "world" });
    expect(beautifyInput(["a", "test"])).toEqual(["a", "test"]);
  });
});
