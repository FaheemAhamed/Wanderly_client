# Wanderly Client - Frontend Web Application

Wanderly Client is the client-facing user interface for the Wanderly AI Travel Planner. Built on Next.js 15, React 19, Tailwind CSS v4, and GSAP, it features modern glassmorphism, fluid interactive animations, a custom itinerary dashboard, and a premium editorial PDF export system.

---

## 🚀 Project Overview

The client application provides users with an immersive, visual workspace to plan trips. It allows travelers to register secure accounts, connect via Google OAuth, construct new itineraries through an options wizard, and interactively adjust plans. 

### Key Capabilities
- **Cinematic Landing Page**: Micro-animations, bento grids, and layout transformations powered by GSAP.
- **Dynamic Timeline View**: Interactive itinerary panels displaying daily timelines, transit metrics (mode, duration), and estimated costs in multiple currencies (INR, local, USD).
- **Interactive Weather-Aware Checklists**: Dynamic check/uncheck packing items automatically curated for the location's climate.
- **Granular Customization**: Interactive modals to add new activities manually or trigger selective day regeneration using custom prompt directions.
- **Editorial Textbook PDF View**: Transforms the layout into a structured, print-ready black-and-white booklet using CSS print stylesheets.

---

## 🛠️ Chosen Tech Stack & Justifications

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **Next.js 15 (React 19)** | Base Framework | Optimized App Router routing, fast client-side rendering, and image optimization tools. |
| **TypeScript** | Static Type Safety | Hardens API data integration interfaces for itineraries, budget parameters, and user sessions. |
| **Tailwind CSS v4** | UI Styling Framework | Premium, utility-first design primitives allowing fast styling of custom responsive bento grids and glassmorphic layers. |
| **GSAP & @gsap/react** | Motion & Timelines | Industry standard for high-performance layout shifts, scrub reveals, and stagger effects. |
| **Lenis Scroll** | Physics-based Scrolling | Restructures default scrolling to behave with smooth, inertial fluid dynamics for landing page storytelling. |
| **Firebase Auth (Client SDK)** | Authentication | Provides secure, offloaded OAuth integration (Google Sign-In Popups) directly in client pages. |
| **Zod & React Hook Form** | Form States & Validation | Type-safe form validation preventing incorrect client payloads. |

---

## 📐 High-Level Architecture Explanation

The client is built using Next.js App Router folders. It communicates with the backend API statelessly:

```
[User Browser]
      │
      ├─► [Lenis Scroll & GSAP]  ◄── Controls layout physics and visuals
      ├─► [Firebase Auth Client] ◄── Triggers Google OAuth sign-in flow
      │
  [React Views & UI Components]
      │
      ├─► [trips-store.ts] (Global Session Storage)
      │
  [Axios HTTP Client (api.ts)]
      │
      └─► (HTTPS Request / JWT Bearer Token) ──► [Wanderly Server API]
```

1. **State & Store (`/src/lib/trips-store.ts`)**: Tracks active user sessions. On load, stores verified user data and syncs active JWT tokens.
2. **Axios Client Interceptor (`/src/lib/api.ts`)**: Custom Axios client that checks client `localStorage` for the active token and automatically appends it to all outbound headers under `Authorization: Bearer <token>`.
3. **Responsive UI Elements (`/src/components/ui`)**: High-performance, accessible Radix-ui components customized to fit Wanderly's dark-themed aesthetic.
4. **Export Engine**: Uses custom CSS `@media print` queries to hide navigation headers and render a secondary, textbook-style high-fidelity print document when `window.print()` is executed.

---

## 🔐 Authentication & Authorization Approach

Authentication flow is handled on the client via two methods:
1. **Email & Password**: Custom client registration and login forms with error handling validated with Zod.
2. **Google OAuth via Firebase**: The client calls Firebase Auth's `signInWithPopup` using Google Auth provider. On success, Firebase returns user credentials. The client passes this token metadata (`email`, `name`, `photoURL`) to the backend API (`/api/auth/google`) which verifies the login and returns a signed 7-day JWT.
3. **Session Interception**: Client checks local storage on startup. If the JWT is present, access is granted to the private `/dashboard` pages. If a protected route is requested without a token, the user is redirected to the `/login` screen.

---

## 🤖 AI Agent Design & Purpose

Wanderly Client leverages the backend's structured JSON generative capabilities by mapping parameters into detailed timelines:
- **Interactive Configuration Wizard**: Renders selections for duration, budget constraints, and personal interests, sending these as payload criteria.
- **Dynamic Corrections Controller**: Instead of forcing the user to rewrite entire trips, the client exposes a "Regenerate Day" option. A user types adjustments in plain English, and the client communicates the update to the server's day regeneration service, seamlessly refreshing that single timeline block.

---

## 🎨 Creative & Custom Features

### 1. Dual-Layout Editorial PDF Printing Engine
The application implements custom CSS print stylesheets (`print:block` and `print:hidden`). When clicking **Export PDF**, `window.print()` is invoked. The client hides all buttons, dark-mode backgrounds, and scrollbars, and formats the trip itinerary into a classic, two-column black-and-white editorial textbook layout, featuring serif typography, cover pages, and page breaks.

### 2. Multi-Currency Conversion Display
The UI reads AI-generated rates from the server. It calculates and renders prices in both Indian Rupee (INR) and the trip destination's local currency symbol (e.g. Yen `¥`, Euro `€`) side-by-side:
```typescript
const formatCurrency = (usdVal: number) => {
  const usdToINR = trip.usdToINRRate || 83.5;
  const usdToLocal = trip.usdToLocalRate || 1;
  const inrVal = Math.round(usdVal * usdToINR);
  const localVal = Math.round(usdVal * usdToLocal);
  return `₹${inrVal.toLocaleString("en-IN")} / ${symbol}${localVal.toLocaleString()}`;
};
```

---

## ⚠️ Known Limitations

- **Simulated Navigation**: Coordinates and transit details are displayed sequentially (e.g., *"Walk (15 mins)"*), but the client does not render interactive mapping paths or live traffic reports.
- **Client-Side Firebase Dependencies**: Firebase scripts must load fully in the browser to permit Google Login authentication.

---

## ⚙️ Setup & Installation (Local & Deployed)

### Prerequisites
- Node.js (v18 or higher)
- Firebase Project (to obtain API credentials for client-side Auth)
- Active Wanderly Backend API running locally or on a cloud server

### Local Installation
1. Navigate to the client root:
   ```bash
   cd Wanderly_client-main
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the client directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to: `http://localhost:3000`

### Deployed Setup (e.g., Vercel)
1. Push your code to GitHub (making sure `.env` is excluded in `.gitignore`).
2. Log into **Vercel** and select **New Project**.
3. Select your repository. Ensure Next.js is selected as the framework.
4. Open the environment variables section and input all keys from your local `.env`. Ensure `NEXT_PUBLIC_API_URL` points to your deployed backend production URL.
5. Click **Deploy**. Vercel will automatically compile, optimize, and launch your client app.

---

## 📂 Detailed Folder Structure & Directory Files

```
Wanderly_client-main/
├── next.config.ts            # Next.js configuration and image CDN domain permission list
├── tsconfig.json             # TypeScript rules and path aliases (@/*)
├── postcss.config.mjs        # PostCSS configuration for styling compiles
├── tailwind.config.ts        # Tailwind configuration (or styling setups)
├── vercel.json               # Deployment configurations and routing redirects
├── public/                   # Static browser assets
│   ├── logo.webp             # Wanderly application logo
│   └── assets/               # Local WebP background assets (Tokyo, Amalfi, space images)
├── src/
│   ├── app/                  # Next.js App Router Root
│   │   ├── globals.css       # Global styles (Tailwind directives, variables, marquee keyframes)
│   │   ├── layout.tsx        # Root HTML wrapper (applies Google Fonts Outfit & Inter)
│   │   ├── page.tsx          # Landing page (Bento grids, GSAP texts, Hero sections)
│   │   ├── login/            # Authentication Sign-In page
│   │   ├── register/         # Account Registration page
│   │   └── dashboard/        # Authenticated Session Dashboard
│   │       ├── layout.tsx    # Dashboard UI layouts (navigation headers)
│   │       ├── page.tsx      # User home (itinerary forms, generated list)
│   │       ├── profile/      # User details editor
│   │       └── trip/[id]/    # Core trip details, PDF engine, activities editor
│   ├── components/           # Reusable UI widgets
│   │   ├── site-nav.tsx      # Main menu navigation header (responsive drawer, user status dropdown)
│   │   ├── site-footer.tsx   # Footers featuring GSAP stagger effect
│   │   ├── trip-card.tsx     # Summary widget card for dashboard listings
│   │   ├── theme-provider.tsx# Light/Dark mode state management provider
│   │   ├── smooth-scrolling.tsx # Lenis wrapper logic
│   │   ├── scroll-reveal.tsx # GSAP fade-in utilities
│   │   └── ui/               # Radix UI customized component primitives (modals, calendars, buttons)
│   ├── hooks/
│   │   └── use-mobile.tsx    # Viewport breakpoint listener
│   └── lib/
│       ├── api.ts            # Custom Axios instance with authorization interceptor
│       ├── firebase.ts       # Firebase initialization setup (for Google Sign-In popups)
│       ├── trips-store.ts    # Global React store for user session states
│       └── utils.ts          # Tailwind CSS merge utility helpers (cn)
└── package.json              # Frontend scripts and bundle specifications
```
