import '../styles/sidebar.css';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'youtubeSearch', label: 'YouTube Search', icon: '🔍' },
  { id: 'aiAnalysis', label: 'AI Analysis', icon: '🤖' },
  { id: 'downloadCenter', label: 'Download Center', icon: '⬇️' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'history', label: 'History', icon: '📚' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
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
          <span className="sidebar-brand-icon">🎓</span>
          <span className="sidebar-brand-text">AI 유튜브 학습 플랫폼</span>
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

      {mobileOpen && <div className="sidebar-overlay" onClick={() => onMobileToggle(false)} />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🎓</span>
          <div>
            <h1 className="sidebar-logo-title">AI 유튜브 학습</h1>
            <p className="sidebar-logo-sub">v5.0</p>
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
          <p className="sidebar-footer-label">YouTube AI Platform</p>
          <p className="sidebar-footer-version">v5.0.0 · 2026</p>
        </div>
      </aside>
    </>
  );
}
