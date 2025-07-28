import{s as j,j as e}from"./transform.CQYUHLBW.js";import{r as m,R as D}from"./index.6otl1p8d.js";import{b as R}from"./band.I6G4Dy9h.js";import{l as E,a as L,b as S}from"./linear.CqDOAHnf.js";import{l as B}from"./line.DxvwD7dX.js";import{m as z}from"./monotone.KI2q-aQs.js";import{R as T}from"./client.CYppr8Nd.js";const u=[{serotype:"AAV2",name:"Original",targets:["Liver","Eye","Brain"],efficiency:60,color:"#DA291C",improvements:["First FDA-approved","Well-characterized"],clinicalUse:"Inherited blindness (Luxturna)"},{serotype:"AAV8",name:"Liver Specialist",targets:["Liver"],efficiency:85,color:"#4A90E2",improvements:["High liver tropism","Low immunogenicity"],clinicalUse:"Hemophilia gene therapy"},{serotype:"AAV9",name:"CNS Explorer",targets:["Brain","Spinal Cord","Heart"],efficiency:75,color:"#9B59B6",improvements:["Crosses blood-brain barrier","Broad distribution"],clinicalUse:"Spinal muscular atrophy (Zolgensma)"},{serotype:"AAV-PHP.B",name:"Enhanced Brain",targets:["Brain"],efficiency:95,color:"#50C878",improvements:["40x better brain targeting","Engineered capsid"],clinicalUse:"Experimental - neurodegenerative diseases"},{serotype:"AAV-CAR",name:"Ramon's CAR-T",targets:["T Cells","Immune System"],efficiency:90,color:"#FFD93D",improvements:["Direct in-vivo CAR-T generation","Cost-effective","Safer"],clinicalUse:"Next-gen cancer immunotherapy"}],v=[{organ:"Brain",x:300,y:100,radius:60,targetingData:[{serotype:"AAV2",efficiency:30},{serotype:"AAV9",efficiency:75},{serotype:"AAV-PHP.B",efficiency:95}]},{organ:"Liver",x:350,y:250,radius:70,targetingData:[{serotype:"AAV2",efficiency:60},{serotype:"AAV8",efficiency:85},{serotype:"AAV9",efficiency:40}]},{organ:"Heart",x:250,y:230,radius:50,targetingData:[{serotype:"AAV2",efficiency:20},{serotype:"AAV9",efficiency:70}]},{organ:"Eye",x:280,y:80,radius:30,targetingData:[{serotype:"AAV2",efficiency:80},{serotype:"AAV8",efficiency:10}]},{organ:"T Cells",x:200,y:350,radius:45,targetingData:[{serotype:"AAV-CAR",efficiency:90}]}];function M(){const[i,$]=m.useState(null),[g,w]=m.useState(!1),[h,N]=m.useState([]),b=m.useRef(null),A=m.useRef(null);m.useEffect(()=>{if(!b.current)return;const r=j(b.current);r.selectAll("*").remove();const t=600,p=450,f=`
      M ${t/2} 50
      Q ${t/2-50} 100 ${t/2-30} 150
      L ${t/2-40} 300
      Q ${t/2-45} 350 ${t/2-60} 400
      L ${t/2-40} 430
      L ${t/2-30} 430
      L ${t/2-20} 380
      L ${t/2} 350
      L ${t/2+20} 380
      L ${t/2+30} 430
      L ${t/2+40} 430
      L ${t/2+60} 400
      Q ${t/2+45} 350 ${t/2+40} 300
      L ${t/2+30} 150
      Q ${t/2+50} 100 ${t/2} 50
    `;r.append("path").attr("d",f).attr("fill","none").attr("stroke","#ddd").attr("stroke-width",2);const d=r.selectAll(".organ").data(v).enter().append("g").attr("class","organ").attr("transform",c=>`translate(${c.x}, ${c.y})`);d.append("circle").attr("r",c=>c.radius).attr("fill","#f0f0f0").attr("stroke","#999").attr("stroke-width",2),d.append("text").attr("text-anchor","middle").attr("dy","0.35em").style("font-size","14px").style("font-weight","bold").text(c=>c.organ),i&&(d.each(function(a){const s=a.targetingData.find(l=>l.serotype===i.serotype);if(s){const l=j(this);l.append("circle").attr("r",a.radius).attr("fill",i.color).attr("opacity",s.efficiency/100*.7).style("mix-blend-mode","multiply"),l.append("text").attr("dy",a.radius+20).attr("text-anchor","middle").style("font-size","12px").style("font-weight","bold").style("fill",i.color).text(`${s.efficiency}%`)}}),v.filter(a=>i.targets.includes(a.organ)&&a.targetingData.some(s=>s.serotype===i.serotype)).forEach(a=>{const s=t/2,l=p-50;r.append("path").attr("d",`M ${s} ${l} Q ${(s+a.x)/2} ${(l+a.y)/2-50} ${a.x} ${a.y}`).attr("fill","none").attr("stroke",i.color).attr("stroke-width",3).attr("opacity",.6).attr("stroke-dasharray","5,5").style("animation","dash 2s linear infinite")}))},[i]),m.useEffect(()=>{if(!A.current||!g)return;const r=j(A.current);r.selectAll("*").remove();const t={top:40,right:120,bottom:60,left:60},p=600-t.left-t.right,f=300-t.top-t.bottom,d=r.append("g").attr("transform",`translate(${t.left},${t.top})`),c=h.length>0?u.filter(o=>h.includes(o.serotype)):u,a=R().domain(v.map(o=>o.organ)).range([0,p]).padding(.1),s=E().domain([0,100]).range([f,0]);d.append("g").attr("transform",`translate(0,${f})`).call(L(a)),d.append("g").call(S(s)).append("text").attr("transform","rotate(-90)").attr("y",-40).attr("x",-f/2).attr("text-anchor","middle").style("fill","black").text("Targeting Efficiency (%)"),c.forEach(o=>{const x=v.map(n=>{const k=n.targetingData.find(C=>C.serotype===o.serotype)?.efficiency||0;return{organ:n.organ,efficiency:k}}).filter(n=>n.efficiency>0),y=B().x(n=>a(n.organ)+a.bandwidth()/2).y(n=>s(n.efficiency)).curve(z);d.append("path").datum(x).attr("fill","none").attr("stroke",o.color).attr("stroke-width",3).attr("d",y),d.selectAll(`.point-${o.serotype}`).data(x).enter().append("circle").attr("cx",n=>a(n.organ)+a.bandwidth()/2).attr("cy",n=>s(n.efficiency)).attr("r",6).attr("fill",o.color).attr("stroke","white").attr("stroke-width",2)});const l=r.append("g").attr("transform",`translate(${p+t.left+20}, ${t.top})`);c.forEach((o,x)=>{const y=l.append("g").attr("transform",`translate(0, ${x*25})`);y.append("rect").attr("width",18).attr("height",18).attr("fill",o.color),y.append("text").attr("x",25).attr("y",9).attr("dy","0.35em").style("font-size","12px").text(o.serotype)})},[g,h]);const V=r=>{N(t=>t.includes(r)?t.filter(p=>p!==r):[...t,r])};return e.jsxs("div",{className:"gene-therapy-container",children:[e.jsx("h2",{children:"AAV Vector Targeting: Precision Gene Delivery"}),e.jsxs("div",{className:"vector-selector",children:[e.jsx("h3",{children:"Select an AAV Vector"}),e.jsx("div",{className:"vector-grid",children:u.map(r=>e.jsxs("div",{className:`vector-card ${i?.serotype===r.serotype?"selected":""}`,onClick:()=>$(r),children:[e.jsxs("div",{className:"vector-header",style:{backgroundColor:r.color},children:[e.jsx("h4",{children:r.serotype}),e.jsx("span",{children:r.name})]}),e.jsxs("div",{className:"vector-content",children:[e.jsxs("p",{className:"efficiency",children:["Avg. Efficiency: ",r.efficiency,"%"]}),e.jsx("p",{className:"clinical-use",children:r.clinicalUse})]})]},r.serotype))})]}),e.jsxs("div",{className:"visualization-area",children:[e.jsxs("div",{className:"body-map",children:[e.jsx("h3",{children:"Organ Targeting Map"}),e.jsx("svg",{ref:b,width:"600",height:"450"}),i&&e.jsxs("div",{className:"vector-info",children:[e.jsxs("h4",{children:[i.serotype," - ",i.name]}),e.jsx("p",{children:e.jsx("strong",{children:"Improvements:"})}),e.jsx("ul",{children:i.improvements.map((r,t)=>e.jsx("li",{children:r},t))})]})]}),e.jsxs("div",{className:"comparison-section",children:[e.jsxs("div",{className:"comparison-header",children:[e.jsx("h3",{children:"Vector Comparison"}),e.jsx("button",{className:"toggle-comparison",onClick:()=>w(!g),children:g?"Hide Comparison":"Show Comparison"})]}),g&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"comparison-controls",children:u.map(r=>e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",checked:h.includes(r.serotype),onChange:()=>V(r.serotype)}),e.jsx("span",{style:{color:r.color},children:r.serotype})]},r.serotype))}),e.jsx("svg",{ref:A,width:"600",height:"300"})]})]})]}),e.jsxs("div",{className:"success-metrics",children:[e.jsx("h3",{children:"Success Rates & Real-World Impact"}),e.jsxs("div",{className:"metrics-grid",children:[e.jsxs("div",{className:"metric-card",children:[e.jsx("div",{className:"metric-value",children:"95%"}),e.jsx("div",{className:"metric-label",children:"SMA Treatment Success"}),e.jsx("div",{className:"metric-detail",children:"Zolgensma (AAV9) - Prevents paralysis in infants"})]}),e.jsxs("div",{className:"metric-card",children:[e.jsx("div",{className:"metric-value",children:"$3.5M → $35K"}),e.jsx("div",{className:"metric-label",children:"Cost Reduction Potential"}),e.jsx("div",{className:"metric-detail",children:"Ramon's in-vivo CAR-T approach"})]}),e.jsxs("div",{className:"metric-card",children:[e.jsx("div",{className:"metric-value",children:"40x"}),e.jsx("div",{className:"metric-label",children:"Improved Brain Delivery"}),e.jsx("div",{className:"metric-detail",children:"AAV-PHP.B vs traditional AAV"})]}),e.jsxs("div",{className:"metric-card",children:[e.jsx("div",{className:"metric-value",children:"1 Dose"}),e.jsx("div",{className:"metric-label",children:"Lifetime Treatment"}),e.jsx("div",{className:"metric-detail",children:"Gene therapy vs daily medication"})]})]})]}),e.jsx("style",{children:`
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

        .success-metrics {
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.05) 0%, rgba(255, 217, 61, 0.05) 100%);
          border-radius: 8px;
          padding: 2rem;
          margin-top: 3rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .metric-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #50C878;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .metric-detail {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.4;
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
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})}document.addEventListener("DOMContentLoaded",()=>{const i=document.getElementById("gene-therapy-root");i&&T.createRoot(i).render(D.createElement(M))});
