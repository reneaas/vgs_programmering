import * as T from '../../vendor/three/build/three.module.js';
import {OrbitControls} from '../../vendor/three/examples/jsm/controls/OrbitControls.js';
import {Line2} from '../../vendor/three/examples/jsm/lines/Line2.js';
import {LineGeometry} from '../../vendor/three/examples/jsm/lines/LineGeometry.js';
import {LineMaterial} from '../../vendor/three/examples/jsm/lines/LineMaterial.js';

// Render on demand through one GPU context; each figure owns a canvas copy.
export const gpu={renderer:null,panels:new Set()};

// Always render the light palette; [data-mode="dark"] applies a CSS invert+hue-rotate
// filter to .munch-3d-board (see interactive3d.css), the same trick used for static
// matplotlib figures, so the canvas needs no theme-awareness of its own.
function acquire() {
    if(gpu.renderer)return gpu.renderer;
    const renderer=new T.WebGLRenderer({antialias:true,alpha:false});
    renderer.setClearColor(0xffffff);
    renderer.domElement.addEventListener('webglcontextlost',event=>{
        event.preventDefault();for(const panel of gpu.panels)panel.onFailure(Error('Graphics context lost.'));
    });
    renderer.domElement.addEventListener('webglcontextrestored',()=>{for(const panel of gpu.panels){panel.box.closest('.munch-3d').classList.remove('munch-3d-error');panel.requestRender();}});
    gpu.renderer=renderer;return renderer;
}
function disposeGroup(group) {
    group.traverse(object=>{object.geometry?.dispose();object.material?.dispose();});
    group.clear();
}
// A filled-circle alpha mask so point sprites read as round dots (PointsMaterial is square by default).
let dotSprite=null;
function dotTexture() {
    if(dotSprite)return dotSprite;
    const size=64,canvas=document.createElement('canvas');canvas.width=canvas.height=size;
    const context=canvas.getContext('2d');
    context.beginPath();context.arc(size/2,size/2,size/2-1,0,Math.PI*2);context.fillStyle='#fff';context.fill();
    dotSprite=new T.CanvasTexture(canvas);return dotSprite;
}
export class ThreePanel {
    constructor(box,ranges,onFailure,onSuccess) {
        acquire();this.box=box;this.onFailure=onFailure;this.onSuccess=onSuccess;this.entries=[];
        // Low ambient + a strong key light gives spheres a visible light/dark gradient (so they
        // read as balls, not flat filled circles); a dim fill light from the opposite side keeps
        // the far/"back" hemisphere from going fully black.
        this.scene=new T.Scene();this.scene.add(new T.AmbientLight(0xffffff,.55));
        // Depth-only stand-ins for translucent surfaces, rendered in their own pass (see render())
        // so hidden-edge lines can detect occlusion behind them without translucent surfaces
        // themselves acting as hard occluders for normal alpha blending.
        this.occluders=new T.Scene();
        const light=new T.DirectionalLight(0xffffff,2.2);light.position.set(3,-4,8);this.scene.add(light);
        const fill=new T.DirectionalLight(0xffffff,.35);fill.position.set(-4,3,-2);this.scene.add(fill);
        this.center=new T.Vector3(...ranges.map(([lo,hi])=>(lo+hi)/2));
        this.span=Math.max(...ranges.map(([lo,hi])=>hi-lo));
        this.camera=new T.OrthographicCamera(-1,1,1,-1,this.span*.001,this.span*100);
        this.camera.up.set(0,0,1);
        this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-label','Interactive 3D math graph');
        this.overlay=document.createElement('div');this.overlay.className='munch-3d-labels';
        box.append(this.canvas,this.overlay);this.context=this.canvas.getContext('2d');
        this.controls=new OrbitControls(this.camera,this.canvas);this.controls.target.copy(this.center);
        this.controls.enablePan=false;this.controls.enableDamping=false;this.controls.minZoom=.2;this.controls.maxZoom=5;
        this.controls.addEventListener('change',()=>this.requestRender());
        this.resize=new ResizeObserver(()=>this.requestRender());this.resize.observe(box);
        gpu.panels.add(this);
    }
    requestRender() {
        if(this.disposed||this.frame)return;
        this.frame=requestAnimationFrame(()=>{this.frame=0;try{this.render();}catch(error){this.onFailure(error);}});
    }
    stroke(group,points,item,arrow=false) {
        if(points.length<2)return;
        const geometry=new LineGeometry();geometry.setPositions(points.flat());
        for(const hidden of item.hiddenEdges==='dashed'?[false,true]:[false]) {
            const material=new LineMaterial({color:item.color,linewidth:item.lw||1.5,worldUnits:false,
                dashed:hidden||!!(item.style&&item.style!=='solid'),dashSize:item.style==='dotted'?.015:.09,gapSize:.07,
                depthTest:true,depthWrite:false,depthFunc:hidden?T.GreaterDepth:T.LessEqualDepth,
                transparent:hidden,opacity:hidden?.45:1});
            const line=new Line2(hidden?geometry.clone():geometry,material);line.computeLineDistances();
            line.renderOrder=hidden?3:2;line.userData.hidden=hidden;group.add(line);
        }
        if(arrow) {
            const a=new T.Vector3(...points.at(-2)),b=new T.Vector3(...points.at(-1)),length=b.distanceTo(a);
            if(length<1e-10)return;
            const direction=b.clone().sub(a).normalize();
            const cone=new T.Mesh(new T.ConeGeometry(1,1,12),new T.MeshBasicMaterial({color:item.color}));
            cone.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction);
            cone.userData.arrow={tip:b,direction,length};group.add(cone);
        }
    }
    face(group,faces,item) {
        const vertices=[];
        for(const face of faces) {
            if(face.length<3)continue;
            // Project each planar polygon into a local basis before ear clipping,
            // so concave bases are not incorrectly triangulated as a fan.
            const origin=new T.Vector3(...face[0]);
            let normal=new T.Vector3();
            for(let i=1;i<face.length-1&&normal.lengthSq()<1e-20;i++)normal.crossVectors(new T.Vector3(...face[i]).sub(origin),new T.Vector3(...face[i+1]).sub(origin));
            if(normal.lengthSq()<1e-20)continue;
            normal.normalize();const u=new T.Vector3(...face.find(p=>new T.Vector3(...p).distanceToSquared(origin)>1e-20)).sub(origin).normalize();
            const v=new T.Vector3().crossVectors(normal,u);
            const contour=face.map(p=>{const d=new T.Vector3(...p).sub(origin);return new T.Vector2(d.dot(u),d.dot(v));});
            for(const triangle of T.ShapeUtils.triangulateShape(contour,[]))for(const index of triangle)vertices.push(...face[index]);
        }
        if(!vertices.length)return null;
        const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();
        const material=new T.MeshLambertMaterial({color:item.color,side:T.DoubleSide,transparent:item.alpha<1,opacity:item.alpha,depthWrite:item.alpha>=1,
            polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
        group.add(new T.Mesh(geometry,material));
        // Opaque faces already write real depth in the normal pass; translucent ones don't (so they
        // blend correctly), so they get a depth-only stand-in for the separate occlusion pass instead.
        // Its offset must match the visible face's, or the two disagree at the shared boundary edge.
        if(item.alpha>=1)return null;
        const occluder=new T.Mesh(geometry,new T.MeshBasicMaterial({colorWrite:false,depthWrite:true,side:T.DoubleSide}));
        occluder.material.polygonOffset=true;occluder.material.polygonOffsetFactor=1;occluder.material.polygonOffsetUnits=1;
        return occluder;
    }
    build(item) {
        const group=new T.Group();
        let occluder=null;
        if(item.type==='mesh') {
            occluder=this.face(group,item.faces,item);
            for(const edge of item.edges)this.stroke(group,edge,{...item,color:item.edgecolor||item.color});
        } else if(['plane','ngon'].includes(item.type)) {
            occluder=this.face(group,[item.points.slice(0,-1)],item);this.stroke(group,item.points,{...item,color:item.edgecolor||item.color});
        } else if(item.type==='point') {
            const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(item.points.flat(),3));
            group.add(new T.Points(geometry,new T.PointsMaterial({color:item.color,size:8,sizeAttenuation:false,map:dotTexture(),alphaTest:.5})));
        } else if(item.type==='sphere') {
            const geometry=new T.SphereGeometry(item.radius,48,24);
            const mesh=new T.Mesh(geometry,new T.MeshLambertMaterial({color:item.color,transparent:item.alpha<1,opacity:item.alpha,depthWrite:item.alpha>=1}));
            mesh.position.set(...item.points[0]);group.add(mesh);
            if(item.alpha<1){occluder=new T.Mesh(geometry,new T.MeshBasicMaterial({colorWrite:false,depthWrite:true}));occluder.position.copy(mesh.position);}
        } else {
            let part=[];
            const flush=()=>{this.stroke(group,part,item,item.type==='vector');part=[];};
            for(const point of item.points){if(point.every(Number.isFinite))part.push(point);else flush();}flush();
            if(item.type==='curve'&&item.arrows)for(let i=1;i<=item.arrowCount;i++) {
                const k=Math.floor(i*(item.points.length-1)/(item.arrowCount+1));
                const pair=item.points.slice(Math.max(0,k-1),k+1);
                if(pair.length===2&&pair.flat().every(Number.isFinite))this.stroke(group,pair,item,true);
            }
        }
        return {group,occluder};
    }
    update(items) {
        const drawings=items.filter(p=>p.type!=='text');
        for(let i=0;i<Math.max(drawings.length,this.entries.length);i++) {
            const item=drawings[i],key=item?JSON.stringify(item):null,old=this.entries[i];
            if(old?.key===key)continue;
            if(old){
                this.scene.remove(old.group);disposeGroup(old.group);
                if(old.occluder){this.occluders.remove(old.occluder);old.occluder.material.dispose();}
            }
            if(item){
                const {group,occluder}=this.build(item);
                this.scene.add(group);if(occluder)this.occluders.add(occluder);
                this.entries[i]={key,group,occluder};
            }
        }
        this.entries.length=drawings.length;this.overlay.replaceChildren();
        this.labels=items.filter(p=>p.type==='text').map(item=>{
            const element=document.createElement('span');element.className='munch-3d-label';element.style.color=item.color;
            element.style.fontSize=(item.fontsize||12)+'px';
            // Render mixed prose and $math$ without interpreting HTML from authors.
            const parts=item.text.split(/(\$[^$]+\$)/g);
            for(const part of parts) {
                const span=document.createElement('span');
                if(part.startsWith('$')&&part.endsWith('$')&&window.katex)window.katex.render(part.slice(1,-1),span,{throwOnError:false,trust:false,strict:'ignore'});
                else span.textContent=part;
                element.append(span);
            }
            this.overlay.append(element);return {element,item};
        });
        document.fonts.ready.then(()=>this.requestRender());this.requestRender();
    }
    getCamera() {
        const p=this.camera.position.clone().sub(this.center);
        return {azim:Math.atan2(p.y,p.x)*180/Math.PI,elev:Math.asin(p.z/p.length())*180/Math.PI,zoom:this.camera.zoom*1.28};
    }
    setCamera(state) {
        if(!Object.values(state).every(Number.isFinite))throw Error('Undefined camera');
        const az=state.azim*Math.PI/180,el=Math.max(-89.9,Math.min(89.9,state.elev))*Math.PI/180,d=this.span*3;
        this.camera.position.set(d*Math.cos(el)*Math.cos(az),d*Math.cos(el)*Math.sin(az),d*Math.sin(el)).add(this.center);
        this.camera.zoom=Math.max(.2,Math.min(5,state.zoom/1.28));this.camera.lookAt(this.center);this.camera.updateProjectionMatrix();this.controls.update();this.requestRender();
    }
    project(point) {
        const p=new T.Vector3(...point).project(this.camera);
        return [(p.x+1)*this.box.clientWidth/2,(1-p.y)*this.box.clientHeight/2];
    }
    render() {
        if(this.disposed)return;
        const w=this.box.clientWidth,h=this.box.clientHeight;
        if(!w||!h)return;
        const renderer=acquire();if(renderer.getContext().isContextLost())return;
        const half=this.span*.65*Math.max(1,h/w);this.camera.top=half;this.camera.bottom=-half;
        this.camera.left=-half*w/h;this.camera.right=half*w/h;this.camera.updateProjectionMatrix();
        const cssScale=this.box.getBoundingClientRect().width/this.box.offsetWidth;
        renderer.setPixelRatio(Math.min(devicePixelRatio*cssScale,3));renderer.setSize(w,h,false);
        this.scene.traverse(object=>{
            if(object.material?.isLineMaterial)object.material.resolution.set(w,h);
            const arrow=object.userData.arrow;
            if(arrow){const size=Math.min(half*2/this.camera.zoom/h*12,arrow.length*.5);object.scale.set(size*.32,size,size*.32);object.position.copy(arrow.tip).addScaledVector(arrow.direction,-size/2);}
        });
        // Four passes so a line is fully suppressed (only its dashed variant shows) behind an
        // occluder regardless of whether that occluder is opaque or translucent:
        // 1) surfaces/points/arrows only (opaque geometry writes real depth; translucent surfaces
        //    skip depth writes so they still blend normally against each other and real opaque depth);
        // 2) depth-only stand-ins for translucent surfaces, layered on top without touching color,
        //    so the *lines* below can detect them without translucent surfaces hard-occluding anything;
        // 3) the ordinary (undashed) line variants, which now see both opaque and translucent depth;
        // 4) the dashed variants, tested against that same completed depth buffer.
        // Each phase shows a disjoint set of objects so nothing is blended twice.
        const solidLines=[],hiddenLines=[],others=[];
        this.scene.traverse(o=>{
            if(o.children.length)return;
            if(o.userData.hidden===true)hiddenLines.push(o);else if(o.userData.hidden===false)solidLines.push(o);else others.push(o);
        });
        for(const o of[...solidLines,...hiddenLines])o.visible=false;
        renderer.autoClear=true;renderer.render(this.scene,this.camera);
        renderer.autoClear=false;renderer.render(this.occluders,this.camera);
        for(const o of others)o.visible=false;
        for(const o of solidLines)o.visible=true;
        renderer.render(this.scene,this.camera);
        for(const o of solidLines)o.visible=false;
        for(const o of hiddenLines)o.visible=true;
        renderer.render(this.scene,this.camera);
        for(const o of[...others,...solidLines])o.visible=true;
        renderer.autoClear=true;
        if(this.canvas.width!==renderer.domElement.width||this.canvas.height!==renderer.domElement.height){this.canvas.width=renderer.domElement.width;this.canvas.height=renderer.domElement.height;}
        this.context.drawImage(renderer.domElement,0,0);
        for(const {element,item} of this.labels||[]) {
            let [x,y]=this.project(item.points[0]);
            const ew=element.offsetWidth,eh=element.offsetHeight;
            x-=item.ha==='left'?0:item.ha==='right'?ew:ew/2;y-=item.va==='top'?0:item.va==='bottom'?eh:eh/2;
            element.style.left=Math.max(2,Math.min(w-ew-2,x))+'px';element.style.top=Math.max(2,Math.min(h-eh-2,y))+'px';
        }
        this.onSuccess();
    }
    dispose() {
        if(this.disposed)return;this.disposed=true;cancelAnimationFrame(this.frame);this.resize.disconnect();this.controls.dispose();
        for(const entry of this.entries)disposeGroup(entry.group);this.entries=[];this.occluders.clear();this.overlay.remove();this.canvas.remove();gpu.panels.delete(this);
        if(!gpu.panels.size&&gpu.renderer){gpu.renderer.dispose();gpu.renderer.forceContextLoss();gpu.renderer=null;}
    }
}
