/* ── Content: edit these lists to update the site ── */
const SC='https://soundcloud.com/tfrnkln-296272056/';
const SP='https://open.spotify.com/album/';
const MUSIC=[
 {t:"Don't Care",k:'release',d:'2026',note:'Single · 2 tracks',url:SP+'3fs5ma0x7q7d4i9aSAsPZh',badge:'Latest single',img:'assets/covers/web/dont-care.jpg'},
 {t:'Franklin FM #001',k:'set',d:'Sep 2026',note:'Mix series',url:SC+'franklin-fm-001',badge:'New',img:'assets/covers/web/franklin-fm-001.jpg'},
 {t:'Keep On Dancing',k:'release',d:'2025',note:'Single',url:SP+'4xmpFcmGw4yy7OG128Rx6k',img:'assets/covers/web/keep-on-dancing.jpg'},
 {t:'Energy',k:'release',d:'2025',note:'Single',url:SP+'7E3DybwYh7DJCCuSY005so',img:'assets/covers/web/energy.jpg'},
 {t:'Fast Lane',k:'original',d:'Feb 2026',note:'Free download',url:SC+'thommy-franklin-fast-lane-free',img:'assets/covers/web/fast-lane.jpg'},
 {t:'Niet Thuis Events House Set',k:'set',d:'Nov 2025',note:'Live set',url:SC+'niet-thuis-events-house-set',img:'assets/covers/web/niet-thuis-house-set.jpg'},
 {t:'Portfolio Set',k:'set',d:'Oct 2025',note:'Tech House / UKG',url:SC+'thommy-franklin-portfolio-set-tech-house-uk-garage',img:'assets/covers/web/portfolio-set.jpg'},
 {t:'2FA',k:'original',d:'Aug 2025',note:'Original mix',url:SC+'2fa-original-mix',img:'assets/covers/web/2fa.jpg'},
 {t:'Melkweg Contest Set',k:'set',d:'Aug 2025',note:'Niet Thuis contest',url:SC+'nietthuis-event-melkweg-contest-set',img:'assets/covers/web/melkweg-contest-set.jpg'},
 {t:'Motion Blur',k:'original',d:'Aug 2025',note:'Original',url:SC+'motion-blur',img:'assets/covers/web/motion-blur.jpg'},
 {t:'Follow Me',k:'original',d:'May 2025',note:'ID · track concept',url:SC+'id-follow-me-track-concept-frnkln',img:'assets/covers/web/follow-me.jpg'},
 {t:'Tell You Straight (TF Edit)',k:'original',d:'Feb 2025',note:'jigitz · edit',url:SC+'jigitz-tell-you-straight-frnkln-edit-draft-version',img:'assets/covers/web/tell-you-straight-edit.jpg'}
];
const KIND={release:'Spotify',original:'SoundCloud',set:'DJ set'};
const kind=k=>k==='set'?t('kind.set'):KIND[k];
/* Performances, newest first. video: clip file in assets/clips/ (shows a "clip coming soon" frame until the file exists); poster: optional still */
const LIVE=[
 {t:"Sissi's Amsterdam",e:'CLOSECALL x Ghosts of Garage · First club gig',d:'Aug 2026',video:'assets/clips/Thommy_clip1.mp4',poster:'assets/clips/Thommy_clip1.jpg',link:'https://www.instagram.com/p/DdeiCcbDAYn/',label:'Watch on Instagram'}
];

const $=s=>document.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* language (strings in i18n.js): Dutch by default; ?lang=en or the NL/EN switch picks English, remembered per visitor */
let LANG='nl';
try{const q=new URLSearchParams(location.search).get('lang');if(q)localStorage.setItem('lang',q);LANG=q||localStorage.getItem('lang')||'nl'}catch(e){}
if(!UI[LANG])LANG='nl';
const t=(k,v)=>{let s=UI[LANG][k]??UI.nl[k]??k;if(v)for(const [a,b] of Object.entries(v))s=s.replace('{'+a+'}',b);return s};
const tl=s=>LANG==='nl'?(NL_DATA[s]??s):s;
const MONTHS_NL={Jan:'jan',Feb:'feb',Mar:'mrt',Apr:'apr',May:'mei',Jun:'jun',Jul:'jul',Aug:'aug',Sep:'sep',Oct:'okt',Nov:'nov',Dec:'dec'};
const td=d=>LANG==='nl'?d.replace(/\b[A-Z][a-z]{2}\b/,m=>MONTHS_NL[m]||m):d;
const ATTR={label:'aria-label',ph:'placeholder',alt:'alt',content:'content'};
const nlText=new Map();
function applyLang(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const title=el.tagName==='TITLE';if(!nlText.has(el))nlText.set(el,title?el.textContent:el.innerHTML);
    const v=LANG==='en'?EN[el.dataset.i18n]:nlText.get(el);if(v==null)return;
    if(title)document.title=v;else el.innerHTML=v});
  for(const [k,a] of Object.entries(ATTR))document.querySelectorAll(`[data-i18n-${k}]`).forEach(el=>{
    const store='nl'+k;if(!(store in el.dataset))el.dataset[store]=el.getAttribute(a)||'';
    el.setAttribute(a,LANG==='en'?(EN[el.getAttribute('data-i18n-'+k)]??el.dataset[store]):el.dataset[store])});
  document.querySelectorAll('[data-alt-lang]').forEach(el=>el.lang=LANG==='en'?'nl':'en');
  document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===LANG));
}
function setLang(l){
  if(l===LANG||!UI[l])return;LANG=l;try{localStorage.setItem('lang',l)}catch(e){}
  const u=new URL(location.href);if(u.searchParams.has('lang')){u.searchParams.delete('lang');history.replaceState(null,'',u)}
  applyLang();document.dispatchEvent(new Event('langchange'));
}
document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
if(LANG!=='nl')applyLang();
const onLang=f=>document.addEventListener('langchange',f);

/* nav */
function setMenu(open){$('#menu').classList.toggle('open',open);$('#menuBtn').setAttribute('aria-expanded',open);$('#menuBtn').textContent=open?t('close'):t('menu')}
onLang(()=>$('#menuBtn').textContent=$('#menu').classList.contains('open')?t('close'):t('menu'));
$('#menuBtn').onclick=()=>setMenu(!$('#menu').classList.contains('open'));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
document.addEventListener('click',e=>{if(!e.target.closest('.nav'))setMenu(false)});
document.querySelectorAll('#menu a').forEach(a=>a.onclick=()=>setMenu(false));

/* mobile bar: Listen · back to top · Book once past the hero (always on sub-pages); only the centred top button while the booking form is on screen */
const hero=$('#top'),booking=$('#booking'),seen={hero:!!hero,booking:false};
function setBar(){$('#mbar').classList.toggle('show',!seen.hero);$('#mbar').classList.toggle('compact',seen.booking)}
const barIO=new IntersectionObserver(es=>{es.forEach(e=>{seen[e.target===hero?'hero':'booking']=e.isIntersecting});setBar()},{threshold:0});
if(hero)barIO.observe(hero);if(booking)barIO.observe(booking);setBar();

/* fit each line of the hero name to its column */
function fitName(){
  const box=$('.hero-copy');if(!box)return;const W=box.clientWidth*.97;
  document.querySelectorAll('.name span').forEach(sp=>{sp.style.fontSize='';sp.style.maxWidth='none';const w=sp.scrollWidth;const f=parseFloat(getComputedStyle(sp).fontSize);sp.style.fontSize=Math.min(f*W/w,sp.classList.contains('ln2')?190:150)+'px';sp.style.maxWidth=''});
}
fitName();addEventListener('resize',fitName);document.fonts.ready.then(fitName);

/* ticker */
function ticker(){if($('#tk'))$('#tk').innerHTML=t('ticker').map(w=>`${w}<i></i>`).join('')}
ticker();onLang(ticker);

/* sleeve art */
function art(cv,seed,title){
  const c=cv.getContext('2d'),w=cv.width,h=cv.height;
  let s=seed*9301+49297;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  const pals=[['#2d4bff','#070a12'],['#8fe3ff','#2d4bff'],['#dde3ee','#56617a'],['#0e1320','#8fe3ff'],['#2d4bff','#8fe3ff'],['#1a2240','#dde3ee']];
  const p=pals[seed%pals.length];
  const g=c.createLinearGradient(0,0,w*rnd(),h);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);
  c.fillStyle=g;c.fillRect(0,0,w,h);
  const cx=w*(.3+rnd()*.4),cy=h*(.3+rnd()*.4);
  for(let r=w*.9;r>8;r-=w*(.03+rnd()*.03)){c.strokeStyle=`rgba(255,255,255,${.05+rnd()*.18})`;c.lineWidth=1+rnd()*3;c.beginPath();c.arc(cx,cy,r,0,7);c.stroke()}
  c.fillStyle='rgba(7,10,18,.9)';c.fillRect(0,h*.78,w,h*.22);
  c.fillStyle='#dde3ee';c.textBaseline='middle';c.textAlign='left';
  c.font=`900 ${w*.07}px Archivo,"Arial Black",sans-serif`;
  if(title)c.fillText(title.toUpperCase(),w*.06,h*.89,w*.72);
  c.fillStyle='#8fe3ff';c.textAlign='right';c.font=`600 ${w*.045}px "JetBrains Mono",monospace`;c.fillText('TF',w*.94,h*.89);
}
function renderMusic(k){
  const all=MUSIC.map((m,i)=>({...m,i})).filter(m=>k==='all'||m.k===k);
  const TOP=5,list=all.slice(0,TOP),more=all.slice(TOP);
  $('#moreList').innerHTML=more.map(m=>`<li><a href="${m.url}" target="_blank" rel="noopener"><span class="mt">${m.t}</span><span class="mm">${tl(m.note)} · ${td(m.d)} · ${kind(m.k)}</span><span class="ma"><svg class="ext" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11L11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="sr">${t('newtab')}</span></a></li>`).join('');
  $('.more').hidden=!more.length;$('.music-grid').classList.toggle('solo',!more.length);
  $('#releases').innerHTML=list.length?list.map(m=>`<a class="rel" href="${m.url}" target="_blank" rel="noopener"><div class="sleeve"><div class="disc"></div>${m.img?`<img class="cover" src="${m.img}" alt="${t('cover',{t:m.t})}" width="500" height="500" loading="lazy">`:`<canvas width="440" height="440" data-i="${m.i}"></canvas>`}${m.badge?`<span class="badge">${tl(m.badge)}</span>`:''}</div><h3>${m.t}<span class="sr"> ${t('newtab')}</span></h3><div class="meta"><span>${tl(m.note)} · ${td(m.d)}</span><b>${kind(m.k)}</b></div></a>`).join(''):`<p class="eyebrow">${t('nothing')}</p>`;
  $('#releases').querySelectorAll('canvas').forEach(c=>art(c,+c.dataset.i+1,MUSIC[c.dataset.i].t));
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderMusic(b.dataset.k);
});

/* portrait placeholder */
function portrait(){
  const cv=$('#portrait'),c=cv.getContext('2d'),w=cv.width,h=cv.height;
  const g=c.createRadialGradient(w*.5,h*.35,10,w*.5,h*.4,h*.8);g.addColorStop(0,'#2d4bff');g.addColorStop(.6,'#0e1320');g.addColorStop(1,'#070a12');
  c.fillStyle=g;c.fillRect(0,0,w,h);
  c.fillStyle='rgba(7,10,18,.85)';c.beginPath();c.arc(w*.5,h*.38,w*.17,0,7);c.fill();
  c.beginPath();c.ellipse(w*.5,h*.92,w*.38,h*.3,0,Math.PI,0);c.fill();
  for(let y=0;y<h;y+=4){c.fillStyle='rgba(143,227,255,.04)';c.fillRect(0,y,w,1)}
}

/* copy helpers */
if($('#copyBio'))$('#copyBio').onclick=()=>{const o=$('#copied');o.dataset.label='';try{navigator.clipboard.writeText($('#bioText').textContent).then(()=>o.textContent=t('bioCopied'),()=>{getSelection().selectAllChildren($('#bioText'));o.textContent=t('bioSelected')})}catch(e){getSelection().selectAllChildren($('#bioText'))}};
onLang(()=>{if($('#copyMail'))$('#copyMail').textContent=t('copy');if($('#copied'))$('#copied').textContent=''});
if($('#copyMail'))$('#copyMail').onclick=e=>{const b=e.target;try{navigator.clipboard.writeText($('#mail').textContent).then(()=>{b.textContent=t('copied');setTimeout(()=>b.textContent=t('copy'),1600)},()=>getSelection().selectAllChildren($('#mail')))}catch(err){getSelection().selectAllChildren($('#mail'))}};

/* booking form */
if($('#bookForm')){
/* links like booking.html?type=Request%20EPK preselect the enquiry type */
const qt=new URLSearchParams(location.search).get('type');
if(qt&&[...$('#ftype').options].some(o=>o.value===qt))$('#ftype').value=qt;
const FIELDS={fname:'err.fname',femail:'err.femail',fevent:'err.fevent'};
function fieldError(id,key){const el=$('#'+id);el.dataset.err=key||'';el.setAttribute('aria-invalid',key?'true':'false');$('#'+id+'-err').textContent=key?t(key):''}
Object.keys(FIELDS).forEach(id=>$('#'+id).addEventListener('input',()=>{if($('#'+id).getAttribute('aria-invalid')==='true')fieldError(id,'')}));
function enquiryText(){const v=id=>$('#'+id).value.trim();return `${t('enq')}\n\n${t('enq.name')}: ${v('fname')}\n${t('enq.email')}: ${v('femail')}\n${t('enq.event')}: ${v('fevent')}\n${t('enq.date')}: ${v('fdate')||'-'}\n${t('enq.city')}: ${v('fcity')||'-'}\n${t('enq.type')}: ${$('#ftype').selectedOptions[0].textContent}\n\n${v('fmsg')}`}
$('#bookForm').addEventListener('submit',e=>{
  e.preventDefault();let first=null;
  Object.entries(FIELDS).forEach(([id,msg])=>{let m=$('#'+id).value.trim()?'':msg;if(id==='femail'&&!m&&!/^\S+@\S+\.\S+$/.test($('#femail').value.trim()))m='err.emailBad';fieldError(id,m);if(m&&!first)first=id});
  if(first){$('#'+first).focus();return}
  sendEnquiry();
});
/* POST to the site's API; without a backend (artifact preview, static host) fall back to copy-and-email */
const API=(document.querySelector('meta[name="api-base"]')?.content||'').replace(/\/$/,'');
const API_FIELDS={name:'fname',email:'femail',event:'fevent'};
let doneSent=false;
function doneText(){
  $('#doneMsg').innerHTML=t(doneSent?'doneSent':'doneCopy');
  if(doneSent)$('#doneMsg .mail-inline').textContent=$('#femail').value.trim();
  $('#editEnq').textContent=t(doneSent?'sendAnother':'edit');
}
function showDone(sent){
  doneSent=sent;doneText();$('#copyEnq').hidden=sent;
  $('#bookForm').classList.add('sent');$('#formDone').hidden=false;$('#formDone').focus();
}
onLang(()=>{
  if(!$('#sendBtn').disabled)$('#sendBtn').textContent=t('send');$('#copyEnq').textContent=t('copyEnq');doneText();
  Object.keys(FIELDS).forEach(id=>{const k=$('#'+id).dataset.err;if(k)$('#'+id+'-err').textContent=t(k)});
  if($('#formErr').textContent)$('#formErr').textContent=t('sendFail');
});
async function sendEnquiry(){
  const b=$('#sendBtn'),v=id=>$('#'+id).value.trim();$('#formErr').textContent='';
  b.disabled=true;b.textContent=t('sending');
  try{
    const r=await fetch(API+'/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:v('fname'),email:v('femail'),event:v('fevent'),date:v('fdate'),city:v('fcity'),type:v('ftype'),message:v('fmsg'),website:v('fweb')})});
    const j=await r.json().catch(()=>null);
    if(r.ok&&j?.ok)return showDone(true);
    if(r.status===422&&j?.errors){let f=null;Object.entries(API_FIELDS).forEach(([k,id])=>{fieldError(id,j.errors[k]?FIELDS[id]:'');if(j.errors[k]&&!f)f=id});if(f)return $('#'+f).focus()}
    if(r.status===429||r.status===502){$('#formErr').textContent=t('sendFail')}
    showDone(false);
  }catch(e){showDone(false)}
  finally{b.disabled=false;b.textContent=t('send')}
}
$('#copyEnq').onclick=e=>{const b=e.target;navigator.clipboard?.writeText(enquiryText()).then(()=>{b.textContent=t('copied');setTimeout(()=>b.textContent=t('copyEnq'),1800)},()=>{b.textContent=t('copyFailed');});};
$('#editEnq').onclick=()=>{if(doneSent){doneSent=false;$('#bookForm').reset();$('#formErr').textContent=''}$('#bookForm').classList.remove('sent');$('#formDone').hidden=true;$('#fname').focus()};
}

/* scrollspy (home): mark Music / Events in the nav while that section is in view */
const navLinks=[...document.querySelectorAll('#menu a[href^="#"]')];
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;navLinks.forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
navLinks.forEach(a=>{const t=document.querySelector(a.getAttribute('href'));if(t)spy.observe(t)});

if($('#wave')){
/* waveform strip */
const wv=$('#wave'),wc=wv.getContext('2d');let level=0,playing=false,tick=0;
function size(){wv.width=wv.offsetWidth*devicePixelRatio;wv.height=wv.offsetHeight*devicePixelRatio}
size();addEventListener('resize',()=>{size();if(!playing)requestAnimationFrame(draw)});
function draw(t){
  if(playing&&mode==='song'){songLevel();tick=song.duration?song.currentTime/song.duration*16:0}
  const w=wv.width,h=wv.height;wc.clearRect(0,0,w,h);
  const bw=5*devicePixelRatio,bars=Math.floor(w/bw),head=playing?Math.floor((tick/16)*bars):-1;
  for(let i=0;i<bars;i++){
    const base=Math.abs(Math.sin(i*.19)*Math.sin(i*.053+1)*.8+Math.sin(i*.9)*.2);
    const live=playing?Math.sin(i*.4+t*.01)*level*.35:0;
    const amp=Math.max(1,(base*.8+live)*h*.48);
    wc.fillStyle=playing&&i<=head?'#8fe3ff':'rgba(221,227,238,.18)';
    wc.fillRect(i*bw,h/2-amp,bw*.5,amp*2);
  }
  level*=.9;if(playing||!draw.once){draw.once=true;requestAnimationFrame(draw)}
}
requestAnimationFrame(draw);

/* 2-step loop on the record (synthesised in the browser) */
let ac,out,timer,next=0,idx=0,nb,keepAlive,mode=null;
const kick=[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],snare=[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hat=[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],bass=[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0];
const notes=[55,55,55,65.4,65.4,65.4,49,49,49,49,55,55,55,73.4,73.4,73.4];
function env(g,t,a,d){g.gain.setValueAtTime(a,t);g.gain.exponentialRampToValueAtTime(.001,t+d)}
function noise(){const b=ac.createBuffer(1,ac.sampleRate*.3,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
/* phone speakers can't play much below ~150 Hz, so kick and bass carry higher layers that small speakers can reproduce */
function hit(i,t){
  if(kick[i]){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);env(g,t,.9,.35);o.connect(g).connect(out);o.start(t);o.stop(t+.4);
    const k=ac.createOscillator(),kg=ac.createGain();k.type='triangle';k.frequency.setValueAtTime(420,t);k.frequency.exponentialRampToValueAtTime(160,t+.06);env(kg,t,.45,.08);k.connect(kg).connect(out);k.start(t);k.stop(t+.1);
    const c=ac.createBufferSource(),cf=ac.createBiquadFilter(),cg=ac.createGain();c.buffer=nb;cf.type='bandpass';cf.frequency.value=3200;env(cg,t,.25,.015);c.connect(cf).connect(cg).connect(out);c.start(t);c.stop(t+.03)}
  if(snare[i]){const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=nb;f.type='bandpass';f.frequency.value=1800;env(g,t,.5,.18);s.connect(f).connect(g).connect(out);s.start(t)}
  if(hat[i]){const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=nb;f.type='highpass';f.frequency.value=7000;env(g,t,.18,.05);s.connect(f).connect(g).connect(out);s.start(t)}
  if(bass[i]){const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();o.type='sawtooth';o.frequency.value=notes[i];f.type='lowpass';f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(120,t+.25);env(g,t,.35,.3);o.connect(f).connect(g).connect(out);o.start(t);o.stop(t+.32)
    const h=ac.createOscillator(),hf=ac.createBiquadFilter(),hg=ac.createGain();h.type='square';h.frequency.value=notes[i]*4;hf.type='lowpass';hf.frequency.setValueAtTime(1400,t);hf.frequency.exponentialRampToValueAtTime(300,t+.2);env(hg,t,.12,.22);h.connect(hf).connect(hg).connect(out);h.start(t);h.stop(t+.3)}
}
function sched(){
  const s16=60/132/4;
  while(next<ac.currentTime+.12){
    const swing=idx%2?s16*.24:0; /* garage shuffle on the off-16ths */
    hit(idx,next+swing);
    const i=idx;setTimeout(()=>{tick=i;if(kick[i]||snare[i])level=1},Math.max(0,(next-ac.currentTime)*1000));
    next+=s16;idx=(idx+1)%16;
  }
}
/* iOS: play through the silent switch (Safari 17+ audioSession; older Safari needs an <audio> element playing) */
function silentWav(){const n=8000,b=new ArrayBuffer(44+n),v=new DataView(b),w=(o,t)=>[...t].forEach((c,j)=>v.setUint8(o+j,c.charCodeAt(0)));
  w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);
  new Uint8Array(b,44).fill(128);return URL.createObjectURL(new Blob([b],{type:'audio/wav'}))}
function unlock(){
  if(navigator.audioSession)try{navigator.audioSession.type='playback'}catch(e){}
  if(!ac){
    ac=new (window.AudioContext||window.webkitAudioContext)();nb=noise();
    const comp=ac.createDynamicsCompressor(),gain=ac.createGain();comp.threshold.value=-10;comp.ratio.value=6;gain.gain.value=.9;
    comp.connect(gain).connect(ac.destination);out=comp;
    const iOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    if(iOS&&!navigator.audioSession){keepAlive=new Audio(silentWav());keepAlive.loop=true;keepAlive.setAttribute('playsinline','')}
  }
  ac.resume();
  const s=ac.createBufferSource();s.buffer=ac.createBuffer(1,1,22050);s.connect(ac.destination);s.start(0);
  keepAlive?.play().catch(()=>{});
}
/* The record plays the real single once its file is in assets/audio (start: seconds to begin at, e.g. the drop).
   Until the file exists, or if it can't play, it falls back to the loop above. */
const SONG={src:'assets/audio/dont-care.mp3',title:"Don't Care",start:0};
let song=null,songOK=true,an=null,anData;
function songLevel(){if(!an)return;an.getByteTimeDomainData(anData);let q=0;for(const v of anData){const d=(v-128)/128;q+=d*d}level=Math.min(1,Math.sqrt(q/anData.length)*2.2)} /* tuned for a loud club master */
function setPlaying(on,label){
  playing=on;$('#play').classList.toggle('on',on);$('#arm').classList.toggle('on',on);
  $('#side').textContent=on?label:t('tap');
  $('#play').setAttribute('aria-label',on?(mode==='song'?t('pause',{t:SONG.title}):t('stopLoop')):t('play',{t:SONG.title}));
  if(on)requestAnimationFrame(draw);
}
function startLoop(){mode='loop';next=ac.currentTime+.05;idx=0;timer=setInterval(sched,25);setPlaying(true,'2-STEP · 132')}
function loadSong(){
  song=new Audio(SONG.src);song.preload='auto';song.setAttribute('playsinline','');
  if(SONG.start)song.addEventListener('loadedmetadata',()=>{song.currentTime=SONG.start},{once:true});
  song.addEventListener('ended',()=>{song.currentTime=SONG.start||0;keepAlive?.pause();setPlaying(false)});
  try{an=ac.createAnalyser();an.fftSize=512;anData=new Uint8Array(an.fftSize);ac.createMediaElementSource(song).connect(an).connect(ac.destination)}catch(e){an=null}
}
$('#play').onclick=()=>{
  if(playing){
    if(mode==='song')song.pause();else clearInterval(timer);
    keepAlive?.pause();setPlaying(false);return;
  }
  unlock();
  if(!songOK)return startLoop();
  if(!song)loadSong();
  mode='song';setPlaying(true,SONG.title.toUpperCase());
  song.play().catch(err=>{
    if(err.name==='NotAllowedError'){setPlaying(false);return}
    songOK=false;song=null;an=null;if(playing)startLoop(); /* no file yet: play the loop instead */
  });
};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)$('#play').click()});
onLang(()=>{if(!playing)$('#side').textContent=t('tap');$('#play').setAttribute('aria-label',playing?(mode==='song'?t('pause',{t:SONG.title}):t('stopLoop')):t('play',{t:SONG.title}))});

}

/* performances */
const PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>';
const clipSoon=()=>`<div class="lights"></div><div class="eq" aria-hidden="true">${'<i></i>'.repeat(9)}</div><div class="scan"></div><span class="play" aria-hidden="true">${PLAY}</span><svg class="ph-mark" aria-hidden="true"><use href="#tf"/></svg><span class="soon">${t('clipSoon')}</span>`;
function renderLive(){
  const ext=`<svg class="ext" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11L11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr">${t('newtab')}</span>`;
  $('#clips').innerHTML=LIVE.map(p=>`<article class="clip"><div class="frame">${p.video
    ?`<video src="${p.video}${p.poster?`" poster="${p.poster}`:'#t=0.1'}" controls playsinline preload="metadata" aria-label="${t('clip')}: ${p.t}, ${tl(p.e)}"></video>`
    :clipSoon()
  }</div><div><h3>${p.t}</h3><div class="meta">${tl(p.e)} · ${td(p.d)}</div>${p.link?`<a class="set" href="${p.link}" target="_blank" rel="noopener">${p.label?tl(p.label):t('listen')} ${ext}</a>`:''}</div></article>`).join('')
  +`<article class="clip next"><div class="frame"><div class="eyebrow">${t('nextEyebrow')}</div><div class="big-q">${t('nextQ')}</div><p>${t('nextP')}</p><a class="btn ice sm" href="booking.html?type=Club%20show">${t('book')}</a></div></article>`;
  /* clip file not uploaded yet (or unplayable): show the placeholder instead of a broken player */
  $('#clips').querySelectorAll('video').forEach(v=>{
    v.addEventListener('error',()=>{v.parentElement.innerHTML=clipSoon()},{once:true});
    /* hover preview (mouse only): muted playback while the pointer is on the card; unmuting keeps it playing */
    if(reduce||!matchMedia('(hover:hover)').matches)return;
    const frame=v.parentElement,card=frame.parentElement;let preview=false;
    frame.insertAdjacentHTML('beforeend',`<span class="preview" aria-hidden="true">${t('preview')}</span>`);
    card.addEventListener('mouseenter',()=>{if(!v.paused)return;preview=true;v.muted=true;frame.classList.add('previewing');v.play().catch(()=>{preview=false;frame.classList.remove('previewing')})});
    card.addEventListener('mouseleave',()=>{if(!preview)return;preview=false;frame.classList.remove('previewing');v.pause();v.muted=false;v.load()});
    v.addEventListener('volumechange',()=>{if(preview&&!v.muted){preview=false;frame.classList.remove('previewing')}});
    v.addEventListener('click',e=>{if(!preview)return;e.preventDefault();v.muted=false;v.play()},true);
  });
}
if($('#clips')){renderLive();onLang(renderLive)}

/* first paint, then repaint art once fonts load */
function paint(){if($('#releases'))renderMusic(document.querySelector('.tabs [aria-pressed="true"]').dataset.k);if($('#portrait'))portrait()}
paint();document.fonts.ready.then(paint);onLang(paint);
