"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = exports.getSharedTargeting = void 0;
const pick_targeting_values_1 = require("./pick-targeting-values");
/* -- Types -- */
const brands = {
    Foundation: 'f',
    Paid: 'p',
    Sponsored: 's',
};
const contentTypes = [
    'article',
    'audio',
    'crossword',
    'gallery',
    'interactive',
    'liveblog',
    'network-front',
    'section',
    'tag',
    'video',
];
const editions = {
    UnitedKingdom: 'uk',
    UnitedStates: 'us',
    Australia: 'au',
    International: 'int',
};
const platforms = {
    R2: 'r2',
    NextGen: 'ng',
    MobileApp: 'app',
    AcceleratedMobilePages: 'amp',
};
const surges = {
    0: '0',
    50: '5',
    100: '4',
    200: '3',
    300: '2',
    400: '1',
};
/* -- Methods -- */
const getSurgingParam = (surging) => {
    if (surging < 50 || isNaN(surging))
        return ['0'];
    const thresholds = [400, 300, 200, 100, 50];
    return thresholds.filter((n) => n <= surging).map((s) => surges[s]);
};
/* -- Targeting -- */
/**
 * What goes in comes out
 */
const getSharedTargeting = (shared) => (0, pick_targeting_values_1.pickTargetingValues)(shared);
exports.getSharedTargeting = getSharedTargeting;
exports._ = {
    getSurgingParam,
};
