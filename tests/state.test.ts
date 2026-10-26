import {describe,it,expect} from 'vitest';
import {createLightStore} from '../src/state';
describe('scene state',()=>{
  it('clamps public numbers and handles invalid values without NaN CSS',()=>{
    const s=createLightStore({x:Infinity,y:-5,intensity:NaN});
    expect(s.getSnapshot()).toMatchObject({x:.72,y:.03,intensity:.78,auto:false});
    s.setPosition(200,NaN);s.setIntensity(-2);
    expect(s.getSnapshot()).toMatchObject({x:.97,y:.03,intensity:0});
  });
  it('resets to instance defaults, preserves reduced motion and never restarts auto',()=>{
    const s=createLightStore({palette:'violet',x:.3});s.setAuto(true);s.setReducedMotion(true);s.setAuto(true);
    expect(s.getSnapshot().auto).toBe(false);s.setPosition(.9,.9);s.reset();
    expect(s.getSnapshot()).toMatchObject({x:.3,palette:'violet',reducedMotion:true,auto:false});
  });
  it('isolates scenes and stops delivering after unsubscribe',()=>{
    const a=createLightStore(),b=createLightStore();let calls=0;
    const off=a.subscribe(()=>calls++);a.setPalette('cool');off();a.setIntensity(.4);
    expect(calls).toBe(1);expect(b.getSnapshot().palette).toBe('warm');
  });
});
