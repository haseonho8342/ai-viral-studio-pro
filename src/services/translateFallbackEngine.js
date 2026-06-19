/**
 * Translate Fallback Engine - 간단한 템플릿 기반 중국어 생성
 */

const CN_TEMPLATES = [
  '【好物推荐】这个{product}真的太实用了！强烈推荐给大家～',
  '【解压神器】{product}让生活更轻松，懒人必备！',
  '【家居好物】发现这个{product}，幸福感瞬间提升！',
];

const CN_KEYWORD_MAP = {
  '리빙/아이디어': ['家居好物', '生活神器', '收纳技巧', '厨房好物'],
  '뷰티/패션': ['美妆好物', '护肤神器', '平价好物', '变美秘籍'],
  'it/전자기기': ['数码好物', '科技神器', '智能生活', '电子产品'],
  '푸드/레시피': ['美食推荐', '厨房神器', '简单料理', '食谱分享'],
  '유용한 꿀팁': ['生活技巧', '实用好物', '省钱攻略', '必备神器'],
};

function extractProduct(card) {
  const tag = card.tags?.[0];
  if (tag) return tag;
  return card.title.replace(/#shorts/gi, '').trim().slice(0, 10) || '好物';
}

export function generateChineseTranslation(card) {
  const product = extractProduct(card);
  const template = CN_TEMPLATES[card.id.length % CN_TEMPLATES.length];
  return template.replace('{product}', product);
}

export function generateChineseKeywords(card) {
  const product = extractProduct(card);
  return [`#${product}`, '#好物推荐', '#生活神器', '#必买好物'];
}

export function generateXiaohongshuKeywords(card) {
  const base = CN_KEYWORD_MAP[card.category] || CN_KEYWORD_MAP['유용한 꿀팁'];
  const product = extractProduct(card);
  return [product, ...base.slice(0, 3)];
}
