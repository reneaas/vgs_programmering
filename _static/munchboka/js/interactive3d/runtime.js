(function () {
    "use strict";
    const G = window.MunchScene3D;
    const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    function initialize(host) {
        if (host.dataset.initialized || !host.getBoundingClientRect().width) return;
        host.dataset.initialized = "true";
        const status = host.querySelector(".munch-3d-status"), box = host.querySelector(".munch-3d-board");
        let board;
        try {
            if (!window.JXG || !G) throw Error("The 3D renderer could not be loaded.");
            const scene = JSON.parse(host.querySelector("script[type='application/json']").textContent);
            if (scene.version !== 1) throw Error("Unsupported scene version");
            const vars = Object.create(null), controls = host.querySelector(".munch-3d-controls");
            let revision = 0;
            for (const slider of scene.sliders) vars[slider.name] = slider.min+(slider.max-slider.min)*slider.initial/(slider.count-1);
            const e = t => G.evaluate(t,vars);
            const initialZoom = () => Math.max(0.2,Math.min(3,e(scene.camera.zoom)/1.28));
            let zoom = initialZoom();
            board = JXG.JSXGraph.initBoard(box.id, {
                boundingbox: [-6,5,6,-5], axis:false, showCopyright:false, showNavigation:false,
                keepaspectratio:true, pan:{enabled:false}, zoom:{enabled:false},
                resize:{enabled:false}, keyboard:{enabled:false}
            });
            const angle = () => [((e(scene.camera.azim)+90)*Math.PI/180)%(2*Math.PI), e(scene.camera.elev)*Math.PI/180];
            const [az,el] = angle();
            const view = board.create("view3d", [[-3,-3],[6,6],scene.ranges], {
                projection:"parallel", axesPosition:"none", depthOrder:{enabled:true},
                az:{slider:{visible:false,min:-2*Math.PI,max:2*Math.PI,start:az},pointer:{button:0}},
                el:{slider:{visible:false,min:-Math.PI/2,max:Math.PI/2,start:el},pointer:{button:0}},
                bank:{slider:{visible:false}},
                xPlaneRear:{visible:false}, yPlaneRear:{visible:false}, zPlaneRear:{visible:false},
                xPlaneFront:{visible:false}, yPlaneFront:{visible:false}, zPlaneFront:{visible:false}
            });
            function setZoom() { board.setBoundingBox([-6/zoom,5/zoom,6/zoom,-5/zoom],true); }
            const line = (a,b,attributes={}) => view.create("line3d", [a,b], {
                fixed:true, straightFirst:false, straightLast:false, strokeColor:"#444",strokeWidth:1.2,
                highlight:false, ...attributes
            });
            function label(p,value,attrs={}) {
                const display = () => {
                    const text = typeof value === "function" ? value() : value;
                    return window.MathJax ? text : text.replace(/\$/g, "");
                };
                return view.create("text3d", [p,display], {fixed:true, withLabel:false, name:"", fontSize:scene.fontsize,
                    useMathJax:!!window.MathJax, parse:false, highlight:false, ...attrs});
            }
            for (let i=0;i<3;i++) {
                const [lo,hi] = scene.ranges[i], p = n => [0,0,0].map((_,j) => i===j?n:0);
                if (scene.axis) {
                    line(p(lo),p(hi),{lastArrow:{type:2,size:5}});
                    if (scene.labels[i].toLowerCase() !== "none") label(p(hi),escapeHTML(scene.labels[i]));
                    if (scene.ticks[i]) for (const t of G.ticks(lo,hi,scene.steps[i])) {
                        const a=p(t), b=p(t), offset=(i+1)%3;
                        a[offset]-=0.06; b[offset]+=0.06;
                        line(a,b); const anchor=p(t); anchor[offset]-=0.18;
                        label(anchor,Number(t.toPrecision(6)).toString(),{fontSize:scene.fontsize*0.85});
                    }
                }
            }
            if (scene.grid) for (let i=0;i<2;i++) {
                const j=1-i;
                for (const t of G.ticks(...scene.ranges[i],scene.steps[i],true)) {
                    const a=[0,0,0],b=[0,0,0]; a[i]=b[i]=t; a[j]=scene.ranges[j][0]; b[j]=scene.ranges[j][1];
                    line(a,b,{strokeColor:"#aaa",strokeWidth:0.7,dash:2});
                }
            }
            const entries = [];
            for (const item of scene.primitives) {
                let cachedRevision=-1, points=[];
                const get = () => {
                    if (cachedRevision!==revision) {
                        try { points=G.geometry(item,vars,scene.ranges); } catch (_) { points=[]; }
                        cachedRevision=revision;
                    }
                    return points;
                };
                const valid = () => get().some(p=>p.every(Number.isFinite));
                const attrs = {fixed:true,highlight:false,strokeColor:item.color,fillColor:item.color,
                    strokeWidth:()=>e(item.lw),visible:valid, dash:({solid:0,dotted:1,dashed:2,dashdot:3}[item.style] || 0)};
                let object;
                if (item.type==="point") object=view.create("point3d",[()=>get()[0]||[0,0,0]],{...attrs,name:"",withLabel:false,size:3});
                else if (item.type==="sphere") object=view.create("sphere3d",[()=>get()[0]||[0,0,0],()=>valid()?e(item.radius):1],{...attrs,center:{visible:false,withLabel:false,name:""},fillOpacity:()=>e(item.alpha)});
                else if (item.type==="text") {
                    const text = () => escapeHTML(item.text.replace(/\{([A-Za-z]\w*)(?::\.(\d{1,2})f)?\}/g,(all,name,digits)=>Object.hasOwn(vars,name)?(digits===undefined?String(Number(vars[name].toPrecision(6))):vars[name].toFixed(Math.min(12,+digits))):all));
                    object=label(()=>get()[0]||[0,0,0],text,{...attrs,fontSize:()=>e(item.fontsize),anchorX:item.ha==="center"?"middle":item.ha,anchorY:item.va==="center"?"middle":item.va});
                } else if (["vector","line","line-segment"].includes(item.type)) {
                    object=line(()=>get()[0]||[0,0,0],()=>get()[1]||[0,0,0],{...attrs,lastArrow:item.type==="vector"?{type:2,size:6}:false});
                } else {
                    object=view.create("curve3d",[[],[],[]],{...attrs,fillOpacity:["plane","ngon"].includes(item.type)?()=>e(item.alpha):0});
                    object.updateDataArray=function () {
                        const p=get(); this.dataX=p.map(v=>v[0]); this.dataY=p.map(v=>v[1]); this.dataZ=p.map(v=>v[2]);
                    };
                }
                entries.push({valid,object});
            }
            function updateStatus() {
                const invalid = entries.filter(entry=>!entry.valid()).length;
                status.textContent=invalid?`${invalid} object(s) are undefined or outside the viewing box at these values.`:"Drag to rotate. Use the controls to change the view.";
            }
            for (const slider of scene.sliders) {
                const wrap=document.createElement("label"), title=document.createElement("span"), input=document.createElement("input"), output=document.createElement("output");
                title.textContent=slider.name; input.type="range"; input.min="0"; input.max=String(slider.count-1); input.step="1"; input.value=String(slider.initial);
                input.setAttribute("aria-label",slider.name);
                const show=()=>{output.textContent=Number(vars[slider.name].toPrecision(6)).toString(); input.setAttribute("aria-valuetext",output.textContent);};
                input.addEventListener("input",()=>{
                    vars[slider.name]=slider.min+(slider.max-slider.min)*(+input.value)/(slider.count-1); revision++;
                    // Ordinary geometry sliders leave a manually rotated camera untouched.
                    if (JSON.stringify(scene.camera.azim).includes('"'+slider.name+'"') || JSON.stringify(scene.camera.elev).includes('"'+slider.name+'"')) view.setView(...angle());
                    if (JSON.stringify(scene.camera.zoom).includes('"'+slider.name+'"')) { zoom=initialZoom(); setZoom(); }
                    show(); board.update(); updateStatus();
                });
                show(); wrap.append(title,input,output); controls.append(wrap);
            }
            const buttons=document.createElement("div"); buttons.className="munch-3d-buttons";
            function button(title,action) {const b=document.createElement("button");b.type="button";b.textContent=title;b.addEventListener("click",action);buttons.append(b);}
            button("Reset view",()=>{view.setView(...angle());zoom=initialZoom();setZoom();});
            button("Zoom in",()=>{zoom=Math.min(3,zoom*1.2);setZoom();});
            button("Zoom out",()=>{zoom=Math.max(0.2,zoom/1.2);setZoom();});
            button("Rotate left",()=>view.setView(view.az_slide.Value()-Math.PI/12,view.el_slide.Value()));
            button("Rotate right",()=>view.setView(view.az_slide.Value()+Math.PI/12,view.el_slide.Value()));
            button("Tilt up",()=>view.setView(view.az_slide.Value(),Math.min(Math.PI/2,view.el_slide.Value()+Math.PI/12)));
            button("Tilt down",()=>view.setView(view.az_slide.Value(),Math.max(-Math.PI/2,view.el_slide.Value()-Math.PI/12)));
            controls.append(buttons);
            const resize = new ResizeObserver(()=>{
                if (!host.isConnected) {resize.disconnect();JXG.JSXGraph.freeBoard(board);return;}
                const width=box.clientWidth, height=box.clientHeight;
                if(width && height) {board.resizeContainer(width,height,true);setZoom();}
            });
            resize.observe(box); setZoom(); board.update(); updateStatus();
            host.classList.add("munch-3d-ready");
            host.munch3d={board,view,vars,entries};
        } catch(error) {
            if(board) JXG.JSXGraph.freeBoard(board);
            status.textContent="Interactive view unavailable. The static figure is shown. "+error.message;
            host.classList.add("munch-3d-error");
        }
    }
    function boot() {
        const observer=new IntersectionObserver(entries=>{for(const entry of entries) if(entry.isIntersecting) {initialize(entry.target);if(entry.target.dataset.initialized) observer.unobserve(entry.target);}});
        document.querySelectorAll(".munch-3d").forEach(host=>observer.observe(host));
    }
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
