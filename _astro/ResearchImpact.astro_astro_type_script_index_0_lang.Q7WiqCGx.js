import{s as S,d as st,t as ht,j as b}from"./transform.CQYUHLBW.js";import{r as F,R as dt}from"./index.6otl1p8d.js";import{l as J,a as Z,b as q,f as gt}from"./linear.CqDOAHnf.js";import{w as mt,a as pt,c as xt,b as R,x as yt,y as vt,l as lt}from"./line.DxvwD7dX.js";import{m as tt}from"./monotone.KI2q-aQs.js";import{R as bt}from"./client.CYppr8Nd.js";function wt(t,e){let n,a;if(e===void 0)for(const r of t)r!=null&&(n===void 0?r>=r&&(n=a=r):(n>r&&(n=r),a<r&&(a=r)));else{let r=-1;for(let o of t)(o=e(o,++r,t))!=null&&(n===void 0?o>=o&&(n=a=o):(n>o&&(n=o),a<o&&(a=o)))}return[n,a]}function jt(t,e){let n;if(e===void 0)for(const a of t)a!=null&&(n<a||n===void 0&&a>=a)&&(n=a);else{let a=-1;for(let r of t)(r=e(r,++a,t))!=null&&(n<r||n===void 0&&r>=r)&&(n=r)}return n}function Nt(t){let e;for(;e=t.sourceEvent;)t=e;return t}function et(t,e){if(t=Nt(t),e===void 0&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var a=n.createSVGPoint();return a.x=t.clientX,a.y=t.clientY,a=a.matrixTransform(e.getScreenCTM().inverse()),[a.x,a.y]}if(e.getBoundingClientRect){var r=e.getBoundingClientRect();return[t.clientX-r.left-e.clientLeft,t.clientY-r.top-e.clientTop]}}return[t.pageX,t.pageY]}const _t={passive:!1},L={capture:!0,passive:!1};function V(t){t.stopImmediatePropagation()}function P(t){t.preventDefault(),t.stopImmediatePropagation()}function Ct(t){var e=t.document.documentElement,n=S(t).on("dragstart.drag",P,L);"onselectstart"in e?n.on("selectstart.drag",P,L):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function At(t,e){var n=t.document.documentElement,a=S(t).on("dragstart.drag",null);e&&(a.on("click.drag",P,L),setTimeout(function(){a.on("click.drag",null)},0)),"onselectstart"in n?a.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}const B=t=>()=>t;function O(t,{sourceEvent:e,subject:n,target:a,identifier:r,active:o,x:g,y:d,dx:y,dy:i,dispatch:x}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},subject:{value:n,enumerable:!0,configurable:!0},target:{value:a,enumerable:!0,configurable:!0},identifier:{value:r,enumerable:!0,configurable:!0},active:{value:o,enumerable:!0,configurable:!0},x:{value:g,enumerable:!0,configurable:!0},y:{value:d,enumerable:!0,configurable:!0},dx:{value:y,enumerable:!0,configurable:!0},dy:{value:i,enumerable:!0,configurable:!0},_:{value:x}})}O.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};function kt(t){return!t.ctrlKey&&!t.button}function Mt(){return this.parentNode}function zt(t,e){return e??{x:t.x,y:t.y}}function Dt(){return navigator.maxTouchPoints||"ontouchstart"in this}function Et(){var t=kt,e=Mt,n=zt,a=Dt,r={},o=st("start","drag","end"),g=0,d,y,i,x,h=0;function m(s){s.on("mousedown.drag",l).filter(a).on("touchstart.drag",u).on("touchmove.drag",p,_t).on("touchend.drag touchcancel.drag",v).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function l(s,w){if(!(x||!t.call(this,s,w))){var N=j(this,e.call(this,s,w),s,w,"mouse");N&&(S(s.view).on("mousemove.drag",f,L).on("mouseup.drag",c,L),Ct(s.view),V(s),i=!1,d=s.clientX,y=s.clientY,N("start",s))}}function f(s){if(P(s),!i){var w=s.clientX-d,N=s.clientY-y;i=w*w+N*N>h}r.mouse("drag",s)}function c(s){S(s.view).on("mousemove.drag mouseup.drag",null),At(s.view,i),P(s),r.mouse("end",s)}function u(s,w){if(t.call(this,s,w)){var N=s.changedTouches,C=e.call(this,s,w),_=N.length,k,A;for(k=0;k<_;++k)(A=j(this,C,s,w,N[k].identifier,N[k]))&&(V(s),A("start",s,N[k]))}}function p(s){var w=s.changedTouches,N=w.length,C,_;for(C=0;C<N;++C)(_=r[w[C].identifier])&&(P(s),_("drag",s,w[C]))}function v(s){var w=s.changedTouches,N=w.length,C,_;for(x&&clearTimeout(x),x=setTimeout(function(){x=null},500),C=0;C<N;++C)(_=r[w[C].identifier])&&(V(s),_("end",s,w[C]))}function j(s,w,N,C,_,k){var A=o.copy(),M=et(k||N,w),I,E,X;if((X=n.call(s,new O("beforestart",{sourceEvent:N,target:m,identifier:_,active:g,x:M[0],y:M[1],dx:0,dy:0,dispatch:A}),C))!=null)return I=X.x-M[0]||0,E=X.y-M[1]||0,function ut(U,K,ft){var H=M,G;switch(U){case"start":r[_]=ut,G=g++;break;case"end":delete r[_],--g;case"drag":M=et(ft||K,w),G=g;break}A.call(U,s,new O(U,{sourceEvent:K,subject:X,target:m,identifier:_,active:G,x:M[0]+I,y:M[1]+E,dx:M[0]-H[0],dy:M[1]-H[1],dispatch:A}),C)}}return m.filter=function(s){return arguments.length?(t=typeof s=="function"?s:B(!!s),m):t},m.container=function(s){return arguments.length?(e=typeof s=="function"?s:B(s),m):e},m.subject=function(s){return arguments.length?(n=typeof s=="function"?s:B(s),m):n},m.touchable=function(s){return arguments.length?(a=typeof s=="function"?s:B(!!s),m):a},m.on=function(){var s=o.on.apply(o,arguments);return s===o?m:s},m.clickDistance=function(s){return arguments.length?(h=(s=+s)*s,m):Math.sqrt(h)},m}function Rt(t,e){var n,a=1;t==null&&(t=0),e==null&&(e=0);function r(){var o,g=n.length,d,y=0,i=0;for(o=0;o<g;++o)d=n[o],y+=d.x,i+=d.y;for(y=(y/g-t)*a,i=(i/g-e)*a,o=0;o<g;++o)d=n[o],d.x-=y,d.y-=i}return r.initialize=function(o){n=o},r.x=function(o){return arguments.length?(t=+o,r):t},r.y=function(o){return arguments.length?(e=+o,r):e},r.strength=function(o){return arguments.length?(a=+o,r):a},r}function It(t){const e=+this._x.call(null,t),n=+this._y.call(null,t);return ct(this.cover(e,n),e,n,t)}function ct(t,e,n,a){if(isNaN(e)||isNaN(n))return t;var r,o=t._root,g={data:a},d=t._x0,y=t._y0,i=t._x1,x=t._y1,h,m,l,f,c,u,p,v;if(!o)return t._root=g,t;for(;o.length;)if((c=e>=(h=(d+i)/2))?d=h:i=h,(u=n>=(m=(y+x)/2))?y=m:x=m,r=o,!(o=o[p=u<<1|c]))return r[p]=g,t;if(l=+t._x.call(null,o.data),f=+t._y.call(null,o.data),e===l&&n===f)return g.next=o,r?r[p]=g:t._root=g,t;do r=r?r[p]=new Array(4):t._root=new Array(4),(c=e>=(h=(d+i)/2))?d=h:i=h,(u=n>=(m=(y+x)/2))?y=m:x=m;while((p=u<<1|c)===(v=(f>=m)<<1|l>=h));return r[v]=o,r[p]=g,t}function Tt(t){var e,n,a=t.length,r,o,g=new Array(a),d=new Array(a),y=1/0,i=1/0,x=-1/0,h=-1/0;for(n=0;n<a;++n)isNaN(r=+this._x.call(null,e=t[n]))||isNaN(o=+this._y.call(null,e))||(g[n]=r,d[n]=o,r<y&&(y=r),r>x&&(x=r),o<i&&(i=o),o>h&&(h=o));if(y>x||i>h)return this;for(this.cover(y,i).cover(x,h),n=0;n<a;++n)ct(this,g[n],d[n],t[n]);return this}function St(t,e){if(isNaN(t=+t)||isNaN(e=+e))return this;var n=this._x0,a=this._y0,r=this._x1,o=this._y1;if(isNaN(n))r=(n=Math.floor(t))+1,o=(a=Math.floor(e))+1;else{for(var g=r-n||1,d=this._root,y,i;n>t||t>=r||a>e||e>=o;)switch(i=(e<a)<<1|t<n,y=new Array(4),y[i]=d,d=y,g*=2,i){case 0:r=n+g,o=a+g;break;case 1:n=r-g,o=a+g;break;case 2:r=n+g,a=o-g;break;case 3:n=r-g,a=o-g;break}this._root&&this._root.length&&(this._root=d)}return this._x0=n,this._y0=a,this._x1=r,this._y1=o,this}function $t(){var t=[];return this.visit(function(e){if(!e.length)do t.push(e.data);while(e=e.next)}),t}function Pt(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function z(t,e,n,a,r){this.node=t,this.x0=e,this.y0=n,this.x1=a,this.y1=r}function Ft(t,e,n){var a,r=this._x0,o=this._y0,g,d,y,i,x=this._x1,h=this._y1,m=[],l=this._root,f,c;for(l&&m.push(new z(l,r,o,x,h)),n==null?n=1/0:(r=t-n,o=e-n,x=t+n,h=e+n,n*=n);f=m.pop();)if(!(!(l=f.node)||(g=f.x0)>x||(d=f.y0)>h||(y=f.x1)<r||(i=f.y1)<o))if(l.length){var u=(g+y)/2,p=(d+i)/2;m.push(new z(l[3],u,p,y,i),new z(l[2],g,p,u,i),new z(l[1],u,d,y,p),new z(l[0],g,d,u,p)),(c=(e>=p)<<1|t>=u)&&(f=m[m.length-1],m[m.length-1]=m[m.length-1-c],m[m.length-1-c]=f)}else{var v=t-+this._x.call(null,l.data),j=e-+this._y.call(null,l.data),s=v*v+j*j;if(s<n){var w=Math.sqrt(n=s);r=t-w,o=e-w,x=t+w,h=e+w,a=l.data}}return a}function Yt(t){if(isNaN(x=+this._x.call(null,t))||isNaN(h=+this._y.call(null,t)))return this;var e,n=this._root,a,r,o,g=this._x0,d=this._y0,y=this._x1,i=this._y1,x,h,m,l,f,c,u,p;if(!n)return this;if(n.length)for(;;){if((f=x>=(m=(g+y)/2))?g=m:y=m,(c=h>=(l=(d+i)/2))?d=l:i=l,e=n,!(n=n[u=c<<1|f]))return this;if(!n.length)break;(e[u+1&3]||e[u+2&3]||e[u+3&3])&&(a=e,p=u)}for(;n.data!==t;)if(r=n,!(n=n.next))return this;return(o=n.next)&&delete n.next,r?(o?r.next=o:delete r.next,this):e?(o?e[u]=o:delete e[u],(n=e[0]||e[1]||e[2]||e[3])&&n===(e[3]||e[2]||e[1]||e[0])&&!n.length&&(a?a[p]=n:this._root=n),this):(this._root=o,this)}function Lt(t){for(var e=0,n=t.length;e<n;++e)this.remove(t[e]);return this}function Xt(){return this._root}function Bt(){var t=0;return this.visit(function(e){if(!e.length)do++t;while(e=e.next)}),t}function Ut(t){var e=[],n,a=this._root,r,o,g,d,y;for(a&&e.push(new z(a,this._x0,this._y0,this._x1,this._y1));n=e.pop();)if(!t(a=n.node,o=n.x0,g=n.y0,d=n.x1,y=n.y1)&&a.length){var i=(o+d)/2,x=(g+y)/2;(r=a[3])&&e.push(new z(r,i,x,d,y)),(r=a[2])&&e.push(new z(r,o,x,i,y)),(r=a[1])&&e.push(new z(r,i,g,d,x)),(r=a[0])&&e.push(new z(r,o,g,i,x))}return this}function Gt(t){var e=[],n=[],a;for(this._root&&e.push(new z(this._root,this._x0,this._y0,this._x1,this._y1));a=e.pop();){var r=a.node;if(r.length){var o,g=a.x0,d=a.y0,y=a.x1,i=a.y1,x=(g+y)/2,h=(d+i)/2;(o=r[0])&&e.push(new z(o,g,d,x,h)),(o=r[1])&&e.push(new z(o,x,d,y,h)),(o=r[2])&&e.push(new z(o,g,h,x,i)),(o=r[3])&&e.push(new z(o,x,h,y,i))}n.push(a)}for(;a=n.pop();)t(a.node,a.x0,a.y0,a.x1,a.y1);return this}function Vt(t){return t[0]}function Ot(t){return arguments.length?(this._x=t,this):this._x}function Qt(t){return t[1]}function Wt(t){return arguments.length?(this._y=t,this):this._y}function Q(t,e,n){var a=new W(e??Vt,n??Qt,NaN,NaN,NaN,NaN);return t==null?a:a.addAll(t)}function W(t,e,n,a,r,o){this._x=t,this._y=e,this._x0=n,this._y0=a,this._x1=r,this._y1=o,this._root=void 0}function nt(t){for(var e={data:t.data},n=e;t=t.next;)n=n.next={data:t.data};return e}var D=Q.prototype=W.prototype;D.copy=function(){var t=new W(this._x,this._y,this._x0,this._y0,this._x1,this._y1),e=this._root,n,a;if(!e)return t;if(!e.length)return t._root=nt(e),t;for(n=[{source:e,target:t._root=new Array(4)}];e=n.pop();)for(var r=0;r<4;++r)(a=e.source[r])&&(a.length?n.push({source:a,target:e.target[r]=new Array(4)}):e.target[r]=nt(a));return t};D.add=It;D.addAll=Tt;D.cover=St;D.data=$t;D.extent=Pt;D.find=Ft;D.remove=Yt;D.removeAll=Lt;D.root=Xt;D.size=Bt;D.visit=Ut;D.visitAfter=Gt;D.x=Ot;D.y=Wt;function $(t){return function(){return t}}function T(t){return(t()-.5)*1e-6}function Kt(t){return t.x+t.vx}function Ht(t){return t.y+t.vy}function Jt(t){var e,n,a,r=1,o=1;typeof t!="function"&&(t=$(t==null?1:+t));function g(){for(var i,x=e.length,h,m,l,f,c,u,p=0;p<o;++p)for(h=Q(e,Kt,Ht).visitAfter(d),i=0;i<x;++i)m=e[i],c=n[m.index],u=c*c,l=m.x+m.vx,f=m.y+m.vy,h.visit(v);function v(j,s,w,N,C){var _=j.data,k=j.r,A=c+k;if(_){if(_.index>m.index){var M=l-_.x-_.vx,I=f-_.y-_.vy,E=M*M+I*I;E<A*A&&(M===0&&(M=T(a),E+=M*M),I===0&&(I=T(a),E+=I*I),E=(A-(E=Math.sqrt(E)))/E*r,m.vx+=(M*=E)*(A=(k*=k)/(u+k)),m.vy+=(I*=E)*A,_.vx-=M*(A=1-A),_.vy-=I*A)}return}return s>l+A||N<l-A||w>f+A||C<f-A}}function d(i){if(i.data)return i.r=n[i.data.index];for(var x=i.r=0;x<4;++x)i[x]&&i[x].r>i.r&&(i.r=i[x].r)}function y(){if(e){var i,x=e.length,h;for(n=new Array(x),i=0;i<x;++i)h=e[i],n[h.index]=+t(h,i,e)}}return g.initialize=function(i,x){e=i,a=x,y()},g.iterations=function(i){return arguments.length?(o=+i,g):o},g.strength=function(i){return arguments.length?(r=+i,g):r},g.radius=function(i){return arguments.length?(t=typeof i=="function"?i:$(+i),y(),g):t},g}function Zt(t){return t.index}function rt(t,e){var n=t.get(e);if(!n)throw new Error("node not found: "+e);return n}function qt(t){var e=Zt,n=h,a,r=$(30),o,g,d,y,i,x=1;t==null&&(t=[]);function h(u){return 1/Math.min(d[u.source.index],d[u.target.index])}function m(u){for(var p=0,v=t.length;p<x;++p)for(var j=0,s,w,N,C,_,k,A;j<v;++j)s=t[j],w=s.source,N=s.target,C=N.x+N.vx-w.x-w.vx||T(i),_=N.y+N.vy-w.y-w.vy||T(i),k=Math.sqrt(C*C+_*_),k=(k-o[j])/k*u*a[j],C*=k,_*=k,N.vx-=C*(A=y[j]),N.vy-=_*A,w.vx+=C*(A=1-A),w.vy+=_*A}function l(){if(g){var u,p=g.length,v=t.length,j=new Map(g.map((w,N)=>[e(w,N,g),w])),s;for(u=0,d=new Array(p);u<v;++u)s=t[u],s.index=u,typeof s.source!="object"&&(s.source=rt(j,s.source)),typeof s.target!="object"&&(s.target=rt(j,s.target)),d[s.source.index]=(d[s.source.index]||0)+1,d[s.target.index]=(d[s.target.index]||0)+1;for(u=0,y=new Array(v);u<v;++u)s=t[u],y[u]=d[s.source.index]/(d[s.source.index]+d[s.target.index]);a=new Array(v),f(),o=new Array(v),c()}}function f(){if(g)for(var u=0,p=t.length;u<p;++u)a[u]=+n(t[u],u,t)}function c(){if(g)for(var u=0,p=t.length;u<p;++u)o[u]=+r(t[u],u,t)}return m.initialize=function(u,p){g=u,i=p,l()},m.links=function(u){return arguments.length?(t=u,l(),m):t},m.id=function(u){return arguments.length?(e=u,m):e},m.iterations=function(u){return arguments.length?(x=+u,m):x},m.strength=function(u){return arguments.length?(n=typeof u=="function"?u:$(+u),f(),m):n},m.distance=function(u){return arguments.length?(r=typeof u=="function"?u:$(+u),c(),m):r},m}const te=1664525,ee=1013904223,it=4294967296;function ne(){let t=1;return()=>(t=(te*t+ee)%it)/it}function re(t){return t.x}function ie(t){return t.y}var ae=10,oe=Math.PI*(3-Math.sqrt(5));function se(t){var e,n=1,a=.001,r=1-Math.pow(a,1/300),o=0,g=.6,d=new Map,y=ht(h),i=st("tick","end"),x=ne();t==null&&(t=[]);function h(){m(),i.call("tick",e),n<a&&(y.stop(),i.call("end",e))}function m(c){var u,p=t.length,v;c===void 0&&(c=1);for(var j=0;j<c;++j)for(n+=(o-n)*r,d.forEach(function(s){s(n)}),u=0;u<p;++u)v=t[u],v.fx==null?v.x+=v.vx*=g:(v.x=v.fx,v.vx=0),v.fy==null?v.y+=v.vy*=g:(v.y=v.fy,v.vy=0);return e}function l(){for(var c=0,u=t.length,p;c<u;++c){if(p=t[c],p.index=c,p.fx!=null&&(p.x=p.fx),p.fy!=null&&(p.y=p.fy),isNaN(p.x)||isNaN(p.y)){var v=ae*Math.sqrt(.5+c),j=c*oe;p.x=v*Math.cos(j),p.y=v*Math.sin(j)}(isNaN(p.vx)||isNaN(p.vy))&&(p.vx=p.vy=0)}}function f(c){return c.initialize&&c.initialize(t,x),c}return l(),e={tick:m,restart:function(){return y.restart(h),e},stop:function(){return y.stop(),e},nodes:function(c){return arguments.length?(t=c,l(),d.forEach(f),e):t},alpha:function(c){return arguments.length?(n=+c,e):n},alphaMin:function(c){return arguments.length?(a=+c,e):a},alphaDecay:function(c){return arguments.length?(r=+c,e):+r},alphaTarget:function(c){return arguments.length?(o=+c,e):o},velocityDecay:function(c){return arguments.length?(g=1-c,e):1-g},randomSource:function(c){return arguments.length?(x=c,d.forEach(f),e):x},force:function(c,u){return arguments.length>1?(u==null?d.delete(c):d.set(c,f(u)),e):d.get(c)},find:function(c,u,p){var v=0,j=t.length,s,w,N,C,_;for(p==null?p=1/0:p*=p,v=0;v<j;++v)C=t[v],s=c-C.x,w=u-C.y,N=s*s+w*w,N<p&&(_=C,p=N);return _},on:function(c,u){return arguments.length>1?(i.on(c,u),e):i.on(c)}}}function le(){var t,e,n,a,r=$(-30),o,g=1,d=1/0,y=.81;function i(l){var f,c=t.length,u=Q(t,re,ie).visitAfter(h);for(a=l,f=0;f<c;++f)e=t[f],u.visit(m)}function x(){if(t){var l,f=t.length,c;for(o=new Array(f),l=0;l<f;++l)c=t[l],o[c.index]=+r(c,l,t)}}function h(l){var f=0,c,u,p=0,v,j,s;if(l.length){for(v=j=s=0;s<4;++s)(c=l[s])&&(u=Math.abs(c.value))&&(f+=c.value,p+=u,v+=u*c.x,j+=u*c.y);l.x=v/p,l.y=j/p}else{c=l,c.x=c.data.x,c.y=c.data.y;do f+=o[c.data.index];while(c=c.next)}l.value=f}function m(l,f,c,u){if(!l.value)return!0;var p=l.x-e.x,v=l.y-e.y,j=u-f,s=p*p+v*v;if(j*j/y<s)return s<d&&(p===0&&(p=T(n),s+=p*p),v===0&&(v=T(n),s+=v*v),s<g&&(s=Math.sqrt(g*s)),e.vx+=p*l.value*a/s,e.vy+=v*l.value*a/s),!0;if(l.length||s>=d)return;(l.data!==e||l.next)&&(p===0&&(p=T(n),s+=p*p),v===0&&(v=T(n),s+=v*v),s<g&&(s=Math.sqrt(g*s)));do l.data!==e&&(j=o[l.data.index]*a/s,e.vx+=p*j,e.vy+=v*j);while(l=l.next)}return i.initialize=function(l,f){t=l,n=f,x()},i.strength=function(l){return arguments.length?(r=typeof l=="function"?l:$(+l),x(),i):r},i.distanceMin=function(l){return arguments.length?(g=l*l,i):Math.sqrt(g)},i.distanceMax=function(l){return arguments.length?(d=l*l,i):Math.sqrt(d)},i.theta=function(l){return arguments.length?(y=l*l,i):Math.sqrt(y)},i}function ce(t,e,n){var a=null,r=R(!0),o=null,g=xt,d=null,y=mt(i);t=typeof t=="function"?t:t===void 0?yt:R(+t),e=typeof e=="function"?e:e===void 0?R(0):R(+e),n=typeof n=="function"?n:n===void 0?vt:R(+n);function i(h){var m,l,f,c=(h=pt(h)).length,u,p=!1,v,j=new Array(c),s=new Array(c);for(o==null&&(d=g(v=y())),m=0;m<=c;++m){if(!(m<c&&r(u=h[m],m,h))===p)if(p=!p)l=m,d.areaStart(),d.lineStart();else{for(d.lineEnd(),d.lineStart(),f=m-1;f>=l;--f)d.point(j[f],s[f]);d.lineEnd(),d.areaEnd()}p&&(j[m]=+t(u,m,h),s[m]=+e(u,m,h),d.point(a?+a(u,m,h):j[m],n?+n(u,m,h):s[m]))}if(v)return d=null,v+""||null}function x(){return lt().defined(r).curve(g).context(o)}return i.x=function(h){return arguments.length?(t=typeof h=="function"?h:R(+h),a=null,i):t},i.x0=function(h){return arguments.length?(t=typeof h=="function"?h:R(+h),i):t},i.x1=function(h){return arguments.length?(a=h==null?null:typeof h=="function"?h:R(+h),i):a},i.y=function(h){return arguments.length?(e=typeof h=="function"?h:R(+h),n=null,i):e},i.y0=function(h){return arguments.length?(e=typeof h=="function"?h:R(+h),i):e},i.y1=function(h){return arguments.length?(n=h==null?null:typeof h=="function"?h:R(+h),i):n},i.lineX0=i.lineY0=function(){return x().x(t).y(e)},i.lineY1=function(){return x().x(t).y(n)},i.lineX1=function(){return x().x(a).y(e)},i.defined=function(h){return arguments.length?(r=typeof h=="function"?h:R(!!h),i):r},i.curve=function(h){return arguments.length?(g=h,o!=null&&(d=g(o)),i):g},i.context=function(h){return arguments.length?(h==null?o=d=null:d=g(o=h),i):o},i}const Y=[{year:2017,citations:2,cumulativeCitations:2},{year:2018,citations:5,cumulativeCitations:7},{year:2019,citations:12,cumulativeCitations:19},{year:2020,citations:28,cumulativeCitations:47},{year:2021,citations:45,cumulativeCitations:92},{year:2022,citations:68,cumulativeCitations:160},{year:2023,citations:92,cumulativeCitations:252},{year:2024,citations:85,cumulativeCitations:337}],at=[{id:"ramon",name:"Ramon Roca",institution:"Children's Medical Research Institute",type:"primary",projects:15},{id:"cmri",name:"CMRI",institution:"Sydney",type:"institution",projects:8},{id:"uab",name:"UAB",institution:"Barcelona",type:"institution",projects:6},{id:"uci",name:"UC Irvine",institution:"California",type:"institution",projects:3},{id:"lanza",name:"Dr. Lanza",institution:"CMRI",type:"collaborator",projects:5},{id:"martinez",name:"Dr. Martinez",institution:"UAB",type:"collaborator",projects:4},{id:"wong",name:"Dr. Wong",institution:"CMRI",type:"collaborator",projects:3},{id:"chen",name:"Dr. Chen",institution:"UCI",type:"collaborator",projects:2}],ot=[{source:"ramon",target:"cmri",strength:8},{source:"ramon",target:"uab",strength:6},{source:"ramon",target:"uci",strength:3},{source:"ramon",target:"lanza",strength:5},{source:"ramon",target:"martinez",strength:4},{source:"ramon",target:"wong",strength:3},{source:"ramon",target:"chen",strength:2},{source:"lanza",target:"cmri",strength:5},{source:"martinez",target:"uab",strength:4},{source:"wong",target:"cmri",strength:3},{source:"chen",target:"uci",strength:2}],ue=[{category:"Clinical Translation",value:3,description:"Therapies in development",icon:"💊"},{category:"Patents Filed",value:5,description:"Intellectual property protected",icon:"📋"},{category:"Lives Impacted",value:1e4,description:"Potential patients who could benefit",icon:"❤️"},{category:"Cost Reduction",value:100,description:"Fold decrease in therapy cost",icon:"💰"}],fe=[{title:"Antimicrobial Coatings",status:"Commercial",impact:"Preventing 99.9% of hospital-acquired infections on medical devices",timeline:"2023-2025"},{title:"In-vivo CAR-T Generation",status:"Preclinical",impact:"Making CAR-T therapy accessible to 100x more patients",timeline:"2024-2028"},{title:"AAV Liver Targeting",status:"Clinical Trial",impact:"Improving gene therapy success rates by 40%",timeline:"2023-2026"}];function he(){const[t,e]=F.useState("citations"),n=F.useRef(null),a=F.useRef(null);return F.useEffect(()=>{if(!n.current)return;const r=S(n.current);r.selectAll("*").remove();const o={top:20,right:80,bottom:50,left:70},g=600-o.left-o.right,d=300-o.top-o.bottom,y=r.append("g").attr("transform",`translate(${o.left},${o.top})`),i=J().domain(wt(Y,l=>l.year)).range([0,g]),x=J().domain([0,jt(Y,l=>t==="citations"?l.citations:l.cumulativeCitations)]).range([d,0]);y.append("g").attr("class","grid").attr("transform",`translate(0,${d})`).call(Z(i).tickSize(-d).tickFormat(()=>"")).style("stroke-dasharray","3,3").style("opacity",.3),y.append("g").attr("class","grid").call(q(x).tickSize(-g).tickFormat(()=>"")).style("stroke-dasharray","3,3").style("opacity",.3),y.append("g").attr("transform",`translate(0,${d})`).call(Z(i).tickFormat(gt("d"))),y.append("g").call(q(x));const h=lt().x(l=>i(l.year)).y(l=>x(t==="citations"?l.citations:l.cumulativeCitations)).curve(tt);y.append("path").datum(Y).attr("fill","none").attr("stroke","#DA291C").attr("stroke-width",3).attr("d",h);const m=ce().x(l=>i(l.year)).y0(d).y1(l=>x(t==="citations"?l.citations:l.cumulativeCitations)).curve(tt);y.append("path").datum(Y).attr("fill","#DA291C").attr("opacity",.1).attr("d",m),y.selectAll(".citation-point").data(Y).enter().append("circle").attr("cx",l=>i(l.year)).attr("cy",l=>x(t==="citations"?l.citations:l.cumulativeCitations)).attr("r",5).attr("fill","#DA291C").attr("stroke","white").attr("stroke-width",2),r.append("text").attr("transform","rotate(-90)").attr("y",20).attr("x",-135).attr("text-anchor","middle").style("font-size","14px").text(t==="citations"?"Annual Citations":"Cumulative Citations"),r.append("text").attr("x",g/2+o.left).attr("y",d+o.top+40).attr("text-anchor","middle").style("font-size","14px").text("Year")},[t]),F.useEffect(()=>{if(!a.current)return;const r=S(a.current);r.selectAll("*").remove();const d=se(at).force("link",qt(ot).id(f=>f.id).distance(f=>100/f.strength).strength(f=>f.strength/10)).force("charge",le().strength(-300)).force("center",Rt(600/2,400/2)).force("collision",Jt().radius(30)),y=r.append("g").selectAll("line").data(ot).enter().append("line").attr("stroke","#999").attr("stroke-opacity",.6).attr("stroke-width",f=>Math.sqrt(f.strength)*2),i=r.append("g").selectAll("g").data(at).enter().append("g").call(Et().on("start",h).on("drag",m).on("end",l));i.append("circle").attr("r",f=>f.type==="primary"?30:f.type==="institution"?25:20).attr("fill",f=>f.type==="primary"?"#DA291C":f.type==="institution"?"#4A90E2":"#FFD93D").attr("stroke","#fff").attr("stroke-width",2),i.append("text").text(f=>f.name).attr("text-anchor","middle").attr("dy","0.35em").style("font-size",f=>f.type==="primary"?"14px":"12px").style("font-weight",f=>f.type==="primary"?"bold":"normal").style("fill",f=>f.type==="primary"?"white":"black");const x=S("body").append("div").attr("class","network-tooltip").style("opacity",0).style("position","absolute").style("background","rgba(0,0,0,0.8)").style("color","white").style("padding","8px").style("border-radius","4px").style("font-size","12px");i.on("mouseover",(f,c)=>{x.transition().duration(200).style("opacity",.9),x.html(`${c.name}<br/>${c.institution}<br/>${c.projects} projects`).style("left",f.pageX+10+"px").style("top",f.pageY-28+"px")}).on("mouseout",()=>{x.transition().duration(500).style("opacity",0)}),d.on("tick",()=>{y.attr("x1",f=>f.source.x).attr("y1",f=>f.source.y).attr("x2",f=>f.target.x).attr("y2",f=>f.target.y),i.attr("transform",f=>`translate(${f.x},${f.y})`)});function h(f,c){f.active||d.alphaTarget(.3).restart(),c.fx=c.x,c.fy=c.y}function m(f,c){c.fx=f.x,c.fy=f.y}function l(f,c){f.active||d.alphaTarget(0),c.fx=null,c.fy=null}return()=>{x.remove()}},[]),b.jsxs("div",{className:"impact-dashboard",children:[b.jsx("h2",{children:"Research Impact & Collaboration Network"}),b.jsx("div",{className:"metrics-overview",children:ue.map(r=>b.jsxs("div",{className:"impact-metric",children:[b.jsx("div",{className:"metric-icon",children:r.icon}),b.jsxs("div",{className:"metric-content",children:[b.jsxs("div",{className:"metric-value",children:[r.value.toLocaleString(),r.category==="Cost Reduction"?"x":""]}),b.jsx("div",{className:"metric-category",children:r.category}),b.jsx("div",{className:"metric-description",children:r.description})]})]},r.category))}),b.jsxs("div",{className:"dashboard-grid",children:[b.jsxs("div",{className:"citation-section",children:[b.jsx("h3",{children:"Citation Trajectory"}),b.jsxs("div",{className:"metric-selector",children:[b.jsx("button",{className:t==="citations"?"active":"",onClick:()=>e("citations"),children:"Annual Citations"}),b.jsx("button",{className:t==="cumulative"?"active":"",onClick:()=>e("cumulative"),children:"Cumulative Impact"})]}),b.jsx("svg",{ref:n,width:"600",height:"300"}),b.jsxs("div",{className:"citation-stats",children:[b.jsxs("div",{className:"stat",children:[b.jsx("span",{className:"stat-label",children:"Total Citations:"}),b.jsx("span",{className:"stat-value",children:"337"})]}),b.jsxs("div",{className:"stat",children:[b.jsx("span",{className:"stat-label",children:"h-index:"}),b.jsx("span",{className:"stat-value",children:"12"})]}),b.jsxs("div",{className:"stat",children:[b.jsx("span",{className:"stat-label",children:"i10-index:"}),b.jsx("span",{className:"stat-value",children:"15"})]})]})]}),b.jsxs("div",{className:"network-section",children:[b.jsx("h3",{children:"Collaboration Network"}),b.jsx("svg",{ref:a,width:"600",height:"400"}),b.jsxs("div",{className:"network-legend",children:[b.jsxs("div",{className:"legend-item",children:[b.jsx("span",{className:"legend-dot",style:{backgroundColor:"#DA291C"}}),b.jsx("span",{children:"Primary Researcher"})]}),b.jsxs("div",{className:"legend-item",children:[b.jsx("span",{className:"legend-dot",style:{backgroundColor:"#4A90E2"}}),b.jsx("span",{children:"Institution"})]}),b.jsxs("div",{className:"legend-item",children:[b.jsx("span",{className:"legend-dot",style:{backgroundColor:"#FFD93D"}}),b.jsx("span",{children:"Collaborator"})]})]})]})]}),b.jsxs("div",{className:"applications-section",children:[b.jsx("h3",{children:"Real-World Applications"}),b.jsx("div",{className:"applications-grid",children:fe.map(r=>b.jsxs("div",{className:"application-card",children:[b.jsxs("div",{className:"app-header",children:[b.jsx("h4",{children:r.title}),b.jsx("span",{className:`status ${r.status.toLowerCase().replace(" ","-")}`,children:r.status})]}),b.jsx("p",{className:"app-impact",children:r.impact}),b.jsxs("div",{className:"app-timeline",children:[b.jsx("span",{className:"timeline-icon",children:"📅"}),b.jsx("span",{children:r.timeline})]})]},r.title))})]}),b.jsx("style",{children:`
        .impact-dashboard {
          margin: 2rem 0;
        }

        .metrics-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .impact-metric {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          transition: all 0.3s;
        }

        .impact-metric:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .metric-icon {
          font-size: 2.5rem;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #DA291C;
        }

        .metric-category {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .metric-description {
          font-size: 0.85rem;
          color: #666;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 3rem 0;
        }

        .citation-section, .network-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .metric-selector {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .metric-selector button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .metric-selector button.active {
          background: #DA291C;
          color: white;
          border-color: #DA291C;
        }

        .citation-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .network-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .applications-section {
          margin-top: 3rem;
        }

        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .application-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }

        .application-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .app-header h4 {
          margin: 0;
          color: #333;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: bold;
        }

        .status.commercial {
          background: #50C878;
          color: white;
        }

        .status.preclinical {
          background: #FFD93D;
          color: #333;
        }

        .status.clinical-trial {
          background: #4A90E2;
          color: white;
        }

        .app-impact {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .app-timeline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #999;
          font-size: 0.9rem;
        }

        .timeline-icon {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .metrics-overview {
            grid-template-columns: 1fr;
          }
        }
      `})]})}document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("research-impact-root");t&&bt.createRoot(t).render(dt.createElement(he))});
