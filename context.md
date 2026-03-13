# SIMTERA — Project Context

## Project Overview

**SIMTERA** is a fullstack SIM (Surat Izin Mengemudi / Driver's License) Theory Exam Simulator for Indonesia. It allows citizens to practice for their driving license theory exam (SIM A for cars, SIM C for motorcycles) before taking the real test at the police office (Satpas).

- **App URL (dev):** `http://localhost:3000`
- **Admin Panel:** `http://localhost:3000/admin`
- **Language:** Indonesian (UI text is in Bahasa Indonesia)
- **Brand Color:** `#21479B` (deep blue)

---

## Tech Stack

| Layer         | Technology                                |
|---------------|-------------------------------------------|
| Framework     | Next.js 15+ (App Router, Turbopack)       |
| Language      | TypeScript                                |
| Styling       | Tailwind CSS v4                           |
| UI Components | shadcn/ui (Radix UI primitives)           |
| Font          | Inter (Google Fonts via `next/font`)      |
| Theme         | next-themes (light / dark mode)           |
| Backend/DB    | Supabase (PostgreSQL, Auth, Storage)      |
| Auth          | Supabase Auth (email/password)            |
| Storage       | Supabase Storage bucket: `question-media` |
| Icons         | lucide-react                              |
| Toast         | sonner                                    |
| Date Utility  | date-fns                                  |
| UUID          | uuid                                      |

---

## Architecture Overview

```
src/
├── app/
│   ├── layout.tsx              # Root layout: ThemeProvider, Toaster, Inter font
│   ├── globals.css             # Global styles, Tailwind tokens, theme variables
│   ├── page.tsx                # Public landing page (/)
│   ├── quiz/
│   │   ├── page.tsx            # Quiz engine (client component)
│   │   └── actions.ts          # submitQuizResult server action
│   ├── result/
│   │   └── page.tsx            # Result page (client component)
│   └── admin/
│       ├── login/
│       │   ├── page.tsx        # Admin login form
│       │   └── actions.ts      # login + logout server actions
│           ├── results/
│           │   └── page.tsx    # Test results table
│           └── feedbacks/
│               └── page.tsx    # User feedbacks management table
├── components/
│   ├── admin-shell.tsx         # NEW: Shell with horizontal header navigation (replaced sidebar)
│   ├── feedback-form.tsx       # Public feedback form with captcha
│   ├── start-quiz-modal.tsx    # Public quiz start modal (captures participant info)
│   ├── theme-provider.tsx      # next-themes ThemeProvider wrapper
│   ├── theme-toggle.tsx        # Sun/Moon toggle button (supports hideText prop)
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx          # Client-side Button component
│       └── button-variants.ts  # Server-safe button styles (CVA)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client (createBrowserClient)
│   │   └── server.ts           # Server Supabase client (createServerClient with cookies)
│   └── utils.ts                # cn() utility for Tailwind class merging
└── middleware.ts                # Auth guard: redirects unauthenticated /admin/* to /admin/login
```

---

## Key Features

### Public (User-Facing)
- **Landing Page `/`**: 
  - **Modern Hero**: High-impact split layout with 3D isometric illustration, gradient typography, and floating status badges.
  - **Features**: Highlighted features section with "Fitur Unggulan" title.
  - **Stats**: Real-time stats with animated indicators.
  - **Other**: FAQ, E-Book download section, and responsive footer.
- **Start Quiz Modal**: Modern UI with `rounded-2xl` buttons. Premium "Semua Modul" module selector with Crown icon. Captures participant `Nama`, `Email`, `Jenis SIM` (A/C), and `Paket Modul`.
- **Quiz Engine `/quiz`**: 
  - **Balanced Randomization**: For "Semua Modul" module, questions are picked evenly from all 4 modules across each category (25/20/20).
  - **Timer Logic**: Dynamic timers (25s for first question, 35s for subsequent).
  - **Media & Audio**: Autoplay video/audio with iOS compatibility. Persistent audio context for "Persepsi Bahaya".
- **Result Page `/result`**: Shows total score, per-category breakdown, Pass/Fail status. Includes a **Donation Card** and **Feedback Form** with captcha.

### Admin Portal `/admin`
- **Login `/admin/login`**: Modern form with Show/Hide password toggle and loading states.
- **Admin Shell**: Clean horizontal navigation header (sticky with backdrop-blur) replacing the old sidebar for more workspace area.
- **Dashboard `/admin`**: Animated stats cards linked to sub-pages. Recent results feed.
- **Question Bank `/admin/questions`**: Table with Category, Preview, SIM Type, Module, Correct Answer, Media, Audio. Includes search and multi-filtering.
- **Add/Edit Questions**: Modals with Category + SIM Type + Module selectors, Question Text, Media/Audio upload.
- **User Management `/admin/users`**: Create admin accounts, reset passwords.
- **Test Results `/admin/results`**: View all test submissions with **Module** column, search, status filters, and **Mass Delete** functionality.
- **Feedbacks `/admin/feedbacks`**: View user critiques, suggestions, and corrections.

---

## Important Database Tables

### `questions`
| Column         | Type                            | Notes                                          |
|----------------|---------------------------------|------------------------------------------------|
| id             | UUID (PK)                       |                                                |
| category       | ENUM ('Persepsi Bahaya', 'Wawasan', 'Pengetahuan') |                              |
| sim_type       | TEXT                            | `'A'` or `'C'`                                 |
| module         | TEXT                            | `'Modul 1'`, `'Modul 2'`, etc. or `'Semua Modul'` |
| text           | TEXT                            | Question body                                  |
| media_url      | TEXT (nullable)                 | Public URL from Supabase Storage               |
| media_type     | TEXT (nullable)                 | `'image'`, `'video'`, or `'audio'`             |
| audio_url      | TEXT (nullable)                 | Specific audio for Persepsi Bahaya             |
| options        | JSONB                           | Array of answer strings                        |
| correct_answer | TEXT                            | Must match one of the options                  |
| created_at     | TIMESTAMPTZ                     |                                                |

### `test_results`
| Column              | Type     | Notes                              |
|---------------------|----------|------------------------------------|
| id                  | UUID (PK)|                                    |
| participant_name    | TEXT     |                                    |
| participant_email   | TEXT     |                                    |
| sim_type            | TEXT     | `'A'` or `'C'`                     |
| module              | TEXT     | Selected module (e.g., 'Semua Modul') |
| score_persepsi      | INTEGER  | Out of 25                          |
| score_wawasan       | INTEGER  | Out of 20                          |
| score_pengetahuan   | INTEGER  | Out of 20                          |
| total_score         | INTEGER  | Computed in `submitQuizResult`     |
| pass_status         | BOOLEAN  | true if total_score >= 70          |
| created_at          | TIMESTAMPTZ |                                 |

### `profiles`
| Column     | Type     | Notes                               |
|------------|----------|-------------------------------------|
| id         | UUID (PK)| References `auth.users.id`          |
| role       | TEXT     | Always `'admin'` for this app       |
| created_at | TIMESTAMPTZ |                                  |

### `feedbacks`
| Column            | Type        | Notes                                          |
|-------------------|-------------|------------------------------------------------|
| id                | UUID (PK)   |                                                |
| participant_name  | TEXT        |                                                |
| participant_email | TEXT        |                                                |
| type              | TEXT        | 'Critique', 'Suggestion', 'Correction'         |
| content           | TEXT        | The actual feedback text                       |
| created_at        | TIMESTAMPTZ |                                                |

---

## Question Distribution (per quiz session)
- **Persepsi Bahaya**: 25 questions (Balanced from Modul 1-4 if "Semua Modul")
- **Wawasan**: 20 questions (Balanced from Modul 1-4 if "Semua Modul")
- **Pengetahuan**: 20 questions (Balanced from Modul 1-4 if "Semua Modul")
- **Total**: 65 questions
- **Timer**: 25s (initial) / 35s (subsequent)
- **Passing score**: ≥ 70 / 100

## Persepsi Bahaya Special Logic
- Options are fixed: `['Mengurangi Kecepatan', 'Melakukan Pengereman', 'Mempertahankan Kecepatan']`
- Automatically assigned in `actions.ts` — no user input for options needed
- In modals, option input fields are hidden (`isPersepsi ? null : ...`)

---

## Coding Conventions

- **Server Components** by default. Use `"use client"` only when needed.
- **Server Actions** for all mutations (create, update, delete, login, logout).
- **Supabase SSR**: Always use `@/lib/supabase/server` in server components/actions.
- **Brand color**: `#21479B` (hover: `#1a3778`).
- **Dark mode**: Use Tailwind `dark:` variants and semantic colors (`bg-background`, `text-muted-foreground`).
- **Storage**: Bucket `question-media` with 10MB limit.
- **Modals**: Use `shadcn/ui Dialog` with `DialogTrigger render={<Button />}` pattern.
- **Toasts**: Use `sonner`.
