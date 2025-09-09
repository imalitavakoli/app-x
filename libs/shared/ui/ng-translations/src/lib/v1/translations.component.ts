import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { v1LanguageGetName } from '@x/shared-util-formatters';
import { V1Translations_MapAllLangs } from '@x/shared-map-ng-translations';

@Component({
  selector: 'x-translations-v1',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss',
})
export class V1TranslationsComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() langs?: V1Translations_MapAllLangs['codes'];
  @Input() default?: string;

  @Output() selected = new EventEmitter<string>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  getLanguageName(code: string): string {
    return v1LanguageGetName(code);
  }
}
