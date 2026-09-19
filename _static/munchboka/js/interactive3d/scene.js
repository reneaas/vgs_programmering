/* Geometry and arithmetic shared by the browser runtime and Node tests. */
(function (root) {
    "use strict";
    const EPS = 1e-10;
    const add = (a, b) => a.map((x, i) => x + b[i]);
    const sub = (a, b) => a.map((x, i) => x - b[i]);
    const scale = (a, s) => a.map(x => x * s);
    const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
    const norm = a => Math.hypot(...a);
    const unit = a => { const n = norm(a); if (n < EPS) throw Error("Zero direction"); return scale(a, 1 / n); };
    const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const perpendicular = a => unit(cross(a, Math.abs(a[0]) < 0.8 ? [1,0,0] : [0,1,0]));
    // Points around the circle where a plane (coeff = [A,B,C,D] for Ax+By+Cz+D=0)
    // cuts a sphere, or null if they don't intersect. Shared by the explicit
    // `circle` primitive and automatic plane/sphere intersection detection.
    function planeSphereCircle(coeff, center, radius, samples = 96) {
        const rawNormal = coeff.slice(0, 3), len = norm(rawNormal);
        if (!(radius > EPS) || !(len > EPS)) return null;
        const dist = (dot(rawNormal, center) + coeff[3]) / len, rho2 = radius * radius - dist * dist;
        if (!(rho2 > EPS)) return null;
        const rho = Math.sqrt(rho2), n = scale(rawNormal, 1 / len), mid = sub(center, scale(n, dist));
        const u = perpendicular(n), w = cross(n, u);
        return Array.from({length: samples + 1}, (_, i) => {
            const theta = 2 * Math.PI * i / samples;
            return add(mid, add(scale(u, rho * Math.cos(theta)), scale(w, rho * Math.sin(theta))));
        });
    }
    const funcs = Object.fromEntries(["sqrt","exp","log","sin","cos","tan","asin","acos","atan","sinh","cosh","tanh"].map(k => [k, Math[k]]));
    funcs.Abs = Math.abs;
    function evaluate(tree, vars) {
        if (typeof tree === "number") return tree;
        const [op, ...args] = tree;
        if (op === "var") {
            if (!Object.hasOwn(vars, args[0])) throw Error("Unknown variable " + args[0]);
            return vars[args[0]];
        }
        const v = args.map(a => evaluate(a, vars));
        if (Object.hasOwn(funcs, op)) return funcs[op](...v);
        switch (op) {
        case "+": return v[0]+v[1]; case "-": return v[0]-v[1];
        case "*": return v[0]*v[1]; case "/": return v[0]/v[1];
        case "**": return v[0]**v[1]; case "neg": return -v[0];
        default: throw Error("Unknown expression operator");
        }
    }
    function clippedLine(p, d, ranges) {
        if (norm(d) < EPS) return [];
        let lo = -Infinity, hi = Infinity;
        for (let i = 0; i < 3; i++) {
            if (Math.abs(d[i]) < EPS) { if (p[i] < ranges[i][0] || p[i] > ranges[i][1]) return []; }
            else {
                const a = (ranges[i][0]-p[i])/d[i], b = (ranges[i][1]-p[i])/d[i];
                lo = Math.max(lo, Math.min(a,b)); hi = Math.min(hi, Math.max(a,b));
            }
        }
        return lo > hi ? [] : [add(p,scale(d,lo)), add(p,scale(d,hi))];
    }
    function planePolygon(coeff, ranges) {
        const n = coeff.slice(0,3); unit(n);
        const corners = Array.from({length:8}, (_, k) => ranges.map((r,i) => r[(k>>i)&1]));
        const points = [];
        const insert = p => { if (!points.some(q => norm(sub(p,q)) < EPS)) points.push(p); };
        corners.forEach((a,k) => {
            for (let i=0; i<3; i++) {
                if ((k>>i)&1) continue;
                const b = corners[k|(1<<i)], fa = dot(n,a)+coeff[3], fb = dot(n,b)+coeff[3];
                if (Math.abs(fa)<EPS) insert(a);
                if (Math.abs(fb)<EPS) insert(b);
                if (fa*fb<0) insert(add(a,scale(sub(b,a),fa/(fa-fb))));
            }
        });
        if (points.length < 3) return [];
        const c = scale(points.reduce(add, [0,0,0]), 1/points.length), u = perpendicular(unit(n)), v = cross(unit(n),u);
        points.sort((a,b) => Math.atan2(dot(sub(a,c),v),dot(sub(a,c),u))-Math.atan2(dot(sub(b,c),v),dot(sub(b,c),u)));
        return [...points, points[0]];
    }
    function geometry(item, vars, ranges) {
        const e = t => evaluate(t,vars), v = t => t.map(e);
        let points;
        switch (item.type) {
        case "point": points = [v(item.coords)]; break;
        case "text": points = [add(v(item.at), v(item.offset))]; break;
        case "sphere": {
            const radius = e(item.radius);
            if (!(radius > EPS) || !Number.isFinite(radius)) return [];
            points = [v(item.center)]; break;
        }
        case "line": {
            const a = v(item.start), d = item.direction ? v(item.direction) : sub(v(item.end),a);
            points = clippedLine(a,d,ranges); break;
        }
        case "vector": case "line-segment": points = [v(item.start),v(item.end)]; break;
        case "plane": {
            if (item.coefficients) points = planePolygon(v(item.coefficients), item.ranges.map(v));
            else {
                const n = unit(v(item.normal)), u = perpendicular(n), w = cross(n,u), c = v(item.point), span = v(item.span);
                if (span.some(s => s <= EPS)) return [];
                points = [[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]].map(([a,b]) => add(c,add(scale(u,a*span[0]/2),scale(w,b*span[1]/2))));
            }
            break;
        }
        case "right-angle": case "angle": {
            const c = v(item.at), a = item.to1 ? sub(v(item.to1),c) : v(item.dir1), b = item.to2 ? sub(v(item.to2),c) : v(item.dir2);
            const u = unit(a), w = unit(b); let r = e(item.radius);
            if (!(r > EPS)) return [];
            if (item.type === "right-angle") {
                if (Math.abs(dot(u,w)) > 1e-7) return [];
                if (item.to1) r = Math.min(r,norm(a),norm(b));
                points = [add(c,scale(u,r)),add(c,scale(add(u,w),r)),add(c,scale(w,r))];
            } else {
                const cosine = Math.max(-1,Math.min(1,dot(u,w))), theta = Math.acos(cosine);
                if (theta < EPS) return [];
                const tangent = norm(sub(w,scale(u,cosine))) < EPS ? perpendicular(u) : unit(sub(w,scale(u,cosine)));
                points = Array.from({length:65}, (_,i) => add(c,scale(add(scale(u,Math.cos(theta*i/64)),scale(tangent,Math.sin(theta*i/64))),r)));
            }
            break;
        }
        case "curve": {
            const [lo,hi] = v(item.range);
            points = Array.from({length:item.samples},(_,i) => item.coordinates.map(t => evaluate(t,{...vars,t:lo+(hi-lo)*i/(item.samples-1)})));
            // Nonfinite samples break the path rather than joining across a singularity.
            return points.map(p => p.every(Number.isFinite) ? p : [NaN,NaN,NaN]);
        }
        case "ngon": points = item.points.map(v); points.push(points[0]); break;
        default: throw Error("Unsupported primitive " + item.type);
        }
        return points.every(p => p.every(Number.isFinite)) ? points : [];
    }
    function ticks(lo,hi,step,grid=false) {
        const result = [];
        for (let k=Math.ceil(lo/step); k<=Math.floor(hi/step) && result.length<201; k++) {
            const x=k*step;
            if (grid || (Math.abs(x)>EPS && x>lo+EPS && x<hi-EPS)) result.push(x);
        }
        return result;
    }

    // Resolve the authoring scene into numeric drawing objects. No source evaluation.
    function objects(scene, vars) {
        const result = [], errors = [];
        let budget = 1000;
        function visit(item, scope) {
            if (--budget < 0) throw Error("Scene exceeds 1000 expanded primitives");
            const e = t => evaluate(t, scope), v = t => t.map(e);
            if (item.type === "repeat") {
                const lo=e(item.lower), hi=e(item.upper);
                if (!Number.isInteger(lo)||!Number.isInteger(hi)||Math.abs(hi-lo)>999) throw Error("Repeat bounds must be integers spanning at most 1000 values");
                const step=hi>=lo?1:-1;
                for(let i=lo;step>0?i<=hi:i>=hi;i+=step) visit(item.child,{...scope,[item.variable]:i});
                return;
            }
            const style={...item,lw:e(item.lw),alpha:e(item.alpha)};
            if (!Number.isFinite(style.lw)||style.lw<=0||!Number.isFinite(style.alpha)) throw Error("Invalid width or opacity");
            style.alpha=Math.max(0,Math.min(1,style.alpha));
            const push = object => result.push({...style,...object});
            if (["prism","pyramid"].includes(item.type)) {
                let base;
                if(item.base) base=item.base.map(v);
                else {
                    const c=v(item.center),r=e(item.radius),n=e(item.sides),rotation=e(item.rotation);
                    if(!Number.isInteger(n)||n<3||n>200||!(r>0)) throw Error("Regular bases need 3–200 sides and positive radius");
                    base=Array.from({length:n},(_,i)=>add(c,[r*Math.cos(rotation+2*Math.PI*i/n),r*Math.sin(rotation+2*Math.PI*i/n),0]));
                }
                const top=item.type==='prism'?base.map(p=>add(p,v(item.extrusion))):[v(item.apex)];
                if(![...base,...top].flat().every(Number.isFinite)) throw Error("Undefined solid");
                const sides=base.map((p,i)=>item.type==='prism'?[p,base[(i+1)%base.length],top[(i+1)%base.length],top[i]]:[p,base[(i+1)%base.length],top[0]]);
                const edges=[...base.map((p,i)=>[p,base[(i+1)%base.length]]),...base.map((p,i)=>[p,top[item.type==='prism'?i:0]])];
                if(item.type==='prism') {edges.push(...top.map((p,i)=>[p,top[(i+1)%top.length]]));push({type:'mesh',faces:[base,top,...sides],edges});}
                else {
                    if(item.baseColor) push({type:'mesh',faces:[base],edges:[],color:item.baseColor});
                    if(item.sideColor) push({type:'mesh',faces:sides,edges:[],color:item.sideColor});
                    push({type:'mesh',faces:[],edges});
                }
            } else if(item.type==='normal-segment') {
                let a,b,tangents=[];
                if(item.point1) {
                    const p=v(item.point1),q=v(item.point2),u=unit(v(item.direction1)),w=unit(v(item.direction2)),d=sub(p,q),c=dot(u,w),den=1-c*c;
                    if(den<EPS) {a=p;b=add(q,scale(w,dot(d,w)));}
                    else {const t=(c*dot(w,d)-dot(u,d))/den;a=add(p,scale(u,t));b=add(q,scale(w,dot(w,sub(a,q))));}
                    tangents=[u,w];
                } else {
                    a=v(item.point);
                    const coeff=item.coefficients?v(item.coefficients):[...v(item.normal),-dot(v(item.normal),v(item.planePoint))];
                    const n=coeff.slice(0,3);unit(n);b=sub(a,scale(n,(dot(n,a)+coeff[3])/dot(n,n)));tangents=[null,perpendicular(unit(n))];
                }
                if(![...a,...b].every(Number.isFinite)) throw Error("Undefined normal segment");
                push({type:'line-segment',points:[a,b]});
                if(item.endpointPoints) for(const p of [a,b])push({type:'point',points:[p],color:item.endpointColor});
                if(item.rightAngles&&norm(sub(a,b))>EPS) [a,b].forEach((p,i)=>{
                    if(!tangents[i])return;
                    const r=Math.min(e(item.markerSize),norm(sub(a,b))/3);
                    if(!(r>0))return;
                    const u=scale(tangents[i],r),w=scale(unit(sub(i===0?b:a,p)),r);
                    // Always solid: a right-angle marker shouldn't inherit the segment's own linestyle.
                    push({type:'right-angle',points:[add(p,u),add(add(p,u),w),add(p,w)],color:item.markerColor,style:'solid'});
                });
            } else if(item.type==='solid-of-revolution') {
                const [lo,hi]=v(item.range),rings=[];
                for(let i=0;i<item.samples;i++) {
                    const x=lo+(hi-lo)*i/(item.samples-1),r=Math.abs(evaluate(item.expression,{...scope,x}));
                    rings.push(Number.isFinite(x)&&Number.isFinite(r)&&r>=0?Array.from({length:item.radialSamples},(_,j)=>[x,r*Math.cos(2*Math.PI*j/item.radialSamples),r*Math.sin(2*Math.PI*j/item.radialSamples)]):null);
                }
                const faces=[];
                for(let i=1;i<rings.length;i++)if(rings[i-1]&&rings[i])for(let j=0;j<item.radialSamples;j++){const k=(j+1)%item.radialSamples;faces.push([rings[i-1][j],rings[i-1][k],rings[i][k],rings[i][j]]);}
                if(!faces.length)throw Error("Undefined surface");
                push({type:'mesh',faces,edges:[]});
            } else if(item.type==='circle') {
                const center=v(item.center), radius=e(item.radius);
                const coeff=item.coefficients?v(item.coefficients):[...v(item.normal),-dot(v(item.normal),v(item.planePoint))];
                if(!(radius>EPS)||!(norm(coeff.slice(0,3))>EPS)) throw Error("Undefined circle");
                const points=planeSphereCircle(coeff,center,radius);
                if(!points) throw Error("The plane does not intersect the sphere");
                push({type:'circle',points});
            } else {
                const points=geometry(item,scope,scene.ranges);
                if(!points.some(p=>p.every(Number.isFinite))) throw Error("Undefined object or outside the viewing box");
                const extra={points};
                if(item.type==='sphere')extra.radius=e(item.radius);
                if(item.type==='text') {
                    extra.fontsize=e(item.fontsize);
                    extra.text=item.text.replace(/\{([A-Za-z]\w*)(?::\.(\d{1,2})f)?\}/g,(all,name,digits)=>Object.hasOwn(scope,name)?(digits===undefined?String(Number(scope[name].toPrecision(6))):scope[name].toFixed(Math.min(12,+digits))):all);
                }
                push(extra);
            }
        }
        for(const item of scene.primitives) {
            try {visit(item,vars);} catch(error) {errors.push(error.message);}
            if(budget<0)break;
        }
        // Opt-in (auto-intersections: true) so existing scenes that combine a plane and a
        // sphere without meaning to show an intersection don't suddenly grow a circle.
        // Top-level primitives only; planes/spheres produced by `repeat` are not considered.
        if(scene.autoIntersections) {
            const e=t=>evaluate(t,vars), v=t=>t.map(e);
            const planes=scene.primitives.filter(p=>p.type==='plane');
            const spheres=scene.primitives.filter(p=>p.type==='sphere');
            for(const plane of planes)for(const sphere of spheres) {
                try {
                    const center=v(sphere.center), radius=e(sphere.radius);
                    const coeff=plane.coefficients?v(plane.coefficients):[...v(plane.normal),-dot(v(plane.normal),v(plane.point))];
                    const points=planeSphereCircle(coeff,center,radius);
                    if(points)result.push({type:'circle',color:'#555555',lw:1.2,alpha:1,style:'dashed',hiddenEdges:'off',points});
                } catch(_) {}
            }
        }
        if(scene.axis) for(let i=0;i<3;i++) {
            const p=n=>[0,0,0].map((_,j)=>i===j?n:0),style={color:'#555555',lw:1.2,hiddenEdges:'dashed'};
            result.push({...style,type:'vector',points:scene.ranges[i].map(p)});
            if(scene.labels[i].toLowerCase()!=='none') {
                // Push the label past the tip, clear of the arrowhead cone drawn there.
                const tip=scene.ranges[i][1]+(scene.ranges[i][1]-scene.ranges[i][0])*.08;
                result.push({...style,type:'text',points:[p(tip)],text:scene.labels[i],fontsize:scene.fontsize});
            }
            if(scene.ticks[i])for(const t of ticks(...scene.ranges[i],scene.steps[i])) {
                const a=p(t),b=p(t),anchor=p(t),j=(i+1)%3;a[j]-=.06;b[j]+=.06;anchor[j]-=.18;
                result.push({...style,type:'line-segment',points:[a,b]},{...style,type:'text',points:[anchor],text:String(Number(t.toPrecision(6))),fontsize:scene.fontsize*.85});
            }
        }
        if(scene.grid)for(let i=0;i<2;i++)for(const t of ticks(...scene.ranges[i],scene.steps[i],true)) {
            const a=[0,0,0],b=[0,0,0],j=1-i;a[i]=b[i]=t;a[j]=scene.ranges[j][0];b[j]=scene.ranges[j][1];
            result.push({type:'line-segment',points:[a,b],color:'#888888',lw:1,style:'dotted',hiddenEdges:'off'});
        }
        return {items:result,errors};
    }
    const api = {evaluate,geometry,objects,ticks,clippedLine,planePolygon,add,sub,dot};
    if (typeof module !== "undefined" && module.exports) module.exports = api;
    else root.MunchScene3D = api;
})(typeof window !== "undefined" ? window : globalThis);
