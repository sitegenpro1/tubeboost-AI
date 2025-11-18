import React, { useState } from 'react';
import { generateContentIdeas } from '../services/geminiService';
import { ContentIdeaResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { Page } from '../App';
import { useNotifications } from '../contexts/NotificationContext';
import { useGuestUsage } from '../contexts/GuestUsageContext';

interface ContentIdeationPageProps {
  onNavigate: (page: Page) => void;
}

const ContentIdeationPage: React.FC<ContentIdeationPageProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const { isUsageBlocked, incrementUsage } = useGuestUsage();
  
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentIdeaResult | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const showUsagePrompt = isUsageBlocked('CONTENT_IDEATION');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification('Copied to clipboard!', 'success');
    setCopiedItem(text);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !audience.trim()) {
      setError('Please enter both a topic and a target audience.');
      return;
    }
    if (isUsageBlocked('CONTENT_IDEATION')) {
        setError('You have reached your free usage limit for this tool.');
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateContentIdeas(topic, audience);
      setResult(data);
      incrementUsage('CONTENT_IDEATION');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (showUsagePrompt) {
    return (
       <div className="bg-slate-800/50 p-8 rounded-lg border border-cyan-700 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Free Usage Limit Reached</h3>
          <p className="text-cyan-200">
            You have used all your free generations for this tool. Please try again later.
          </p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 py-8">
       <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Never Run Out of Ideas Again
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 mb-8">
          Describe your topic and audience, and let our AI generate a complete content plan for your next viral video.
        </p>
      </section>

      <section className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label htmlFor="topic-ideas" className="block text-lg font-medium text-white mb-2">
                Video Topic
                </label>
                <input
                id="topic-ideas"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 'How to brew specialty coffee'"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
            </div>
            <div>
                <label htmlFor="audience" className="block text-lg font-medium text-white mb-2">
                Target Audience
                </label>
                <input
                id="audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., 'Coffee beginners'"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
            </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 font-bold text-slate-900 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
                {loading ? <LoadingSpinner /> : 'Generate Ideas'}
            </button>
        </form>
         {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
      </section>

      {result && (
        <section className="max-w-4xl mx-auto animate-fade-in space-y-6">
            {/* Title Ideas */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Viral Title Ideas</h3>
                <ul className="space-y-3">
                    {result.titleIdeas.map((title, i) => (
                        <li key={i} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-md">
                           <span className="text-gray-300">{title}</span>
                           <button onClick={() => handleCopy(title)} className="text-slate-400 hover:text-white transition-colors flex-shrink-0 ml-4">
                               {copiedItem === title ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                           </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Talking Points */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Video Outline</h3>
                <ul className="space-y-3">
                    {result.talkingPoints.map((point, i) => (
                         <li key={i} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-md">
                           <span className="text-gray-300">{point}</span>
                           <button onClick={() => handleCopy(point)} className="text-slate-400 hover:text-white transition-colors flex-shrink-0 ml-4">
                               {copiedItem === point ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                           </button>
                        </li>
                    ))}
                </ul>
            </div>
             {/* Suggested Tags */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Suggested Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, i) => (
                        <div key={i} className="flex items-center space-x-2 bg-slate-700 rounded-full px-3 py-1">
                             <span className="text-cyan-300 text-sm font-medium">{tag}</span>
                             <button onClick={() => handleCopy(tag)} className="text-slate-400 hover:text-white transition-colors">
                               {copiedItem === tag ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                )}
                           </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

    </div>
  );
};

export default ContentIdeationPage;
