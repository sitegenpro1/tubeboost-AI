import React, { useState } from 'react';
import { compareThumbnails } from '../services/geminiService';
import { ThumbnailComparisonResult } from '../types';
import { Page } from '../App';
import LoadingSpinner from './LoadingSpinner';
import { useNotifications } from '../contexts/NotificationContext';
import { useGuestUsage } from '../contexts/GuestUsageContext';

interface ThumbnailComparerPageProps {
  onNavigate: (page: Page) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const UploadBox: React.FC<{ onUpload: (file: File, url: string) => void; previewUrl: string | null; id: string; label: string; }> = ({ onUpload, previewUrl, id, label }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onUpload(file, url);
        }
    };

    return (
        <div className="w-full bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 transition-colors">
            {previewUrl ? (
                <img src={previewUrl} alt="Thumbnail preview" className="w-full h-48 object-contain rounded-md" />
            ) : (
                <div className="flex flex-col items-center justify-center h-48">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z" /></svg>
                    <p className="text-white font-semibold">{label}</p>
                    <p className="text-xs text-slate-400">Click to upload or drag & drop</p>
                </div>
            )}
            <input type="file" id={id} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </div>
    );
}

const ThumbnailComparerPage: React.FC<ThumbnailComparerPageProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const { isUsageBlocked, incrementUsage } = useGuestUsage();
  
  const [imageA, setImageA] = useState<File | null>(null);
  const [imageB, setImageB] = useState<File | null>(null);
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ThumbnailComparisonResult | null>(null);

  const showUsagePrompt = isUsageBlocked('THUMBNAIL_COMPARER');

  const handleSubmit = async () => {
    if (!imageA || !imageB) {
      setError('Please upload two thumbnails to compare.');
      return;
    }
    if (isUsageBlocked('THUMBNAIL_COMPARER')) {
        setError('You have reached your free usage limit for this tool.');
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64A = await fileToBase64(imageA);
      const base64B = await fileToBase64(imageB);
      const data = await compareThumbnails(base64A, base64B);
      setResult(data);
      incrementUsage('THUMBNAIL_COMPARER');
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
             You have used all your free comparisons for this tool. Please try again later.
          </p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 py-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          AI Thumbnail Comparer
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 mb-8">
          Upload two thumbnails to get an expert AI analysis and find out which one is more likely to get clicks.
        </p>
      </section>

      <section className="max-w-4xl mx-auto bg-slate-800/50 p-8 rounded-lg border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <label htmlFor="uploadA" className="cursor-pointer space-y-2">
                 <p className="text-center font-semibold text-white">Thumbnail A</p>
                 <UploadBox id="uploadA" label="Upload Thumbnail A" previewUrl={previewA} onUpload={(file, url) => { setImageA(file); setPreviewA(url); }} />
              </label>
               <label htmlFor="uploadB" className="cursor-pointer space-y-2">
                 <p className="text-center font-semibold text-white">Thumbnail B</p>
                 <UploadBox id="uploadB" label="Upload Thumbnail B" previewUrl={previewB} onUpload={(file, url) => { setImageB(file); setPreviewB(url); }} />
              </label>
          </div>
          <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !imageA || !imageB}
              className="w-full py-3 px-4 font-bold text-slate-900 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
          >
              {loading ? <LoadingSpinner /> : 'Compare Thumbnails'}
          </button>
          {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
      </section>
      
      {loading && (
        <div className="text-center text-lg text-cyan-300">
            <LoadingSpinner />
            <p>Analyzing... This may take a moment.</p>
        </div>
      )}

      {result && (
        <section className="max-w-6xl mx-auto animate-fade-in">
            {/* Verdict */}
            <div className={`text-center p-6 rounded-lg border mb-8 ${result.verdict.winner === 'Thumbnail A' ? 'bg-green-900/50 border-green-700' : result.verdict.winner === 'Thumbnail B' ? 'bg-green-900/50 border-green-700' : 'bg-yellow-900/50 border-yellow-700'}`}>
                <h2 className="text-2xl font-bold text-white">Verdict: <span className="text-cyan-400">{result.verdict.winner} is the Winner!</span></h2>
                <p className="text-gray-300 mt-2">{result.verdict.summary}</p>
            </div>
            
            {/* Detailed Analysis */}
            <div className="space-y-4">
                {result.analysis.map((item) => (
                    <div key={item.principle} className="bg-slate-800/50 border border-slate-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-white p-4 border-b border-slate-700">{item.principle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-700">
                            <div className="p-4 bg-slate-800">
                                <p className="font-bold text-cyan-400 mb-2">Thumbnail A: {item.thumbnailA_score}/10</p>
                                <p className="text-sm text-gray-400">{item.thumbnailA_reasoning}</p>
                            </div>
                            <div className="p-4 bg-slate-800">
                                <p className="font-bold text-cyan-400 mb-2">Thumbnail B: {item.thumbnailB_score}/10</p>
                                <p className="text-sm text-gray-400">{item.thumbnailB_reasoning}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      )}

    </div>
  );
};

export default ThumbnailComparerPage;