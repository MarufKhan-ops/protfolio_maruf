# Istiyak Hasan Maruf — Dynamic Portfolio (MERN)

Full-stack portfolio with a public site + admin panel.

- **Client:** React (Vite) + React Router — professional routing (`/`, `/certificates`, `/projects`, `/admin`)
- **Server:** Express + Mongoose (MongoDB) + JWT auth + Multer image upload
- **Admin panel:** stats overview, certificate/project **add, edit & delete** (image upload soho), contact-form **message inbox** (read/unread, reply, delete)
- **Public site features:** dark/light mode toggle, certificate **search + category filter**, full-screen certificate viewer, **contact form** (message database-e save hoy), **Download CV** button, scroll-reveal animation, back-to-top, mobile responsive
- 10 ta certificate age thekei database-e seed kora ache (image soho)

---

## 1. Requirements

- Node.js 18+
- MongoDB (locally running, othoba MongoDB Atlas)

MongoDB local-e na thakle free Atlas cluster use korte paren: https://www.mongodb.com/cloud/atlas

## 2. Server setup

```bash
cd server
npm install
```

`.env` file ta check korun (already deya ache, `.env.example` theke copy kora):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/maruf_portfolio
JWT_SECRET=change_this_to_a_long_random_secret   # ← production e obossoi change korben
ADMIN_EMAIL=maruf333444@gmail.com
ADMIN_PASSWORD=maruf@1234                        # ← nijer password din
CLIENT_ORIGIN=http://localhost:5173
```

> Atlas use korle `MONGO_URI` te Atlas connection string din.

**Database seed korun** (admin user + 10 certificates + 6 projects):

```bash
npm run seed
```

**Server start:**

```bash
npm run dev     # http://localhost:5000
```

## 3. Client setup

Notun terminal-e:

```bash
cd client
npm install
npm run dev     # http://localhost:5173
```

Vite dev server automatically `/api` ar `/uploads` request server-e proxy kore dey.

## 4. Admin panel

- URL: `http://localhost:5173/admin/login`
- Email: `maruf333444@gmail.com` (`.env`-er `ADMIN_EMAIL`)
- Password: `.env`-er `ADMIN_PASSWORD` (default: `maruf@1234`)

Login korle dashboard-e duita tab paben:

Login korle dashboard-e **stats cards** (certificates, projects, messages, unread) ar tinta tab paben:

- **Certificates** — add (image soho), **Edit** button-e modal khule shob field + image replace, Delete
- **Projects** — add / edit / delete
- **Messages** — contact form theke asha message inbox: read/unread toggle, one-click **Reply** (mail client khule), delete

Notun certificate add korle sathe sathe `/certificates` page-e dekha jabe.

## 5. API overview

| Method | Route | Auth | Kaj |
|---|---|---|---|
| POST | `/api/auth/login` | — | Admin login → JWT token |
| GET | `/api/certificates` | — | Sob certificate |
| POST | `/api/certificates` | ✅ | Notun certificate (multipart, image soho) |
| PUT | `/api/certificates/:id` | ✅ | Update |
| DELETE | `/api/certificates/:id` | ✅ | Delete (image file-o muche jay) |
| GET/POST/PUT/DELETE | `/api/projects` | GET public | Project CRUD |
| GET | `/api/stats` | — | Live counts (hero ledger + admin overview) |
| POST | `/api/messages` | — | Contact form submit |
| GET / PUT `:id/read` / DELETE | `/api/messages` | ✅ | Admin message inbox |

## 6. Production build

```bash
cd client && npm run build   # dist/ folder toiri hobe
```

`dist/` folder ta Netlify/Vercel-e deploy korte paren, ar server ta Render/Railway-e — server-er `CLIENT_ORIGIN` e deployed client URL din, ar client-e axios baseURL update korun (othoba reverse proxy use korun).

## Folder structure

```
portfolio/
├── client/                 # React (Vite)
│   └── src/
│       ├── pages/          # Home, Certificates, Projects, NotFound
│       ├── admin/          # Login, Dashboard, ProtectedRoute
│       ├── components/     # Navbar, Footer, CertificateCard, Lightbox
│       └── data/profile.js # CV theke static info
└── server/                 # Express + MongoDB
    ├── src/
    │   ├── models/         # Admin, Certificate, Project
    │   ├── routes/         # auth, certificates, projects
    │   ├── middleware/     # JWT auth, Multer upload
    │   └── seed.js         # admin + 10 certificates + 6 projects
    └── uploads/            # certificate images + profile photo
```
