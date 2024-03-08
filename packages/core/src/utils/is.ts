export const isObject = (maybeObj: any): maybeObj is Object =>
  maybeObj !== null && typeof maybeObj === 'object'

export const isFunction = (maybeFn: unknown): maybeFn is Function =>
  maybeFn !== null && typeof maybeFn === 'function'
