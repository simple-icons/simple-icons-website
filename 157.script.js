"use strict";(self.webpackChunksimple_icons_website=self.webpackChunksimple_icons_website||[]).push([[157],{157:function(e,s,t){t.d(s,{default:function(){return n}});var c=t(662);const i="dark",l="light",r="system",o=r,d="dark",a="light";function n(e,s){let t=o;const n=e.querySelector("body"),m=e.querySelector("#color-scheme-dark"),u=e.querySelector("#color-scheme-light"),h=e.querySelector("#color-scheme-system");m.disabled=!1,u.disabled=!1,h.disabled=!1;const k=e=>{e!==t&&(e===i?(n.classList.add(d),n.classList.remove(a)):e===l?(n.classList.add(a),n.classList.remove(d)):n.classList.remove(d,a),s.setItem(c.SR,e),t=e)};if(s.hasItem(c.SR)){const e=s.getItem(c.SR);k(e)}m.addEventListener("click",(()=>{k(i)})),u.addEventListener("click",(()=>{k(l)})),h.addEventListener("click",(()=>{k(r)}))}}}]);