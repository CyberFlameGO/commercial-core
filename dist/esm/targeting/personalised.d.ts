import type { ConsentState } from '@guardian/consent-management-platform/dist/types';
import type { TCEventStatusCode } from '@guardian/consent-management-platform/dist/types/tcfv2';
import type { False, NotApplicable, True } from '../types';
declare const frequency: readonly ["0", "1", "2", "3", "4", "5", "6-9", "10-15", "16-19", "20-29", "30plus"];
declare const adManagerGroups: readonly ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
declare type AdManagerGroup = typeof adManagerGroups[number];
/**
 * Personalised Targeting requires user consent
 *
 * It allows or prevents personalised advertising, restrict data processing
 * and handles access to cookies and local storage
 */
export declare type PersonalisedTargeting = {
    /**
     * **A**d **M**anager **T**argeting **Gr**ou**p** – [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * Sample values:
     * -
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=12318099
     * */
    amtgrp: AdManagerGroup | null;
    /**
     * Interaction with TCFv2 banner – [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=12083384
     */
    cmp_interaction?: TCEventStatusCode | NotApplicable;
    /**
     * **TCFv2 Consent** to [all purposes] – [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [all purposes]: https://vendor-list.consensu.org/v2/vendor-list.json
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=12080297
     * */
    consent_tcfv2: True | False | NotApplicable;
    /**
     * **Fr**equency – [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=214647
     */
    fr: typeof frequency[number];
    /**
     * **P**ersonalised **A**ds Consent – [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=11701767
     */
    pa: True | False;
    /**
     * **Permutive** user segments – [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * Values: 900+ number IDs
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=11958727
     */
    permutive: string[];
    /**
     * **R**estrict **D**ata **P**rocessing Flag – [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=11701767
     */
    rdp: True | False | NotApplicable;
};
declare const getPersonalisedTargeting: (state: ConsentState) => PersonalisedTargeting;
export { getPersonalisedTargeting };
