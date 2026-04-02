'use client';

import { useEffect } from 'react';

const CHUNK_MISMATCH =
  /Cannot read properties of undefined \(reading ['"]call['"]\)/;

/** Stale chunk / slow dev compile / tab sleep — layout.js load timeout, etc. */
const CHUNK_LOAD_FAILED =
  /ChunkLoadError|Loading chunk .+ failed|timeout:\s*http[^\s]*_next\/static/i;

const STORAGE_KEY = 'pk_webpack_chunk_reload';

function shouldRecover(message: string) {
  return CHUNK_MISMATCH.test(message) || CHUNK_LOAD_FAILED.test(message);
}

/**
 * Mitigates Next.js webpack runtime errors when the browser holds stale chunks
 * (e.g. after deploy, long-lived tab). One automatic reload; avoids infinite loops.
 */
export function WebpackChunkRecovery() {
  useEffect(() => {

    const onWindowError = (event: ErrorEvent) => {
      const msg = event.error?.message ?? event.message ?? '';
      if (!shouldRecover(msg)) return;
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, '1');
      window.location.reload();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const r = event.reason;
      const msg = r instanceof Error ? r.message : String(r ?? '');
      if (!shouldRecover(msg)) return;
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, '1');
      window.location.reload();
    };

    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      sessionStorage.removeItem(STORAGE_KEY);
    }, 8000);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
