/* ================= DUN — core runtime ================= */
(function(){
'use strict';

var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var STORE='dun.v1';

/* ---------- tiny store ---------- */
function load(){try{var raw=localStorage.getItem(STORE);return raw?JSON.parse(raw):{};}catch(e){return {};}}
function save(s){try{localStorage.setItem(STORE,JSON.stringify(s));}catch(e){}}
var S=load();
S.users=S.users||[];
if(!S.users.length){
  S.users.push({name:'بهرام دادمان',email:'admin@dun.cafe',pass:'dun1234',role:'رُستر ارشد',plan:'club',joined:'1403/02/11'});
  save(S);
}
function me(){ if(!S.session)return null; for(var i=0;i<S.users.length;i++) if(S.users[i].email===S.session) return S.users[i]; return null; }

var DUN={$: $, $$: $$, reduce:RM, store:S, save:save, me:me, toast:toast, go:go, openModal:openModal, esc:esc};
window.DUN=DUN;

/* ---------- escape helper ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

/* ---------- toasts ---------- */
function toast(msg,kind){
  var box=$('#toasts'); if(!box) return;
  var t=document.createElement('div');
  t.className='toast '+(kind||'info');
  var ic=kind==='ok'?'✓':kind==='err'?'!':'i';
  t.innerHTML='<span class="ic">'+ic+'</span><span>'+msg+'</span>';
  box.appendChild(t);
  setTimeout(function(){ t.classList.add('out'); setTimeout(function(){ if(t.parentNode)t.parentNode.removeChild(t); },420); },3600);
}
DUN.toast=toast;

/* ---------- router ---------- */
var VIEWS=['home','features','works','pricing','about','contact','login','register','dashboard'];
var GUARD={dashboard:true};
var current='';
function go(name,push){
  if(VIEWS.indexOf(name)<0) name='home';
  if(GUARD[name]&&!me()){ toast('اول باید وارد حساب بشی ✦','err'); name=(name==='dashboard')?'login':name; }
  if(name===current&&push!==true){}
  var prev=$('#view-'+current);
  $$('.view').forEach(function(v){ v.classList.remove('active'); });
  var el=$('#view-'+name);
  if(!el) el=$('#view-home');
  current=el.id.replace('view-','');
  el.classList.add('active');
  document.title=TITLES[current]+' — دُن';
  $$('.nav-links button,#mmenu button').forEach(function(b){ b.classList.toggle('active',b.dataset.view===current||b.dataset.view===name); b.classList.toggle('on',b.dataset.view===current); });
  closeMenu();
  window.scrollTo({top:0,behavior:RM?'auto':'smooth'});
  if(push!==false){ try{history.replaceState(null,'','#'+current);}catch(e){ location.hash=current; } }
  activate(current);
}
DUN.go=go;
var TITLES={home:'دُن — رُستری و کافهٔ شبانه',features:'مسیر دانه',works:'دانه‌ها',pricing:'اشتراک',about:'درباره ما',contact:'تماس',login:'ورود',register:'عضویت کلوپ',dashboard:'پنل کلوپ'};
DUN.TITLES=TITLES;

/* per-view boot (views file fills this) */
var boot={};
DUN.bootFn=function(name,fn){ boot[name]=fn; };
function activate(name){
  revealScan();
  if(boot[name]){ try{boot[name]();}catch(e){ console.warn('boot',e); } }
}

/* ---------- preloader ---------- */
function bootPreloader(){
  var pre=$('#preloader'); if(!pre) return;
  var wm=$('.pre-wordmark',pre);
  if(wm){ wm.innerHTML='DUN ROASTERY'.split('').map(function(c,i){
      return '<span style="animation-delay:'+(0.15+i*0.06)+'s">'+(c===' '?'&nbsp;':esc(c))+'</span>';}).join(''); }
  var bar=$('.pre-bar i',pre), pct=$('.pre-pct',pre);
  var v=0;
  var iv=setInterval(function(){
    v+=Math.random()*17+6; if(v>100)v=100;
    if(bar)bar.style.width=v+'%';
    if(pct)pct.textContent='LOADING SYSTEMS · '+Math.round(v)+'%';
    if(v>=100){ clearInterval(iv); setTimeout(done,320); }
  },RM?0:130);
  function done(){
    pre.classList.add('done');
    document.body.classList.add('ready');
    setTimeout(function(){ if(pre.parentNode) pre.parentNode.removeChild(pre); },900);
    var s=S.session?'dashboard':(location.hash.replace('#','')||'home');
    go(VIEWS.indexOf(s)>=0?s:'home',false);
  }
  var sk=$('.pre-skip',pre); if(sk) sk.addEventListener('click',function(){ v=100; done(); });
}

/* ---------- hash routing ---------- */
function routeFromHash(){ var h=location.hash.replace('#',''); return VIEWS.indexOf(h)>=0?h:'home'; }
window.addEventListener('hashchange',function(){ go(routeFromHash(),false); });

/* ---------- scroll effects ---------- */
function scrollFx(){
  var bar=$('#progress'), tb=$('.topbar');
  function onScroll(){
    var h=document.documentElement;
    var max=h.scrollHeight-h.clientHeight;
    var p=max>0?(h.scrollTop||document.body.scrollTop)/max:0;
    if(bar)bar.style.transform='scaleX('+p+')';
    if(tb)tb.classList.toggle('scrolled',p>0.02);
    var d=$('#dock'); if(d) d.classList.toggle('hide',p>0.94);
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  onScroll();
}

/* ---------- reveal on scroll ---------- */
var io=null;
function revealScan(){
  var els=$$('.reveal:not(.in)');
  if(!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in');}); return; }
  if(!io) io=new IntersectionObserver(function(en){
    en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e,i){
    if(!e.dataset.staggered){ e.dataset.staggered='1';
      var g=e.parentElement, sib=g?Array.prototype.slice.call(g.children).indexOf(e):0;
      e.style.transitionDelay=Math.min(sib*70,490)+'ms'; }
    io.observe(e);
  });
}
DUN.revealScan=revealScan;

/* ---------- counters ---------- */
function countUp(el,to,dec,suffix){
  if(RM){ el.textContent=fmt(to,dec)+(suffix||''); return; }
  var t0=null,dur=1500;
  function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1); var e=1-Math.pow(1-p,3);
    el.textContent=fmt(to*e,dec)+(suffix||''); if(p<1)requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
function fmt(n,dec){
  var s=(dec?n.toFixed(dec):Math.round(n).toString());
  var parts=s.split('.');
  parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'٬');
  var fa='۰۱۲۳۴۵۶۷۸۹';
  var joined=parts.join('.');
  return joined.replace(/[0-9]/g,function(d){return fa[+d];});
}
DUN.countUp=countUp; DUN.fmt=fmt;

/* ---------- pointer: spotlight, cursor, tilt, card glow ---------- */
function pointerFx(){
  var sp=$('#spotlight'), ring=$('#cur-ring'), dot=$('#cur-dot');
  var x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
  var fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.addEventListener('pointermove',function(e){
    x=e.clientX; y=e.clientY;
    if(sp&&!RM) sp.style.transform='translate3d('+x+'px,'+y+'px,0)';
    if(dot) dot.style.transform='translate3d('+x+'px,'+y+'px,0)';
    var t=e.target && e.target.closest ? e.target.closest('a,button,input,textarea,select,.work,.card,.plan,.member,.qa,.chip') : null;
    document.body.classList.toggle('cursor-hot',!!t);
  },{passive:true});
  if(ring&&fine&&!RM){
    (function loop(){ rx+=(x-rx)*0.19; ry+=(y-ry)*0.19;
      ring.style.transform='translate3d('+rx+'px,'+ry+'px,0)'; requestAnimationFrame(loop); })();
  } else if(ring){ ring.style.display='none'; }
  document.addEventListener('pointerdown',function(){document.body.classList.add('cursor-down');});
  document.addEventListener('pointerup',function(){document.body.classList.remove('cursor-down');});

  /* card radial glow follow */
  document.addEventListener('pointermove',function(e){
    var c=e.target&&e.target.closest?e.target.closest('.card,.kpi,.panel,.feat,.plan'):null;
    if(!c)return; var r=c.getBoundingClientRect();
    c.style.setProperty('--mx',(e.clientX-r.left)+'px');
    c.style.setProperty('--my',(e.clientY-r.top)+'px');
  },{passive:true});

  /* 3d tilt */
  if(!RM&&fine){
    $$('.tilt').forEach(function(el){
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(900px) rotateY('+(px*11)+'deg) rotateX('+(-py*11)+'deg) translateY(-6px)';
      });
      el.addEventListener('pointerleave',function(){ el.style.transform=''; });
    });
  }
}

/* ---------- particle canvas + click bursts ---------- */
function canvasFx(){
  var cv=$('#bg-fx'); if(!cv||!cv.getContext) return;
  var ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(devicePixelRatio||1,2),parts=[],pops=[],raf=null;
  var pal={a1:'#7c5cff',a2:'#22d3ee',a3:'#ff2e97'};
  function readPal(){
    var cs=getComputedStyle(document.documentElement);
    pal.a1=(cs.getPropertyValue('--a1')||'#7c5cff').trim();
    pal.a2=(cs.getPropertyValue('--a2')||'#22d3ee').trim();
    pal.a3=(cs.getPropertyValue('--a3')||'#ff2e97').trim();
  }
  function size(){ W=cv.width=Math.floor(innerWidth*dpr); H=cv.height=Math.floor(innerHeight*dpr);
    cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; build(); }
  function build(){
    var n=Math.round(Math.min(120,Math.max(38,innerWidth*innerHeight/16000)));
    if(RM)n=Math.round(n*0.35);
    parts=[];
    var cols=[pal.a1,pal.a2,pal.a3,'#ffffff'];
    for(var i=0;i<n;i++){
      parts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.13*dpr,vy:(Math.random()-.5)*.13*dpr,
        r:(Math.random()*1.5+.35)*dpr,c:cols[i%cols.length],a:Math.random()*.5+.18,tw:Math.random()*Math.PI*2});
    }
  }
  function step(){
    ctx.clearRect(0,0,W,H);
    var link=140*dpr,link2=link*link;
    for(var i=0;i<parts.length;i++){
      var p=parts[i];
      p.x+=p.vx; p.y+=p.vy; p.tw+=.03;
      if(p.x<-20)p.x=W+20; if(p.x>W+20)p.x=-20; if(p.y<-20)p.y=H+20; if(p.y>H+20)p.y=-20;
      ctx.globalAlpha=p.a*(0.6+0.4*Math.sin(p.tw));
      ctx.fillStyle=p.c; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832); ctx.fill();
      if(!RM) for(var j=i+1;j<parts.length;j++){
        var q=parts[j],dx=p.x-q.x,dy=p.y-q.y,d2=dx*dx+dy*dy;
        if(d2<link2){ ctx.globalAlpha=(1-d2/link2)*.16; ctx.strokeStyle=p.c; ctx.lineWidth=.6*dpr;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); }
      }
    }
    for(var k=pops.length-1;k>=0;k--){
      var o=pops[k]; o.life-=1;
      if(o.life<=0){ pops.splice(k,1); continue; }
      ctx.globalAlpha=Math.max(o.life/o.max,0)*.9; ctx.strokeStyle=o.c; ctx.lineWidth=1.6*dpr;
      ctx.beginPath(); ctx.arc(o.x,o.y,(o.max-o.life)*(3.2*dpr),0,6.2832); ctx.stroke();
    }
    ctx.globalAlpha=1;
    raf=requestAnimationFrame(step);
  }
  function start(){ if(!raf) raf=requestAnimationFrame(step); }
  function stop(){ if(raf){ cancelAnimationFrame(raf); raf=null; } }
  window.addEventListener('resize',size);
  document.addEventListener('visibilitychange',function(){ document.hidden?stop():start(); });
  size(); readPal(); build();
  if(RM){ /* draw a single static frame */ step(); stop(); } else start();
  document.addEventListener('pointerdown',function(e){
    if(RM)return;
    var cols=[pal.a1,pal.a2,pal.a3];
    for(var i=0;i<3;i++) pops.push({x:e.clientX*dpr,y:e.clientY*dpr,life:22+i*7,max:22+i*7,c:cols[i]});
  },{passive:true});
  DUN.repulse=function(){ readPal(); build(); };
}

/* ---------- palettes ---------- */
var PALETTES=[
  {id:'dun',name:'کرم کارمل',c:['#ff9a4d','#ffd88a','#ff4d6d']},
  {id:'espresso',name:'اسپرسوی تیره',c:['#d9822b','#e9c46a','#c1440e']},
  {id:'matcha',name:'ماچای سبز',c:['#7fb069','#d4e09b','#208b64']},
  {id:'berry',name:'بّری شب',c:['#e05780','#ffadad','#8338ec']},
  {id:'midnight',name:'نیمه‌شب آبی',c:['#5e7ceb','#9db4ff','#22d3ee']}
];
function paletteFx(){
  var dock=$('#dock'); if(!dock) return;
  dock.innerHTML='<span class="dock-title">PALETTE</span>'+PALETTES.map(function(p){
    return '<button data-p="'+p.id+'" data-name="'+esc(p.name)+'" title="'+esc(p.name)+'" aria-label="'+esc(p.name)+'" style="background:linear-gradient(140deg,'+p.c[0]+','+p.c[1]+' 55%,'+p.c[2]+')"></button>';
  }).join('');
  function apply(id){
    var p=null; PALETTES.forEach(function(x){ if(x.id===id)p=x; });
    if(!p)p=PALETTES[0];
    document.documentElement.setAttribute('data-palette',p.id);
    metaTheme(p.c[0]);
    S.palette=p.id; save(S);
    $$('button',dock).forEach(function(b){ b.classList.toggle('on',b.dataset.p===p.id); });
    if(DUN.repulse) DUN.repulse();
    if(window.__dashRedraw) window.__dashRedraw();
  }
  dock.addEventListener('click',function(e){
    var b=e.target.closest('button[data-p]'); if(!b)return;
    apply(b.dataset.p);
    toast('پالت «'+PALETTES.filter(function(p){return p.id===b.dataset.p;})[0].name+'» فعال شد','ok');
  });
  apply(S.palette||'dun');
  DUN.palettes=PALETTES;
}
function metaTheme(color){
  var m=$('meta[name="theme-color"]'); if(!m){ m=document.createElement('meta'); m.name='theme-color'; document.head.appendChild(m); }
  m.setAttribute('content',color);
}

/* ---------- marquee filler ---------- */
function marqueeFx(){
  var tr=$('#mq-track'); if(!tr) return;
  var words=['اتیوپی یرگاچف','کلمبیا هوئیلکا','گواتمالا آنتیگوا','کنیا نیاری','برزیل سرادو','کاستاریکا تاراسو','رواندا نیاگاشه','میکروت‌لات','کوپینگ هفتگی','لاته‌آرت','V60','اسپرسو بار'];
  var one=words.map(function(w){return '<span>'+esc(w)+'</span>';}).join('');
  tr.innerHTML=one+one;
}

/* ---------- menu, modal, command palette ---------- */
function menuFx(){
  var b=$('.burger'),m=$('#mmenu'); if(!b||!m)return;
  b.addEventListener('click',function(){ var o=m.classList.toggle('open'); document.body.classList.toggle('menu-open',o); });
  m.addEventListener('click',function(e){ if(e.target.closest('button[data-view]')||e.target===m) closeMenu(); });
}
function closeMenu(){ var m=$('#mmenu'); if(m){m.classList.remove('open');} document.body.classList.remove('menu-open'); }

function openModal(html){
  var m=$('#modal'); if(!m)return;
  $('.modal-card',m).innerHTML=html;
  m.classList.add('open'); document.body.style.overflow='hidden';
}
DUN.openModal=openModal;
function closeModal(){ var m=$('#modal'); if(m){m.classList.remove('open');} document.body.style.overflow=''; }
function modalFx(){
  var m=$('#modal'); if(!m)return;
  m.addEventListener('click',function(e){ if(e.target===m||e.target.closest('.modal-x')) closeModal(); });
}

var cmdItems=[];
function registerCmd(items){ cmdItems=cmdItems.concat(items); }
DUN.registerCmd=registerCmd;
function cmdFx(){
  var ov=$('#cmd'),input=$('#cmd-input'),list=$('#cmd-list'); if(!ov)return;
  var sel=0;
  function all(){
    var out=cmdItems.slice();
    $$('.nav-links button').forEach(function(b){ out.push({label:'رفتن به «'+TITLES[b.dataset.view]+'»',run:function(){go(b.dataset.view);}}); });
    PALETTES.forEach(function(p){ out.push({label:'پالت رنگی · '+p.name,run:function(){ document.dispatchEvent(new CustomEvent('dun:palette',{detail:p.id})); }}); });
    out.push({label:S.session?'خروج از حساب':'ورود به حساب',run:function(){ go(S.session?'login':'login'); }});
    return out;
  }
  var items=[];
  function render(q){
    q=(q||'').trim();
    items=all().filter(function(i){ return !q||i.label.indexOf(q)>=0; });
    sel=0;
    list.innerHTML=items.map(function(i,idx){
      return '<button data-i="'+idx+'" class="'+(idx===0?'sel':'')+'"><i></i>'+esc(i.label)+'<small>↵</small></button>';
    }).join('')||'<div style="padding:18px;color:var(--ink3);font-size:13px">موردی پیدا نشد…</div>';
  }
  function open(){ ov.classList.add('open'); render(''); setTimeout(function(){input.value='';input.focus();},60); }
  function close(){ ov.classList.remove('open'); }
  function move(d){ var b=$$('button',list); if(!b.length)return; sel=(sel+d+b.length)%b.length;
    b.forEach(function(x,i){x.classList.toggle('sel',i===sel);}); if(b[sel])b[sel].scrollIntoView({block:'nearest'}); }
  function run(i){ if(items[i]){ close(); items[i].run(); } }
  ov.addEventListener('click',function(e){ if(e.target===ov)close(); var b=e.target.closest('button[data-i]'); if(b)run(+b.dataset.i); });
  input.addEventListener('input',function(){ render(input.value); });
  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){e.preventDefault();move(1);}
    else if(e.key==='ArrowUp'){e.preventDefault();move(-1);}
    else if(e.key==='Enter'){e.preventDefault();run(sel);}
    else if(e.key==='Escape'){close();}
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ if(ov.classList.contains('open'))close(); else closeModal(); closeMenu(); }
    if(((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')||(e.altKey&&e.key.toLowerCase()==='p')){ e.preventDefault(); ov.classList.contains('open')?close():open(); }
  });
  DUN.openCmd=open;
}

/* ---------- nav + footer bindings ---------- */
function navFx(){
  document.addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('[data-view]'):null;
    if(b){ e.preventDefault(); go(b.dataset.view); }
    var c=e.target.closest?e.target.closest('[data-cmd]'):null;
    if(c&&DUN.openCmd) DUN.openCmd();
    var p=e.target.closest?e.target.closest('[data-palette-set]'):null;
    if(p) document.dispatchEvent(new CustomEvent('dun:palette',{detail:p.dataset.paletteSet}));
  });
  document.addEventListener('dun:palette',function(e){
    var b=$('#dock button[data-p="'+e.detail+'"]'); if(b)b.click();
  });
  var yr=$('#year'); if(yr) yr.textContent=new Date().toLocaleDateString('fa-IR',{year:'numeric'});
}

/* ---------- boot ---------- */
function init(){
  navFx(); paletteFx(); canvasFx(); marqueeFx(); menuFx(); modalFx(); cmdFx(); scrollFx(); pointerFx(); revealScan();
  registerCmd([
    {label:'بازگشت به خانه',run:function(){go('home');}},
    {label:'دیدن دانه‌ها',run:function(){go('works');}},
    {label:'پلن‌های اشتراک',run:function(){go('pricing');}},
    {label:'رزرو میز و تماس',run:function(){go('contact');}},
    {label:'ورود به کلوپ دُن',run:function(){go('login');}}
  ]);
  document.dispatchEvent(new CustomEvent('dun:ready'));
  if(DUN.viewsBoot) DUN.viewsBoot();
  bootPreloader();
  var tail=$('#nav-tail');
  renderNavTail();
  document.addEventListener('dun:auth',renderNavTail);
}
function renderNavTail(){
  var el=$('#nav-user'); if(!el)return;
  var u=me();
  if(u){
    el.innerHTML='<button class="btn btn-ghost btn-sm" data-view="dashboard" style="gap:8px"><span class="avatar sm">'+esc(u.name.trim().charAt(0))+'</span><span class="hide-sm">'+esc(u.name.split(' ')[0])+'</span></button>'+
                 '<button class="btn btn-line btn-sm" data-logout>خروج</button>';
  }else{
    el.innerHTML='<button class="btn btn-ghost btn-sm" data-view="login">ورود</button><button class="btn btn-primary btn-sm" data-view="register">ساخت حساب</button>';
  }
}
document.addEventListener('click',function(e){
  if(e.target.closest&&e.target.closest('[data-logout]')){
    S.session=null; save(S); toast('از حساب خارج شدی','info');
    renderNavTail(); go('home'); document.dispatchEvent(new CustomEvent('dun:auth'));
  }
});
DUN.renderNavTail=renderNavTail;

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();
})();
