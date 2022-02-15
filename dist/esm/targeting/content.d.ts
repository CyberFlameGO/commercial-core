import type { False, True } from '../types';
import type { SharedTargeting } from './shared';
declare const videoLengths: readonly ["25", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300"];
/**
 * Content Targeting comes from the server
 *
 * For a specific URL, it will only change on
 * - a Composer/CAPI update
 * - a rendering platform capability update
 * - a main media update
 * - a series tag update
 * - a surge in page views per minute
 *
 */
export declare type ContentTargeting = {
    /**
     * **D**ot**c**om-**r**endering **E**ligible - [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=11958028
     */
    dcre: True | False;
    /**
     * Rendering Platform - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=11881005
     */
    rp: 'dotcom-rendering' | 'dotcom-platform';
    /**
     * Site **S**ection - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=173967
     */
    s: string;
    /**
     * **Sens**itive - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=11654206
     */
    sens: True | False;
    /**
     * URL Keywords - [see on Ad Manager][gam]
     *
     * Type: _Dynamic_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=12058265
     */
    urlkw: string[];
    /**
     * **V**ideo **L**ength - [see on Ad Manager][gam]
     *
     * Video.JS only (?)
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=195087
     */
    vl: null | typeof videoLengths[number];
};
declare type Content = {
    eligibleForDCR: boolean;
    path: SharedTargeting['url'];
    renderingPlatform: ContentTargeting['rp'];
    section: ContentTargeting['s'];
    sensitive: boolean;
    videoLength?: number;
};
export declare const getContentTargeting: ({ eligibleForDCR, path, renderingPlatform, section, sensitive, videoLength, }: Content) => ContentTargeting;
export {};
