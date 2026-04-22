# Spotify Setup

## 1. Isi env

Tambahkan ke `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
SPOTIFY_RECENTLY_PLAYED_LIMIT=5
SPOTIFY_TOP_TRACKS_LIMIT=5
SPOTIFY_TOP_TRACKS_TIME_RANGE=medium_term
```

`VITE_SPOTIFY_CLIENT_ID` dipakai halaman `/callback` untuk membangun URL authorize Spotify.
`SPOTIFY_*` dipakai backend saat exchange code dan refresh token.

## 2. Scope yang dibutuhkan

Token refresh harus berasal dari akun Spotify yang sudah memberi izin untuk:

- `user-read-recently-played`
- `user-top-read`

Kalau sebelumnya kamu sudah authorize dengan scope yang lebih banyak, lakukan authorize ulang supaya refresh token baru hanya membawa scope yang diperlukan untuk data preview.

## 3. Redirect URI

Tambahkan redirect URI ini di dashboard Spotify:

- `https://muhammaddaffaramadhan.vercel.app/callback`

Kalau kamu mau tes lokal, tambahkan juga:

- `http://127.0.0.1:5173/callback`

URI harus cocok persis dengan yang dipakai saat authorize.

## 4. Alur data

Frontend hanya memanggil `/api/spotify`.
Endpoint itu mengambil access token baru dari refresh token, lalu memanggil Spotify Web API di server.

Preview clip 30 detik diputar langsung dari `preview_url` yang dikirim Spotify Web API, jadi tidak perlu Web Playback SDK atau endpoint token playback tambahan.

Halaman `/callback` dipakai untuk:

- mengarahkan user ke Spotify authorize screen
- menangkap `code`
- menukar `code` jadi `refresh_token`
- menampilkan nilai refresh token untuk disalin ke env backend

Dengan cara ini:

- `client secret` tidak pernah dikirim ke browser
- data bisa dirender dinamis
- section Spotify tetap ringan karena tidak memakai iframe embed

## 5. Jalankan app

```bash
npm run dev
```

Dev server akan dibuka di `http://127.0.0.1:5173/`.

Kalau env sudah benar, section Spotify akan menampilkan:

- recently played
- top tracks
- status sync terbaru
