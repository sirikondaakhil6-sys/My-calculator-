const screen=document.getElementById('screen'), historyEl=document.getElementById('history');
let expression='', justCalculated=false;

function render(){ screen.textContent=expression || '0'; }
function pretty(s){return s.replaceAll('*','×').replaceAll('/','÷').replaceAll('-','−');}
document.querySelectorAll('.keys button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const v=btn.dataset.value, action=btn.dataset.action;
    if(v!==undefined){
      if(justCalculated && /[0-9.]/.test(v)){expression='';historyEl.textContent='';}
      justCalculated=false;
      expression+=v; render();
    } else if(action==='clear'){expression='';historyEl.textContent='';justCalculated=false;render();}
    else if(action==='delete'){expression=expression.slice(0,-1);render();}
    else if(action==='sign'){
      if(expression) expression='-('+expression+')'; render();
    } else if(action==='equals'){
      if(!expression) return;
      try{
        const safe=expression.replace(/[^0-9+\-*/%.()]/g,'');
        if(!safe) throw Error();
        const result=Function('"use strict";return ('+safe+')')();
        historyEl.textContent=pretty(expression)+' =';
        expression=String(Number.isFinite(result)?Number(result.toFixed(10)):'Error');
        if(expression==='Error') expression='';
        justCalculated=true; render();
      }catch{screen.textContent='Error';expression='';}
    }
  });
});

document.addEventListener('keydown',e=>{
  if(/[0-9.+\-*/%]/.test(e.key)) expression+=e.key;
  else if(e.key==='Enter'||e.key==='=') document.querySelector('[data-action="equals"]').click();
  else if(e.key==='Backspace') expression=expression.slice(0,-1);
  else if(e.key==='Escape') expression='';
  render();
});

const drawer=document.getElementById('drawer'),overlay=document.getElementById('overlay');
function openMenu(){drawer.classList.add('open');overlay.classList.add('show');}
function closeMenu(){drawer.classList.remove('open');overlay.classList.remove('show');}
document.getElementById('menuBtn').onclick=openMenu;document.getElementById('closeMenu').onclick=closeMenu;overlay.onclick=closeMenu;

const savedTheme=localStorage.getItem('accent')||'#4B0082';
function setAccent(c){
 document.documentElement.style.setProperty('--accent',c);
 document.getElementById('themeColor').content=c;
 localStorage.setItem('accent',c);
 document.querySelectorAll('.color').forEach(b=>b.classList.toggle('active',b.dataset.color===c));
}
setAccent(savedTheme);
document.querySelectorAll('.color').forEach(b=>b.onclick=()=>setAccent(b.dataset.color));

const modeBtn=document.getElementById('modeBtn');
function setMode(mode){
 document.body.classList.toggle('dark',mode==='dark');
 modeBtn.textContent=mode==='dark'?'☀ Bright Mode':'🌙 Dark Mode';
 localStorage.setItem('mode',mode);
}
setMode(localStorage.getItem('mode')||'light');
modeBtn.onclick=()=>setMode(document.body.classList.contains('dark')?'light':'dark');

function setSize(size){
 const scales={small:.86,medium:1,large:1.13};
 document.documentElement.style.setProperty('--scale',scales[size]);
 localStorage.setItem('size',size);
 document.querySelectorAll('[data-size]').forEach(b=>b.classList.toggle('active',b.dataset.size===size));
}
setSize(localStorage.getItem('size')||'medium');
document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>setSize(b.dataset.size));

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js'));
