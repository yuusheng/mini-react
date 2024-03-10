import z from 'zod'

export function assertFunction(maybeFunction: unknown): asserts maybeFunction is Function {
  z.function().parse(maybeFunction)
}

export function assertString(maybeString: unknown): asserts maybeString is String {
  z.string().parse(maybeString)
}

export function assertExist(maybeExist: unknown): asserts maybeExist {
  if (!maybeExist)
    throw new Error(`${maybeExist} cannot be empty!`)
}
