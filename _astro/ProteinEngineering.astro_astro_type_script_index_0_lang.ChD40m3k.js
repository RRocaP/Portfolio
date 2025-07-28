import{s as N,j as t}from"./transform.CQYUHLBW.js";import{r as f,R as C}from"./index.6otl1p8d.js";import{l as M}from"./line.DxvwD7dX.js";import{R as P}from"./client.CYppr8Nd.js";function D(e,n,r){e._context.bezierCurveTo(e._x1+e._k*(e._x2-e._x0),e._y1+e._k*(e._y2-e._y0),e._x2+e._k*(e._x1-n),e._y2+e._k*(e._y1-r),e._x2,e._y2)}function z(e,n){this._context=e,this._k=(1-n)/6}z.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:D(this,this._x1,this._y1);break}(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line},point:function(e,n){switch(e=+e,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(e,n):this._context.moveTo(e,n);break;case 1:this._point=2,this._x1=e,this._y1=n;break;case 2:this._point=3;default:D(this,e,n);break}this._x0=this._x1,this._x1=this._x2,this._x2=e,this._y0=this._y1,this._y1=this._y2,this._y2=n}};const R=function e(n){function r(h){return new z(h,n)}return r.tension=function(h){return e(+h)},r}(0),b=[{id:"lytic",name:"Lytic Domain",type:"antimicrobial",function:"Membrane Disruption",color:"#DA291C",size:150,description:"Punches holes in bacterial cell membranes, causing rapid cell death. Derived from bacteriophage endolysins."},{id:"binding",name:"Binding Domain",type:"targeting",function:"Bacterial Recognition",color:"#4A90E2",size:120,description:"Specifically recognizes and binds to bacterial surface markers, ensuring targeted killing."},{id:"immune",name:"Immunomodulatory",type:"immune",function:"Immune Recruitment",color:"#50C878",size:100,description:"Recruits and activates immune cells to the infection site for enhanced bacterial clearance."},{id:"antibiofilm",name:"Anti-biofilm",type:"prevention",function:"Biofilm Disruption",color:"#FFD93D",size:130,description:"Breaks down bacterial biofilms that protect bacteria from antibiotics and immune responses."},{id:"penetrating",name:"Cell Penetrating",type:"delivery",function:"Intracellular Access",color:"#9B59B6",size:90,description:"Allows the protein to enter host cells to kill intracellular bacteria."}],I=[{domains:["lytic","binding","antibiofilm"],name:"BiofilmBuster-1",effectiveness:95,targets:["MRSA","Pseudomonas aeruginosa"]},{domains:["lytic","immune","penetrating"],name:"ImmunoKiller-X",effectiveness:88,targets:["Tuberculosis","Intracellular pathogens"]},{domains:["binding","antibiofilm","immune"],name:"SurfaceGuard-Pro",effectiveness:92,targets:["Medical device infections","Catheter-associated UTIs"]}];function B(){const[e,n]=f.useState([]),[r,h]=f.useState(null),[y,k]=f.useState(null),v=f.useRef(null),j=f.useRef(null);f.useEffect(()=>{if(!v.current)return;const s=N(v.current);s.selectAll("*").remove();const c=400,a=400,g=c/2,o=a/2,x=2*Math.PI/b.length,p=120,u=s.append("g");if(e.length>1){const i=e.map(m=>{const _=b.findIndex(S=>S.id===m)*x-Math.PI/2;return{x:g+p*Math.cos(_),y:o+p*Math.sin(_)}}),d=M().x(m=>m.x).y(m=>m.y).curve(R.tension(.5));u.append("path").datum(i).attr("d",d).attr("fill","none").attr("stroke","#ccc").attr("stroke-width",2).attr("stroke-dasharray","5,5")}const l=u.selectAll(".domain-group").data(b).enter().append("g").attr("class","domain-group").attr("transform",(i,d)=>{const m=d*x-Math.PI/2,w=g+p*Math.cos(m),_=o+p*Math.sin(m);return`translate(${w}, ${_})`}).style("cursor","pointer").on("click",(i,d)=>A(d.id)).on("mouseenter",(i,d)=>k(d.id)).on("mouseleave",()=>k(null));l.append("circle").attr("r",i=>i.size/4).attr("fill",i=>i.color).attr("opacity",i=>e.includes(i.id)?1:.6).attr("stroke",i=>e.includes(i.id)?"#333":"none").attr("stroke-width",3).transition().duration(300).attr("r",i=>y===i.id?i.size/3.5:i.size/4),l.append("text").attr("dy",i=>i.size/4+20).attr("text-anchor","middle").style("font-size","12px").style("font-weight","bold").text(i=>i.name),l.append("text").attr("dy",i=>i.size/4+35).attr("text-anchor","middle").style("font-size","10px").style("fill","#666").text(i=>i.function)},[e,y]),f.useEffect(()=>{if(!j.current||e.length===0)return;const s=N(j.current);s.selectAll("*").remove();const c=600,a=100,g=60,o=20,x=s.append("g").attr("transform",`translate(${(c-(e.length*(a+o)-o))/2}, 70)`);e.forEach((u,l)=>{const i=b.find(d=>d.id===u);l>0&&x.append("rect").attr("x",l*(a+o)-o).attr("y",g/2-5).attr("width",o).attr("height",10).attr("fill","#999"),x.append("rect").attr("x",l*(a+o)).attr("y",0).attr("width",a).attr("height",g).attr("fill",i.color).attr("rx",10).attr("opacity",.8),x.append("text").attr("x",l*(a+o)+a/2).attr("y",g/2).attr("dy","0.35em").attr("text-anchor","middle").style("fill","white").style("font-size","12px").style("font-weight","bold").text(i.name.split(" ")[0])});const p=I.find(u=>u.domains.length===e.length&&u.domains.every(l=>e.includes(l)));h(p||null)},[e]);const A=s=>{n(c=>c.includes(s)?c.filter(a=>a!==s):c.length<4?[...c,s]:c)},E=()=>{n([]),h(null)};return t.jsxs("div",{className:"protein-engineering-container",children:[t.jsxs("div",{className:"controls",children:[t.jsx("h2",{children:"Build Your Modular Antimicrobial Protein"}),t.jsx("p",{children:"Click on domains to assemble them into a custom protein. Different combinations have different effects!"})]}),t.jsxs("div",{className:"visualization-grid",children:[t.jsxs("div",{className:"domain-selector",children:[t.jsx("h3",{children:"Available Domains"}),t.jsx("svg",{ref:v,width:"400",height:"400"}),y&&t.jsx("div",{className:"domain-tooltip",children:b.find(s=>s.id===y)?.description})]}),t.jsxs("div",{className:"protein-assembly",children:[t.jsx("h3",{children:"Assembled Protein"}),t.jsx("svg",{ref:j,width:"600",height:"200"}),e.length>0&&t.jsxs("div",{className:"assembly-info",children:[t.jsxs("p",{children:["Selected domains: ",e.length]}),t.jsx("button",{onClick:E,children:"Reset"})]}),r&&t.jsxs("div",{className:"protein-info",children:[t.jsx("h4",{children:r.name}),t.jsxs("div",{className:"effectiveness-bar",children:[t.jsxs("div",{className:"effectiveness-label",children:["Effectiveness: ",r.effectiveness,"%"]}),t.jsx("div",{className:"bar-container",children:t.jsx("div",{className:"bar-fill",style:{width:`${r.effectiveness}%`}})})]}),t.jsx("p",{children:t.jsx("strong",{children:"Effective against:"})}),t.jsx("ul",{children:r.targets.map(s=>t.jsx("li",{children:s},s))})]})]})]}),t.jsxs("div",{className:"explanation",children:[t.jsx("h3",{children:"How Modular Protein Design Works"}),t.jsxs("div",{className:"steps",children:[t.jsxs("div",{className:"step",children:[t.jsx("span",{className:"step-number",children:"1"}),t.jsx("h4",{children:"Select Functional Domains"}),t.jsx("p",{children:"Each domain has a specific function like membrane disruption or immune recruitment."})]}),t.jsxs("div",{className:"step",children:[t.jsx("span",{className:"step-number",children:"2"}),t.jsx("h4",{children:"AI Predicts Folding"}),t.jsx("p",{children:"Machine learning models predict how the domains will fold together in 3D space."})]}),t.jsxs("div",{className:"step",children:[t.jsx("span",{className:"step-number",children:"3"}),t.jsx("h4",{children:"Express & Test"}),t.jsx("p",{children:"The designed protein is expressed in bacteria and tested against pathogens."})]}),t.jsxs("div",{className:"step",children:[t.jsx("span",{className:"step-number",children:"4"}),t.jsx("h4",{children:"Optimize & Scale"}),t.jsx("p",{children:"Successful designs are optimized for stability and scaled for production."})]})]})]}),t.jsx("style",{children:`
        .protein-engineering-container {
          margin: 2rem 0;
        }
        
        .controls {
          text-align: center;
          margin-bottom: 2rem;
        }

        .visualization-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .domain-selector {
          position: relative;
        }

        .domain-tooltip {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          max-width: 300px;
          text-align: center;
        }

        .protein-assembly {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .assembly-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        .assembly-info button {
          background: #DA291C;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .assembly-info button:hover {
          background: #b01e15;
        }

        .protein-info {
          margin-top: 2rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .protein-info h4 {
          color: #50C878;
          margin-bottom: 1rem;
        }

        .effectiveness-bar {
          margin: 1rem 0;
        }

        .effectiveness-label {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .bar-container {
          width: 100%;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #50C878, #FFD93D);
          transition: width 0.5s ease;
        }

        .protein-info ul {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .explanation {
          background: linear-gradient(135deg, rgba(218, 41, 28, 0.05) 0%, rgba(255, 217, 61, 0.05) 100%);
          border-radius: 8px;
          padding: 2rem;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .step {
          text-align: center;
        }

        .step-number {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: #DA291C;
          color: white;
          border-radius: 50%;
          line-height: 40px;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .step h4 {
          margin: 0.5rem 0;
          color: #333;
        }

        .step p {
          font-size: 0.9rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .visualization-grid {
            grid-template-columns: 1fr;
          }
          
          .steps {
            grid-template-columns: 1fr;
          }
        }
      `})]})}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("protein-engineering-root");e&&P.createRoot(e).render(C.createElement(B))});
