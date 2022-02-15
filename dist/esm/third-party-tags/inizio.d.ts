import type { GetThirdPartyTag } from '../types';
/**
 * Allows creatives to show survey
 * https://trello.com/c/wHffHVF1/171-integrate-and-test-inizio
 * @param  {} {shouldRun}
 */
export declare const inizio: GetThirdPartyTag;
export declare const _: {
    onLoad: () => void;
    handleQuerySurveyDone: (surveyAvailable: boolean, survey: {
        measurementId: string;
    }) => void;
};
