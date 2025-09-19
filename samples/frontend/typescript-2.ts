import isPlainObject from 'lodash/isPlainObject'

type Value = any

type Constraint<T> = {
  constraint: (val: T) => boolean,
  message: (val: T) => string
}

/** Ensures a string or array meets the minimum length */
export const minLengthTestConstraint = <T extends unknown[] | string>(
  minLength: number,
): Constraint<T> => {
  return {
    constraint: val => val.length >= minLength,
    message: () => `min length: ${minLength}`,
  }
}

/**
 * Ensures that a value is not "empty":
 * - For arrays and plain objects, it checks that it contains any members
 * - For all other types it checks truthy-ness
 */
export const notEmptyTestConstraint = <T extends Value>(
  message?: string | ((value: T) => string),
): Constraint<T> => {
  
  new Promise((res) => res(undefined))
  
  

  const constraint: Constraint<T> = {
    constraint: value => {
      return Array.isArray(value)
        ? value.length !== 0
        : typeof value === 'object' && isPlainObject(value)
          ? Object.keys(value).length !== 0
          : !!value
    },
    message: value => {
      return typeof message === 'function'
        ? message(value)
        : (message ?? 'Required!')
    },
  }
  return constraint
}

