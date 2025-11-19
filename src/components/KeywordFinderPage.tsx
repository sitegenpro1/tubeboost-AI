import React, { useState } from 'react';
import { generateKeywords } from '../services/geminiService';
import { KeywordResult, Keyword } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { Page } from '../App';
import { useNotifications } from '../contexts/NotificationContext';
import { useGuestUsage } from '../contexts/GuestUsageContext';

interface KeywordFinderPageProps {
  onNavigate: (page: Page) => void;
}

const TABS: Keyword['type'][] = ['Related Keyword', 'Long-Tail Variation', 'Question'];

const KeywordFinderPage: React.FC<KeywordFinderPageProps> = ({ onNavigate }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordResult | null>(null);
  const [showUsagePrompt, setShowUsagePrompt] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Keyword['type']>(TABS[0]);


  const { addNotification } = useNotifications();
  const { isUsageBlocked, incrementUsage, getRemainingUsage } = useGuestUsage();

  const performSearch = async (searchTopic: string) => {
     if (!searchTopic) {
      setError('Please enter a topic to search.');
      return;
    }

    if (isUsageBlocked('KEYWORD_FINDER')) {
      setShowUsagePrompt(true);
      setError('You have reached your free search limit for this tool.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null); 
    setShowUsagePrompt(false);
    setActiveTab(TABS[0]);

    try {
      incrementUsage('KEYWORD_FINDER');
      const resultData = await generateKeywords(searchTopic);
      setResult(resultData);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(topic.trim());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification('Copied to clipboard!', 'success');
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleCopyAll = (keywordsToCopy: Keyword[]) => {
    if (!keywordsToCopy || keywordsToCopy.length === 0) return;
    const textToCopy = keywordsToCopy.map(kw => kw.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    addNotification(`Copied ${keywordsToCopy.length} keywords!`, 'success');
  };
  
  const competitionColor = (level: 'Low' | 'Medium' | 'High') => {
      switch(level) {
          case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
          case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
          case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      }
  }
  
  const groupKeywords = (keywords: Keyword[]) => {
      return keywords.reduce((acc, kw) => {
          (acc[kw.type] = acc[kw.type] || []).push(kw);
          return acc;
      }, {} as Record<string, Keyword[]>);
  }

  const groupedResult = result ? groupKeywords(result.keywords) : {};

  return (
    <div className="animate-fade-in space-y-12 py-8">
      {/* Header & Search */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          YouTube Keyword Intelligence
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 mb-8">
          Get deep AI analysis to find the best keywords for your videos.
        </p>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Try 'YouTube SEO tips'..."
              className="w-full pl-5 pr-36 py-4 bg-slate-800/50 border border-slate-700 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-lg"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-cyan-500 text-slate-900 font-bold rounded-full hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {loading ? <LoadingSpinner /> : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Search
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {getRemainingUsage('KEYWORD_FINDER')} free searches remaining.
          </p>
        </form>
      </section>

      {error && !showUsagePrompt && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-4xl mx-auto text-center">{error}</div>}
      
      {showUsagePrompt && (
        <div className="bg-slate-800/50 p-8 rounded-lg border border-cyan-700 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Free Search Limit Reached</h3>
          <p className="text-cyan-200">
            You have used all your free searches for this tool. Please try again later.
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <section className="max-w-5xl mx-auto animate-fade-in space-y-8">
            {/* AI Strategy */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    AI Content Strategy
                </h3>
                <p className="text-gray-300">{result.strategy}</p>
            </div>
            
            {/* Keyword Tabs */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="border-b border-slate-700">
                    <nav className="flex space-x-2 p-2">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-cyan-500 text-slate-900' : 'text-gray-300 hover:bg-slate-700/50'}`}
                            >
                                {tab} ({groupedResult[tab]?.length || 0})
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="p-4">
                    <div className="flex justify-end mb-4">
                         <button onClick={() => handleCopyAll(groupedResult[activeTab])} className="text-sm bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-md transition-colors flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                            <span>Copy All</span>
                         </button>
                    </div>
                    <div className="space-y-3">
                    {(groupedResult[activeTab] || []).map((kw, i) => (
                         <div key={i} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-md">
                            <span className="text-gray-300">{kw.text}</span>
                            <div className="flex items-center space-x-4">
                               <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${competitionColor(kw.competition)}`}>
                                   {kw.competition}
                               </span>
                               <button onClick={() => handleCopy(kw.text)} className="text-slate-400 hover:text-white transition-colors">
                                  {copiedKeyword === kw.text ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                  )}
                              </button>
                            </div>
                         </div>
                    ))}
                     {(!groupedResult[activeTab] || groupedResult[activeTab].length === 0) && (
                        <p className="text-center text-slate-500 py-4">No keywords found for this category.</p>
                     )}
                    </div>
                </div>
            </div>
        </section>
      )}

      {!result && !loading && !showUsagePrompt && (
        <div className="text-center text-slate-500 pt-10">
          <p>Your keyword intelligence report will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default KeywordFinderPage;