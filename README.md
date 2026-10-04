# TALANT — сайт, TALANT CAMPUS и TALANT ADMIN

Next.js 15 + React 19 + Firebase (Auth, Firestore, Storage). Языки: русский (/ru) и таджикский (/tg).

## 1. Структура
```
src/app/[lang]/(site)   публичный сайт: главная, кластер, английский, о центре, (преподаватели, пока их нет)
src/app/[lang]/(app)    login, campus (ученик), admin (админ и преподаватель)
src/app/api             /api/apply (заявки), /api/admin/students (создание/блок/удаление аккаунтов)
src/lib                 firebase, auth, i18n (+x.ts), coins, server-data, ratelimit
firestore.rules, storage.rules   правила безопасности — ОБЯЗАТЕЛЬНО развернуть
scripts/create-admin.mjs         создание первого ADMIN
```

## 2. Запуск локально
Команды: `npm run check:env` (проверка .env.local), `npm run firebase:rules` (правила и индексы), `npm run admin:create -- логин пароль "Имя"`.
`npm install` → скопируйте `.env.example` в `.env.local` и заполните → `npm run dev` → http://localhost:3000

## 3. Подключение Firebase
1. console.firebase.google.com → Add project.
2. Build → Authentication → Get started → включите **Email/Password**. В Settings включите **Email enumeration protection**.
3. Build → Firestore Database → Create (production mode, регион ближе к Таджикистану, например europe-west или asia).
4. Build → Storage → Get started.
5. Project settings → General → Your apps → Web app → скопируйте конфиг в `NEXT_PUBLIC_FIREBASE_*`.
6. Project settings → Service accounts → Generate new private key. Содержимое JSON в одну строку → `FIREBASE_SERVICE_ACCOUNT` (только на сервере, никогда не коммитьте).
7. Правила: `npm i -g firebase-tools`, `firebase login`, `firebase use <project-id>`, затем `firebase deploy --only firestore:rules,storage`.
8. Рекомендуется: Build → App Check → зарегистрировать веб-приложение с reCAPTCHA v3, ключ в `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, затем включить Enforce для Firestore и Storage.

## 4. Первый ADMIN
`FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccount.json node scripts/create-admin.mjs admin "СИЛЬНЫЙ-ПАРОЛЬ-10+" "Имя"`
Затем войдите на /tg/login. Файл ключа после этого храните вне проекта.

## 5. Ученики
Самостоятельная регистрация: /tg/register (имя, фамилия, email, пароль). Аккаунт получает роль «ученик» и ждёт подтверждения: в админке «Пользователи и роли» → «Подтвердить».
Админ может добавить ученика сам (форма на той же странице).

## 5a. Добавить ученика вручную
/tg/admin/students → форма: имя, логин (латиница или email), пароль от 8 символов, класс, телефон. Логин без @ превращается в `логин@talant.app` — ученик вводит просто логин.

## 6. Результаты недели
1. Админка → «Экзамены (недели)»: создайте неделю (название, дата, время, макс. общий балл, названия 3 предметов).
2. «Импорт ведомости»: выберите неделю, загрузите XLSX или CSV со столбцами: ФИО, предмет 1, 2, 3, общий балл, место. Строки сопоставляются с учениками по ФИО (порядок слов и мелкие различия вроде ӣ/и не мешают). Где ФИО не найдено, выберите ученика вручную и нажмите «Импортировать».
3. «Оценки вручную»: добавить, изменить или удалить баллы любого ученика за любую неделю.
4. «Отчёт для WhatsApp»: готовый текст «🏆 Место 1: Имя Фамилия — Общий балл: 289 (98+95+96)» с кнопкой «Скопировать».
Готовность к Кластеру 5 = средний общий балл последних трёх недель, делённый на максимум экзамена.

## 7. Монеты
Монеты, бонусы и рейтинг с чужими именами из платформы удалены полностью.

## 8. Изменение контента
/tg/admin/settings — телефон, WhatsApp, Telegram, Instagram, адрес, часы, карта, цены и сроки, цена английского.
/tg/admin/teachers, /gallery, /public-results — преподаватели, фото, результаты на сайте. Изменения на сайте видны в течение минуты.

## 9. Публикация
Рекомендуется Vercel: импортируйте репозиторий, добавьте переменные из `.env.local` (включая `FIREBASE_SERVICE_ACCOUNT` и `NEXT_PUBLIC_SITE_URL`), Deploy. Домен подключите в Settings → Domains.
Firebase Console → Authentication → Settings → Authorized domains → добавьте ваш домен.

## Безопасность (что сделано)
- Firestore/Storage rules: ученик читает только свои данные; запись только admin/teacher; заявки создаются только через сервер; всё остальное закрыто.
- Роли — в защищённых custom claims Firebase; блокировка отключает вход и отзывает сессии.
- Заголовки: CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy.
- Форма заявки: проверка на сервере, honeypot, ограничение по времени и по IP, лимит размера.
- Админ-API: проверка ID-токена с отзывом и роли, лимит запросов. Admin/campus/login закрыты от индексации.
- Для защиты от DDoS и ботов поставьте домен за Cloudflare (бесплатный тариф) и включите App Check.
Абсолютной защиты не бывает: обновляйте зависимости (`npm audit`), используйте сильные пароли.

## Что ещё не сделано (TODO)
- Стиль: проект использует собственный CSS (src/app/globals.css), не Tailwind; внешний вид соответствует тёмной теме из ТЗ.
- Обязательно заполнить: часы работы, карту, длительность занятия, срок для 9 класса, преподавателей, цену английского.
