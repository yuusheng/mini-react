import z from 'zod'

export function assertFunction(maybeFunction: unknown): asserts maybeFunction is Function {
  z.function().parse(maybeFunction)
}

export function assertString(maybeString: unknown): asserts maybeString is String {
  z.string().parse(maybeString)
}
