import { defineConfig, loadEnv, type Plugin } from 'vite';
import type { IncomingMessage } from 'node:http';
import react from '@vitejs/plugin-react';
import {
  exchangeSpotifyAuthorizationCode,
  fetchSpotifyPayload,
  SpotifyConfigError,
} from './server/spotify';

// https://vitejs.dev/config/
const DEV_REQUEST_BASE_URL = 'http://127.0.0.1';

function spotifyApiPlugin(env: NodeJS.ProcessEnv): Plugin {
  return {
    name: 'spotify-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? new URL(req.url, DEV_REQUEST_BASE_URL).pathname : '';

        if (pathname !== '/api/spotify') {
          next();
          return;
        }

        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Allow', 'GET');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }

        try {
          const payload = await fetchSpotifyPayload(env);
          res.statusCode = 200;
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(payload));
        } catch (error) {
          const statusCode = error instanceof SpotifyConfigError ? error.statusCode : 500;
          const message = error instanceof Error ? error.message : 'Failed to load Spotify data.';

          res.statusCode = statusCode;
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ message }));
        }
      });
    },
  };
}

function spotifyTokenPlugin(env: NodeJS.ProcessEnv): Plugin {
  return {
    name: 'spotify-dev-token-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? new URL(req.url, DEV_REQUEST_BASE_URL).pathname : '';

        if (pathname !== '/api/spotify-token') {
          next();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Allow', 'POST');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }

        try {
          const rawBody = await readRequestBody(req);
          const body = rawBody ? JSON.parse(rawBody) as { code?: unknown; redirectUri?: unknown } : {};
          const code = typeof body.code === 'string' ? body.code.trim() : '';
          const redirectUri = typeof body.redirectUri === 'string' ? body.redirectUri.trim() : '';

          if (!code) {
            throw new SpotifyConfigError('Missing Spotify authorization code.', 400);
          }

          if (!redirectUri) {
            throw new SpotifyConfigError('Missing Spotify redirect URI.', 400);
          }

          const payload = await exchangeSpotifyAuthorizationCode(code, redirectUri, env);
          res.statusCode = 200;
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(payload));
        } catch (error) {
          const statusCode = error instanceof SyntaxError
            ? 400
            : error instanceof SpotifyConfigError
              ? error.statusCode
              : 500;
          const message = error instanceof SyntaxError
            ? 'Invalid JSON body.'
            : error instanceof Error
              ? error.message
              : 'Failed to exchange Spotify authorization code.';

          res.statusCode = statusCode;
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ message }));
        }
      });
    },
  };
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', reject);
  });
}

export default defineConfig(({ mode }) => {
  const env = {
    ...process.env,
    ...loadEnv(mode, process.cwd(), ''),
  };

  return {
    plugins: [react(), spotifyApiPlugin(env), spotifyTokenPlugin(env)],
    server: {
      host: '127.0.0.1',
    },
    preview: {
      host: '127.0.0.1',
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
