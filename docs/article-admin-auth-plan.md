# Article Admin + Auth Plan

## Context

Project saat ini adalah portfolio berbasis `React + Vite` dengan halaman artikel publik di:

- `/my-notes`
- `/my-notes/:slug`
- `/admin/articles` saat ini masih berbasis `localStorage`

Target berikutnya:

1. Artikel tidak lagi disimpan di browser lokal.
2. Ada admin dashboard yang benar-benar persistent.
3. Ada authentication untuk membatasi akses admin.
4. Upload image dan cover article tidak lagi manual.

---

## Recommendation

### Recommended for this project: `Supabase`

Untuk portfolio seperti ini, pendekatan paling pragmatis adalah memakai `Supabase` sebagai backend utama.

Alasan:

- `Supabase Auth` sudah menyediakan login dan session management.
- `Supabase Database` cukup untuk CRUD artikel.
- `Supabase Storage` cocok untuk cover image dan asset artikel.
- `Row Level Security (RLS)` bisa dipakai untuk membatasi siapa yang boleh baca/tulis data.
- Integrasinya ringan untuk app `React + Vite` lewat `@supabase/supabase-js`.

Ini sesuai kapabilitas resmi Supabase:

- Auth overview: https://supabase.com/docs/guides/auth
- React auth quickstart: https://supabase.com/docs/guides/auth/quickstarts/react
- JS client install/init: https://supabase.com/docs/reference/javascript/installing
- JS client createClient: https://supabase.com/docs/reference/javascript/v1/initializing
- Storage: https://supabase.com/docs/guides/storage
- RLS: https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security
- API security: https://supabase.com/docs/guides/api/securing-your-api

### When to choose custom backend instead

Pilih backend custom kalau tujuan utamanya adalah showcase full backend engineering, misalnya:

- mau ada service API sendiri
- mau ada business rules kompleks
- mau pakai Golang/Node sebagai nilai jual portfolio
- mau kontrol penuh terhadap auth flow, validation, dan audit logging

Tradeoff-nya: implementasi lebih lama, permukaan security lebih besar, dan effort deploy/maintenance naik.

### Final recommendation

`V1`: pakai `Supabase` dulu.

Ini inference dari kebutuhan project sekarang: portfolio article admin dengan auth akan lebih cepat selesai, lebih aman, dan lebih mudah dirawat dibanding bikin backend custom dari nol.

---

## Product Scope

### Public

- list artikel
- detail artikel
- artikel published only
- SEO tetap aktif untuk artikel publik

### Admin

- login
- logout
- list article
- create article
- edit article
- delete article
- save draft
- publish / unpublish
- upload cover image
- upload inline image

### Nice to have after V1

- rich text editor
- scheduled publish
- article preview sebelum publish
- slug uniqueness warning real-time
- audit trail

---

## High-Level Architecture

### Frontend

- tetap pakai `React + Vite`
- ganti source artikel dari `localStorage` ke `Supabase`
- tambah auth context / session provider
- route guard untuk `/admin/*`

### Backend Platform

- `Supabase Auth` untuk login admin
- `Supabase Postgres` untuk data artikel
- `Supabase Storage` untuk asset gambar
- optional `Supabase Edge Functions` kalau nanti butuh logic server-side tambahan

### Auth Model

- hanya user yang di-whitelist sebagai admin yang bisa masuk dashboard
- user biasa atau guest hanya bisa baca artikel publik
- validasi akses utama dilakukan di `RLS`, bukan cuma di UI

---

## Proposed Data Model

### Table: `profiles`

Tujuan:

- menyimpan metadata user
- menentukan apakah user adalah admin

Suggested fields:

- `id uuid primary key references auth.users(id)`
- `email text`
- `full_name text`
- `role text check (role in ('admin'))`
- `created_at timestamptz default now()`

### Table: `articles`

Suggested fields:

- `id uuid primary key default gen_random_uuid()`
- `title text not null`
- `slug text unique not null`
- `excerpt text not null`
- `content jsonb not null`
- `cover_image_url text`
- `cover_image_alt text`
- `category text`
- `tags text[] default '{}'`
- `read_time text`
- `status text check (status in ('draft', 'published')) not null default 'draft'`
- `published_at timestamptz`
- `author_id uuid references profiles(id)`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### Optional table: `article_translations`

Kalau bilingual ingin dipertahankan rapi:

- `id uuid primary key`
- `article_id uuid references articles(id) on delete cascade`
- `language text check (language in ('id', 'en'))`
- `title text`
- `excerpt text`
- `content jsonb`
- `cover_image_alt text`
- unique (`article_id`, `language`)

### Storage buckets

- `article-covers`
- `article-inline-assets`

---

## Auth Plan

### V1 auth flow

- login via email + password
- hanya akun admin yang bisa akses `/admin/articles`
- session dipersist dengan Supabase client

### Authorization rules

- guest:
  - hanya bisa baca artikel `published`
- admin:
  - bisa CRUD semua artikel
  - bisa upload asset

### Access control strategy

- route guard di frontend
- pengecekan session di app startup
- pengecekan role admin dari table `profiles`
- enforcement final di `RLS`

---

## RLS Plan

### `articles`

Policies yang dibutuhkan:

1. `select published articles for everyone`
2. `select all articles for admin`
3. `insert articles for admin`
4. `update articles for admin`
5. `delete articles for admin`

### `profiles`

Policies:

1. user boleh baca profile sendiri
2. admin boleh baca profile yang dibutuhkan dashboard

### `storage.objects`

Policies:

1. publik boleh baca file dari bucket artikel publik jika memang diperlukan
2. admin saja yang boleh upload, update, delete

---

## Frontend Changes

### New modules

- `src/lib/supabase.ts`
- `src/context/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/services/articleService.ts`
- `src/services/uploadService.ts`

### New pages

- `src/pages/Auth/LoginPage.tsx`
- `src/pages/Admin/ArticleStudio.tsx` refactor dari localStorage ke Supabase
- optional `src/pages/Admin/MediaLibrary.tsx`

### Route changes

- `/login`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/articles/:id/edit`

### State changes

- list artikel publik fetch dari Supabase
- detail artikel fetch by slug
- admin dashboard fetch draft + published
- session listener aktif di root app

---

## Migration Plan from Current State

### Phase 1

- pertahankan UI publik sekarang
- buat koneksi Supabase
- pindahkan read artikel publik ke database

### Phase 2

- ganti admin studio dari `localStorage` ke Supabase CRUD
- tambah login/logout
- tambah route guard

### Phase 3

- tambah upload image ke Supabase Storage
- ganti input URL manual menjadi upload flow

### Phase 4

- tambah draft/publish workflow
- tambah translation support jika memang masih diperlukan

---

## Implementation Breakdown

## Phase 0 - Setup

- buat project Supabase
- simpan env:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` atau key publishable yang aktif di project
- install dependency:
  - `@supabase/supabase-js`

Deliverable:

- frontend bisa connect ke Supabase

## Phase 1 - Schema + Security

- buat table `profiles`
- buat table `articles`
- optional buat `article_translations`
- enable RLS
- buat policies dasar
- buat admin seed account pertama

Deliverable:

- database siap dipakai dan sudah aman secara dasar

## Phase 2 - Authentication

- buat login page
- buat auth provider
- ambil session saat app init
- protect route admin
- tampilkan tombol logout di admin

Deliverable:

- hanya admin yang bisa masuk dashboard

## Phase 3 - Article CRUD

- buat `articleService`
- list article admin
- create article
- edit article
- delete article
- draft/publish toggle

Deliverable:

- dashboard admin fungsional

## Phase 4 - Media Upload

- buat bucket storage
- upload cover image
- upload inline article image
- simpan URL hasil upload ke DB

Deliverable:

- author tidak perlu input URL gambar manual

## Phase 5 - Public Read Model

- halaman `/my-notes` hanya ambil article `published`
- halaman detail artikel ambil by `slug`
- fallback not found tetap ada
- SEO dinamis mengikuti data artikel

Deliverable:

- public article flow penuh dari database

## Phase 6 - Hardening

- validasi slug unik
- sanitasi konten sebelum render
- loading/error states
- basic audit fields
- review policy storage dan DB

Deliverable:

- sistem lebih siap dipakai jangka menengah

---

## Risks

### 1. Content structure sekarang cukup custom

Saat ini artikel memakai struktur block seperti:

- paragraph
- heading
- list
- image
- code
- highlight

Solusi:

- simpan sebagai `jsonb`
- render tetap memakai komponen existing

### 2. Translation bisa menambah kompleksitas

Kalau bilingual tetap dipertahankan, CRUD form akan lebih panjang.

Solusi:

- `V1` fokus single language dulu
- translation dijadikan phase terpisah

### 3. Frontend-only admin tidak cukup aman

Kalau hanya hide route tanpa policy DB, itu tidak cukup.

Solusi:

- semua akses admin harus ditegakkan lewat `RLS`

### 4. SEO untuk draft tidak boleh bocor

Solusi:

- query public hanya ambil `published`
- admin pages diberi `noindex`

---

## Suggested Milestone Order

1. Setup Supabase project
2. Schema artikel + profile
3. RLS policies
4. Login/logout
5. Protect admin routes
6. CRUD artikel
7. Publish/draft
8. Upload image
9. Migrasi data artikel existing
10. Polish UI + testing

---

## Suggested Existing Data Migration

Karena saat ini artikel existing ada di `src/data/articles.ts`, migrasinya:

1. ekstrak artikel existing
2. ubah jadi payload DB
3. insert ke table `articles`
4. kalau translation dipakai, insert juga ke `article_translations`
5. ubah frontend public agar prioritas baca dari Supabase
6. setelah stabil, artikel hardcoded lama bisa dipensiunkan

---

## Acceptance Criteria

- admin harus login untuk akses `/admin/articles`
- guest tidak bisa create/edit/delete article
- artikel published muncul di halaman publik
- artikel draft tidak muncul di halaman publik
- image upload berhasil dan tersimpan di storage
- slug unik
- session tetap bertahan setelah refresh
- logout menghapus akses admin

---

## If You Want a Custom Backend Instead

Kalau nanti diputuskan bukan Supabase, opsi paling masuk akal:

- `Go + PostgreSQL + JWT + object storage`

Kenapa:

- selaras dengan positioning kamu sebagai backend developer
- lebih kuat sebagai showcase engineering
- cocok kalau mau menonjolkan API design dan auth sendiri

Tapi saya tetap rekomendasikan:

- `Supabase untuk V1`
- custom backend kalau nanti tujuan utamanya berubah menjadi showcase backend production architecture

---

## Recommended Next Execution

Kalau plan ini disetujui, urutan implementasi paling aman adalah:

1. setup Supabase project
2. buat schema `profiles` + `articles`
3. implement login admin
4. pindahkan `/admin/articles` ke Supabase CRUD
5. pindahkan halaman publik `/my-notes` ke query published articles
6. baru setelah itu tambah upload image
