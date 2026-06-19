import { useState } from 'react';
import PageHeader from './PageHeader';
import { YOUTUBE_COMPETITORS } from '../data/pageData';
import '../styles/pages.css';

export default function YouTubeShorts() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        channelName: '주방의 정석 마스터',
        originalTitle: '전세계 주부들이 극찬한 1초 과일 커터기 실용 원리',
        seoScore: 94,
        suggestedTags: ['주방 혁명', '과일 커터기', '살림 팁', '쿠팡 품절 대란템', '1초 요리템', '인기 쇼츠 추천'],
        seoDescription: '제목 첫머리에 [1초만에 완결] 후킹 문구를 추가하고, 본문 3번째 라인에 쿠팡 파트너스 공시 및 인포크 링크를 연계하세요.',
      });
      setLoading(false);
    }, 1100);
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="page-view">
      <PageHeader
        icon="📺"
        title="유튜브 쇼츠 분석기"
        description="유튜브 쇼츠 SEO 점수, 메타 태그 구성 분석 및 경쟁 채널 벤치마킹을 지원합니다."
      />

      <div className="page-grid page-grid--5-7">
        <div className="page-card page-space-y-lg">
          <h3 className="page-card-title">🔍 SEO 분석기</h3>
          <div>
            <label className="page-label">유튜브 쇼츠 URL</label>
            <input
              className="page-input page-input--mono"
              placeholder="https://youtube.com/shorts/3S9hd82gD"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button type="button" className="page-btn" onClick={handleAnalyze} disabled={loading || !url.trim()}>
            {loading ? '🔄 분석 중...' : 'SEO 태그 분석 시작'}
          </button>

          {result && (
            <div className="page-result page-space-y">
              <span className="page-result-label">SEO 점수 {result.seoScore}점</span>
              <p className="page-list-item-title">{result.originalTitle}</p>
              <p className="page-list-item-sub">채널: {result.channelName}</p>
              <div className="page-tags">
                {result.suggestedTags.map((t) => (
                  <span key={t} className="page-tag">#{t}</span>
                ))}
              </div>
              <p className="page-list-item-sub">{result.seoDescription}</p>
              <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={() => copy(result.suggestedTags.join(', '), 'tags')}>
                {copied === 'tags' ? '✓ 복사됨' : '태그 일괄 복사'}
              </button>
            </div>
          )}
        </div>

        <div className="page-card">
          <h3 className="page-card-title">📊 경쟁 채널 벤치마크</h3>
          <div className="page-space-y">
            {YOUTUBE_COMPETITORS.map((ch, idx) => (
              <div key={idx} className="page-list-item">
                <div>
                  <p className="page-list-item-title">{ch.channel}</p>
                  <p className="page-list-item-sub">구독 {ch.subCount} · 평균 {ch.viewsAvg}</p>
                  <div className="page-tags" style={{ marginTop: '0.375rem' }}>
                    {ch.tags.map((t) => <span key={t} className="page-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
