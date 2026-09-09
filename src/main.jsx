import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const TELEGRAM_URL = 'https://t.me/EloQuncy'

const cases = [
  {
    title: 'Abramenko Studio',
    type: 'Telegram-бот · Салон красоты',
    handle: '@abramenko_test_bot',
    link: 'https://t.me/abramenko_test_bot',
    task: 'Администратор салона не успевала отвечать на звонки и сообщения в течение дня — клиенты уходили к конкурентам, а часть записей терялась из-за двойных броней.',
    role: 'Онлайн-запись · Напоминания · Админ-панель · Защита от дублей',
    solution: 'Бот записывает клиента 24/7: услуга → мастер → дата → время → подтверждение. Сам напоминает о визите за 24 часа и за 2 часа. Администратор видит все записи и расписание в одной панели, бот не даёт занять один слот дважды.',
    metric: '1200+ записей · −70% пропусков',
    proof: 'Запущен · работает · поддерживается',
    stack: 'Telegram-бот · Админ-панель · 24/7',
    visual: 'salon',
  },
  {
    title: 'Search Barbershop',
    type: 'Telegram-бот · Поиск клиентов',
    handle: '@searchbarbershop_bot',
    link: 'https://t.me/searchbarbershop_bot',
    task: 'Мастеру нужно находить новых клиентов и партнёров (другие салоны), но ручной поиск по картам занимал целый день — и сообщения приходилось писать каждому отдельно.',
    role: 'Поиск салонов · Готовые сообщения · CRM лидов',
    solution: 'Бот ищет барбершопы по городу за 30 секунд, показывает карточку (адрес, телефон, сайт), оценивает перспективность контакта и готовит два варианта сообщения владельцу. Все ответы попадают в CRM.',
    metric: '100+ контактов за сессию',
    proof: 'Запущен · работает в Telegram',
    stack: 'Telegram-бот · Поиск по картам · CRM',
    visual: 'search',
  },
  {
    title: 'NIGHT MARKET',
    type: 'Сайт-магазин · E-commerce',
    handle: 'night-market-iota.vercel.app',
    link: 'https://night-market-iota.vercel.app/',
    task: 'Кураторский магазин редких объектов для тёмных интерьеров. Нужен был необычный сайт с атмосферой — шаблонный Shopify не подходил, покупатели ждали «чёрного» дизайна.',
    role: 'Дизайн · Вёрстка · Анимации · SEO · PWA',
    solution: 'Тёмная палитра, hover-параллакс на карточках, анимации при скролле, каталог редких объектов с историей. Быстро грузится на телефоне, готов к рекламе.',
    metric: '95+ баллов Lighthouse',
    proof: 'Запущен · можно посмотреть',
    stack: 'Каталог · Корзина · Адаптив · PWA',
    visual: 'market',
  },
  {
    title: 'Maison d’Arôme',
    type: 'Сайт-магазин · Премиум-парфюмерия',
    handle: 'dior-nu.vercel.app',
    link: 'https://dior-nu.vercel.app/',
    task: 'Селективные ароматы для дома — свечи, диффузоры, спреи. Нужен сайт уровня Dior: с лимитированными капсулами, подарочными коробами и возможностью продавать дороже обычного.',
    role: 'Каталог · Фильтры · Корзина · Журнал',
    solution: 'Мега-меню по коллекциям, лимитированная капсула Осень-Зима (300 экземпляров), подарочная упаковка с лентой. Каждая карточка — как витрина бутика.',
    metric: '4 коллекции · лимитированные капсулы',
    proof: 'Запущен · продаётся',
    stack: 'Каталог · Корзина · Премиум-дизайн',
    visual: 'arome',
  },
  {
    title: 'NOVA FORMA',
    type: 'Сайт-каталог · Строительная компания',
    handle: 'construction-company-jjj6mz2t1-bbc-b318.vercel.app',
    link: 'https://construction-company-jjj6mz2t1-bbc-b318.vercel.app/',
    task: 'Строительная компания получала заявки только по сарафану — нужно было продающее представительство в интернете, чтобы клиенты сами оставляли заявку на расчёт.',
    role: 'Каталог проектов · Услуги · Форма заявки · SEO',
    solution: 'Сайт показывает опыт (12 лет, 86 проектов), гарантии, процесс работы из 7 шагов. Заявки уходят прямо в Telegram менеджера — клиент оставляет контакт за 30 секунд.',
    metric: 'Заявки без рекламы',
    proof: 'Запущен · приводит клиентов',
    stack: 'Каталог · Фильтры · SEO · Форма заявки',
    visual: 'forma',
  },
  {
    title: 'Forge Atelier Residences',
    type: 'Сайт-презентация · Премиум-недвижимость',
    handle: 'forge-atelier-psi.vercel.app',
    link: 'https://forge-atelier-psi.vercel.app/',
    task: 'Девелоперу премиального жилого комплекса в Алматы нужен был не «сайт застройщика», а редакционная презентация — как у архитектурного бюро. Чтобы покупатели воспринимали проект как lifestyle, а не как «бетон по цене метра».',
    role: 'Концепция · Editorial-дизайн · Архитектурная подача · Анимации',
    solution: 'Сайт построен вокруг концепции The Living Horizon: тёплая тёмно-зелёная палитра, крупная типографика, фокус на свете и ландшафте. Каждая резиденция — как страница журнала: фото, свет, тишина, простор.',
    metric: 'Editorial-стиль · премиум-сегмент',
    proof: 'Запущен · можно посмотреть',
    stack: 'Концепция · Дизайн · Анимации · Vercel',
    visual: 'forge',
  },
  {
    title: 'Email-рассылка',
    type: 'Сервис · Email-автоматизация',
    handle: 'email-production-0ea1.up.railway.app',
    link: 'https://email-production-0ea1.up.railway.app/',
    task: 'Бизнес вёл рассылки вручную — открываемость падала, клиенты не возвращались. Нужна автоматизация, которая сама ведёт подписчика от первого письма до покупки.',
    role: 'Цепочки писем · Сегменты · A/B тесты · Аналитика',
    solution: 'Готовые сценарии: новый подписчик → прогрев (3 письма) → акция → возврат. Сегменты по поведению, A/B темы, дашборд с метриками открытий и кликов.',
    metric: '42% открытий · 18% кликов · +31 лид',
    proof: 'Запущен · 12 шаблонов · 3 цепочки',
    stack: 'Цепочки · Сегменты · Аналитика · A/B',
    visual: 'email',
  },
]

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

const hoverAudio = { context: null, unlocked: false, enabled: true, lastHover: 0 }

function unlockHoverAudio() {
  if (!hoverAudio.context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    hoverAudio.context = new AudioContext()
  }
  hoverAudio.unlocked = true
  if (hoverAudio.context.state === 'suspended') hoverAudio.context.resume()
}

function playHoverSound() {
  const context = hoverAudio.context
  if (!hoverAudio.enabled || !hoverAudio.unlocked || !context || context.state !== 'running') return
  const now = context.currentTime
  if (now - hoverAudio.lastHover < .07 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  hoverAudio.lastHover = now
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(740, now)
  oscillator.frequency.exponentialRampToValueAtTime(980, now + .055)
  gain.gain.setValueAtTime(.0001, now)
  gain.gain.exponentialRampToValueAtTime(.025, now + .008)
  gain.gain.exponentialRampToValueAtTime(.0001, now + .075)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + .08)
}

function playClickSound() {
  const context = hoverAudio.context
  if (!hoverAudio.enabled || !hoverAudio.unlocked || !context || context.state !== 'running' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const now = context.currentTime
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(260, now)
  oscillator.frequency.exponentialRampToValueAtTime(130, now + .12)
  gain.gain.setValueAtTime(.0001, now)
  gain.gain.exponentialRampToValueAtTime(.04, now + .01)
  gain.gain.exponentialRampToValueAtTime(.0001, now + .13)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + .14)
}

function PageLoader() {
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const progressTimer = window.setInterval(() => setProgress(value => Math.min(value + 7, 99)), 36)
    const finish = window.setTimeout(() => setLoaded(true), 420)
    return () => {
      window.clearTimeout(finish)
      window.clearInterval(progressTimer)
    }
  }, [])
  return <div className={`page-loader ${loaded ? 'is-loaded' : ''}`} aria-hidden={loaded}>
    <div className="loader-count">{String(progress).padStart(2, '0')}</div>
    <div className="loader-meta"><span>ELOQUNCY / SOFTWARE DEVELOPER</span><b>loading experience</b></div>
  </div>
}

function AmbientScene() {
  return <div className="ambient-scene" aria-hidden="true">
    <div className="ambient-grid"></div>
    <span className="ambient-orb orb-one"></span>
    <span className="ambient-orb orb-two"></span>
    <span className="ambient-orb orb-three"></span>
    <span className="ambient-beam"></span>
  </div>
}

function HoverProps() {
  return { onPointerEnter: playHoverSound }
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(() => window.localStorage.getItem('eloquncy-sound') !== 'off')
  useEffect(() => { hoverAudio.enabled = soundOn }, [soundOn])
  const links = [['#work', 'Проекты'], ['#skills', 'Навыки'], ['#process', 'Процесс'], ['#contact', 'Контакты']]
  const toggleSound = () => {
    unlockHoverAudio()
    hoverAudio.enabled = !hoverAudio.enabled
    setSoundOn(hoverAudio.enabled)
    window.localStorage.setItem('eloquncy-sound', hoverAudio.enabled ? 'on' : 'off')
  }
  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        <span className="brand-mark">EQ</span>
        <span><b>EloQuncy</b><small>software developer</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Основная навигация">
        {links.map(([href, label]) => <a key={href} href={href} {...HoverProps()}>{label}</a>)}
      </nav>
      <button className={`sound-toggle ${soundOn ? 'is-on' : ''}`} type="button" aria-pressed={soundOn} onClick={toggleSound} {...HoverProps()}><span className="sound-bars" aria-hidden="true"><i></i><i></i><i></i></span><span>{soundOn ? 'Звук' : 'Тихо'}</span></button>
      <a className="header-cta" href="#contact" {...HoverProps()}>Обсудить проект <Arrow /></a>
      <button className="mobile-toggle" type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}>
        <span>{open ? 'Закрыть' : 'Меню'}</span><i aria-hidden="true"><b></b><b></b></i>
      </button>
      {open && <div className="mobile-nav">
          {links.map(([href, label], index) => <a key={href} href={href} onClick={() => setOpen(false)} {...HoverProps()}><small>0{index + 1}</small>{label}<Arrow /></a>)}
        <a className="mobile-nav-cta" href="#contact" onClick={() => setOpen(false)} {...HoverProps()}>Написать в Telegram <Arrow /></a>
      </div>}
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <AmbientScene />
      <div className="hero-noise" aria-hidden="true"></div>
      <div className="hero-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
      <div className="hero-content">
        <div className="hero-kicker">ELOQUNCY / SOFTWARE DEVELOPER <span>● available for work</span></div>
        <h1>Сайты.<br />Боты.<br /><em>Софты.</em></h1>
        <div className="hero-bottom">
          <p>Проектирую и запускаю цифровые продукты для бизнеса: от Telegram-ботов и автоматизации до сайтов, которые можно открыть, потрогать и запустить.</p>
          <div className="hero-actions"><a className="solid-btn" href="#contact" {...HoverProps()}>Обсудить задачу <Arrow /></a><span className="scroll-note">scroll to explore <b>↓</b></span></div>
        </div>
      </div>
      <div className="hero-signal" aria-label="Статус студии"><div className="signal-top"><span>LIVE SYSTEM</span><i></i></div><strong>07</strong><span>digital products<br />in the field</span><div className="signal-line"><b></b></div><small>DESIGN / BUILD / SHIP</small></div>
    </section>
  )
}

function Marquee() {
  const items = ['TELEGRAM', 'WEB DESIGN', 'AUTOMATION', 'SOFTWARE', 'PRODUCTS']
  return <div className="marquee" aria-hidden="true"><div className="marquee-track">{[...items, ...items].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✳</i></span>)}</div></div>
}

function Skills() {
  const skills = [
    ['Web Design & Development', 'Сайты с интерактивными анимациями, адаптивным дизайном и JavaScript-функционалом. От лендинга до e-commerce.'],
    ['UX/UI Design', 'Проектирование интерфейсов с фокусом на удобство, визуальную привлекательность и понятный пользовательский опыт.'],
    ['Python Development', 'Разработка Telegram-ботов на aiogram, работа с JSON, SQLite, API, системами логирования и автоматизированными решениями.'],
  ]
  return <section className="paper-section skills-section" id="skills"><div className="section-label">01 / НАВЫКИ</div><div className="paper-heading"><h2>Не просто код.<br /><em>Рабочий результат.</em></h2><p>Три направления, в которых я соединяю дизайн, разработку и задачу бизнеса в один готовый продукт.</p></div><div className="skill-list">{skills.map(([name, description], index) => <article className="skill-row" key={name}><span className="skill-index">0{index + 1}</span><h3>{name}</h3><p>{description}</p><Arrow /></article>)}</div></section>
}

function ProjectArt({ variant }) {
  const labels = { salon: '✦', search: '⌕', market: '◒', arome: '◉', forma: '⌂', forge: '◌', email: '✉' }
  return <div className={`project-art project-art-${variant}`} aria-hidden="true"><span className="art-halo"></span><span className="art-sweep"></span><span className="art-particle particle-one"></span><span className="art-particle particle-two"></span><b>{labels[variant] || '✦'}</b><i></i></div>
}

function ProjectCard({ item, index, onOpen }) {
  const [ref, visible] = useReveal()
  return <button ref={ref} className={`work-card ${visible ? 'is-visible' : ''}`} style={{ '--delay': `${index * 70}ms` }} onClick={() => onOpen(item)} {...HoverProps()}>
    <div className="work-card-top"><span>0{index + 1} / {item.type}</span><span>{item.metric}</span></div>
    <div className="work-card-main"><div className="work-copy"><h3>{item.title}</h3><p>{item.task}</p><small>{item.handle}</small><span className="work-card-link">Открыть <Arrow /></span></div><ProjectArt variant={item.visual} /></div>
    <div className="work-card-bottom"><span>{item.stack}</span><span className="work-open">Смотреть кейс <Arrow /></span></div>
  </button>
}

function Projects({ onOpen }) {
  const [filter, setFilter] = useState('work')
  const visibleCases = filter === 'work' ? cases.slice(0, 4) : cases.slice(4)
  return <section className="work-section section-dark paper-projects" id="work"><div className="section-label">02 / ИЗБРАННЫЕ ПРОЕКТЫ</div><div className="work-heading"><h2>Проекты</h2><p>Сохранил проекты и ссылки. Переключай подборки и открывай каждый кейс, чтобы увидеть задачу, решение и результат.</p></div><div className="work-tabs" role="tablist" aria-label="Фильтр проектов"><button className={filter === 'work' ? 'is-active' : ''} role="tab" aria-selected={filter === 'work'} onClick={() => setFilter('work')} {...HoverProps()}>Рабочие <b>{cases.slice(0, 4).length}</b></button><button className={filter === 'other' ? 'is-active' : ''} role="tab" aria-selected={filter === 'other'} onClick={() => setFilter('other')} {...HoverProps()}>Прочие <b>{cases.slice(4).length}</b></button></div><div className="work-list">{visibleCases.map((item, index) => <ProjectCard key={item.title} item={item} index={index} onOpen={onOpen} />)}</div></section>
}

function Services() {
  const services = [
    ['01', 'Telegram-боты', 'Берут заявки, записывают клиентов, принимают оплату и соединяются с CRM.'],
    ['02', 'Автоматизация', 'Связываю сервисы в единый поток: заявки → CRM → рассылки → отчёты.'],
    ['03', 'Веб-сайты', 'Продающие сайты: адаптив, SEO, e-commerce и запуск без лишней бюрократии.'],
  ]
  return <section className="paper-section services-section"><div className="section-label">03 / УСЛУГИ</div><div className="paper-heading"><h2>Один исполнитель.<br /><em>Весь запуск.</em></h2><p>От первого разговора до деплоя и поддержки. Без агентских наценок и потери смысла между командами.</p></div><div className="service-grid">{services.map(([n, title, description]) => <article className="service-card" key={n}><span>{n}</span><h3>{title}</h3><p>{description}</p><b>от 4 дней <Arrow /></b></article>)}</div></section>
}

function Process() {
  const steps = ['Обсуждаем задачу и фиксируем результат за 30 минут.', 'Согласую архитектуру и сценарий в течение 1 дня.', 'Разрабатываю и показываю рабочие версии каждые 2 дня.', 'Тестируем, запускаем: деплой, инструкция и поддержка.']
  return <section className="process-section section-dark" id="process"><div className="section-label">04 / ПРОЦЕСС</div><div className="process-heading"><h2>От идеи<br /><em>до запуска.</em></h2><p>Каждая итерация — рабочий кусок продукта, а не отчёт в мессенджере.</p></div><div className="process-list">{steps.map((step, index) => <article key={step}><span>0{index + 1}</span><p>{step}</p></article>)}</div></section>
}

function About() {
  return <section className="about-section paper-section"><div className="section-label">05 / ОБО МНЕ</div><div className="about-grid"><div><h2>Senior-разработчик<br /><em>с 6+ годами.</em></h2><p>Я не фрилансер-однодневка. Я инженер, который ведёт проекты от первого прототипа до production-нагрузки и поддержки.</p><p>Работаю удалённо и отвечаю за весь цикл: анализ, архитектура, разработка, деплой и понятный результат для бизнеса.</p><div className="about-tags"><span>6+ лет опыта</span><span>50+ запусков</span><span>Production-ready</span><span>Remote</span></div></div><div className="code-card"><div><span>● ● ●</span><small>eloquncy — deliver.py</small></div><pre>{`def deliver(task):
  analyze(task)
  architect(task)
  build(task)
  ship(task)
  # рабочий продукт`}</pre></div></div></section>
}

function FAQ() {
  const items = [
    ['Сколько занимает запуск?', 'MVP — 5–7 дней, сложный продукт — 2–3 недели. Фиксирую срок после разбора задачи.'],
    ['Как формируется стоимость?', 'Фикс после разбора: функционал + интеграции + срок. 50% предоплата, 50% после деплоя.'],
    ['Можно ли доработать существующий проект?', 'Да. Подключаюсь к вашему коду, разбираюсь и добавляю функционал без переписывания с нуля.'],
    ['Есть ли поддержка после запуска?', '7 дней багфикс бесплатно. Далее — по запросу, без обязательных абонплат.'],
    ['Что нужно для старта?', 'Опишите задачу, желаемый результат и сервисы, которые вы уже используете. Этого хватит для оценки.'],
  ]
  return <section className="faq-section section-dark"><div className="section-label">06 / FAQ</div><div className="faq-heading"><h2>Коротко<br /><em>об условиях.</em></h2><p>Если вопроса нет в списке — напишите напрямую в Telegram.</p></div><div className="faq-list">{items.map(([question, answer]) => <details key={question}><summary {...HoverProps()}>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
}

function Contacts() {
  return <section className="contact-section section-dark" id="contact"><div className="section-label">07 / КОНТАКТЫ</div><div className="contact-heading"><h2>Есть задача?<br /><em>Давайте обсудим.</em></h2><p>Напишите, что нужно запустить. Отвечу с планом, сроком и оценкой в тот же день.</p></div><div className="contacts-list"><a className="contact-row" href={TELEGRAM_URL} target="_blank" rel="noreferrer" {...HoverProps()}><span className="contact-name">Telegram</span><span className="contact-value">@EloQuncy</span><Arrow /></a><a className="contact-row contact-primary" href={TELEGRAM_URL} target="_blank" rel="noreferrer" {...HoverProps()}><span className="contact-name">Начать проект</span><span className="contact-value">Написать в Telegram</span><Arrow /></a></div></section>
}

function ProjectModal({ item, onClose }) {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handler = event => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', handler) }
  }, [onClose])
  return <div className="modal-overlay" role="presentation" onMouseDown={onClose}><article className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Закрыть" {...HoverProps()}>×</button><div className="section-label">{item.type}</div><h2 id="modal-title">{item.title}</h2><div className="modal-grid"><div><small>ЗАДАЧА</small><p>{item.task}</p></div><div><small>ЧТО СДЕЛАНО</small><p>{item.solution}</p></div><div><small>РОЛЬ И СОСТАВ</small><p>{item.role}</p></div><div className="modal-result"><small>РЕЗУЛЬТАТ</small><strong>{item.metric}</strong><p>{item.proof}</p></div></div><div className="modal-actions"><a className="solid-btn" href={item.link} target="_blank" rel="noreferrer" {...HoverProps()}>Открыть проект <Arrow /></a><a className="ghost-btn" href={TELEGRAM_URL} target="_blank" rel="noreferrer" {...HoverProps()}>Заказать похожий</a></div></article></div>
}

function App() {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const unlock = () => {
      unlockHoverAudio()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])
  useEffect(() => {
    const sections = document.querySelectorAll('main > section:not(.hero)')
    if (!('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('is-in'))
      return undefined
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    }), { threshold: .14 })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const clickSound = event => {
      if (event.target.closest('a, button, summary')) playClickSound()
    }
    document.addEventListener('click', clickSound)
    return () => document.removeEventListener('click', clickSound)
  }, [])
  return <>
    <PageLoader />
    <Header />
    <main>
      <Hero />
      <Marquee />
      <Skills />
      <Projects onOpen={setActive} />
      <Services />
      <Process />
      <About />
      <FAQ />
      <Contacts />
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} EloQuncy · software developer</span><span><b>6+ лет</b> · <b>50+ запусков</b> · отвечаю сегодня</span></footer>
    <a className="fixed-cta" href="#contact" {...HoverProps()}>Написать в Telegram <Arrow /></a>
    {active && <ProjectModal item={active} onClose={() => setActive(null)} />}
  </>
}

createRoot(document.getElementById('root')).render(<App />)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}
