export const palettes = {
  warm: '255,226,181', cool: '173,217,255', violet: '215,179,255',
} as const;
export type Palette = keyof typeof palettes;
export interface LightPosition { x: number; y: number }
export interface LightState extends LightPosition {
  intensity: number; palette: Palette; auto: boolean; reducedMotion: boolean;
}
export type LightDefaults = Partial<Pick<LightState, 'x' | 'y' | 'intensity' | 'palette'>>;
export const clamp = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

/** A scene-local store. Importing this module never touches browser globals. */
export function createLightStore(defaults: LightDefaults = {}) {
  const initial: LightState = {
    x: clamp(defaults.x ?? .72, .03, .97, .72), y: clamp(defaults.y ?? .24, .03, .97, .24),
    intensity: clamp(defaults.intensity ?? .78, 0, 1, .78),
    palette: defaults.palette && Object.hasOwn(palettes,defaults.palette) ? defaults.palette : 'warm',
    auto: false, reducedMotion: false,
  };
  let state = initial;
  const listeners = new Set<() => void>();
  function update(patch: Partial<LightState>, notifyUnchanged = false) {
    const next = {...state, ...patch};
    if (Object.keys(next).every(key => next[key as keyof LightState] === state[key as keyof LightState])) {
      if (notifyUnchanged) listeners.forEach(listener => listener());
      return;
    }
    state = next; listeners.forEach(listener => listener());
  }
  return {
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    subscribe(listener: () => void) { listeners.add(listener); return () => {listeners.delete(listener);}; },
    setPosition(x: number, y: number) { update({x: clamp(x,.03,.97,state.x), y: clamp(y,.03,.97,state.y),auto:false},true); },
    moveAuto(x: number, y: number) { update({x,y}); },
    setIntensity(intensity: number) {update({intensity:clamp(intensity,0,1,state.intensity)});},
    setPalette(palette: Palette) {if (Object.hasOwn(palettes,palette)) update({palette});},
    setAuto(auto: boolean) {update({auto:auto && !state.reducedMotion});},
    setReducedMotion(reducedMotion: boolean) {update({reducedMotion,...(reducedMotion ? {auto:false} : {})});},
    // Reset is an input command even if values are unchanged: subscribers discard queued input.
    reset() {update({...initial,reducedMotion:state.reducedMotion},true);},
  };
}
export type LightStore = ReturnType<typeof createLightStore>;
