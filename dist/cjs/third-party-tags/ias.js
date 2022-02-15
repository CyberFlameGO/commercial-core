"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ias = void 0;
/**
 * IAS script filters bad ads
 * https://integralads.com/uk/
 * @param  {} {shouldRun}
 */
const ias = ({ shouldRun }) => ({
    shouldRun,
    url: '//cdn.adsafeprotected.com/iasPET.1.js',
    name: 'ias',
});
exports.ias = ias;
