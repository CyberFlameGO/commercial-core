"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = exports.inizio = void 0;
const handleQuerySurveyDone = (surveyAvailable, survey) => {
    if (surveyAvailable) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- @types/googletag declares it, but it may be missing
        if (window.googletag) {
            window.googletag.cmd.push(() => {
                window.googletag.pubads().setTargeting('inizio', 't');
            });
        }
        console.log(`surveyAvailable: ${survey.measurementId}`);
    }
};
const onLoad = () => {
    window._brandmetrics || (window._brandmetrics = []);
    window._brandmetrics.push({
        cmd: '_querySurvey',
        val: {
            callback: handleQuerySurveyDone,
        },
    });
};
/**
 * Allows creatives to show survey
 * https://trello.com/c/wHffHVF1/171-integrate-and-test-inizio
 * @param  {} {shouldRun}
 */
const inizio = ({ shouldRun }) => ({
    shouldRun,
    url: '//cdn.brandmetrics.com/survey/script/e96d04c832084488a841a06b49b8fb2d.js',
    name: 'inizio',
    onLoad,
});
exports.inizio = inizio;
exports._ = {
    onLoad,
    handleQuerySurveyDone,
};
