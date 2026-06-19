/**
 * Streamlit Cloud Secrets → window.__RUNTIME_CONFIG__ 런타임 주입
 */

const SECRET_KEYS = new Set(['VITE_GEMINI_API_KEY', 'VITE_YOUTUBE_API_KEY']);

export function getRuntimeEnv(key) {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.[key]) {
    const v = String(window.__RUNTIME_CONFIG__[key]).trim();
    if (v) return v;
  }
  // 배포 빌드에는 API 키를 번들에 넣지 않음 — Streamlit Secrets / localStorage만 사용
  if (SECRET_KEYS.has(key) && !import.meta.env.DEV) return '';
  const vite = import.meta.env[key];
  if (vite && String(vite).trim()) return String(vite).trim();
  return '';
}
