import {ThreePanel,gpu} from './three-renderer.js';
// Not `const`: re-read in initialize() in case scene.js's classic <script> hadn't
// finished executing yet on the very first attempt (see the ResizeObserver retry below).
let G=window.MunchScene3D;
const instances=new Map();
function renderVariableLabel(element,name) {
    // Match interactive-plot's Greek names and preserve LaTeX subscripts.
    const greek=new Set('alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi pi rho sigma tau upsilon phi chi psi omega varphi vartheta'.split(' '));
    const latex=greek.has(name)?'\\'+name:name;
    element.textContent=name;
    if(window.katex) {
        try {
            element.innerHTML=window.katex.renderToString(latex,{throwOnError:false,displayMode:false});
        } catch(error) {
            // Keep the plain-text label if math rendering is unavailable.
        }
    }
}
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
// Converts a pointer event to coordinates in the same space as panel.project() (box
// content-box pixels), independent of borders or any CSS transform scaling.
function pointerPosition(box,event) {
    const rect=box.getBoundingClientRect();
    const sx=box.clientWidth/rect.width,sy=box.clientHeight/rect.height;
    return [(event.clientX-rect.left)*sx,(event.clientY-rect.top)*sy];
}
function nearestDraggable(panel,draggables,vars,x,y) {
    let best=null,bestDistance=14*14;
    for(const d of draggables) {
        const point=d.coords.map(tree=>G.evaluate(tree,vars));
        if(!point.every(Number.isFinite))continue;
        const [px,py]=panel.project(point),distance=(px-x)**2+(py-y)**2;
        if(distance<bestDistance){bestDistance=distance;best=d;}
    }
    return best;
}
// Lets a pointer drag move a draggable point along its own parametrized path, solving
// for the slider variable it depends on instead of letting OrbitControls rotate the
// camera for that gesture. A capture-phase listener on `box` (OrbitControls' own
// pointerdown listener sits on the canvas, in bubble phase) runs first and can veto
// the gesture with stopPropagation() before it ever reaches OrbitControls.
function initializeDragging(box,panel,scene,vars,draggables,sliderControls,setVar,fail) {
    const syncSlider=(name,value)=>{
        const entry=sliderControls[name];if(!entry)return;
        const {slider,input,show}=entry,index=Math.round((value-slider.min)/(slider.max-slider.min)*(slider.count-1));
        input.value=String(Math.max(0,Math.min(slider.count-1,index)));show();
    };
    let dragging=null;
    box.addEventListener('pointerdown',event=>{
        if(event.button)return;
        const [x,y]=pointerPosition(box,event),hit=nearestDraggable(panel,draggables,vars,x,y);
        if(!hit)return;
        event.preventDefault();event.stopPropagation();
        dragging=hit;box.classList.add('munch-3d-dragging');
        try{box.setPointerCapture(event.pointerId);}catch(error) { /* capture is best-effort */ }
    },{capture:true});
    box.addEventListener('pointermove',event=>{
        const [x,y]=pointerPosition(box,event);
        if(!dragging){box.classList.toggle('munch-3d-hover-point',!!nearestDraggable(panel,draggables,vars,x,y));return;}
        try {
            const slider=scene.sliders.find(s=>s.name===dragging.name);
            const value=G.solveDragValue(dragging.coords,dragging.name,vars,slider.min,slider.max,[x,y],point=>panel.project(point));
            setVar(dragging.name,value);syncSlider(dragging.name,value);
        } catch(error){fail(error);}
    });
    const endDrag=event=>{
        if(!dragging)return;
        dragging=null;box.classList.remove('munch-3d-dragging');
        try{box.releasePointerCapture(event.pointerId);}catch(error) { /* already released */ }
    };
    box.addEventListener('pointerup',endDrag);
    box.addEventListener('pointercancel',endDrag);
}
function initialize(host) {
    if(host.dataset.initialized||!host.getBoundingClientRect().width)return;
    G=G||window.MunchScene3D;
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
        const draggables=scene.primitives.filter(p=>p.type==='point'&&p.drag).map(p=>({coords:p.coords,name:p.drag}));
        panel=new ThreePanel(box,scene.ranges,fail,()=>{
            host.classList.remove('munch-3d-error');host.classList.add('munch-3d-ready');
            status.textContent=errors.length?`${errors.length} object(s) are undefined or outside the viewing box at these values. ${errors[0]}`:('Dra for å rotere. Scroll eller knip for å zoome.'+(draggables.length?' Dra et punkt for å flytte det.':'')+(scene.buttons?' Tastaturstyrte visningskontroller er under.':''));
        });
        const camera=()=>Object.fromEntries(Object.entries(scene.camera).map(([key,value])=>[key,G.evaluate(value,vars)]));
        const update=()=>{const resolved=G.objects(scene,vars);errors=resolved.errors;host.classList.remove('munch-3d-error');panel.update(resolved.items);host.munch3d.items=resolved.items;host.munch3d.errors=errors;};
        host.munch3d={panel,vars,gpu};instances.set(host,panel);panel.setCamera(camera());update();
        // Shared by the slider inputs and point-dragging below, so both paths move the
        // camera (if it reads this variable) and recompute the scene identically.
        const setVar=(name,value)=>{
            vars[name]=value;
            const state=panel.getCamera();let changed=false;
            for(const [key,tree] of Object.entries(scene.camera))if(JSON.stringify(tree).includes('"'+name+'"')){state[key]=G.evaluate(tree,vars);changed=true;}
            if(changed)panel.setCamera(state);
            update();
        };
        const sliderControls=Object.create(null);
        for(const slider of scene.sliders) {
            // A variable driven by dragging a point hides its slider by default (the point
            // itself is the control); `interactive-var: ..., slider=true` opts back in.
            if(!slider.visible)continue;
            const wrap=document.createElement('label'),title=document.createElement('span'),input=document.createElement('input'),output=document.createElement('output');
            renderVariableLabel(title,slider.name);input.type='range';input.min='0';input.max=String(slider.count-1);input.step='1';input.value=String(slider.initial);input.setAttribute('aria-label',slider.name);
            const show=()=>{output.textContent=vars[slider.name].toFixed(2);input.setAttribute('aria-valuetext',output.textContent);};
            input.addEventListener('input',()=>{
                try{setVar(slider.name,slider.min+(slider.max-slider.min)*(+input.value)/(slider.count-1));show();}catch(error){fail(error);}
            });
            show();wrap.append(title,input,output);controls.append(wrap);
            sliderControls[slider.name]={slider,input,show};
        }
        if(draggables.length)initializeDragging(box,panel,scene,vars,draggables,sliderControls,setVar,fail);
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
    // A host revealed from a `display:none` ancestor (an unopened answer/solution/hint
    // panel, a collapsed dropdown, ...) never reliably re-triggers the IntersectionObserver
    // with a settled, nonzero size — it may notify mid-reveal while still clipped to zero
    // height, after which the ratio never re-crosses the 0 threshold again. ResizeObserver
    // instead fires whenever the host itself gains a real box, independent of any ancestor's
    // own transition, so a figure stuck behind the static fallback resolves itself without a
    // page refresh as soon as its container is expanded.
    const resize=new ResizeObserver(entries=>{for(const entry of entries){const host=entry.target;if(!host.dataset.initialized&&entry.contentRect.width){initialize(host);if(host.dataset.initialized)resize.unobserve(host);}}});
    document.querySelectorAll('.munch-3d').forEach(host=>{observer.observe(host);resize.observe(host);});
    new MutationObserver(()=>{for(const [host,panel] of instances)if(!host.isConnected){panel.dispose();instances.delete(host);}}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
