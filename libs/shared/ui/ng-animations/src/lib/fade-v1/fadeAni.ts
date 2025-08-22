import {
  trigger,
  animate,
  transition,
  style,
  query,
} from '@angular/animations';

export const v1FadeAni = trigger('v1FadeAni', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          position: 'absolute',
          height: '100%',
          width: '100%',
        }),
      ],
      { optional: true },
    ),
    query(
      ':leave',
      [
        style({
          opacity: 1,
          position: 'absolute',
          height: '100%',
          width: '100%',
        }),
        animate('0.2s', style({ opacity: 0 })),
      ],
      { optional: true },
    ),
    query(
      ':enter',
      [
        style({
          opacity: 0,
          position: 'relative',
          height: '100%',
          width: '100%',
        }),
        animate('0.2s', style({ opacity: 1 })),
      ],
      { optional: true },
    ),
  ]),
]);
