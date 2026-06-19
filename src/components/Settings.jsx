import { useState, useEffect } from 'react';
import { getYouTubeApiKey } from '../services/youtubeSearchEngine';
import { getSupabaseStatus } from '../services/supabaseDb';
import { getRuntimeEnv } from '../lib/runtimeConfig';
import { checkApiHealth, isApiConfigured } from '../services/downloadApi';
import '../styles/settings.css';

const YT_STORAGE_KEY = 'youtube_api_key';

export default function Settings() {
  const [youtubeKey, setYoutubeKeyInput] = useState(getYouTubeApiKey());
  const [apiBase] = useState(getRuntimeEnv('VITE_API_BASE_URL') || '(미설정)');
  const [ytSaved, setYtSaved] = useState(false);
  const [showYtKey, setShowYtKey] = useState(false);
  const [dbStatus, setDbStatus] = useState({ enabled: false, connected: false, message: '확인 중...' });
  const [apiOk, setApiOk] = useState(null);

  useEffect(() => {
    getSupabaseStatus().then(setDbStatus);
    if (isApiConfigured()) checkApiHealth().then(setApiOk);
    else setApiOk(false);
  }, []);

  const handleYtSave = () => {
    if (youtubeKey?.trim()) localStorage.setItem(YT_STORAGE_KEY, youtubeKey.trim());
    else localStorage.removeItem(YT_STORAGE_KEY);
    setYtSaved(true);
    setTimeout(() => setYtSaved(false), 2000);
  };

  const isYtActive = Boolean(getYouTubeApiKey());

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p>API 키 및 서비스 연결을 관리합니다.</p>
      </div>

      <section className="settings-card">
        <div className="settings-card-header">
          <h3>🗄️ Supabase DB</h3>
          <span className={`settings-status ${dbStatus.connected ? 'settings-status--active' : 'settings-status--inactive'}`}>
            {dbStatus.connected ? '● 연결됨' : '○ 미연결'}
          </span>
        </div>
        <p className="settings-env-notice">
          {dbStatus.enabled ? `✓ ${dbStatus.message}` : '⚠️ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 설정 필요'}
        </p>
      </section>

      <section className="settings-card">
        <div className="settings-card-header">
          <h3>📺 YouTube Data API</h3>
          <span className={`settings-status ${isYtActive ? 'settings-status--active' : 'settings-status--inactive'}`}>
            {isYtActive ? '● 연결됨' : '○ 미연결'}
          </span>
        </div>
        <p className="settings-desc">
          영상 검색·상세 조회에 사용됩니다.
          <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer"> API 활성화 ↗</a>
        </p>
        <div className="settings-input-row">
          <input
            type={showYtKey ? 'text' : 'password'}
            className="settings-input"
            placeholder="AIza..."
            value={youtubeKey}
            onChange={(e) => setYoutubeKeyInput(e.target.value)}
          />
          <button type="button" className="settings-toggle-btn" onClick={() => setShowYtKey(!showYtKey)}>
            {showYtKey ? '숨기기' : '보기'}
          </button>
        </div>
        <div className="settings-actions">
          <button type="button" className="settings-save-btn" onClick={handleYtSave}>
            {ytSaved ? '✓ 저장됨' : '저장'}
          </button>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-header">
          <h3>🐍 FastAPI (yt-dlp + OpenAI)</h3>
          <span className={`settings-status ${apiOk ? 'settings-status--active' : 'settings-status--inactive'}`}>
            {apiOk === null ? '확인 중...' : apiOk ? '● 연결됨' : '○ 미연결'}
          </span>
        </div>
        <p className="settings-desc">
          다운로드·자막·AI 분석은 FastAPI 서버가 필요합니다.
        </p>
        <p className="settings-env-notice">
          API 주소: <code>{apiBase || '(미설정)'}</code>
          {!isApiConfigured() && ' — Vercel에 VITE_API_BASE_URL 설정 필요'}
        </p>
      </section>

      <section className="settings-card settings-card--muted">
        <h3>🔒 보안 안내</h3>
        <p className="settings-desc">
          YouTube·OpenAI API 키는 서버 환경 변수로 관리하는 것을 권장합니다.
          Supabase anon key는 RLS로 보호됩니다.
        </p>
      </section>
    </div>
  );
}
