const compareStrings = (firstString, secondString) => {
  return firstString.localeCompare(secondString, 'ru', {caseFirst: "upper"});
};

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((firstString, secondString) => param === 'asc' ? compareStrings(firstString, secondString) : compareStrings(secondString, firstString));
}
