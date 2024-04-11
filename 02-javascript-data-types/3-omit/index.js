/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} filterKeys - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...filterKeys) => {
  const filteredObj = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!filterKeys.includes(key)) {
      filteredObj[key] = value;
    }
  }

  return filteredObj;
};
