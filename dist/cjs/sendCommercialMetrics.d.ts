declare type Metric = {
    name: string;
    value: number;
};
declare type Property = {
    name: string;
    value: string;
};
declare type TimedEvent = {
    name: string;
    ts: number;
};
declare type EventProperties = {
    type?: ConnectionType;
    downlink?: number;
    effectiveType?: string;
};
declare enum Endpoints {
    CODE = "//performance-events.code.dev-guardianapis.com/commercial-metrics",
    PROD = "//performance-events.guardianapis.com/commercial-metrics"
}
/**
 * A method to asynchronously send metrics after initialization.
 */
export declare function bypassCommercialMetricsSampling(): void;
/**
 * A method to initialise metrics.
 * @param init.pageViewId - identifies the page view. Usually available on `guardian.config.ophan.pageViewId`. Defaults to `null`
 * @param init.browserId - identifies the browser. Usually available via `getCookie({ name: 'bwid' })`. Defaults to `null`
 * @param init.isDev - used to determine whether to use CODE or PROD endpoints.
 * @param init.adBlockerInUse - indicates whether or not ann adblocker is being used.
 */
export declare function initCommercialMetrics(pageViewId: string, browserId: string | undefined, isDev: boolean, adBlockerInUse?: boolean, sampling?: number): boolean;
export declare const _: {
    Endpoints: typeof Endpoints;
    setEndpoint: (isDev: boolean) => Endpoints;
    filterUndefinedProperties: <T>(transformedProperties: [string, T | undefined][]) => [string, T][];
    mapEventTimerPropertiesToString: (properties: Array<[string, string | number]>) => Property[];
    roundTimeStamp: (events: TimedEvent[]) => Metric[];
    transformToObjectEntries: (eventTimerProperties: EventProperties) => Array<[string, string | number | undefined]>;
    reset: () => void;
};
export type { Property, TimedEvent, Metric };
