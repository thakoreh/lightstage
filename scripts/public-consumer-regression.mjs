// Copied into a fresh public-archive consumer by check-public-install.mjs.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {LightStage,Material,useLightStage} from '@lightstage/react';
const {JSDOM}=createRequire(import.meta.url)(process.argv[2]);
const dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true,url:'http://localhost/'});
for(const key of ['window','document','HTMLElement','Element','Node']) globalThis[key]=key==='window'?dom.window:dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
HTMLElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:800,height:500,right:800,bottom:500});
let frameId=0;const frames=new Map();
globalThis.requestAnimationFrame=callback=>{frames.set(++frameId,callback);return frameId;};
globalThis.cancelAnimationFrame=id=>frames.delete(id);
const tick=()=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(callback=>callback(100));};
function Controls({id}){const s=useLightStage();return React.createElement(React.Fragment,null,
  React.createElement('output',{id},JSON.stringify({x:s.x,y:s.y,auto:s.auto})),
  React.createElement('button',{id:`${id}-auto`,onClick:()=>s.setAuto(true)},'Auto'),
  React.createElement('button',{id:`${id}-reset`,onClick:s.reset},'Reset'));}
const root=createRoot(document.getElementById('root'));
const state=id=>JSON.parse(document.getElementById(id).textContent);
try{
  await act(()=>root.render(React.createElement(React.Fragment,null,
    React.createElement(LightStage,{controls:React.createElement(Controls,{id:'first'})},
      React.createElement(Material,{kind:'paper'},...['','plaintext-only','TRUE'].map((value,index)=>
        React.createElement('div',{key:value,contentEditable:value,suppressContentEditableWarning:true},React.createElement('span',{id:`editor-${index}`},'Editable content'))))),
    React.createElement(LightStage,{defaults:{x:.2},controls:React.createElement(Controls,{id:'second'})}))));
  await act(tick);
  await act(()=>document.getElementById('first-auto').click());await act(tick);
  for(let index=0;index<3;index++){
    await act(()=>document.getElementById(`editor-${index}`).dispatchEvent(new window.MouseEvent('pointerdown',{bubbles:true,clientX:10,clientY:10})));
    await act(tick);
    assert.equal(state('first').auto,true,'Editing stopped automatic motion');
    assert.equal(state('first').x,.85,'Editing moved the light');
    assert.equal(state('second').x,.2,'Editing changed the sibling scene');
  }
  for(let index=0;index<3;index++){
    await act(()=>document.getElementById('first-reset').click());await act(tick);
    assert.deepEqual(state('first'),{x:.72,y:.24,auto:false});
  }
  console.log('Installed public archive: editable input, automatic motion, repeated reset and sibling isolation passed.');
}finally{await act(()=>root.unmount());dom.window.close();}
