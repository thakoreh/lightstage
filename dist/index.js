'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useSyncExternalStore } from 'react';
import { clamp, createLightStore, palettes } from './state.js';
export { palettes } from './state.js';
const Context = createContext(null);
function useScene() {
    const scene = useContext(Context);
    if (!scene)
        throw new Error('LightStage materials and useLightStage must be inside <LightStage>.');
    return scene;
}
/** Subscribe only where values are displayed (for example a control panel). */
export function useLightStage() {
    const { store } = useScene();
    const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
    return { ...state, setPosition: store.setPosition, setIntensity: store.setIntensity, setPalette: store.setPalette, setAuto: store.setAuto, reset: store.reset };
}
/** A scoped provider and real DOM scene. No global CSS variables or event handlers. */
export const LightStage = forwardRef(function LightStage({ defaults, interactive = true, controls, children, className = '', onPointerMove, onPointerDown, onPointerCancel, onKeyDown, style, ...props }, ref) {
    const root = useRef(null);
    useImperativeHandle(ref, () => root.current, []);
    const scene = useRef(null);
    const materials = useRef(new Set());
    const materialObserver = useRef(null);
    const invalidate = useRef(() => { });
    const pendingPointer = useRef(null);
    if (!scene.current)
        scene.current = { store: createLightStore(defaults), register(element) {
                materials.current.add(element);
                materialObserver.current?.observe(element);
                invalidate.current();
                return () => { materials.current.delete(element); materialObserver.current?.unobserve(element); invalidate.current(); };
            } };
    const { store } = scene.current;
    useEffect(() => {
        const element = root.current;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0, alive = true, visible = true, painting = false, elapsed = 0, last = 0;
        const paint = () => {
            const state = store.getSnapshot(), rect = element.getBoundingClientRect();
            element.style.setProperty('--ls-x', `${state.x * 100}%`);
            element.style.setProperty('--ls-y', `${state.y * 100}%`);
            element.style.setProperty('--ls-power', String(state.intensity));
            element.style.setProperty('--ls-light', palettes[state.palette]);
            if (!rect.width || !rect.height)
                return;
            const lx = rect.left + state.x * rect.width, ly = rect.top + state.y * rect.height;
            // Read every rectangle before writing material styles to avoid layout thrashing.
            const boxes = [...materials.current].map(material => ({ material, box: material.getBoundingClientRect() }));
            for (const { material, box } of boxes) {
                if (!box.width || !box.height)
                    continue;
                const dx = clamp((lx - (box.left + box.width / 2)) / rect.width, -1, 1, 0);
                const dy = clamp((ly - (box.top + box.height / 2)) / rect.height, -1, 1, 0);
                material.style.setProperty('--ls-mx', `${clamp((lx - box.left) / box.width * 100, -100, 200, 65)}%`);
                material.style.setProperty('--ls-my', `${clamp((ly - box.top) / box.height * 100, -100, 200, 20)}%`);
                material.style.setProperty('--ls-sx', `${-dx * 25}px`);
                material.style.setProperty('--ls-sy', `${-dy * 25 + 7}px`);
            }
        };
        function schedule() { if (alive && !frame && !painting)
            frame = requestAnimationFrame(tick); }
        function tick(time) {
            frame = 0;
            painting = true;
            if (pendingPointer.current) {
                const p = pendingPointer.current;
                pendingPointer.current = null;
                store.setPosition(p.x, p.y);
            }
            const state = store.getSnapshot();
            const running = state.auto && !state.reducedMotion && !document.hidden && visible;
            if (running) {
                if (last)
                    elapsed += Math.min(time - last, 64);
                last = time;
                const d = elapsed / 2300;
                store.moveAuto(.5 + Math.cos(d) * .35, .47 + Math.sin(d * .8) * .3);
            }
            else
                last = 0;
            paint();
            painting = false;
            if (running)
                schedule();
        }
        invalidate.current = schedule;
        const unsubscribe = store.subscribe(() => { pendingPointer.current = null; schedule(); });
        const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
        materialObserver.current = resize;
        resize?.observe(element);
        materials.current.forEach(material => resize?.observe(material));
        const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; last = 0; schedule(); }) : null;
        observer?.observe(element);
        const motion = () => { store.setReducedMotion(media.matches); schedule(); };
        const visibility = () => { last = 0; schedule(); };
        media.addEventListener('change', motion);
        document.addEventListener('visibilitychange', visibility);
        window.addEventListener('resize', schedule);
        window.addEventListener('scroll', schedule, { passive: true, capture: true });
        motion();
        schedule();
        return () => {
            alive = false;
            cancelAnimationFrame(frame);
            pendingPointer.current = null;
            invalidate.current = () => { };
            unsubscribe();
            resize?.disconnect();
            materialObserver.current = null;
            observer?.disconnect();
            media.removeEventListener('change', motion);
            document.removeEventListener('visibilitychange', visibility);
            window.removeEventListener('resize', schedule);
            window.removeEventListener('scroll', schedule, true);
        };
    }, [store]);
    const ownsEvent = (target) => target instanceof Element && target.closest('[data-lightstage]') === root.current;
    const pointer = (event) => {
        if (!interactive || event.defaultPrevented || !ownsEvent(event.target) || event.target instanceof Element && event.target.closest('button,input,select,textarea,a,[contenteditable=""],[contenteditable="true" i],[contenteditable="plaintext-only" i]'))
            return;
        if (event.pointerType === 'touch' && event.buttons === 0)
            return;
        const rect = root.current.getBoundingClientRect();
        if (!rect.width || !rect.height)
            return;
        store.setAuto(false);
        pendingPointer.current = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
        invalidate.current();
    };
    const initial = store.getServerSnapshot();
    return _jsxs(Context.Provider, { value: scene.current, children: [_jsx("div", { ...props, ref: root, "data-lightstage": "", className: `ls-stage ${className}`, tabIndex: props.tabIndex ?? (interactive ? 0 : undefined), role: props.role ?? 'group', "aria-label": props['aria-label'] ?? 'Light stage. Arrow keys move the light; Home resets. Drag sideways on touch.', style: { '--ls-x': `${initial.x * 100}%`, '--ls-y': `${initial.y * 100}%`, '--ls-power': initial.intensity, '--ls-light': palettes[initial.palette], ...style }, onPointerMove: event => { onPointerMove?.(event); pointer(event); }, onPointerDown: event => { onPointerDown?.(event); pointer(event); }, onPointerCancel: event => { onPointerCancel?.(event); pendingPointer.current = null; }, onKeyDown: event => {
                    onKeyDown?.(event);
                    if (!interactive || event.defaultPrevented || event.target !== event.currentTarget)
                        return;
                    pendingPointer.current = null;
                    const moves = { ArrowLeft: [-.04, 0], ArrowRight: [.04, 0], ArrowUp: [0, -.04], ArrowDown: [0, .04] };
                    if (moves[event.key]) {
                        event.preventDefault();
                        const s = store.getSnapshot();
                        store.setPosition(s.x + moves[event.key][0], s.y + moves[event.key][1]);
                    }
                    else if (event.key === 'Home') {
                        event.preventDefault();
                        store.reset();
                    }
                }, children: children }), controls] });
});
/** A neutral div. Geometry, layout, and children belong to the consumer. */
export const Material = forwardRef(function Material({ kind, className = '', ...props }, ref) {
    const { register } = useScene();
    const local = useRef(null);
    useImperativeHandle(ref, () => local.current, []);
    useEffect(() => register(local.current), [register]);
    return _jsx("div", { ...props, ref: local, className: `ls-material ls-${kind} ${className}` });
});
/** A native button with the approved chrome treatment; all normal button props pass through. */
export const MetalButton = forwardRef(function MetalButton({ className = '', type = 'button', ...props }, ref) {
    const { register } = useScene();
    const local = useRef(null);
    useImperativeHandle(ref, () => local.current, []);
    useEffect(() => register(local.current), [register]);
    return _jsx("button", { ...props, type: type, ref: local, className: `ls-material ls-chrome ${className}` });
});
