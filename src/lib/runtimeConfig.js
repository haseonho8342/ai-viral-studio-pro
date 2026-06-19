/**
 * 환경 변수 — Vercel 빌드 시 import.meta.env에 주입
 */

export function initRuntimeConfigBridge() {
  if (typeof window === 'undefined') return;
  window.addEventListener('message', (event) => {
    if (event.data?.type !== 'RUNTIME_CONFIG' || !event.data.config) return;
    window.__RUNTIME_CONFIG__ = {
      ...window.__RUNTIME_CONFIG__,
      ...event.data.config,
    };
    window.dispatchEvent(new CustomEvent('runtime-config-ready'));
  });
}

export function getRuntimeEnv(key) {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.[key]) {
    const v = String(window.__RUNTIME_CONFIG__[key]).trim();
    if (v) return v;
  }
  // Vite는 정적 접근만 빌드 시 인라인함
  const map = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  };
  const val = map[key];
  if (val && String(val).trim()) return String(val).trim();
  return '';
}
