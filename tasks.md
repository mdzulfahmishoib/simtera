# SIMTERA — Task Tracker

_Last updated: 2026-03-13_

---

## ✅ Completed Features

### Foundation
- [x] Next.js App Router project setup with TypeScript, Tailwind CSS, ESLint  
- [x] Supabase client utilities (`client.ts`, `server.ts`)  
- [x] Global Inter font via `next/font/google`  
- [x] Light / Dark mode via `next-themes` with `ThemeProvider`  
- [x] Global `Toaster` (sonner) in root layout  
- [x] Middleware for session refresh and admin route protection  

### Authentication
- [x] Admin login page (`/admin/login`) with Supabase email/password auth  
- [x] **UI Enhancement**: Added Show/Hide password toggle and loading spinner on Submit.
- [x] Server actions: `login`, `logout` in `admin/login/actions.ts`  
- [x] Route group `(dashboard)` with server-side auth guard in `layout.tsx`  
- [x] Middleware redirect: unauthenticated `/admin/*` → `/admin/login` (no redirect loop on login page)  

### Admin — Dashboard
- [x] Dashboard overview with stat cards linked to respective management pages.
- [x] **Modern Styling**: Applied border-side colors, hover-scale effects, and consistent dark mode colors.
- [x] Recent test results feed on dashboard with name/email truncation.
- [x] **Analytics Dashboard**: Real-time stats calculation in `admin/page.tsx`
- [x] **Admin Shell Refactor**: Removed Sidebar and replaced with a modern horizontal Sticky Header.

### Admin — Question Management (`/admin/questions`)
- [x] Question Bank table with columns: Category, Preview (truncated), SIM Type badge, Modul, Correct Answer (truncated), Media, Audio, Actions
- [x] Server-side pagination and search/filtering (Category, SIM Type, Module, Keyword)
- [x] "Showing X to Y of Z entries" info text 
- [x] Create question modal with:
  - [x] Category + SIM Type + Module selectors (dynamic grid)
  - [x] Question text textarea
  - [x] Media file upload (image/video, optional)
  - [x] Audio file upload (specifically for Persepsi Bahaya)
  - [x] Dynamic options inputs (hidden for Persepsi Bahaya)
  - [x] Dynamic Correct Answer select (populates from option inputs; fixed values for Persepsi Bahaya)
- [x] Edit question modal with same dynamic fields, pre-populated from existing data
- [x] Delete question (with media and audio cleanup from storage)
- [x] File upload size limit: 10MB (`next.config.ts`)
- [x] `+ Add Question` button icon (Plus), `Delete` button icon (Trash2)
- [x] `text-white` on Add Question button (dark mode fix)
- [x] SIM Type badge: blue for SIM A, orange for SIM C
- [x] Cursor: pointer for all buttons across the application

### Admin — User Management (`/admin/users`)
- [x] List admin users  
- [x] Create admin modal  
- [x] Reset password modal  

### Admin — Test Results (`/admin/results`)
- [x] List test results table
- [x] **New Column**: Added "Module" column to identify which module was taken.
- [x] Server-side pagination, search (name/email), and status filtering for Results table
- [x] Badge styling for SIM types and pass/fail status in results table
- [x] Truncated Long Correct Answers with hover titles (Admin)
- [x] **Admin Results: Mass Delete**: Added delete functionality with inline checkboxes for bulk operations.
- [x] **Confirmation**: Added confirmation dialog before deletion.
- [x] **Admin Shell Refactor**: Cleaned up sidebar related hydration fixes.
- [x] **Admin Feedbacks**: Dedicated page to manage user critiques, suggestions, and corrections.

### Public — Landing Page (`/`)
- [x] Fixed header with logo + Theme Toggle button (icon-only, top-right)
- [x] **Premium Hero Redesign**: Split layout with 3D illustration, gradient text, and floating badges.
- [x] Feature highlights grid (3 cards) with "Fitur Unggulan" heading.
- [x] Statistics section (Total sessions, Pass rate, Lulus count) with animated pings.
- [x] Footer
- [x] Full dark mode support (bg-background, bg-card, text-muted-foreground)
- [x] Logo color: `#21479B` in light, white in dark mode
- [x] **Responsive Buttons**: Hero buttons ("Mulai Simulasi" & "Pelajari Materi") now fit content width on mobile instead of full-width.
- [x] **FAQ Section**: Added detailed FAQ about modules and exam rules.
- [x] **E-Book Links**: Integrated direct Supabase storage links for all SIM A & C modules.

### Public — Start Quiz Modal
- [x] Captures: Nama Lengkap, Email, Jenis SIM, and Module selection  
- [x] **Premium UI**: Using `rounded-2xl`, scale animations, and cohesive color palettes.
- [x] **Enhanced Modules**: Added `Crown` icon and special styling for the "Acak" module.
- [x] SIM type selector: standardized colors (Blue for A, Orange for C).
- [x] Stores data in `sessionStorage` as `quiz_participant`  
- [x] Redirects to `/quiz` on submit  
- [x] **Mobile Fix**: Buttons use `w-fit` to prevent awkward stretching.

### Public — Quiz Engine (`/quiz`)
- [x] Reads participant data from `sessionStorage` (redirects to `/` if missing)  
- [x] Fetches questions filtered by `sim_type` and `module` (A, B, C, D, or Acak)  
- [x] **Balanced Randomization**: For "Acak" module, questions are now picked evenly from all 4 modules (e.g., 5 questions per module for Wawasan) using Fisher-Yates shuffle.
- [x] **Audio Fix**: Persistent audio context for Persepsi Bahaya (autoplays after first interaction).
- [x] **iOS Video Fix**: Added `playsInline` to prevent forced fullscreen on iPhone.
- [x] **UI Polish**: Refined question text size and responsive layouts.
- [x] Sequential flow (no back navigation)  
- [x] Radio answer selection  
- [x] Media display (image/video)  
- [x] Progress bar + question counter  
- [x] Final score calculation and submission via `submitQuizResult` server action  

### Public — Result Page (`/result`)
- [x] 50/50 Side-by-side layout for desktop
- [x] **Donation Section**: Landscape design with QR Code (Tako.id)
- [x] **Feedback Form**: critique, suggestion, and correction submissions
- [x] **Spam Protection**: Captcha verification for feedback
- [x] Form validation (submit button disabled until filled/captcha correct)
- [x] Dynamic messages (Congratulations/Motivations based on result)
- [x] **Score Details**: "Rincian Nilai Per Sesi" breakdown for all categories.
- [x] Full dark mode support and responsive mobile layout

---

## 🚧 Features In Progress

- [ ] `module` database column migration — column added in code but must be manually applied in Supabase:
  ```sql
  ALTER TABLE questions ADD COLUMN module TEXT NOT NULL DEFAULT 'Acak';
  ```

---

## 📋 Planned Features

### Admin
- [ ] Pagination for Users table  
- [ ] Admin dashboard analytics (charts: scores over time)  
- [ ] Seed script for initial admin user  

### Public
- [x] Quiz randomization (shuffle questions within each category)  
- [ ] Review mode after quiz ends (show correct answers)  
- [ ] Print / download result as PDF  
- [x] Mobile-responsive quiz layout improvements  

---

## 🐛 Setup Requirements & Known Issues

- [ ] **Database Schema**: Must be created manually using `supabase/schema.sql`.
- [ ] **Table Update (Migrations)**:
  ```sql
  -- Add category enum values if missing
  -- Add sim_type and audio_url
  ALTER TABLE questions ADD COLUMN sim_type TEXT NOT NULL DEFAULT 'A';
  ALTER TABLE questions ADD COLUMN audio_url TEXT;
  ALTER TABLE questions ADD COLUMN module TEXT NOT NULL DEFAULT 'Acak';
  ```
- [ ] **Storage Bucket**: Create `question-media` bucket manually in Supabase Dashboard with Public Read access.

---

## 💡 Future Improvements

- Add `useTransition` or React `useOptimistic` for smoother admin table updates  
- Add role-based access (super-admin vs. operator)  
- Add rate limiting on quiz submission API  
- Add email notification to participant after quiz (with result summary)  
- Add question import via CSV/Excel  
- Replace `any` types with proper TypeScript interfaces across client components  
