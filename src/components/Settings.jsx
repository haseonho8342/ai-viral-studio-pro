import { useState, useEffect } from 'react';
import { getApiKey, setApiKey, isGeminiAvailable } from '../services/geminiService';
import { getYouTubeApiKey, isYouTubeApiAvailable } from '../services/youtubeShortsEngine';
import { getSupabaseStatus } from '../services/supabaseDb';
import '../styles/settings.css';

const YT_STORAGE_KEY = 'youtube_api_key';

function getStoredYouTubeKey() {
  return getYouTubeApiKey();
}

function setStoredYouTubeKey(key) {
  if (key?.trim()) localStorage.setItem(YT_STORAGE_KEY, key.trim());
  else localStorage.removeItem(YT_STORAGE_KEY);
}

export default function Settings() {
  const [apiKey, setApiKeyInput] = useState(getApiKey());
  const [youtubeKey, setYoutubeKeyInput] = useState(getStoredYouTubeKey());
  const [saved, setSaved] = useState(false);
  const [ytSaved, setYtSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showYtKey, setShowYtKey] = useState(false);
  const [dbStatus, setDbStatus] = useState({ enabled: false, connected: false, message: '확인 중...' });

  useEffect(() => {
    getSupabaseStatus().then(setDbStatus);
  }, []);

  const handleSave = () => {
    setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setApiKey('');
    setApiKeyInput('');
  };

  const hasEnvKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY?.trim());
  const isActive = isGeminiAvailable();
  const hasYtEnvKey = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY?.trim());
  const isYtActive = isYouTubeApiAvailable();

  const handleYtSave = () => {
    setStoredYouTubeKey(youtubeKey);
    setYtSaved(true);
    setTimeout(() => setYtSaved(false), 2000);
  };

  const handleYtClear = () => {
    setStoredYouTubeKey('');
    setYoutubeKeyInput('');
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>⚙️ 설정</h2>
        <p>AI 분석 엔진 및 API 키를 관리합니다.</p>
      </div>

      <section className="settings-card">
        <div className="settings-card-header">
          <h3>🗄️ Supabase DB</h3>
          <span className={`settings-status ${dbStatus.connected ? 'settings-status--active' : 'settings-status--inactive'}`}>
            {dbStatus.connected ? '● 연결됨' : '○ 미연결'}
          </span>
        </div>
        <p className="settings-desc">
          분석 히스토리와 사용자 설정이 Supabase Postgres에 저장됩니다.
          {dbStatus.userId && (
            <span> 세션 ID: <code>{dbStatus.userId.slice(0, 8)}...</code></span>
          )}
        </p>
        <p className="settings-env-notice">
          {dbStatus.enabled ? `✓ ${dbStatus.message}` : '⚠️ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 환경 변수를 설정하세요.'}
        </p>
      </section>

      <section className="settings-card">
        <div className="settings-card-header">
          <h3>🤖 Gemini API</h3>
          <span className={`settings-status ${isActive ? 'settings-status--active' : 'settings-status--inactive'}`}>
            {isActive ? '● 연결됨' : '○ 미연결'}
          </span>
        </div>

        <p className="settings-desc">
          Google AI Studio에서 API 키를 발급받아 입력하세요.
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
            키 발급하기 ↗
          </a>
        </p>

        {hasEnvKey && (
          <p className="settings-env-notice">
            ✓ `.env.local`의 <code>VITE_GEMINI_API_KEY</code>가 설정되어 있습니다.
          </p>
        )}

        <label className="settings-label" htmlFor="gemini-key">
          API 키 {hasEnvKey ? '(localStorage로 덮어쓰기 가능)' : ''}
        </label>
        <div className="settings-input-row">
          <input
            id="gemini-key"
            type={showKey ? 'text' : 'password'}
            className="settings-input"
            placeholder="AIza..."
            value={apiKey}
            onChange={(e) => setApiKeyInput(e.target.value)}
          />
          <button type="button" className="settings-toggle-btn" onClick={() => setShowKey(!showKey)}>
            {showKey ? '숨기기' : '보기'}
          </button>
        </div>

        <div className="settings-actions">
          <button type="button" className="settings-save-btn" onClick={handleSave}>
            {saved ? '✓ 저장됨' : '저장'}
          </button>
          <button type="button" className="settings-clear-btn" onClick={handleClear}>
            삭제
          </button>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-header">
          <h3>📺 YouTube Data API</h3>
          <span className={`settings-status ${isYtActive ? 'settings-status--active' : 'settings-status--inactive'}`}>
            {isYtActive ? '● 연결됨' : '○ 미연결'}
          </span>
        </div>

        <p className="settings-desc">
          바이럴 발굴 실시간 피드에 사용됩니다. Google Cloud Console에서 YouTube Data API v3를 활성화하세요.
          <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">
            API 활성화 ↗
          </a>
        </p>

        {hasYtEnvKey && (
          <p className="settings-env-notice">
            ✓ `.env.local`의 <code>VITE_YOUTUBE_API_KEY</code>가 설정되어 있습니다.
          </p>
        )}

        <label className="settings-label" htmlFor="youtube-key">API 키</label>
        <div className="settings-input-row">
          <input
            id="youtube-key"
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
          <button type="button" className="settings-clear-btn" onClick={handleYtClear}>
            삭제
          </button>
        </div>
      </section>

      <section className="settings-card">
        <h3>📋 API 연동 범위</h3>
        <ul className="settings-list">
          <li><strong>Gemini API</strong> — 중국어 번역, 샤오홍슈 검색어, 30초/60초 대본, 썸네일 문구</li>
          <li><strong>YouTube API</strong> — 바이럴 발굴 실시간 Shorts 알고리즘 피드</li>
          <li><strong>시뮬레이션</strong> — API 미설정 시 30초마다 갱신되는 알고리즘 더미 피드</li>
          <li><strong>더미 데이터</strong> — 쿠팡 상품 추천, 인포크 링크 (API 연동 예정)</li>
        </ul>
      </section>

      <section className="settings-card settings-card--muted">
        <h3>🔒 보안 안내</h3>
        <p className="settings-desc">
          프론트엔드에 API 키를 직접 넣으면 노출될 수 있습니다.
          실제 서비스 배포 시에는 백엔드 프록시를 통해 API를 호출하는 것을 권장합니다.
        </p>
      </section>
    </div>
  );
}
