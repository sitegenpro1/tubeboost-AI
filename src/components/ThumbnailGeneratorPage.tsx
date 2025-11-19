import React, { useState } from 'react';
import { generateThumbnail } from '../services/geminiService';
import { ThumbnailResult } from '../types';
import { Page } from '../App';
import LoadingSpinner from './LoadingSpinner';
import { useNotifications } from '../contexts/NotificationContext';
import { useGuestUsage } from '../contexts/GuestUsageContext';

interface ThumbnailGeneratorPageProps {
  onNavigate: (page: Page) => void;
}

const styles = [
    { name: 'Cinematic', img: 'https://i.imgur.com/gS5yYQh.png', prompt: 'cinematic, dramatic lighting, high detail, 8k' },
    { name: 'Photorealistic', img: 'https://i.imgur.com/pA138vH.png', prompt: 'photorealistic, hyperrealistic, sharp focus, detailed' },
    { name: 'Anime', img: 'https://i.imgur.com/k24zTzJ.png', prompt: 'anime style, vibrant colors, clean lines, studio ghibli inspired' },
    { name: 'Minimalist', img: 'https://i.imgur.com/mJ2L4jM.png', prompt: 'minimalist, clean background, simple, elegant' },
    { name: '3D Render', img: 'https://i.imgur.com/h5TzWdC.png', prompt: '3d render, octane render, blender, smooth' },
    { name: 'Pixel Art', img: 'https://i.imgur.com/Vv4z2sS.png', prompt: 'pixel art, 16-bit, retro, detailed sprite' },
];

const ThumbnailGeneratorPage: React.FC<ThumbnailGeneratorPageProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const { isUsageBlocked, incrementUsage } = useGuestUsage();
  
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ThumbnailResult | null>(null);

  const showUsagePrompt = isUsageBlocked('THUMBNAIL_MAKER');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt for your thumbnail.');
      return;
    }

    if (isUsageBlocked('THUMBNAIL_MAKER')) {
        setError('You have reached your free usage limit for this tool.');
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedImage = await generateThumbnail(prompt, selectedStyle.prompt, negativePrompt);
      setResult(generatedImage);
      incrementUsage('THUMBNAIL_MAKER');
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
    <div className="animate-fade-in py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-center">AI Thumbnail Maker</h1>
        <p className="max-w-2xl mx-auto text-gray-400 mb-12 text-center">
          Describe your vision and let our AI create stunning, click-worthy thumbnails in seconds.
        </p>
        
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls Column */}
            <div className="lg:col-span-1 space-y-6">
                 <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">1. Describe your thumbnail</h3>
                     <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A surprised astronaut looking at a glowing nebula"
                        className="w-full h-24 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    />
                </div>
                 <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">2. Choose a style</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {styles.map(style => (
                            <button key={style.name} onClick={() => setSelectedStyle(style)} className={`relative rounded-md overflow-hidden border-2 ${selectedStyle.name === style.name ? 'border-cyan-400' : 'border-transparent'}`}>
                                <img src={style.img} alt={style.name} className="w-full h-16 object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <p className="text-white text-xs font-bold text-center">{style.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">3. Things to avoid (Optional)</h3>
                     <input
                        type="text"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="e.g., blurry, text, ugly, watermark"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    />
                </div>
                 <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 px-4 font-bold text-slate-900 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {loading ? <LoadingSpinner /> : 'Generate'}
                </button>
                {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
            </div>

            {/* Result Column */}
            <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex items-center justify-center min-h-[500px]">
                {loading && (
                    <div className="text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-cyan-300">Generating your masterpiece...</p>
                        <p className="text-sm text-slate-400">This can take up to 30 seconds.</p>
                    </div>
                )}
                {!loading && result && (
                    <div className="animate-fade-in text-center">
                         <img src={`data:image/png;base64,${result}`} alt="Generated thumbnail" className="rounded-lg shadow-xl max-w-full h-auto" />
                         <a 
                           href={`data:image/png;base64,${result}`}
                           download="tubeboost-thumbnail.png"
                           className="mt-6 inline-block bg-slate-700 text-white font-bold px-6 py-2 rounded-md hover:bg-slate-600 transition-colors"
                         >
                            Download Image
                         </a>
                    </div>
                )}
                 {!loading && !result && (
                    <div className="text-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="mt-4">Your generated thumbnail will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ThumbnailGeneratorPage;