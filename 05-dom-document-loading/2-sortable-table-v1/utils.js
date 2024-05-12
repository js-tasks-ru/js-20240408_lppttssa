const compareStrings = (firstParam, secondParam, type) => {
  if (type === 'string') {
    return firstParam.localeCompare(secondParam, 'ru', {caseFirst: "upper"});
  }

  return firstParam - secondParam;
};

export function sort(arr, field = 'title', param = 'asc', type = 'string') {
  return [...arr].sort((firstElement, secondElement) => param === 'asc'
    ? compareStrings(firstElement[field], secondElement[field], type)
    : compareStrings(secondElement[field], firstElement[field], type));
}
