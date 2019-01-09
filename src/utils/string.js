export const humanReadable = input => {
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

export const sortAlphabetically = (a, b) => {
  const initialA = a.givenName.substring(0, 1).toLowerCase();
  const initialB = b.givenName.substring(0, 1).toLowerCase();
  if (initialA > initialB) {
    return 1;
  }
  if (initialB > initialA) {
    return -1;
  } else {
    return 0;
  }
};
