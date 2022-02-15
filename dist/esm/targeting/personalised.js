import { storage } from '@guardian/libs';
import { clearPermutiveSegments, getPermutiveSegments } from '../permutive';
/* -- Types -- */
const frequency = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6-9',
    '10-15',
    '16-19',
    '20-29',
    '30plus',
];
const AMTGRP_STORAGE_KEY = 'gu.adManagerGroup';
const adManagerGroups = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
];
/* -- Methods -- */
const getRawWithConsent = (key, state) => {
    if (state.tcfv2) {
        if (state.tcfv2.consents['1'])
            return storage.local.getRaw(key);
    }
    if (state.ccpa) {
        if (!state.ccpa.doNotSell)
            return storage.local.getRaw(key);
    }
    if (state.aus) {
        if (state.aus.personalisedAdvertising)
            return storage.local.getRaw(key);
    }
    return null;
};
const getFrequencyValue = (state) => {
    const rawValue = getRawWithConsent('gu.alreadyVisited', state);
    if (!rawValue)
        return '0';
    const visitCount = parseInt(rawValue, 10);
    if (visitCount <= 5) {
        return frequency[visitCount] ?? '0';
    }
    else if (visitCount >= 6 && visitCount <= 9) {
        return '6-9';
    }
    else if (visitCount >= 10 && visitCount <= 15) {
        return '10-15';
    }
    else if (visitCount >= 16 && visitCount <= 19) {
        return '16-19';
    }
    else if (visitCount >= 20 && visitCount <= 29) {
        return '20-29';
    }
    else if (visitCount >= 30) {
        return '30plus';
    }
    return '0';
};
const tcfv2AllPurposesConsented = (consents) => Object.keys(consents).length > 0 && Object.values(consents).every(Boolean);
const personalisedAdvertising = (state) => {
    if (state.tcfv2)
        return tcfv2AllPurposesConsented(state.tcfv2.consents);
    if (state.ccpa)
        return !state.ccpa.doNotSell;
    if (state.aus)
        return state.aus.personalisedAdvertising;
    return false;
};
const getCMPTargeting = (state) => {
    if (state.tcfv2) {
        return {
            cmp_interaction: state.tcfv2.eventStatus,
            pa: tcfv2AllPurposesConsented(state.tcfv2.consents) ? 't' : 'f',
            consent_tcfv2: tcfv2AllPurposesConsented(state.tcfv2.consents)
                ? 't'
                : 'f',
            rdp: 'na',
        };
    }
    if (state.ccpa) {
        return {
            consent_tcfv2: 'na',
            rdp: state.ccpa.doNotSell ? 't' : 'f',
            pa: state.ccpa.doNotSell ? 'f' : 't',
        };
    }
    if (state.aus) {
        return {
            consent_tcfv2: 'na',
            rdp: 'na',
            pa: state.aus.personalisedAdvertising ? 't' : 'f',
        };
    }
    return {
        cmp_interaction: 'na',
        consent_tcfv2: 'na',
        rdp: 'na',
        pa: 'f',
    };
};
const isAdManagerGroup = (s) => adManagerGroups.some((g) => g === s);
const createAdManagerGroup = () => {
    const index = Math.floor(Math.random() * adManagerGroups.length);
    const group = adManagerGroups[index] ?? '12';
    storage.local.setRaw(AMTGRP_STORAGE_KEY, group);
    return group;
};
const getAdManagerGroup = (state) => {
    if (!personalisedAdvertising(state)) {
        storage.local.remove(AMTGRP_STORAGE_KEY);
        return null;
    }
    const existingGroup = storage.local.getRaw(AMTGRP_STORAGE_KEY);
    return isAdManagerGroup(existingGroup)
        ? existingGroup
        : createAdManagerGroup();
};
const getPermutiveWithState = (state) => {
    if (personalisedAdvertising(state))
        return getPermutiveSegments();
    clearPermutiveSegments();
    return [];
};
/* -- Targeting -- */
const getPersonalisedTargeting = (state) => ({
    amtgrp: getAdManagerGroup(state),
    fr: getFrequencyValue(state),
    permutive: getPermutiveWithState(state),
    ...getCMPTargeting(state),
});
export { getPersonalisedTargeting };
