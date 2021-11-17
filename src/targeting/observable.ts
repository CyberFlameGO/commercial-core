import { onConsentChange } from '@guardian/consent-management-platform';
import type { ConsentState } from '@guardian/consent-management-platform/dist/types';
import type { Observable } from 'rxjs';
import { combineLatest, debounceTime, fromEvent, map, Subject } from 'rxjs';
import type { ContentTargeting } from './content';
import { getContentTargeting } from './content';
import type { PersonalisedTargeting } from './personalised';
import { getPersonalisedTargeting } from './personalised';
import type { ViewportTargeting } from './viewport';
import { getViewportTargeting } from './viewport';

const consentState = new Subject<ConsentState>();
onConsentChange((state) => {
	consentState.next(state);
});

const windowWidth = fromEvent(window, 'resize').pipe(
	debounceTime(42), // or should it be throttleTime?
	map(() => window.innerWidth),
);

const viewportTargeting = new Subject<ViewportTargeting>();

const personalisedTargeting = new Subject<PersonalisedTargeting>();

const contentTargeting = new Subject<ContentTargeting>();

windowWidth.subscribe((width) => {
	viewportTargeting.next(getViewportTargeting(width, false));
});

const targeting: Observable<
	ViewportTargeting & PersonalisedTargeting & ContentTargeting
> = combineLatest([
	viewportTargeting,
	personalisedTargeting,
	contentTargeting,
]).pipe(
	map(([viewport, personalised, content]) => {
		return {
			...viewport,
			...personalised,
			...content,
		};
	}),
);

// https://prod.liveshare.vsengsaas.visualstudio.com/join?B25D15D34D4AB5995AE5C926845B51CBE3F9

export { targeting };
// Hello Ravi!
// 👋
