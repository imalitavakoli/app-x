# Checks — Capacitor plugins and native code

**Load when:** the diff touches a Capacitor plugin — its TypeScript bridge, or its Android
(`.java`, `.kt`, `.gradle`) or iOS (`.swift`, `.m`, `.h`, `.podspec`) sources.

## No linter covers the native side

Static analysis for Kotlin, Java, Swift and Objective-C is **not configured** in these
workspaces. Nothing runs `detekt`, `swiftlint`, or an equivalent.

Two consequences, and both must reach the report:

1. Everything you find in native sources comes from reading, not from a tool. Never say a native
   check "would fail" — no check exists to fail.
2. **Every review touching native code adds a _What I did not check_ entry** saying the native
   sources were read but not statically analysed, because no linter is configured.

The TypeScript bridge is covered by the normal lint run; the native sources are not. Do not let
one exit code imply coverage of both.

## Where to look

| In the diff                                                    | Look at                                                                                                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| a plugin method added, renamed, or removed                     | that the TS bridge, the Android implementation and the iOS implementation all agree — signature, method name, and the plugin's registered name |
| a method present on one platform only                          | whether that is deliberate; a silently missing platform fails at runtime on that platform only                                                 |
| a returned payload                                             | that both platforms return the same shape and key names                                                                                        |
| permissions, entitlements, `AndroidManifest.xml`, `Info.plist` | a new permission is a release-blocking, store-review-affecting change; report it explicitly even when correct                                  |
| a dependency added in `build.gradle` or a `.podspec`           | it ships in the binary of every app embedding the plugin                                                                                       |
| the plugin's own version or `package.json`                     | whether consumers need to move with it                                                                                                         |
| threading — callbacks resolved off the main thread             | UI updates from a background thread are a native crash class                                                                                   |
| error paths                                                    | that a rejection reaches the TS side rather than being swallowed                                                                               |

**Platform parity is the highest-value check here**, because it is the one thing a reviewer
reading a single-platform diff will not notice, and the one thing web testing never catches. If
a change touches Android but not iOS, say so and ask whether iOS is intended to follow.

## A binary-affecting change is worth its own finding

A change to native sources, a native dependency, a permission, or a plugin's registration cannot
ship as a web-only update — it needs a full binary build and a store release. Whether that is
tracked by a release flag or by a person, the reviewer's job is to state plainly that this
change is not web-updatable, as a `note`, so nobody plans it as a live update.

If the workspace records that distinction somewhere in `docs/`, cite it. If it does not, say so
with `rule_source.kind: none` — and raise a `chore` finding that the rule has no doc home rather
than inventing the mechanism.

## Scope

Review the plugin change on its own terms. Do not review the app that consumes it unless the
diff also touches it, and do not propose migrating a plugin to a different Capacitor API version
as part of a review.

**Ionic UI is not this file.** Components that make a web view feel native (`ion-app`,
`ion-content`, `ion-header`, `ion-footer`, `ion-router-outlet`, and the rest of `ion-*`), and
the page-shell / lifecycle rules that go with them, live in the workspace's Ionic & Capacitor
docs. Load those through `references/doc-map.md`. A diff that only changes templates still needs
that map entry even when this file does not load.
