export default function validateDotAddition(inputStr) {
  if (inputStr === "") return true;
  const str = inputStr.trim();

  const lastChar = str[str.length - 1];
  // if last char is a dot then you can't add another one
  if (lastChar === ".") return false;

  // if the last char is a symbol that allows adding a new number (with dot)
  if (["+", "-", "/", "*", "(", ")"].includes(lastChar)) return true;

  // ======= the last char is a number since all other if statements failed =======

  // matches the last float number (digits preceded by a dot)
  const lastNumMatch = str.match(/\.\d+$/);

  // null => no match => no dot in last number
  return lastNumMatch === null;
}
