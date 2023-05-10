//CONTRACT you can’t use anything from hooks

import { isPlainObject, isArray, PlainObject } from "is-what"

// deno-lint-ignore no-explicit-any
export function validate_str(input: any): string {
  if (typeof input == 'boolean') return input ? 'true' : 'false'
  if (typeof input == 'number') return input.toString()
  if (typeof input != 'string') throw new Error(`not-string: ${input}`)
  return input
}

// deno-lint-ignore no-explicit-any
export function validate_plain_obj(input: any): PlainObject {
  if (!isPlainObject(input)) throw new Error(`not-plain-obj: ${JSON.stringify(input)}`)
  return input
}

// deno-lint-ignore no-explicit-any
export function validate_arr<T>(input: any): Array<T> {
  if (!isArray(input)) throw new Error(`not-array: ${JSON.stringify(input)}`)
  return input
}

////////////////////////////////////////////////////////////// base extensions
import outdent from "outdent"
export { outdent as undent }

declare global {
  interface Array<T> {
    compact<S>(body?: (t: T) => S | null | undefined | false, opts?: { rescue: boolean }): Array<S>
    compact_push(item: T | undefined | null): void
    compact_unshift(item: T | undefined | null): void
    chuzzle(): Array<T> | undefined
    uniq(): Array<T>
  }

  interface String {
    chuzzle(): string | undefined
  }

  interface Console {
    // deno-lint-ignore no-explicit-any
    verbose(...args: any[]): void

    /// prohibits standard logging unless verbosity is loud or above
    silence<T>(body: () => Promise<T>): Promise<T>
  }

  interface Set<T> {
    insert(t: T): { inserted: boolean }
  }
}

String.prototype.chuzzle = function() {
  return this.trim() || undefined
}

export function chuzzle(input: number) {
  return Number.isNaN(input) ? undefined : input
}

Set.prototype.insert = function<T>(t: T) {
  if (this.has(t)) {
    return {inserted: false}
  } else {
    this.add(t)
    return {inserted: true}
  }
}

Array.prototype.uniq = function<T>(): Array<T> {
  const set = new Set<T>()
  return this.compact(x => {
    const s = x.toString()
    if (set.has(s)) return
    set.add(s)
    return x
  })
}

Array.prototype.compact = function<T, S>(body?: (t: T) => S | null | undefined | false, opts?: { rescue: boolean }) {
  const rv: Array<S> = []
  for (const e of this) {
    try {
      const f = body ? body(e) : e
      if (f) rv.push(f)
    } catch (err) {
      if (opts === undefined || opts.rescue === false) throw err
    }
  }
  return rv
}

//TODO would be nice to chuzzle contents to reduce first
Array.prototype.chuzzle = function<T>() {
  if (this.length <= 0) {
    return undefined
  } else {
    return this
  }
}

console.verbose = console.error
console.debug = console.error

Array.prototype.compact_push = function<T>(item: T | null | undefined) {
  if (item) this.push(item)
}

export function flatmap<S, T>(t: T | undefined | null, body: (t: T) => S | undefined, opts?: {rescue?: boolean}): NonNullable<S> | undefined {
  try {
    if (t) return body(t) ?? undefined
  } catch (err) {
    if (!opts?.rescue) throw err
  }
}

export async function async_flatmap<S, T>(t: Promise<T | undefined | null>, body: (t: T) => Promise<S> | undefined, opts?: {rescue?: boolean}): Promise<NonNullable<S> | undefined> {
  try {
    const tt = await t
    if (tt) return await body(tt) ?? undefined
  } catch (err) {
    if (!opts?.rescue) throw err
  }
}
