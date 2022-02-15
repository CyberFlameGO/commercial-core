import type { Participations } from '@guardian/ab-core';
import type { CountryCode } from '@guardian/libs';
import type { False, True } from '../types';
declare const referrers: readonly [{
    readonly id: "facebook";
    readonly match: "facebook.com";
}, {
    readonly id: "google";
    readonly match: "www.google";
}, {
    readonly id: "twitter";
    readonly match: "/t.co/";
}, {
    readonly id: "reddit";
    readonly match: "reddit.com";
}];
/**
 * Session Targeting is based on the browser session
 *
 * Includes information such as the country of origin, referrer, page view ID.
 *
 * These values identify a browser session are either generated client-side,
 * read from a cookie or passed down from the server.
 */
export declare type SessionTargeting = {
    /**
     * **AB** Tests – [see on Ad Manager][gam]
     *
     * Type: _Dynamic_
     *
     * Values: typically start with `ab`
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=186327
     */
    ab: string[] | null;
    /**
     * **A**d **T**est – [see on Ad Manager][gam]
     *
     * Used for testing purposes, based on query param and/or cookie.
     *
     * Type: _Dynamic_
     *
     * [See Current values](https://frontend.gutools.co.uk/commercial/adtests)
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=177567
     */
    at: string | null;
    /**
     * **C**ountry **C**ode – [see on Ad Manager][gam]
     *
     * Type: _Dynamic_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=11703293
     */
    cc: CountryCode;
    /**
     * Ophan **P**age **V**iew id – [see on Ad Manager][gam]
     *
     * ID Generated client-side, usually available on
     * `guardian.config.ophan.pageViewId`
     *
     * Used mainly for internal reporting
     *
     * Type: _Dynamic_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=206127
     */
    pv: string;
    /**
     * **Ref**errer – [see on Ad Manager][gam]
     *
     * Type: _Dynamic_
     *
     * Sample values:
     * - `facebook`
     * - `google`
     * - `googleplus`
     * - `reddit`
     * - `twitter`
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=228567
     */
    ref: typeof referrers[number]['id'] | null;
    /**
     * **S**igned **I**n – [see on Ad Manager][gam]
     *
     *Whether a user is signed in. Based on presence of a cookie.
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=215727
     */
    si: True | False;
};
export declare type AllParticipations = {
    clientSideParticipations: Participations;
    serverSideParticipations: {
        [key: `${string}Control`]: 'control';
        [key: `${string}Variant`]: 'variant';
    };
};
declare type Session = {
    adTest: SessionTargeting['at'];
    countryCode: CountryCode;
    isSignedIn: boolean;
    pageViewId: SessionTargeting['pv'];
    participations: AllParticipations;
    referrer: string;
};
export declare const getSessionTargeting: ({ adTest, countryCode, isSignedIn, pageViewId, participations, referrer, }: Session) => SessionTargeting;
export {};
