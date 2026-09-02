# EloQuncy — Portfolio

Лендинг-портфолио разработчика: **сайты · Telegram-боты · email-рассылки**.

Стек: **React 19 + Vite**, чистый CSS, без UI-кита. Анимации — `requestAnimationFrame`, хуки (magnet / tilt / reveal / count-up) написаны вручную.

---

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production-сборка в dist/
npm run preview  # превью сборки на http://localhost:4173
```

Требования: **Node.js 20+**.

---

## Структура

```
.
├── index.html              # SEO-мета, JSON-LD, OG-превью
├── src/
│   ├── main.jsx            # React-приложение, кейсы, модалка
│   └── styles.css          # все стили
├── public/
│   ├── manifest.webmanifest
│   ├── og.svg              # OG-картинка 1200x630
│   └── sw.js               # service worker (PWA-кэш)
└── vite.config.js          # build + chunking
```

---

## Что внутри

- **Hero** — главный экран с описанием и live-карточкой
- **Портфолио** — 6 кейсов с мокапами (Abramenko Studio · Search Barbershop · NIGHT MARKET · Maison d'Arôme · NOVA FORMA · Email-рассылка)
- **Услуги** — три направления (Telegram-боты / автоматизация / сайты)
- **Процесс** — 4 шага работы
- **FAQ** — частые вопросы
- **Контакты** — форма + Telegram

Все кейсы описаны на языке клиента: сначала проблема бизнеса, потом что сделано, потом результат. Технические детали спрятаны — фокус на выгоде.

---

## Деплой

Сборка `dist/` — статические файлы, заливаются на любой хостинг (Vercel / Netlify / Railway / nginx).

Для Vercel:
```bash
npx vercel --prod
```

---

## Контакты

Telegram: [@EloQuncy](https://t.me/EloQuncy)
