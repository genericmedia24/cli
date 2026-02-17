import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Wraps a command handler, catching errors and printing them. */
export function handleError<T extends unknown[]>(fn: (...args: T) => Promise<void> | void): (...args: T) => Promise<void> {
  return async (...args: T) => {
    try {
      await fn(...args)
    } catch (error: unknown) {
      if (error instanceof Response) {
        const body = await error.json().catch(() => ({
          message: error.statusText,
        })) as { message?: string }

        console.error(`Error ${String(error.status)}: ${body.message ?? error.statusText}`)
      } else if (error instanceof Error) {
        console.error(`Error: ${error.message}`)
      } else {
        console.error('An unknown error occurred')
      }

      process.exit(1)
    }
  }
}

/** Prints data as a formatted JSON string. */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2))
}

/**
 * Reads a CLI option value that may reference a file.
 *
 * If the value starts with `@`, the remainder is treated as a file path whose
 * UTF-8 contents are returned. Otherwise the literal string is returned as-is.
 *
 * @example
 * readFileInput('@./migration.sql') // reads ./migration.sql
 * readFileInput('CREATE TABLE …')   // returns the string unchanged
 */
export function readFileInput(value: string): string {
  if (value.startsWith('@')) {
    return readFileSync(resolve(value.slice(1)), 'utf8')
  }

  return value
}
