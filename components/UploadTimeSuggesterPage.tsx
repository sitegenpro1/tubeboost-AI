import React, { useState } from 'react';
import { generateUploadTimeSuggestions } from '../services/geminiService';
import { UploadTimeResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { Page } from '../App';
import { useNotifications } from '../contexts/NotificationContext';
import { useGuestUsage } from '../contexts/GuestUsageContext';

interface UploadTimeSuggesterPageProps {
  onNavigate: (page: Page) => void;
}

const UploadTimeSuggesterPage: React.FC<UploadTimeSuggesterPageProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const { isUsageBlocked, incrementUsage } = useGuestUsage();
  
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadTimeResult | null>(null);

  const showUsagePrompt = isUsageBlocked('UPLOAD_TIME_SUGGESTER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) {
      setError('Please enter your video niche.');
      return;
    }
    if (isUsageBlocked('UPLOAD_TIME_SUGGESTER')) {
        setError('You have reached your free usage limit for this tool.');
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateUploadTimeSuggestions(niche);
      setResult(data);
      incrementUsage('UPLOAD_TIME_SUGGESTER');
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
            You have used all your free suggestions for this tool. Please try again later.
          </p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 py-8">
       <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          AI Upload Time Suggester
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 mb-8">
          Maximize your video's initial reach. Enter your niche to get AI-powered suggestions for the best days and times to publish.
        </p>
      </section>

      <section className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
            <div>
                <label htmlFor="niche" className="block text-lg font-medium text-white mb-2">
                    What is your video's niche?
                </label>
                <input
                    id="niche"
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g., 'Gaming', 'Cooking', 'Tech Reviews'"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 px-4 font-bold text-slate-900 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
                {loading ? <LoadingSpinner /> : 'Get Suggestions'}
            </button>
        </form>
         {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
      </section>

      {result && (
        <section className="max-w-3xl mx-auto animate-fade-in space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Recommended Upload Times</h3>
                <div className="space-y-4">
                    {result.schedule.map((slot, i) => (
                        <div key={i} className="bg-slate-900/50 p-4 rounded-md">
                           <p className="font-semibold text-cyan-300">{slot.day} at {slot.time}</p>
                           <p className="text-sm text-gray-400 mt-1">{slot.reasoning}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Overall Strategy</h3>
                 <p className="text-gray-300">{result.summary}</p>
            </div>
        </section>
      )}

    </div>
  );
};

export default UploadTimeSuggesterPage;
