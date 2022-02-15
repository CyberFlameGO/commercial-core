/**
 * tracking pixel
 * https://en-gb.facebook.com/business/learn/facebook-ads-pixel
 * @param  {} {shouldRun}
 */
export const fbPixel = ({ shouldRun }) => ({
    shouldRun,
    url: `https://www.facebook.com/tr?id=279880532344561&ev=PageView&noscript=1`,
    name: 'fb',
    useImage: true,
});
