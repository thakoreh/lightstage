export declare const palettes: {
    readonly warm: "255,226,181";
    readonly cool: "173,217,255";
    readonly violet: "215,179,255";
};
export type Palette = keyof typeof palettes;
export interface LightPosition {
    x: number;
    y: number;
}
export interface LightState extends LightPosition {
    intensity: number;
    palette: Palette;
    auto: boolean;
    reducedMotion: boolean;
}
export type LightDefaults = Partial<Pick<LightState, 'x' | 'y' | 'intensity' | 'palette'>>;
export declare const clamp: (value: number, min: number, max: number, fallback: number) => number;
/** A scene-local store. Importing this module never touches browser globals. */
export declare function createLightStore(defaults?: LightDefaults): {
    getSnapshot: () => LightState;
    getServerSnapshot: () => LightState;
    subscribe(listener: () => void): () => void;
    setPosition(x: number, y: number): void;
    moveAuto(x: number, y: number): void;
    setIntensity(intensity: number): void;
    setPalette(palette: Palette): void;
    setAuto(auto: boolean): void;
    setReducedMotion(reducedMotion: boolean): void;
    reset(): void;
};
export type LightStore = ReturnType<typeof createLightStore>;
