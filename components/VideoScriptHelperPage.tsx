import React, { useState } from 'react';
import { generateVideoScript } from '../services/geminiService';
import { VideoScriptResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { Page } from '../App';
import { useNotifications } from '../contexts/NotificationContext';
import { useGuestUsage } from '../contexts/GuestUsageContext';

// A simple markdown to HTML converter could be done, but for robustness a library would be better.
// For this environment, let's create a simple one.
const simpleMarkdownToHtml = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')     // Italic
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-cyan-300 mb-2">$1</h3>') // H3
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-cyan-400 mb-3">$1</h2>') // H2
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-cyan-500 mb-4">$1</h1>') // H1
        .replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside mb-2"><li>$1</li></ul>') // li
        .replace(/\n/g, '<br />');
}


interface VideoScriptHelperPageProps {
  onNavigate: (page: Page) => void;
}

const VideoScriptHelperPage: React.FC<VideoScriptHelperPageProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const { isUsageBlocked, incrementUsage } = useGuestUsage();
  
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoScriptResult | null>(null);

  const showUsagePrompt = isUsageBlocked('VIDEO_SCRIPT_HELPER');

  const handleCopy = () => {
    if (result) {
      // Create a temporary textarea to preserve line breaks
      const textArea = document.createElement("textarea");
      textArea.value = result.script
        .replace(/<br \/>/g, "\n")
        .replace(/<strong>/g, "**")
        .replace(/<\/strong>/g, "**")
        .replace(/<em>/g, "*")
        .replace(/<\/em>/g, "*")
        .replace(/<h.>/g, "")
        .replace(/<\/h.>/g, "");
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      
      addNotification('Script copied to clipboard!', 'success');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a video title.');
      return;
    }
    if (isUsageBlocked('VIDEO_SCRIPT_HELPER')) {
      setError('You have reached your free usage limit for this tool.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateVideoScript(title, points);
      setResult(data);
      incrementUsage('VIDEO_SCRIPT_HELPER');
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
          AI Video Script Helper
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 mb-8">
          From title to final script in seconds. Let our AI build a structured, engaging script for your next video.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <label htmlFor="video-title" className="block text-lg font-medium text-white mb-2">
              Video Title
            </label>
            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 'My Honest Review of the New Pixel Phone'"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <label htmlFor="talking-points" className="block text-lg font-medium text-white mb-2">
              Key Talking Points (Optional)
            </label>
            <textarea
              id="talking-points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="e.g., - Camera quality\n- Battery life\n- New AI features"
              className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 px-4 font-bold text-slate-900 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
          >
            {loading ? <LoadingSpinner /> : `Generate Script`}
          </button>
          {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
        </div>

        {/* Result */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 min-h-[400px] relative">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <LoadingSpinner />
              <p className="mt-4 text-cyan-300">Writing your script...</p>
            </div>
          )}
          {!loading && result && (
            <div className="animate-fade-in">
                <button onClick={handleCopy} className="absolute top-4 right-4 bg-slate-700 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-600 transition-colors z-10">
                    Copy Full Script
                </button>
                <div 
                    className="prose prose-invert prose-p:text-gray-300 prose-headings:text-cyan-400 max-w-none"
                    dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(result.script) }} 
                />
            </div>
          )}
          {!loading && !result && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4">Your generated video script will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoScriptHelperPage;
