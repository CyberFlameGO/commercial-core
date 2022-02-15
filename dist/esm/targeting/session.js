import { isString } from '@guardian/libs';
/* -- Types -- */
const referrers = [
    {
        id: 'facebook',
        match: 'facebook.com',
    },
    {
        id: 'google',
        match: 'www.google',
    },
    {
        id: 'twitter',
        match: '/t.co/',
    },
    {
        id: 'reddit',
        match: 'reddit.com',
    },
];
/* -- Methods -- */
const getReferrer = (referrer) => {
    if (referrer === '')
        return null;
    const matchedRef = referrers.find((referrerType) => referrer.includes(referrerType.match)) ?? null;
    return matchedRef ? matchedRef.id : null;
};
const experimentsTargeting = ({ clientSideParticipations, serverSideParticipations, }) => {
    const testToParams = (testName, variant) => {
        if (variant === 'notintest')
            return null;
        // GAM key-value pairs accept value strings up to 40 characters long
        return `${testName}-${variant}`.substring(0, 40);
    };
    const clientSideExperiment = Object.entries(clientSideParticipations)
        .map((test) => {
        const [name, variant] = test;
        return testToParams(name, variant.variant);
    })
        .filter(isString);
    const serverSideExperiments = Object.entries(serverSideParticipations)
        .map((test) => testToParams(...test))
        .filter(isString);
    if (clientSideExperiment.length + serverSideExperiments.length === 0) {
        return null;
    }
    return [...clientSideExperiment, ...serverSideExperiments];
};
export const getSessionTargeting = ({ adTest, countryCode, isSignedIn, pageViewId, participations, referrer, }) => ({
    ab: experimentsTargeting(participations),
    at: adTest,
    cc: countryCode,
    pv: pageViewId,
    ref: getReferrer(referrer),
    si: isSignedIn ? 't' : 'f',
});
