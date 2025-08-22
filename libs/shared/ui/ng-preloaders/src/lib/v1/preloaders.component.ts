import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Preset = 'bars' | 'rings' | 'dots';

/**
 * Show a preloader on the page.
 *
 * @example
 * ```html
 * <x-preloaders-v1 preset="rings"></x-preloaders-v1>
 * ```
 *
 * @export
 * @class V1PreloadersComponent
 * @typedef {V1PreloadersComponent}
 */
@Component({
  selector: 'x-preloaders-v1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloaders.component.html',
  styleUrls: ['./preloaders.component.scss'],
})
export class V1PreloadersComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Preloader preset.
   *
   * @type {Preset}
   */
  @Input() preset: Preset = 'bars';

  /**
   * CSS class to be added to the SVG element.
   *
   * @type {string}
   */
  @Input() svgClass = '';
}
