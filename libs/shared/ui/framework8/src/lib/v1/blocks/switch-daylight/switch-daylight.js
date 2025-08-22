import pluginify      from '../pluginify';
import * as utils     from '../utils/utils';

/**
 * f8-switch-daylight - Framework8 switch-daylight block
 * @copyright 2022 MyThemeIsReady. All Rights Reserved.
 *
 * It allows us to change the page's theme by setting our custom CSS class. It
 * also adds an item to the 'localStorage' object, so that the user's prefered
 * theme will remain on page refreshes. On each page refresh, it checks whether
 * user has already chosen a prefered theme or not. If she did, then it simply
 * sets the theme to the already prefered theme based on the added item to the
 * 'localStorage' object; if she has never chosen a prefered theme manually, it
 * looks for 'prefers-color-scheme' feature at OS level and sets the theme.
 *
 *
 *
 * Requirements:
 * - jQuery version 1.9.1 or higher
 * - Pluginify:               ../pluginify.js
 * - Utils:                   ../utils/utils.js
 *
 *
 *
 *
 * @example
 * // HTML simple usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <div class="f8-switch-daylight" data-f8-target="body"
 * // data-f8-target-dark-class="theme-dark" data-f8-target-light-class="theme-light">
 * //   <input type="checkbox" id="sd">
 * // </div>
 * //
 * // <!-- data-f8-target: String = undefined; (Required)
 * // CSS selector that refers to the target. This is the element that we
 * // add/remove CSS classes for it when needed. -->
 * //
 * // <!-- data-f8-target-dark-class: String = 'f8-switch-daylight__target--state-dark'; (Optional)
 * // CSS class that will be added to the target if dark theme is prefered. -->
 * //
 * // <!-- data-f8-target-light-class: String = 'f8-switch-daylight__target--state-light'; (Optional)
 * // CSS class that will be added to the target if light theme is prefered. -->
 * //
 * // <!-- data-f8-life-of-manually-defined-theme: Number = 1; (Optional)
 * // Life of the manually defined theme by user. It's in days. When the time
 * // reaches to an end, user's manually defined theme will be cleared, and
 * // switch will read 'prefers-color-scheme' feature at OS level once again. If
 * // you set it to 0, switch will never read 'prefers-color-scheme' feature at
 * // OS level once user sets her preference. Life time will reset each time
 * // user switches the switch. -->
 * //
 * // <!-- NOTE: '.f8-switch-daylight__target' CSS class will be added to the
 * // Target element automatically. -->
 *
 *
 *
 *
 * // HTML - Custom styling
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <div class="f8-switch-daylight" data-f8-target="body" data-f8-custom-style>
 * //   <input type="checkbox" id="sd">
 * // </div>
 * //
 * // <!-- data-f8-custom-style: Boolean = false; (Optional)
 * // If it's set, the default DOM with its CSS styles won't be appened into the
 * // block. So you can just use the block's functionality and style your own
 * // daylight switch in any way you like. -->
 *
 *
 *
 *
 * // JS usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 *
 * // If you've set 'initializeF8BlocksManually' variable in your HTML page to
 * // `true`, then you need to initialize the block manually yourself to enable
 * // its JavaScript functionalities.
 * $('.f8-switch-daylight').f8switchdaylight();
 *
 * // Of course when you initialize the block, you can pass it your options object too.
 * // $('.f8-switch-daylight').f8switchdaylight({f8Target: 'body', f8TargetDarkClass: 'theme-dark'});
 *
 * // Destroy the initialized block.
 * // NOTE: When destroyed, the input field inside of the block will be replaced
 * // with a new one.
 * // NOTE: If the method's 'keepDaylightState' argument is set to 'true' (it's
 * // 'false' by default), then 'f8SwitchDaylight_isThemeDark' item in
 * // localStorage won't be removed if it already exists there, and the
 * // CSS classes that have been added to the target won't be removed.
 * // $('.f8-switch-daylight').f8switchdaylight('destroy', false);
 *
 *
 * // The following methods can be called
 * $('.f8-switch-daylight').f8switchdaylight('removeUserDefinedTheme');
 *
 *
 * // The following events will be triggered on special occasions
 * $('.f8-switch-daylight').on('changed.f8switchdaylight', (e, param) => { console.log(param.checked); });
 *
 */
class SwitchDaylight {

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Properties

  _properties(element, options) {
    this.$element                            = $(element);
    this.options                             = this._getOptions(options);

    this.$target                             = $(options.f8Target);
    this.$checkbox                           = this.$element.find('[type="checkbox"]');

    this._checkboxId                         = 'sd';
  }




  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Constructor

  constructor(element, options) {
    this._properties(element, options);

    // First check if we have a valid target
    if (!this.$target.length) throw new Error('.f8-switch-daylight blocks require a valid "f8Target" option');

    // Check if we have a checkbox inside of our element
    if (!this.$checkbox.length) throw new Error('.f8-switch-daylight blocks require an input with the checkbox type, inside themselves');

    // Now check if user likes to use only the JavaScript functionality of the
    // dark mode toggle, then don't add our own needed DOM to make the toggle
    // styled by CSS.
    if (!this.options.f8CustomStyle) this._drawOurOwnDOM();

    // If f8LifeOfManuallyDefinedTheme option is more than 0, then it means that
    // we should remove the user's theme preference from Local Storage (if it
    // already exists) after the given days... So that we can again set the
    // theme according to 'prefers-color-scheme' feature at OS level and NOT the
    // user's theme preference because she has once checked the switch!
    if (parseInt(this.options.f8LifeOfManuallyDefinedTheme) > 0) {
      utils.deleteItemFromLocalStorageAfterAWhile('f8SwitchDaylight_isThemeDark', 'f8SwitchDaylight_lastTimeCleared', 1000 * 60 * 60 * 24 * parseInt(this.f8LifeOfManuallyDefinedTheme));
    }

    // Now let's set the switch state.
    this._setSwitch();

    // Let's also add a CSS class to the target as well
    this.$target.addClass('f8-switch-daylight__target');
  }




  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Static constant

  static get DEFAULTS() {
    return {
      f8TargetDarkClass:                       'f8-switch-daylight__target--state-dark',
      f8TargetLightClass:                      'f8-switch-daylight__target--state-light',
      f8Target:                                undefined,
      f8CustomStyle:                           false,
      f8LifeOfManuallyDefinedTheme:            1,
    }
  }




  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Private functions

  _getOptions(options) {
    // The following options should be boolean. Now if the user mentions them
    // via data API without specifying their value, then they will be string, so
    // we check that if they are string, let's convert them into boolean.
    options.f8CustomStyle =                             utils.toBoolean(options.f8CustomStyle);

    return options;
  }

  _setSwitch() {
    // Ok, now let's first check 'prefers-color-scheme' feature at OS level, and
    // user's theme preference from Local Storage (if it's available).
    const isDarkSchemePrefered = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isCurrentThemeDark = utils.toBoolean(localStorage.getItem('f8SwitchDaylight_isThemeDark'), true, true);

    // Now if user has already set the mode manually to dark or light... It
    // doesn't matter! we respect her choice if user's theme preference item
    // exists in Local Storage... And if she has never changed the mode
    // manually, then check the user's preference at the OS level, and set the
    // mode based on that.
    if (isCurrentThemeDark === true) {
      this._handleTargetClasses(true);
      this._setCheckbox(true);
    } else if (isCurrentThemeDark === false) {
      this._handleTargetClasses(false);
      this._setCheckbox(false);
    } else {
      if (isDarkSchemePrefered) {
        this._handleTargetClasses(true);
        this._setCheckbox(true);
      } else {
        this._handleTargetClasses(false);
        this._setCheckbox(false);
      }
    }
  }

  _handleTargetClasses(isDark = false) {
    if (isDark) this.$target.addClass(this.options.f8TargetDarkClass).removeClass(this.options.f8TargetLightClass);
    else this.$target.addClass(this.options.f8TargetLightClass).removeClass(this.options.f8TargetDarkClass);
  }

  _setCheckbox(isChecked = false) {
    // Set initial state
    this.$checkbox.prop('checked', isChecked);

    // Set its change listener
    this.$checkbox.off('change.f8switchdaylight').on('change.f8switchdaylight', e => {
      isChecked = (this.$checkbox.prop('checked') == true) ? true : false;
      this._handleTargetClasses(isChecked);

      // Let's set our item in 'localStorage' object
      if (isChecked) {
        localStorage.setItem('f8SwitchDaylight_isThemeDark', true);
        if (parseInt(this.options.f8LifeOfManuallyDefinedTheme) > 0) localStorage.setItem('f8SwitchDaylight_lastTimeCleared', new Date().getTime());
      } else {
        localStorage.setItem('f8SwitchDaylight_isThemeDark', false);
        if (parseInt(this.options.f8LifeOfManuallyDefinedTheme) > 0) localStorage.setItem('f8SwitchDaylight_lastTimeCleared', new Date().getTime());
      }

      this.$element.trigger($.Event('changed.f8switchdaylight'), {checked: isChecked});
    });
  }

  _drawOurOwnDOM() {
    if (this.$checkbox.attr('id')) this._checkboxId = this.$checkbox.attr('id');

    this.$element.html(`
      <div class="f8-switch-daylight__indicator">
        <input type="checkbox" id="${this._checkboxId}">
        <label for="${this._checkboxId}" class="f8-switch-daylight__label">
          <span class="f8-switch-daylight__handler">
            <span class="sd-crater sd-crater--1"></span>
            <span class="sd-crater sd-crater--2"></span>
            <span class="sd-crater sd-crater--3"></span>
          </span>
          <span class="sd-star sd-star--1"></span>
          <span class="sd-star sd-star--2"></span>
          <span class="sd-star sd-star--3"></span>
          <span class="sd-star sd-star--4"></span>
          <span class="sd-star sd-star--5"></span>
          <span class="sd-star sd-star--6"></span>
        </label>
      </div>
    `);

    // Define the checkbox again! Why? Well, because as you can see. we have
    // removed everything inside of our block and wrote our own custom DOM! So
    // that old checkbox is removed now... So we need to refer our variable to
    // the newly added checkbox from now on so that when we add listeners to our
    // variables later, they can work correctly.
    this.$checkbox = this.$element.find('[type="checkbox"]');
  }




  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Methods

  removeUserDefinedTheme() {
    // First remove the user's defined theme.
    localStorage.removeItem('f8SwitchDaylight_isThemeDark');

    // Now set the switch again! As this time, it's going to be set based on
    // 'prefers-color-scheme' feature at OS level.
    this._setSwitch();
  }

  destroy(keepDaylightState = false) {
    // Reset element's html
    if (!this.options.f8CustomStyle) {
      this.$element.empty();
      this.$element.append(`<input type="checkbox" id="${this._checkboxId}">`);
    }

    // Remove all probable added styles from any element
    if (!keepDaylightState) this.$target.removeClass('f8-switch-daylight__target').removeClass(this.options.f8TargetDarkClass).removeClass(this.options.f8TargetLightClass);

    // Remove listeners from any element
    this.$checkbox.off('change.f8switchdaylight');

    // Clear localStorage related items
    if (!keepDaylightState) {
      localStorage.removeItem('f8SwitchDaylight_isThemeDark');
      if (parseInt(this.options.f8LifeOfManuallyDefinedTheme) > 0) localStorage.removeItem('f8SwitchDaylight_lastTimeCleared');
    }

    // Null all saved variables
    this.$element                            = undefined;
    this.options                             = undefined;
    this.$target                             = undefined;
    this.$checkbox                           = undefined;
  }

}




// Don't build the jQuery plugin if we're in a SSR environment.
if (typeof document !== 'undefined') {
  // Create our jQuery plugin
  pluginify('f8switchdaylight', SwitchDaylight);

  // If there's no initializeF8BlocksManually variable which is true, then run 
  // the plugin for all the blocks in the page.
  jQuery(document).ready( $ => {
    if (typeof window.initializeF8BlocksManually !== 'boolean' || window.initializeF8BlocksManually === false) {
      $('.f8-switch-daylight').f8switchdaylight();
    }
  });
}
