/**
 * Gemini Service - Google Gemini API 공통 클라이언트
 * API 키: .env.local 의 VITE_GEMINI_API_KEY 또는 설정 페이지 localStorage
 */

import { GoogleGenAI } from '@google/genai';
import { getRuntimeEnv } from '../lib/runtimeConfig';

const STORAGE_KEY = 'gemini_api_key';
const DEFAULT_MODEL = 'gemini-2.0-flash';

let client = null;
let geminiBlocked = sessionStorage.getItem('gemini_quota_blocked') === 'true';

export function isGeminiBlocked() {
  return geminiBlocked;
}

export function setGeminiBlocked(blocked, reason = '') {
  geminiBlocked = blocked;
  if (blocked) {
    sessionStorage.setItem('gemini_quota_blocked', 'true');
    sessionStorage.setItem('gemini_block_reason', reason);
  } else {
    sessionStorage.removeItem('gemini_quota_blocked');
    sessionStorage.removeItem('gemini_block_reason');
  }
}

export function getGeminiBlockReason() {
  return sessionStorage.getItem('gemini_block_reason') || '';
}

export function isQuotaError(err) {
  const msg = String(err?.message || err || '');
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota');
}

export function getApiKey() {
  return (
    getRuntimeEnv('VITE_GEMINI_API_KEY') ||
    localStorage.getItem(STORAGE_KEY)?.trim() ||
    ''
  );
}

export function setApiKey(key) {
  if (key?.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  client = null;
}

export function isGeminiAvailable() {
  return Boolean(getApiKey());
}

function getClient() {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

async function callGemini(prompt, { json = false } = {}) {
  if (geminiBlocked) {
    throw new Error('Gemini 사용량 초과 (429 RESOURCE_EXHAUSTED)');
  }

  const ai = getClient();
  if (!ai) throw new Error('Gemini API 키가 설정되지 않았습니다.');

  const config = json
    ? { responseMimeType: 'application/json' }
    : undefined;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config,
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Gemini 응답이 비어 있습니다.');
    return text;
  } catch (err) {
    if (isQuotaError(err)) {
      setGeminiBlocked(true, err.message || '429 RESOURCE_EXHAUSTED');
    }
    throw err;
  }
}

const TONE_LABELS = {
  aggressive: '어그로형 (강렬한 세일즈, 클릭 유도)',
  friendly: '친근형 (다정하고 공감하는 톤)',
  humor: '유머형 (재치 있고 가벼운 톤)',
};

function buildCardContext(card) {
  return `
제목: ${card.title}
카테고리: ${card.category}
플랫폼: ${card.platform}
조회수: ${card.viewCountFormatted || card.viewCount}
바이럴 점수: ${card.viralScore}
쿠팡 적합도: ${card.coupangScore}
태그: ${(card.tags || []).join(', ')}
`.trim();
}

/**
 * 카드 기반 AI 콘텐츠 일괄 생성 (번역, 검색어, 대본, 썸네일)
 */
export async function generateContentAnalysis(card, tone = 'aggressive') {
  const prompt = `당신은 한국 쇼츠/숏폼 마케팅 전문가입니다.
아래 바이럴 영상 정보를 분석해 중국어 번역, 샤오홍슈 검색어, 쇼츠 대본, 썸네일 문구를 생성하세요.

${buildCardContext(card)}

대본 화법: ${TONE_LABELS[tone] || TONE_LABELS.aggressive}

반드시 아래 JSON 형식만 출력하세요 (다른 텍스트 없이):
{
  "chineseTranslation": "샤오홍슈/더우인용 중국어 바이럴 카피 (1~2문장)",
  "chineseKeywords": ["#해시태그1", "#해시태그2", "#해시태그3", "#해시태그4"],
  "xiaohongshuKeywords": ["검색어1", "검색어2", "검색어3", "검색어4"],
  "script30s": "30초 쇼츠 대본 ([00:00] 타임스탬프 포함)",
  "script60s": "60초 쇼츠 대본 ([00:00] 타임스탬프 포함)",
  "thumbnailCopy": ["썸네일 문구1", "썸네일 문구2", "썸네일 문구3", "썸네일 문구4"]
}`;

  const raw = await callGemini(prompt, { json: true });
  const parsed = JSON.parse(raw);

  return {
    chineseTranslation: String(parsed.chineseTranslation || ''),
    chineseKeywords: Array.isArray(parsed.chineseKeywords) ? parsed.chineseKeywords : [],
    xiaohongshuKeywords: Array.isArray(parsed.xiaohongshuKeywords) ? parsed.xiaohongshuKeywords : [],
    script30s: String(parsed.script30s || ''),
    script60s: String(parsed.script60s || ''),
    thumbnailCopy: Array.isArray(parsed.thumbnailCopy) ? parsed.thumbnailCopy : [],
  };
}

/**
 * 대본만 재생성 (톤 변경 시)
 */
export async function generateScriptsWithGemini(card, tone = 'aggressive') {
  const prompt = `쇼츠 마케팅 대본 작가입니다.
${buildCardContext(card)}
화법: ${TONE_LABELS[tone] || TONE_LABELS.aggressive}

JSON만 출력:
{
  "script30s": "30초 대본",
  "script60s": "60초 대본"
}`;

  const raw = await callGemini(prompt, { json: true });
  return JSON.parse(raw);
}

/**
 * 한국어 텍스트 → 중국어 번역 + 샤오홍슈 검색어 (독립 페이지용)
 */
export async function generateTranslationFromText(koreanText) {
  const prompt = `한국 쇼츠 상품 소개 문구를 샤오홍슈/더우인용 중국어 바이럴 카피로 번역하세요.

한국어 원문:
${koreanText}

JSON만 출력:
{
  "chineseTranslation": "중국어 바이럴 카피",
  "pinyin": "병음 가이드 (선택)",
  "chineseKeywords": ["#해시태그1", "#해시태그2"],
  "xiaohongshuKeywords": ["검색어1", "검색어2", "검색어3"]
}`;

  const raw = await callGemini(prompt, { json: true });
  return JSON.parse(raw);
}

/**
 * 상품 컨셉 → 쇼츠 대본 블록 (독립 페이지용)
 */
export async function generateScriptBlocks(concept, length, tone) {
  const prompt = `쇼츠 마케팅 대본 작가입니다.
상품/컨셉: ${concept}
길이: ${length}
화법: ${TONE_LABELS[tone] || TONE_LABELS.aggressive}

JSON만 출력:
{
  "blocks": [
    { "time": "00:00-00:05", "scene": "장면 설명", "voice": "나레이션", "subtitle": "자막" }
  ]
}`;

  const raw = await callGemini(prompt, { json: true });
  return JSON.parse(raw);
}

/**
 * 훅 텍스트 → 썸네일 문구 제안 (독립 페이지용)
 */
export async function generateThumbnailSuggestions(hookText) {
  const prompt = `쇼츠 썸네일 CTR 최적화 전문가입니다.
핵심 훅: ${hookText}

JSON만 출력:
{
  "suggestions": ["썸네일 문구1", "썸네일 문구2", "썸네일 문구3"]
}`;

  const raw = await callGemini(prompt, { json: true });
  return JSON.parse(raw);
}
