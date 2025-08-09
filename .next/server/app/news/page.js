(()=>{var e={};e.id=4834,e.ids=[4834],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},5315:e=>{"use strict";e.exports=require("path")},8621:e=>{"use strict";e.exports=require("punycode")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1568:e=>{"use strict";e.exports=require("zlib")},12:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>d,routeModule:()=>p,tree:()=>c}),s(3849),s(9456),s(7629),s(8245);var r=s(3191),a=s(8716),i=s(7922),n=s.n(i),o=s(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let c=["",{children:["news",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,3849)),"C:\\dev\\kamunity-final\\src\\app\\news\\page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(s.bind(s,9456)),"C:\\dev\\kamunity-final\\src\\app\\layout.tsx"],error:[()=>Promise.resolve().then(s.bind(s,7629)),"C:\\dev\\kamunity-final\\src\\app\\error.tsx"],"not-found":[()=>Promise.resolve().then(s.bind(s,8245)),"C:\\dev\\kamunity-final\\src\\app\\not-found.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,3881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["C:\\dev\\kamunity-final\\src\\app\\news\\page.tsx"],u="/news/page",m={require:s,loadChunk:()=>Promise.resolve()},p=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/news/page",pathname:"/news",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},4867:(e,t,s)=>{Promise.resolve().then(s.bind(s,3307))},8393:(e,t,s)=>{"use strict";s.d(t,{Z:()=>r});let r=(0,s(2881).Z)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},3307:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>ek});var r,a=s(326),i=s(7577),n=s(8133),o=s(188),l=s(9730),c=s(2881);let d=(0,c.Z)("external-link",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]),u=(0,c.Z)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);var m=s(8393),p=s(5329),h=s(9837),x=s(6792),g=s(2065);let f={data:""},y=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||f,b=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,v=/\/\*[^]*?\*\/|  +/g,j=/\n+/g,w=(e,t)=>{let s="",r="",a="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+n+";":r+="f"==i[1]?w(n,i):i+"{"+w(n,"k"==i[1]?"":t)+"}":"object"==typeof n?r+=w(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=w.p?w.p(i,n):i+":"+n+";")}return s+(t&&a?t+"{"+a+"}":a)+r},N={},k=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+k(e[s]);return t}return e},C=(e,t,s,r,a)=>{let i=k(e),n=N[i]||(N[i]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(i));if(!N[n]){let t=i!==e?e:(e=>{let t,s,r=[{}];for(;t=b.exec(e.replace(v,""));)t[4]?r.shift():t[3]?(s=t[3].replace(j," ").trim(),r.unshift(r[0][s]=r[0][s]||{})):r[0][t[1]]=t[2].replace(j," ").trim();return r[0]})(e);N[n]=w(a?{["@keyframes "+n]:t}:t,s?"":"."+n)}let o=s&&N.g?N.g:null;return s&&(N.g=N[n]),((e,t,s,r)=>{r?t.data=t.data.replace(r,e):-1===t.data.indexOf(e)&&(t.data=s?e+t.data:t.data+e)})(N[n],t,r,o),n},_=(e,t,s)=>e.reduce((e,r,a)=>{let i=t[a];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":w(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"");function D(e){let t=this||{},s=e.call?e(t.p):e;return C(s.unshift?s.raw?_(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,y(t.target),t.g,t.o,t.k)}D.bind({g:1});let S,E,P,$=D.bind({k:1});function q(e,t){let s=this||{};return function(){let r=arguments;function a(i,n){let o=Object.assign({},i),l=o.className||a.className;s.p=Object.assign({theme:E&&E()},o),s.o=/ *go\d+/.test(l),o.className=D.apply(s,r)+(l?" "+l:""),t&&(o.ref=n);let c=e;return e[0]&&(c=o.as||e,delete o.as),P&&c[0]&&P(o),S(c,o)}return t?t(a):a}}var z=e=>"function"==typeof e,A=(e,t)=>z(e)?e(t):e,O=(()=>{let e=0;return()=>(++e).toString()})(),T=(()=>{let e;return()=>e})(),M=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return M(e,{type:e.toasts.find(e=>e.id===s.id)?1:0,toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},F=[],I={toasts:[],pausedAt:void 0},L=e=>{I=M(I,e),F.forEach(e=>{e(I)})},H={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},W=(e={})=>{let[t,s]=(0,i.useState)(I),r=(0,i.useRef)(I);(0,i.useEffect)(()=>(r.current!==I&&s(I),F.push(s),()=>{let e=F.indexOf(s);e>-1&&F.splice(e,1)}),[]);let a=t.toasts.map(t=>{var s,r,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||H[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...t,toasts:a}},Z=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||O()}),R=e=>(t,s)=>{let r=Z(t,e,s);return L({type:2,toast:r}),r.id},G=(e,t)=>R("blank")(e,t);G.error=R("error"),G.success=R("success"),G.loading=R("loading"),G.custom=R("custom"),G.dismiss=e=>{L({type:3,toastId:e})},G.remove=e=>L({type:4,toastId:e}),G.promise=(e,t,s)=>{let r=G.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?A(t.success,e):void 0;return a?G.success(a,{id:r,...s,...null==s?void 0:s.success}):G.dismiss(r),e}).catch(e=>{let a=t.error?A(t.error,e):void 0;a?G.error(a,{id:r,...s,...null==s?void 0:s.error}):G.dismiss(r)}),e};var U=(e,t)=>{L({type:1,toast:{id:e,height:t}})},V=()=>{L({type:5,time:Date.now()})},X=new Map,B=1e3,K=(e,t=B)=>{if(X.has(e))return;let s=setTimeout(()=>{X.delete(e),L({type:4,toastId:e})},t);X.set(e,s)},Y=e=>{let{toasts:t,pausedAt:s}=W(e);(0,i.useEffect)(()=>{if(s)return;let e=Date.now(),r=t.map(t=>{if(t.duration===1/0)return;let s=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(s<0){t.visible&&G.dismiss(t.id);return}return setTimeout(()=>G.dismiss(t.id),s)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[t,s]);let r=(0,i.useCallback)(()=>{s&&L({type:6,time:Date.now()})},[s]),a=(0,i.useCallback)((e,s)=>{let{reverseOrder:r=!1,gutter:a=8,defaultPosition:i}=s||{},n=t.filter(t=>(t.position||i)===(e.position||i)&&t.height),o=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[t]);return(0,i.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)K(e.id,e.removeDelay);else{let t=X.get(e.id);t&&(clearTimeout(t),X.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:U,startPause:V,endPause:r,calculateOffset:a}}},J=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Q=$`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=$`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,et=q("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${J} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Q} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ee} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,es=$`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,er=q("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${es} 1s linear infinite;
`,ea=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ei=$`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,en=q("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ea} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ei} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,eo=q("div")`
  position: absolute;
`,el=q("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ec=$`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ed=q("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ec} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,eu=({toast:e})=>{let{icon:t,type:s,iconTheme:r}=e;return void 0!==t?"string"==typeof t?i.createElement(ed,null,t):t:"blank"===s?null:i.createElement(el,null,i.createElement(er,{...r}),"loading"!==s&&i.createElement(eo,null,"error"===s?i.createElement(et,{...r}):i.createElement(en,{...r})))},em=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ep=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,eh=q("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ex=q("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,eg=(e,t)=>{let s=e.includes("top")?1:-1,[r,a]=T()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[em(s),ep(s)];return{animation:t?`${$(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${$(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ef=i.memo(({toast:e,position:t,style:s,children:r})=>{let a=e.height?eg(e.position||t||"top-center",e.visible):{opacity:0},n=i.createElement(eu,{toast:e}),o=i.createElement(ex,{...e.ariaProps},A(e.message,e));return i.createElement(eh,{className:e.className,style:{...a,...s,...e.style}},"function"==typeof r?r({icon:n,message:o}):i.createElement(i.Fragment,null,n,o))});r=i.createElement,w.p=void 0,S=r,E=void 0,P=void 0;var ey=({id:e,className:t,style:s,onHeightUpdate:r,children:a})=>{let n=i.useCallback(t=>{if(t){let s=()=>{r(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return i.createElement("div",{ref:n,className:t,style:s},a)},eb=(e,t)=>{let s=e.includes("top"),r=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:T()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...r}},ev=D`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ej=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:r,children:a,containerStyle:n,containerClassName:o})=>{let{toasts:l,handlers:c}=Y(s);return i.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:o,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(s=>{let n=s.position||t,o=eb(n,c.calculateOffset(s,{reverseOrder:e,gutter:r,defaultPosition:t}));return i.createElement(ey,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?ev:"",style:o},"custom"===s.type?A(s.message,s):a?a(s):i.createElement(ef,{toast:s,position:n}))}))};let ew=({newsItem:e})=>{let[t,s]=(0,i.useState)(!1),[r,n]=(0,i.useState)(["This is amazing! Great to see community impact \uD83D\uDE80","Love seeing grassroots communities thrive!","The networking opportunities have been incredible.","Which startups launched from this group?","Planning to start a similar group in my city.","The monthly format works really well.","Coffee shop to 500 members - exponential growth!","This should be featured in our newsletter!","Participated in the tree planting! \uD83C\uDF33","The carbon calculator is super helpful.","Those sustainability tips are gold!","Can we organize another event next month?"]),[o,c]=(0,i.useState)(""),[f,y]=(0,i.useState)(!1),[b,v]=(0,i.useState)(null),[j,w]=(0,i.useState)(!1),N=()=>{o.trim()&&(n(e=>[...e,o]),c(""),G.success("Comment added!"))},k=async()=>{if(!j){w(!0),G.loading("\uD83D\uDE80 Creating chat room...");try{let e=crypto.randomUUID();await new Promise(e=>setTimeout(e,1500)),y(!0),v(e),G.dismiss(),G.success("✅ Chat room created successfully!"),setTimeout(()=>{G.success((0,a.jsxs)("div",{className:"flex flex-col gap-2",children:[a.jsx("span",{children:"Chat room is ready!"}),a.jsx("button",{onClick:()=>window.open(`/chat/${e}`,"_blank"),className:"px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700",children:"Open Chat Room →"})]}),{duration:6e3})},1e3)}catch{G.dismiss(),G.error("Failed to create chat room. Please try again.")}finally{w(!1)}}},C=t?r:r.slice(0,3),_=r.length>=10;return a.jsx(p.Zb,{className:"hover:shadow-lg transition-shadow",children:(0,a.jsxs)(p.Ol,{children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[a.jsx(x.C,{className:(e=>{switch(e){case"kamunity_story":return"bg-blue-100 text-blue-800";case"room_summary":return"bg-green-100 text-green-800";case"chat_highlight":return"bg-purple-100 text-purple-800";case"external_story":return"bg-orange-100 text-orange-800";default:return"bg-gray-100 text-gray-800"}})(e.content_type),children:(e=>{switch(e){case"kamunity_story":return"Kamunity Story";case"room_summary":return"Room Summary";case"chat_highlight":return"Chat Highlight";case"external_story":return"External Story";default:return e}})(e.content_type)}),(0,a.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-500",children:[a.jsx(l.Z,{className:"w-4 h-4"}),r.length]})]}),a.jsx(p.ll,{className:"text-lg font-semibold mb-2 line-clamp-2",children:e.title}),a.jsx(p.SZ,{className:"text-sm text-gray-600 line-clamp-3 mb-4",children:e.content}),f?a.jsx("div",{className:"mb-4 p-3 bg-green-50 border border-green-200 rounded-lg",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"text-green-600 font-medium",children:"✅ Promoted to Chat!"}),a.jsx(g.xv,{variant:"body-small",className:"text-green-700",children:"Discussion moved to dedicated chat room"})]}),(0,a.jsxs)(h.z,{size:"sm",onClick:()=>window.open(`/chat/${b}`,"_blank"),className:"bg-green-600 hover:bg-green-700 text-white",children:[a.jsx(d,{className:"w-4 h-4 mr-1"}),"Open Chat"]})]})}):_&&a.jsx("div",{className:"mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"text-yellow-600 font-medium",children:"\uD83D\uDD25 Hot Discussion!"}),(0,a.jsxs)(g.xv,{variant:"body-small",className:"text-yellow-700",children:[r.length," comments - Ready for chat promotion"]})]}),a.jsx(h.z,{size:"sm",onClick:k,disabled:j,className:"bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50",children:j?"Creating...":"Promote to Chat"})]})}),(0,a.jsxs)("div",{className:"border-t pt-4",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,a.jsxs)(g.xv,{variant:"body-small",className:"font-medium",children:["Comments (",r.length,")"]}),a.jsx(h.z,{variant:"ghost",size:"sm",onClick:()=>s(!t),className:"flex items-center gap-1",children:t?(0,a.jsxs)(a.Fragment,{children:["Show Less ",a.jsx(u,{className:"w-4 h-4"})]}):(0,a.jsxs)(a.Fragment,{children:["Show All ",a.jsx(m.Z,{className:"w-4 h-4"})]})})]}),a.jsx("div",{className:"space-y-2 mb-4",children:C.map((e,t)=>a.jsx("div",{className:"p-2 bg-gray-50 rounded text-sm",children:(0,a.jsxs)("div",{className:"flex items-start gap-2",children:[a.jsx("div",{className:"w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs",children:String.fromCharCode(65+t%26)}),a.jsx("div",{className:"flex-1",children:a.jsx(g.xv,{variant:"body-small",children:e})})]})},t))}),(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx("input",{type:"text",value:o,onChange:e=>c(e.target.value),placeholder:"Add a comment...",className:"flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm",onKeyPress:e=>"Enter"===e.key&&N()}),a.jsx(h.z,{size:"sm",onClick:N,children:"Post"})]})]}),(0,a.jsxs)("div",{className:"mt-4 flex items-center justify-between",children:[a.jsx("div",{className:"flex flex-wrap gap-1",children:e.tags.slice(0,2).map(e=>(0,a.jsxs)("span",{className:"px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded",children:["#",e]},e))}),a.jsx("div",{className:"text-xs text-gray-500",children:new Date(e.created_at).toLocaleDateString()})]})]})})},eN=[{id:"1",title:"Community Spotlight: Local Tech Meetup Grows to 500+ Members",content:"What started as a small gathering of 12 developers in a coffee shop has transformed into the largest tech community in the region.",summary:"Local tech meetup grows from 12 to 500+ members, launches 3 startups",content_type:"kamunity_story",category:"Community Success",tags:["tech","meetup","community","startup"],engagement_score:45,comment_count:8,created_at:new Date().toISOString()},{id:"2",title:'Room Summary: "Climate Action Now" - Weekly Highlights',content:"This week in the Climate Action Now room: Members organized a city-wide tree planting event (127 trees planted!), shared 15 sustainable living tips.",summary:"Tree planting event, sustainability tips, carbon calculator milestone",content_type:"room_summary",category:"Environment",tags:["climate","environment","action","community"],engagement_score:32,comment_count:12,created_at:new Date(Date.now()-864e5).toISOString()},{id:"3",title:"Breaking: New Partnership with Local Universities",content:"Kamunity announces partnerships with 5 local universities to create dedicated spaces for student-led initiatives.",summary:"University partnerships enable student-led initiatives and mentorship",content_type:"external_story",category:"Partnerships",tags:["education","university","students","mentorship"],engagement_score:67,comment_count:15,created_at:new Date(Date.now()-1728e5).toISOString()}],ek=()=>(0,a.jsxs)(a.Fragment,{children:[a.jsx(n.$0,{spacing:"lg",className:"bg-gradient-to-br from-primary-50/70 to-secondary-50/70",children:a.jsx(n.W2,{children:(0,a.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8 items-center",children:[a.jsx("div",{className:"lg:col-span-1 lg:order-2 flex justify-center lg:justify-end",children:(0,a.jsxs)("div",{className:"relative w-64 h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center shadow-lg",children:[(0,a.jsxs)("div",{className:"text-center",children:[a.jsx("div",{className:"w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-3 mx-auto",children:a.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"})})}),a.jsx(n.xv,{variant:"body-small",className:"font-medium text-primary-700",children:"NEWS"}),a.jsx(n.xv,{variant:"body-small",color:"muted",className:"mt-1",children:"Stories that inspire"})]}),a.jsx("div",{className:"absolute top-4 right-4 w-3 h-3 bg-secondary-400 rounded-full opacity-60"}),a.jsx("div",{className:"absolute bottom-6 left-4 w-2 h-2 bg-primary-400 rounded-full opacity-40"}),a.jsx("div",{className:"absolute top-1/2 right-2 w-1 h-1 bg-secondary-500 rounded-full"})]})}),a.jsx("div",{className:"lg:col-span-2 lg:order-1",children:(0,a.jsxs)("div",{className:"text-center lg:text-left",children:[a.jsx(n.X6,{level:1,className:"text-4xl lg:text-5xl font-bold mb-6",children:"Community News & Stories"}),a.jsx(n.xv,{variant:"body-large",color:"muted",className:"mb-8 max-w-2xl mx-auto lg:mx-0",children:"Stay connected with the latest updates, success stories, and highlights from our vibrant community. Discover how conversations turn into real-world impact."}),(0,a.jsxs)("div",{className:"flex flex-wrap justify-center lg:justify-start gap-6 text-sm",children:[(0,a.jsxs)("div",{className:"text-center",children:[a.jsx("div",{className:"font-semibold text-primary-600",children:"127"}),a.jsx("div",{className:"text-neutral-600",children:"Stories Shared"})]}),(0,a.jsxs)("div",{className:"text-center",children:[a.jsx("div",{className:"font-semibold text-primary-600",children:"2.3k"}),a.jsx("div",{className:"text-neutral-600",children:"Community Reactions"})]}),(0,a.jsxs)("div",{className:"text-center",children:[a.jsx("div",{className:"font-semibold text-primary-600",children:"45"}),a.jsx("div",{className:"text-neutral-600",children:"Actions Taken"})]})]})]})})]})})}),a.jsx(n.$0,{spacing:"md",children:a.jsx(n.W2,{children:a.jsx(o.Z,{onFilterChange:(e,t)=>{console.log("Summary filter changed:",{timeframe:e,category:t})}})})}),a.jsx(n.$0,{spacing:"lg",children:(0,a.jsxs)(n.W2,{children:[(0,a.jsxs)("div",{className:"mb-8",children:[a.jsx(n.X6,{level:2,className:"text-2xl font-bold mb-4",children:"Latest Community Updates"}),a.jsx(n.xv,{color:"muted",children:"Real-time updates from rooms, chats, and community stories"})]}),a.jsx(n.rj,{cols:1,responsive:{md:2,lg:3},gap:"lg",children:eN.map(e=>a.jsx(ew,{newsItem:e},e.id))}),(0,a.jsxs)("div",{className:"mt-12 p-6 bg-blue-50 rounded-lg",children:[a.jsx(n.X6,{level:3,className:"text-lg font-semibold mb-3 text-blue-900",children:"\uD83E\uDDEA News System Demo"}),(0,a.jsxs)("div",{className:"text-sm text-blue-800 space-y-2",children:[(0,a.jsxs)("p",{children:[a.jsx("strong",{children:"✅ Working:"})," News page now loads without authentication"]}),(0,a.jsxs)("p",{children:[a.jsx("strong",{children:"\uD83D\uDCF0 Content:"})," Mock news items showing different content types"]}),a.jsx("p",{children:a.jsx("strong",{children:"\uD83C\uDFAF Next Steps:"})}),(0,a.jsxs)("ul",{className:"list-disc list-inside ml-4 space-y-1",children:[a.jsx("li",{children:"Connect to database for real content"}),a.jsx("li",{children:"Add expandable comments functionality"}),a.jsx("li",{children:"Implement chat promotion workflow"}),a.jsx("li",{children:"Add real-time updates"})]})]})]})]})}),a.jsx(ej,{position:"top-right",toastOptions:{duration:4e3,style:{background:"#363636",color:"#fff"},success:{duration:3e3,iconTheme:{primary:"#4ade80",secondary:"#fff"}},error:{duration:5e3,iconTheme:{primary:"#ef4444",secondary:"#fff"}}}})]})},6792:(e,t,s)=>{"use strict";s.d(t,{C:()=>o});var r=s(326);s(7577);var a=s(9360),i=s(1223);let n=(0,a.j)("inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300",{variants:{variant:{default:"border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80",secondary:"border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",destructive:"border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80",outline:"text-neutral-950 dark:text-neutral-50"}},defaultVariants:{variant:"default"}});function o({className:e,variant:t,...s}){return r.jsx("div",{className:(0,i.cn)(n({variant:t}),e),...s})}},3849:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});let r=(0,s(8570).createProxy)(String.raw`C:\dev\kamunity-final\src\app\news\page.tsx#default`)},9360:(e,t,s)=>{"use strict";s.d(t,{j:()=>n});var r=s(1135);let a=e=>"boolean"==typeof e?`${e}`:0===e?"0":e,i=r.W,n=(e,t)=>s=>{var r;if((null==t?void 0:t.variants)==null)return i(e,null==s?void 0:s.class,null==s?void 0:s.className);let{variants:n,defaultVariants:o}=t,l=Object.keys(n).map(e=>{let t=null==s?void 0:s[e],r=null==o?void 0:o[e];if(null===t)return null;let i=a(t)||a(r);return n[e][i]}),c=s&&Object.entries(s).reduce((e,t)=>{let[s,r]=t;return void 0===r||(e[s]=r),e},{});return i(e,l,null==t?void 0:null===(r=t.compoundVariants)||void 0===r?void 0:r.reduce((e,t)=>{let{class:s,className:r,...a}=t;return Object.entries(a).every(e=>{let[t,s]=e;return Array.isArray(s)?s.includes({...o,...c}[t]):({...o,...c})[t]===s})?[...e,s,r]:e},[]),null==s?void 0:s.class,null==s?void 0:s.className)}}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[8948,5760,1627,188],()=>s(12));module.exports=r})();