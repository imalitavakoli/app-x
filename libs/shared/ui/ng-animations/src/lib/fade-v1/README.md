# shared-ui-ng-animations

v1.

## Implementation guide

Here's how you implement **pagination animations**:

- If you like to have the pagination animation for your entire app, import this lib to your `app.component.ts`. And if you like to have it for some child pages a components (main page), import it to that component: `import { v1FadeAni, v1FadeCssAni } from '@x/shared-ui-ng-animations';`.

- Just like using any other animations inside your components, add `animations: [Vx.aniName]` (e.g., `v1FadeAni`) to your `@Component` decorator.

- Then in your component's template, use the Angular's `router-outlet` directive like this:

```html
<main [@v1FadeAni]="o.isActivated ? o.activatedRoute : ''">
  <router-outlet #o="outlet"></router-outlet>
</main>
```

**Tip!** For the CSS animations though, remember to (1) import the needed `.scss` into your global styles path, (2) take a look at the the animation's `.scss` file to see how to structure your component's template (HTML), (3) define `isOutletAnimating = false;` inside your component class, as the CSS transitions use it to add/remove their class on the HTML element (parent element of the `<router-outlet>` directive).

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-animations` to execute the unit tests.
