# Verification evidence

Date: 2026-10-26. Windows executor, Node 20.19.3, npm 10.8.2. React/React DOM 19.3.1, TypeScript 5.9, Vite 7.3.7, Vitest 4.1.12. Exact installed versions are in package-lock.json.

## Source provenance

The original owned and approved LightStage study is retained in `reference/`. Its 21 mock-DOM assertions passed, and visual comparison used actual local browser-rendered source. The initial concept had not passed visual QA before this work; the evidence below is from the reusable React implementation.

## Automated checks

| Check | Result |
| --- | --- |
| Original source syntax and mock-DOM interaction harness | Syntax valid; 21 assertions passed. Retained source and harness are in reference/. |
| `npm run typecheck` | Passed. |
| `npm test` | 15 tests passed across state and React behavior suites after the final review fixes. The independent reviewer also reran the previous 13-test baseline successfully. |
| `npm run build` | Library declarations/ESM/CSS and production showcase built successfully. |
| `npm run pack:check` | Actual .tgz installed in an isolated consumer; ESM import, Node server render, TypeScript consumer and Vite bundle with exported CSS passed. |
| `npm audit` | Zero reported vulnerabilities after updating the test runner to patched Vitest 4.1.12. This is a point-in-time registry check. |

The tests cover invalid numeric inputs, default reset, state isolation, unsubscribe behavior, refs/native props, disabled buttons, root-only keyboard input, frame-coalesced pointer input, queued input interrupted by reset, touch cancellation without preventDefault, nested and sibling scenes, StrictMode cleanup, reduced-motion changes, document visibility and repeated manual/automatic takeover, SSR output and hydration without recoverable mismatches.

## Bounded independent review

An independent read-only subagent reviewed the actual source, tests, package scripts and documentation. It reproduced two defects in the initial local commit: Reset did not discard queued pointer movement if values were already at defaults, and all three native wrappers discarded React 19 callback-ref cleanup functions. Two new regression tests failed against that implementation, then passed after the fixes. Reset and explicit position commands now notify input subscribers even with an unchanged snapshot; forwarded native refs now use React's imperative-handle lifecycle, preserving callback cleanup.

The review also identified that `touch-action: pan-y` excluded browser pinch zoom. The reusable root and showcase now specify `pan-y pinch-zoom`; no material appearance or geometry changed. Physical multi-touch zoom remains part of device QA.

The independent reviewer inspected those fixes again and found no introduced defect. Final Chrome inspection confirmed computed `touch-action: pan-y pinch-zoom` at a 390px viewport, with scrollWidth 375px. Desktop/mobile screenshots were refreshed from the corrected production build.

The reviewer found no additional definite lifecycle, SSR, state-isolation or security defect in this bounded inspection. This is not an exhaustive security audit. The requested distribution pattern is represented by the playground, source-copy instructions, typed tarball, examples and coding-agent guide. A project-scoped installable agent skill is now included and its installer is tested for correct installation, idempotence and conflicting-file preservation. A hosted registry and hosted skill catalog remain optional future distribution work.

Dependency review accounted for all 197 lockfile entries: each resolves to registry.npmjs.org and has an integrity hash and declared license. See DEPENDENCIES.json for the full inventory and THIRD-PARTY-NOTICES.txt for existing notices of the showcase's bundled React, React DOM and scheduler. LightStage now uses the owner-approved MIT license.

The first test run with patched Vitest under the restricted Windows sandbox failed before executing tests because a temporary-file rename was denied (`EPERM`). The same tests passed with the supported local sandbox escalation. This was an execution-environment restriction, not an ignored failing assertion.

## Browser inspection

Used supported Chrome browser tools on loopback. Inspected both the original source and the React extraction. Final production build was served separately from Vite development HMR for stable checks.

- Desktop: 2560 × 1249 viewport. Approved composition, overlapping surfaces, embossed type, brushed textures, glass blur and colors remain recognizable. The new documentation starts below the original exhibit/caption.
- Mobile: 390 × 844 viewport. The original reference cropped some specimen edges; the extraction slightly reduces the mobile composition scale to fit the four surfaces. Checked rendered content and visible stage focus. Document scrollWidth was 375 at innerWidth 390; no horizontal page overflow was observed.
- Verified keyboard movement (X 72 → X 76), Home/reset (X 72, Y 24), violet selection and native range minimum (0%).
- Repeated three auto/manual takeover cycles; reset returned auto off, warm palette and 78% intensity.
- Edited the independent scene's input, used its native arrow key and clicked its button. Main scene coordinates stayed unchanged.
- Copied the displayed example; the clipboard contained the expected import. The final control adds an announced status and a manual-selection fallback when clipboard access fails.
- Reduced-motion emulation disabled the Auto button and displayed the manual-only explanation. Temporary media emulation was cleared afterward.
- Emulated a vertical touch swipe inside the production stage. Browser scrollY increased from 219 to 434 while `touch-action` remained `pan-y`. The light accepted initial input; the browser retained vertical scrolling. This is emulated touch, not physical-phone evidence.
- Disabled script execution and reloaded the production showcase: its documentation fallback appeared. Re-enabled scripts and reloaded: the interactive composition returned. No application console errors were reported on that final production check.

Screenshots captured from the supported browser API and saved locally:

- [Desktop production showcase](screenshots/desktop.jpg)
- [Mobile production showcase with visible keyboard focus](screenshots/mobile.jpg)
- [Original mobile reference](screenshots/reference-mobile.jpg)

## Limits and next release checks

No Firefox, Safari, iOS device, physical touch device or screen-reader QA was performed. Reduced motion and touch were emulated in Chrome. Automated tests exercise lifecycle behavior with observer stubs; offscreen intersection behavior was code-reviewed but not separately browser-forced. Static SSR was tested; the showcase itself is client-rendered and supplies a verified noscript documentation link.

No accessibility conformance, exhaustive contrast certification, broad browser support or measured performance guarantee is claimed. Forced-color and missing-backdrop-filter CSS fallbacks are implemented, with browser verification still pending. Consumer content needs its own contrast checks. Moving CSS transforms while the light is stationary require a subsequent light/resize/scroll update to refresh rectangle geometry.

No shadcn registry endpoint, npm publication, hosted showcase update or social post exists. GitHub source publication under MIT is authorized; exact remote-install and CI evidence will be recorded after publication. npm publication, hosted deployment and social posting remain separate decisions.

## Public source installation

The public commit archive at `25169a09d6d5fc72116bd3cf7c9d23ff12c1311b` was installed into a new consumer outside the repository. ESM import, SSR, all public component/hook types, exported CSS bundling and project-scoped agent installation passed. The check is reproducible with `npm run public:check -- <exact-commit-archive-url>`.

The first GitHub CI run passed typecheck, all 15 tests, the original 21 assertions, the production build and committed-artifact consistency on Node 22 and 24. Its tarball consumer step exposed an incorrect test-harness assumption: npm ci does not necessarily cache the registry metadata required for a fresh offline peer resolution. The harness now prefers cached data while allowing metadata fetches; it does not bypass peer checks. The next CI run must verify that correction before a release tag is finalized.
