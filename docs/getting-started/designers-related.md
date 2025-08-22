[🔙](../../README.md#getting-started)

# Designers related 🎨

Every compiled app (`fin/apps/{app-name}/browser`) for a brand (client) has its own colors & images. So here we wanna mention some notes that can help designers to take care of brand-specification easier in their own Figma (or other design) files.

&nbsp;

[🔝](#designers-related-🎨)

## Exporting brand-specific images

Here is the list of images that all apps have! These images should be changed for each brand (client).

**Tip!** If an app needs other images that require brand-specification, we have listed those images in the app's `apps/{app-name}/README.md` file.

&nbsp;

- `favicon.ico`: All apps have a 'favicon' (AKA shortcut icon, website icon, tab icon, URL icon, or bookmark icon).  
  **What is it?** In simple terms, it's the logo of the company that appears in browser's tab when you visit that company's website/webapp.  
  **How to design it?** You can open `_OBS/ali/apps/ng-boilerplate/src/favicon.psd` file as an example to just learn what are the specifications of this file, such as its dimensions, and the margins that logo needs to have from the edges of the image.  
  **How to export it?** You can save the image in `.png` format, and then upload your image to [Favicon Convertor](https://favicon.io/favicon-converter/) to download the final `.ico` file.  
  **Where it should rest?** This file rests at the root of the application's fin files, which is beside the `index.html` file. e.g., `fin/apps/{app-name}/browser`.

&nbsp;

- `icon-{72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512}.png`: All apps have icons.  
  **What are they?** They are the app's icons when the app is installed on a user's device as a [PWA](https://web.dev/explore/progressive-web-apps).  
  **How to design them?** Open `_OBS/ali/apps/ng-boilerplate/src/assets/icons/icon.psd` file as an example to learn about their specifications.  
  **How to export them?** You design one single image, but export it in `.png` format, multiple times in different sizes and names.  
  **Where they should rest?** These files rest at `fin/apps/{app-name}/browser/assets/icons/`.

&nbsp;

- `logo.webp`, `logo_in-day.webp`, `logo_in-night.webp`: All apps have logo.  
  **Any concern?** Some rare apps may NOT have this file, but those are exceptions. `logo.webp` is the main logo design (which usually appear in the header of the app). `logo_in-day.webp` is the one that will only appear on top of white background (like in authentication page). `logo_in-night.webp` is the one that will only appear on top of black background.  
  **What is it?** It's the logo of the company that is used in different parts of the app. e.g., in the header or authentication page. It's in `.webp` format which is a modern image format that provides superior lossless and lossy compression for images on the web.  
  **How to design it?** Open `_OBS/ali/apps/ng-boilerplate/src/assets/images/logo.psd` file as an example to learn about its specifications.  
  **How to export it?** Export it in `.webp` format. [Click here](https://www.figma.com/community/plugin/1181873200384736932) to learn more about exporting `.webp` formats in Figma.  
  **Where it should rest?** This file rests at `fin/apps/{app-name}/browser/assets/images/`.

&nbsp;

[🔝](#designers-related-🎨)

## Defining brand-specific colors & styles

Here is the list of color variables that all apps have (`apps/{app-name}/src/assets/DEP_style.css`)! These colors should be changed for each brand (client).

**Tip!** If an app needs other color variables for some of its unique elements that require brand-specification, we have listed those colors in the app's `apps/{app-name}/README.md` file.

**Tip!** [uicolors](https://uicolors.app/create) is a great tool to create different color palettes.

**Note!** Provide colors in _rgb_ format. e.g., `--e-day-lighter-color: 255 255 255;`. [Click here](https://tailwindcss.com/docs/customizing-colors#using-css-variables) to read more about it.

&nbsp;

### General color variables

The following color variables are used across the whole application for variety of elements.

&nbsp;

- `--e-day-lighter-color`, `--e-day-color`, `--e-day-darker-color`: Day color with different shades of it (lighter & darker) will be used as the **app's background color, when the app is in _light_ mode**.  
  **Note!** They are dynamic variables that can be modified, but 99% of the times, **designers don't need to change them!** Why? Because all apps should have a pure white background when they are in light mode, right? But we have made it dynamic to be modified in some edge cases...  
  **Tip!** `--e-day-lighter-color` variable is used for the app's background color and its default value is pure white (`255 255 255` which is equal to `#ffffff`). `--e-day-color` or `--e-day-darker-color` will be used rarely in the apps.

&nbsp;

- `--e-night-lighter-color`, `--e-night-color`, `--e-night-darker-color`: Night color with different shades of it (lighter & darker) will be used as the **app's background color, when the app is in _dark_ mode**.  
  **Note!** They are dynamic variables that can be modified, but 99% of the times, **designers don't need to change them!** Why? Because all apps should have a blackish background when they are in dark mode.  
  **Tip!** `--e-night-color` variable is used for the app's background color and its default value is dark grey (`69 69 69` which is equal to `#454545`). `--e-night-lighter-color` or `--e-night-darker-color` will be used rarely in the apps.  
  **Tip!** We don't use pure black as the background color of the app, because not only that high contrast doesn't look good, but also it avoids shadows to be seen (like card or button shadows), because shadows are in pure black color. [Click here](https://uxplanet.org/8-tips-for-dark-theme-design-8dfc2f8f7ab6) to learn more about dark theme design.

&nbsp;

- `--e-informative-lighter-color`, `--e-informative-color`, `--e-informative-darker-color`: Informative colors are used to **show informative content, such as information alerts**.

&nbsp;

- `--e-positive-lighter-color`, `--e-positive-color`, `--e-positive-darker-color`: Positive colors are used to **show positive content, such as success graphics**.

&nbsp;

- `--e-negative-lighter-color`, `--e-negative-color`, `--e-negative-darker-color`: Negative colors are used to **show negative content, such as error graphics**.

&nbsp;

- `--e-notice-lighter-color`, `--e-notice-color`, `--e-notice-darker-color`: Notice colors are used to **show notice content, such as noticeable alerts**.

&nbsp;

- `--e-primary-lighter-color`, `--e-primary-color`, `--e-primary-darker-color`: Primary colors are used as the **app's primary color**.  
  **Tip!** Primary color with different shades of it can simply be as same as informative colors.

&nbsp;

- `--e-accent-lighter-color`, `--e-accent-color`, `--e-accent-darker-color`: Accent colors are used as the **app's accent color**.  
  **Tip!** Accent color with different shades of it can simply be as same as notice colors.

&nbsp;

- `--e-neutral-lighter-color`, `--e-neutral-color`, `--e-neutral-darker-color`: Neutral colors are special colors that are used to **show neutral content, such as secondary texts, borders, or cards backgrounds**. They are used with low opacity (e.g., 60% or 30%) most of the times to adapt themselves with the app's background color, when user switches the app's mode to light or dark.  
  **Note!** They are dynamic variables that can be modified, but 99% of the times, **designers don't need to change them!** Why? Because most of our apps support light & dark modes and the neutral default values work great in both, light & dark modes.  
   **Tip!** `--e-neutral-color` is the neutral's default variable, and its value is grey (`136 136 136` which is equal to `#888888`).

&nbsp;

**Note!** Unlike informative/positive/negative/notice colors that only be used when we wanna show something semantically related to such colors (e.g., an alert box), primary/accent colors with different shades of them are the mostly used colors in various elements in an app! (e.g., buttons, gradient backgrounds, etc.)

**Note!** Just to give an example about how different shades of the primary/accent colors are going to be used, take the 'button' element into consideration! When we wanna use primary/accent colors for a button, main colors (`--e-primary-color` or `--e-accent-color`) will be the button's background color on normal state, and shade colors (`--e-primary-lighter-color`, `--e-primary-darker-color`, `--e-accent-lighter-color`, or `--e-accent-darker-color`) will be the button's background color on the hover state!

&nbsp;

### Specific elements color variables

The following color variables are used only for some specific elements in the applications. And yes, these elements are available in (almost) all of our apps.  
The name of the variables are self-explementary, so here we just describe what are each element themselves all about.

&nbsp;

- `e-preloader` element is the **app's initial preloader's background**. The background color covers the whole page.  
  Variable name(s):

  - `--e-preloader--bg-color`: Background color can be equal to `--e-primary-color`.

&nbsp;

- `e-preloader__bar` element is the **app's initial preloader's bar itself**.  
  Variable name(s):

  - `--e-preloader__bar--color`: Bar color can be equal to `--e-day-lighter-color`.

&nbsp;

- `e-fader` element is the **app's fader** which covers the whole content of the app when user is switching between different pages.  
  **Any concern?** Some apps may NOT have this element.
  Variable name(s):

  - `--e-fader--bg-color--light`: Background color in light mode can be equal to `--e-day-lighter-color`.
  - `--e-fader--bg-color--dark`: Background color in dark mode can be equal to `--e-night-color`.

&nbsp;

- `e-link` elements are the **links** that take the user to a different page.  
  Variable name(s):

  - `--e-link--color--light`: Text color in light mode. Default is `--e-primary-darker-color`.
  - `--e-link--color--dark`: Text color in dark mode. Default is `--e-primary-color`.

&nbsp;

- `e-btn--base` elements are the **buttons with 'Base' role** that does a base action in a lib.
  Variable name(s):

  - `--e-btn--base--bg-color`: Background color. Default is `--e-primary-color`.
  - `--e-btn--base--color`: Text color. Default is `--e-day-lighter-color`.
  - `--e-btn--base--border-color`: Border color. Default is `--e-primary-color`.

  &nbsp;

- `e-btn--secondary` elements are the **buttons with 'Secondary' role** that does a secondary action in a lib.
  Variable name(s):

  - `--e-btn--secondary--bg-color`: Background color. Default is `--e-primary-color`.
  - `--e-btn--secondary--color`: Text color. Default is `--e-day-lighter-color`.
  - `--e-btn--secondary--border-color`: Border color. Default is `--e-primary-color`.

&nbsp;

[🔝](#designers-related-🎨)

## UX edge decisions

You may see an app in action, and might wonder what some error (or sometimes informative) codes mean in different parts of the app when a special scenario happens (or is happening behind the scenes)? You can read the app's `README.md` file ('UX edge decisions' section) to learn more about what each code mean and what actions the app takes in some special occasions.

**What do we mean by 'UX edge decisions'?**  
Imagine our app is supposed to show a energy data chart... If the app receives an error from server, we show that error on the front-side with a friendly readable message, but also attach a special code to it (e.g., `V3InsightsFacade(V1BaseFeatureComponent_main)/locations`). This code's description can be found in the app's `README.md` file ('UX edge decisions' section).

**How 'UX edge decisions' descriptions can help?**  
UX edge decisions' actions & codes help us in variety of ways, like: Remembering why we have decided to let the app behave in such a special way at the first place when we come back to the project after a while in the future, easier debugging when our clients share a screenshot from the app and like us to change something about it, and having a better overview of our app's edge cases.

[🔙](../../README.md#getting-started)
