import { useState } from 'react';
import { fetchMetadata, getDownloadUrl } from '../services/downloadApi';
import '../styles/youtube-platform.css';

export default function DownloadCenter() {
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setMeta(null);
    try {
      const data = await fetchMetadata(url);
      setMeta(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yt-page">
      <div className="yt-page-header">
        <h2>⬇️ Download Center</h2>
        <p>yt-dlp로 영상·음원·자막을 다운로드합니다 (FastAPI 서버 필요)</p>
      </div>

      <form className="yt-search-bar" onSubmit={handleExtract}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTube URL 입력 (https://www.youtube.com/watch?v=...)"
        />
        <button type="submit" className="yt-btn" disabled={loading}>
          {loading ? '추출 중...' : '메타데이터 추출'}
        </button>
      </form>

      {error && <p className="yt-error">{error}</p>}

      {meta && (
        <>
          <div className="yt-panel">
            <h4>📋 메타데이터</h4>
            {meta.thumbnail && <img src={meta.thumbnail} alt="" style={{ width: '100%', maxWidth: 400, borderRadius: 8, marginBottom: '0.75rem' }} />}
            <p className="yt-text"><strong>{meta.title}</strong></p>
            <p className="yt-card-meta">{meta.channel} · {meta.duration} · {meta.view_count?.toLocaleString()}회</p>
            <p className="yt-text" style={{ marginTop: '0.5rem' }}>{meta.description}</p>
          </div>

          <div className="yt-actions">
            <a href={getDownloadUrl('video', url)} className="yt-btn" download>영상 다운로드 (MP4)</a>
            <a href={getDownloadUrl('mp3', url)} className="yt-btn" download>MP3 다운로드</a>
            <a href={getDownloadUrl('subtitle', url)} className="yt-btn yt-btn--outline" download>자막 다운로드</a>
            <a href={getDownloadUrl('auto-subtitle', url)} className="yt-btn yt-btn--outline" download>자동 자막 다운로드</a>
          </div>
        </>
      )}
    </div>
  );
}
