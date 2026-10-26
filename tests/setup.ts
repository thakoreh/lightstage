import {afterEach,beforeEach,vi} from 'vitest';
import {cleanup} from '@testing-library/react';
export let media:MediaQueryList;
export const pendingFrames=new Map<number,FrameRequestCallback>();
let frameId=0;
export const tick=(time=100)=>{const callbacks=[...pendingFrames.values()];pendingFrames.clear();callbacks.forEach(cb=>cb(time));};
beforeEach(()=>{
  pendingFrames.clear();
  const events=new EventTarget();
  media={matches:false,media:'(prefers-reduced-motion: reduce)',onchange:null,addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events),addListener:vi.fn(),removeListener:vi.fn()} as MediaQueryList;
  vi.stubGlobal('matchMedia',vi.fn(()=>media));
  vi.stubGlobal('PointerEvent',class extends MouseEvent {
    pointerType:string;
    constructor(type:string,init:PointerEventInit={}){super(type,init);this.pointerType=init.pointerType??'mouse';}
  });
  vi.stubGlobal('requestAnimationFrame',vi.fn((cb:FrameRequestCallback)=>{pendingFrames.set(++frameId,cb);return frameId;}));
  vi.stubGlobal('cancelAnimationFrame',vi.fn((id:number)=>pendingFrames.delete(id)));
  vi.stubGlobal('ResizeObserver',class {observe(){}unobserve(){}disconnect(){}});
  vi.stubGlobal('IntersectionObserver',class {observe(){}disconnect(){}});
  vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockReturnValue({left:0,top:0,width:800,height:500,right:800,bottom:500,x:0,y:0,toJSON(){}});
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
