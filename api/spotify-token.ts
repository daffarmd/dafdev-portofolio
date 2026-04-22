/// <reference types="node" />

import type { IncomingMessage, ServerResponse } from 'node:http';
import { exchangeSpotifyAuthorizationCode, SpotifyConfigError } from '../server/spotify';

function sendJson(
  res: ServerResponse,
  statusCode: number,
  payload: unknown,
  headers: Record<string, string> = {},
) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  res.end(JSON.stringify(payload));
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(
      res,
      405,
      { message: 'Method Not Allowed' },
      {
        Allow: 'POST',
        'Cache-Control': 'no-store',
      },
    );
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

    const payload = await exchangeSpotifyAuthorizationCode(code, redirectUri);
    sendJson(res, 200, payload, {
      'Cache-Control': 'no-store',
    });
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

    sendJson(res, statusCode, { message }, {
      'Cache-Control': 'no-store',
    });
  }
}
