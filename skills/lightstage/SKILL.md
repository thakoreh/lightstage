---
name: lightstage
description: Integrate or adapt LightStage shared CSS lighting in a React 19 app. Use when the user requests LightStage scenes, metal/glass/paper materials, or its native metal button.
---

# LightStage integration

Inspect the app's React version, framework client boundaries and CSS reset. Read the installed package's `node_modules/@lightstage/react/README.md`, or the repository README when editing a source copy, for the current API and styling tokens.

For a React 19 consumer, the public source archive installs as `@lightstage/react`:

```sh
npm install https://github.com/thakoreh/lightstage/archive/refs/tags/v0.1.0.tar.gz
```

```tsx
import { LightStage, Material } from '@lightstage/react';
import '@lightstage/react/style.css';

<LightStage style={{ padding: 32 }}>
  <Material kind="paper"><h2>Real content</h2></Material>
</LightStage>
```

Use an exact commit archive when the consumer needs the precise reviewed source revision. There is no published npm registry package or hosted shadcn endpoint.

Import the stylesheet once and wrap each independently lit composition in `LightStage`. Put application geometry and content in the consumer's CSS and JSX. `Material` supplies metal, glass or paper surfaces; `MetalButton` preserves native button semantics. Keep links, headings and editable content as real DOM children.

Put `useLightStage` in small controls or readouts. Its setters change the nearest scene. `defaults` initialize a scene once; use the hook for later changes, or change the scene's key to reinitialize it. Use the `controls` slot when controls should share context while sitting outside the measured scene rectangle.

Start automatic motion off. Disable an auto toggle while `reducedMotion` is true. Keep a visible stage focus indicator, native descendant key handling, vertical touch scrolling and pinch zoom. Check text contrast against each chosen surface, especially glass backgrounds and intensity extremes.

Verify the consumer's typecheck and production build after integration. Inspect desktop and mobile; move the light, reset repeatedly, type in child inputs, click native actions and test automatic/manual takeover. Preserve any existing unrelated app behavior.

These effects are stylized CSS gradients, textures, shadows and backdrop blur. Describe them accurately; there is no physical refraction or ray tracing. Review the README's browser and transform-tracking limitations when deciding where to use the effect.
