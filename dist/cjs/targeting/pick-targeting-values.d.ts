import type { ConditionalExcept } from 'type-fest';
declare type ValidTargetingObject<Base> = ConditionalExcept<Base, null | undefined | '' | readonly [] | readonly [''] | never[] | boolean | number>;
/**
 * Picks only keys with targeting values from an object.
 * A targeting values is defined as either:
 * - a non-empty string
 * - an array of non-empty strings
 *
 * If you object is read-only, you can safely access properties on the result.
 * For example:
 *
 * ```ts
 * dirty = {
 *   valid: 'real',
 *   invalid: undefined,
 * } as const;
 *
 * clean = pickDefinedValues(dirty);
 *
 * // @ts-expect-error -- you can’t access this property
 * clean.invalid
 * ```
 */
export declare const pickTargetingValues: <T extends Record<string, string | readonly string[] | undefined>>(obj: T) => import("type-fest").Except<T, NonNullable<{ [Key in keyof T]: T[Key] extends number | boolean | "" | never[] | readonly [] | readonly [""] | null | undefined ? Key : never; }[keyof T]>>;
export {};
