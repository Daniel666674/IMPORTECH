/* ============================================================================
   site.js — SHARED behavior across every real page: cart (persists via
   localStorage so it survives navigating between pages), mobile nav, and the
   scroll-reveal effect. Include after store-core.js on every page.
   ============================================================================ */
const CART_KEY='importech-cart';
function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]');}catch(e){return[];}}
function saveCart(c){try{localStorage.setItem(CART_KEY,JSON.stringify(c));}catch(e){}}
function fmtCOP(n){return'$'+Math.round(n).toLocaleString('es-CO');}
function cartSum(){return getCart().reduce((s,i)=>s+i.price*i.qty,0);}
function cartAdd(name,price){
  const c=getCart();const ex=c.find(i=>i.name===name);
  if(ex){ex.qty++;}else{c.push({name,price,qty:1});}
  saveCart(c);updateCartUI();openCart();
  const badge=document.getElementById('cart-count');
  if(badge){badge.classList.remove('pop');void badge.offsetWidth;badge.classList.add('pop');}
}
function cartDel(name){const c=getCart();const i=c.findIndex(x=>x.name===name);if(i>-1)c.splice(i,1);saveCart(c);updateCartUI();}
function cartQty(name,d){const c=getCart();const it=c.find(x=>x.name===name);if(!it)return;it.qty=Math.max(1,it.qty+d);saveCart(c);updateCartUI();}
function cartClear(){saveCart([]);updateCartUI();}
function updateCartUI(){
  const c=getCart();const count=c.reduce((s,i)=>s+i.qty,0);
  const badge=document.getElementById('cart-count');
  if(badge){badge.textContent=count;badge.className='cart-badge'+(count===0?' empty':'');}
  const box=document.getElementById('cart-items');
  if(!box)return;
  if(!c.length){box.innerHTML='<div class="cart-empty"><div class="ce-ico">🛒</div><p>Tu carrito está vacío</p></div>';}
  else{box.innerHTML=c.map(i=>`<div class="cart-item"><div class="ci-info"><div class="ci-name">${i.name}</div><div class="ci-price">${fmtCOP(i.price)} c/u</div></div><div class="ci-qty"><button onclick="cartQty(${JSON.stringify(i.name)},-1)">−</button><span class="cq-n">${i.qty}</span><button onclick="cartQty(${JSON.stringify(i.name)},1)">+</button></div><button class="ci-del" onclick="cartDel(${JSON.stringify(i.name)})">✕</button></div>`).join('');}
  document.getElementById('cart-total-amt').textContent=fmtCOP(cartSum());
  document.getElementById('cart-checkout-btn').disabled=!c.length;
}
function openCart(){document.getElementById('cart-overlay').classList.add('show');document.getElementById('cart-drawer').classList.add('open');}
function closeCart(){document.getElementById('cart-overlay').classList.remove('show');document.getElementById('cart-drawer').classList.remove('open');}
function checkoutWA(){
  const c=getCart();if(!c.length)return;
  const lines=c.map(i=>`• ${i.name} x${i.qty} — ${fmtCOP(i.price*i.qty)}`).join('\n');
  const msg=`Hola Importech, quiero pedir:\n${lines}\n\nTotal: ${fmtCOP(cartSum())}`;
  window.open('https://wa.me/573023232833?text='+encodeURIComponent(msg),'_blank');
}

/* ── MOBILE NAV ── */
function toggleMob(){const h=document.getElementById('nav-ham');const m=document.getElementById('mob-menu');const o=m.classList.toggle('show');h.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';}
function closeMob(){document.getElementById('mob-menu').classList.remove('show');document.getElementById('nav-ham').classList.remove('open');document.body.style.overflow='';}

/* ── REVEAL ON SCROLL ── */
(function(){
  function initReveal(){
    const els=document.querySelectorAll('.rev');
    if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
    const obs=new IntersectionObserver((entries)=>{
      let i=0;entries.forEach(x=>{if(x.isIntersecting){setTimeout(()=>x.target.classList.add('in'),i*80);obs.unobserve(x.target);i++;}});
    },{threshold:.08});
    els.forEach(el=>obs.observe(el));
    setTimeout(()=>document.querySelectorAll('.rev:not(.in)').forEach(e=>e.classList.add('in')),1400);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initReveal);
  else initReveal();
})();

/* ── COUNTER ANIMATION (stats sections) ── */
function animateCount(el){
  const target=parseFloat(el.dataset.target);
  const isFloat=el.dataset.float==='1';
  const duration=1800;let start=null;
  function step(ts){if(!start)start=ts;const p=Math.min((ts-start)/duration,1);const e=1-Math.pow(1-p,3);el.textContent=isFloat?(target*e).toFixed(1):Math.round(target*e);if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
(function(){
  function initCounters(){
    const cards=document.querySelectorAll('.stat-card');
    if(!cards.length) return;
    const counterObs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting&&!e.target.dataset.counted){e.target.dataset.counted='1';e.target.querySelectorAll('.stat-num').forEach(animateCount);counterObs.unobserve(e.target);}});
    },{threshold:.5});
    cards.forEach(c=>counterObs.observe(c));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initCounters);
  else initCounters();
})();

updateCartUI();
