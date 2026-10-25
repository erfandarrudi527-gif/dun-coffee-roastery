/* ================= DUN — views & interactions ================= */
(function(){
'use strict';
var N=window.DUN, $=N.$, $$=N.$$, esc=N.esc, toast=N.toast;

/* ================= BEANS (دانه‌ها) ================= */
var WORKS=[
 {t:'اتیوپی — یرگاچف',c:'فیلتر',y:'رُست ۱۴ مهر',tags:['شکوفه','برگ چای','لیمو ترش'],d:'ارتفاع ۲۱۰۰ متر، فرآوری یخی. در فنجان مثل چای گل است؛ وقتی سرد می‌شود ترشی‌اش باز می‌شود.',art:'wa1',st:'امتیاز کوپینگ ۸۸٫۵ · لایت رُست'},
 {t:'کلمبیا — هوئیلکا',c:'اسپرسو',y:'رُست ۱۲ مهر',tags:['شکلات شیری','کارامل','گردو'],d:'تنِ بالانسی که عاشق شیر است؛ با شیر فوق‌العاده می‌شود. ستون فقرات هر لاته‌ای که می‌سازیم.',art:'wa2',st:'امتیاز ۸۶ · مدیوم-دارک'},
 {t:'گواتمالا — آنتیگوا',c:'فیلتر',y:'رُست ۱۰ مهر',tags:['کاکائو','ادویه','پرتقال'],d:'خاک آتشفشانی، بوی جنگل بعد از باران. بدنه‌اش مخملی است و ته‌مزه‌اش تلخ‌شیرین ماندگار.',art:'wa3',st:'امتیاز ۸۷ · مدیوم'},
 {t:'کنیا — نیاری',c:'میکروت‌لات',y:'رُست ۸ مهر',tags:['بلوبری','انگور سیاه','ترشیِ برق‌آسا'],d:'فقط ۶۰ کیلو در انبار؛ اول اعضای کلوپ چشیدند. اسیدیته‌اش مثل برق نوک زبان می‌رقصد.',art:'wa4',st:'میکروت‌لات · ۳۴ بسته ماند'},
 {t:'برزیل — سرادو',c:'اسپرسو',y:'رُست ۶ مهر',tags:['فندق','شکلات تلخ','شیره'],d:'کم‌اسید، سنگین و مهربان. برای آنکه صبح با شیر قهوه می‌خورد و شب جریمه نمی‌شود.',art:'wa5',st:'امتیاز ۸۴ · پرفروش‌ترین'},
 {t:'کاستاریکا — تاراسو',c:'فیلتر',y:'رُست ۴ مهر',tags:['عسل','سیب قرمز','کارامل'],d:'شیرین و تمیز؛ فرآوری عسلی. مثل چای سردِ شیرین در هوای گرم — تعادل خودش را دارد.',art:'wa6',st:'امتیاز ۸۷٫۵ · honey process'}
];
var wstate={cat:'همه'};
function renderWorks(){
  var grid=$('#works-grid'); if(!grid)return;
  grid.innerHTML=WORKS.map(function(w,i){
    var show=(wstate.cat==='همه'||wstate.cat===w.c);
    return '<article class="work reveal tilt'+(show?'':' gone')+'" data-i="'+i+'" tabindex="0" role="button" aria-label="بازکردن جزئیات '+esc(w.t)+'">'+
      '<div class="work-art"><span class="layer '+w.art+'"></span><span class="work-badge">'+esc(w.c)+' · '+esc(w.y)+'</span></div>'+
      '<div class="work-body"><h3>'+esc(w.t)+'</h3><p>'+esc(w.d)+'</p>'+
      '<div class="work-tags">'+w.tags.map(function(t){return '<i>'+esc(t)+'</i>';}).join('')+'</div></div>'+
      '<span class="work-open">↗</span></article>';
  }).join('');
  var fs=$('#work-filters');
  if(fs&&!fs.dataset.built){
    fs.dataset.built='1';
    var cats=['همه'].concat(WORKS.map(function(w){return w.c;}).filter(function(v,i,a){return a.indexOf(v)===i;}));
    fs.innerHTML=cats.map(function(c){return '<button data-cat="'+esc(c)+'" class="'+(c===wstate.cat?'on':'')+'">'+esc(c)+'</button>';}).join('');
  }
  N.revealScan();
}
function workModal(i){
  var w=WORKS[i]; if(!w)return;
  N.openModal(
    '<div class="modal-art"><span class="layer '+w.art+'" style="position:absolute;inset:0"></span><button class="modal-x" aria-label="بستن">✕</button></div>'+
    '<div class="modal-in"><span class="chip"><i></i>'+esc(w.c)+' · '+esc(w.y)+'</span>'+
    '<h3 style="margin-top:14px">'+esc(w.t)+'</h3>'+
    '<div class="row"><div>مزرعه<b>خرید مستقیم</b></div><div>فرآوری<b>هفتهٔ جاری</b></div><div>وضعیت<b>'+esc(w.st)+'</b></div></div>'+
    '<p style="color:var(--ink2);font-size:15px">'+esc(w.d)+'</p>'+
    '<p style="color:var(--ink2);font-size:14.5px;margin-top:12px">این دانه در کوپینگ هفتگی بین پنج نمونه اول شد. منحنی رُست روی درام ۱۵ کیلویی تنظیم، ۵ روز استراحت کرده و با والو یک‌طرفه بسته‌بندی می‌شود. recipe پیشنهادی داخل بسته هست.</p>'+
    '<div class="work-tags" style="margin:20px 0">'+w.tags.map(function(t){return '<i>'+esc(t)+'</i>';}).join('')+'</div>'+
    '<div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-view="pricing">می‌خوام هر ماه بخورمش</button>'+
    '<button class="btn btn-line btn-sm" data-view="works">بازگشت به قفسه</button></div></div>');
}
function worksBoot(){
  renderWorks();
  var grid=$('#works-grid'), fs=$('#work-filters');
  if(grid&&!grid.dataset.bound){ grid.dataset.bound='1';
    grid.addEventListener('click',function(e){ var c=e.target.closest('.work'); if(c) workModal(+c.dataset.i); });
    grid.addEventListener('keydown',function(e){ if(e.key==='Enter'){ var c=e.target.closest('.work'); if(c) workModal(+c.dataset.i);} });
  }
  if(fs&&!fs.dataset.bound){ fs.dataset.bound='1';
    fs.addEventListener('click',function(e){
      var b=e.target.closest('button[data-cat]'); if(!b)return;
      wstate.cat=b.dataset.cat;
      $$('button',fs).forEach(function(x){x.classList.toggle('on',x===b);});
      $$('.work',grid).forEach(function(card){
        var w=WORKS[+card.dataset.i];
        var show=(wstate.cat==='همه'||wstate.cat===w.c);
        if(show){ card.classList.remove('gone'); card.style.animation='viewIn .6s var(--ease-out) both'; }
        else card.classList.add('gone');
      });
    });
  }
  N.registerCmd(WORKS.map(function(w,i){ return {label:'دانه · '+w.t,run:function(){ N.go('works'); setTimeout(function(){workModal(i);},450); }}; }));
}

/* ================= PRICING ================= */
var PLANS=[
 {id:'solo',name:'تکی',desc:'برای کسی که تازه می‌خواهد جدی قهوه بخورد.',m:890,y:8540,feats:[['یک بسته ۲۵۰ گرمی ماهانه',1],['انتخاب آسیاب دلخواه',1],['رسپی چاپی داخل بسته',1], ['ارسال — هزینه جدا',0],['کوپینگ ماهانه',0],['میکروت‌لات زودهنگام',0]]},
 {id:'club',name:'کلوپ',hot:true,desc:'انتخاب ۷۱٪ اعضا: دو بسته، با امتیاز و کارگاه.',m:1690,y:16200,feats:[['دو بستهٔ ۲۵۰ گرمی ماهانه',1],['تنوع خودکار فیلتر/اسپرسو',1],['ارسال رایگان + تاریخ رُست تضمینی',1],['کوپینگ ماهانهٔ رایگان',1],['۱۵٪ تخفیف کارگاه‌ها',1],['میکروت‌لات زودهنگام',0]]},
 {id:'night',name:'شب‌بیدار',desc:'برای تیم‌ها، دفترها و دیوانه‌های کافئین.',m:3490,y:33500,feats:[['سه بسته + یک میکروت‌لات',1],['دسترسی زودهنگام همهٔ رُست‌ها',1],['ارسال اکسپرس رایگان',1],['کوپینگ + لاته‌آرت نامحدود',1],['میز رزروی اختصاصی کافه',1],['تأمین دانهٔ دفتر/کافه',1]]}
];
function tom(n){ return N.fmt(n)+' <em>هزار تومان / ماه</em>'; }
function renderPlans(){
  var el=$('#price-grid'); if(!el)return;
  var yearly=$('#pricing-toggle')&&$$('.toggle button',$('#pricing-toggle'))[1].classList.contains('on');
  el.innerHTML=PLANS.map(function(p){
    var price=yearly?p.y/12:p.m;
    return '<div class="plan reveal tilt'+(p.hot?' hot':'')+'">'+
      (p.hot?'<span class="flag">محبوب‌ترین</span>':'')+
      '<h3>'+esc(p.name)+'</h3><p class="desc">'+esc(p.desc)+'</p>'+
      '<div class="price"><b>'+(yearly?N.fmt(p.y):N.fmt(price))+'</b><em>'+(yearly?'تومان / سال':'هزار تومان / ماه')+'</em></div>'+
      (yearly?'<div class="mono" style="font-size:11px;color:var(--a2);margin-top:-14px;margin-bottom:18px">۲ ماه رایگان · صرفه‌جویی '+N.fmt(Math.round((1-p.y/(p.m*12))*100))+'٪</div>':'')+
      '<ul>'+p.feats.map(function(f){return '<li class="'+(f[1]?'':'off')+'">'+esc(f[0])+'</li>';}).join('')+'</ul>'+
      '<button class="btn '+(p.hot?'btn-primary':'btn-ghost')+' btn-block" data-buy="'+p.id+'">انتخاب '+esc(p.name)+'</button></div>';
  }).join('');
  N.revealScan();
}
function pricingBoot(){
  var tg=$('#pricing-toggle');
  if(tg&&!tg.dataset.bound){ tg.dataset.bound='1';
    tg.addEventListener('click',function(e){ var b=e.target.closest('button[data-cycle]'); if(!b)return;
      $$('button[data-cycle]',tg).forEach(function(x){x.classList.toggle('on',x===b);});
      renderPlans();
    });
  }
  var el=$('#price-grid');
  if(el&&!el.dataset.bound){ el.dataset.bound='1';
    el.addEventListener('click',function(e){
      var b=e.target.closest('[data-buy]'); if(!b)return;
      var p=null; PLANS.forEach(function(x){if(x.id===b.datasetBuy||x.id===b.dataset.buy)p=x;});
      if(!p)return;
      if(!N.me()){ toast('برای ادامه اول وارد شو ✦','info'); N.go('login'); N.store.pending=p.id; N.save(N.store); return; }
      var u=N.me(), was=u.plan;
      u.plan=p.id; N.save(N.store);
      toast('اشتراک «'+p.name+'» فعال شد — سه‌شنبه اول، دانه‌ات در راه است','ok');
      setTimeout(function(){ N.go('dashboard'); },700);
      if(was!==p.id) document.dispatchEvent(new CustomEvent('dun:auth'));
    });
  }
  var faq=$('#faq');
  if(faq&&!faq.dataset.bound){ faq.dataset.bound='1';
    faq.addEventListener('click',function(e){
      var q=e.target.closest('.qa'); if(!q)return;
      var open=q.classList.contains('open');
      $$('.qa',faq).forEach(function(x){ x.classList.remove('open'); var a=$('.ans',x); if(a)a.style.maxHeight='0px'; });
      if(!open){ q.classList.add('open'); var a=$('.ans',q); if(a) a.style.maxHeight=a.scrollHeight+'px'; }
    });
  }
  renderPlans();
}

/* ================= FEATURES counters ================= */
function featuresBoot(){
  $$('[data-count]').forEach(function(el){
    if(el.dataset.done)return; el.dataset.done='1';
    N.countUp(el,parseFloat(el.dataset.count),parseInt(el.dataset.dec||'0',10),el.dataset.suffix||'');
  });
}

/* ================= AUTH ================= */
function strength(v){
  var s=0;
  if(v.length>=8)s++; if(v.length>=12)s++;
  if(/[A-Z]/.test(v)||/[\u0600-\u06FF]/.test(v)&&/[^\W\d_]/.test(v))s++;
  if(/[0-9]/.test(v))s++; if(/[^A-Za-z0-9\u0600-\u06FF]/.test(v))s++;
  return Math.min(s,5);
}
var LBL=['خیلی ضعیف','ضعیف','متوسط','خوب','قوی','فوق‌العاده 🔒'];
function authBoot(){
  var shells=$$('.auth-shell'); if(!shells.length)return;
  shells.forEach(function(shell){
    if(shell.dataset.bound)return; shell.dataset.bound='1';
    shell.addEventListener('click',function(e){
      var eye=e.target.closest('[data-eye]');
      if(eye){ var inp=document.getElementById(eye.dataset.eye); if(inp){ var t=inp.type==='password'?'text':'password'; inp.type=t; eye.textContent=t==='password'?'👁':'🙈'; } return; }
      var lg=e.target.closest('[data-forget]');
      if(lg){ e.preventDefault(); toast('لینک بازیابی برای '+ (lg.dataset.forget||'ایمیلت') +' ارسال شد ✉','ok'); return; }
    });
    shell.addEventListener('input',function(e){
      var el=e.target;
      if(el.matches('input,textarea')) el.classList.toggle('has',!!el.value);
      if(el.id==='r-pass'){ var s=strength(el.value); var box=document.getElementById('meter');
        if(box) $$('i',box).forEach(function(b,i){ b.className=i<s?(s>=4?'good':s>=3?'mid':'on'):''; });
        var t=document.getElementById('meter-txt'); if(t)t.textContent='قدرت رمز: '+LBL[s];
      }
      var fm=el.closest('form'); if(fm) fm.classList.remove('shake');
    });
  });
  var lf=document.getElementById('login-form'), rf=document.getElementById('register-form');
  if(lf&&!lf.dataset.b){ lf.dataset.b='1'; lf.addEventListener('submit',function(e){ e.preventDefault(); doLogin(lf); }); }
  if(rf&&!rf.dataset.b){ rf.dataset.b='1'; rf.addEventListener('submit',function(e){ e.preventDefault(); doRegister(rf); }); }
  /* oauth demo */
  $$('[data-oauth]').forEach(function(b){ if(b.dataset.b)return; b.dataset.b='1';
    b.addEventListener('click',function(){ toast('ورود با '+b.dataset.oauth+' (دمو) — کد تأیید ارسال شد','info'); }); });
  /* password toggle (register shell has no eye click target above? it does) */
}
function setTab(t){
  $$('.tabs button').forEach(function(b){ b.classList.toggle('on',(b.dataset.tab||b.dataset.view)===t); });
  $$('.auth-form').forEach(function(f){ f.classList.toggle('on',f.id===t+'-form'); });
  var h=$('#auth-side-h'); if(h) h.textContent = t==='login' ? 'خوش برگشتی، شب‌بیدار ✦' : 'بیایید شب‌ها را بیدار نگه داریم ✦';
}
function bad(id,msg){
  var f=$('#'+id); if(!f)return;
  var wrap=f.closest('.field'); if(wrap){ wrap.classList.add('bad'); var e=$('.err',wrap); if(e)e.textContent=msg; }
}
function clearBad(form){ $$('.field',form).forEach(function(f){f.classList.remove('bad');}); }
function shake(el){ if(!el)return; el.classList.add('shake'); setTimeout(function(){el.classList.remove('shake');},600); }
function doLogin(form){
  clearBad(form); var okAll=true;
  var em=$('#l-email').value.trim(), pw=$('#l-pass').value;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){ bad('l-email','ایمیل معتبر نیست'); okAll=false; }
  if(pw.length<4){ bad('l-pass','رمز خیلی کوتاهه'); okAll=false; }
  if(!okAll){ shake(form); toast('فرم رو دوباره چک کن','err'); return; }
  var u=null; N.store.users.forEach(function(x){ if(x.email.toLowerCase()===em.toLowerCase())u=x; });
  if(!u){ bad('l-email','حسابی با این ایمیل نیست'); shake(form); toast('حساب پیدا نشد — ثبت‌نام کن','err'); return; }
  if(u.pass!==pw){ bad('l-pass','رمز نادرست است'); shake(form); toast('رمز اشتبه 🙃','err'); return; }
  N.store.session=u.email; N.save(N.store);
  toast('خوش اومدی '+u.name.split(' ')[0]+' ✦','ok');
  N.renderNavTail(); document.dispatchEvent(new CustomEvent('dun:auth'));
  setTimeout(function(){ N.go('dashboard'); },500);
}
function doRegister(form){
  clearBad(form); var okAll=true;
  var nm=$('#r-name').value.trim(), em=$('#r-email').value.trim(), pw=$('#r-pass').value, p2=$('#r-pass2').value, ag=$('#r-terms');
  if(nm.length<3){ bad('r-name','اسم کامل‌تر بنویس'); okAll=false; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){ bad('r-email','ایمیل معتبر نیست'); okAll=false; }
  if(strength(pw)<3){ bad('r-pass','رمز باید حداقل ۸ کاراکتر با عدد و حرف باشه'); okAll=false; }
  if(pw!==p2){ bad('r-pass2','دو رمز یکی نیست'); okAll=false; }
  if(!ag.checked){ toast('قبول شرایط رو تیک بزن ✍','err'); okAll=false; }
  var dup=false; N.store.users.forEach(function(x){ if(x.email.toLowerCase()===em.toLowerCase())dup=true; });
  if(dup){ bad('r-email','این ایمیل قبلاً ثبت شده'); okAll=false; }
  if(!okAll){ shake(form); toast('یک دو تا مورد نیاز به اصلاح داره','err'); return; }
  var user={name:nm,email:em,pass:pw,role:'عضو کلوپ',plan:N.store.pending||'solo',joined:new Date().toLocaleDateString('fa-IR')};
  N.store.users.push(user); N.store.session=em; N.store.pending=null; N.save(N.store);
  toast('حساب «'+nm+'» ساخته شد 🎉','ok');
  N.renderNavTail(); document.dispatchEvent(new CustomEvent('dun:auth'));
  setTimeout(function(){ N.go('dashboard'); },650);
}

/* ================= CONTACT ================= */
function contactBoot(){
  var f=$('#contact-form'); if(!f||f.dataset.b)return; f.dataset.b='1';
  f.addEventListener('input',function(e){
    var el=e.target;
    if(el.matches('input,textarea,select')){ var w=el.closest('.field'); if(w) w.classList.toggle('filled',!!el.value); }
    f.classList.remove('shake');
  });
  f.addEventListener('submit',function(e){
    e.preventDefault();
    $$('.field',f).forEach(function(x){x.classList.remove('bad');});
    var ok=true;
    var nm=$('#c-name').value.trim(), em=$('#c-email').value.trim(), tp=$('#c-type').value, ms=$('#c-msg').value.trim();
    if(nm.length<2){ bad('c-name','اسمت رو بنویس'); ok=false; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){ bad('c-email','ایمیل معتبر نیست'); ok=false; }
    if(!tp){ bad('c-type','موضوع را انتخاب کن'); ok=false; }
    if(ms.length<10){ bad('c-msg','یه کم بیشتر توضیح بده (۱۰+ کاراکتر)'); ok=false; }
    if(!ok){ shake(f); toast('فرم کامل نیست','err'); return; }
    var btn=$('button[type=submit]',f); var old=btn.innerHTML;
    btn.disabled=true; btn.innerHTML='در حال ارسال…';
    setTimeout(function(){
      btn.disabled=false; btn.innerHTML=old;
      var track=$('#c-track'); if(track){ var no=N.store.ticket=(N.store.ticket||4100)+1;
        track.innerHTML='<span class="chip"><i></i>شماره پیگیری: <b class="mono">'+no+'</b></span>'; }
      var body=$('#contact-body');
      body.innerHTML='<div class="form-ok"><span class="big">☕</span><h3>میزت گرم شد!</h3>'+
        '<p style="color:var(--ink2);max-width:44ch;margin:12px auto 22px">قبل از نیمه‌شب جواب می‌دهیم، '+esc(nm)+' جان. یه کپی هم برات ایمیل شد.</p>'+
        '<button class="btn btn-ghost btn-sm" data-view="works">تا آن زمان دانه‌ها را بو کن</button></div>';
      toast('پیام ارسال شد ☕','ok');
      N.revealScan();
    },1100);
  });
}

/* ================= DASHBOARD ================= */
function spark(seed,n){ var a=[],v=50; for(var i=0;i<n;i++){ v+=Math.sin((i+seed)*1.3)*11+(i%3===0?6:-3); a.push(Math.max(12,Math.min(96,v))); } return a; }
function sparkPath(vals,W,H){
  var max=Math.max.apply(null,vals),min=Math.min.apply(null,vals),rg=Math.max(max-min,1);
  return 'M'+vals.map(function(v,i){ return (i*(W/(vals.length-1))).toFixed(1)+' '+(H-4-((v-min)/rg)*(H-8)).toFixed(1); }).join(' L ');
}
function chartSvg(vals){
  var W=600,H=200,pad=26,max=Math.max.apply(null,vals)*1.15;
  var pts=vals.map(function(v,i){ return [pad+i*((W-pad*2)/(vals.length-1)), H-pad-(v/max)*(H-pad*2)]; });
  var d='M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' L ');
  var area=d+' L '+pts[pts.length-1][0]+' '+(H-pad)+' L '+pts[0][0]+' '+(H-pad)+' Z';
  var gl='';
  for(var g=0;g<4;g++){ var y=pad+g*((H-pad*2)/3); gl+='<line class="ch-g" x1="'+pad+'" y1="'+y+'" x2="'+(W-pad)+'" y2="'+y+'"/>'; }
  var dots=pts.map(function(p,i){ return '<circle class="ch-dot" cx="'+p[0]+'" cy="'+p[1]+'" r="3.6" style="transition-delay:'+(1.4+i*.07)+'s"/>'; }).join('');
  var labs=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر'].map(function(m,i){
    return '<text class="ch-t" x="'+pts[i][0]+'" y="'+(H-6)+'" text-anchor="middle">'+m+'</text>'; }).join('');
  return '<svg viewBox="0 0 600 200" preserveAspectRatio="none" id="chart" role="img" aria-label="نمودار رشد هفت ماهه">'+
    '<defs><linearGradient id="cgrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--a1)"/><stop offset=".5" style="stop-color:var(--a2)"/><stop offset="1" style="stop-color:var(--a3)"/></linearGradient>'+
    '<linearGradient id="agrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--a1);stop-opacity:.38"/><stop offset="1" style="stop-color:var(--a1);stop-opacity:0"/></linearGradient></defs>'+
    gl+'<path class="ch-area" d="'+area+'"/><path class="ch-line" d="'+d+'"/>'+dots+labs+'</svg>';
}
function gauge(label,pct,num){
  var r=38,C=2*Math.PI*r,off=(C*(1-pct/100)).toFixed(1);
  return '<div class="rg" style="--c:'+C+';--o:'+off+'"><svg viewBox="0 0 96 96" aria-label="'+esc(label)+'">'+
    '<defs><linearGradient id="rgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--a1)"/><stop offset="1" style="stop-color:var(--a2)"/></linearGradient></defs>'+
    '<circle class="b" cx="48" cy="48" r="'+r+'"/><circle class="v" cx="48" cy="48" r="'+r+'" stroke-dasharray="'+C+'" transform="rotate(-90 48 48)"/>'+
    '<text class="n" x="48" y="52" text-anchor="middle">'+esc(num)+'</text></svg><small>'+esc(label)+'</small></div>';
}
function ring(pct,color){
  var r=17,C=2*Math.PI*r,off=(C*(1-pct/100)).toFixed(1);
  return '<svg viewBox="0 0 44 44" aria-hidden="true"><circle class="pb" cx="22" cy="22" r="'+r+'"/>'+
    '<circle class="pv" cx="22" cy="22" r="'+r+'" stroke-dasharray="'+C+'" transform="rotate(-90 22 22)" style="--c:'+C+';--o:'+off+'"'+(color?' stroke="'+color+'"':'')+'/>'+
    '<text class="pc" x="22" y="26" text-anchor="middle">'+pct+'٪</text></svg>';
}
function planName(id){ var p=null; PLANS.forEach(function(x){if(x.id===id)p=x;}); return p?p.name:'تکی'; }
function dashBoot(){
  var v=$('#view-dashboard'); if(!v)return;
  var u=N.me();
  if(!u){ v.innerHTML='<div class="panel" style="text-align:center;padding:60px"><h3>ابتدا وارد شو</h3><p style="color:var(--ink2);margin:10px 0 22px">پنل کلوپ فقط برای اعضاست.</p><button class="btn btn-primary" data-view="login">ورود به کلوپ</button></div>'; return; }
  var fresh = v.dataset.user!==u.email;
  v.dataset.user=u.email;
  if(fresh){
    var seed=u.email.length;
    var initials=u.name.trim().split(/\s+/).map(function(w){return w.charAt(0);}).slice(0,2).join('');
    $('#dash-head').innerHTML='<span class="avatar-ring"><span class="avatar">'+esc(initials)+'</span></span>'+
      '<div><h2>سلام '+esc(u.name.split(' ')[0])+' <span class="grad">✦</span><span>DUN CLUB · پنل عضویت</span></h2></div>'+
      '<span class="status-chip"><i class="live"></i> کافه باز است · اشتراک '+esc(planName(u.plan))+'</span>'+
      '<div style="margin-inline-start:auto;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-view="pricing">تغییر اشتراک</button>'+
      '<button class="btn btn-line btn-sm" data-view="contact">رزرو میز</button></div>';
    var kpiData=[
      {l:'بسته‌های رُست‌شده',n:128,d:0,s:'',e:'+۱۲٪',dn:false,seed:seed},
      {l:'امتیاز کوپینگ',n:87.4,d:1,s:'',e:'+۰.۹',dn:false,seed:seed+1},
      {l:'بسته در راه',n:3,d:0,s:'',e:'سه‌شنبه می‌رسد',dn:true,seed:seed+2},
      {l:'امتیاز کلوپ',n:2450,d:0,s:'',e:'+۱۸۰',dn:false,seed:seed+3}
    ];
    $('#dash-kpis').innerHTML=kpiData.map(function(k){
      return '<div class="kpi"><small>'+esc(k.l)+'</small><b class="kpi-num" data-count="'+k.n+'" data-dec="'+k.d+'" data-suffix="'+esc(k.s)+'">۰</b>'+
        '<em class="'+(k.dn?'dn':'')+'">'+esc(k.e)+'</em>'+
        '<svg class="spark" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sgrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--a1)"/><stop offset="1" style="stop-color:var(--a2)"/></linearGradient></defs>'+
        '<path d="'+sparkPath(spark(k.seed,14),100,42)+'"/></svg></div>';
    }).join('');
    $('#p-chart').innerHTML='<h4>مصرف قهوهٔ تو <small>۷ ماه اخیر</small></h4>'+
      '<div class="big-total"><b>۴۲ فنجان</b><em>▲ ۳۱٪ نسبت به دورهٔ قبل</em></div>'+chartSvg(spark(seed,7));
    $('#p-gauges').innerHTML='<h4>موجودی و طعم <small>هر رُست تازه‌تر می‌شود</small></h4><div class="gauges">'+
      gauge('بسته‌های باز',62,'۶۲')+gauge('تازگی انبار',86,'۸۶')+gauge('میکروت‌لات',34,'۳۴')+'</div>';
    var orders=[
      ['اتیوپی یرگاچف ۲۵۰گ','رسیده · ۸ مهر',100,'ok','تحویل شد'],
      ['کلمبیا هوئیلکا ۱کگ','در راه · سه‌شنبه',65,'wait','در مسیر'],
      ['کنیا نیاری ۲۵۰گ','روی درام · ۲ مهر',30,'wait','در حال رُست'],
      ['گواتمالا آنتیگوا','رسیده · ۲۸ شهریور',100,'ok','تحویل شد'],
      ['میکروت‌لات کاستاریکا','تأیید پرداخت',8,'no','در صف رُست']
    ];
    $('#p-projects').innerHTML='<h4>بسته‌های من <small>آخرین ۵ ارسال</small></h4>'+
      orders.map(function(r){
        return '<div class="proj">'+ring(r[2])+'<em><b>'+esc(r[0])+'</b><small>'+esc(r[1])+'</small></em><span class="pill '+r[3]+'">'+esc(r[4])+'</span></div>';
      }).join('');
    $('#p-timeline').innerHTML='<h4>اتفاق‌های این هفته <small>LIVE</small></h4><div class="tline" id="tline">'+
      [['درام روشن شد — رُست کلمبیا تمام شد','۱۲ دقیقه پیش'],
       ['کوپینگ پنج‌شنبه: یرگاچف نوبت دوم','۳ ساعت پیش'],
       ['میکروت‌لات کنیا ۳۴ بسته شد — اعضای کلوپ اول می‌چشند','دیروز، ۱۸:۴۲'],
       ['پرداخت اشتراک «'+esc(planName(u.plan))+'» تأیید شد','۲ روز پیش'],
       ['کارگاه لاته‌آرت — تنها ۲ جای خالی ماند','۴ روز پیش']].map(function(f,i){
        return '<div class="ti" style="--i:'+i+'"><b>'+esc(f[0])+'</b><time>'+esc(f[1])+'</time></div>';
      }).join('')+'</div>';
    $('#dash-gates').innerHTML=[
      ['☕','رسپی‌های هفتگی','۳۲ رسپی دم‌آوری آماده'],['🎟','رزرو کوپینگ ماه','جای اعضا رزرو می‌شود'],['🛋','میز شبانهٔ کافه','برای اشتراک شب‌بیدار']].map(function(g,i){
        var locked=(u.plan==='solo'&&i>0)||(u.plan==='club'&&i===2);
        return '<div class="gate'+(locked?'':' unlocked')+'" data-lock="'+(locked?1:0)+'"><span class="lock">'+(locked?'🔒':'🔓')+'</span><b>'+esc(g[1])+'</b><p>'+esc(g[2])+'</p>'+
          (locked?'<button class="btn btn-primary btn-sm" style="margin-top:14px" data-view="pricing">با ارتقا باز شود</button>':'<button class="btn btn-line btn-sm" style="margin-top:14px" data-open="'+esc(g[1])+'">مشاهده</button>')+'</div>';
      }).join('');
  }
  /* draw-in animations (replay every visit) */
  var secs=$$('.dsec',v);
  secs.forEach(function(el){ el.style.animation='none'; });
  var k=$('#dash-kpis'), c=$('#p-chart'), g=$('#p-gauges'), pr=$('#p-projects'), tl=$('#tline');
  [k,c,g,pr,tl].forEach(function(el){ if(el) el.classList.remove('drawn','on'); });
  void v.offsetWidth;
  secs.forEach(function(el){ el.style.animation=''; });
  setTimeout(function(){ if(k)k.classList.add('drawn'); },250);
  setTimeout(function(){ if(c)c.classList.add('drawn'); },350);
  setTimeout(function(){ if(g)g.classList.add('drawn'); },450);
  setTimeout(function(){ if(pr)pr.classList.add('drawn'); },550);
  setTimeout(function(){ if(tl)tl.classList.add('on'); },620);
  if(fresh){ $$('#view-dashboard .kpi-num[data-count]').forEach(function(el){
      N.countUp(el,parseFloat(el.dataset.count),parseInt(el.dataset.dec||'0',10),el.dataset.suffix||''); }); }
  if(!v.dataset.bound){ v.dataset.bound='1';
    v.addEventListener('click',function(e){
      var b=e.target.closest('[data-open]'); if(b) toast('«'+b.dataset.open+'» باز شد ✦ (دمو)','ok');
    });
  }
}

/* ---------- boot hooks ---------- */
N.bootFn('works',worksBoot);
N.bootFn('pricing',pricingBoot);
N.bootFn('features',featuresBoot);
N.bootFn('login',authBoot);
N.bootFn('register',authBoot);
N.bootFn('contact',contactBoot);
N.bootFn('dashboard',dashBoot);
})();
