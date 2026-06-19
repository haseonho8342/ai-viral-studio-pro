/**
 * Analysis Engine - 규칙 기반 우선, Gemini는 수동 재시도 시에만
 */

import {
  isGeminiAvailable,
  isGeminiBlocked,
  isQuotaError,
  setGeminiBlocked,
  generateContentAnalysis,
  generateScriptsWithGemini,
} from './geminiService';
import {
  buildRuleBasedAnalysis,
  mergeGeminiAnalysis,
  mergeGeminiScripts,
} from './workspaceEngine';
import { generateScripts } from './scriptFallbackEngine';

/** 카드 선택 시 즉시 규칙 기반 분석 (자동 Gemini 호출 없음) */
export function buildWorkspaceAnalysis(card, tone = 'aggressive') {
  return buildRuleBasedAnalysis(card, tone);
}

/** 사용자 재시도 시 Gemini 분석 */
export async function buildAnalysisWithGemini(card, tone = 'aggressive') {
  if (isGeminiBlocked()) {
    throw new Error('Gemini 사용량 초과');
  }
  if (!isGeminiAvailable()) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  try {
    const base = buildRuleBasedAnalysis(card, tone);
    const aiResult = await generateContentAnalysis(card, tone);
    return mergeGeminiAnalysis(base, aiResult);
  } catch (err) {
    if (isQuotaError(err)) {
      setGeminiBlocked(true, err.message);
    }
    throw err;
  }
}

/** 톤 변경 — 규칙 기반 대본 재생성 */
export function regenerateScriptsLocal(card, tone, currentAnalysis) {
  const scripts = generateScripts(card, tone);
  return {
    ...currentAnalysis,
    script30s: scripts.script30s,
    script60s: scripts.script60s,
    source: 'rules',
    error: null,
  };
}

/** 톤 변경 + Gemini 재시도 (수동) */
export async function regenerateScriptsWithGemini(card, tone, currentAnalysis) {
  if (isGeminiBlocked()) {
    throw new Error('Gemini 사용량 초과');
  }
  if (!isGeminiAvailable()) {
    return regenerateScriptsLocal(card, tone, currentAnalysis);
  }

  try {
    const scripts = await generateScriptsWithGemini(card, tone);
    return mergeGeminiScripts(currentAnalysis, scripts);
  } catch (err) {
    if (isQuotaError(err)) {
      setGeminiBlocked(true, err.message);
    }
    throw err;
  }
}
