import { getCookie } from '@guardian/libs';
import { canUseDom } from './lib/can-use-dom';
import { constructQuery } from './lib/construct-query';
import { getPermutivePFPSegments } from './permutive';
const disabledAds = { disableAds: true };
const buildCustomParamsFromCookies = () => canUseDom()
    ? {
        permutive: getPermutivePFPSegments(),
        si: getCookie({ name: 'GU_U' }) ? 't' : 'f',
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
            cust_params: encodeURIComponent(constructQuery(mergedCustomParams)),
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
export { buildAdsConfigWithConsent, disabledAds };
