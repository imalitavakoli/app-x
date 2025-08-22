# shared-util-ng-services

v1.

## Implementation guide

It's a facade to work with the Apptentive service across libs & apps.

```ts
import { V1ApptentiveService } from '@x/shared-util-ng-services';
private readonly _apptentiveService = inject(V1ApptentiveService);

// Init the service.
this._apptentiveService.init('xxx');
this._apptentiveService.createConversation('1.0.0');

// Send events automatically when the page changes.
this._apptentiveService.autoScreenTracking();

// After that user logs in, set the user ID.
this._apptentiveService.identifyPerson(123);

// Send events.
//
// NOTE: 'feature' libs initialize this service and send events.
//
// NOTE: Event name schema for libs: `lib-name_event-name`.
// e.g., `advisory-card_init`, `advisory-card_clicked-advice`.
this._apptentiveService.engage('lib-name_init', {data: 'payload data'});

// Launch the Message Center. With its help, customers can send feedback and you
// can easily send replies directly to their emails.
this._apptentiveService.showMessageCenter();
```
