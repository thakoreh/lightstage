import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LightStage,Material,MetalButton,useLightStage,palettes,type Palette} from '../src/index';
import '../src/style.css';
import './style.css';
import './docs.css';

const snippet=`import { LightStage, Material, MetalButton } from '@lightstage/react';
import '@lightstage/react/style.css';

export function Card() {
  return (
    <LightStage style={{ padding: 32 }}>
      <Material kind="paper"><h2>Your real content.</h2></Material>
      <MetalButton onClick={() => alert('Hello')}>Try it</MetalButton>
    </LightStage>
  );
}`;

function Coordinates(){const {x,y,auto}=useLightStage();return <div className="stage-bottom"><span><i/> {auto?'AUTO LIGHT · MOVE TO TAKE OVER':'POINTER · ARROWS · DRAG SIDEWAYS'}</span><span>X {Math.round(x*100)} · Y {Math.round(y*100)}</span></div>;}
function Controls(){
  const {palette,intensity,auto,reducedMotion,setPalette,setIntensity,setAuto,reset}=useLightStage();
  return <div className="controls"><div className="palette" role="group" aria-label="Light colour">
    {(Object.keys(palettes) as Palette[]).map(name=><button key={name} className={`swatch ${palette===name?'active':''}`} aria-label={`${name[0].toUpperCase()+name.slice(1)} light`} aria-pressed={palette===name} style={{'--swatch':`rgb(${palettes[name]})`} as React.CSSProperties} onClick={()=>setPalette(name)}/>)}<span id="colorName">{palette[0].toUpperCase()+palette.slice(1)}</span></div>
    <label className="intensity">Intensity <input aria-label="Intensity" type="range" min="0" max="100" value={Math.round(intensity*100)} onChange={event=>setIntensity(Number(event.target.value)/100)}/><output>{Math.round(intensity*100)}%</output></label>
    <div className="actions"><button aria-pressed={auto} disabled={reducedMotion} title={reducedMotion?'Automatic motion follows your reduced motion preference':undefined} onClick={()=>setAuto(!auto)}>Auto light <span>↻</span></button><button aria-label="Reset light and controls" onClick={reset}>Reset ↗</button></div>
    {reducedMotion&&<span className="motion-note">Reduced motion: manual light only</span>}
  </div>;
}
function SurfaceButton(){
  const [pressed,setPressed]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  return <><MetalButton className="chrome" onClick={()=>{if(timer.current)clearTimeout(timer.current);setPressed(true);timer.current=setTimeout(()=>setPressed(false),1600);}}><span className="button-dot"/><span>{pressed?'Still a real button':'Feel the surface'}</span><span>↗</span></MetalButton><span className="sr-only" role="status">{pressed?'Button pressed. Your content stays interactive.':''}</span></>;
}
function Composition(){return <><div className="stage-grid" aria-hidden="true"/><div className="beam" aria-hidden="true"/><div className="orbit orbit-a" aria-hidden="true"/><div className="orbit orbit-b" aria-hidden="true"/><div className="light-dot" aria-hidden="true"><i/></div><div className="composition">
  <Material kind="metal" className="plate"><div className="plate-top"><span>LIGHTSTAGE</span><span>01 / 04</span></div><div className="emboss" aria-label="LS">LS<span>✳</span></div><div className="engraved">MADE TO FEEL.</div><div className="plate-bottom"><span>BRUSHED ALUMINUM</span><span>↗</span></div></Material>
  <Material kind="paper" className="paper"><div className="paper-meta">MATERIAL ARCHIVE <span>02</span></div><h2>Not flat.<br/>Not quite<br/>physical.</h2><div className="paper-rule"/><p>A study in texture,<br/>light & perception.</p><div className="paper-footer"><span>UNCOATED STOCK</span><span>✳</span></div></Material>
  <Material kind="glass" className="glass"><div className="glass-head"><span className="status-dot"/><span>TRANSMISSION</span><span>03</span></div><div className="glass-symbol" aria-hidden="true">✳</div><div className="glass-bottom"><div><span className="tiny">SHARED ENVIRONMENT</span><h3>Let it through.</h3></div><span className="glass-arrow" aria-hidden="true">↗</span></div></Material>
  <SurfaceButton/><div className="specimen-note">FOUR SURFACES.<br/>ONE SHARED LIGHT.</div>
</div><Coordinates/></>;}

function Playground(){return <LightStage className="stage" controls={<Controls/>} aria-label="LightStage playground. Focus here; arrows move light and Home resets it."><Composition/></LightStage>;}
function IndependentExample(){const [clicked,setClicked]=useState(false);return <LightStage className="small-scene" defaults={{palette:'cool',x:.25,y:.3}} aria-label="Independent example. Arrow keys move its light."><Material kind="paper"><span className="code-label">INDEPENDENT SCENE</span><h3>Your content belongs here.</h3><p>A second scene has its own light and controls.</p><a href="#api">Read the API ↗</a></Material><Material kind="glass"><label htmlFor="note">Editable content</label><input id="note" placeholder="Try typing here"/><MetalButton onClick={()=>setClicked(true)}>{clicked?'Clicked':'A real button'}</MetalButton></Material></LightStage>;}
function Docs(){const [copyStatus,setCopyStatus]=useState('');return <section className="docs" id="get-started"><div className="eyebrow">SMALL PRIMITIVES. YOUR COMPOSITION.</div><h2>A shared light, in your React tree.</h2><div className="docs-grid"><div><p>Metal, glass and paper are real DOM surfaces. Bring your text, links and controls. Set the geometry in your own CSS.</p><p>Install the GitHub source archive in your React app. The package is not published to npm.</p><pre><code>npm install https://github.com/thakoreh/lightstage/archive/refs/tags/v0.1.2.tar.gz</code></pre><a href="https://github.com/thakoreh/lightstage#readme">Source & documentation ↗</a></div><div><button className="copy" onClick={async()=>{try{await navigator.clipboard.writeText(snippet);setCopyStatus('Copied');}catch{setCopyStatus('Select the code below to copy it.');}}}>Copy example</button><span className="copy-status" role="status">{copyStatus}</span><pre tabIndex={0}><code>{snippet}</code></pre></div></div>
<div id="api" className="api"><h3>Four exports. One small model.</h3><dl><div><dt>LightStage</dt><dd>The scoped scene, input handling and provider. Set initial position, palette and intensity through defaults.</dd></div><div><dt>Material</dt><dd>Choose metal, glass or paper. Children and geometry stay yours.</dd></div><div><dt>MetalButton</dt><dd>A native button with the chrome treatment. Supports refs, disabled state and ordinary events.</dd></div><div><dt>useLightStage</dt><dd>Read state and control position, intensity, palette, automatic motion or reset.</dd></div></dl></div><IndependentExample/><p className="limitations">Stylized gradients, textures and shadows. No ray tracing or physical refraction. Glass uses backdrop blur with an opaque fallback. Automatic motion is opt-in and respects reduced motion.</p></section>;}
function App(){return <><header><a className="brand" href="#"><span className="brand-icon">✳</span> LightStage<span className="version">STUDY 001</span></a><nav><a href="#get-started">Get started ↗</a></nav></header><main><section className="intro"><div className="eyebrow">A LITTLE LIGHT CHANGES EVERYTHING</div><h1>Interfaces.<br/><em>In a different light.</em></h1><p>One light. Four materials. Move across the stage<br className="desktop"/> and watch the whole composition respond.</p></section><section className="exhibit" aria-label="Interactive light stage"><Playground/></section><section className="caption"><div><span className="index">01</span><h2>The effect is shared.<br/>The content stays real.</h2></div><p>Text, a button, a paper label and a translucent panel respond to the same light position. A visual experiment in giving ordinary UI a little more presence.</p></section><Docs/><footer><span>LIGHTSTAGE / REACT MATERIAL STUDY</span><span>Stylized lighting · React + CSS · MIT</span></footer></main></>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
