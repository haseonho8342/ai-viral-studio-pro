/**
 * Workspace Engine - 카드 클릭 시 Workspace 콘텐츠 자동 생성
 * 규칙 기반 엔진 우선, Gemini는 별도 재시도 시에만
 */

import { generateCoupangProducts } from './coupangEngine';
import { generateInpockLink } from './inpockEngine';
import { generateScripts } from './scriptFallbackEngine';
import { generateThumbnailCopy } from './thumbnailFallbackEngine';
import {
  generateChineseTranslation,
  generateChineseKeywords,
  generateXiaohongshuKeywords,
} from './translateFallbackEngine';

export function buildRuleBasedAnalysis(card, tone = 'aggressive') {
  const products = generateCoupangProducts(card);
  const scripts = generateScripts(card, tone);

  return {
    cardId: card.id,
    title: card.title,
    products,
    inpock: generateInpockLink(card, products),
    chineseTranslation: generateChineseTranslation(card),
    chineseKeywords: generateChineseKeywords(card),
    xiaohongshuKeywords: generateXiaohongshuKeywords(card),
    script30s: scripts.script30s,
    script60s: scripts.script60s,
    thumbnailCopy: generateThumbnailCopy(card),
    source: 'rules',
    error: null,
  };
}

export function mergeGeminiAnalysis(base, geminiFields) {
  return {
    ...base,
    ...geminiFields,
    source: 'gemini',
    error: null,
  };
}

export function mergeGeminiScripts(base, scripts) {
  return {
    ...base,
    script30s: scripts.script30s,
    script60s: scripts.script60s,
    source: 'gemini',
    error: null,
  };
}
