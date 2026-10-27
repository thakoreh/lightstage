# Release status and launch draft

The owner approved the public `thakoreh/lightstage` repository and MIT license. npm publication, hosted showcase deployment and social posting remain separate decisions.

The distribution is a small React 19 library: a scoped scene, metal/glass/paper materials, a native chrome button, a runnable showcase, source-copy instructions, a GitHub archive installation path and a project-scoped coding-agent skill. Committed dist/ supports source-archive installation without building the library in each consumer. CI checks that it matches source.

## Version 0.1.2

This patch includes the editable-content interaction fix from PR #1. The package metadata, lockfile, README, showcase install command and bundled skill use `0.1.2`; [CHANGELOG.md](../CHANGELOG.md) records the change. Distribution is the immutable `v0.1.2` GitHub tag archive, with GitHub release notes. npm publication and hosted deployment remain separate.

Before creating the tag, pass the normal pull-request checks, merge without bypass, and wait for both main CI jobs and the exact main archive consumer check. Create the tag at that tested merge SHA without moving existing tags. After tagging, rerun `npm run public:check -- https://github.com/thakoreh/lightstage/archive/refs/tags/v0.1.2.tar.gz` with a newly created empty npm cache. Confirm the public tag SHA, package version and release metadata. The public check exercises the installed editor regression, SSR, types, CSS and coding-agent skill. Never report a published tag or release until the remote metadata confirms it.

## Before announcing broadly

- Confirm the public install/use test and both CI matrix jobs pass for the exact remote commit. Record their evidence in VERIFICATION.md.
- Review Safari/Firefox, physical touch/pinch zoom, screen readers and intended-content contrast. Current browser evidence is Chrome desktop plus mobile emulation.
- Review whether a hosted demo should be public. The original approved concept's sharing settings remain unchanged.
- Review actual launch copy and destinations. The npm package name is not reserved or published. A hosted shadcn registry is optional future distribution work.

## Launch draft - not posted

One light. Metal, glass, paper.

I built LightStage to make real React UI feel a little less flat.

Shared highlights and shadows. Real buttons and inputs. Keyboard + touch.

Small API. MIT. Stylized CSS lighting.

https://github.com/thakoreh/lightstage

Where would you use it?

## Visual story

Lead with the four-surface composition, then show the short React example and independent editable scene. Desktop/mobile screenshots are checked in under docs/screenshots. A rendered launch video is not part of this release evidence.
