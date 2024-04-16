/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let filteredString = string;

  for (let i = 0; i < string.length; i++) {
    const invalidString = string[i].repeat(size + 1);
    const validString = string[i].repeat(size);

    filteredString = filteredString.replace(invalidString, validString);
  }

  return filteredString;
}
