import {
  trigger,
  animate,
  transition,
  style,
  query,
} from '@angular/animations';

export const v1FadeCssAni = trigger('v1FadeCssAni', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          visibility: 'hidden',
          position: 'fixed',
        }),
      ],
      { optional: true },
    ),
    query(':leave', [style({ visibility: 'visible' }), animate('0s .2s')], {
      optional: true,
    }),
  ]),
]);
