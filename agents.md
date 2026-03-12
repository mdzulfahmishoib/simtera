# AVIS TES SIM — AI Agent Instructions

> Read `context.md` first for project overview, tech stack, architecture, and database schema.
> Read `tasks.md` for what's done and what's planned.

---

## 1. How to Understand This Project

Before implementing anything:

1. **Read `context.md`** — understand the tech stack, architecture, feature set, and data model.
2. **Read `tasks.md`** — understand what's completed, in progress, and known issues.
3. **Check the relevant source file** before modifying it — never assume structure from memory.
4. **Key entry points to read first:**
   - `src/app/layout.tsx` — root layout, fonts, providers
   - `src/app/page.tsx` — public landing page
   - `src/app/admin/(dashboard)/layout.tsx` — admin auth guard
   - `src/middleware.ts` — route protection logic
   - `src/app/admin/(dashboard)/questions/actions.ts` — all question mutations

---

## 2. Coding Style & Structure to Follow

### React / Next.js
- **Server Components by default.** Only add `"use client"` when you need `useState`, `useEffect`, event handlers, or browser APIs.
- **Server Actions** (`'use server'`) for all data mutations. Never use API routes for mutations.
- All page components under `app/` are async by default (server components).
- Use `searchParams` prop (typed as `Promise<{...}>`) in server page components for URL params. Always `await props.searchParams`.
- Avoid `useRouter().push()` in server components. Use `redirect()` from `next/navigation`.

### Supabase
- **Server context**: Import from `@/lib/supabase/server` → `createClient()` (must be awaited: `const supabase = await createClient()`)
- **Client context**: Import from `@/lib/supabase/client` → `createClient()` (NOT awaited)
- **Admin operations** (create user, reset password, etc.): Use `SUPABASE_SERVICE_ROLE_KEY` via `supabase.auth.admin.*` — only in server actions.
- After every mutation, call `revalidatePath('/admin/questions')` (or appropriate path).

### Supabase Client — Common Patterns
```ts
// Fetch with count for pagination
const { data, count } = await supabase
  .from('table')
  .select('*', { count: 'exact' })
  .range((page - 1) * pageSize, page * pageSize - 1)

// Filter by enum column
.eq('sim_type', 'A')

// Filter across two values (use .or() for OR logic)
.or('sim_type.eq.A,sim_type.eq.Both')
```

### Styling
- Use **Tailwind CSS** only — no inline styles, no CSS modules.
- **Dark mode**: always use semantic classes: `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`. Avoid hardcoded `bg-white`, `text-gray-*`.
- **Brand color**: `#21479B` for primary blue. Hover: `#1a3778`. Always pair with `text-white` when used as background.
- Dark mode variant example: `dark:bg-blue-900/20`, `dark:text-blue-300`.

### UI Components
- Use **shadcn/ui** components from `@/components/ui/*`.
- **Dialog / Modal pattern**: 
  ```tsx
  // CORRECT — use render prop (NOT asChild, it's not supported)
  <DialogTrigger render={<Button className="bg-[#21479B] text-white" />}>
    Button Label
  </DialogTrigger>
  ```
- **Select**: Use `name="field_name"` for server action form integration. Add `bg-white dark:bg-slate-950` to `SelectTrigger` inside muted card backgrounds.
- **Pagination links**: Use `Link` + `cn(buttonVariants({ variant: 'outline', size: 'sm' }))` — NOT `Button asChild` (asChild not supported).
- **Toasts**: `toast.success("...")` and `toast.error("...")` from `sonner`.

---

## 3. File Organization Conventions

```
src/app/[route]/
  page.tsx          ← Server component. Data fetching, table rendering.
  actions.ts        ← Server actions ONLY ('use server'). No UI.
  create-*.tsx      ← Client modal for creating new records.
  edit-*.tsx        ← Client modal for editing existing records.

src/components/
  *.tsx             ← Reusable client components.
  ui/               ← shadcn/ui primitives only. Don't modify unless necessary.

src/lib/supabase/
  client.ts         ← createBrowserClient — import in client components
  server.ts         ← createServerClient — import in server components + actions
```

---

## 4. Rules for Modifying Existing Code

1.  **View the file before editing** — always call `view_file` to see current content.
2.  **Make targeted edits** — use `replace_file_content` or `multi_replace_file_content`. Never rewrite the entire file unless creating new.
3.  **Don't break existing patterns** — e.g., the `DialogTrigger render={}` pattern, `isPersepsi` logic, and **Balanced Randomization** in quiz fetch.
4.  **After adding a new DB column**, update ALL relevant places:
    -   `actions.ts` (extract from `formData`, include in insert/update)
    -   Create modal (add form field)
    -   Edit modal (add form field + update `Question` type)
    -   Table page (add column header + cell)
    -   Database (provide SQL migration to user/schema.sql)
5.  **Admin Table Pattern**: Use `src/app/admin/(dashboard)/results/results-table-client.tsx` as a reference for implementing tables with mass operations (checkbox selection, bulk delete).
6.  **Admin forms use `formData.append()`** for values managed in local state (like `category` or `module`) since uncontrolled selects don't auto-include in `FormData`.

---

## 5. Best Practices for Adding New Features

### Adding a new admin table page

1. Create `src/app/admin/(dashboard)/[feature]/page.tsx` as a server component.
2. Fetch data with Supabase inside the component (with count for pagination).
3. Use `<Table>`, `<TableHeader>`, `<TableBody>` from `@/components/ui/table`.
4. Add pagination using `Link` + `buttonVariants` (not `Button asChild`).
5. Add the route to `AdminSidebar` in `src/components/admin-sidebar.tsx`.

### Adding a new database column

1. Provide SQL to user:
   ```sql
   ALTER TABLE table_name ADD COLUMN col_name TYPE [DEFAULT value];
   ```
2. Update `actions.ts` to extract and include new field.
3. Update create/edit modal TSX to add form field.
4. Update `Question` type in edit modal if needed.
5. Update the table page to display the new column.

### Adding a new modal

- Always use the `Dialog` + `DialogTrigger render={}` pattern.
- Use `useState` for `open` and `loading`.
- Handle errors with `toast.error`, success with `toast.success` + `setOpen(false)`.
- For form fields tied to state (not native form fields), use `formData.append(key, value)` before calling the server action.

### Dark Mode Checklist for new UI
- [ ] All backgrounds use `bg-background`, `bg-card`, `bg-muted` etc.
- [ ] All text uses `text-foreground`, `text-muted-foreground` etc.
- [ ] `hover:dark:` variants added where needed
- [ ] Brand-colored buttons include `text-white`
- [ ] Logo/brand text includes `dark:text-white`

### Audio & Video Accessibility
- Always add `playsInline` and `webkit-playsinline="true"` to `<video>` tags for iOS compatibility.
- For features requiring auto-play audio (like "Persepsi Bahaya"), use the **Audio Priming** pattern:
  - Keep a hidden `<audio ref={audioRef} />` in the root of the page.
  - Trigger a silent `.play()` on a user interaction (like a "Start" button) to unlock the audio context for the session.
  - Subsequent audio changes should update `audioRef.current.src` and call `.play()`.

---

## 6. Key Third-Party Package Notes

| Package         | Usage Note                                                    |
|-----------------|---------------------------------------------------------------|
| `next-themes`   | `useTheme()` hook in client components only                   |
| `sonner`        | `toast.success/error()` — Toaster rendered in root layout     |
| `lucide-react`  | All icons. Import named. e.g. `import { Trash2 } from 'lucide-react'` |
| `uuid`          | `import { v4 as uuidv4 } from 'uuid'` — used in media upload  |
| `@supabase/ssr` | Used for SSR-safe Supabase client with cookie handling        |
| `class-variance-authority` | Use `@/components/ui/button-variants` for Server-safe styles |
| `clsx` + `tailwind-merge` | Exposed via `cn()` in `@/lib/utils`               |
