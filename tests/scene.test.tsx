import React,{StrictMode,createRef} from 'react';
import {act,fireEvent,render,screen} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {describe,it,expect,vi} from 'vitest';
import {LightStage,Material,MetalButton,useLightStage} from '../src/index';
import {media,pendingFrames,tick} from './setup';
function Panel(){const s=useLightStage();return <><output data-testid="state">{JSON.stringify({x:s.x,y:s.y,auto:s.auto,reduced:s.reducedMotion,palette:s.palette})}</output><button onClick={()=>s.setAuto(!s.auto)}>Auto</button><button onClick={s.reset}>Reset</button><button onClick={()=>s.setPalette('cool')}>Cool</button></>;}
const state=()=>JSON.parse(screen.getByTestId('state').textContent!);
describe('React scene lifecycle and input',()=>{
  it('retains semantic children, DOM refs, native props and disabled buttons',()=>{
    const ref=createRef<HTMLButtonElement>();const clicked=vi.fn();
    render(<LightStage><Material kind="paper"><a href="#test">A real link</a></Material><MetalButton ref={ref} disabled onClick={clicked}>Save</MetalButton></LightStage>);
    expect(ref.current?.tagName).toBe('BUTTON');expect(ref.current?.type).toBe('button');
    fireEvent.click(screen.getByRole('button'));expect(clicked).not.toHaveBeenCalled();expect(screen.getByRole('link').getAttribute('href')).toBe('#test');
  });
  it('only moves from the focused root and preserves child input keys',()=>{
    render(<LightStage controls={<Panel/>}><input aria-label="Text"/><MetalButton>Click</MetalButton></LightStage>);
    fireEvent.keyDown(screen.getByRole('textbox'),{key:'ArrowRight'});expect(state().x).toBe(.72);
    fireEvent.keyDown(screen.getByRole('group'),{key:'ArrowRight'});expect(state().x).toBe(.76);
    fireEvent.keyDown(screen.getByRole('group'),{key:'Home'});expect(state().x).toBe(.72);
  });
  it('coalesces pointer movement and cancels queued movement when reset interrupts it',()=>{
    render(<LightStage controls={<Panel/>}><Material kind="metal">Metal</Material></LightStage>);act(()=>tick());
    const root=screen.getByRole('group');
    for(let i=0;i<20;i++) fireEvent.pointerMove(root,{clientX:i*10,clientY:250,pointerType:'mouse'});
    expect(pendingFrames.size).toBe(1);expect(state().x).toBe(.72);
    act(()=>tick());expect(state()).toMatchObject({x:190/800,y:.5});
    fireEvent.pointerMove(root,{clientX:600,clientY:250,pointerType:'mouse'});
    fireEvent.click(screen.getByText('Cool'));fireEvent.click(screen.getByText('Reset'));act(()=>tick());expect(state().x).toBe(.72);
  });
  it('cancels a queued pointer update when reset is pressed at unchanged defaults',()=>{
    render(<LightStage controls={<Panel/>}/>);act(()=>tick());
    fireEvent.pointerMove(screen.getByRole('group'),{clientX:400,clientY:250,pointerType:'mouse'});
    fireEvent.click(screen.getByText('Reset'));act(()=>tick());
    expect(state()).toMatchObject({x:.72,y:.24});
  });
  it('honors cleanup-returning React 19 callback refs on every native wrapper',()=>{
    const cleanups=[vi.fn(),vi.fn(),vi.fn()];
    const rootRef=vi.fn((node:HTMLDivElement|null)=>node?cleanups[0]:undefined);
    const materialRef=vi.fn((node:HTMLDivElement|null)=>node?cleanups[1]:undefined);
    const buttonRef=vi.fn((node:HTMLButtonElement|null)=>node?cleanups[2]:undefined);
    const result=render(<LightStage ref={rootRef}><Material ref={materialRef} kind="paper">Paper</Material><MetalButton ref={buttonRef}>Save</MetalButton></LightStage>);
    result.unmount();
    cleanups.forEach(cleanup=>expect(cleanup).toHaveBeenCalledTimes(1));
    [rootRef,materialRef,buttonRef].forEach(ref=>expect(ref).toHaveBeenCalledTimes(1));
  });
  it('cancels touch movement on interruption and never prevents native scrolling',()=>{
    render(<LightStage controls={<Panel/>}/>);act(()=>tick());const root=screen.getByRole('group');
    const event=new Event('pointermove',{bubbles:true,cancelable:true});Object.assign(event,{clientX:300,clientY:100,pointerType:'touch',buttons:1});
    fireEvent(root,event);expect(event.defaultPrevented).toBe(false);fireEvent.pointerCancel(root);act(()=>tick());expect(state().x).toBe(.72);
  });
  it('ignores nested scene events and interactive descendants',()=>{
    render(<LightStage data-testid="outer"><MetalButton>Button</MetalButton><LightStage data-testid="inner"/><Panel/></LightStage>);
    fireEvent.pointerMove(screen.getByTestId('inner'),{clientX:10,clientY:10});fireEvent.pointerMove(screen.getByText('Button'),{clientX:10,clientY:10});act(()=>tick());expect(state().x).toBe(.72);
  });
  it('preserves pointer input in empty and plaintext-only contenteditable regions',()=>{
    render(<LightStage controls={<Panel/>}><div ref={node=>node?.setAttribute('contenteditable','')}><span>Editable note</span></div><div contentEditable="plaintext-only" suppressContentEditableWarning>Plain note</div></LightStage>);
    act(()=>tick());fireEvent.click(screen.getByText('Auto'));act(()=>tick());
    const before=state();
    fireEvent.pointerDown(screen.getByText('Editable note'),{clientX:10,clientY:10});
    fireEvent.pointerMove(screen.getByText('Plain note'),{clientX:20,clientY:20});
    act(()=>tick());
    expect(state().auto).toBe(true);
    expect(state().x).toBeCloseTo(before.x);
  });
  it('keeps sibling scene providers independent through pointer and keyboard changes',()=>{
    function Readout({id}:{id:string}){const s=useLightStage();return <output data-testid={id}>{s.x}</output>;}
    render(<><LightStage data-testid="first"><Readout id="a"/></LightStage><LightStage data-testid="second" defaults={{x:.2}}><Readout id="b"/></LightStage></>);
    act(()=>tick());fireEvent.pointerMove(screen.getByTestId('first'),{clientX:400,clientY:250});act(()=>tick());
    expect(screen.getByTestId('a').textContent).toBe('0.5');expect(screen.getByTestId('b').textContent).toBe('0.2');
    fireEvent.keyDown(screen.getByTestId('second'),{key:'ArrowRight'});
    expect(Number(screen.getByTestId('b').textContent)).toBeCloseTo(.24);expect(screen.getByTestId('a').textContent).toBe('0.5');
  });
  it('stops auto when reduced motion changes and removes frames/listeners on StrictMode unmount',()=>{
    const remove=vi.spyOn(media,'removeEventListener');
    const result=render(<StrictMode><LightStage controls={<Panel/>}/></StrictMode>);act(()=>tick());
    fireEvent.click(screen.getByText('Auto'));act(()=>tick());expect(state().auto).toBe(true);expect(pendingFrames.size).toBe(1);
    act(()=>{Object.defineProperty(media,'matches',{value:true,configurable:true});media.dispatchEvent(new Event('change'));tick();});
    expect(state()).toMatchObject({auto:false,reduced:true});expect(pendingFrames.size).toBe(0);
    result.unmount();expect(remove).toHaveBeenCalled();expect(pendingFrames.size).toBe(0);
  });
  it('pauses while hidden, resumes without a large time jump and supports repeated manual takeover',()=>{
    render(<LightStage controls={<Panel/>}/>);act(()=>tick());fireEvent.click(screen.getByText('Auto'));act(()=>tick(100));
    act(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));tick(200);});expect(pendingFrames.size).toBe(0);
    act(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));tick(100000);});expect(state().auto).toBe(true);
    for(let i=0;i<3;i++){fireEvent.keyDown(screen.getByRole('group'),{key:'ArrowLeft'});expect(state().auto).toBe(false);fireEvent.click(screen.getByText('Auto'));act(()=>tick(100100+i*100));}
  });
  it('renders deterministic useful markup on the server',()=>{
    const html=renderToString(<LightStage defaults={{palette:'cool'}}><Material kind="paper"><h2>Readable content</h2></Material></LightStage>);
    expect(html).toContain('Readable content');expect(html).toContain('--ls-light:173,217,255');
  });
  it('hydrates server markup without a mismatch and remains interactive',async()=>{
    const app=<LightStage><Material kind="paper">Hydrated content</Material><Panel/></LightStage>;
    const container=document.createElement('div');container.innerHTML=renderToString(app);document.body.append(container);
    const errors:unknown[]=[];let root:ReturnType<typeof hydrateRoot>;
    await act(async()=>{root=hydrateRoot(container,app,{onRecoverableError:error=>errors.push(error)});});
    fireEvent.keyDown(container.querySelector('[data-lightstage]')!,{key:'ArrowRight'});
    expect(state().x).toBe(.76);expect(errors).toEqual([]);
    act(()=>root!.unmount());container.remove();
  });
});
