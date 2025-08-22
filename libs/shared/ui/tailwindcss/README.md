# shared-ui-tailwindcss

Tailwindcss Presets.  
Here we put [Tailwindcss](https://tailwindcss.com) presets.

## Implementation guide

Here's **the step by step implementation guide** in order to use the whole lib in an app which uses Tailwindcss:

- Simply define the `presets` option in your `tailwind.config.js` file and point to the presets that are available here in this lib:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('../../libs/shared/ui/tailwindcss/src/lib/v1/preset-tailwind.config.js'),
  ],
  // ...
};
```

- To use the global reset styles too, just import them in your app's global styles:

```scss
@use 'tailwindcss/src/lib/v1' as tailwindcss;
```
