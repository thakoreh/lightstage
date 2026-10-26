import { type HTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { type LightDefaults } from './state.js';
export { palettes } from './state.js';
export type { Palette, LightPosition, LightState, LightDefaults } from './state.js';
/** Subscribe only where values are displayed (for example a control panel). */
export declare function useLightStage(): {
    setPosition: (x: number, y: number) => void;
    setIntensity: (intensity: number) => void;
    setPalette: (palette: import("./state.js").Palette) => void;
    setAuto: (auto: boolean) => void;
    reset: () => void;
    intensity: number;
    palette: import("./state.js").Palette;
    auto: boolean;
    reducedMotion: boolean;
    x: number;
    y: number;
};
export interface LightStageProps extends HTMLAttributes<HTMLDivElement> {
    /** Read once per mount. x/y are normalized; intensity is 0–1. Auto is opt-in through the hook. */
    defaults?: LightDefaults;
    /** Disable scene pointer and keyboard input; external controls still work. */
    interactive?: boolean;
    /** Optional controls share this scene's context but render after its DOM root. */
    controls?: ReactNode;
}
/** A scoped provider and real DOM scene. No global CSS variables or event handlers. */
export declare const LightStage: import("react").ForwardRefExoticComponent<LightStageProps & import("react").RefAttributes<HTMLDivElement>>;
export type MaterialKind = 'metal' | 'glass' | 'paper';
export interface MaterialProps extends HTMLAttributes<HTMLDivElement> {
    kind: MaterialKind;
}
/** A neutral div. Geometry, layout, and children belong to the consumer. */
export declare const Material: import("react").ForwardRefExoticComponent<MaterialProps & import("react").RefAttributes<HTMLDivElement>>;
export interface MetalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}
/** A native button with the approved chrome treatment; all normal button props pass through. */
export declare const MetalButton: import("react").ForwardRefExoticComponent<MetalButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
