import type { ConsentState } from '@guardian/consent-management-platform/dist/types';
import type { AdsConfig, AdsConfigDisabled, MaybeArray } from './types';
declare type CustomParams = Record<string, MaybeArray<string | number | boolean>>;
declare const disabledAds: AdsConfigDisabled;
declare const buildAdsConfigWithConsent: (isAdFreeUser: boolean, adUnit: string, customParamsToMerge: CustomParams, consentState: ConsentState) => AdsConfig;
export { buildAdsConfigWithConsent, disabledAds };
