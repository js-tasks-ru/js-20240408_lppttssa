/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const filterKeys = [...fields];
  const filteredObj = {};

  for (const [key, value] of Object.entries(obj)) {
    if (filterKeys.includes(key)) {
      filteredObj[key] = value;
    }
  }

  return filteredObj;
};
