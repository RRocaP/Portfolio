import{s as g,j as e}from"./transform.CQYUHLBW.js";import{r as y,R as D,a as j}from"./client.D1U2EYe0.js";import{l as A,a as u,f as I,b as S}from"./linear.CqDOAHnf.js";import{b as F,o as z}from"./band.I6G4Dy9h.js";const f=[{antibiotic:"Penicillin",yearIntroduced:1942,yearResistanceDetected:1942,category:"Beta-lactam",description:"First widely used antibiotic",impact:"Resistance detected in the same year as introduction"},{antibiotic:"Streptomycin",yearIntroduced:1946,yearResistanceDetected:1946,category:"Aminoglycoside",description:"First antibiotic for tuberculosis",impact:"Resistance emerged immediately"},{antibiotic:"Tetracycline",yearIntroduced:1952,yearResistanceDetected:1959,category:"Tetracycline",description:"Broad-spectrum antibiotic",impact:"7 years to resistance"},{antibiotic:"Methicillin",yearIntroduced:1960,yearResistanceDetected:1962,category:"Beta-lactam",description:"Developed to combat penicillin resistance",impact:"MRSA emerged in just 2 years"},{antibiotic:"Vancomycin",yearIntroduced:1972,yearResistanceDetected:1988,category:"Glycopeptide",description:"Last-resort antibiotic",impact:"16 years to resistance, now widespread"},{antibiotic:"Fluoroquinolones",yearIntroduced:1985,yearResistanceDetected:1990,category:"Quinolone",description:"Synthetic broad-spectrum",impact:"5 years to resistance"},{antibiotic:"Daptomycin",yearIntroduced:2003,yearResistanceDetected:2004,category:"Lipopeptide",description:"Novel mechanism of action",impact:"Resistance in 1 year"},{antibiotic:"Ceftaroline",yearIntroduced:2010,yearResistanceDetected:2011,category:"Cephalosporin",description:"5th generation cephalosporin",impact:"Resistance detected within a year"}];function B(){const o=y.useRef(null),[a,w]=y.useState(null),[c,v]=y.useState({width:1e3,height:600});return y.useEffect(()=>{const s=()=>{if(o.current?.parentElement){const{width:i}=o.current.parentElement.getBoundingClientRect();v({width:Math.min(i-40,1e3),height:600})}};return s(),window.addEventListener("resize",s),()=>window.removeEventListener("resize",s)},[]),y.useEffect(()=>{if(!o.current)return;const s=g(o.current);s.selectAll("*").remove();const i={top:80,right:120,bottom:80,left:80},b=c.width-i.left-i.right,m=c.height-i.top-i.bottom,l=s.append("g").attr("transform",`translate(${i.left},${i.top})`),r=A().domain([1940,2025]).range([0,b]),n=F().domain(f.map(t=>t.antibiotic)).range([0,m]).padding(.3),p=z().domain(Array.from(new Set(f.map(t=>t.category)))).range(["#DA291C","#FFD93D","#4A90E2","#50C878","#FF6B6B","#9B59B6","#E67E22"]);l.append("g").attr("class","grid").attr("transform",`translate(0,${m})`).call(u(r).tickSize(-m).tickFormat(()=>"")).style("stroke-dasharray","3,3").style("opacity",.3),l.append("g").attr("transform",`translate(0,${m})`).call(u(r).tickFormat(I("d")).ticks(10)).selectAll("text").attr("fill","var(--secondary, #666)").style("font-family","Inter, -apple-system, BlinkMacSystemFont, sans-serif").style("font-size","12px").append("text").attr("x",b/2).attr("y",50).attr("fill","var(--primary, #333)").style("text-anchor","middle").style("font-size","14px").style("font-family","Inter, -apple-system, BlinkMacSystemFont, sans-serif").style("font-weight","500").text("Year"),l.append("g").call(S(n)).selectAll("text").attr("fill","var(--secondary, #666)").style("font-family","Inter, -apple-system, BlinkMacSystemFont, sans-serif").style("font-size","12px");const h=l.selectAll(".timeline-bar").data(f).enter().append("g").attr("class","timeline-bar");h.append("rect").attr("x",t=>r(t.yearIntroduced)).attr("y",t=>n(t.antibiotic)).attr("width",t=>Math.max(0,r(t.yearResistanceDetected)-r(t.yearIntroduced))).attr("height",n.bandwidth()).attr("fill",t=>p(t.category)).attr("opacity",.8).attr("rx",4).style("cursor","pointer").on("mouseover",function(t,d){g(this).attr("opacity",1),w(d)}).on("mouseout",function(){g(this).attr("opacity",.8)}),h.append("rect").attr("x",t=>r(t.yearResistanceDetected)).attr("y",t=>n(t.antibiotic)).attr("width",t=>r(2025)-r(t.yearResistanceDetected)).attr("height",n.bandwidth()).attr("fill",t=>p(t.category)).attr("opacity",.3).attr("rx",4).style("stroke",t=>p(t.category)).style("stroke-width",2).style("stroke-dasharray","5,5"),h.append("circle").attr("cx",t=>r(t.yearIntroduced)).attr("cy",t=>n(t.antibiotic)+n.bandwidth()/2).attr("r",6).attr("fill","white").attr("stroke",t=>p(t.category)).attr("stroke-width",3),h.append("text").attr("x",t=>r(t.yearResistanceDetected)).attr("y",t=>n(t.antibiotic)+n.bandwidth()/2).attr("dy","0.35em").attr("text-anchor","middle").style("font-size","20px").style("fill","#DA291C").text("⚠"),s.append("text").attr("x",c.width/2).attr("y",30).attr("text-anchor","middle").attr("fill","var(--primary, #333)").style("font-size","24px").style("font-weight","600").style("font-family","Inter, -apple-system, BlinkMacSystemFont, sans-serif").text("The Race Against Resistance: Antibiotic Timeline");const R=s.append("g").attr("transform",`translate(${c.width-100}, ${i.top})`),k=Array.from(new Set(f.map(t=>t.category)));R.selectAll(".legend-item").data(k).enter().append("g").attr("class","legend-item").attr("transform",(t,d)=>`translate(0, ${d*25})`).each(function(t){const d=g(this);d.append("rect").attr("width",18).attr("height",18).attr("fill",p(t)).attr("rx",3),d.append("text").attr("x",-5).attr("y",9).attr("dy","0.35em").attr("fill","var(--secondary, #666)").style("text-anchor","end").style("font-size","12px").style("font-family","Inter, -apple-system, BlinkMacSystemFont, sans-serif").style("font-weight","400").text(t)});const x=2024;l.append("line").attr("x1",r(x)).attr("y1",0).attr("x2",r(x)).attr("y2",m).attr("stroke","#50C878").attr("stroke-width",3).attr("stroke-dasharray","10,5"),l.append("text").attr("x",r(x)).attr("y",-20).attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold").style("fill","#50C878").text("Next-Gen Solutions →")},[c]),e.jsxs("div",{className:"timeline-container",children:[e.jsx("svg",{ref:o,width:c.width,height:c.height}),a&&e.jsxs("div",{className:"info-panel",children:[e.jsx("h3",{children:a.antibiotic}),e.jsxs("p",{children:[e.jsx("strong",{children:"Category:"})," ",a.category]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Introduced:"})," ",a.yearIntroduced]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Resistance Detected:"})," ",a.yearResistanceDetected]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Time to Resistance:"})," ",a.yearResistanceDetected-a.yearIntroduced," years"]}),e.jsx("p",{children:a.description}),e.jsx("p",{children:e.jsx("em",{children:a.impact})})]}),e.jsxs("div",{className:"solution-box",children:[e.jsx("h3",{children:"Next-Generation Antimicrobial Proteins"}),e.jsx("p",{children:"Engineering proteins with multiple functional domains that:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Target multiple bacterial systems simultaneously"}),e.jsx("li",{children:"Recruit the immune system for enhanced killing"}),e.jsx("li",{children:"Prevent biofilm formation"}),e.jsx("li",{children:"Are customizable for specific infections"})]}),e.jsx("p",{children:"This multi-target approach makes resistance evolution significantly harder for bacteria."})]}),e.jsx("style",{children:`
        .timeline-container {
          position: relative;
          margin: 2rem 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .info-panel {
          position: absolute;
          top: 100px;
          left: 20px;
          background: var(--background, white);
          color: var(--primary, #333);
          border: 1px solid var(--border, #ddd);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 300px;
          z-index: 10;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
        @media (prefers-color-scheme: dark) {
          .info-panel {
            background: rgba(30, 30, 30, 0.95);
            border-color: var(--border, #2a2a2a);
          }
        }
        .info-panel h3 {
          margin: 0 0 0.5rem 0;
          color: var(--accent-red, #DA291C);
          font-weight: 600;
          font-size: 1.1rem;
        }
        .info-panel p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--secondary, #666);
        }
        .info-panel strong {
          color: var(--primary, #333);
          font-weight: 500;
        }
        .solution-box {
          background: linear-gradient(135deg, rgba(80, 200, 120, 0.08) 0%, rgba(255, 217, 61, 0.08) 100%);
          border: 2px solid var(--accent-yellow, #FFD93D);
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
          color: var(--primary, #333);
        }
        .solution-box h3 {
          color: var(--accent-red, #DA291C);
          margin-bottom: 1rem;
          font-weight: 600;
          font-size: 1.2rem;
        }
        .solution-box p {
          color: var(--secondary, #666);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .solution-box ul {
          margin-left: 1.5rem;
          color: var(--secondary, #666);
        }
        .solution-box li {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        @media (prefers-color-scheme: dark) {
          .solution-box {
            background: linear-gradient(135deg, rgba(80, 200, 120, 0.05) 0%, rgba(255, 235, 59, 0.05) 100%);
            border-color: var(--accent-yellow, #ffeb3b);
          }
        }
      `})]})}document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("antimicrobial-timeline-root");o&&D.createRoot(o).render(j.createElement(B))});
