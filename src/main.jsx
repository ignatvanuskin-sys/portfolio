import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const TELEGRAM_URL = 'https://t.me/EloQuncy'

// ---------- utils ----------
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile=()=>matchMedia('(max-width: 760px)').matches
const canHover=()=>matchMedia('(hover: hover) and (pointer: fine)').matches
class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={hasError:false} }
  static getDerivedStateFromError(){ return {hasError:true} }
  componentDidCatch(err){ console.error('Portfolio error:',err) }
  render(){ return this.state.hasError ? <div className="error-fallback"><p>Что-то пошло не так. Пиши в Telegram <a href={TELEGRAM_URL}>@EloQuncy</a></p></div> : this.props.children }
}
function useReveal(threshold=0.12){
  const ref=useRef(null); const [v,setV]=useState(false)
  useEffect(()=>{ const el=ref.current; if(!el||!el.isConnected) return
    if(!('IntersectionObserver' in window)){ setV(true); return }
    try{ const io=new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setV(true); io.disconnect() }},{threshold,rootMargin:'0px 0px -8% 0px'}); io.observe(el); return()=>io.disconnect() }catch(_){ setV(true) }
  },[threshold])
  return [ref,v]
}
function useMagnetic(strength=0.32){
  const ref=useRef(null)
  useEffect(()=>{ if(reducedMotion()||!canHover()) return; const el=ref.current; if(!el) return; let active=true; const move=e=>{ if(!active||!el.isConnected) return; try{ const r=el.getBoundingClientRect(); if(!r.width) return; el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*strength}px,${(e.clientY-r.top-r.height/2)*strength*1.15}px)` }catch(_){ } }; const leave=()=>{ if(!el.isConnected) return; el.style.transform='translate(0,0)' }; const enter=()=>{ if(!el.isConnected) return; el.style.willChange='transform' }; const off=()=>{ if(!el.isConnected) return; el.style.willChange='auto' }; el.addEventListener('mouseenter',enter); el.addEventListener('mousemove',move); el.addEventListener('mouseleave',e=>{leave();off()}); return()=>{ active=false; el.removeEventListener('mouseenter',enter); el.removeEventListener('mousemove',move); el.removeEventListener('mouseleave',leave)} },[strength])
  return ref
}
function useTilt(max=9){
  const ref=useRef(null)
  useEffect(()=>{ if(reducedMotion()||!canHover()) return; const el=ref.current; if(!el) return; let active=true; const onMove=e=>{ if(!active||!el.isConnected) return; try{ const r=el.getBoundingClientRect(); if(!r.width) return; const px=(e.clientX-r.left)/r.width-0.5; const py=(e.clientY-r.top)/r.height-0.5; el.style.transform=`perspective(1000px) rotateY(${px*max}deg) rotateX(${-py*max}deg) translateZ(0)`; el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`) }catch(_){ } }; const enter=()=>{ if(!el.isConnected) return; el.style.willChange='transform' }; const leave=()=>{ if(!el.isConnected) return; el.style.transform='perspective(1000px) rotateY(0) rotateX(0)'; el.style.willChange='auto' }; el.addEventListener('mouseenter',enter); el.addEventListener('mousemove',onMove); el.addEventListener('mouseleave',leave); return()=>{ active=false; el.removeEventListener('mouseenter',enter); el.removeEventListener('mousemove',onMove); el.removeEventListener('mouseleave',leave)} },[max])
  return ref
}
function useCountUp(target, trigger){
  const [val,setVal]=useState(0)
  useEffect(()=>{ if(!trigger) return; if(reducedMotion()){ setVal(target); return } let raf, start, active=true; const dur=1200; const step=t=>{ if(!active) return; if(!start) start=t; const p=Math.min((t-start)/dur,1); const e=1-Math.pow(1-p,3); setVal(Math.round(target*e)); if(p<1) raf=requestAnimationFrame(step) }; raf=requestAnimationFrame(step); return()=>{ active=false; cancelAnimationFrame(raf) }},[target,trigger])
  return val
}

// ---------- beam — beam.jakubantalik.com ----------
function BeamBorder({children,className='',intensity=0.9,radius=22, double=false}){
  return (
    <div className={`beam-wrap ${className} ${double?'is-double':''}`} style={{'--r':radius+'px','--intensity':intensity}}>
      <div className="beam-border" aria-hidden="true"></div>
      {double && <div className="beam-border second" aria-hidden="true"></div>}
      <div className="beam-content">{children}</div>
    </div>
  )
}

// ---------- orbs — orbs.jakubantalik.com ----------
function Orbs(){
  return (
    <div className="orbs" aria-hidden="true">
      <div className="orb orb-a"><span></span></div>
      <div className="orb orb-b"><span></span></div>
      <div className="orb orb-c"><span></span></div>
      <div className="orb orb-mega"></div>
    </div>
  )
}

// ---------- aurora + canvasui — canvasui.dev + reactbits aurora ----------
function Aurora(){
  return <div className="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
}
function CanvasGrid(){
  const ref=useRef(null)
  useEffect(()=>{
    if(reducedMotion()||isMobile()) return
    const c=ref.current; if(!c) return
    const ctx=c.getContext('2d',{alpha:true})
    let raf=0,w=0,h=0,dpr=1,visible=true,hidden=false,active=true
    const dotCount=48
    const dots=Array.from({length:dotCount},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.2+0.3,o:Math.random()*0.5+0.15,vx:(Math.random()-0.5)*0.0004,vy:(Math.random()-0.5)*0.0004}))
    const resize=()=>{ if(!c.isConnected) return; dpr=Math.min(devicePixelRatio||1,1.4); w=c.clientWidth||0; h=c.clientHeight||0; if(!w||!h) return; c.width=w*dpr; c.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0) }
    try{ resize() }catch(_){ return }
    const io=new IntersectionObserver(([e])=>{ visible=e.isIntersecting; if(visible&&!hidden&&active) raf=requestAnimationFrame(draw); else cancelAnimationFrame(raf)}, {threshold:0})
    io.observe(c)
    const onVis=()=>{ hidden=document.hidden; if(!hidden&&visible&&active) raf=requestAnimationFrame(draw) }
    document.addEventListener('visibilitychange',onVis)
    let tmr; const onResize=()=>{ clearTimeout(tmr); tmr=setTimeout(()=>{ try{resize()}catch(_){} },120) }
    addEventListener('resize',onResize,{passive:true})
    let last=0; const fps=30; const interval=1000/fps
    const draw=t=>{
      if(!active||!visible||hidden) return
      const dt=t-last
      if(dt<interval){ raf=requestAnimationFrame(draw); return }
      last=t-interval
      try{
        ctx.clearRect(0,0,w,h)
        dots.forEach(d=>{
          d.x+=d.vx; d.y+=d.vy; if(d.x<0||d.x>1) d.vx*=-1; if(d.y<0||d.y>1) d.vy*=-1
          const x=d.x*w,y=d.y*h, pulse=0.6+Math.sin(t*0.0008+d.x*10)*0.4
          ctx.fillStyle=`rgba(169,139,255,${d.o*pulse})`; ctx.beginPath(); ctx.arc(x,y,d.r,0,Math.PI*2); ctx.fill()
        })
      }catch(_){ return }
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return()=>{ active=false; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange',onVis); removeEventListener('resize',onResize) }
  },[])
  return <canvas ref={ref} className="canvas-grid" aria-hidden="true" />
}

// ---------- reactbits — shiny / split / blur ----------
function Shiny({children,className=''}){
  return <span className={`shiny ${className}`}>{children}<i aria-hidden="true"></i></span>
}
function Split({text}){
  return <span className="split">{text.split(' ').map((w,i)=><span key={i} className="split-w" style={{'--d':(i*55)+'ms'}}>{w}</span>)}</span>
}
function BlurReveal({children,delay=0}){
  const [ref,vis]=useReveal(0.15)
  return <span ref={ref} className={`blur-reveal ${vis?'is-in':''}`} style={{'--d':delay+'ms'}}>{children}</span>
}

// ---------- liquid metal — metal.jakubantalik.com ----------
function LiquidChrome({children}){
  return (
    <span className="liquid-chrome">
      <svg width="0" height="0" aria-hidden="true"><defs>
        <filter id="liquid2"><feTurbulence baseFrequency="0.012" numOctaves="2" seed="5" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="12"/></filter>
        <linearGradient id="chromeG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fff"/><stop offset="18%" stopColor="#E8E0FF"/><stop offset="36%" stopColor="#A98BFF"/><stop offset="58%" stopColor="#D4B570"/><stop offset="82%" stopColor="#fff"/><stop offset="100%" stopColor="#C4AFFF"/></linearGradient>
      </defs></svg>
      <span className="chrome-text" style={{filter:'url(#liquid2)'}}>{children}</span>
    </span>
  )
}

function HeroBackdrop(){
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-backdrop-fallback"></div>
      <div className="hero-backdrop-overlay"></div>
      <Aurora />
      <div className="hero-backdrop-grid"></div>
      <div className="hero-backdrop-vignette"></div>
    </div>
  )
}

function Header(){
  const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false); const menuRef=useRef(null)
  const links=[['#work','Мои проекты'],['#services','Услуги'],['#process','Процесс'],['#contact','Контакты']]
  useEffect(()=>{ let t=false,active=true; const onScroll=()=>{ if(!t&&active){ requestAnimationFrame(()=>{ if(active) setScrolled(window.scrollY>16); t=false }); t=true } }; addEventListener('scroll',onScroll,{passive:true}); return()=>{ active=false; removeEventListener('scroll',onScroll) }},[])
  useEffect(()=>{ document.body.classList.toggle('menu-open',open); if(open){ const k=e=>e.key==='Escape'&&setOpen(false); addEventListener('keydown',k); setTimeout(()=>menuRef.current?.querySelector('a')?.focus(),30); return()=>removeEventListener('keydown',k)} },[open])
  useEffect(()=>{ const m=document.querySelector('main'), f=document.querySelector('.footer'); if(open){ m?.setAttribute('inert',''); f?.setAttribute('inert','') } else { m?.removeAttribute('inert'); f?.removeAttribute('inert')} },[open])
  return (
    <header className={`header ${scrolled?'is-scrolled':''}`}>
      <a className="logo" href="#main" onClick={()=>setOpen(false)} aria-label="EloQuncy на главную"><span className="logo-mark">EQ</span><b>EloQuncy</b><i>— Senior Dev</i></a>
      <nav className="desktop-nav" aria-label="Навигация">{links.map(([h,l])=><a key={h} href={h}><span>{l}</span></a>)}</nav>
      <a className="button small desktop-cta" href="#contact"><span>Обсудить проект</span></a>
      <button className="menu-button" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}><span className="menu-lines" aria-hidden="true"><i></i><i></i><i></i></span><span>{open?'Закрыть':'Меню'}</span></button>
      <div className={`mobile-menu ${open?'is-open':''}`} id="mobile-menu" hidden={!open} ref={menuRef} aria-hidden={!open}>
        <div className="mobile-links">{links.map(([h,l],i)=><a key={h} href={h} onClick={()=>setOpen(false)}><span>{String(i+1).padStart(2,'0')}</span>{l}</a>)}</div>
        <a className="button" href="#contact" onClick={()=>setOpen(false)}>Написать в Telegram</a>
      </div>
    </header>
  )
}

function Hero(){
  const magnet=useMagnetic(0.34); const tilt=useTilt(8)
  return (
    <section className="hero section" aria-labelledby="hero-title">
      <HeroBackdrop />
      <CanvasGrid />
      <Orbs />
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-copy">
        <span className="kicker reveal-kicker"><i aria-hidden="true"></i> EloQuncy / Senior Product Developer <em>свободен</em></span>
        <h1 id="hero-title" className="hero-title">
          <span className="line"><Shiny><Split text="Сайты" /></Shiny><span className="title-mark">— опыт 6+ лет</span></span>
          <span className="line accent"><span>боты</span><LiquidChrome>автоматизация</LiquidChrome></span>
        </h1>
        <p className="hero-desc"><BlurReveal delay={120}>Делаю сайты, Telegram-ботов и email-рассылки для бизнеса.</BlurReveal> <BlurReveal delay={220}>Без агентств: один исполнитель, фикс цены, запуск за 1–2 недели.</BlurReveal> <BlurReveal delay={320}>Покажу работающий прототип через 2 дня — без длинных смет.</BlurReveal></p>
        <div className="hero-actions">
          <a ref={magnet} href="#contact" className="button magnet primary"><span>Обсудить задачу</span><b aria-hidden="true">↗</b><span className="button-beam" aria-hidden="true"></span></a>
          <span className="status"><i aria-hidden="true"></i><span>Отвечаю <strong>сегодня</strong></span></span>
        </div>
        <div className="hero-meta"><span>6+ лет опыта</span><span>50+ запусков</span><span>Telegram-боты</span><span>Сайты</span><span>Email-рассылки</span></div>
      </div>

      <BeamBorder className="hero-card" radius={28} intensity={1} double>
        <div ref={tilt} className="hero-card-inner tilt-card">
          <div className="tilt-glow" aria-hidden="true"></div>
          <div className="hero-card-top"><span className="live"><i></i> live preview</span><span className="card-kicker">WEB / BOT / AUTO</span></div>
          <div className="hero-visual" aria-hidden="true">
            <div className="mini-window">
              <div className="mini-dots"><i></i><i></i><i></i></div>
              <div className="mini-bars"><i></i><i></i><i></i><i></i></div>
              <div className="mini-bubbles"><span>Хочу записаться</span><span className="out">Выберите время →</span><span>Пятница, 14:00 ✓</span></div>
            </div>
            <div className="liquid-wrap"><div className="glass-orb"><span></span></div></div>
          </div>
          <div className="hero-card-bottom"><span>Листайте ↓</span><b>Нажми на проект → открой кейс</b></div>
        </div>
      </BeamBorder>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-inner"><span>6+ лет опыта</span><span>Telegram-боты</span><span>Веб-сайты</span><span>Автоматизация</span><span>API интеграции</span><span>Mini App</span><span>Production-ready</span><span>50+ запусков</span></div>
        <div className="marquee-inner" aria-hidden="true"><span>6+ лет опыта</span><span>Telegram-боты</span><span>Веб-сайты</span><span>Автоматизация</span><span>API интеграции</span><span>Mini App</span><span>Production-ready</span><span>50+ запусков</span></div>
      </div>
    </section>
  )
}

const cases=[
  {
    title:'Abramenko Studio',
    type:'Telegram-бот · Салон красоты',
    handle:'@abramenko_test_bot',
    link:'https://t.me/abramenko_test_bot',
    task:'Администратор салона не успевала отвечать на звонки и сообщения в течение дня — клиенты уходили к конкурентам, а часть записей терялась из-за двойных броней.',
    role:'Онлайн-запись · Напоминания · Админ-панель · Защита от дублей',
    solution:'Бот записывает клиента 24/7: услуга → мастер → дата → время → подтверждение. Сам напоминает о визите за 24 часа и за 2 часа. Администратор видит все записи и расписание в одной панели, бот не даёт занять один слот дважды.',
    metric:'1200+ записей · −70% пропусков',
    proof:'Запущен · работает · поддерживается',
    stack:'Telegram-бот · Админ-панель · 24/7',
    visual:'abramenko'
  },
  {
    title:'Search Barbershop',
    type:'Telegram-бот · Поиск клиентов',
    handle:'@searchbarbershop_bot',
    link:'https://t.me/searchbarbershop_bot',
    task:'Мастеру нужно находить новых клиентов и партнёров (другие салоны), но ручной поиск по картам занимал целый день — и сообщения приходилось писать каждому отдельно.',
    role:'Поиск салонов · Готовые сообщения · CRM лидов',
    solution:'Бот ищет барбершопы по городу за 30 секунд, показывает карточку (адрес, телефон, сайт), оценивает перспективность контакта и готовит два варианта сообщения владельцу. Все ответы попадают в CRM.',
    metric:'100+ контактов за сессию',
    proof:'Запущен · работает в Telegram',
    stack:'Telegram-бот · Поиск по картам · CRM',
    visual:'searchbarber'
  },
  {
    title:'NIGHT MARKET',
    type:'Сайт-магазин · E-commerce',
    handle:'night-market-iota.vercel.app',
    link:'https://night-market-iota.vercel.app/',
    task:'Кураторский магазин редких объектов для тёмных интерьеров. Нужен был необычный сайт с атмосферой — шаблонный Shopify не подходил, покупатели ждали «чёрного» дизайна.',
    role:'Дизайн · Вёрстка · Анимации · SEO · PWA',
    solution:'Тёмная палитра, hover-параллакс на карточках, анимации при скролле, каталог редких объектов с историей. Быстро грузится на телефоне, готов к рекламе.',
    metric:'95+ баллов Lighthouse',
    proof:'Запущен · можно посмотреть',
    stack:'Каталог · Корзина · Адаптив · PWA',
    visual:'night'
  },
  {
    title:'Maison d’Arôme',
    type:'Сайт-магазин · Премиум-парфюмерия',
    handle:'dior-nu.vercel.app',
    link:'https://dior-nu.vercel.app/',
    task:'Селективные ароматы для дома — свечи, диффузоры, спреи. Нужен сайт уровня Dior: с лимитированными капсулами, подарочными коробами и возможностью продавать дороже обычного.',
    role:'Каталог · Фильтры · Корзина · Журнал',
    solution:'Мега-меню по коллекциям, лимитированная капсула Осень-Зима (300 экземпляров), подарочная упаковка с лентой. Каждая карточка — как витрина бутика.',
    metric:'4 коллекции · лимитированные капсулы',
    proof:'Запущен · продаётся',
    stack:'Каталог · Корзина · Премиум-дизайн',
    visual:'dior'
  },
  {
    title:'NOVA FORMA',
    type:'Сайт-каталог · Строительная компания',
    handle:'construction-company-jjj6mz2t1-bbc-b318.vercel.app',
    link:'https://construction-company-jjj6mz2t1-bbc-b318.vercel.app/',
    task:'Строительная компания получала заявки только по сарафану — нужно было продающее представительство в интернете, чтобы клиенты сами оставляли заявку на расчёт.',
    role:'Каталог проектов · Услуги · Форма заявки · SEO',
    solution:'Сайт показывает опыт (12 лет, 86 проектов), гарантии, процесс работы из 7 шагов. Заявки уходят прямо в Telegram менеджера — клиент оставляет контакт за 30 секунд.',
    metric:'Заявки без рекламы',
    proof:'Запущен · приводит клиентов',
    stack:'Каталог · Фильтры · SEO · Форма заявки',
    visual:'construction'
  },
  {
    title:'Forge Atelier Residences',
    type:'Сайт-презентация · Премиум-недвижимость',
    handle:'forge-atelier-psi.vercel.app',
    link:'https://forge-atelier-psi.vercel.app/',
    task:'Девелоперу премиального жилого комплекса в Алматы нужен был не «сайт застройщика», а редакционная презентация — как у архитектурного бюро. Чтобы покупатели воспринимали проект как lifestyle, а не как «бетон по цене метра».',
    role:'Концепция · Editorial-дизайн · Архитектурная подача · Анимации',
    solution:'Сайт построен вокруг концепции The Living Horizon: тёплая тёмно-зелёная палитра, крупная типографика, фокус на свете и ландшафте. Каждая резиденция — как страница журнала: фото, свет, тишина, простор.',
    metric:'Editorial-стиль · премиум-сегмент',
    proof:'Запущен · можно посмотреть',
    stack:'Концепция · Дизайн · Анимации · Vercel',
    visual:'forge'
  },
  {
    title:'Email-рассылка',
    type:'Сервис · Email-автоматизация',
    handle:'email-production-0ea1.up.railway.app',
    link:'https://email-production-0ea1.up.railway.app/',
    task:'Бизнес вёл рассылки вручную — открываемость падала, клиенты не возвращались. Нужна автоматизация, которая сама ведёт подписчика от первого письма до покупки.',
    role:'Цепочки писем · Сегменты · A/B тесты · Аналитика',
    solution:'Готовые сценарии: новый подписчик → прогрев (3 письма) → акция → возврат. Сегменты по поведению, A/B темы, дашборд с метриками открытий и кликов.',
    metric:'42% открытий · 18% кликов · +31 лид',
    proof:'Запущен · 12 шаблонов · 3 цепочки',
    stack:'Цепочки · Сегменты · Аналитика · A/B',
    visual:'email-app'
  },
]

const MOCKS={
  'visual-barbershop':(
    <div className="mock tg-mock barber-mock">
      <div className="tg-head"><span><i>●</i> Острый Bot</span><em>Almaty · online</em></div>
      <div className="tg-bubble">Алибек — Мужская стрижка 3000₸</div>
      <div className="tg-bubble out">Пт 14:00 · 15:30 · 17:00 свободны</div>
      <div className="tg-bubble">14:00, беру ✓</div>
      <div className="tg-keyboard"><span>14:00</span><span className="active">15:30</span><span>17:00</span><span>Другая дата</span></div>
      <div className="tg-notify">🔔 Напомню за 24ч · лояльность -10%</div>
    </div>
  ),
  'visual-searchbarber':(
    <div className="mock sb-mock"><div className="sb-head"><span>@searchbarbershop_bot</span><em>● live</em></div><div className="sb-search"><i></i><span>Астана · Барбершоп</span><b>Найти</b></div><div className="sb-card"><span className="sb-card-top"><b>«Бородач»</b><em>Барбершоп</em></span><span className="sb-card-meta">📍 ул. Достык, 12 · 📞 +7 777 …</span><div className="sb-score"><span>AI 82/100</span><em>онлайн-запись: нет</em></div></div><div className="sb-leads"><span><b>«StyleCut»</b><em>✍️ написали · 82</em></span><span><b>«Брут»</b><em>🔥 высокий интерес</em></span></div><div className="sb-msg"><span>💬 Сообщение для «Бородач» →</span></div></div>
  ),
  'visual-abramenko':(
    <div className="mock abr-mock"><div className="abr-head"><span><i>✿</i> Abramenko Studio</span><em>салон · online</em></div><div className="abr-greet">Здравствуйте, Анастасия!<br/>Выберите услугу:</div><div className="abr-services"><span className="active"><i>●</i><b>Маникюр</b><em>гель-лак</em></span><span><i>●</i><b>Окрашивание</b><em>AirTouch</em></span><span><i>●</i><b>Стрижка</b><em>+ укладка</em></span><span><i>●</i><b>Уход</b><em>пилинг · маска</em></span></div><div className="abr-master"><b>Мастер:</b><span className="active">Анна</span><span>Мария</span><span>любая</span></div><div className="abr-slots"><span>14:00</span><span className="active">15:30</span><span>17:00</span><span>18:30</span></div><div className="abr-notify">🔔 Напомню за 24ч · лояльность +1 визит</div></div>
  ),
  'visual-email-app':(
    <div className="mock email-mock"><div className="email-head"><span><i>✉</i> Email Studio</span><em>live · railway</em></div><div className="email-stats"><div><b>42%</b><span>open rate</span></div><div><b>18%</b><span>click rate</span></div><div className="hot"><b>+31</b><span>новых лида</span></div></div><div className="email-flow"><div className="email-step">Новый подписчик</div><i className="email-arrow">→</i><div className="email-step active">Welcome</div><i className="email-arrow">→</i><div className="email-step">Прогрев · 3 письма</div><i className="email-arrow">→</i><div className="email-step">Акция</div></div><div className="email-templates"><span><b>12</b>шаблонов</span><span><b>3</b>цепочки</span><span><b>A/B</b>тесты</span></div></div>
  ),
  'visual-night':(
    <div className="mock night-mock"><div className="night-head"><span>NIGHT MARKET</span><em>after dark · 12 объектов</em></div><div className="night-grid"><span className="night-card"><i className="night-orb"></i><b>Obsidian</b><em>талисман</em></span><span className="night-card"><i></i><b>Smoke</b><em>артефакт</em></span><span className="night-card"><i></i><b>Velvet</b><em>редкость</em></span></div><div className="night-bar"><span>Objects for after dark</span><b>↗</b></div></div>
  ),
  'visual-dior':(
    <div className="mock dior-mock"><div className="dior-head"><span>Maison d’Arôme</span><em>слоновая кость · лента</em></div><div className="dior-grid"><span><b>Noir Fumé</b><em>уд · амбра</em></span><span><b>Bois Sacré</b><em>сандал · ладан</em></span><span><b>Jardin Blanc</b><em>тубероза</em></span><span className="active"><b>Oud & Ambre</b><em>1,2кг · 300 экз</em></span></div><div className="dior-price"><b>16 500 ₽</b><span>→ В корзину</span></div></div>
  ),
  'visual-construction':(
    <div className="mock constr-mock"><div className="constr-head"><span>NOVA FORMA</span><em>arch · constr</em></div><div className="constr-hero"><h4>Создаем пространства,<br/>которые остаются</h4><div className="constr-cta">Обсудить проект ↗</div></div><div className="constr-stats"><span><b>12</b>лет опыта</span><span><b>86</b>проектов</span><span><b>5</b>лет гарантии</span></div><div className="constr-cards"><span className="active"><i></i><b>Резиденции</b><em>Сосновый склон</em></span><span><i></i><b>Коммерция</b><em>Порт · шоурум</em></span><span><i></i><b>Отель</b><em>Северный сад</em></span></div></div>
  ),
  'visual-forge':(
    <div className="mock forge-mock"><div className="forge-top"><span className="forge-mark"><i></i>FORGE ATELIER</span><em>The Living Horizon</em></div><div className="forge-hero"><h5>A collection of homes,<br/><em>shaped around light.</em></h5></div><div className="forge-meta"><span>Алматы</span><i>·</i><span>24 резиденции</span><i>·</i><span>2027</span></div><div className="forge-cards"><span className="forge-card active"><span className="forge-num">01</span><b>Horizon House</b><em>320 м² · 4 спальни</em></span><span className="forge-card"><span className="forge-num">02</span><b>Garden Pavilion</b><em>280 м² · панорамный сад</em></span></div><div className="forge-foot"><span>● private viewing</span><b>Запросить брошюру ↗</b></div></div>
  ),
  // 'visual-chart' removed — analytics bot case dropped
}

function ProjectMock({visualClass}){
  return MOCKS[visualClass] || null
}

function ProjectRow({item,index,onOpen,visualClass}){
  const [ref,vis]=useReveal(); const [hover,setHover]=useState(false); const tilt=useTilt(6)
  return (
    <button ref={ref} className={`project-row ${vis?'is-visible':''} ${hover?'is-hover':''}`} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocus={()=>setHover(true)} onBlur={()=>setHover(false)} onClick={onOpen} style={{'--d':index*80+'ms'}} aria-label={`${item.title}. ${item.task}`}>
      <span className="project-index">0{index+1}</span>
      <div className="project-copy"><span className="project-type"><i></i>{item.type}<em>{item.metric}</em></span><h3>{item.title} {item.handle && <span className="project-handle">{item.handle}</span>}</h3><p>{item.task} <span className="proof">{item.proof}</span></p>{item.stack && <span className="project-stack">{item.stack}</span>}</div>
      <div ref={tilt} className={`project-preview ${visualClass} ${hover?'is-playing':''} tilt-card`} aria-hidden="true">
        <div className="tilt-glow" aria-hidden="true"></div>
        <ProjectMock visualClass={visualClass} />
        <span className="preview-beam" aria-hidden="true"></span>
      </div>
      <span className="project-arrow" aria-hidden="true"><span>↗</span></span>
    </button>
  )
}

function CaseModal({item,onClose,returnRef}){
  const ref=useRef(null)
  useEffect(()=>{
    const onKey=e=>{
      if(e.key==='Escape'){ onClose(); return }
      if(e.key!=='Tab') return
      const root=ref.current; if(!root) return
      const els=[...root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el=>!el.hasAttribute('hidden')&&el.offsetParent!==null)
      if(!els.length) return
      const f=els[0], l=els[els.length-1]
      if(e.shiftKey&&(document.activeElement===f||!root.contains(document.activeElement))){ e.preventDefault(); l.focus() }
      else if(!e.shiftKey&&(document.activeElement===l||!root.contains(document.activeElement))){ e.preventDefault(); f.focus() }
    }
    addEventListener('keydown',onKey); document.body.classList.add('dialog-open')
    const main=document.querySelector('main'), header=document.querySelector('.header'), footer=document.querySelector('.footer')
    ;[main,header,footer].forEach(el=>el?.setAttribute('inert',''))
    const prev=document.activeElement; ref.current?.querySelector('[data-autofocus]')?.focus()
    return()=>{ removeEventListener('keydown',onKey); document.body.classList.remove('dialog-open'); [main,header,footer].forEach(el=>el?.removeAttribute('inert')); (returnRef.current||prev)?.focus?.()}
  },[onClose,returnRef])
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <article className="modal-beam" role="dialog" aria-modal="true" aria-labelledby="case-title" aria-describedby="case-desc" tabIndex={-1} ref={ref} onMouseDown={e=>e.stopPropagation()}>
        <div className="modal-beacon" aria-hidden="true"></div>
        <button className="modal-close" data-autofocus onClick={onClose} aria-label="Закрыть кейс"><span aria-hidden="true">←</span> Назад</button>
        <span className="kicker"><i aria-hidden="true"></i>{item.type}</span>
        <h2 id="case-title">{item.title}</h2>
        <div id="case-desc" className="modal-desc">
          <div className="modal-block">
            <span className="modal-label">С какой задачей пришёл клиент</span>
            <p>{item.task}</p>
          </div>
          <div className="modal-block">
            <span className="modal-label">Что сделано</span>
            <p>{item.solution}</p>
          </div>
          <div className="modal-block">
            <span className="modal-label">Что входит в проект</span>
            <p>{item.role}</p>
          </div>
          <div className="modal-block highlight">
            <span className="modal-label">Результат</span>
            <p className="modal-result">{item.metric}<span className="modal-proof"> · {item.proof}</span></p>
          </div>
          {item.handle && <div className="modal-link-row">
            <span className="modal-label">Готовое решение</span>
            <a href={item.link} target="_blank" rel="noreferrer" className="modal-link">{item.handle} ↗</a>
          </div>}
        </div>
        <div className="modal-actions">
          {item.link && <a className="button" href={item.link} target="_blank" rel="noreferrer">Посмотреть {item.handle} ↗</a>}
          <a className="button primary" href={TELEGRAM_URL} target="_blank" rel="noreferrer">Заказать такой же проект ↗</a>
        </div>
      </article>
    </div>
  )
}
function FAQItem({q,a}){
  const [open,setOpen]=useState(false); const id=`faq-${q.toLowerCase().replace(/[^a-zа-я0-9]+/gi,'-')}`
  return (
    <div className={`faq-item ${open?'is-open':''}`}>
      <button aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}><span>{q}</span><i aria-hidden="true"><span></span><span></span></i></button>
      <div className="faq-answer" id={id} hidden={!open}><div>{a}</div></div>
    </div>
  )
}
function ServiceCard({it}){
  const tilt=useTilt(6)
  return (
    <div ref={tilt} className="minimal-card tilt-card">
      <div className="tilt-glow" aria-hidden="true"></div>
      <article className="surface"><span className="service-icon" aria-hidden="true">{it.icon}</span><span className="surface-n">{it.n}</span><h3>{it.t}</h3><p>{it.d}</p><b>от 4 дней →</b></article>
    </div>
  )
}
function Services(){
  const items=[
    {n:'01',t:'Telegram-боты',d:'Боты, которые берут заявки, записывают клиентов, принимают оплату и интегрируются с CRM. Готовы к production-нагрузке.',icon:'◐'},
    {n:'02',t:'Автоматизация',d:'Связываю сервисы в единый поток: заявки → CRM → рассылки → отчёты. Экономит 5–10 часов ручной работы в неделю.',icon:'◑'},
    {n:'03',t:'Веб-сайты',d:'Сайты, которые продают: Lighthouse 95+, SEO-оптимизация, адаптив. От лендинга до e-commerce.',icon:'⬢'},
  ]
  return (
    <section className="section" id="services">
      <div className="section-head"><span className="kicker"><i></i>03 / Услуги</span><div><h2>Три направления. <em>Один результат — рабочий продукт.</em></h2><p>Фикс цены после разбора задачи. Без воды и непредсказуемых бюджетов.</p></div></div>
      <div className="services-grid">
        {items.map(it=><ServiceCard key={it.n} it={it} />)}
      </div>
    </section>
  )
}
function Process(){
  const steps=['Обсуждаем задачу, фиксируем результат (30 мин).','Согласую архитектуру и сценарий (1 день).','Разрабатываю и показываю рабочие версии (каждые 2 дня).','Тестируем и запускаю: деплой + инструкция + поддержка.']
  return (
    <section className="section" id="process">
      <div className="section-head"><span className="kicker"><i></i>04 / Процесс</span><div><h2>Прозрачный процесс.</h2><p>Каждая итерация — рабочий кусок продукта, а не отчёт.</p></div></div>
      <div className="process-beam"><div className="process-line" aria-hidden="true"></div><div className="process-grid">{steps.map((t,i)=><article key={t} className="surface process-card"><span>0{i+1}</span><p>{t}</p></article>)}</div></div>
    </section>
  )
}
function Stats(){
  const [ref,vis]=useReveal(0.3)
  const v1=useCountUp(50,vis), v2=useCountUp(6,vis), v3=useCountUp(95,vis)
  return (
    <div ref={ref} className="intro-stats" role="list">
      <span role="listitem"><b>{v1}+</b>запусков за 6 лет</span>
      <span role="listitem"><b>{v2}+</b>лет в продакшене</span>
      <span role="listitem"><b>{v3}+</b>Lighthouse</span>
    </div>
  )
}
function App(){
  const [active,setActive]=useState(null); const [contactVisible,setContactVisible]=useState(false); const activeRef=useRef(null); const contactRef=useRef(null); const ambientRef=useRef(null)
  useEffect(()=>{ const io=new IntersectionObserver(([e])=>setContactVisible(e.isIntersecting),{threshold:0.12}); if(contactRef.current) io.observe(contactRef.current); return()=>io.disconnect()},[])
  useEffect(()=>{ if(reducedMotion()) return; let raf=0,t=false,active=true; const onScroll=()=>{ if(!t&&active){ raf=requestAnimationFrame(()=>{ if(active&&ambientRef.current&&ambientRef.current.isConnected){ try{ ambientRef.current.style.transform=`translateY(${window.scrollY*0.06}px)` }catch(_){ } } t=false }); t=true } }; addEventListener('scroll',onScroll,{passive:true}); return()=>{ active=false; cancelAnimationFrame(raf); removeEventListener('scroll',onScroll)} },[])
  const getVisual=i=>'visual-'+cases[i].visual
  return (
    <>
      <div ref={ambientRef} className="ambient" aria-hidden="true"></div><div className="noise" aria-hidden="true"></div>
      <Header />
      <main id="main">
        <Hero />
        <section className="intro section"><div className="intro-number">01 — подход</div><div className="intro-text"><h2>Опыт, который экономит ваше время.<span>Не агентство. Не новички. Один инженер, который доводит до конца.</span></h2><p>За 6+ лет в продакшене я научился не просто писать код, а решать бизнес-задачу: от разбора требований до деплоя и поддержки. Берусь за работу, которую могу довести до результата.</p><Stats /></div></section>
        <section className="section" id="work"><div className="section-head"><span className="kicker"><i></i>02 / Избранные проекты</span><div><h2>Избранные проекты.</h2><p>Не демо — <em>рабочие продукты</em> с реальными метриками. Откройте кейс: <em>какая была задача → что я сделал → что получил клиент</em>.</p></div></div><div className="project-list">{cases.map((it,i)=><ProjectRow key={it.title} item={it} index={i} visualClass={getVisual(i)} onOpen={e=>{activeRef.current=e.currentTarget; setActive(it)}} />)}</div><div className="mid-cta"><p>Похожий кейс? Сделаю под вашу задачу — с тем же уровнем проработки.</p><a className="text-link" href="#contact">Обсудить ваш проект →</a></div></section>
        <Services /><Process />
        <section className="section about"><div className="about-grid"><div className="minimal-card"><div className="surface about-card"><span className="kicker"><i></i>Обо мне</span><h2>Senior-разработчик с 6+ годами в продакшене.</h2><p>Я не фрилансер-однодневка. Я инженер, который вёл проекты от первого прототипа до production-нагрузки. Знаю, что код — это инструмент, а результат — рабочий продукт, который приносит деньги.</p><p className="about-card-second">Работаю удалённо, отвечаю за весь цикл: анализ, архитектура, разработка, деплой, поддержка.</p><div className="about-tags"><span>6+ лет опыта</span><span>50+ запусков</span><span>Production-ready</span><span>Remote</span></div></div></div><div className="about-panel" aria-hidden="true"><div className="about-code"><div className="code-bar"><span><i></i><i></i><i></i></span><em>eloquncy — senior.py</em></div><pre><code>{`# 6+ лет в продакшене
def deliver(task):
  analyze(task)    # бизнес-логика
  architect(task)  # масштабируемо
  build(task)      # чистый код
  ship(task)       # деплой + support
  # результат: рабочий продукт`}</code></pre><div className="about-stats-mini"><span><b>6+</b> лет</span><span><b>50+</b> запусков</span><span><b>2с</b> отклик</span></div></div></div></div></section>
        <section className="section faq" aria-labelledby="faq-title"><div className="section-head"><span className="kicker"><i></i>05 / Вопросы</span><div><h2 id="faq-title">Коротко об условиях.</h2></div></div><div className="faq-list">
          <FAQItem q="Сколько занимает запуск?" a="MVP — 5–7 дней, сложный продукт — 2–3 недели. Фиксирую срок после разбора задачи." />
          <FAQItem q="Как формируется стоимость?" a="Фикс после разбора: функционал + интеграции + срок. 50% предоплата, 50% после деплоя." />
          <FAQItem q="Можно ли доработать существующий проект?" a="Да. Подключаюсь к вашему коду, разбираюсь и добавляю функционал без переписывания с нуля." />
          <FAQItem q="Есть ли поддержка после запуска?" a="7 дней багфикс бесплатно. Далее — по запросу, без обязательных абонплат." />
          <FAQItem q="Что нужно для старта?" a="Опишите задачу, желаемый результат и сервисы, которые вы уже используете. Этого хватит для оценки." />
        </div></section>
        <section className="section contact" id="contact" ref={contactRef}><div className="contact-copy"><span className="kicker"><i></i>06 / Связь</span><h2>Обсудим задачу? <em>Отвечу сегодня.</em></h2><p>Напишите в Telegram, что нужно запустить. Отвечу с планом, сроком и оценкой — в тот же день.</p><div className="contact-points"><span><i></i> Один чат — вся коммуникация от первого дня</span><span><i></i> Фиксирую задачу, срок и бюджет до старта</span><span><i></i> Показываю рабочие версии, а не отписки</span></div><span className="contact-note">6+ лет опыта · 50+ запусков · отвечаю в тот же день</span></div>
          <BeamBorder radius={28} className="telegram-beam" intensity={0.85} double><a className="telegram-button" href={TELEGRAM_URL} target="_blank" rel="noreferrer"><span className="tg-top"><i className="tg-dot"></i> Telegram · @EloQuncy</span><span className="tg-title">Написать<br/>в Telegram</span><span className="tg-bottom"><span>нажми чтобы открыть чат</span><b>↗</b></span><span className="tg-glow"></span></a></BeamBorder>
        </section>
      </main>
      <footer className="footer"><span>© {new Date().getFullYear()} EloQuncy · Senior Developer · 6+ лет в продакшене</span><span><a href={TELEGRAM_URL} target="_blank" rel="noreferrer">@EloQuncy</a> · один контакт — весь запуск</span></footer>
      <a className={`fixed-cta button ${contactVisible?'is-hidden':''}`} href="#contact" aria-hidden={contactVisible} tabIndex={contactVisible?-1:0}><span className="button-beam"></span><span>Написать в Telegram</span><b>↗</b></a>
      {active && <CaseModal item={active} onClose={()=>setActive(null)} returnRef={activeRef} />}
    </>
  )
}
createRoot(document.getElementById('root')).render(<ErrorBoundary><App/></ErrorBoundary>)

if('serviceWorker' in navigator){
  addEventListener('load',()=>{ navigator.serviceWorker.register('/sw.js').catch(()=>{}) })
}
