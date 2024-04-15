/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function getter(obj) {
    if (Object.keys(obj).length === 0) {
      return undefined;
    }

    const keys = path.split('.');

    let currentObj = obj;
    keys.forEach(key => {
      currentObj = currentObj[key];
    });

    return currentObj;
  };
}
