import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import KeywordFinderPage from './components/KeywordFinderPage';
import ThumbnailGeneratorPage from './components/ThumbnailGeneratorPage';
import ThumbnailComparerPage from './components/ThumbnailComparerPage';
import AboutPage from './components/AboutPage';
import ContentIdeationPage from './components/ContentIdeationPage';
import VideoScriptHelperPage from './components/VideoScriptHelperPage';
import UploadTimeSuggesterPage from './components/UploadTimeSuggesterPage';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import { GuestUsageProvider } from './contexts/GuestUsageContext';

export type Page = 'HOME' | 'KEYWORD_FINDER' | 'THUMBNAIL_MAKER' | 'THUMBNAIL_COMPARER' | 'CONTENT_IDEATION' | 'VIDEO_SCRIPT_HELPER' | 'UPLOAD_TIME_SUGGESTER' | 'ABOUT';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('HOME');

  const navigate = (page: Page) => {
    setActivePage(page);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'HOME':
        return <Homepage onNavigate={navigate} />;
      case 'KEYWORD_FINDER':
        return <KeywordFinderPage onNavigate={navigate} />;
      case 'THUMBNAIL_MAKER':
        return <ThumbnailGeneratorPage onNavigate={navigate} />;
      case 'THUMBNAIL_COMPARER':
        return <ThumbnailComparerPage onNavigate={navigate} />;
      case 'CONTENT_IDEATION':
        return <ContentIdeationPage onNavigate={navigate} />;
       case 'VIDEO_SCRIPT_HELPER':
        return <VideoScriptHelperPage onNavigate={navigate} />;
       case 'UPLOAD_TIME_SUGGESTER':
        return <UploadTimeSuggesterPage onNavigate={navigate} />;
      case 'ABOUT':
        return <AboutPage onNavigate={navigate} />;
      default:
        return <Homepage onNavigate={navigate} />;
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0A0D1F] text-gray-300 font-sans flex flex-col">
      <Navbar activePage={activePage} onNavigate={navigate} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <NotificationContainer />
      <Footer onNavigate={navigate} />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <GuestUsageProvider>
        <AppContent />
      </GuestUsageProvider>
    </NotificationProvider>
  );
};


export default App;
