"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disabledAds = exports.buildAdsConfigWithConsent = void 0;
const libs_1 = require("@guardian/libs");
const can_use_dom_1 = require("./lib/can-use-dom");
const construct_query_1 = require("./lib/construct-query");
const permutive_1 = require("./permutive");
const disabledAds = { disableAds: true };
exports.disabledAds = disabledAds;
const buildCustomParamsFromCookies = () => (0, can_use_dom_1.canUseDom)()
    ? {
        permutive: (0, permutive_1.getPermutivePFPSegments)(),
        si: (0, libs_1.getCookie)({ name: 'GU_U' }) ? 't' : 'f',
    }
    : {};
const buildAdsConfig = (cmpConsent, adUnit, customParams) => {
    const mergedCustomParams = {
        ...customParams,
        ...buildCustomParamsFromCookies(),
    };
    const defaultAdsConfig = {
        adTagParameters: {
            iu: adUnit,
            // TODO: Why are we double encoding? Following Frontend process for now
            cust_params: encodeURIComponent((0, construct_query_1.constructQuery)(mergedCustomParams)),
        },
    };
    if (cmpConsent.ccpa) {
        const canTarget = !cmpConsent.ccpa.doNotSell;
        return {
            ...defaultAdsConfig,
            restrictedDataProcessor: !canTarget,
        };
    }
    if (cmpConsent.aus) {
        const canTarget = cmpConsent.aus.personalisedAdvertising;
        return {
            ...defaultAdsConfig,
            restrictedDataProcessor: !canTarget,
        };
    }
    if (cmpConsent.tcfv2) {
        const tcfData = cmpConsent.tcfv2;
        const canTarget = Object.values(tcfData.consents).every(Boolean);
        const mergedAdTagParameters = {
            ...defaultAdsConfig.adTagParameters,
            cmpGdpr: tcfData.gdprApplies ? 1 : 0,
            cmpGvcd: tcfData.addtlConsent,
            cmpVcd: tcfData.tcString,
        };
        return {
            adTagParameters: mergedAdTagParameters,
            nonPersonalizedAd: !canTarget,
        };
    }
    // Shouldn't happen but handle if no matching framework
    return disabledAds;
};
const buildAdsConfigWithConsent = (isAdFreeUser, adUnit, customParamsToMerge, consentState) => {
    if (isAdFreeUser) {
        return disabledAds;
    }
    return buildAdsConfig(consentState, adUnit, customParamsToMerge);
};
exports.buildAdsConfigWithConsent = buildAdsConfigWithConsent;
