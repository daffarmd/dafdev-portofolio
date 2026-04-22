let audio: HTMLAudioElement | null = null;

export async function playPreview(previewUrl: string, onEnded?: () => void, onError?: (err?: unknown) => void) {
  if (!previewUrl) {
    throw new Error('No preview URL provided');
  }

  // Stop any existing playback and clean up
  if (audio) {
    try { audio.pause(); } catch {}
    try { audio.src = ''; } catch {}
    audio = null;
  }

  audio = new Audio(previewUrl);
  // allow cross-origin resources if necessary
  try { audio.crossOrigin = 'anonymous'; } catch {}
  audio.preload = 'auto';
  audio.volume = 0.95;

  audio.onended = () => {
    audio = null;
    if (onEnded) onEnded();
  };

  audio.onerror = (ev) => {
    const err = new Error('Preview playback failed');
    console.error('[spotifyPreview] audio error', ev);
    try { audio.src = ''; } catch {}
    audio = null;
    if (onError) onError(err);
  };

  // Play must be triggered by a user gesture or the browser will block it.
  try {
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      await p;
    }
  } catch (err) {
    console.error('[spotifyPreview] play() rejected', err);
    try { audio.src = ''; } catch {}
    audio = null;
    if (onError) onError(err);
    throw err;
  }
}

export function stopPreview() {
  if (audio) {
    try { audio.pause(); } catch {}
    try { audio.currentTime = 0; } catch {}
    try { audio.src = ''; } catch {}
    audio = null;
  }
}

export function isPlaying() {
  return audio !== null;
}
