# Changelog

## 0.1.2 - 2026-10-27

- Preserve scene light position and automatic motion while clicking, selecting or editing inside empty and plaintext-only contenteditable regions, including their descendants.
- Update the React archive install command and bundled coding-agent skill to `v0.1.2`.
- Verify the editable-content regression against the actual installed public archive, alongside ESM import, SSR, TypeScript, CSS bundling and agent-skill installation.

Install this patch in a React 19 consumer:

```sh
npm install https://github.com/thakoreh/lightstage/archive/refs/tags/v0.1.2.tar.gz
```

The distribution remains a GitHub source archive with committed build artifacts. There is no npm registry publication or hosted showcase deployment in this release.

## 0.1.1

- Remove the optional packaging-inspiration paragraph from the README.
- Point installation examples to the corrected v0.1.1 source archive.
- Preserve the runtime implementation, MIT license and third-party notices.

## 0.1.0

Initial React library, material showcase, agent skill and tested source-archive distribution.
