import { onConsentChange as onConsentChange_ } from '@guardian/consent-management-platform';
import type { Callback } from '@guardian/consent-management-platform/dist/types';
import { EventTimer } from './event-timer';
import {
	_,
	bypassCommercialMetricsSampling,
	initCommercialMetrics,
} from './send-commercial-metrics';

const {
	Endpoints,
	filterUndefinedProperties,
	mapEventTimerPropertiesToString,
	reset,
	roundTimeStamp,
	transformToObjectEntries,
} = _;

jest.mock('@guardian/consent-management-platform', () => ({
	onConsentChange: jest.fn(),
}));

const onConsentChange = onConsentChange_ as jest.MockedFunction<
	typeof onConsentChange_
>;

const PAGE_VIEW_ID = 'pv_id_1234567890';
const BROWSER_ID = 'bwid_abcdefghijklm';
const IS_NOT_DEV = false;
const IS_DEV = true;
const ADBLOCK_NOT_IN_USE = false;
const USER_IN_SAMPLING = 100 / 100;
const USER_NOT_IN_SAMPLING = -1;

const defaultMetrics = {
	page_view_id: PAGE_VIEW_ID,
	browser_id: BROWSER_ID,
	platform: 'NEXT_GEN',
	metrics: [],
	properties: [
		{
			name: 'adBlockerInUse',
			value: 'false',
		},
	],
};

const tcfv2AllConsent = (callback: Callback) =>
	callback({
		tcfv2: {
			consents: {
				1: true,
				2: true,
				3: true,
				4: true,
				5: true,
				6: true,
				7: true,
				8: true,
				9: true,
				10: true,
			},
			vendorConsents: { 100: true, 200: true, 300: true },
			eventStatus: 'tcloaded',
			addtlConsent: '',
			gdprApplies: true,
			tcString: 'blablabla',
		},
	});

const tcfv2AllConsentExceptPurpose8 = (callback: Callback) =>
	callback({
		tcfv2: {
			consents: {
				1: true,
				2: true,
				3: true,
				4: true,
				5: true,
				6: true,
				7: true,
				8: false,
				9: true,
				10: true,
			},
			vendorConsents: { 100: true, 200: true, 300: true },
			eventStatus: 'tcloaded',
			addtlConsent: '',
			gdprApplies: true,
			tcString: 'blablabla',
		},
	});

const nonTcfv2Consent = (callback: Callback) =>
	callback({ ccpa: { doNotSell: false } });

const setVisibility = (value: 'hidden' | 'visible'): void => {
	Object.defineProperty(document, 'visibilityState', {
		value,
		writable: true,
	});
};

beforeEach(() => {
	reset();
	jest.resetAllMocks();
});

describe('send commercial metrics', () => {
	Object.defineProperty(navigator, 'sendBeacon', {
		configurable: true,
		enumerable: true,
		value: jest.fn(),
		writable: true,
	});

	const mockConsoleWarn = jest
		.spyOn(console, 'warn')
		.mockImplementation(() => false);

	it('sends metrics when the page is hidden, user is in sampling group, and consent is given', () => {
		onConsentChange.mockImplementation(tcfv2AllConsent);

		initCommercialMetrics({
			pageViewId: PAGE_VIEW_ID,
			browserId: BROWSER_ID,
			isDev: IS_NOT_DEV,
			adBlockerInUse: ADBLOCK_NOT_IN_USE,
			sampling: USER_IN_SAMPLING,
		});

		setVisibility('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
			[Endpoints.PROD, JSON.stringify(defaultMetrics)],
		]);
	});

	it('does not send metrics when page is visible', () => {
		onConsentChange.mockImplementation(tcfv2AllConsent);

		initCommercialMetrics({
			pageViewId: PAGE_VIEW_ID,
			browserId: BROWSER_ID,
			isDev: IS_NOT_DEV,
			adBlockerInUse: ADBLOCK_NOT_IN_USE,
			sampling: USER_IN_SAMPLING,
		});

		setVisibility('visible');
		global.dispatchEvent(new Event('visibilitychange'));

		expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([]);
	});

	it('does not send metrics when user is not in sampling group', () => {
		onConsentChange.mockImplementation(tcfv2AllConsent);

		initCommercialMetrics({
			pageViewId: PAGE_VIEW_ID,
			browserId: BROWSER_ID,
			isDev: IS_NOT_DEV,
			adBlockerInUse: ADBLOCK_NOT_IN_USE,
			sampling: USER_NOT_IN_SAMPLING,
		});

		setVisibility('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([]);
	});

	it('does not send metrics when consent is not given', () => {
		initCommercialMetrics({
			pageViewId: PAGE_VIEW_ID,
			browserId: BROWSER_ID,
			isDev: IS_NOT_DEV,
			adBlockerInUse: ADBLOCK_NOT_IN_USE,
			sampling: USER_IN_SAMPLING,
		});

		setVisibility('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([]);
	});

	it('does not send metrics when consent does not include purpose 8', () => {
		onConsentChange.mockImplementation(tcfv2AllConsentExceptPurpose8);

		initCommercialMetrics({
			pageViewId: PAGE_VIEW_ID,
			browserId: BROWSER_ID,
			isDev: IS_NOT_DEV,
			adBlockerInUse: ADBLOCK_NOT_IN_USE,
			sampling: USER_IN_SAMPLING,
		});

		setVisibility('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([]);
	});

	it('sends metrics when consent is non-TCFv2 (i.e. when user is in USA or Australia)', () => {
		onConsentChange.mockImplementation(nonTcfv2Consent);

		initCommercialMetrics({
			pageViewId: PAGE_VIEW_ID,
			browserId: BROWSER_ID,
			isDev: IS_NOT_DEV,
			adBlockerInUse: ADBLOCK_NOT_IN_USE,
			sampling: USER_IN_SAMPLING,
		});

		setVisibility('hidden');
		global.dispatchEvent(new Event('visibilitychange'));

		expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
			[Endpoints.PROD, JSON.stringify(defaultMetrics)],
		]);
	});

	describe('bypassCommercialMetricsSampling', () => {
		it('sends metrics when user is not in sampling group but sampling is bypassed', () => {
			onConsentChange.mockImplementation(tcfv2AllConsent);

			initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_NOT_DEV,
				adBlockerInUse: ADBLOCK_NOT_IN_USE,
				sampling: USER_NOT_IN_SAMPLING,
			});
			bypassCommercialMetricsSampling();

			setVisibility('hidden');
			global.dispatchEvent(new Event('visibilitychange'));

			expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
				[Endpoints.PROD, JSON.stringify(defaultMetrics)],
			]);
		});
		it('expects to be initialised before calling bypassCoreWebVitalsSampling', () => {
			bypassCommercialMetricsSampling();

			expect(mockConsoleWarn).toHaveBeenCalledWith(
				'initCommercialMetrics not yet initialised',
			);
		});
	});

	describe('handles various configurations', () => {
		afterEach(() => {
			// Reset the properties of the event timer for the purposes of these tests
			delete window.guardian.commercialTimer;
			void EventTimer.get();
		});

		it('should handle endpoint in dev', () => {
			onConsentChange.mockImplementation(tcfv2AllConsent);

			initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_DEV,
				adBlockerInUse: ADBLOCK_NOT_IN_USE,
				sampling: USER_IN_SAMPLING,
			});

			setVisibility('hidden');
			global.dispatchEvent(new Event('visibilitychange'));

			expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
				[
					Endpoints.CODE,
					JSON.stringify({
						...defaultMetrics,
						properties: [
							{ name: 'isDev', value: 'localhost' },
							{ name: 'adBlockerInUse', value: 'false' },
						],
					}),
				],
			]);
		});

		it('should handle connection properties if they exist', () => {
			onConsentChange.mockImplementation(tcfv2AllConsent);

			initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_NOT_DEV,
				adBlockerInUse: ADBLOCK_NOT_IN_USE,
				sampling: USER_IN_SAMPLING,
			});

			// Fix the properties of the event timer for the purposes of this test
			const eventTimer = EventTimer.get();
			eventTimer.properties = {
				downlink: 1,
				effectiveType: '4g',
			};

			setVisibility('hidden');
			global.dispatchEvent(new Event('visibilitychange'));

			expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
				[
					Endpoints.PROD,
					JSON.stringify({
						...defaultMetrics,
						properties: [
							{ name: 'downlink', value: '1' },
							{ name: 'effectiveType', value: '4g' },
							{ name: 'adBlockerInUse', value: 'false' },
						],
					}),
				],
			]);
		});

		it('should merge properties adequately', () => {
			onConsentChange.mockImplementation(tcfv2AllConsent);

			initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_DEV,
				adBlockerInUse: ADBLOCK_NOT_IN_USE,
				sampling: USER_IN_SAMPLING,
			});

			// Fix the properties of the event timer for the purposes of this test
			const eventTimer = EventTimer.get();
			eventTimer.properties = {
				downlink: 1,
				effectiveType: '4g',
			};

			setVisibility('hidden');
			global.dispatchEvent(new Event('pagehide'));

			expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
				[
					Endpoints.CODE,
					JSON.stringify({
						...defaultMetrics,
						properties: [
							{ name: 'downlink', value: '1' },
							{ name: 'effectiveType', value: '4g' },
							{ name: 'isDev', value: 'localhost' },
							{ name: 'adBlockerInUse', value: 'false' },
						],
					}),
				],
			]);
		});

		it('should return false if user is not in sampling', () => {
			const willSendMetrics = initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_NOT_DEV,
				adBlockerInUse: ADBLOCK_NOT_IN_USE,
				sampling: USER_NOT_IN_SAMPLING,
			});

			expect(willSendMetrics).toEqual(false);
		});

		it('should set sampling at 0.01 if sampling is not passed in', () => {
			const willSendMetrics = initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_NOT_DEV,
				adBlockerInUse: ADBLOCK_NOT_IN_USE,
			});

			const mathRandomSpy = jest.spyOn(Math, 'random');
			mathRandomSpy.mockImplementation(() => 0.5);

			expect(willSendMetrics).toEqual(false);
		});

		it('should merge properties even if adblocking is not passed in', () => {
			onConsentChange.mockImplementation(tcfv2AllConsent);

			initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_DEV,
				adBlockerInUse: undefined,
				sampling: USER_IN_SAMPLING,
			});

			const eventTimer = EventTimer.get();
			eventTimer.properties = {
				downlink: 1,
				effectiveType: '4g',
			};

			setVisibility('hidden');
			global.dispatchEvent(new Event('pagehide'));

			expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
				[
					Endpoints.CODE,
					JSON.stringify({
						...defaultMetrics,
						properties: [
							{ name: 'downlink', value: '1' },
							{ name: 'effectiveType', value: '4g' },
							{ name: 'isDev', value: 'localhost' },
						],
					}),
				],
			]);
		});

		it('should handle ad slot properties', () => {
			onConsentChange.mockImplementation(tcfv2AllConsent);

			initCommercialMetrics({
				pageViewId: PAGE_VIEW_ID,
				browserId: BROWSER_ID,
				isDev: IS_DEV,
			});

			const eventTimer = EventTimer.get();
			eventTimer.setProperty('adSlotsInline', 5);
			eventTimer.setProperty('adSlotsTotal', 10);

			setVisibility('hidden');
			global.dispatchEvent(new Event('pagehide'));

			expect((navigator.sendBeacon as jest.Mock).mock.calls).toEqual([
				[
					Endpoints.CODE,
					JSON.stringify({
						...defaultMetrics,
						properties: [
							{ name: 'adSlotsInline', value: '5' },
							{ name: 'adSlotsTotal', value: '10' },
							{ name: 'isDev', value: 'localhost' },
						],
					}),
				],
			]);
		});
	});
});

describe('send commercial metrics helpers', () => {
	it('can transform event timer properties into object entries', () => {
		expect(
			transformToObjectEntries({
				type: undefined,
				downlink: 1,
				effectiveType: '4g',
			}),
		).toEqual([
			['type', undefined],
			['downlink', 1],
			['effectiveType', '4g'],
		]);
	});

	it('can filter out event timer properties with a value that is undefined', () => {
		expect(
			filterUndefinedProperties([
				['type', undefined],
				['downlink', 1],
				['effectiveType', '4g'],
			]),
		).toEqual([
			['downlink', 1],
			['effectiveType', '4g'],
		]);
	});

	it('can map event timer properties to the required format', () => {
		expect(
			mapEventTimerPropertiesToString([
				['downlink', 1],
				['effectiveType', '4g'],
			]),
		).toEqual([
			{
				name: 'downlink',
				value: '1',
			},
			{
				name: 'effectiveType',
				value: '4g',
			},
		]);
	});

	it('can round up the value of timestamps', () => {
		expect(
			roundTimeStamp([
				{
					name: 'cmp-tcfv2-init',
					ts: 1519211809934.234,
				},
			]),
		).toEqual([
			{
				name: 'cmp-tcfv2-init',
				value: 1519211809935,
			},
		]);
	});
});
