import type { ConsentState } from '@guardian/consent-management-platform/dist/types';
import { storage } from '@guardian/libs';
import type { PersonalisedTargeting } from './personalised';
import { getPersonalisedTargeting } from './personalised';

const FREQUENCY_KEY = 'gu.alreadyVisited';
const AMTGRP_STORAGE_KEY = 'gu.adManagerGroup';

describe('Personalised targeting', () => {
	describe('TCFv2', () => {
		test('Full consent', () => {
			const tcfv2WithFullConsent: ConsentState = {
				tcfv2: {
					consents: {
						1: true,
						2: true,
					},
					eventStatus: 'useractioncomplete',
					vendorConsents: { abc: false },
					addtlConsent: 'xyz',
					gdprApplies: true,
					tcString: 'I<3IAB.tcf.ftw',
				},
			};

			storage.local.setRaw(FREQUENCY_KEY, '1');

			const expected: Partial<PersonalisedTargeting> = {
				pa: 't',
				consent_tcfv2: 't',
				rdp: 'na',
				fr: '1',
			};
			const targeting = getPersonalisedTargeting(tcfv2WithFullConsent);
			expect(targeting).toMatchObject(expected);
		});

		test('No consent', () => {
			const tcfv2WithoutConsent: ConsentState = {
				tcfv2: {
					consents: {
						1: false,
						2: false,
						3: false,
					},
					eventStatus: 'useractioncomplete',
					vendorConsents: { abc: false },
					addtlConsent: 'xyz',
					gdprApplies: true,
					tcString: 'I<3IAB.tcf.ftw',
				},
			};

			const expected: Partial<PersonalisedTargeting> = {
				pa: 'f',
				consent_tcfv2: 'f',
				rdp: 'na',
				fr: '0',
			};
			const targeting = getPersonalisedTargeting(tcfv2WithoutConsent);
			expect(targeting).toMatchObject(expected);
		});
	});

	describe('CCPA', () => {
		it('Full Consent', () => {
			const state: ConsentState = {
				ccpa: { doNotSell: false },
			};

			storage.local.setRaw(FREQUENCY_KEY, '4');

			const expected: Partial<PersonalisedTargeting> = {
				pa: 't',
				consent_tcfv2: 'na',
				rdp: 'f',
				fr: '4',
			};
			const targeting = getPersonalisedTargeting(state);
			expect(targeting).toMatchObject(expected);
		});

		it('Do Not Sell', () => {
			const state: ConsentState = {
				ccpa: { doNotSell: true },
			};

			storage.local.setRaw(FREQUENCY_KEY, '4');

			const expected: Partial<PersonalisedTargeting> = {
				pa: 'f',
				consent_tcfv2: 'na',
				rdp: 't',
				fr: '0',
			};
			const targeting = getPersonalisedTargeting(state);
			expect(targeting).toMatchObject(expected);
		});
	});

	describe('AUS', () => {
		test('Full Consent', () => {
			const state: ConsentState = {
				aus: { personalisedAdvertising: true },
			};

			storage.local.setRaw(FREQUENCY_KEY, '12');

			const expected: Partial<PersonalisedTargeting> = {
				pa: 't',
				consent_tcfv2: 'na',
				rdp: 'na',
				fr: '10-15',
			};
			const targeting = getPersonalisedTargeting(state);
			expect(targeting).toMatchObject(expected);
		});

		test('Personalised Advertising OFF', () => {
			const state: ConsentState = {
				aus: { personalisedAdvertising: false },
			};

			storage.local.setRaw(FREQUENCY_KEY, '12');

			const expected: Partial<PersonalisedTargeting> = {
				pa: 'f',
				consent_tcfv2: 'na',
				rdp: 'na',
				fr: '0',
			};
			const targeting = getPersonalisedTargeting(state);
			expect(targeting).toMatchObject(expected);
		});
	});

	describe('Frequency', () => {
		const frequencies: Array<[PersonalisedTargeting['fr'], number]> = [
			['0', 0],
			['1', 1],
			['2', 2],
			['3', 3],
			['4', 4],
			['5', 5],
			['6-9', 6],
			['6-9', 9],
			['10-15', 10],
			['10-15', 13],
			['10-15', 15],
			['16-19', 16],
			['16-19', 18],
			['16-19', 19],
			['20-29', 20],
			['20-29', 25],
			['20-29', 29],
			['30plus', 30],
			['30plus', 99],
			['30plus', 365],
			['0', NaN],
			['0', -666],
		];
		test.each(frequencies)('Should get `%s` for %f', (fr, val) => {
			const state: ConsentState = {
				ccpa: { doNotSell: false },
			};

			storage.local.setRaw(FREQUENCY_KEY, String(val));

			const expected: Partial<PersonalisedTargeting> = {
				pa: 't',
				consent_tcfv2: 'na',
				rdp: 'f',
				fr,
			};
			const targeting = getPersonalisedTargeting(state);
			expect(targeting).toMatchObject(expected);
		});
	});
	describe('Ad Manager Group', () => {
		const groups: Array<[PersonalisedTargeting['amtgrp'], number]> = [
			['1', 1 / 12],
			['2', 2 / 12],
			['3', 3 / 12],
			['4', 4 / 12],
			['5', 5 / 12],
			['6', 6 / 12],
			['7', 7 / 12],
			['8', 8 / 12],
			['9', 9 / 12],
			['10', 10 / 12],
			['11', 11 / 12],
			['12', 12 / 12],
			// handle cases where Math.random() is outside the 0-1 range
			['12', -999],
			['12', 999],
		];

		test.each(groups)('Should get `%s` if it exists', (amtgrp, val) => {
			const state: ConsentState = {
				ccpa: { doNotSell: false },
			};

			storage.local.remove(AMTGRP_STORAGE_KEY);
			const mockRandom = jest
				.spyOn(Math, 'random')
				.mockReturnValue(val - 1 / 12 / 2);

			const expected: Partial<PersonalisedTargeting> = {
				pa: 't',
				consent_tcfv2: 'na',
				rdp: 'f',
				amtgrp,
			};
			const targeting = getPersonalisedTargeting(state);
			expect(targeting).toMatchObject(expected);

			mockRandom.mockRestore();
		});
	});

	describe('Unknown', () => {
		test('Not Applicable', () => {
			const state: ConsentState = {};

			const expected: PersonalisedTargeting = {
				amtgrp: null,
				fr: '0',
				permutive: [],
				pa: 'f',
				consent_tcfv2: 'na',
				rdp: 'na',
			};
			const targeting = getPersonalisedTargeting(state);
			expect(targeting).toMatchObject(expected);
		});
	});
});
