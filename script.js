!function(){"use strict";var e,t,n,r,o={418:function(e,t,n){n.d(t,{UP:function(){return c},ZP:function(){return a}});var r=n(662);const o="order-alpha",i="order-color",c="order-relevance",u=o;function a(e,t,n,a){let s=u,l=u;const d=t.querySelector("body"),f=t.querySelector("#order-alpha"),p=t.querySelector("#order-color");f.disabled=!1,p.disabled=!1;const m=(i,u)=>{if(i!==c&&i===s)return;d.classList.replace(s,i);const f=t.querySelector("ul.grid");if(i===c)a.replaceChildren(f,u,30);else{e.scrollTo(0,0);const t=i===o?e=>Number.parseInt(e.split("-")[0],10):e=>Number.parseInt(e.split("-")[1],10);a.sortChildren(f,"o",t,30),l=i,n.setItem(r.IS,i)}s=i};if(n.hasItem(r.IS)){const e=n.getItem(r.IS);m(e)}return f.addEventListener("click",(()=>{m(o)})),p.addEventListener("click",(()=>{m(i)})),{currentOrderingIs:e=>s===e,selectOrdering:m,resetOrdering:()=>m(l)}}},662:function(e,t,n){n.d(t,{IS:function(){return i},Q_:function(){return u},SR:function(){return o},ZP:function(){return s},vt:function(){return c}});const r="simple-icons-",o=r+"preferred-color-scheme",i=r+"preferred-ordering",c=r+"preferred-download-type",u=r+"preferred-layout",a={hasItem(){return!1},getItem(){return null},setItem(){}};function s(e){return e?{hasItem(t){return null!==e.getItem(t)},getItem(t){return e.getItem(t)},setItem(t,n){return e.setItem(t,n)}}:a}}},i={};function c(e){var t=i[e];if(void 0!==t)return t.exports;var n=i[e]={exports:{}};return o[e].call(n.exports,n,n.exports,c),n.exports}c.m=o,t=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},c.t=function(n,r){if(1&r&&(n=this(n)),8&r)return n;if("object"==typeof n&&n){if(4&r&&n.__esModule)return n;if(16&r&&"function"==typeof n.then)return n}var o=Object.create(null);c.r(o);var i={};e=e||[null,t({}),t([]),t(t)];for(var u=2&r&&n;"object"==typeof u&&!~e.indexOf(u);u=t(u))Object.getOwnPropertyNames(u).forEach((function(e){i[e]=function(){return n[e]}}));return i.default=function(){return n},c.d(o,i),o},c.d=function(e,t){for(var n in t)c.o(t,n)&&!c.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},c.f={},c.e=function(e){return Promise.all(Object.keys(c.f).reduce((function(t,n){return c.f[n](e,t),t}),[]))},c.u=function(e){return e+".script.js"},c.miniCssF=function(e){},c.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n={},r="simple-icons-website:",c.l=function(e,t,o,i){if(n[e])n[e].push(t);else{var u,a;if(void 0!==o)for(var s=document.getElementsByTagName("script"),l=0;l<s.length;l++){var d=s[l];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==r+o){u=d;break}}u||(a=!0,(u=document.createElement("script")).charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.setAttribute("data-webpack",r+o),u.src=e),n[e]=[t];var f=function(t,r){u.onerror=u.onload=null,clearTimeout(p);var o=n[e];if(delete n[e],u.parentNode&&u.parentNode.removeChild(u),o&&o.forEach((function(e){return e(r)})),t)return t(r)},p=setTimeout(f.bind(null,void 0,{type:"timeout",target:u}),12e4);u.onerror=f.bind(null,u.onerror),u.onload=f.bind(null,u.onload),a&&document.head.appendChild(u)}},c.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e;c.g.importScripts&&(e=c.g.location+"");var t=c.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var r=n.length-1;r>-1&&!e;)e=n[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),c.p=e}(),function(){var e={143:0};c.f.j=function(t,n){var r=c.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else{var o=new Promise((function(n,o){r=e[t]=[n,o]}));n.push(r[2]=o);var i=c.p+c.u(t),u=new Error;c.l(i,(function(n){if(c.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var o=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;u.message="Loading chunk "+t+" failed.\n("+o+": "+i+")",u.name="ChunkLoadError",u.type=o,u.request=i,r[1](u)}}),"chunk-"+t,t)}};var t=function(t,n){var r,o,i=n[0],u=n[1],a=n[2],s=0;if(i.some((function(t){return 0!==e[t]}))){for(r in u)c.o(u,r)&&(c.m[r]=u[r]);a&&a(c)}for(t&&t(n);s<i.length;s++)o=i[s],c.o(e,o)&&e[o]&&e[o][0](),e[o]=0},n=self.webpackChunksimple_icons_website=self.webpackChunksimple_icons_website||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}(),function(){var e={};c.r(e),c.d(e,{hideElement:function(){return t},replaceChildren:function(){return o},showElement:function(){return n},sortChildren:function(){return i},toggleClass:function(){return u},toggleVisibleElement:function(){return r}});const t=e=>{e.classList.add("hidden"),e.setAttribute("aria-hidden","true")},n=e=>{e.classList.remove("hidden"),e.removeAttribute("aria-hidden")},r=e=>{e.classList.toggle("hidden"),e.toggleAttribute("aria-hidden")},o=(e,t,n)=>{n=Math.min(n,t.length)||t.length;const r=t.slice(0,n);e.innerHTML="";for(const t of r)e.append(t);setTimeout((()=>{for(const r of t.slice(n))e.append(r)}),0)},i=(e,t,n,r)=>{const i=[...e.children].sort(((e,r)=>{const o=e.getAttribute(t),i=r.getAttribute(t);return null!==o&&null!==i?n(o)-n(i):0}));o(e,i,r)},u=(e,t)=>{e&&e.classList.toggle(t)};var a=c(418),s=c(662);document.body.classList.remove("no-js");const l=(0,s.ZP)(localStorage),d=(0,a.ZP)(window,document,l,e);(async()=>{const{default:e}=await c.e(895).then(c.bind(c,895));e(document)})(),(async()=>{const{default:e}=await c.e(157).then(c.bind(c,157));e(document,l)})(),(async()=>{const{default:e}=await c.e(497).then(c.bind(c,497));e(document,navigator,fetch)})(),(async()=>{const{default:t}=await c.e(794).then(c.bind(c,794));setTimeout((()=>{t(window.history,document,d,e)}),0)})(),(async()=>{const{default:e}=await c.e(788).then(c.bind(c,788));e(document,l)})(),(async()=>{const{default:t}=await c.e(686).then(c.bind(c,686));t(document,e)})(),(async()=>{const{default:e}=await c.e(993).then(c.bind(c,993));e(document,l)})(),(async()=>{const{default:t}=await c.e(663).then(c.bind(c,663));t(document,e)})()}()}();