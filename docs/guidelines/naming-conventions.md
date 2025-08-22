[🔙](../../README.md#guidelines)

# Naming conventions 👪

Here we wanna talk about our naming conventions.

&nbsp;

[🔝](#naming-conventions-👪)

## Folders

For folders (and files) we basically consider the following:

- **Technology prefix**: When we generate an app or a library, if it's made for a specific technology, we start its folder name with that technology's name, like '_ng_'. This helps us know what's inside the project right away.  
  e.g., if we like to generate an app which has a basic setup for other Angular apps, we name it '_ng-boilerplate_'.
- **Underscore prefix**: When we like to have more files inside of a library (rather than the required files) which are NOT going to exposed globally, we start those files or folders names with '\_'.  
  e.g., '_\_util_', '_\_chart.interfaces.ts_'.

**Tip!** If a library only uses `.css` or `.js` files (or even `.scss` or `.ts` files), we don't need to add any prefix. These can be used in different types of projects.

**Tip!** If a library is already inside a folder named after a technology, we don't need to prefix its name again. For instance, if `HomeComponent` is an Angular component in the `libs/ng-boilerplate/page/home` directory, we don't add '_ng_' to its name since its location already tells us it's for Angular.

&nbsp;

[🔝](#naming-conventions-👪)

## Coding

We recommend some naming conventions for different types of variables/functions to quickly understand their purpose when we encounter them in our code.

**Tip!** These are just suggestions and not strict rules. Naming conventions may vary based on the language or technology we're using.

- **private variables or functions**: Start with `_`. For example, `private _name: string = 'John';`.
- **Globally exposed interfaces**: Use `V{x}{LibName}_{InterfaceName}` schema. For example, `V1FormattersDate_DateFormat`.
- **Globally exposed utility functions**: Use `v{x}{funName}` schema. For example, `v1DateFormat`.
- **Local storage items**: Use `e{ShortLibName}_{itemName}` schema. For example, `eAuth_token`.

&nbsp;

- **Observable variables**: End with `$`. For example, `count$: Observable<CounterState>;`.
- **Boolean variables**: Start with `is`, `has`, 'shall'. For example, `isUserAuthenticated = false;`.
- **Array variables**: End with `s` or `Arr`. For example, `errors = [];`, `forbiddenNamesArr = ['John', 'Jane'];`.
- **Object variables**: End with `Obj`. For example, `userObj = {name: 'John', age: 32};`.
- **Subscription variables**: End with `Sub`. For example, `intervalSub: Subscription;`.
- **Service variables**: End with `Service`. For example, `usersService: UsersService;`.

&nbsp;

- **Component outputs**: Use past tense verbs. For example, `clickedViewDetails`.
- **Handler functions**: Start with `on`. For example, `onClickedViewDetails() {}`.

&nbsp;

- **'map' lib's API interfaces**: Start with `Api`. For example, `ApiSomething`. API payload interfaces: Start with `ApiPayload`. For example, `ApiPayloadSomething`. API error interfaces: Start with `ApiError`. For example, `ApiErrorSomething`.
- **'map' lib's Mapped interfaces**: Start with `Map`. For example, `MapSomething`.
- **'map' lib's methods**: Start with the API endpoint verb that the method is going to deal with. For example, `getSelectedLang`, `PostSelectedLang`.

&nbsp;

- **'ui' lib's Components class name**: Use `V{x}{Name}Component` schema. For example, `V2ChartComponent`.
- **'ui' lib's Components selector name**: Use `x-{name}-v{x}` schema. For example, `x-chart-v2`.
- **'feature' lib's Components class name**: Use `V{x}{Name}FeaComponent` schema. For example, `V2ChartFeaComponent`.
- **'feature' lib's Components selector name**: Use `x-{name}-fea-v{x}` schema. For example, `x-chart-fea-v2`.
- **'page' lib's Components class name**: Use `V{x}{Name}PageComponent` schema. For example, `V1DashboardPageComponent`.
- **'page' lib's Components selector name**: Use `x-{name}-page-v{x}` schema. For example, `x-dashboard-page-v1`.

&nbsp;

[🔝](#naming-conventions-👪)

## Styling

We suggest using the [BEM methodology](https://en.bem.info/methodology/) for styling, a popular way of naming and organizing CSS classes adopted by many companies and frameworks.

- **Block**: A standalone entity with meaningful semantics. Examples include `header`, `container`, `menu`, `checkbox`, `input`. Block names follow the `block-name` format. For example, `menu`, `lang-switcher`.
- **Element**: A part of a block with no standalone meaning, semantically tied to its block. Examples include `menu item`, `list item`, `checkbox caption`, `header title`. Element names must identify their belonging to the block and are delimited by double underscores (`__`). The full name of an element follows the scheme: `block-name__elem-name`. For example, `menu__item`, `lang-switcher__lang-icon`.
- **Modifier**: A flag on a block or element used to change appearance or behavior. Examples include `disabled`, `highlighted`, `checked`, `fixed`, `size big`, `color yellow`. Modifier names must identify their belonging to the block or its element and are delimited by double hyphens (`--`). The full name of a modifier follows these schemes: (1) Block modifier: `block-name--mod-name`. For example, `menu--hidden`. (2) Element modifier: `block-name__elem-name--mod-name`. For example, `menu__item--visible`.

&nbsp;

It's also worth mentioning that, beside using the BEM methodology naming convention, we also use the following standards:

- **CSS class names**: Use `e-{short-lib-name}` schema. For example, `e-chart`.  
  **Tip!** Of course for styling different HTML elements in your lib, you can use BEM methodology. For example to style 'series' elements in Chart lib: `e-chart__series-ic-color-0`.

&nbsp;

- **CSS variables for changing text color in light/dark mode**: Use `--e-{css-class-name}--color--{light,dark}` schema. For example, `--e-header-desktop--color--light`.

- **CSS variables for changing bg color in light/dark mode**: Use `--e-{css-class-name}--bg-color--{light,dark}` schema. For example, `--e-header-desktop--bg-color--light`.

&nbsp;

- **CSS variables for any styling rules in all modes**: Use `--e-{css-class-name}--{rule}` schema. For example, `--e-chart--border-color`.

- **CSS variables for any styling rules in light/dark mode**: Use `--e-{css-class-name}--{rule}--{light,dark}` schema. For example, `--e-chart--border-color--light`.

&nbsp;

**Tip Regarding CSS variables:** A CSS variable name can consist of multiple parts (such as CSS class name, styling rule, and mode), and parts get divided by '--'. Now it's worth mentioning that, the first part of your CSS variable must match the CSS class that the variable is defined in. For example, if your CSS class name is `e-header-desktop__nav-link--active`, then the CSS variable name (for changing text color in all modes) which is defined in that CSS class, should be `--e-header-desktop__nav-link--active--color`.

[🔙](../../README.md#guidelines)
