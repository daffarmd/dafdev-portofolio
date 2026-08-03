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

## 5. Lupa password admin

Route `/reset-password` dipakai untuk alur lupa password admin. Di halaman login admin (`/login`), klik "Forgot password?" untuk sampai ke halaman ini.

Alur kerja:

1. Admin membuka `/reset-password`, mengisi email, lalu submit "Send reset link".
2. App memanggil `auth.resetPasswordForEmail(email, { redirectTo: <site>/reset-password })` dari Supabase Auth.
3. Supabase mengirim email berisi link recovery yang menunjuk ke `<site>/reset-password#access_token=...&type=recovery`.
4. Saat link dibuka, session recovery diproses otomatis (`detectSessionInUrl`) dan halaman menampilkan form "Simpan password baru".
5. Setelah password di-update, recovery session di-sign out dan admin diminta login ulang dengan password baru.

Supaya alur ini jalan, konfigurasi dashboard Supabase (Authentication):

- **URL Configuration** → *Site URL* diisi URL produksi (mis. `https://<site>.vercel.app` atau domain kustom), dan tambahkan `<site>/reset-password` ke daftar **Redirect URLs**.
- **Email Templates** → *Reset Password*: pastikan tombol/template email memakai variabel Confirmation URL (`{{ .ConfirmationURL }}`) supaya link recovery sampai ke `/reset-password`.

Link recovery memiliki masa berlaku (default 1 jam). Kalau link sudah kedaluwarsa/dipalsukan, halaman menampilkan pesan error dan admin bisa meminta link baru.

## 6. Catatan migrasi data lama

Artikel hardcoded di `src/data/articles.ts` masih tetap tampil sebagai fallback/template.
Kalau semua artikel lama sudah dimasukkan ke Supabase, source code fallback itu bisa dipensiunkan belakangan.
