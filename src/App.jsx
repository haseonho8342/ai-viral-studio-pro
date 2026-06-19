import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import YoutubeSearch from './components/YoutubeSearch';
import YoutubeDetail from './components/YoutubeDetail';
import AiAnalysis from './components/AiAnalysis';
import DownloadCenter from './components/DownloadCenter';
import DashboardPage from './components/DashboardPage';
import HistoryPage from './components/HistoryPage';
import Settings from './components/Settings';
import './styles/global.css';
import './styles/youtube-platform.css';

function AppContent() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const { state, setMobileMenuOpen, analysisVideo, analysisSubtitle, setAnalysisContext, clearAnalysisContext } = useApp();

  const goToVideo = (videoId) => {
    setSelectedVideoId(videoId);
    setActiveMenu('youtubeDetail');
  };

  const goToAnalyze = (video, subtitle) => {
    setAnalysisContext(video, subtitle);
    setActiveMenu('aiAnalysis');
  };

  const renderPage = () => {
    switch (activeMenu) {
      case 'home':
        return <Home onNavigate={setActiveMenu} />;
      case 'youtubeSearch':
        return <YoutubeSearch onSelectVideo={goToVideo} />;
      case 'youtubeDetail':
        return (
          <YoutubeDetail
            videoId={selectedVideoId}
            onBack={() => setActiveMenu('youtubeSearch')}
            onAnalyze={goToAnalyze}
          />
        );
      case 'aiAnalysis':
        return (
          <AiAnalysis
            video={analysisVideo}
            subtitle={analysisSubtitle}
            onClear={clearAnalysisContext}
          />
        );
      case 'downloadCenter':
        return <DownloadCenter />;
      case 'dashboard':
        return <DashboardPage onSelectVideo={goToVideo} onNavigate={setActiveMenu} />;
      case 'history':
        return <HistoryPage onSelectVideo={goToVideo} />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={setActiveMenu} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={(id) => {
          if (id !== 'youtubeDetail') setSelectedVideoId(null);
          setActiveMenu(id);
        }}
        mobileOpen={state.mobileMenuOpen}
        onMobileToggle={setMobileMenuOpen}
      />
      <main className="app-main">
        {renderPage()}
        <footer className="app-footer">
          <p>© 2026 AI YouTube Learning Platform v5.0</p>
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
