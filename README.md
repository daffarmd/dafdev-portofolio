# dafdev-portofolio
my personal portofolio using react and tailwindcss

## Contact form setup

The contact form uses Web3Forms.

1. Create an access key from Web3Forms.
2. Enable hCaptcha in the Web3Forms dashboard for that access key.
3. Add `VITE_WEB3FORMS_ACCESS_KEY=your_key` to `.env`.
4. Restart the Vite dev server or redeploy the app.

## Spotify section setup

The Spotify section loads data through the backend API and can play 30-second preview clips in the browser.

1. Add the Spotify env variables from [docs/spotify-setup.md](docs/spotify-setup.md).
2. Add the callback URL in the Spotify dashboard exactly as described in that file.
3. Make sure the refresh token has the scopes listed in that file.
4. Restart the Vite dev server or redeploy the app.
5. When running locally, use `http://127.0.0.1:5173/` for the app and `http://127.0.0.1:5173/callback` for Spotify auth.
