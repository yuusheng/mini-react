export const isObject = (maybeObj: any): maybeObj is Object =>
  maybeObj !== null && typeof maybeObj === 'object'
