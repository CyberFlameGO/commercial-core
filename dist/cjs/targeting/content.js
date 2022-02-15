"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentTargeting = void 0;
const libs_1 = require("@guardian/libs");
/* -- Types -- */
const videoLengths = [
    '25',
    '30',
    '60',
    '90',
    '120',
    '150',
    '180',
    '210',
    '240',
    '270',
    '300',
];
/* -- Methods -- */
const getVideoLength = (videoLength) => {
    const index = Math.min(Math.ceil(videoLength / 30), 10);
    return videoLengths[index] ?? null;
};
const getUrlKeywords = (url) => {
    const lastSegment = url
        .split('/')
        .filter(Boolean) // This handles a trailing slash
        .slice(-1)[0];
    return (0, libs_1.isString)(lastSegment) ? lastSegment.split('-').filter(Boolean) : [];
};
const getContentTargeting = ({ eligibleForDCR, path, renderingPlatform, section, sensitive, videoLength, }) => {
    return {
        dcre: eligibleForDCR ? 't' : 'f',
        rp: renderingPlatform,
        s: section,
        sens: sensitive ? 't' : 'f',
        urlkw: getUrlKeywords(path),
        vl: videoLength ? getVideoLength(videoLength) : null,
    };
};
exports.getContentTargeting = getContentTargeting;
