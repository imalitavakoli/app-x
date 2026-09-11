# Checks — styles

**Load when:** the diff contains `.scss`, `.css`, a template with class attributes, or a
component's inline styles.

The naming schema for CSS classes and custom properties is owned by
`docs/guidelines/naming-conventions.md`. Brand color tokens are owned by
`docs/getting-started/designers-related.md`. Using Tailwind in templates is owned by
`docs/guidelines/best-practices.md`. Read them and enforce what they say. Quote the doc's line
beside the offending declaration rather than restating the schema.

## Where to look

| In the diff                                                                                   | Look at                                                                                                        |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| a declared CSS custom property                                                                | its name against the schema, and the class it is declared in                                                   |
| a color literal — hex, `rgb()`, `rgba()`, `hsl()`, a named color                              | whether a brand custom property should be used instead                                                         |
| a Tailwind utility class, including a default palette class (`bg-red-50`, `text-blue-600`, …) | whether that class is in the closed set the consuming app's config and the preset it extends actually generate |
| a CSS class name                                                                              | its schema, and whether it collides with another lib's                                                         |
| a keyframes name, a CSS variable at `:root`, a global selector                                | anything global can collide across libs                                                                        |
| a media query or breakpoint literal                                                           | whether the workspace defines breakpoints centrally                                                            |
| a style file added to a lib                                                                   | whether anything actually loads it                                                                             |

## Tailwind classes

The consuming app's Tailwind config, plus the `ui` preset that config's `presets` array extends,
is the **closed set** of utilities this change may use. Tailwind's own default catalogue is not
a second source of truth.

A class that set does not generate produces **no CSS and no error** — the element simply renders
unstyled, and nothing in the build says so. That silence is why this is worth checking by
reading.

Two cases, same finding:

- A default-palette class (`bg-red-50`, `text-blue-600`, `border-gray-200`, and the rest of
  Tailwind's stock colors) that the preset **replaced** rather than extended. No CSS is emitted.
- The same class, or a hex / `rgb()` / named color in CSS or inline styles, when the workspace
  already defines brand tokens. Every brand then renders the same static color and ignores its
  theme.

Resolve the class against the config _and_ the preset it extends before reporting: a class
absent from the app config may well be defined in the preset. `@apply` of a class is the same
check as a class attribute.

If you cannot resolve the preset chain, say so in _What I did not check_ rather than reporting a
class you could not verify.

## A style file nothing loads

A stylesheet added beside a component that is never referenced by it is dead on arrival — the
styles will not apply and the author will not know why. Check that a new style file is actually
wired to something. This is frequently a symptom of a larger unfinished change; if so, see the
single-finding rule in `checks/angular.md`.

## Calibration

Style findings inside a **new, unconsumed** lib are non-blocking; the same finding in a shared
lib that existing apps already render is blocking, because it changes what users see today.
`SKILL.md` owns that calibration — apply it here rather than treating all style issues alike.

A color literal in a **mock, fixture, or example** file is not a theming defect. Check what the
file is for before reporting it. The same exemption does **not** apply to a default Tailwind
palette class in production templates or styles.
