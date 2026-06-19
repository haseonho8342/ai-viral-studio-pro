import { useState, useEffect } from 'react';
import { analyzeSubtitles } from '../services/downloadApi';
import { saveAnalysis } from '../services/videoDb';
import '../styles/youtube-platform.css';

const MODES = [
  { id: 'summary', label: 'AI 요약' },
  { id: 'three_line', label: '3줄 요약' },
  { id: 'keywords', label: '핵심 키워드' },
  { id: 'study_note', label: '공부 노트' },
  { id: 'blog', label: '블로그 정리' },
  { id: 'translate', label: '한국어 번역' },
  { id: 'important', label: '중요 문장' },
];

function buildPayload(subtitle, results) {
  return {
    subtitle,
    summary: results.summary || '',
    threeLineSummary: results.three_line || '',
    keywords: results.keywords || '',
    studyNote: results.study_note || '',
    blogSummary: results.blog || '',
    koreanTranslation: results.translate || '',
    importantSentences: results.important || '',
  };
}

export default function AiAnalysis({ video, subtitle: initialSubtitle, onClear }) {
  const [subtitle, setSubtitle] = useState(initialSubtitle || '');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSubtitle) setSubtitle(initialSubtitle);
  }, [initialSubtitle]);

  const runAnalysis = async (mode) => {
    if (!subtitle.trim()) {
      setError('자막이 없습니다. 영상 상세에서 자막을 먼저 추출하세요.');
      return;
    }
    setLoading(mode);
    setError('');
    try {
      const res = await analyzeSubtitles(subtitle, mode);
      const next = { ...results, [mode]: res.result };
      setResults(next);
      if (video?.videoId) {
        await saveAnalysis(video.videoId, buildPayload(subtitle, next));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="yt-page">
      <div className="yt-page-header">
        <h2>🤖 AI Analysis</h2>
        <p>추출된 자막을 OpenAI로 분석합니다 (FastAPI 백엔드 필요)</p>
      </div>

      {video && (
        <div className="yt-panel" style={{ marginBottom: '1rem' }}>
          <h4>📺 {video.title}</h4>
          <p className="yt-card-meta">{video.channel}</p>
        </div>
      )}

      <div className="yt-panel">
        <h4>자막 입력</h4>
        <textarea
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={6}
          style={{
            width: '100%', padding: '0.75rem', background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)', fontSize: '0.82rem', resize: 'vertical',
          }}
          placeholder="자막 텍스트를 붙여넣거나, 영상 상세에서 자막을 추출하세요"
        />
      </div>

      <div className="yt-actions">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className="yt-btn yt-btn--sm"
            onClick={() => runAnalysis(m.id)}
            disabled={!!loading}
          >
            {loading === m.id ? '분석 중...' : m.label}
          </button>
        ))}
        {onClear && (
          <button type="button" className="yt-btn yt-btn--sm yt-btn--outline" onClick={onClear}>초기화</button>
        )}
      </div>

      {error && <p className="yt-error">{error}</p>}

      {Object.entries(results).map(([mode, text]) => (
        <div key={mode} className="yt-panel">
          <h4>{MODES.find((m) => m.id === mode)?.label || mode}</h4>
          <p className="yt-text">{text}</p>
        </div>
      ))}
    </div>
  );
}
