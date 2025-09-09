
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { V1TranslationsFeaComponent } from '@x/shared-feature-ng-translations';
import { TranslocoDirective } from '@jsverse/transloco';

/**
 * In language state, we don't actually store the user's preferred language in
 * Local Storage, but rather in the Translations API. Thaat's why we don't do
 * much here in this component.
 *
 * @export
 * @class StateLanguageComponent
 * @typedef {StateLanguageComponent}
 */
@Component({
  selector: 'x-state-language',
  standalone: true,
  imports: [
    FormsModule,
    V1TranslationsFeaComponent,
    TranslocoDirective
],
  templateUrl: './state-language.component.html',
  styleUrls: ['./state-language.component.scss'],
})
export class StateLanguageComponent {}
