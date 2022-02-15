import { log } from '@guardian/libs';
import { EventTimer } from './EventTimer';
var Endpoints;
(function (Endpoints) {
    Endpoints["CODE"] = "//performance-events.code.dev-guardianapis.com/commercial-metrics";
    Endpoints["PROD"] = "//performance-events.guardianapis.com/commercial-metrics";
})(Endpoints || (Endpoints = {}));
let commercialMetricsPayload = {
    page_view_id: undefined,
    browser_id: undefined,
    platform: 'NEXT_GEN',
    metrics: [],
    properties: [],
};
let devProperties = [];
let adBlockerProperties = [];
let initialised = false;
let endpoint;
const setEndpoint = (isDev) => (endpoint = isDev ? Endpoints.CODE : Endpoints.PROD);
const setDevProperties = (isDev) => (devProperties = isDev
    ? [{ name: 'isDev', value: window.location.hostname }]
    : []);
const setAdBlockerProperties = (adBlockerInUse) => {
    adBlockerProperties =
        adBlockerInUse !== undefined
            ? [
                {
                    name: 'adBlockerInUse',
                    value: adBlockerInUse.toString(),
                },
            ]
            : [];
};
const transformToObjectEntries = (eventTimerProperties) => {
    // Transforms object {key: value} pairs into an array of [key, value] arrays
    return Object.entries(eventTimerProperties);
};
const filterUndefinedProperties = (transformedProperties) => transformedProperties.reduce((acc, [key, value]) => {
    if (typeof value !== 'undefined') {
        acc.push([key, value]);
    }
    return acc;
}, []);
const mapEventTimerPropertiesToString = (properties) => {
    return properties.map(([name, value]) => ({
        name: String(name),
        value: String(value),
    }));
};
const roundTimeStamp = (events) => {
    return events.map(({ name, ts }) => ({
        name,
        value: Math.ceil(ts),
    }));
};
function sendMetrics() {
    log('commercial', 'About to send commercial metrics', commercialMetricsPayload);
    return navigator.sendBeacon(endpoint, JSON.stringify(commercialMetricsPayload));
}
function gatherMetricsOnPageUnload() {
    // Assemble commercial properties and metrics
    const eventTimer = EventTimer.get();
    const transformedEntries = transformToObjectEntries(eventTimer.properties);
    const filteredEventTimerProperties = filterUndefinedProperties(transformedEntries);
    const mappedEventTimerProperties = mapEventTimerPropertiesToString(filteredEventTimerProperties);
    const properties = mappedEventTimerProperties
        .concat(devProperties)
        .concat(adBlockerProperties);
    commercialMetricsPayload.properties = properties;
    const metrics = roundTimeStamp(eventTimer.events);
    commercialMetricsPayload.metrics = metrics;
    sendMetrics();
}
const listener = (e) => {
    switch (e.type) {
        case 'visibilitychange':
            if (document.visibilityState === 'hidden') {
                gatherMetricsOnPageUnload();
            }
            return;
        case 'pagehide':
            gatherMetricsOnPageUnload();
            return;
    }
};
const addVisibilityListeners = () => {
    // Report all available metrics when the page is unloaded or in background.
    window.addEventListener('visibilitychange', listener);
    // Safari does not reliably fire the `visibilitychange` on page unload.
    window.addEventListener('pagehide', listener);
};
/**
 * A method to asynchronously send metrics after initialization.
 */
export function bypassCommercialMetricsSampling() {
    if (!initialised) {
        console.warn('initCommercialMetrics not yet initialised');
        return;
    }
    addVisibilityListeners();
}
/**
 * A method to initialise metrics.
 * @param init.pageViewId - identifies the page view. Usually available on `guardian.config.ophan.pageViewId`. Defaults to `null`
 * @param init.browserId - identifies the browser. Usually available via `getCookie({ name: 'bwid' })`. Defaults to `null`
 * @param init.isDev - used to determine whether to use CODE or PROD endpoints.
 * @param init.adBlockerInUse - indicates whether or not ann adblocker is being used.
 */
export function initCommercialMetrics(pageViewId, browserId, isDev, adBlockerInUse, sampling = 1 / 100) {
    commercialMetricsPayload.page_view_id = pageViewId;
    commercialMetricsPayload.browser_id = browserId;
    setEndpoint(isDev);
    setDevProperties(isDev);
    setAdBlockerProperties(adBlockerInUse);
    if (initialised) {
        return false;
    }
    initialised = true;
    const userIsInSamplingGroup = Math.random() <= sampling;
    if (isDev || userIsInSamplingGroup) {
        addVisibilityListeners();
        return true;
    }
    return false;
}
export const _ = {
    Endpoints,
    setEndpoint,
    filterUndefinedProperties,
    mapEventTimerPropertiesToString,
    roundTimeStamp,
    transformToObjectEntries,
    reset: () => {
        initialised = false;
        commercialMetricsPayload = {
            page_view_id: undefined,
            browser_id: undefined,
            platform: 'NEXT_GEN',
            metrics: [],
            properties: [],
        };
        removeEventListener('visibilitychange', listener);
        removeEventListener('pagehide', listener);
    },
};
