import pluginify      from '../pluginify';
import * as utils     from '../utils/utils';

/**
 * f8-bar - Framework8 bar block
 * @copyright 2022 MyThemeIsReady. All Rights Reserved.
 *
 * Cool bar styles! This block can be a header, footer, fullscreen and side
 * widget, and etc... It is flexible and rich featured, with lots of cool styles
 * and effects :)
 *
 *
 * Requirements:
 * - jQuery version 1.9.1 or higher
 * - Pluginify:               ../pluginify.js
 * - Utils:                   ../utils/utils.js
 *
 * Goes well with:
 * - waypoints version ^4.0.0 (https://github.com/imakewebthings/waypoints/)
 * - Toggle:                  ../toggle/toggle.js
 *
 *
 *
 *
 * @example
 * // HTML hide and seek usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <div class="f8-bar f8-bar--pos-fixed-top-left u8-text-color-whitish"
 * // data-f8-hide-and-seek data-f8-down-class="f8-bar--effect-hide-to-top">
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </div>
 * //
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * //
 * // <!-- data-f8-hide-and-seek: Boolean = false; (Optional)
 * // if it's true, it adds hide and seek classes to the block when user scrolls
 * // the page up and down. -->
 * //
 * // <!-- data-f8-down-class: String = 'f8-bar--state-scrolled-down'; (Optional)
 * // CSS class that will be added to the block when user scrolls the page down. -->
 * //
 * // <!-- data-f8-up-class: String = 'f8-bar--state-scrolled-up'; (Optional)
 * // CSS class that will be added to the block when user scrolls the page up. -->
 *
 *
 *
 *
 * // HTML hide and seek - More options
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <div class="f8-bar f8-bar--pos-fixed-top-left u8-text-color-whitish"
 * // data-f8-hide-and-seek data-f8-down-class="f8-bar--effect-hide-to-top"
 * // data-f8-hide-and-seek-offset="0" data-f8-hide-and-seek-step="100">
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </div>
 * //
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * //
 * // <!-- data-f8-hide-and-seek-offset: Number = 180; (Optional)
 * // The offset that should be past by scrolling down the page from the top of
 * // the viewport until the hide and seek effect can happen. e.g if we set it
 * // to 1, then the effect will immediately happen when user scrolls down the
 * // page even a little bit. -->
 * //
 * // <!-- data-f8-hide-and-seek-step: Number = 10; (Optional)
 * // The step that adds/removed up/down CSS classes. e.g if it's 100, then user
 * // must scroll down or up 60px opposite her last scroll so that the classes
 * // can be toggled. -->
 *
 *
 *
 *
 * // HTML threshold usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <div class="f8-bar f8-bar--pos-fixed-top-left u8-text-color-whitish"
 * // data-f8-threshold data-f8-threshold-down-class="f8-bar--visual-shrinked">
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </div>
 * //
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * //
 * // <!-- data-f8-threshold: Boolean = false; (Optional)
 * // If it's true, it adds threshold classes to the block when user scrolls the
 * // page up and down. -->
 * //
 * // <!-- data-f8-threshold-down-class: String = 'f8-bar--state-threshold-scrolled-down'; (Optional)
 * // CSS class that will be added to the block when user passes the threshold
 * // offset while scrolling the page down. -->
 * //
 * // <!-- data-f8-threshold-up-class: String = 'f8-bar--state-threshold-scrolled-up'; (Optional)
 * // CSS class that will be added to the block when user passes the threshold
 * // offset while scrolling the page up. -->
 * //
 * // <!-- data-f8-threshold-offset: Number = 180; (Optional)
 * // The offset that should be past by scrolling down the page from the top of
 * // the viewport until the threshold effect can happen. e.g if we set it
 * // to 1, then the effect will immediately happen when user scrolls down the
 * // page even a little bit. -->
 *
 *
 *
 *
 * // HTML target usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * //
 * // <div class="u8-font-size-lg u8-text-center u8-p u8-mt" id="barTarget" style="width: 100%; height: 200px; background: #eee;">
 * //    I'm bar's target :)
 * // </div>
 * //
 * // <!-- By setting 'data-f8-target-pos-to-switch-classes' to the negative value
 * // of the target's height (200px), the CSS classes will be toggled on the
 * // block and target when the target passes the viewport by 200px. -->
 * // <header class="f8-bar u8-text-color-whitish"
 * // data-f8-target="#barTarget" data-f8-target-reached-down-class="f8-bar--pos-fixed-top-left"
 * // data-f8-target-pos-to-switch-classes="-200">
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </header>
 * //
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * // <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 * //
 * // <!-- NOTE: If you've defined the 'f8Target' option for the block, then you
 * // require the waypoints lib dependency. -->
 * //
 * // <!-- NOTE: '.f8-bar__target' CSS class will be added to the target element automatically. -->
 * //
 * // <!-- data-f8-target: String = undefined; (Optional)
 * // CSS selector which is known as the target. It's the target of our block
 * // which has been instantiated with the waypoints lib, so that when the
 * // target get into the viewport, a CSS class gets added to the block. -->
 * //
 * // <!-- data-f8-target-reached-down-class: String = 'f8-bar--state-target-reached-by-scroll-down'; (Optional)
 * // CSS class that will be added to the block when user reaches the target
 * // element while scrolling the page down. -->
 * //
 * // <!-- data-f8-target-reached-up-class: String = 'f8-bar--state-target-reached-by-scroll-up'; (Optional)
 * // CSS class that will be added to the block when user reaches the target
 * // element while scrolling the page up. -->
 * //
 * // <!-- data-f8-target-down-class: String = 'f8-bar__target--state-scrolled-down'; (Optional)
 * // CSS class that will be added to the target when user reaches the target
 * // element itself while scrolling the page down. -->
 * //
 * // <!-- data-f8-target-up-class: String = 'f8-bar__target--state-scrolled-up'; (Optional)
 * // CSS class that will be added to the target when user reaches the target
 * // element itself while scrolling the page up. -->
 * //
 * // <!-- data-f8-target-pos-to-switch-classes: String/Number = 0; (Optional)
 * // It's actually the offset option of the waypints lib. This option defines
 * // when should we toggle the CSS classes on the bar block and target element.
 * // Here we list the possible values of this option:
 * // - number: A number of pixels.
 * // - percentage string: Ex: '50%'. A percentage of the viewport's height.
 * // - 'bottom-in-view' string: When the bottom of the element hits the bottom of the viewport.
 * // NOTE: A function or 'right-in-view' string values are not supported at the
 * // moment, if you really need them, you can just forget about the 'f8Target'
 * // option of the block and all of its related options, and simply use the
 * // waypoints lib manually yourself and instantiate it for the target to do
 * // your custom job. -->
 *
 *
 *
 *
 * // HTML pusher usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <header class="f8-bar u8-text-color-whitish" data-f8-is-pusher>
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </header>
 * //
 * // <!-- data-f8-is-pusher: Boolean = false; (Optional)
 * // This option is useful ONLY IF you're also going to use the block's
 * // '.f8-bar__push' element. If it's true, block can set 'overflow-x'
 * // CSS property of body and html to 'none'. In this way, when the push
 * // element is pushed to sides, our body won't get horizontal scrollbars. -->
 *
 *
 *
 *
 * // HTML scrollable usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <header class="f8-bar f8-bar--visual-side u8-text-color-whitish" data-f8-is-scrollable>
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish u8-h-100">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </header>
 * //
 * // <!-- data-f8-is-scrollable: Boolean = false; (Optional)
 * // This option is useful ONLY IF '.f8-bar--visual-side' CSS class is applied.
 * // If it's true, it sets the block position to absolute, and sets block's
 * // height equal to the page height. In this way the sidebar is not fixed
 * // anymore and it can be scrolled.  -->
 *
 *
 *
 *
 * // HTML draggable usage
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <aside class="f8-bar f8-bar--visual-side u8-text-color-whitish" data-f8-draggable>
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish u8-h-100">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </aside>
 * //
 * // <!-- data-f8-draggable: Boolean = false; (Optional)
 * // This option is useful ONLY IF '.f8-bar--visual-side' CSS class is applied
 * // and '.f8-bar__perspective' element is inside of the block.
 * // If it's true, it sets touch events for the '.f8-bar__perspective' element
 * // of the block and lets user to open/close the block by dragging it ONLY on
 * // mobile devices. -->
 * //
 * // <!-- data-f8-draggable-interactor: String = undefined; (Optional)
 * // CSS selector that refers to the element which the touch events are going
 * // to be added to it for the dragging proccess... If you don't define it, it
 * // will be the document. -->
 * //
 * // <!-- data-f8-draggable-offset: Number = 40; (Optional)
 * // The offset that should be past by dragging the block back and forth untill
 * // the dragging effect can happen. -->
 * //
 * // <!-- data-f8-rtl: Boolean = false; (Optional)
 * // This option is useful ONLY IF '.f8-bar--pos-fixed-top-right' or
 * // '.f8-bar--pos-fixed-bottom-right' CSS classes are applied.
 * // If it's true, it makes the dragging effect ready for a Right to Left block.
 * // NOTE: 'data-f8-draggable' option is the main option for making the bar
 * // block draggable... So if you like to make it ready for RTL as well, then
 * // you need to set both of these options to true. -->
 * //
 * // <!-- data-f8-draggable-perc-completion-duration: Number = 0; (Optional)
 * // The time duration in ms which completes the percentage of the dragging
 * // proccess and triggers the autodragging event, when user has released her
 * // finger and left the dragging proccess at the middle of the way... -->
 * //
 * // <!-- data-f8-draggable-close-class: String = 'f8-bar--effect-hide-to-left'; (Optional)
 * // This option is useful ONLY IF 'f8Draggable' option is true. This CSS class
 * // will be added to the block automatically when it's dragged to be closed
 * // completely. -->
 * //
 * // <!-- data-f8-draggable-close-class-rtl: String = 'f8-bar--effect-hide-to-right'; (Optional)
 * // This option is useful ONLY IF 'f8Draggable' and 'f8Rtl' options
 * // are true. This CSS class will be added to the block automatically when
 * // it's dragged to be closed completely. -->
 * //
 * // <!-- NOTE: 'f8DraggableCloseClass' and 'f8DraggableCloseClassRtl' CSS
 * // classes will be removed from the block automatically when it's dragged to
 * // be opened completely. -->
 *
 *
 *
 *
 * // HTML draggable usage with the help of other blocks: Toggle
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * // //////////////////////////////////////////////////////////////////////////
 * //
 * // <!-- We've set the perspective/fader element's transition duration to 1s,
 * // so that it can open/close in 1s, to have a smoother manually dragging
 * // animation experience when working on a mobile device. -->
 * // <style>
 * // .f8-bar__perspective, .f8-bar__fader {
 * //   transition: all 1s;
 * //   transition-timing-function: cubic-bezier(.09, .68, 0, .99);
 * // }
 * // </style>
 * //
 * //
 * // <!-- We've set the block's 'data-f8-draggable-perc-completion-duration'
 * // option to 1s (1000 ms) as well, so that it can trigger the autodragging
 * // event for 1s while it's completing the percent parameter...
 * // NOTE: In this example we MAY NOT need to set
 * // 'data-f8-draggable-perc-completion-duration' option at all, because the
 * // perspective element's transition, does the transition effect for all CSS
 * // parameters... But this was just an example to give you the idea of how
 * // this option and the autodragging event can be useful... -->
 * //
 * // <aside class="f8-bar f8-bar--visual-side u8-text-color-whitish" data-f8-draggable data-f8-draggable-perc-completion-duration="1000">
 * //   <div class="f8-bar__perspective">
 * //     <div class="f8-bar__head u8-bg-color-blackish u8-h-100">
 * //       <div class="u8-m">Anything can be inside a Bar Block!</div>
 * //     </div>
 * //   </div>
 * // </aside>
 * // <div class="f8-bar__fader"></div>
 * //
 * // <button class="f8-js-toggle"
 * //  data-f8-toggle-by-my-own data-f8-closer="body"
 * //  data-f8-target=".f8-bar" data-f8-target-close-class="f8-bar--effect-hide-to-left"
 * //  data-f8-overlay=".f8-bar__fader" data-f8-overlay-blur-class="f8-bar__fader--state-blur">Toggle</button>
 * //
 * // <!-- NOTE: Put the scripts after loading jquery and the plugin itself -->
 * //
 * // <script>
 * // jQuery(document).ready(function($) {
 * //
 * //   let $toggle = $('.f8-js-toggle');
 * //   let $fader = $('.f8-bar__fader');
 * //
 * //   $('.f8-bar').on('dragged.f8bar', (e, param) => {
 * //     if (param.status === 'open') $toggle.f8toggle('open');
 * //     else $toggle.f8toggle('close');
 * //     $fader.attr('style', (j, style) => { return style.replace(/(opacity)\s?:\s?[^;]+;?/g, ''); }); // Remove the inline style that we've set while dragging and autodragging were running, now that the dragging is complete
 * //   });
 * //
 * //   $('.f8-bar').on('dragging.f8bar autodragging.f8bar', (e, param) => {
 * //     $fader.css({'opacity': (param.perc/100)}); // Change the CSS opacity property while the block is still dragging or auto dragging
 * //   });
 * //
 * // });
 * // </script>
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
 * $('.f8-bar').f8bar();
 *
 * // Of course when you initialize the block, you can pass it your options object too.
 * // $('.f8-bar').f8bar({f8HideAndSeek: true, f8DownClass: 'f8-bar--effect-hide-to-top'});
 *
 * // Destroy the initialized block
 * // NOTE: If the method's 'keepCssStyles' argument is set to 'true' (it's
 * // 'false' by default), then any added CSS classes to the elements won't be
 * // removed on destroy.
 * // $('.f8-bar').f8bar('destroy', false);
 *
 *
 * // The following method removes/adds 'touchstart.f8bar' and 'touchmove.f8bar'
 * // listeners of the '.f8-bar__perspective' element of the block.
 * // NOTE: This method is useful ONLY IF '.f8-bar--visual-side' CSS class is
 * // also applied and 'f8Draggable' option is enabled.
 * $('.f8-bar').f8bar('toggleDraggingListeners', true);
 *
 *
 * // The following events will be triggered when 'f8HideAndSeek' option is enabled
 * $('.f8-bar').on('scrolleddown.f8bar', e => { });
 * $('.f8-bar').on('scrolledup.f8bar', e => { });
 *
 * // The following events will be triggered when 'f8Threshold' option is enabled
 * $('.f8-bar').on('thresholdscrolleddown.f8bar', e => { });
 * $('.f8-bar').on('thresholdscrolledup.f8bar', e => { });
 *
 * // The following events will be triggered when '.f8-bar--visual-side' CSS
 * // class is applied and 'f8Draggable' option is enabled
 * $('.f8-bar').on('dragging.f8bar', (e, param) => { console.log(param.perc); });
 * $('.f8-bar').on('dragged.f8bar', (e, param) => { console.log(param.status); });
 *
 * // The following event will be triggered when user has released her finger
 * // and left the dragging proccess at the middle of the way...
 * // So in this case block itself decides to open/close the block and while
 * // it's doing that, it triggers this event and manipulates the percent
 * // paramter untill its 100/0 during the 'f8DraggablePercCompletionDuration'
 * // option's duration.
 * $('.f8-bar').on('autodragging.f8bar', (e, param) => { console.log(param.perc); });
 *
 * // The following events will be triggered when 'f8Target' option is defined
 * $('.f8-bar').on('targetreachedbyscrolldown.f8bar', e => { });
 * $('.f8-bar').on('targetreachedbyscrollup.f8bar', e => { });
 */
class Bar {

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Properties

  _properties(element, options) {
    this.$element                            = $(element);
    this.options                             = this._getOptions(options);
    this.$target                             = $(options.f8Target);


    this._scrollInterval                     = undefined;
    this._waypoints                          = undefined;

    this._isThresholdDone                    = false;
    this._isHideAndSeekDone                  = false;
    this._lastScrollTop                      = 0;


    this._elWidth                            = this.$element.width();
    this._draggingOffsetX                    = 0;
    this._draggingDifX                       = 0;
    this._draggingLastDifX                   = 0;
    this._draggingPerc                       = 0;
    this._draggingIntervalToCompletePerc     = null;

    this._isSidebarOpen                      = false;
    this._isDraggingAutoDone                 = false;
    this._isDraggingOffsetFirstTimeChecked   = false;
    this._isDraggingFirstTime                = true;
    this._isDraggingAlreadyDone              = true; // Dragging is already done by default

    this.$draggingInteractor                 = $(options.f8DraggableInteractor);
    this.$perspective                        = this.$element.find('.f8-bar__perspective');
  }




  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Constructor

  constructor(element, options) {
    this._properties(element, options);

    // If user has set the f8IsPusher option to true, it means that she has used
    // .f8-bar--visual-side modifier and also has set the push element for
    // the block (Push is most of the times a huge element that holds the page
    // contents). So in this situation we should set the body's overflow to
    // hidden, so that when the Push has been pushed, it doesn't make the body
    // to appear a horizontal scrollbar.
    if (this.options.f8IsPusher) $('body,html').css('overflow-x', 'hidden');

    // Let's see if f8HideAndSeek or f8Threshold option is true, then set the
    // scroll watcher time interval. Hide block on scroll down and show it again
    // on scroll up.
    if (this.options.f8HideAndSeek || this.options.f8Threshold) this._setupScrollWatcher();

    // Now if f8Target option is set then use waypoints to add/remove
    // f8TargetReachedDownClass/f8TargetReachedUpClass CSS classes when user
    // scrolls and reaches the target.
    if (this.$target.length) {
      this.$target.addClass('f8-bar__target');
      this._setupWayPoints();
    }

    // If user has set the f8IsScrollable option to true, it means that she has
    // used .f8-bar--visual-side modifier and don't like her sidebar to has
    // fixed position! But she likes it to be scrollbale and scrolled with the
    // page scroll. So our block's height must be the page's height, and it
    // should have an absolute position.
    if (this.$element.hasClass('f8-bar--visual-side') && this.options.f8IsScrollable) {
      // Remove the CSS animation duration for height so that JavaScript can
      // immediately modify the height.
      let animationDuration = (this.options.f8Duration / 1000).toString() + 's';
      this.$element.css('transition', `all ${animationDuration}, height .1ms`);

      this._setElHeightAccordingToDocHeight();
      $(window).resize(() => { this._setElHeightAccordingToDocHeight(); });
    }

    if (this.$element.hasClass('f8-bar--visual-side') && this.options.f8Draggable) {
      this._setElTouchListeners();
    }
  }




  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Static constant

  static get DEFAULTS() {
    return {
      f8Rtl:                                   false,

      f8Duration:                              500,                                      // ms

      f8IsPusher:                              false,
      f8IsScrollable:                          false,

      f8DraggableInteractor:                   undefined,
      f8Draggable:                             false,
      f8DraggableOffset:                       40,
      f8DraggablePercCompletionDuration:       0,                                        // ms

      f8HideAndSeek:                           false,
      f8DownClass:                             'f8-bar--state-scrolled-down',
      f8UpClass:                               'f8-bar--state-scrolled-up',
      f8HideAndSeekOffset:                     180,
      f8HideAndSeekStep:                       10,

      f8Threshold:                             false,
      f8ThresholdOffset:                       180,
      f8ThresholdDownClass:                    'f8-bar--state-threshold-scrolled-down',
      f8ThresholdUpClass:                      'f8-bar--state-threshold-scrolled-up',

      f8Target:                                undefined,
      f8TargetDownClass:                       'f8-bar__target--state-scrolled-down',
      f8TargetUpClass:                         'f8-bar__target--state-scrolled-up',
      f8TargetPosToSwitchClasses:              '0',
      f8TargetReachedDownClass:                'f8-bar--state-target-reached-by-scroll-down',
      f8TargetReachedUpClass:                  'f8-bar--state-target-reached-by-scroll-up',

      f8DraggableCloseClass:                   'f8-bar--effect-hide-to-left',
      f8DraggableCloseClassRtl:                'f8-bar--effect-hide-to-right',

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
    options.f8Rtl =                                     utils.toBoolean(options.f8Rtl);
    options.f8IsPusher =                                utils.toBoolean(options.f8IsPusher);
    options.f8IsScrollable =                            utils.toBoolean(options.f8IsScrollable);
    options.f8Draggable =                               utils.toBoolean(options.f8Draggable);
    options.f8HideAndSeek =                             utils.toBoolean(options.f8HideAndSeek);
    options.f8Threshold =                               utils.toBoolean(options.f8Threshold);

    return options;
  }


  _setupScrollWatcher() {
    let didScroll = false;

    $(window).off('scroll.f8bar.2').on('scroll.f8bar.2', e => { didScroll = true; });

    this._scrollInterval = setInterval(() => {
      if (didScroll) {
        if (this.options.f8HideAndSeek) this._doHideAndSeek();
        if (this.options.f8Threshold) this._doThreshold();
        didScroll = false;
      }
    }, 300);
  }

  _doHideAndSeek() {
    let scrollTop = $(window).scrollTop();

    // If user didn't scroll enough, then do nothing and just return
    if (Math.abs(this._lastScrollTop - scrollTop) <= this.options.f8HideAndSeekStep) return;

    // If current position > last position (which means we're scrolling down...)
    // AND we've past the offset ('f8HideAndSeekOffset' option)
    if (scrollTop > this._lastScrollTop && scrollTop > this.options.f8HideAndSeekOffset && !this._isHideAndSeekDone) {
      // Scroll Down
      this.$element.addClass(this.options.f8DownClass).removeClass(this.options.f8UpClass);
      this.$element.trigger($.Event('scrolleddown.f8bar'));
      this._isHideAndSeekDone = true;
    } else if (scrollTop < this._lastScrollTop && this._isHideAndSeekDone) {
      // Scroll Up
      // If we didn't scroll past the document (possible on mac)
      if (scrollTop + $(window).height() < $(document).height()) {
        this.$element.addClass(this.options.f8UpClass).removeClass(this.options.f8DownClass);
        this.$element.trigger($.Event('scrolledup.f8bar'));
        this._isHideAndSeekDone = false;
      }
    }

    this._lastScrollTop = scrollTop;
  }

  _doThreshold() {
    let scrollTop = $(window).scrollTop();

    // If we've past the offset ('f8ThresholdOffset' option)
    if (scrollTop > this.options.f8ThresholdOffset && !this._isThresholdDone) {
      // Scroll Down
      this.$element.addClass(this.options.f8ThresholdDownClass).removeClass(this.options.f8ThresholdUpClass);
      this.$element.trigger($.Event('thresholdscrolleddown.f8bar'));
      this._isThresholdDone = true;
    } else if (scrollTop < this.options.f8ThresholdOffset && this._isThresholdDone) {
      // Scroll Up
      this.$element.addClass(this.options.f8ThresholdUpClass).removeClass(this.options.f8ThresholdDownClass);
      this.$element.trigger($.Event('thresholdscrolledup.f8bar'));
      this._isThresholdDone = false;
    }
  }


  _setupWayPoints() {
    if (this.$target.waypoint === undefined) throw new Error('.f8-bar blocks with a valid "target" option require waypoints version 4.0.0. Download it from here: https://github.com/imakewebthings/waypoints');

    this._waypoints = this.$target.waypoint({
      handler: (direction) => {
        if (direction == 'down') {
          this.$target.addClass(this.options.f8TargetDownClass).removeClass(this.options.f8TargetUpClass);
          this.$element.addClass(this.options.f8TargetReachedDownClass).removeClass(this.options.f8TargetReachedUpClass);
          this.$element.trigger($.Event('targetreachedbyscrolldown.f8bar'));
        } else {
          this.$target.addClass(this.options.f8TargetUpClass).removeClass(this.options.f8TargetDownClass);
          this.$element.addClass(this.options.f8TargetReachedUpClass).removeClass(this.options.f8TargetReachedDownClass);
          this.$element.trigger($.Event('targetreachedbyscrollup.f8bar'));
        }
      },
      offset: this.options.f8TargetPosToSwitchClasses
    });
  }


  _setElHeightAccordingToDocHeight() {
    // Get block's top pos before removing it from screen.
    let elTopPos = this.$element.position().top;

    // NOTE: We MUST first set position to absolute and then modify height!
    // Why? Because a sidebar has a fixed position and if its content is so
    // long, the fixed position won't be affected... So with that in mind, if
    // page's height is less than the block's itself height, and we set it's
    // height to page's height while also modifying its position to absolute,
    // then its height would be less than expected. So that's why we first set
    // its position, so that its long content can be taken into consideration
    // by HTML and then change its height.
    this.$element.css('position', 'absolute');

    // Now remove the block so that its current height won't effect the document
    // height.
    this.$element.css('display', 'none');

    // Now get the document's current height and set block's height according to
    // it.
    this.$element.css('height', $(document).height() - elTopPos);

    // Finally return block to the screen.
    utils.removeInlineStyles(this.$element, 'display');
  }


  _setElTouchListeners() {
    if (!this.$perspective.length) throw new Error('.f8-bar blocks which their "f8Draggable" option is true, require .f8-bar__perspective element, inside themselves');
    if (!this.$draggingInteractor.length) this.$draggingInteractor = $(document);
    this.$perspective.css({'will-change': 'transform', 'transform-style': 'preserve-3d'});
    this.$element.css({'will-change': 'transform', 'transform-style': 'preserve-3d'});

    // Prevent dragging the block while page is scrolling... Why? in large
    // pages, it causes quirky animation...
    $(window).off('scroll.f8bar').on('scroll.f8bar', e => {
      this.$draggingInteractor.off('touchmove.f8bar');
      this._draggingOnUp();
    });

    this.$draggingInteractor.off('touchstart.f8bar').on('touchstart.f8bar', e => { this._draggingOnDown(e); });
    this.$draggingInteractor.off('touchend.f8bar touchcancel.f8bar').on('touchend.f8bar touchcancel.f8bar', e => { this._draggingOnUp(); });
  }

  _draggingOnDown(e) {
    this._draggingOffsetX = e.touches[0].clientX;
    this._isDraggingOffsetFirstTimeChecked = false;
    this._elWidth = this.$element.width();

    if (this._draggingIntervalToCompletePerc) clearInterval(this._draggingIntervalToCompletePerc);
    this._isDraggingAutoDone = false;

    // This is needed if our block is going to be changed by a toggle block.
    // So we should see if our element is shown or hidden, to set
    // _draggingLastDifX accordingly so that when we start moving, our
    // element won't jump...
    let matrix = this.$perspective.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
    let translateX = parseInt(matrix[12]) || parseInt(matrix[4]);
    let translateY = parseInt(matrix[13]) || parseInt(matrix[5]);

    if (translateX && translateX === (this._elWidth * -1)) this._draggingLastDifX = (this._elWidth * -1);
    else if (translateX && translateX === this._elWidth) this._draggingLastDifX = this._elWidth;
    else this._draggingLastDifX = 0;
    this._isSidebarOpen = (this._draggingLastDifX === 0) ? true : false;

    // Now add the touch move listener
    this.$draggingInteractor.off('touchmove.f8bar').on('touchmove.f8bar', e => { this._draggingOnMove(e); });

    // NOTE: This is for IOS! Well, for some reason in IOS, JS receives the
    // new clientX position late or something! And this causes our sidebar to
    // have laggy animation when user is dragging it! So by
    // _isDraggingFirstTime I let JS know to set the sidebar's transition
    // duration to almost 0 in _draggingOnMove() for the first time user
    // starts to touch move, so that sidebar can immediatly reach to where
    // user is touching... So from there, we can no longer experience the
    // laggy animation...
    this._isDraggingFirstTime = true;
  }

  _draggingOnMove(e) {
    // Let's understand how much we should move the sidebar
    let posX = e.touches[0].clientX;
    if (!this.options.f8Rtl) {
      if (this._isSidebarOpen) this._draggingDifX = posX - this._draggingOffsetX - Math.abs(this._draggingLastDifX) + this.options.f8DraggableOffset; // We minus the movement with f8DraggableOffset, to prevent sudden jump of the sidebar at the beginning of the movement. Why there's a sudden jump? Well, because we're going to set the transition-duration to almost 0 for a little while because of the IOS issue later...
      else this._draggingDifX = posX - this._draggingOffsetX - Math.abs(this._draggingLastDifX) - this.options.f8DraggableOffset;
    } else {
      if (this._isSidebarOpen) this._draggingDifX = posX - this._draggingOffsetX + this._draggingLastDifX - this.options.f8DraggableOffset;
      else this._draggingDifX = posX - this._draggingOffsetX + this._draggingLastDifX + this.options.f8DraggableOffset;
    }

    // Check if user is moving her finger less than the offset, do nothing!
    if (!this._isDraggingOffsetFirstTimeChecked) {
      if (Math.abs(posX - this._draggingOffsetX) < this.options.f8DraggableOffset) return;
      else this._isDraggingOffsetFirstTimeChecked = true; // Set it to true, so that we won't be here anymore when user has passed the offset for the first time, but she's still playing back and forth while dragging and may come through the offset limit again and again...
    }

    // Check if user moved her finger more/less than the amount that sidebar can
    // move, and equal _draggingDifX to 100%/0% of its available movement space.
    if (!this.options.f8Rtl) {
      if (this._draggingDifX > 0) this._draggingDifX = 0;
      else if (this._draggingDifX < (this._elWidth * -1)) this._draggingDifX = (this._elWidth * -1);
    } else {
      if (this._draggingDifX > this._elWidth) this._draggingDifX = this._elWidth;
      else if (this._draggingDifX < 0) this._draggingDifX = 0;
    }

    // Set the percentage number of how much user has moved the sidebar
    this._draggingPerc = Math.floor( (this._elWidth - Math.abs(this._draggingDifX)) * 100 / this._elWidth );
    if (this._draggingPerc != 100 && this._draggingPerc != 0) this._isDraggingAlreadyDone = false;

    if (this._isDraggingAlreadyDone) return;

    // NOTE: This is for IOS! As I have explained in the _setElTouchListeners() function.
    if (this._isDraggingFirstTime) {
      this.$perspective.css({'transition-duration': '0.001ms'});
      setTimeout(() => {
        utils.removeInlineStyles(this.$perspective, 'transition-duration');
        this._isDraggingFirstTime = false;
      }, 25);
    }

    // Move the element accordingly
    this.$perspective.css({'transform': `translateX(${this._draggingDifX}px)`});
    // this.$perspective.css({'transition-duration': '0.001ms'}); // NOTE: At first I added this so that the block can to move fast according to the user's finger... But the I removed it, because in practice I saw that the block's transition duraration actually helps the block to move more smoothly on mobile devices..

    // Dispatch while dragging the elment with the percent of the dragging axis
    this.$element.trigger($.Event('dragging.f8bar'), {perc: this._draggingPerc});

    // Now check if dragging is done manually! I mean if user has dragged the
    // element all they way to perc=100 or vice versa... If that's the case,
    // then call the _draggingIsDone()
    if (this._draggingPerc == 100 || this._draggingPerc == 0) this._draggingIsDone();
  }

  _draggingOnUp() {
    if (this._isDraggingAlreadyDone) return;

    let percRemaining = 0;

    // this._draggingLastDifX = this._draggingDifX;

    // NOTE: This is for IOS! As I have explained in the _setElTouchListeners() function.
    utils.removeInlineStyles(this.$perspective, 'transition-duration');

    // If dragging is not completely done in _draggingOnMove(), then we will
    // be here, and perc is not complete yet! So complete it according to the
    // remaining perc and 'f8DraggablePercCompletionDuration' option.
    if (this.options.f8DraggablePercCompletionDuration != 0) {
      let intervalCounter = 0
      let isPercShallGoUp = (this._draggingPerc >= 50) ? true : false;
      if (this._draggingPerc >= 50) percRemaining = 100 - this._draggingPerc;
      else percRemaining = this._draggingPerc;

      this._draggingIntervalToCompletePerc = setInterval(() => {
        (isPercShallGoUp) ? this._draggingPerc++ : this._draggingPerc--;
        this.$element.trigger($.Event('autodragging.f8bar'), {perc: this._draggingPerc});
        if (++intervalCounter === percRemaining) {
          clearInterval(this._draggingIntervalToCompletePerc);
          this._isDraggingAutoDone = true;
          if (!this._isDraggingAlreadyDone) this._draggingIsDone(); // Why to check _isDraggingAlreadyDone? Because the $perspective transition duration may be less than the amount of 'f8DraggablePercCompletionDuration' option. In this case our listener to see when the $perspective transition ends at the end of this function, would be called sooner... And we don't like to trigger our dragged event twice!
        }
      }, (this.options.f8DraggablePercCompletionDuration / percRemaining));
    } else {
      this._draggingPerc = (this._draggingPerc >= 50) ? 100 : 0;
      this.$element.trigger($.Event('autodragging.f8bar'), {perc: this._draggingPerc});
      this._isDraggingAutoDone = true;
    }

    // Now according to prec (position of element), decide whether we should
    // open the element or close it
    if (this._draggingPerc >= 50) {
      this.$perspective.css({'transform': 'translateX(0)'});
    } else {
      if (!this.options.f8Rtl) this.$perspective.css({'transform': 'translateX(-100%)'});
      else this.$perspective.css({'transform': 'translateX(100%)'});
    }

    // Finally call the _draggingIsDone() when toggling transition of the
    // element is complete
    this.$perspective.one('transitionend.f8bar webkitTransitionEnd.f8bar oTransitionEnd.f8bar', () => {
      if (this._isDraggingAutoDone) this._draggingIsDone(); // If '_isDraggingAutoDone' was true, go on and finish the dragging... Otherwise, we don't do it! Because we like to wait untill our auto dragging interval proccess is done by completing the perc.
    });
  }

  _draggingIsDone() {
    utils.removeInlineStyles(this.$perspective, 'transform');
    // utils.removeInlineStyles(this.$perspective, 'transition-duration');

    if (this._draggingPerc == 0) {
      // If element is closed
      this._draggingLastDifX = this._elWidth;
      if (!this.options.f8Rtl) this.$element.addClass(this.options.f8DraggableCloseClass);
      else this.$element.addClass(this.options.f8DraggableCloseClassRtl);
    } else {
      // If element is opened
      this._draggingLastDifX = 0;
      this.$element.removeClass(this.options.f8DraggableCloseClass).removeClass(this.options.f8DraggableCloseClassRtl);
    }

    // Now also remove the 'transitionend' listener that we've added in
    // 'touchend' event callback here as well. Why? Because if this function
    // has been called by the 'touchmove' event callback, then if user herself
    // adds/removes a CSS class which runs the transition toggling, our
    // listener there, will be called and may conflict with what the user is
    // doing...
    this.$perspective.off('transitionend.f8bar webkitTransitionEnd.f8bar oTransitionEnd.f8bar');

    // Now dispatch that user has finished dragging with the final status
    // which shows element is finally open or close
    let status = (this._draggingPerc == 100) ? 'open': 'close';
    this.$element.trigger($.Event('dragged.f8bar'), {status: status});

    this._isDraggingAlreadyDone = true;
  }




  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /// Methods

  toggleDraggingListeners(removeListener = true) {
    if (!this.$element.hasClass('f8-bar--visual-side') || !this.options.f8Draggable) return;

    if (removeListener) {
      this.$draggingInteractor.off('touchstart.f8bar');
      this.$draggingInteractor.off('touchmove.f8bar');
      this._draggingOnUp(); // Finish dragging if user is at the middle of it...
    } else {
      this.$draggingInteractor.off('touchstart.f8bar').on('touchstart.f8bar', e => { this._draggingOnDown(e); });
      this.$draggingInteractor.off('touchmove.f8bar').on('touchmove.f8bar', e => { this._draggingOnMove(e); });
    }
  }

  destroy(keepCssStyles = false) {
    // Remove all probable added styles from any element
    if (!keepCssStyles) {
      this.$element.removeClass(this.options.f8DownClass).removeClass(this.options.f8UpClass);
      this.$element.removeClass(this.options.f8ThresholdDownClass).removeClass(this.options.f8ThresholdUpClass);
      this.$element.removeClass(this.options.f8TargetReachedDownClass).removeClass(this.options.f8TargetReachedUpClass);
      if (this.$target.length) this.$target.removeClass('f8-bar__target').removeClass(this.options.f8TargetDownClass).removeClass(this.options.f8TargetUpClass);

      if (this.options.f8IsScrollable) utils.removeInlineStyles(this.$element, 'transition', 'position', 'height');
      if (this.options.f8Draggable) utils.removeInlineStyles(this.$element, 'will-change', 'transform-style');
      if (this.options.f8Draggable) utils.removeInlineStyles(this.$perspective, 'will-change', 'transform-style');
    }


    // Remove listeners from any element
    if (this.options.f8HideAndSeek || this.options.f8Threshold) $(window).off('scroll.f8bar.2');
    if (this.options.f8Draggable) $(window).off('scroll.f8bar');
    if (this.options.f8Draggable) this.$draggingInteractor.off('touchstart.f8bar').off('touchend.f8bar touchcancel.f8bar').off('touchmove.f8bar');
    this.$perspective.off('transitionend.f8bar webkitTransitionEnd.f8bar oTransitionEnd.f8bar');


    // Remove any timeout or interval
    if (this.options.f8HideAndSeek || this.options.f8Threshold) clearInterval(this._scrollInterval);


    // Null all initialized plugins
    if (this.$target.length) this._waypoints[0].destroy();


    // Null all saved variables
    this.$element                            = undefined;
    this.options                             = undefined;
    this.$target                             = undefined;
    this.$draggingInteractor                 = undefined;
    this.$perspective                        = undefined;
    this._scrollInterval                     = undefined;
    this._waypoints                          = undefined;
  }

}




// Don't build the jQuery plugin if we're in a SSR environment.
if (typeof document !== 'undefined') {
  // Create our jQuery plugin
  pluginify('f8bar', Bar);

  // If there's no initializeF8BlocksManually variable which is true, then run 
  // the plugin for all the blocks in the page.
  jQuery(document).ready( $ => {
    if (typeof window.initializeF8BlocksManually !== 'boolean' || window.initializeF8BlocksManually === false) {
      $('.f8-bar').f8bar();
    }
  });
}
