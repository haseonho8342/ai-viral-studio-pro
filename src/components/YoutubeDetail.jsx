import { useEffect, useState } from 'react';
import { fetchVideoDetail } from '../services/youtubeSearchEngine';
import { saveVideo } from '../services/videoDb';
import { fetchSubtitles, getDownloadUrl, isApiConfigured } from '../services/downloadApi';
import '../styles/youtube-platform.css';

export default function YoutubeDetail({ videoId, onBack, onAnalyze }) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState('');

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    fetchVideoDetail(videoId)
      .then(async (v) => {
        setVideo(v);
        await saveVideo(v);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [videoId]);

  const handleSubtitle = async () => {
    if (!video) return;
    setSubLoading(true);
    setSubError('');
    try {
      const res = await fetchSubtitles(video.url);
      if (res.text) {
        setSubtitle(res.text);
      } else {
        setSubError('자막을 찾을 수 없습니다.');
      }
    } catch (err) {
      setSubError(err.message || '자막이 없습니다. 공식·자동 자막 모두 없음.');
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="yt-loading">
        <div className="yt-spinner" />
        <p>영상 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="yt-page">
        <p className="yt-error">{error || '영상을 찾을 수 없습니다.'}</p>
        <button type="button" className="yt-btn yt-btn--outline" onClick={onBack}>← 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="yt-page">
      <button type="button" className="yt-btn yt-btn--outline yt-btn--sm" onClick={onBack} style={{ marginBottom: '1rem' }}>
        ← 검색으로 돌아가기
      </button>

      <div className="yt-detail">
        <div>
          <img src={video.thumbnail} alt="" className="yt-detail-thumb" />
        </div>
        <div className="yt-detail-info">
          <h3>{video.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{video.channel}</p>
          <div className="yt-detail-stats">
            <span className="yt-detail-stat">👁 {video.viewCount?.toLocaleString()}회</span>
            <span className="yt-detail-stat">👍 {video.likeCount?.toLocaleString()}</span>
            <span className="yt-detail-stat">💬 {video.commentCount?.toLocaleString()}</span>
            <span className="yt-detail-stat">⏱ {video.duration}</span>
          </div>
          <a href={video.url} target="_blank" rel="noreferrer" className="yt-btn yt-btn--sm" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
            YouTube에서 보기 ↗
          </a>
          {video.tags?.length > 0 && (
            <div className="yt-tags">
              {video.tags.slice(0, 8).map((t) => (
                <span key={t} className="yt-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="yt-actions">
        {isApiConfigured() ? (
          <>
            <a href={getDownloadUrl('video', video.url)} className="yt-btn yt-btn--sm" download>영상 다운로드</a>
            <a href={getDownloadUrl('mp3', video.url)} className="yt-btn yt-btn--sm" download>MP3 다운로드</a>
          </>
        ) : (
          <span className="yt-card-meta">FastAPI 미연결 — 다운로드 기능 비활성</span>
        )}
        <button type="button" className="yt-btn yt-btn--sm yt-btn--outline" onClick={handleSubtitle} disabled={subLoading || !isApiConfigured()}>
          자막 추출
        </button>
        {subtitle && (
          <button type="button" className="yt-btn yt-btn--sm" onClick={() => onAnalyze(video, subtitle)}>
            🤖 AI 분석
          </button>
        )}
      </div>

      {subLoading && <p className="yt-loading">자막 추출 중...</p>}
      {subError && <p className="yt-error">{subError}</p>}

      <div className="yt-panel">
        <h4>📝 영상 설명</h4>
        <p className="yt-text">{(video.description || '').slice(0, 800)}{(video.description?.length > 800) ? '...' : ''}</p>
      </div>

      {subtitle && (
        <div className="yt-panel">
          <h4>📄 추출된 자막</h4>
          <p className="yt-text">{subtitle.slice(0, 2000)}{(subtitle.length > 2000) ? '...' : ''}</p>
        </div>
      )}
    </div>
  );
}
