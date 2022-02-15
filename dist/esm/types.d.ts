import type { VendorName } from '@guardian/consent-management-platform/dist/types';
export declare type TagAttribute = {
    name: string;
    value: string;
};
export declare type ThirdPartyTag = {
    async?: boolean;
    attrs?: TagAttribute[];
    beforeLoad?: () => void;
    insertSnippet?: () => void;
    loaded?: boolean;
    onLoad?: () => void;
    shouldRun: boolean;
    name?: VendorName;
    url?: string;
    useImage?: boolean;
};
export declare type GetThirdPartyTag = (arg0: {
    shouldRun: boolean;
}) => ThirdPartyTag;
export declare type GuardianAnalyticsConfig = {
    trackers: Record<string, string>;
};
export declare type GuardianWindowConfig = {
    googleAnalytics?: GuardianAnalyticsConfig;
};
export declare type GoogleTagParams = unknown;
export declare type GoogleTrackConversionObject = {
    google_conversion_id: number;
    google_custom_params: GoogleTagParams;
    google_remarketing_only: boolean;
};
export declare type MaybeArray<T> = T | T[];
export declare type CustomParams = Record<string, MaybeArray<string | number | boolean>>;
export declare type AdsConfigDisabled = {
    disableAds: true;
};
export declare type AdsConfigBasic = {
    adTagParameters: {
        iu: string;
        cust_params: string;
    };
};
export declare type AdsConfigCCPAorAus = AdsConfigBasic & {
    restrictedDataProcessor: boolean;
};
export declare type AdsConfigTCFV2 = AdsConfigBasic & {
    adTagParameters: {
        cmpGdpr: number;
        cmpVcd: string;
        cmpGvcd: string;
    };
    nonPersonalizedAd: boolean;
};
export declare type AdsConfigEnabled = AdsConfigBasic | AdsConfigCCPAorAus | AdsConfigTCFV2;
export declare type AdsConfig = AdsConfigEnabled | AdsConfigDisabled;
export declare type AdTargetingBuilder = () => Promise<AdsConfig>;
declare type True = 't';
declare type False = 'f';
declare type NotApplicable = 'na';
export type { True, False, NotApplicable };
