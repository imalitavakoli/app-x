# Example — unit spec

A `feature` component (`V1XProfileCardFeaComponent`) whose behaviour the TFS specified as FRs/BRs. Shows: `describe`=FR / `it`=BR with **comment dividers**, `Given/When/Then` titles + **AAA** bodies, the **`jest.preset.js` handling** (native modules not re-stubbed; a hoisted barrel mock only for import safety), and **observable-effect** assertions — never asserting a collaborator was called.

_(Illustrative — adapt the facade double to the real lib's base-class wiring. `.spec.ts`/`jest` are today's runner; re-check `jest.preset.js`.)_

```ts
/* //////////////////////////////////////////////////////////////////////// */
/* Mocks — hoisted ABOVE the component import                               */
/* //////////////////////////////////////////////////////////////////////// */

// WHY this mock: the consuming facade barrel pulls in a native/circular chain
// that can't load in the test env. It exists ONLY to make the import loadable
// and to feed a controllable value (a real RxJS subject the base class pipes).
// We assert the component's observable output — NOT this mock.
// (Capacitor/Firebase are already stubbed by jest.preset.js — do NOT re-mock them.)
jest.mock('@x/shared-data-access-ng-user', () => {
  const { BehaviorSubject } = require('rxjs');
  const userData$ = new BehaviorSubject<unknown>(undefined);
  const userLoaded$ = new BehaviorSubject(false);
  return {
    V1UserFacade: class {
      userData$ = userData$;
      userLoaded$ = userLoaded$;
      getUser = jest.fn();
      reset = jest.fn();
      // test-only handles to drive the doubles
      _emit = (u: unknown) => {
        userData$.next(u);
        userLoaded$.next(true);
      };
    },
  };
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1XProfileCardFeaComponent } from './x-profile-card.component';
import { V1UserFacade } from '@x/shared-data-access-ng-user';

/* //////////////////////////////////////////////////////////////////////// */
/* Mock data                                                                */
/* //////////////////////////////////////////////////////////////////////// */

const MOCK_USER = { id: 123, fullName: 'Ada Lovelace', country: 'GB' };

describe('V1XProfileCardFeaComponent', () => {
  let component: V1XProfileCardFeaComponent;
  let fixture: ComponentFixture<V1XProfileCardFeaComponent>;
  let facade: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1XProfileCardFeaComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(V1XProfileCardFeaComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(V1UserFacade);
  });

  /* //////////////////////////////////////////////////////////////////////// */
  /* XPROFILE_CARDFEA_FR-01: Fetch and expose the user                        */
  /* //////////////////////////////////////////////////////////////////////// */

  describe('XPROFILE_CARDFEA_FR-01: Fetch and expose the user', () => {
    it('XPROFILE_CARDFEA_BR-01 | Given the facade returns user U for userId 123; When data is ready; Then the card data the component exposes is U', () => {
      // Arrange — prime the collaborator's result (proves the fetch by its effect)
      fixture.componentRef.setInput('userId', 123);
      // Act
      facade._emit(MOCK_USER);
      fixture.detectChanges();
      // Assert — observable exposed state, NOT "getUser was called"
      expect(component.$cardData()).toEqual(MOCK_USER);
    });
  });

  /* //////////////////////////////////////////////////////////////////////// */
  /* XPROFILE_CARDFEA_FR-02: Re-emit card outputs                             */
  /* //////////////////////////////////////////////////////////////////////// */

  describe('XPROFILE_CARDFEA_FR-02: Re-emit card outputs', () => {
    it('XPROFILE_CARDFEA_BR-03 | Given the card emits clickedDetails; When onClickedDetails runs; Then the feature emits clickedDetails with the userId', () => {
      // Arrange
      fixture.componentRef.setInput('userId', 123);
      const emitted = jest.fn();
      component.clickedDetails.subscribe(emitted); // the component's own output = observable behaviour
      // Act
      component.onClickedDetails();
      // Assert
      expect(emitted).toHaveBeenCalledWith(123);
    });
  });
});
```
