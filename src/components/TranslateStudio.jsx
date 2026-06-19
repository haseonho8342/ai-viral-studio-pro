import { useState } from 'react';
import PageHeader from './PageHeader';
import { isGeminiAvailable, generateTranslationFromText } from '../services/geminiService';
import { generateChineseTranslation, generateChineseKeywords } from '../services/translateEngine';
import { generateXiaohongshuKeywords } from '../services/xiaohongshuEngine';
import '../styles/pages.css';

const DEFAULT_KO = '인기대란! 초음파로 야채와 과일을 5분만에 살균 세척해주는 무선 싱크 과일세척기입니다. 삶의 질이 주방에서 10배 올라갑니다!';

export default function TranslateStudio({ focusXhs = false }) {
  const [koreanText, setKoreanText] = useState(DEFAULT_KO);
  const [chineseText, setChineseText] = useState('【爆款好物】这可能是我今年用过的最聪明的食物清洗机了！');
  const [tags, setTags] = useState(['我的智能生活', '家居好物推荐', '厨房神器', '好物分享']);
  const [xhsKeywords, setXhsKeywords] = useState(['懒人神器', '厨房好物推荐', '高颜值好物']);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('mock');
  const [copied, setCopied] = useState(null);

  const mockTranslate = () => {
    const clean = koreanText.substring(0, 15);
    setChineseText(`【大宗种草】真心推荐这款 "${clean}"！体验了五天，感觉真的彻底解放双手了。`);
    setTags(['小红书爆款', '好物推荐', '高科技神器', '智能家居']);
    setXhsKeywords(generateXiaohongshuKeywords({ title: koreanText, tags: ['好物'] }));
    setSource('mock');
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      if (isGeminiAvailable()) {
        const result = await generateTranslationFromText(koreanText);
        setChineseText(result.chineseTranslation || chineseText);
        setTags(result.chineseKeywords || tags);
        setXhsKeywords(result.xiaohongshuKeywords || xhsKeywords);
        setSource('gemini');
      } else {
        mockTranslate();
      }
    } catch {
      setChineseText(generateChineseTranslation({ title: koreanText, tags: ['好物'] }));
      setTags(generateChineseKeywords({ title: koreanText, tags: ['好物'] }));
      setXhsKeywords(generateXiaohongshuKeywords({ title: koreanText, tags: ['好物'] }));
      setSource('mock');
    }
    setLoading(false);
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="page-view">
      <PageHeader
        icon={focusXhs ? '📕' : '🌏'}
        title={focusXhs ? '샤오홍슈 SEO 스튜디오' : '중국어 번역 스튜디오'}
        description="한국 숏폼 본문을 샤오홍슈/더우인에 최적화된 중국어 바이럴 카피와 검색어로 변환합니다."
      />

      <span className={`page-ai-badge page-ai-badge--${source}`}>
        {source === 'gemini' ? '✨ Gemini AI 연동' : '🤖 더미 엔진'}
      </span>

      <div className="page-grid page-grid--6-6">
        <div className="page-card page-space-y-lg">
          <h3 className="page-card-title">🇰🇷 한국어 원문</h3>
          <textarea className="page-textarea" rows={4} maxLength={300} value={koreanText} onChange={(e) => setKoreanText(e.target.value)} />
          <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{koreanText.length} / 300자</p>
          <button type="button" className="page-btn page-btn--rose" onClick={handleTranslate} disabled={loading || !koreanText.trim()}>
            {loading ? '🔄 번역 중...' : '✨ 중국어 바이럴 번역'}
          </button>
        </div>

        <div className="page-space-y-lg">
          <div className="page-card page-space-y">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="page-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>🇨🇳 중국어 번역</h3>
              <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={() => copy(chineseText, 'cn')}>
                {copied === 'cn' ? '✓' : '복사'}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{chineseText}</p>
          </div>

          <div className="page-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 className="page-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>📕 샤오홍슈 검색어</h3>
              <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={() => copy(xhsKeywords.join(', '), 'xhs')}>
                {copied === 'xhs' ? '✓' : '복사'}
              </button>
            </div>
            <div className="page-tags">
              {xhsKeywords.map((kw) => (
                <span key={kw} className="page-tag" style={{ color: '#fda4af', borderColor: 'rgba(244,63,94,0.2)' }}>#{kw}</span>
              ))}
              {tags.map((t) => (
                <span key={t} className="page-tag" style={{ color: '#a5b4fc' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
