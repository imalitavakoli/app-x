# shared-ui-framework8

v1.3.1 (this version of framework is being used in our workspace as V1)

## Framework developer

@ImAliTavakoli

## Implementation guide

Well, apps or libs should import jQuery + any of this lib's blocks (they can also simply refer to this lib's `index.ts` and `index.scss` to load all of the available blocks all at once).

Here's **the step by step implementation guide** in order to use the whole lib in an Angular app or '_feature_'/'_page_' lib:

- Modify `project.json` file.  
  Specifically edit the following parts:  
  `"scripts": ["node_modules/jquery/dist/jquery.js"],` to load jQuery.  
  `"allowedCommonJsDependencies": ["jquery"],` to allow CommonJS modules.  
  `"stylePreprocessorOptions": {"includePaths": ["libs/shared/ui"]},` to load non-technology related '_ui_' libs successfully.

- Create/modify `src/styles.scss` file (or any similar file that you import your global styles in there).  
  Specifically add the following parts:  
  `@use 'framework8/src';` to import this libs' `.scss` blocks.

- Create/modify `src/base.{ts,js}` file (or any similar file that you write your global codes in there, before importing any other libs. This file can also be your `index.html` file! You can write a `<script>` tag in it, right before loading any other script, and write your global JavaScript codes in there).  
  Specifically add the following parts if it's a TS code:  
  `declare global {interface Window {initializeF8BlocksManually: boolean;}}` to declare the needed variable globally.  
  Specifically add the following parts if it's a JS or TS code:  
  `window.initializeF8BlocksManually = true;` to define the needed variable globally.

- Modify `src/scripts.ts` file (or any similar file that you import your global scripts in there).  
  Specifically add the following parts:  
  `import * as $AB from 'jquery';` to import jQuery.  
  `import '@x/shared/ui/framework8';` to import this libs' `.js` blocks.

- That's it! Now you can initialize each block and use them inside your apps or '_feature_' libs. The instruction about how to use each block of the lib is written inside of the blocks' files themselves.  
  **Note!** When using jQuery plugins in Angular components or directives, remember to only initialize them inside of the `ngAfterViewInit()` lifecycle method, and destroy them in `ngOnDestroy()`.

## Important requirements

- jQuery version 1.9.1 or higher
