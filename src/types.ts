export type GuardianAnalyticsConfig = {
	trackers: Record<string, string>;
};

export type GuardianWindowConfig = {
	googleAnalytics?: GuardianAnalyticsConfig;
};

export type GoogleTagParams = unknown;
export type GoogleTrackConversionObject = {
	google_conversion_id: number;
	google_custom_params: GoogleTagParams;
	google_remarketing_only: boolean;
};

export type MaybeArray<T> = T | T[];
