import '../styles/sidebar.css';

const MENU_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: '🏠' },
  { id: 'youtubeLive', label: '유튜브 쇼츠 실시간', icon: '📺' },
  { id: 'tiktok', label: '틱톡 소싱', icon: '🎵' },
  { id: 'coupang', label: '쿠팡 파트너스', icon: '🛒' },
  { id: 'inpock', label: '인포크 링크', icon: '🔗' },
  { id: 'translate', label: '중국어 번역', icon: '🌏' },
  { id: 'xiaohongshu', label: '샤오홍슈', icon: '📕' },
  { id: 'script', label: '대본 생성', icon: '🎬' },
  { id: 'thumbnail', label: '썸네일 스튜디오', icon: '🖼' },
  { id: 'analytics', label: '분석 리포트', icon: '📊' },
  { id: 'settings', label: '설정', icon: '⚙️' },
];

export default function Sidebar({ activeMenu, onMenuChange, mobileOpen, onMobileToggle }) {
  const handleSelect = (id) => {
    onMenuChange(id);
    onMobileToggle(false);
  };

  return (
    <>
      <div className="sidebar-mobile-header">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">✨</span>
          <span className="sidebar-brand-text">AI 바이럴 스튜디오 PRO</span>
        </div>
        <button
          type="button"
          className="sidebar-mobile-toggle"
          onClick={() => onMobileToggle(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => onMobileToggle(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">✨</span>
          <div>
            <h1 className="sidebar-logo-title">AI 바이럴 스튜디오</h1>
            <p className="sidebar-logo-sub">PRO v4.0</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${activeMenu === item.id ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => handleSelect(item.id)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-label">엔터프라이즈 SaaS</p>
          <p className="sidebar-footer-version">v4.0.0 · 2026</p>
        </div>
      </aside>
    </>
  );
}
