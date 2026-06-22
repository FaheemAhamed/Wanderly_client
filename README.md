# Wanderly - AI Travel Planner

Wanderly is a modern, AI-powered travel planning application that automatically generates comprehensive, meticulously crafted day-by-day itineraries based on user destinations, interests, and constraints. It uses the Gemini AI engine combined with external weather and image APIs to bring locations to life.

## Core Features
- **Generative Itineraries**: Enter a destination, dates, and interests to generate a full, mathematically optimized daily timeline.
- **Cinematic UI/UX**: Premium scroll animations, glassmorphic elements, bento grids, and dynamic layout components powered by GSAP and Tailwind CSS.
- **Real-Time Context**: Integrates live atmospheric forecasts and geographical topology mapping for every trip.
- **Authentication**: Seamless secure onboarding with email/password and Google OAuth via Firebase.
- **Responsive Architecture**: Fully optimized for mobile, tablet, and desktop environments.

---

## Tech Stack

### Client (Frontend)
- **Next.js 14** (React Framework using App Router)
- **TypeScript** 
- **Tailwind CSS v4** (Utility-first styling)
- **GSAP & @gsap/react** (High-performance scroll and layout animations)
- **Radix UI / Shadcn UI** (Unstyled, accessible component primitives)
- **Lucide & Phosphor Icons** (Iconography)
- **Zod & React Hook Form** (Form state and validation)
- **Firebase Auth** (Client-side Google Authentication)

### Server (Backend)
- **Node.js & Express.js** (REST API framework)
- **MongoDB & Mongoose** (NoSQL Database & Object Data Modeling)
- **@google/generative-ai** (Gemini AI for itinerary generation)
- **Cloudinary** (Image management)
- **Axios** (External API fetching)
- **JWT & bcryptjs** (Authentication & password hashing)

---

## Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Atlas or local)
- Google Gemini API Key
- Firebase Project setup

### Installation
1. Clone the repository.
2. Install client dependencies: `cd client && npm install`
3. Install server dependencies: `cd server && npm install`
4. Setup environment variables in `/client/.env` and `/server/.env`
5. Run the development server:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

---

## Folder Structure & File Explanations

The repository is organized into a monorepo style with two main directories: `/client` and `/server`.

### `/client` (Frontend Application)

#### Configuration & Root Files
- **`package.json` & `package-lock.json`**: NPM dependencies and script definitions.
- **`next.config.ts`**: Configuration for Next.js build environment and image domains.
- **`tsconfig.json`**: TypeScript compiler configuration and path aliases (`@/*`).
- **`postcss.config.mjs`**: Configuration for PostCSS (required for Tailwind).
- **`eslint.config.mjs`**: Configuration for the ESLint linter.
- **`vercel.json`**: Deployment rules and rewrites for Vercel.
- **`next-env.d.ts`**: TypeScript declarations for Next.js types.
- **`.env`**: Local environment variables for the frontend.

#### `/client/public` (Static Assets)
- **`logo.webp`**: The main Wanderly application logo.
- **`hero-bg.webm`**: Optional video background asset.
- **`/assets/*.webp`**: Pre-compressed webp stock imagery used for visual flair on landing pages, auth pages, and generic trip generation backgrounds (e.g., `tokyo.webp`, `amalfi.webp`, `space-earth.webp`, `user0.webp`, etc.).

#### `/client/src/app` (Next.js App Router)
- **`globals.css`**: Global stylesheet including Tailwind directives, root CSS variables for theme colors, and custom animation keyframes (like `marquee`).
- **`layout.tsx`**: The root HTML layout wrapping the entire application. Configures the `Outfit` and `Inter` fonts, and wraps children in the `ThemeProvider`.
- **`page.tsx`**: The main public landing page. Contains the cinematic hero section, the GSAP `ScrubbingTextReveal`, the `Features` bento grid, and the `HorizontalAccordions`.
- **`favicon.ico`**: Browser tab icon.
- **`/login/page.tsx`**: The authentication page for returning users. Features a dynamic split-screen layout with form and image banner.
- **`/register/page.tsx`**: The sign-up page for new users.
- **`/dashboard`**: Protected routes area requiring an active session.
  - **`layout.tsx`**: Shared layout rendering the dashboard navigation header.
  - **`page.tsx`**: Main dashboard view. Shows the form to generate a new itinerary and renders existing `TripCard` components.
  - **`/profile/page.tsx`**: User profile management and settings UI.
  - **`/trip/[id]/page.tsx`**: Detailed dynamic view of a generated itinerary. Parses and renders the AI-generated JSON days and activities.

#### `/client/src/components` (React Components)
- **`site-nav.tsx`**: The main public navigation bar. Includes scroll-spy logic, the mobile hamburger menu morph animation, and the user avatar dropdown.
- **`site-footer.tsx`**: The public footer containing the animated GSAP "WANDERLY" text stagger effect, a central Call-to-Action, and navigation links.
- **`trip-card.tsx`**: A display card for summarizing an itinerary on the dashboard (shows title, dates, and background image).
- **`theme-provider.tsx`**: Wraps the app in `next-themes` logic for Dark/Light mode switching.
- **`theme-toggle.tsx`**: A button component to toggle the active theme.
- **`smooth-scrolling.tsx`**: Implements the `Lenis` smooth scroll wrapper for premium scrolling physics on the landing page.
- **`scroll-reveal.tsx`**: A utility wrapper to trigger GSAP fade-in animations as elements enter the viewport.

#### `/client/src/components/ui` (Shadcn UI Primitives)
These files are highly customizable, accessible base components built on Radix UI and styled with Tailwind.
- **`accordion.tsx`**: Vertical collapsible accordion panels.
- **`alert-dialog.tsx`**: High-priority modal dialogs requiring user confirmation.
- **`alert.tsx`**: Callout boxes for displaying important messages.
- **`aspect-ratio.tsx`**: Container maintaining a specific responsive aspect ratio.
- **`avatar.tsx`**: User profile picture display with automatic text fallback.
- **`badge.tsx`**: Small visual indicators or status labels.
- **`breadcrumb.tsx`**: Navigational breadcrumb trails.
- **`button.tsx`**: Primary interactive button element with various size and style variants.
- **`calendar.tsx`**: Date picker calendar UI.
- **`card.tsx`**: A styled container with a header, content, and footer sections.
- **`carousel.tsx`**: Horizontal scrolling slider component.
- **`chart.tsx`**: Data visualization charting component.
- **`checkbox.tsx`**: Accessible checkbox input.
- **`collapsible.tsx`**: Expand/collapse container.
- **`command.tsx`**: Command palette / combobox interface.
- **`context-menu.tsx`**: Right-click context menus.
- **`dialog.tsx`**: Standard modal overlay windows.
- **`drawer.tsx`**: Mobile-friendly bottom sheet drawer overlays.
- **`dropdown-menu.tsx`**: Click-triggered dropdown menus (used for the user avatar menu).
- **`form.tsx`**: React Hook Form wrapper components for standardized form layouts.
- **`hover-card.tsx`**: Popovers triggered by hovering over an element.
- **`input-otp.tsx`**: One-time-password input fields.
- **`input.tsx`**: Standard text input fields.
- **`label.tsx`**: Accessible form labels.
- **`menubar.tsx`**: Desktop-style top menu bars.
- **`navigation-menu.tsx`**: Complex multi-level navigation dropdowns.
- **`pagination.tsx`**: Page number navigation links.
- **`popover.tsx`**: Floating popover panels tied to an anchor element.
- **`progress.tsx`**: Progress bars and loading indicators.
- **`radio-group.tsx`**: Mutually exclusive radio button groups.
- **`resizable.tsx`**: Resizable pane layouts.
- **`scroll-area.tsx`**: Custom styled scrollbars.
- **`select.tsx`**: Styled `<select>` dropdown menus.
- **`separator.tsx`**: Visual dividing lines (hr).
- **`sheet.tsx`**: Side-drawer modal overlays.
- **`sidebar.tsx`**: Application sidebar layout components.
- **`skeleton.tsx`**: Loading state placeholders (used while fetching trips).
- **`slider.tsx`**: Draggable range sliders.
- **`sonner.tsx`**: Toast notification system wrapper.
- **`switch.tsx`**: Boolean toggle switches.
- **`table.tsx`**: Styled data tables.
- **`tabs.tsx`**: Tabbed content interfaces.
- **`textarea.tsx`**: Multi-line text input fields.
- **`toggle-group.tsx` & `toggle.tsx`**: Interactive toggle buttons.
- **`tooltip.tsx`**: Hover tooltips explaining UI elements.

#### `/client/src/lib` (Utilities & State)
- **`api.ts`**: Configures an Axios instance that automatically attaches the JWT auth token from `localStorage` to backend requests.
- **`firebase.ts`**: Initializes the Firebase SDK specifically for handling Google OAuth popups.
- **`trips-store.ts`**: Global state management that tracks the current `user` session object across the application.
- **`utils.ts`**: Contains the `cn()` helper function, which merges standard Tailwind classes dynamically without conflicts using `clsx` and `tailwind-merge`.

#### `/client/src/hooks`
- **`use-mobile.tsx`**: A custom React hook that attaches a window resize listener to detect if the current viewport is smaller than the desktop breakpoint (used for conditional rendering).

---

### `/server` (Backend Application)

#### Configuration & Root Files
- **`server.js`**: Application entry point. Connects to the MongoDB database and binds the Express server to the specified port.
- **`app.js`**: Initializes the Express app, configures global middleware (CORS, body-parser, Morgan logging, Helmet security), and registers the routing modules.
- **`index.js`**: Legacy or alternative entry script (typically forwards to server.js).
- **`package.json` & `package-lock.json`**: Backend NPM dependencies and start/dev scripts.
- **`.env`**: Environment variables (Database URIs, API keys, JWT secrets, port configurations).
- **`.gitignore`**: Excludes `node_modules` and `.env` from version control.

#### `/server/src/config`
- **`database.js`**: Mongoose connection logic establishing a secure link to the MongoDB cluster, complete with connection error handling.

#### `/server/src/controllers` (Business Logic)
- **`auth.controller.js`**: Handles user registration, standard JWT login, password hashing, and the Google OAuth backend flow (registering/logging in the user via Firebase data).
- **`trip.controller.js`**: Orchestrates the main application feature. Extracts destination/dates from the request, calls the AI service to generate the itinerary JSON, saves it to the DB, and handles fetching trips for the user.
- **`review.controller.js`**: Handles fetching public testimonials/reviews and submitting new feedback.

#### `/server/src/models` (Database Schemas)
- **`user.model.js`**: User schema containing email, hashed passwords, name, and profile picture URL.
- **`trip.model.js`**: Itinerary schema holding the heavily structured JSON array of days, activities, locations, and weather coordinates generated by the AI engine.
- **`review.model.js`**: Schema for application reviews, ratings, and feedback text.

#### `/server/src/routes` (API Endpoints)
- **`auth.routes.js`**: Defines endpoints like `POST /api/auth/register`, `POST /api/auth/login`, and `POST /api/auth/google`.
- **`trip.routes.js`**: Defines endpoints like `POST /api/trips/generate` and `GET /api/trips` (protected routes).
- **`review.routes.js`**: Defines endpoints like `GET /api/reviews` and `POST /api/reviews`.

#### `/server/src/services` (External Integrations)
- **`ai.service.js`**: Contains the core prompt engineering logic. Interfaces directly with the `@google/generative-ai` library to prompt Gemini, enforces a strict structured JSON output format, and parses the resulting text into a usable itinerary object.
- **`image.service.js`**: Responsible for querying external APIs (like Unsplash, Pexels, or Cloudinary) to fetch dynamic high-quality images for specific generated locations.
- **`weather.service.js`**: Interfaces with external meteorological APIs to fetch forecasts or historical weather averages for the trip locations.

#### `/server/src/middleware`
- **`auth.middleware.js`**: Express middleware that intercepts requests to protected routes, verifies the JWT access token in the `Authorization` header, and attaches the decoded user ID to the request object.
- **`error.middleware.js`**: A global error handling middleware interceptor designed to catch unhandled exceptions, format clean API JSON responses, log stack traces, and prevent the server from crashing.

#### `/server/src/utils`
- **`retry.util.js`**: Contains helper functions implementing exponential backoff. This is used to wrap external API calls (like Gemini or the image service) so they automatically retry gracefully if rate-limited or temporarily unresponsive.
