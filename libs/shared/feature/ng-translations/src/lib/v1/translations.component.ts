import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, exhaustMap, take } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { V1TranslationsComponent } from '@x/shared-ui-ng-translations';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { LottieComponent } from 'ngx-lottie';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';
import {
  V1TranslationsFacade,
  V1Translations_Errors,
} from '@x/shared-data-access-ng-translations';

/**
 * Here's what we need to do:
 * 1. Fetch base URL from DEP config.
 * 2. Fetch user ID from auth.
 * 3. Emit 'hasError' event if there's any error.
 * 4. In template: Init the translations 'ui' lib and provide its inputs
 *    straightly from the translations 'data-access' lib. How the UI can be
 *    drawn via the 'data-access' lib data? Because its data is already in the
 *    state object at the app's initialization phase...
 * 5. In template: Listen to the language change event and call the respective
 *    method of the translations 'data-access' lib.
 * 6. Listen to the translations 'data-access' lib's state to see when the
 *    user's newly selected language is saved on server, then use the Transloco
 *    Service to load that selected language.
 * 7. In template: Show probable error messages if any.
 *
 * @export
 * @class V1TranslationsFeaComponent
 * @typedef {V1TranslationsFeaComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'x-translations-fea-v1',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    V1TranslationsComponent,
    V1PopupComponent,
    LottieComponent,
  ],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss',
})
export class V1TranslationsFeaComponent implements OnInit, OnDestroy {
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _langService = inject(TranslocoService);

  private _translationsSub!: Subscription;
  private _baseUrl!: string;
  private _userId!: number;

  readonly configFacade = inject(V2ConfigFacade);
  readonly translationsFacade = inject(V1TranslationsFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * If 'true', then the lib will handle showing error messages in the UI.
   * If 'false', then the lib will NOT handle showing error messages in the UI,
   * and it's up to the parent lib to take advantage of `hasError` output and
   * show error messages.
   *
   * @type {boolean}
   */
  @Input() showErrors = true;

  /**
   * It will be emitted if there's was any error.
   *
   * NOTE: It might be emitted multiple times, and each time with a different
   * error message.
   *
   * @type {*}
   */
  @Output() hasError = new EventEmitter<{ key: string; value: string }>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this.configFacade.dataConfigDep$
      .pipe(
        take(1),
        exhaustMap((data) => {
          data = data as V2Config_MapDep;

          // Save required data.
          this._baseUrl = data.general.baseUrl;

          // Switch to the `authState$` Observable.
          return this._authFacade.authState$;
        }),
        take(1),
      )
      .subscribe((state) => {
        // Save required data.
        this._userId = state.datas.getToken?.userId as number;

        // Init the component.
        this._init();
      });
  }

  private _init() {
    this._translationsSub =
      this.translationsFacade.translationsState$.subscribe((state) => {
        // We're listening to `selectedLang` changes... So as soon as its new
        // data is successfully loaded, let's use the Transloco Service to
        // change the whole app's language as well.
        if (state.loadedLatest.selectedLang && state.datas.selectedLang) {
          const cultureCode = state.datas.selectedLang.id;
          this._langService.setActiveLang(cultureCode);
          this._langService.load(cultureCode).pipe(take(1)).subscribe();
        }

        // Emit the error messages if any.
        const emitError = (key: keyof V1Translations_Errors) => {
          if (state.loadedLatest[key] && state.errors[key]) {
            this.hasError.emit({
              key: key,
              value: state.errors[key] as string,
            });
          }
        };
        emitError('translations');
        emitError('allLangs');
        emitError('selectedLang');
      });
  }

  ngOnDestroy(): void {
    if (this._translationsSub) this._translationsSub.unsubscribe();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onLangChange(cultureCode: string) {
    // Let the Translations API service know about the logged in user's new
    // language preference.
    this.translationsFacade.patchSelectedLang(
      this._baseUrl,
      this._userId,
      cultureCode,
    );
  }
}
