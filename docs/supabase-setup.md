# Supabase Setup

## 1. Isi env

Tambahkan ke `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_STORAGE_BUCKET_COVERS=article-covers
VITE_SUPABASE_STORAGE_BUCKET_ASSETS=article-inline-assets
```

## 2. Jalankan migration

Migration sudah disiapkan di:

- `supabase/migrations/20260325170000_article_admin_auth.sql`

Kalau pakai Supabase CLI:

```bash
supabase db push
```

Atau copy SQL migration ke SQL Editor Supabase lalu jalankan.

## 3. Buat akun admin pertama

1. Buat user dulu lewat `Authentication > Users`
2. Setelah user tercipta, promote role-nya:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## 4. Jalankan app

```bash
npm run dev
```

Lalu akses:

- masuk ke `/admin/articles`

Catatan:

- halaman login admin tersedia di route `/login`
- tombol login memang tidak ditampilkan di navbar publik; buka route login langsung kalau dibutuhkan

## 5. Catatan migrasi data lama

Artikel hardcoded di `src/data/articles.ts` masih tetap tampil sebagai fallback/template.
Kalau semua artikel lama sudah dimasukkan ke Supabase, source code fallback itu bisa dipensiunkan belakangan.
