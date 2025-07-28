import{s as $,j as t}from"./transform.CQYUHLBW.js";import{r as p,R as E}from"./index.6otl1p8d.js";import{b as L}from"./band.I6G4Dy9h.js";import{l as N,a as R,b as S}from"./linear.CqDOAHnf.js";import{l as B}from"./line.DxvwD7dX.js";import{m as z}from"./monotone.KI2q-aQs.js";import{R as T}from"./client.CYppr8Nd.js";const u=[{serotype:"AAV2",name:"Original",targets:["Liver","Eye","Brain"],efficiency:60,color:"#DA291C",improvements:["First FDA-approved","Well-characterized"],clinicalUse:"Inherited blindness (Luxturna)"},{serotype:"AAV8",name:"Liver Specialist",targets:["Liver"],efficiency:85,color:"#4A90E2",improvements:["High liver tropism","Low immunogenicity"],clinicalUse:"Hemophilia gene therapy"},{serotype:"AAV9",name:"CNS Explorer",targets:["Brain","Spinal Cord","Heart"],efficiency:75,color:"#9B59B6",improvements:["Crosses blood-brain barrier","Broad distribution"],clinicalUse:"Spinal muscular atrophy (Zolgensma)"},{serotype:"AAV-PHP.B",name:"Enhanced Brain",targets:["Brain"],efficiency:95,color:"#50C878",improvements:["40x better brain targeting","Engineered capsid"],clinicalUse:"Experimental - neurodegenerative diseases"},{serotype:"AAV-CAR",name:"Ramon's CAR-T",targets:["T Cells","Immune System"],efficiency:90,color:"#FFD93D",improvements:["Direct in-vivo CAR-T generation","Cost-effective","Safer"],clinicalUse:"Next-gen cancer immunotherapy"}],b=[{organ:"Brain",x:300,y:100,radius:60,targetingData:[{serotype:"AAV2",efficiency:30},{serotype:"AAV9",efficiency:75},{serotype:"AAV-PHP.B",efficiency:95}]},{organ:"Liver",x:350,y:250,radius:70,targetingData:[{serotype:"AAV2",efficiency:60},{serotype:"AAV8",efficiency:85},{serotype:"AAV9",efficiency:40}]},{organ:"Heart",x:250,y:230,radius:50,targetingData:[{serotype:"AAV2",efficiency:20},{serotype:"AAV9",efficiency:70}]},{organ:"Eye",x:280,y:80,radius:30,targetingData:[{serotype:"AAV2",efficiency:80},{serotype:"AAV8",efficiency:10}]},{organ:"T Cells",x:200,y:350,radius:45,targetingData:[{serotype:"AAV-CAR",efficiency:90}]}];function M(){const[n,j]=p.useState(null),[f,w]=p.useState(!1),[h,V]=p.useState([]),A=p.useRef(null),v=p.useRef(null);p.useEffect(()=>{if(!A.current)return;const r=$(A.current);r.selectAll("*").remove();const e=600,m=450,g=`
      M ${e/2} 50
      Q ${e/2-50} 100 ${e/2-30} 150
      L ${e/2-40} 300
      Q ${e/2-45} 350 ${e/2-60} 400
      L ${e/2-40} 430
      L ${e/2-30} 430
      L ${e/2-20} 380
      L ${e/2} 350
      L ${e/2+20} 380
      L ${e/2+30} 430
      L ${e/2+40} 430
      L ${e/2+60} 400
      Q ${e/2+45} 350 ${e/2+40} 300
      L ${e/2+30} 150
      Q ${e/2+50} 100 ${e/2} 50
    `;r.append("path").attr("d",g).attr("fill","none").attr("stroke","#ddd").attr("stroke-width",2);const d=r.selectAll(".organ").data(b).enter().append("g").attr("class","organ").attr("transform",c=>`translate(${c.x}, ${c.y})`);d.append("circle").attr("r",c=>c.radius).attr("fill","#f0f0f0").attr("stroke","#999").attr("stroke-width",2),d.append("text").attr("text-anchor","middle").attr("dy","0.35em").style("font-size","14px").style("font-weight","bold").text(c=>c.organ),n&&(d.each(function(a){const o=a.targetingData.find(l=>l.serotype===n.serotype);if(o){const l=$(this);l.append("circle").attr("r",a.radius).attr("fill",n.color).attr("opacity",o.efficiency/100*.7).style("mix-blend-mode","multiply"),l.append("text").attr("dy",a.radius+20).attr("text-anchor","middle").style("font-size","12px").style("font-weight","bold").style("fill",n.color).text(`${o.efficiency}%`)}}),b.filter(a=>n.targets.includes(a.organ)&&a.targetingData.some(o=>o.serotype===n.serotype)).forEach(a=>{const o=e/2,l=m-50;r.append("path").attr("d",`M ${o} ${l} Q ${(o+a.x)/2} ${(l+a.y)/2-50} ${a.x} ${a.y}`).attr("fill","none").attr("stroke",n.color).attr("stroke-width",3).attr("opacity",.6).attr("stroke-dasharray","5,5").style("animation","dash 2s linear infinite")}))},[n]),p.useEffect(()=>{if(!v.current||!f)return;const r=$(v.current);r.selectAll("*").remove();const e={top:40,right:120,bottom:60,left:60},m=600-e.left-e.right,g=300-e.top-e.bottom,d=r.append("g").attr("transform",`translate(${e.left},${e.top})`),c=h.length>0?u.filter(s=>h.includes(s.serotype)):u,a=L().domain(b.map(s=>s.organ)).range([0,m]).padding(.1),o=N().domain([0,100]).range([g,0]);d.append("g").attr("transform",`translate(0,${g})`).call(R(a)),d.append("g").call(S(o)).append("text").attr("transform","rotate(-90)").attr("y",-40).attr("x",-g/2).attr("text-anchor","middle").style("fill","black").text("Targeting Efficiency (%)"),c.forEach(s=>{const y=b.map(i=>{const C=i.targetingData.find(D=>D.serotype===s.serotype)?.efficiency||0;return{organ:i.organ,efficiency:C}}).filter(i=>i.efficiency>0),x=B().x(i=>a(i.organ)+a.bandwidth()/2).y(i=>o(i.efficiency)).curve(z);d.append("path").datum(y).attr("fill","none").attr("stroke",s.color).attr("stroke-width",3).attr("d",x),d.selectAll(`.point-${s.serotype}`).data(y).enter().append("circle").attr("cx",i=>a(i.organ)+a.bandwidth()/2).attr("cy",i=>o(i.efficiency)).attr("r",6).attr("fill",s.color).attr("stroke","white").attr("stroke-width",2)});const l=r.append("g").attr("transform",`translate(${m+e.left+20}, ${e.top})`);c.forEach((s,y)=>{const x=l.append("g").attr("transform",`translate(0, ${y*25})`);x.append("rect").attr("width",18).attr("height",18).attr("fill",s.color),x.append("text").attr("x",25).attr("y",9).attr("dy","0.35em").style("font-size","12px").text(s.serotype)})},[f,h]);const k=r=>{V(e=>e.includes(r)?e.filter(m=>m!==r):[...e,r])};return t.jsxs("div",{className:"gene-therapy-container",children:[t.jsx("h2",{children:"AAV Vector Targeting: Precision Gene Delivery"}),t.jsxs("div",{className:"vector-selector",children:[t.jsx("h3",{children:"Select an AAV Vector"}),t.jsx("div",{className:"vector-grid",children:u.map(r=>t.jsxs("div",{className:`vector-card ${n?.serotype===r.serotype?"selected":""}`,onClick:()=>j(r),children:[t.jsxs("div",{className:"vector-header",style:{backgroundColor:r.color},children:[t.jsx("h4",{children:r.serotype}),t.jsx("span",{children:r.name})]}),t.jsxs("div",{className:"vector-content",children:[t.jsxs("p",{className:"efficiency",children:["Avg. Efficiency: ",r.efficiency,"%"]}),t.jsx("p",{className:"clinical-use",children:r.clinicalUse})]})]},r.serotype))})]}),t.jsxs("div",{className:"visualization-area",children:[t.jsxs("div",{className:"body-map",children:[t.jsx("h3",{children:"Organ Targeting Map"}),t.jsx("svg",{ref:A,width:"600",height:"450"}),n&&t.jsxs("div",{className:"vector-info",children:[t.jsxs("h4",{children:[n.serotype," - ",n.name]}),t.jsx("p",{children:t.jsx("strong",{children:"Improvements:"})}),t.jsx("ul",{children:n.improvements.map((r,e)=>t.jsx("li",{children:r},e))})]})]}),t.jsxs("div",{className:"comparison-section",children:[t.jsxs("div",{className:"comparison-header",children:[t.jsx("h3",{children:"Vector Comparison"}),t.jsx("button",{className:"toggle-comparison",onClick:()=>w(!f),children:f?"Hide Comparison":"Show Comparison"})]}),f&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"comparison-controls",children:u.map(r=>t.jsxs("label",{children:[t.jsx("input",{type:"checkbox",checked:h.includes(r.serotype),onChange:()=>k(r.serotype)}),t.jsx("span",{style:{color:r.color},children:r.serotype})]},r.serotype))}),t.jsx("svg",{ref:v,width:"600",height:"300"})]})]})]}),t.jsx("style",{children:`
        .gene-therapy-container {
          margin: 2rem 0;
        }

        .vector-selector {
          margin-bottom: 2rem;
        }

        .vector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .vector-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
        }

        .vector-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .vector-card.selected {
          border-width: 3px;
          border-color: #333;
        }

        .vector-header {
          padding: 1rem;
          color: white;
          text-align: center;
        }

        .vector-header h4 {
          margin: 0;
          font-size: 1.2rem;
        }

        .vector-header span {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .vector-content {
          padding: 1rem;
          background: #f9f9f9;
        }

        .efficiency {
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .clinical-use {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.4;
        }

        .visualization-area {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }

        .body-map {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .vector-info {
          margin-top: 1rem;
          padding: 1rem;
          background: #f0f0f0;
          border-radius: 4px;
        }

        .vector-info h4 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        .vector-info ul {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .comparison-section {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .toggle-comparison {
          background: #4A90E2;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle-comparison:hover {
          background: #357ABD;
        }

        .comparison-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .comparison-controls label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }


        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }

        @media (max-width: 768px) {
          .visualization-area {
            grid-template-columns: 1fr;
          }
        }
      `})]})}document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("gene-therapy-root");n&&T.createRoot(n).render(E.createElement(M))});
