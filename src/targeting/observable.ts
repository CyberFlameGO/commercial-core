import { onConsentChange } from '@guardian/consent-management-platform';
import type { Observable } from 'rxjs';
import {
	bindCallback,
	combineLatest,
	debounceTime,
	distinctUntilChanged,
	fromEvent,
	last,
	map,
	of,
} from 'rxjs';
import type { ContentTargeting } from './content';
import { getContentTargeting } from './content';
import type { PersonalisedTargeting } from './personalised';
import { getPersonalisedTargeting } from './personalised';
import type { ViewportTargeting } from './viewport';
import { getViewportTargeting } from './viewport';

const viewportTargeting: Observable<ViewportTargeting> = fromEvent(
	window,
	'resize',
).pipe(
	debounceTime(42),
	map(() => getViewportTargeting(window.innerWidth, false)),
);

const contentTargeting: Observable<ContentTargeting> = of(
	getContentTargeting(
		{
			contentType: 'article',
			contributors: ['Comm-Dev'],
			tones: [],
			surging: 0,
			platform: 'NextGen',
			sensitive: false,
			path: '/world-news',
		},
		{
			s: 'news',
			bl: [],
			dcre: 'f',
			edition: 'uk',
			k: ['world', 'news'],
			ob: null,
			se: [],
			rp: 'dotcom-platform',
		},
	),
);

const consentState = bindCallback(onConsentChange)();
const personalisedTargeting: Observable<PersonalisedTargeting> =
	consentState.pipe(
		last(),
		map((state) => getPersonalisedTargeting(state)),
	);

const targeting: Observable<
	ViewportTargeting & PersonalisedTargeting & ContentTargeting
> = combineLatest([
	viewportTargeting,
	personalisedTargeting,
	contentTargeting,
]).pipe(
	map(([viewport, personalised, content]) => ({
		...viewport,
		...personalised,
		...content,
	})),
	distinctUntilChanged(
		(prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
	),
);

// https://prod.liveshare.vsengsaas.visualstudio.com/join?B25D15D34D4AB5995AE5C926845B51CBE3F9

export { targeting };
