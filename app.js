(function(){
  "use strict";
  var d=document,root=d.documentElement,cfg=window.POUONE_CONFIG||{},P=window.POUONE_PRODUCTS||{};
  root.classList.add("js");
  var $=function(s,c){return(c||d).querySelector(s)};
  var fa=function(n){return n.toLocaleString("fa-IR")};

  /* حالت تیره/روشن (پیش‌فرض: روشن) */
  var KEY="pouone-theme",saved=null;
  try{saved=localStorage.getItem(KEY)}catch(e){}
  function setTheme(t){
    root.setAttribute("data-theme",t);
    $("#theme-label").textContent=t==="dark"?"حالت روشن":"حالت تیره";
  }
  setTheme(saved==="dark"?"dark":"light");
  $("#theme").addEventListener("click",function(){
    var t=root.getAttribute("data-theme")==="dark"?"light":"dark";
    setTheme(t);try{localStorage.setItem(KEY,t)}catch(e){}
  });

  /* سایه نوار ناوبری */
  var nav=$("#nav");
  function onScroll(){nav.classList.toggle("is-stuck",scrollY>8)}
  addEventListener("scroll",onScroll,{passive:true});onScroll();

  /* نمایش با اسکرول */
  var els=d.querySelectorAll(".reveal");
  els.forEach(function(el,i){el.style.setProperty("--d",(i%4)*.08+"s")});
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});
    els.forEach(function(el){io.observe(el)});
  }else els.forEach(function(el){el.classList.add("in")});

  /* شمارنده آمار */
  d.querySelectorAll("[data-count]").forEach(function(b){
    var to=+b.dataset.count,t0=null;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    (function step(t){t0=t0||t;var p=Math.min((t-t0)/1100,1);b.textContent=fa(Math.ceil(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(step)})(performance.now());
  });

  /* پنجره محصول */
  var modal=$("#modal");
  function safe(u){return typeof u==="string"&&(/^https:\/\//i.test(u)||/^[\w\-.]+$/.test(u))}
  function open(id){
    var p=P[id],card=$('.card[data-product="'+id+'"]');if(!p||!card)return;
    $("#m-logo").src=$(".card__logo",card).getAttribute("src");
    $("#m-title").textContent=p.name;
    $("#m-tag").textContent=$(".card__desc",card).textContent;
    $("#m-desc").textContent=p.description;
    var ul=$("#m-uses");ul.textContent="";
    p.uses.forEach(function(t){var li=d.createElement("li");li.textContent=t;ul.appendChild(li)});
    var box=$("#m-actions");box.textContent="";
    var dl=(cfg.downloads||{})[id]||{};
    [["android","دانلود نسخه اندروید"],["windows","دانلود نسخه ویندوز"]].forEach(function(o,i){
      var a=d.createElement("a"),u=dl[o[0]];a.className="btn"+(i?"":" btn--primary");
      if(safe(u)){a.href=u;a.textContent=o[1];a.setAttribute("download","")}
      else{a.textContent=o[1].replace("دانلود","به‌زودی:");a.setAttribute("aria-disabled","true")}
      box.appendChild(a);
    });
    modal.showModal();
  }
  d.querySelectorAll(".card").forEach(function(c){c.addEventListener("click",function(){open(c.dataset.product)})});
  d.querySelectorAll("[data-open]").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();open(a.dataset.open)})});
  $("#m-close").addEventListener("click",function(){modal.close()});
  modal.addEventListener("click",function(e){if(e.target===modal)modal.close()});

  /* اطلاعات تماس (ایمیل و تلفن لینک‌دار؛ بقیه به‌صورت متن) */
  var c=cfg.contact||{},list=$("#contact-list"),n=0;
  [["email","ایمیل",function(v){return"mailto:"+v}],["phone","تلفن",function(v){return"tel:"+v.replace(/\s/g,"")}],
   ["telegram","تلگرام",null],["instagram","اینستاگرام",null]
  ].forEach(function(r){
    var v=(c[r[0]]||"").trim();if(!v)return;n++;
    var row=d.createElement("div"),dt=d.createElement("dt"),dd=d.createElement("dd"),el;
    dt.textContent=r[1];
    if(r[2]){el=d.createElement("a");el.href=r[2](v)}else el=d.createElement("span");
    el.textContent=r[0]==="telegram"||r[0]==="instagram"?"@"+v:v;el.lang="en";el.dir="ltr";
    dd.appendChild(el);row.appendChild(dt);row.appendChild(dd);list.appendChild(row);
  });
  if(!n)$("#contact-empty").hidden=false;
  $("#year").textContent=new Date().getFullYear();
})();
