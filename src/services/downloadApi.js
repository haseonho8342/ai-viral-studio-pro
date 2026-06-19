/**
 * FastAPI (yt-dlp + OpenAI) 백엔드 호출
 */
import { getRuntimeEnv } from '../lib/runtimeConfig';

function getApiBase() {
  if (import.meta.env.DEV) return '';
  const base =
    getRuntimeEnv('VITE_API_BASE_URL') ||
    import.meta.env.VITE_API_BASE_URL ||
    '';
  return String(base).replace(/\/$/, '');
}

function ensureApiBase() {
  const base = getApiBase();
  if (!base && !import.meta.env.DEV) {
    throw new Error(
      'FastAPI 서버가 연결되지 않았습니다. Vercel에 VITE_API_BASE_URL 환경 변수를 설정하세요.'
    );
  }
  return base;
}

async function postJson(path, body) {
  ensureApiBase();
  let res;
  try {
    res = await fetch(`${getApiBase()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('FastAPI 서버에 연결할 수 없습니다. api 서버가 실행 중인지 확인하세요.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.error || `API 오류 (${res.status})`);
  return data;
}

export async function checkApiHealth() {
  try {
    const res = await fetch(`${getApiBase() || ''}/health`, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchMetadata(url) {
  return postJson('/api/metadata', { url });
}

export async function fetchSubtitles(url) {
  return postJson('/api/subtitles', { url });
}

export async function analyzeSubtitles(subtitle, mode = 'summary') {
  return postJson('/api/analyze', { subtitle, mode });
}

export function getDownloadUrl(type, url) {
  const base = getApiBase();
  if (!base && !import.meta.env.DEV) return '#';
  const params = new URLSearchParams({ url });
  return `${base}/api/download/${type}?${params}`;
}

export function isApiConfigured() {
  return import.meta.env.DEV || Boolean(getApiBase());
}
