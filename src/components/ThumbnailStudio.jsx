import { useState } from 'react';
import PageHeader from './PageHeader';
import { THUMBNAIL_PRESETS } from '../data/pageData';
import { isGeminiAvailable, generateThumbnailSuggestions } from '../services/geminiService';
import { generateThumbnailCopy } from '../services/thumbnailEngine';
import '../styles/pages.css';

export default function ThumbnailStudio() {
  const [hookText, setHookText] = useState('🚨 버튼만 누르면 살균 끝? 실사용 충격 폭로');
  const [badgeText, setBadgeText] = useState('쿠팡 품절 대란템');
  const [bgColor, setBgColor] = useState(THUMBNAIL_PRESETS[0].value);
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [fontSize, setFontSize] = useState(28);
  const [suggestions, setSuggestions] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAiSuggest = async () => {
    setLoading(true);
    try {
      if (isGeminiAvailable()) {
        const result = await generateThumbnailSuggestions(hookText);
        setSuggestions(result.suggestions || []);
      } else {
        setSuggestions(generateThumbnailCopy({ title: hookText, category: '리빙/아이디어', viewCount: 1000000, id: 'thumb' }));
      }
    } catch {
      setSuggestions(generateThumbnailCopy({ title: hookText, category: '리빙/아이디어', viewCount: 1000000, id: 'thumb' }));
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!hookText.trim()) return;
    setSaved([{ hookText, badgeText, accentColor }, ...saved].slice(0, 5));
  };

  return (
    <div className="page-view">
      <PageHeader
        icon="🖼"
        title="썸네일 스튜디오"
        description="탐색피드 CTR을 높이는 강렬한 썸네일 문구를 시각적으로 조판합니다."
      />

      <div className="page-grid page-grid--5-5">
        <div className="page-card page-space-y-lg">
          <h3 className="page-card-title">✏️ 텍스트 & 컬러</h3>
          <div>
            <label className="page-label">썸네일 핵심 카피</label>
            <textarea className="page-textarea" rows={2} maxLength={60} value={hookText} onChange={(e) => setHookText(e.target.value)} />
          </div>
          <div>
            <label className="page-label">뱃지 텍스트</label>
            <input className="page-input" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} />
          </div>
          <div>
            <label className="page-label">배경 프리셋</label>
            <div className="page-flex-row">
              {THUMBNAIL_PRESETS.map((p) => (
                <button key={p.name} type="button" className="page-btn page-btn--outline page-btn--sm" style={bgColor === p.value ? { borderColor: 'var(--accent-indigo)' } : {}} onClick={() => setBgColor(p.value)}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="page-label">글자 크기: {fontSize}px</label>
            <input type="range" min={20} max={48} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#6366f1' }} />
          </div>
          <div>
            <label className="page-label">강조 색상</label>
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '100%', height: '2rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
          </div>
          <div className="page-flex-row">
            <button type="button" className="page-btn" onClick={handleAiSuggest} disabled={loading}>
              {loading ? '🔄' : '✨ AI 문구 제안'}
            </button>
            <button type="button" className="page-btn page-btn--outline" onClick={handleSave}>저장</button>
          </div>

          {suggestions.length > 0 && (
            <div className="page-space-y">
              {suggestions.map((s, i) => (
                <div key={i} className="thumb-saved-item" onClick={() => setHookText(s)}>{s}</div>
              ))}
            </div>
          )}
        </div>

        <div className="page-card">
          <h3 className="page-card-title">👁 미리보기 (9:16)</h3>
          <div className="thumb-preview" style={{ background: bgColor }}>
            <span className="thumb-preview-badge" style={{ background: accentColor }}>{badgeText}</span>
            <p className="thumb-preview-text" style={{ fontSize: `${fontSize}px`, color: '#fff' }}>{hookText}</p>
          </div>

          {saved.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p className="page-label">저장된 카피</p>
              <div className="page-space-y">
                {saved.map((s, i) => (
                  <div key={i} className="thumb-saved-item" onClick={() => { setHookText(s.hookText); setBadgeText(s.badgeText); setAccentColor(s.accentColor); }}>
                    {s.hookText}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="page-info-box" style={{ marginTop: '1rem' }}>
            <strong>🎯 CTR 팁</strong>
            형광 노랑/네온 라임색 한글 폰트를 중앙 35% 이상 크기로 배치하면 쇼츠 탐색 CTR이 평균 4.8% 상승합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
