export const humanReadable = input => {
  console.log(input);
  let newString = '';
  for (let i = 0; i < input.length; i++) {
    if (isUpper(input.charAt(i))) {
      newString = newString.concat(` ${input.charAt(i).toLowerCase()}`);
    } else if (Number.isNaN(parseInt(input.charAt(i), 10))) {
      newString = newString.concat(input.charAt(i));
    }
  }
  return newString.charAt(0).toUpperCase() + newString.slice(1);
};

const isUpper = input => {
  return input >= 'A' && input <= 'Z';
};
