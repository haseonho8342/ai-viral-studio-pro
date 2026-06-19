/**
 * Script Fallback Engine - Gemini 없이 규칙 기반 대본 생성
 * Hook → Body → CTA 구조
 */

const HOOKS = {
  aggressive: [
    '이거 모르면 진짜 손해입니다.',
    '아직도 이걸 안 쓰고 계세요?',
    '삶의 질 바꿔준 꿀템 발견했습니다.',
  ],
  friendly: [
    '안녕하세요! 오늘 소개할 꿀템이에요.',
    '매일 쓰는 이 물건, 이렇게 쓰면 편해요!',
    '자취생·직장인 모두에게 추천하는 아이템이에요.',
  ],
  humor: [
    '이거 보고 돈 쓰는 거 멈출 수 없었어요.',
    '월급이 여기로 갔습니다. 후회는 없어요.',
    '대륙의 실수급 아이템 등장!',
  ],
};

const CTAS = {
  aggressive: '고정댓글 링크에서 최저가 확인하세요!',
  friendly: '관심 있으시면 아래 링크에서 확인해 보세요!',
  humor: '일단 사고 후회는 나중에! 링크는 고정댓글!',
};

function extractProductName(title) {
  return title.replace(/#shorts/gi, '').replace(/\[.*?\]/g, '').trim().slice(0, 20) || '이 꿀템';
}

export function generateHook(card, tone = 'aggressive') {
  const hooks = HOOKS[tone] || HOOKS.aggressive;
  const product = extractProductName(card.title);
  return hooks[product.length % hooks.length];
}

export function generateBody(card, tone = 'aggressive') {
  const product = extractProductName(card.title);
  const views = card.viewCountFormatted || card.viewCount;
  const bodies = {
    aggressive: `"${product}" 직접 써봤는데 효과 바로 보입니다. 조회수 ${views} 돌파한 이유가 있어요. ${card.category} 카테고리에서 급상승 중인 아이템입니다.`,
    friendly: `"${product}" 사용해보니 정말 편리해요. ${card.creator || '크리에이터'}님이 소개한 이 제품, ${card.category} 분야에서 인기 많아요.`,
    humor: `"${product}" 샀더니 인생이 달라졌어요. ${views}명이 이미 확인한 그 템, 저도 당했습니다.`,
  };
  return bodies[tone] || bodies.aggressive;
}

export function generateCTA(tone = 'aggressive') {
  return CTAS[tone] || CTAS.aggressive;
}

export function generate30sScript(card, tone = 'aggressive') {
  const hook = generateHook(card, tone);
  const body = generateBody(card, tone);
  const cta = generateCTA(tone);

  return `[00:00] Hook
"${hook}"

[00:08] Body
${body}

[00:22] CTA
"${cta}"`;
}

export function generate60sScript(card, tone = 'aggressive') {
  const hook = generateHook(card, tone);
  const body = generateBody(card, tone);
  const cta = generateCTA(tone);
  const product = extractProductName(card.title);

  return `[00:00] Hook
"${hook}"

[00:10] Body — 문제 제기
"이런 불편함, 다들 겪고 계시죠? ${product} 하나로 해결됩니다."

[00:25] Body — 사용 시연
${body}

[00:45] Body — 차별점
"가격 대비 성능, 후기 점수 모두 상위권. ${card.category} 베스트 아이템."

[00:55] CTA
"${cta}"`;
}

export function generateScripts(card, tone = 'aggressive') {
  return {
    script30s: generate30sScript(card, tone),
    script60s: generate60sScript(card, tone),
  };
}
