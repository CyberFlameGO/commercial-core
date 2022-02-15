import { twitterScript as insertSnippet } from '../__vendor/twitter-script';
/**
 * tracking pixel
 * https://business.twitter.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites.html
 * @param  {} {shouldRun}
 */
export const twitter = ({ shouldRun }) => ({
    shouldRun,
    name: 'twitter',
    insertSnippet,
});
