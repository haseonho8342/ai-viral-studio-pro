/**
 * Thumbnail Fallback Engine - 3~8단어 강한 후킹 문구 생성
 */

const HOOK_PREFIXES = ['🔥', '⚡', '🚨', '💥', '✨', '🏆'];

const HOOK_VERBS = ['충격', '발견', '대란', '품절', '필수', '혁명', '실화', '미쳤다'];

export function generateThumbnailHooks(card) {
  const shortTitle = card.title
    .replace(/#shorts/gi, '')
    .replace(/\[.*?\]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(' ')
    .slice(0, 16);

  const prefix = HOOK_PREFIXES[card.id.length % HOOK_PREFIXES.length];
  const verb = HOOK_VERBS[(card.viralScore || 0) % HOOK_VERBS.length];

  return [
    `${prefix} ${verb}! ${shortTitle}`,
    `${shortTitle} ${verb}템`,
    `조회수 ${card.viewCountFormatted} ${verb}`,
    `${card.category.split('/')[0]} ${verb} 아이템`,
  ].map((s) => s.slice(0, 24));
}

export function generateThumbnailCopy(card) {
  return generateThumbnailHooks(card);
}
