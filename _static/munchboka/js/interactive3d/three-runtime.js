import {ThreePanel,gpu} from './three-renderer.js';
const G=window.MunchScene3D,instances=new Map();
// Heroicons outline set (MIT), matching the pill buttons used by answer-2/solution-2/interactive-code.
const ICON=(path)=>`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${path}"/></svg>`;
const ICONS={
    reset:ICON('M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'),
    left:ICON('M15.75 19.5 8.25 12l7.5-7.5'),
    right:ICON('m8.25 4.5 7.5 7.5-7.5 7.5'),
    up:ICON('m4.5 15.75 7.5-7.5 7.5 7.5'),
    down:ICON('m19.5 8.25-7.5 7.5-7.5-7.5'),
    zoomIn:ICON('m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6'),
    zoomOut:ICON('m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6'),
};
function initialize(host) {
    if(host.dataset.initialized||!host.getBoundingClientRect().width)return;
    host.dataset.initialized='true';
    const status=host.querySelector('.munch-3d-status'),box=host.querySelector('.munch-3d-board'),controls=host.querySelector('.munch-3d-controls');
    let panel;
    const fail=error=>{host.classList.remove('munch-3d-ready');host.classList.add('munch-3d-error');status.textContent='Interactive view unavailable. The static figure is shown. '+error.message;};
    try {
        const scene=JSON.parse(host.querySelector('script[type="application/json"]').textContent);
        if(scene.version!==1)throw Error('Unsupported scene version');
        const vars=Object.create(null);
        for(const slider of scene.sliders)vars[slider.name]=slider.min+(slider.max-slider.min)*slider.initial/(slider.count-1);
        let errors=[];
        panel=new ThreePanel(box,scene.ranges,fail,()=>{
            host.classList.remove('munch-3d-error');host.classList.add('munch-3d-ready');
            status.textContent=errors.length?`${errors.length} object(s) are undefined or outside the viewing box at these values. ${errors[0]}`:('Dra for å rotere. Scroll eller knip for å zoome.'+(scene.buttons?' Tastaturstyrte visningskontroller er under.':''));
        });
        const camera=()=>Object.fromEntries(Object.entries(scene.camera).map(([key,value])=>[key,G.evaluate(value,vars)]));
        const update=()=>{const resolved=G.objects(scene,vars);errors=resolved.errors;host.classList.remove('munch-3d-error');panel.update(resolved.items);host.munch3d.items=resolved.items;host.munch3d.errors=errors;};
        host.munch3d={panel,vars,gpu};instances.set(host,panel);panel.setCamera(camera());update();
        for(const slider of scene.sliders) {
            const wrap=document.createElement('label'),title=document.createElement('span'),input=document.createElement('input'),output=document.createElement('output');
            title.textContent=slider.name;input.type='range';input.min='0';input.max=String(slider.count-1);input.step='1';input.value=String(slider.initial);input.setAttribute('aria-label',slider.name);
            const show=()=>{output.textContent=String(Number(vars[slider.name].toPrecision(6)));input.setAttribute('aria-valuetext',output.textContent);};
            input.addEventListener('input',()=>{
                vars[slider.name]=slider.min+(slider.max-slider.min)*(+input.value)/(slider.count-1);show();
                try {
                    const state=panel.getCamera();let changed=false;
                    for(const [key,tree] of Object.entries(scene.camera))if(JSON.stringify(tree).includes('"'+slider.name+'"')){state[key]=G.evaluate(tree,vars);changed=true;}
                    if(changed)panel.setCamera(state);update();
                } catch(error){fail(error);}
            });
            show();wrap.append(title,input,output);controls.append(wrap);
        }
        // Dragging/scrolling already rotates and zooms, so the button row is opt-in via `buttons: true`.
        if(scene.buttons) {
            const buttons=document.createElement('div');buttons.className='munch-3d-buttons';
            const button=(title,action,cls,icon)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.innerHTML=`<span>${title}</span>${icon}`;b.addEventListener('click',()=>{try{action();}catch(error){fail(error);}});buttons.append(b);};
            button('Reset view',()=>panel.setCamera(camera()),'munch-3d-button-reset',ICONS.reset);
            for(const [title,key,delta,icon] of [['Rotate left','azim',-15,ICONS.left],['Rotate right','azim',15,ICONS.right],['Tilt up','elev',15,ICONS.up],['Tilt down','elev',-15,ICONS.down]])button(title,()=>{const state=panel.getCamera();state[key]+=delta;panel.setCamera(state);},'munch-3d-button-nav',icon);
            button('Zoom in',()=>panel.setCamera({...panel.getCamera(),zoom:panel.getCamera().zoom*1.2}),'munch-3d-button-nav',ICONS.zoomIn);
            button('Zoom out',()=>panel.setCamera({...panel.getCamera(),zoom:panel.getCamera().zoom/1.2}),'munch-3d-button-nav',ICONS.zoomOut);
            controls.append(buttons);
        }
        if(!controls.children.length)controls.style.display='none';
    } catch(error){panel?.dispose();instances.delete(host);fail(error);}
}
function boot() {
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){initialize(entry.target);if(entry.target.dataset.initialized)observer.unobserve(entry.target);}});
    document.querySelectorAll('.munch-3d').forEach(host=>observer.observe(host));
    new MutationObserver(()=>{for(const [host,panel] of instances)if(!host.isConnected){panel.dispose();instances.delete(host);}}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
