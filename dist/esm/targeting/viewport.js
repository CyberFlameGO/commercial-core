/* -- Methods -- */
const findBreakpoint = (width) => {
    if (width >= 980)
        return 'desktop';
    if (width >= 660)
        return 'tablet';
    return 'mobile';
};
export const getViewportTargeting = ({ viewPortWidth, cmpBannerWillShow, }) => {
    // Don’t show inskin if if a privacy message will be shown
    const inskin = cmpBannerWillShow ? 'f' : 't';
    return {
        bp: findBreakpoint(viewPortWidth),
        skinsize: viewPortWidth >= 1560 ? 'l' : 's',
        inskin,
    };
};
