/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const resultArray = [];
  let filteredArray = arr ? [...arr] : [];

  while (filteredArray.length > 0) {
    resultArray.push(filteredArray[0]);

    const elementToFilter = filteredArray[0];
    filteredArray = filteredArray.filter(item => item !== elementToFilter);
  }

  return resultArray;
}
