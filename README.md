# TrustPulse - Testimonial & Social Proof Collector
> A high-performance **MERN Stack** social proof platform and Senja / Testimonial.to alternative. Built for **Technical Assessment (Project Brief 05)**.

---

## 🌟 Overview & Key Features

**TrustPulse** empowers businesses and creators to launch branded review collection pages in seconds, collect client testimonials without requiring client logins, moderate feedback via an inbox, analyze rating metrics, and generate responsive embeddable widgets.

### 🔒 1. Universal Security & Pair-Token Auth
- **Pair-Token Architecture**: Short-lived JWT Access Token (15m) + Long-lived Refresh Token (7d) stored in secure, `httpOnly`, `sameSite: 'lax'` cookies to prevent XSS.
- **Refresh Token Rotation**: Old refresh tokens are revoked on each use; token reuse detection immediately revokes active user sessions.
- **Silent Refresh Interceptor**: Frontend Axios interceptor automatically detects 401s, silently requests a new token pair, and seamlessly retries queued requests.
- **Simulated Email Verification & Password Recovery**: Full interactive simulation banner and password reset token endpoints.

### 🏢 2. Space Management & Configuration (Brief Req A)
- Authenticated space owners create branded Spaces with custom slugs (e.g. `/collect/acme-cloud`).
- Configure brand logo, custom prompts, guided client question lists, star rating toggles, and mandatory avatar settings.

### ⚡ 3. Frictionless Public Collection Form (Brief Req B)
- Accessible publicly at `/collect/:spaceSlug` with **zero login required**.
- Captures client name, email, company/role, 1–5 star rating, review text, and avatar upload.
- Client-side validation, error handling, and celebratory confetti animation upon completion.

### 📥 4. Review Moderation & Tagging Inbox (Brief Req C)
- Centralized inbox with tabbed filters: **All**, **Pending**, **Approved**, and **Archived**.
- One-click moderation controls: **Approve**, **Archive**, **Pin as Featured**, **Mark as Liked**, or **Delete**.
- Real-time keyword search and 1-to-5 star rating filter.

### 💖 5. "Wall of Love" Showcase & Embed Generator (Brief Req D)
- Public responsive masonry grid page at `/wall/:spaceSlug` showcasing approved reviews.
- **Interactive Embed Modal**: Customize theme (**Light / Dark**) and layout (**Grid**, **Carousel**, **Badge**).
- Copy-paste HTML `<iframe>` snippet ready for Webflow, Shopify, WordPress, or custom React apps.
- Standalone embed route at `/embed/:spaceSlug` optimized for iframe embedding.

### 📊 6. Rating Metrics & Summary Stats (Brief Req E)
- Summary statistics card displaying average star rating (e.g. 4.9/5.0), total review count, recommendation rate, and a 5-star to 1-star visual percentage breakdown.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Rationale |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti | Lightning fast HMR, responsive Coss UI design system, accessible primitives |
| **Backend** | Node.js, Express.js, Multer, Cookie-Parser, Morgan | Event-driven RESTful architecture, robust middleware pipelines, file handling |
| **Database** | MongoDB, Mongoose ODM | Flexible schemas for space prompts, questions, and aggregation pipelines |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js | Pair-token rotation, stateless access verification, httpOnly cookie storage |

---

## 📁 Project Structure

```
testimonial-collector/
├── package.json                   # Root scripts: dev, seed, install:all
├── README.md                      # Comprehensive project documentation
├── VIDEO_EXPLANATION_SCRIPT.md     # 5-minute video script for assessment submission
├── server/
│   ├── index.js                   # Express server entrypoint
│   ├── seed.js                    # 1-click realistic demo seeder
│   ├── .env                       # Local server environment variables
│   ├── .env.example               # Example environment template
│   ├── config/
│   │   └── db.js                  # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js       # Pair-token auth, token rotation, simulated email
│   │   ├── spaceController.js      # Space CRUD & aggregation
│   │   ├── testimonialController.js# Moderation actions, filters, search
│   │   ├── analyticsController.js  # Rating metrics & star distribution
│   │   └── publicController.js     # Public submission & Wall of Love
│   ├── middleware/
│   │   ├── auth.js                # JWT access token protection
│   │   ├── errorHandler.js        # Global error & exception handler
│   │   └── upload.js              # Multer image upload handler
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt & token rotation
│   │   ├── Space.js               # Space schema with settings & questions
│   │   └── Testimonial.js         # Testimonial schema with statuses & ratings
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── spaceRoutes.js
│   │   ├── testimonialRoutes.js
│   │   └── publicRoutes.js
│   └── utils/
│       └── tokenUtils.js          # JWT sign, verify, and cookie helpers
│
└── client/
    ├── package.json
    ├── vite.config.js             # Vite config with API proxy
    ├── tailwind.config.js         # Tailwind styling with dark mode support
    ├── index.html                 # App shell with Plus Jakarta Sans typography
    └── src/
        ├── App.jsx                # Router & Protected route layout
        ├── main.jsx               # React DOM entry
        ├── index.css              # Custom scrollbars & Tailwind base
        ├── context/
        │   └── AuthContext.jsx    # Reactive authentication provider
        ├── services/
        │   └── api.js             # Axios instance with 401 token refresh queue
        ├── components/
        │   ├── Navbar.jsx         # Responsive navigation & simulated verify banner
        │   ├── StarRating.jsx     # Interactive & read-only star selector
        │   ├── TestimonialCard.jsx# Social proof card with moderation buttons
        │   ├── MasonryGrid.jsx    # Responsive multi-column masonry layout
        │   ├── StatsCard.jsx      # Summary metrics & rating distribution bars
        │   ├── EmbedModal.jsx     # Live widget preview & iframe generator
        │   └── ui/                # Coss UI inspired Button, Badge, Modal, Input, Card
        └── pages/
            ├── Home.jsx           # Landing page with interactive demos
            ├── Login.jsx          # Login with 1-click reviewer autofill
            ├── Signup.jsx         # Registration with simulated email verification
            ├── ForgotPassword.jsx # Password recovery
            ├── ResetPassword.jsx  # Reset password confirmation
            ├── Dashboard.jsx      # Space management & creation modal
            ├── SpaceDetail.jsx    # Moderation inbox, filters, analytics & embed modal
            ├── PublicCollect.jsx  # Frictionless public submission form (/collect/:slug)
            ├── WallOfLove.jsx     # Public Wall of Love page (/wall/:slug)
            └── EmbedWidget.jsx    # Standalone iframe embed route (/embed/:slug)
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas connection string

---

### Step 1: Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
*(Or install inside `/server` and `/client` individually via `cd server && npm install && cd ../client && npm install`)*

---

### Step 2: Configure Environment Variables
A default `.env` is provided in `/server/.env`. You can adjust settings or use the template in `/server/.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/testimonial_db
JWT_ACCESS_SECRET=super_secret_jwt_access_token_key_15m_2026_rank1
JWT_REFRESH_SECRET=super_secret_jwt_refresh_token_key_7d_2026_rank1
```

---

### Step 3: Seed Realistic Demo Data (1-Click)
Populate your database with a verified demo user, two configured spaces, and realistic 5-star & 4-star testimonials across pending, approved, and archived states:
```bash
npm run seed
```

**Seed Credentials Generated:**
- **Email:** `demo@trustpulse.io`
- **Password:** `password123`
- **Demo Spaces:**
  - `acme-cloud` -> Form: `/collect/acme-cloud` | Wall: `/wall/acme-cloud`
  - `apex-design` -> Form: `/collect/apex-design` | Wall: `/wall/apex-design`

---

### Step 4: Run the Application
Start both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) simultaneously:
```bash
npm run dev
```

Visit **http://localhost:5173** in your browser!

---

## 📡 API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user; simulates email verification token | Public |
| `POST` | `/api/auth/login` | Authenticate user; issues pair tokens in httpOnly cookies | Public |
| `POST` | `/api/auth/refresh-token` | Rotates refresh token and issues new access token | Public (Cookie) |
| `POST` | `/api/auth/verify-email` | Simulates email verification confirmation | Public |
| `POST` | `/api/auth/logout` | Revokes refresh token and clears cookies | Protected |
| `GET` | `/api/auth/me` | Returns current user profile | Protected |
| `POST` | `/api/auth/forgot-password` | Generates simulated password reset link | Public |
| `POST` | `/api/auth/reset-password` | Resets password with valid reset token | Public |

### Spaces (`/api/spaces`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/spaces` | Get all spaces owned by user with review counts | Protected |
| `POST` | `/api/spaces` | Create a space (supports logo image upload) | Protected |
| `GET` | `/api/spaces/:id` | Get single space details | Protected |
| `PUT` | `/api/spaces/:id` | Update space prompts, settings, or logo | Protected |
| `DELETE` | `/api/spaces/:id` | Delete space and cascade delete all reviews | Protected |
| `GET` | `/api/spaces/:id/testimonials` | Moderation inbox with status, rating & search filters | Protected |
| `GET` | `/api/spaces/:id/analytics` | Aggregate stats: average rating, distribution breakdown | Protected |

### Testimonial Moderation (`/api/testimonials`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `PATCH` | `/api/testimonials/:id/status` | Update status to `approved`, `archived`, or `pending` | Protected |
| `PATCH` | `/api/testimonials/:id/feature` | Toggle pinned `isFeatured` status | Protected |
| `PATCH` | `/api/testimonials/:id/like` | Toggle `isLiked` status | Protected |
| `DELETE` | `/api/testimonials/:id` | Permanently delete testimonial | Protected |

### Public & Embeds (`/api/public`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/public/space/:slug` | Get public space questions, branding, & settings | Public |
| `POST` | `/api/public/space/:slug/testimonials` | Frictionless review submission with avatar upload | Public |
| `GET` | `/api/public/space/:slug/wall` | Fetch approved reviews for public Wall of Love & widgets | Public |

---

## 🎨 Embeddable Widget Usage

You can embed TrustPulse testimonials on external sites using an `<iframe>`:

```html
<iframe
  src="http://localhost:5173/embed/acme-cloud?layout=grid&theme=light"
  width="100%"
  height="650"
  frameborder="0"
  scrolling="no"
  title="Customer Testimonials"
></iframe>
```

### Supported Query Parameters:
- `layout`: `grid` | `carousel` | `badge`
- `theme`: `light` | `dark`

---

## 🛡️ Evaluation Checklist Verification

- [x] **Pair Token Auth**: 15m Access Token + 7d Refresh Token in httpOnly cookies with token rotation.
- [x] **Email Verification & Password Reset**: Simulated interactive workflows.
- [x] **Space Configuration**: Slugs, logos, custom questions, mandatory avatar & star toggles.
- [x] **Frictionless Public Collection**: Accessible at `/collect/:spaceSlug` without login.
- [x] **Moderation Inbox**: Filter by All/Pending/Approved/Archived, star rating, and search keyword.
- [x] **Wall of Love**: Responsive Pinterest-style masonry layout at `/wall/:spaceSlug`.
- [x] **Embed Generator**: Live preview modal with Grid, Carousel, and Badge layouts.
- [x] **Rating Metrics & Analytics**: Average rating, total count, recommendation %, and star breakdown.
- [x] **One-Click Seeder**: `npm run seed` with rich demo data.
- [x] **Video Explanation Script**: Formatted script adhering to Section 5 requirements in `VIDEO_EXPLANATION_SCRIPT.md`.

---

## 👤 Author
- **Developer:** Chetan Ahire
- **Position Applied:** MERN Stack / Python Developer
