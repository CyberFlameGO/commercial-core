"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTimer = void 0;
const GoogleAnalytics_1 = require("./GoogleAnalytics");
class Event {
    constructor(name, mark) {
        this.name = name;
        this.ts = mark.startTime;
    }
}
class EventTimer {
    constructor() {
        this._events = [];
        this.startTS = window.performance.now();
        this.triggers = {
            first: {
                slotReady: false,
                prebidStart: false,
                prebidEnd: false,
                slotInitialised: false,
                adOnPage: false,
            },
            'top-above-nav': {
                slotReady: false,
                prebidStart: false,
                prebidEnd: false,
                slotInitialised: false,
                adOnPage: false,
            },
            page: {
                commercialStart: false,
                commercialExtraModulesLoaded: false,
                commercialBaseModulesLoaded: false,
                commercialModulesLoaded: false,
            },
        };
        this.gaConfig = {
            logEvents: [
                {
                    timingVariable: 'slotReady',
                },
                {
                    timingVariable: 'slotInitialised',
                },
                {
                    timingVariable: 'commercialStart',
                    timingLabel: 'Commercial start parse time',
                },
                {
                    timingVariable: 'commercialModulesLoaded',
                    timingLabel: 'Commercial end parse time',
                },
            ],
        };
        this.properties =
            'connection' in window.navigator
                ? {
                    type: 'type' in window.navigator.connection
                        ? window.navigator.connection.type
                        : undefined,
                    downlink: 'downlink' in window.navigator.connection
                        ? window.navigator.connection.downlink
                        : undefined,
                    effectiveType: 'effectiveType' in window.navigator.connection
                        ? window.navigator.connection.effectiveType
                        : undefined,
                }
                : {};
    }
    /**
     * Initialise the EventTimer class on page.
     * Returns the singleton instance of the EventTimer class and binds
     * to window.guardian.commercialTimer. If it's been previously
     * initialised and bound it returns the original instance
     * Note: We save to window.guardian.commercialTimer because
     * different bundles (DCR / DCP) can use commercial core, and we want
     * all timer events saved to a single instance per-page
     * @returns {EventTimer} Instance of EventTimer
     */
    static init() {
        var _a;
        return ((_a = window.guardian).commercialTimer || (_a.commercialTimer = new EventTimer()));
    }
    /**
     * Just a helper method to access the singleton instance of EventTimer.
     * Typical use case is EventTimer.get().trigger
     */
    static get() {
        return this.init();
    }
    /**
     * Returns all commercial timers. CMP-related timers are not tracked
     * by EventTimer so they need to be concatenated to EventTimer's private events array.
     */
    get events() {
        return typeof window.performance !== 'undefined' &&
            'getEntriesByName' in window.performance
            ? [
                ...this._events,
                ...EventTimer._externallyDefinedEventNames
                    .map((eventName) => {
                    const entry = window.performance.getEntriesByName(eventName)[0];
                    return entry
                        ? new Event(eventName, entry)
                        : undefined;
                })
                    .filter((entry) => entry instanceof Event),
            ]
            : this._events;
    }
    /**
     * Creates a new performance mark
     * For slot events also ensures each TYPE of event event is marked only once for 'first'
     * (the first time that event is triggered for ANY slot) and once for topAboveNav
     *
     * @param {string} eventName - The short name applied to the mark
     * @param {origin} [origin=page] - Either 'page' (default) or the name of the slot
     */
    trigger(eventName, origin = 'page') {
        const TRACKED_SLOT_NAME = 'top-above-nav';
        if (origin === 'page' &&
            !this.triggers.page[eventName]) {
            this.mark(eventName);
            this.trackInGA(eventName);
            this.triggers.page[eventName] = true;
            return;
        }
        if (!this.triggers.first[eventName]) {
            const trackLabel = `first-${eventName}`;
            this.mark(trackLabel);
            this.trackInGA(eventName, trackLabel);
            this.triggers.first[eventName] = true;
        }
        if (origin === TRACKED_SLOT_NAME) {
            if (!this.triggers[TRACKED_SLOT_NAME][eventName]) {
                const trackLabel = `${TRACKED_SLOT_NAME}-${eventName}`;
                this.mark(trackLabel);
                this.trackInGA(eventName, trackLabel);
                this.triggers[TRACKED_SLOT_NAME][eventName] = true;
            }
        }
    }
    mark(name) {
        const longName = `gu.commercial.${name}`;
        if (typeof window.performance !== 'undefined' &&
            'mark' in window.performance &&
            typeof window.performance.mark === 'function') {
            const mark = window.performance.mark(longName);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- browser support is patchy
            if (typeof mark?.startTime === 'number') {
                this._events.push(new Event(name, mark));
            }
        }
    }
    trackInGA(eventName, label = '') {
        const gaEvent = this.gaConfig.logEvents.find((e) => e.timingVariable === eventName);
        if (gaEvent) {
            const labelToUse = gaEvent.timingLabel ?? label;
            (0, GoogleAnalytics_1.trackEvent)('Commercial Events', gaEvent.timingVariable, labelToUse);
        }
    }
}
exports.EventTimer = EventTimer;
EventTimer._externallyDefinedEventNames = [
    'cmp-tcfv2-init',
    'cmp-tcfv2-ui-displayed',
    'cmp-tcfv2-got-consent',
    'cmp-ccpa-init',
    'cmp-ccpa-ui-displayed',
    'cmp-ccpa-got-consent',
    'cmp-aus-init',
    'cmp-aus-ui-displayed',
    'cmp-aus-got-consent',
];
