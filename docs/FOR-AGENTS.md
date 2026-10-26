# Integrating LightStage with Codex or another coding agent

Use this guide when adding the library to a consumer app or changing its API. Prefer Codex for coding work in this project.

1. Inspect the consumer's React version, framework client boundaries and existing CSS reset. Read the API in README.md. Install the documented GitHub archive or built tarball, or copy all three canonical source files together into a local module. Completion: the consumer resolves both the component import and CSS import; no invented hosted install URL is used. The included installer can add skills/lightstage to the consumer's .agents/skills folder.
2. Place one LightStage around each independent lighting group. Supply Material children and native MetalButton actions. Keep dimensions and application layout in the consumer. Put hook consumers in small controls/readouts; use the controls slot to keep controls outside the measured stage root. Completion: real text, links and controls retain their semantics and behavior.
3. Preserve native child keyboard behavior and touch page scrolling. Start auto off; disable its toggle when reduced motion is requested. Completion: arrow keys move only a focused stage, descendant inputs keep their keys, vertical swipes scroll, and repeated auto/manual takeover works.
4. Verify the packed artifact and relevant behavior tests after API changes. Inspect desktop and mobile against reference rendering after visual changes. Completion: record command results, dimensions, browser coverage and remaining limitations in the verification report.

For custom materials, use the scene/material output tokens in README.md and inspect the canonical skin CSS. Avoid adding canvas/WebGL or physics claims to describe these CSS treatments. Use CSS textures and system fonts unless new assets have an explicit license review.

Library defaults are initial values. Use the hook for later changes, or remount with a new key to initialize a different scene. The current public API does not have controlled value/onChange props.
