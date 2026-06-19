import { useState } from 'react';
import PageHeader from './PageHeader';
import { HOT_TIKTOK_SOUNDS } from '../data/pageData';
import '../styles/pages.css';

export default function TikTokSourcing() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleScrape = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        title: '스마트 쓰레기통 주방 힐링 시연 음원 #139',
        creator: 'CleanLifeTok',
        duration: '0:35',
        tags: ['스마트홈', '리빙템', '정리정돈', '자취생필수템', 'korea_hacks'],
      });
      setLoading(false);
    }, 1300);
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="page-view">
      <PageHeader
        icon="🎵"
        title="틱톡 바이럴 소싱"
        description="틱톡 급상승 숏클립의 메타 태그 분석, 음원 소싱 및 워터마크 제거 시뮬레이션을 지원합니다."
      />

      <div className="page-grid page-grid--5-7">
        <div className="page-card page-space-y-lg">
          <h3 className="page-card-title">📥 SnapTik 소스 다운로더</h3>
          <div>
            <label className="page-label">틱톡 원본 영상 URL</label>
            <input
              className="page-input page-input--mono"
              placeholder="https://vt.tiktok.com/ZS192hd92/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button type="button" className="page-btn page-btn--cyan" onClick={handleScrape} disabled={loading || !url.trim()}>
            {loading ? '🔄 파싱 중...' : '메타 분석 및 MP3/MP4 파싱'}
          </button>

          {result && (
            <div className="page-result page-space-y">
              <span className="page-result-label">소싱 추출 완료</span>
              <p className="page-list-item-title">{result.title}</p>
              <p className="page-list-item-sub">작성자: {result.creator} · {result.duration}</p>
              <div className="page-tags">
                {result.tags.map((t) => (
                  <span key={t} className="page-tag">#{t}</span>
                ))}
              </div>
              <div className="page-flex-row">
                <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={() => copy(result.tags.map((t) => `#${t}`).join(' '), 'tags')}>
                  {copied === 'tags' ? '✓ 복사됨' : '태그 복사'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="page-space-y-lg">
          <div className="page-card">
            <h3 className="page-card-title">🔥 금주 실시간 바이럴 BGM</h3>
            <div className="page-space-y">
              {HOT_TIKTOK_SOUNDS.map((sound, idx) => (
                <div key={idx} className="page-list-item">
                  <div>
                    <p className="page-list-item-title">{sound.title}</p>
                    <p className="page-list-item-sub">{sound.creator} · {sound.searchVolume}</p>
                  </div>
                  <div className="page-flex-row">
                    <span className="page-score">Score {sound.viralScore}</span>
                    <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={() => copy(sound.title, idx)}>
                      {copied === idx ? '✓' : '복사'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="page-info-box">
            <strong>ℹ️ 틱톡 소싱 윤리 가이드</strong>
            원본을 그대로 재업로드하지 마세요. 구간 교차 편집, 한국어 나레이션, CTR 자막을 적용해 독자성 있는 영상으로 재생산하세요.
          </div>
        </div>
      </div>
    </div>
  );
}
