/// <reference types="node" />

import type { IncomingMessage, ServerResponse } from 'node:http';
import { fetchSpotifyPayload, SpotifyConfigError } from '../server/spotify';

const CACHE_CONTROL_HEADER = 'public, max-age=0, s-maxage=60, stale-while-revalidate=60';

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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    sendJson(
      res,
      405,
      { message: 'Method Not Allowed' },
      {
        Allow: 'GET',
        'Cache-Control': 'no-store',
      },
    );
    return;
  }

  try {
    const payload = await fetchSpotifyPayload();
    sendJson(res, 200, payload, {
      'Cache-Control': CACHE_CONTROL_HEADER,
    });
  } catch (error) {
    const statusCode = error instanceof SpotifyConfigError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Failed to load Spotify data.';

    sendJson(res, statusCode, { message }, {
      'Cache-Control': 'no-store',
    });
  }
}
