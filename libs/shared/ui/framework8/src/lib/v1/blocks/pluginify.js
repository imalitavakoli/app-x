/**
 * Generate a jQuery plugin.
 * Inspired by: https://gist.github.com/monkeymonk/c08cb040431f89f99928132ca221d647
 * @copyright 2022 MyThemeIsReady. All Rights Reserved.
 *
 *
 * Requirements:
 * - jQuery version 1.9.1 or higher
 *
 *
 *
 *
 * @param pluginName [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as $.pluginName
 *
 * @example
 * import pluginify from 'pluginify';
 *
 * // Create your class.
 * class MyPlugin {
 * 		constructor(element, options) {
 *   		// ...
 *   	}
 *   	method(arg1, arg2) {
 *   	  // ...
 *   	}
 * }
 *
 * // Set its default options if it's going to have any.
 * MyPlugin.DEFAULTS = {};
 *
 * // Pluginify your class!
 * pluginify('myPlugin', MyPlugin);
 *
 * $(selector).myPlugin({options}); // Now just call your plugin on a selector.
 * $(selector).myPlugin().somethingElse(); // It's chainable too!
 * $(selector).myPlugin('method', arg1, arg2); // You can also call a specific method of your plugin.
 *
 * // Destroy your already initialized plugin.
 * // NOTE: You MUST also have a 'destroy' method on your plugin as well, in
 * // order to undo anything you have done on plugin initialization.
 * $(selector).myPlugin('destroy');
 */
export default function pluginify(pluginName, className, shortHand = false) {
  let dataName = `__${pluginName}`;
  let old = $.fn[pluginName];

  // Call our plugin for any number of DOM elements (the elements that our
  // plugin is supposed to be initialized for them) by using .each() method and
  // then return the results of .each() as it returns this (the original jQuery
  // object) to enable chaining.
  $.fn[pluginName] = function(option, ...args) {
    return this.each(function() {
      let $this = $(this);
      let data = $this.data(dataName);

      // Let's merge all of the options that we've recevied from different
      // places: defaults, data API, and the options that user has passed while
      // calling the plugin.
      let options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);

      if (!data) {
        $this.data(dataName, (data = new className(this, options)));
      }

      // If option was a string then it means that user is trying to call a
      // method of our plugin, so let's do it!
      if (typeof option === 'string') {
        data[option].apply(data, args);

        // If user was calling the 'destroy' method of our plugin, then delete
        // the already stored arbitrary data (that its name is our plugin's
        // name) associated with the matched elements... Why? To go through the
        // above if statment in the next call in order to initialize the plugin
        // class once again, whenever user tries to initialize the plugin again
        // after she destroys it.
        if (option === 'destroy') {
          $this.removeData(dataName);
          data = undefined;
        }
      }
    });
  };

  // Short hand
  if (shortHand) {
    $[pluginName] = (options) => $({})[pluginName](options);
  }

  // No conflict
  $.fn[pluginName].noConflict = () => $.fn[pluginName] = old;
}
