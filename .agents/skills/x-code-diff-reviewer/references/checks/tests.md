# Checks — tests

**Load when:** the diff contains a `*.spec.ts`, an e2e spec, a fixture, or a lib whose tests
should have changed with it.

Conventions for how a spec is written, and how FR/BR/US/AC IDs map onto it, live in the test
helper skills' examples — see `references/skill-assets-map.md`. Do not restate them here or in
the report; compare the change against the example and cite its path.

## What to look at

| In the diff                                                              | Look at                                                                    | Source of truth                                       |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| a new or changed `*.spec.ts`                                             | does its shape match the canonical spec example                            | the unit-test helper's `assets/examples/unit-spec.md` |
| a lib with a `docs/x/{domain}/{name}/TSD/`                               | does every FR/BR ID in the TSD appear in a spec title                      | that TSD — the artifact, not a skill                  |
| a `util`, product `app`, or grab-bag lib                                 | does every ID in the lib's `requirements/README.md` appear in a spec title | that registry                                         |
| an e2e spec or fixture                                                   | shape, target app, hermetic stubbing, selectors                            | the e2e helper's examples                             |
| a `page` lib, or a `feature` composing another functionality's `feature` | does it have e2e at all                                                    | the e2e helper's `references/e2e-app.md`              |
| production code changed with no spec touched                             | is the behaviour it changed covered anywhere                               | the TSD or registry above                             |

An ID present in the registry but in no spec title is a finding. An ID in a spec title that no
registry declares is also a finding — it means the registry is behind.

## Boilerplate specs are not coverage

A spec that only contains what the generator emitted proves nothing, and counting it as coverage
is how a lib comes to look tested while being untested.

Renaming the class or file to match the lib does **not** graduate the spec. The body is what
counts.

**Recognition rule — a spec is boilerplate when it still matches a generator scaffold**, with no
behaviour the author added. Either shape below is enough.

### Component, service, pipe, or directive scaffold

All of these hold:

1. It has one test case, or none.
2. That case asserts only that the thing exists — `expect(component).toBeTruthy()`,
   `expect(service).toBeDefined()`, or an empty body.
3. Its title is the generator's default — `should create`, `should be created`, or the lib name
   alone.
4. It asserts nothing about behaviour, inputs, outputs, state, or error handling.

### Effects or store scaffold

All of these hold:

1. It has one test case (or one nested `describe` with one case).
2. Its title is a generator default — `should work`, `should create`, or `should be created`.
3. The assertion only replays the scaffolded happy path with empty data — a marble (or equivalent)
   of a generated `init$` emitting `initSuccess({ items: [] })`, or the same empty-collection
   success under whatever names the generator used.
4. It asserts nothing about this lib's actual effects, failure paths, or mapped data.

Placeholder identifiers left over from the generator (`Blahblah`, `ItemsEffects` paired with
`ItemsActions.init`, a file that still imports `./items.effects`) are a strong extra signal.
They are not required: a renamed class with the same empty body is still boilerplate.

Three worked cases:

```ts
// BOILERPLATE — skip it, emit a `note`, do not count it as coverage.
describe('V1CardComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

```ts
// NOT boilerplate — one case, but it asserts real behaviour. Review it properly.
describe('V1CardComponent', () => {
  it('emits hasError when the user lookup fails', () => {
    service.getUser.mockReturnValue(throwError(() => new Error('nope')));
    component.load();
    expect(emitted).toEqual({ key: 'getUser', value: 'nope' });
  });
});
```

```ts
// BOILERPLATE — NgRx effects scaffold. Skip it, emit a `note`.
describe('ItemsEffects', () => {
  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ItemsActions.init() });
      const expected = hot('-a-|', {
        a: ItemsActions.initSuccess({ items: [] }),
      });
      expect(effects.init$).toBeObservable(expected);
    });
  });
});
```

**When a spec is boilerplate:**

- Emit a `note`, non-blocking, saying the file has a spec but no coverage.
- Do **not** report every missing assertion as a separate finding. One note per file.
- Do **not** treat its presence as satisfying an FR/BR/US/AC mapping. An ID mapped to a
  boilerplate spec is an unmapped ID.
- Do **not** skip reviewing the production code because a spec file exists.

## Running them

`SKILL.md` owns when tests run and what may be claimed about the result. Two rules bear
repeating because they interact here:

- A failing test is reported from its **actual exit code**, in _Automated checks_. Never predict
  that a test would fail.
- A test suite you did not run — because the diff had no affected projects, because tooling is
  absent, or because e2e was not requested — goes in _What I did not check_ with the reason.

A test that fails **for a reason the change introduced** is a blocking finding. A test that was
already failing on the base branch is not this change's problem: check the base before
attributing it, and say which you did.
