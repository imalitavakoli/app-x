/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

// Here's the TypeScript typings file, if you're going to use the Framework8
// jQuery plugins in a TypeScript project such as Angular apps.
// How to get started:
// 1. Install [node.js](https://nodejs.org/download/) (which includes npm)
// 2. Open your Terminal / Command Prompt and run the following commands:
//  - Change directory to your project's root folder: `cd my/path/to/project`
//  - Run `npm install jquery && npm install @types/jquery --save-dev` to install required local dependencies.
// 3. Import jquery + this file + any of the jQuery plugins that you like to use, inside of your main app's TypeScript file.
//  NOTE: Of course you MUST have already feeded your app's `index.html` with `node_modules/jquery/dist/jquery.js`.
//  `import * as $AB from 'jquery';`
//  `import './typings.d.ts';`
//  `import './PLUGIN_NAME/PLUGIN_NAME';`

interface JQuery {
  f8bar(options?: any, ...params: any) : any;
  f8editable(options?: any, ...params: any) : any;
  f8icon(options?: any, ...params: any) : any;
  f8nav(options?: any, ...params: any) : any;
  f8revealer(options?: any, ...params: any) : any;
  f8smoothscrolling(options?: any, ...params: any) : any;
  f8switchdaylight(options?: any, ...params: any) : any;
  f8toggle(options?: any, ...params: any) : any;
}
