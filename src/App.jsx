import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import Settings from './components/Settings';
import TikTokSourcing from './components/TikTokSourcing';
import CoupangPartners from './components/CoupangPartners';
import InpockLink from './components/InpockLink';
import TranslateStudio from './components/TranslateStudio';
import ScriptGenerator from './components/ScriptGenerator';
import ThumbnailStudio from './components/ThumbnailStudio';
import Analytics from './components/Analytics';
import YoutubeShortsLive from './components/YoutubeShortsLive';
import { useDashboard } from './hooks/useDashboard';
import { useWorkspace } from './hooks/useWorkspace';
import './styles/global.css';

function AppContent() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { state, setMobileMenuOpen } = useApp();
  const dashboard = useDashboard();
  const workspace = useWorkspace();

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="app-content">
            <Dashboard
              stats={dashboard.stats}
              isLoading={dashboard.isLoading}
              error={dashboard.error}
              syncedAt={dashboard.syncedAt}
              source={dashboard.source}
              onRefresh={dashboard.refresh}
              onNavigateShorts={() => setActiveMenu('youtubeLive')}
              selectedCardId={workspace.selectedCard?.id}
              onSelectCard={workspace.selectCard}
            />
            <Workspace
              selectedCard={workspace.selectedCard}
              analysis={workspace.analysis}
              isAnalyzing={workspace.isAnalyzing}
              scriptTone={workspace.scriptTone}
              aiSource={workspace.aiSource}
              analysisError={workspace.analysisError}
              geminiBlocked={workspace.geminiBlocked}
              copiedId={workspace.copiedId}
              onToneChange={workspace.setTone}
              onCopy={workspace.copyToClipboard}
              onRetryGemini={workspace.retryGemini}
            />
          </div>
        );
      case 'youtubeLive':
        return <YoutubeShortsLive workspace={workspace} />;
      case 'tiktok':
        return <TikTokSourcing />;
      case 'coupang':
        return <CoupangPartners />;
      case 'inpock':
        return <InpockLink />;
      case 'translate':
        return <TranslateStudio />;
      case 'xiaohongshu':
        return <TranslateStudio focusXhs />;
      case 'script':
        return <ScriptGenerator />;
      case 'thumbnail':
        return <ThumbnailStudio />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        mobileOpen={state.mobileMenuOpen}
        onMobileToggle={setMobileMenuOpen}
      />

      <main className="app-main">
        {renderPage()}

        <footer className="app-footer">
          <p>© 2026 AI Viral Studio PRO v4.0. All Rights Reserved.</p>
          <div className="app-footer-links">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
