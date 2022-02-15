import { isString } from '@guardian/libs';
const isTargetingString = (string) => isString(string) && string !== '';
const isTargetingArray = (array) => Array.isArray(array) && array.filter(isTargetingString).length > 0;
const isValidTargeting = (value) => {
    if (isTargetingString(value))
        return true;
    if (isTargetingArray(value))
        return true;
    return false;
};
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
export const pickTargetingValues = (obj) => {
    const initialValue = {};
    return Object.entries(obj).reduce((valid, [key, value]) => {
        if (isValidTargeting(value)) {
            // @ts-expect-error -- isValidTargeting checks this
            valid[key] = Array.isArray(value)
                ? value.filter(isTargetingString)
                : value;
        }
        return valid;
    }, initialValue);
};
