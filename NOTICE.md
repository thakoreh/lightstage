# Attribution and dependency notes

LightStage derives from Hiren's approved owned LightStage study. Its gradients, layout and specimen treatments are retained in the local reference and showcase. The registered-trademark glyph from the concept was removed; this project makes no claim of trademark registration.

LightStage is distributed under the owner-approved MIT license; see LICENSE. Copyright (c) 2026 Hiren Thakore. `private: true` prevents accidental npm publication; it does not restrict source installation or the MIT grant. The local package identifier does not reserve an npm namespace.

Runtime peer dependencies are React and React DOM (MIT, Meta Platforms, Inc. and affiliates). They are external to the library output. Development uses TypeScript (Apache-2.0), Vite and its React plugin (MIT), Vitest (MIT), Testing Library (MIT), jsdom (MIT), and their transitive dependencies. Exact versions are locked in package-lock.json. Do a complete dependency notice review before a public source or binary release; this list is not a legal opinion or a substitute for the dependencies' full license texts.

The [dependency inventory](docs/DEPENDENCIES.json) records all 197 lockfile package entries, including optional platform builds, with declared licenses, npm URLs and integrity hashes. Declared licenses are MIT, MIT-0, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0 and CC-BY-4.0. The CC-BY-4.0 entry is development-time caniuse-lite data; it is not bundled as dataset content in the library or showcase. These metadata checks establish the locked download sources, not an independent authorship or supply-chain audit.

The showcase bundles React, React DOM and scheduler. Their complete existing MIT notices are preserved in [THIRD-PARTY-NOTICES.txt](docs/THIRD-PARTY-NOTICES.txt), also served with the showcase. The library leaves React external. No obvious copyleft requirement appears in the recorded dependency metadata; preserve third-party notices when redistributing their code. These existing grants are separate from LightStage's MIT license.

No external font, icon package, photograph, texture bitmap or paid asset is bundled. Typography uses system Arial/Helvetica and Georgia/serif; textures are CSS. Simple symbols are text characters rendered by installed fonts.

dithercn is an independent project used as a distribution-pattern reference only: https://github.com/opencoredev/dithercn. No affiliation or copied code/assets.
