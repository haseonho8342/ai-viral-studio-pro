import { useState } from 'react';
import PageHeader from './PageHeader';
import { DEFAULT_INPOCK_LINKS } from '../data/pageData';
import '../styles/pages.css';

export default function InpockLink() {
  const [profileName, setProfileName] = useState('바이럴 가이드 TV');
  const [bio, setBio] = useState('쇼츠 속 획기적인 쿠팡 꿀템 최저가 링크 모음 🧺');
  const [theme, setTheme] = useState('slate');
  const [links, setLinks] = useState(DEFAULT_INPOCK_LINKS);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const addLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setLinks([...links, { id: Date.now().toString(), title: newTitle, url: newUrl }]);
    setNewTitle('');
    setNewUrl('');
  };

  const removeLink = (id) => setLinks(links.filter((l) => l.id !== id));

  const copyInpock = () => {
    navigator.clipboard.writeText('inpock.link/viral_guide_tv');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-view">
      <PageHeader
        icon="🔗"
        title="인포크 링크 빌더"
        description="쇼츠/틱톡 시청자가 프로필에서 접속하는 링크-인-바이오 페이지를 커스터마이징합니다."
      />

      <div className="page-grid page-grid--5-5">
        <div className="page-card page-space-y-lg">
          <h3 className="page-card-title">👤 프로필 설정</h3>
          <div>
            <label className="page-label">닉네임</label>
            <input className="page-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
          </div>
          <div>
            <label className="page-label">소개글</label>
            <textarea className="page-textarea" rows={2} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div>
            <label className="page-label">테마</label>
            <div className="theme-picker">
              {['slate', 'pink', 'emerald'].map((t) => (
                <button key={t} type="button" className={`theme-picker-btn theme-picker-btn--${t} ${theme === t ? 'theme-picker-btn--active' : ''}`} onClick={() => setTheme(t)}>
                  {t === 'slate' ? '슬레이트' : t === 'pink' ? '로즈' : '에메랄드'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="page-label">링크 추가</label>
            <input className="page-input" placeholder="버튼 제목" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ marginBottom: '0.5rem' }} />
            <input className="page-input page-input--mono" placeholder="https://link.coupang.com/..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
            <button type="button" className="page-btn" style={{ marginTop: '0.5rem' }} onClick={addLink}>+ 링크 추가</button>
          </div>

          <div className="page-space-y">
            {links.map((link) => (
              <div key={link.id} className="page-list-item">
                <span className="page-list-item-title" style={{ fontSize: '0.6875rem' }}>{link.title}</span>
                <button type="button" className="page-btn page-btn--outline page-btn--sm" onClick={() => removeLink(link.id)}>삭제</button>
              </div>
            ))}
          </div>

          <button type="button" className="page-btn page-btn--outline" onClick={copyInpock}>
            {copied ? '✓ inpock.link/viral_guide_tv 복사됨' : '📋 인포크 URL 복사'}
          </button>
        </div>

        <div className="page-card">
          <h3 className="page-card-title">📱 모바일 미리보기</h3>
          <div className={`inpock-preview inpock-preview--${theme}`}>
            <div className="inpock-avatar">🧺</div>
            <p className="inpock-name">{profileName}</p>
            <p className="inpock-bio">{bio}</p>
            {links.map((link) => (
              <div key={link.id} className="inpock-link-btn">{link.title}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
