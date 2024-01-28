export default function beautifyInput(input) {
  const operators = { "+": "+", "/": "÷", "*": "×", "-": "−" };

  // if input is a bracket
  if (input === ")" || input === "(")
    return `<span class="bracket"> ${input} </span>`;

  // if input is an operator
  if (operators[input])
    return `<span class="operator"> ${operators[input]} </span>`;

  return input; // if it isn't an operator nor a bracket
}
