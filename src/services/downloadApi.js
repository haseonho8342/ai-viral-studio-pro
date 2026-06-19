/**
 * FastAPI (yt-dlp + OpenAI) 백엔드 호출
 */
import { getRuntimeEnv } from '../lib/runtimeConfig';

function getApiBase() {
  // 개발: Vite proxy → /api
  if (import.meta.env.DEV) return '';
  return (
    getRuntimeEnv('VITE_API_BASE_URL') ||
    import.meta.env.VITE_API_BASE_URL ||
    ''
  ).replace(/\/$/, '');
}

async function postJson(path, body) {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.error || `API 오류 (${res.status})`);
  return data;
}

/** 영상 URL로 메타데이터 추출 */
export async function fetchMetadata(url) {
  return postJson('/api/metadata', { url });
}

/** 자막 추출 (공식 → 자동 순) */
export async function fetchSubtitles(url) {
  return postJson('/api/subtitles', { url });
}

/** AI 자막 분석 */
export async function analyzeSubtitles(subtitle, mode = 'summary') {
  return postJson('/api/analyze', { subtitle, mode });
}

/** 다운로드 URL 반환 */
export function getDownloadUrl(type, url) {
  const base = getApiBase();
  const params = new URLSearchParams({ url });
  return `${base}/api/download/${type}?${params}`;
}
