export const palettes = {
    warm: '255,226,181', cool: '173,217,255', violet: '215,179,255',
};
export const clamp = (value, min, max, fallback) => Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
/** A scene-local store. Importing this module never touches browser globals. */
export function createLightStore(defaults = {}) {
    const initial = {
        x: clamp(defaults.x ?? .72, .03, .97, .72), y: clamp(defaults.y ?? .24, .03, .97, .24),
        intensity: clamp(defaults.intensity ?? .78, 0, 1, .78),
        palette: defaults.palette && Object.hasOwn(palettes, defaults.palette) ? defaults.palette : 'warm',
        auto: false, reducedMotion: false,
    };
    let state = initial;
    const listeners = new Set();
    function update(patch, notifyUnchanged = false) {
        const next = { ...state, ...patch };
        if (Object.keys(next).every(key => next[key] === state[key])) {
            if (notifyUnchanged)
                listeners.forEach(listener => listener());
            return;
        }
        state = next;
        listeners.forEach(listener => listener());
    }
    return {
        getSnapshot: () => state,
        getServerSnapshot: () => initial,
        subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
        setPosition(x, y) { update({ x: clamp(x, .03, .97, state.x), y: clamp(y, .03, .97, state.y), auto: false }, true); },
        moveAuto(x, y) { update({ x, y }); },
        setIntensity(intensity) { update({ intensity: clamp(intensity, 0, 1, state.intensity) }); },
        setPalette(palette) { if (Object.hasOwn(palettes, palette))
            update({ palette }); },
        setAuto(auto) { update({ auto: auto && !state.reducedMotion }); },
        setReducedMotion(reducedMotion) { update({ reducedMotion, ...(reducedMotion ? { auto: false } : {}) }); },
        // Reset is an input command even if values are unchanged: subscribers discard queued input.
        reset() { update({ ...initial, reducedMotion: state.reducedMotion }, true); },
    };
}
