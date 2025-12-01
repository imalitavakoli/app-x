import {
  Directive,
  DestroyRef,
  OnInit,
  inject,
  ElementRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IonContent } from '@ionic/angular';

@Directive({
  selector: '[xOnNavScrollMeToTopV1]',
  standalone: true,
})
export class V1OnNavScrollMeToTopDirective implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private _content!: IonContent;

  constructor(
    private _elRef: ElementRef,
    private _router: Router,
  ) {
    this._content = _elRef.nativeElement as unknown as IonContent;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit() {
    this._router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        this._content.scrollToTop(0); // 0ms = instant
      });
  }
}
