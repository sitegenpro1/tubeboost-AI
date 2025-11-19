import React from 'react';
import { Page } from '../App';

interface HomepageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; page?: Page; onNavigate?: (page: Page) => void; }> = ({ icon, title, description, page, onNavigate }) => {
    const content = (
        <>
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-slate-700 text-cyan-400 mb-4">
                {icon}
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </>
    );

    if (page && onNavigate) {
        return (
            <button 
                onClick={() => onNavigate(page)}
                className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1 text-left w-full h-full"
            >
                {content}
            </button>
        )
    }

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1">
            {content}
        </div>
    );
};

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 text-slate-900 font-bold text-xl mb-4">
            {number}
        </div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </div>
);

const Homepage: React.FC<HomepageProps> = ({ onNavigate }) => {
    
  const tools = [
    {
      title: 'Keyword Finder',
      description: 'Discover high-demand keywords and get deep AI-powered competition analysis.',
      page: 'KEYWORD_FINDER',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    },
    {
      title: 'Content Ideation',
      description: 'Generate viral titles, video outlines, and relevant tags to kickstart your creative process.',
      page: 'CONTENT_IDEATION',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    },
    {
      title: 'AI Script Helper',
      description: 'Turn your ideas into a structured, engaging video script from start to finish.',
      page: 'VIDEO_SCRIPT_HELPER',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      title: 'Thumbnail Maker',
      description: 'Generate stunning, AI-powered thumbnails to grab attention and boost your CTR.',
      page: 'THUMBNAIL_MAKER',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      title: 'Thumbnail Comparer',
      description: 'A/B test two thumbnails with an expert AI analysis to see which one performs better.',
      page: 'THUMBNAIL_COMPARER',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      title: 'Upload Time Suggester',
      description: 'Get AI-powered advice on the best days and times to publish for maximum reach.',
      page: 'UPLOAD_TIME_SUGGESTER',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 py-12">
      {/* Hero Section */}
      <div className="animate-section">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            Level up your <span className="text-cyan-400 text-glow">YouTube SEO</span>
            <br /> with data-driven insights & tools.
          </h1>
          <p className="max-w-3xl mx-auto text-gray-400 md:text-lg mb-8">
            Research trending keywords, analyze competitors, and design powerful thumbnails — Access many powerful YouTube SEO Tools in a single tool.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('KEYWORD_FINDER')}
              className="bg-cyan-500 text-slate-900 font-bold px-8 py-3 rounded-md hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105">
              Start Free
            </button>
            <button 
              onClick={() => onNavigate('KEYWORD_FINDER')}
              className="bg-slate-800 text-white font-medium px-8 py-3 rounded-md hover:bg-slate-700 transition-colors">
              Keyword Finder
            </button>
          </div>
        </section>
      </div>

      {/* Explore Tools Section */}
      <div className="animate-section" style={{animationDelay: '150ms'}}>
        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Explore Our Suite of AI Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tools.map(tool => (
                  <FeatureCard 
                    key={tool.page}
                    icon={tool.icon}
                    title={tool.title}
                    description={tool.description}
                    page={tool.page as Page}
                    onNavigate={onNavigate}
                  />
              ))}
          </div>
        </section>
      </div>

      {/* How it works */}
      <div className="animate-section" style={{animationDelay: '300ms'}}>
        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard number="1" title="Choose a Tool" description="Select from our suite of specialized AI tools for your specific task."/>
              <StepCard number="2" title="Provide Your Input" description="Enter your topic, keywords, or creative ideas to get started."/>
              <StepCard number="3" title="Get Instant Insights" description="Receive AI-powered analysis, content, and suggestions in seconds."/>
          </div>
        </section>
      </div>
      
      {/* Overall Tool Introduction */}
      <div className="animate-section" style={{animationDelay: '450ms'}}>
        <section className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                An All-in-One <span className="text-cyan-400">YouTube Growth</span> Toolkit
            </h2>
            <p className="text-gray-400 md:text-lg">
                TubeBoost AI is more than just a keyword tool. It's a comprehensive suite designed to demystify YouTube's algorithm. From generating viral video ideas to pinpointing the perfect upload time, we provide the data-driven insights you need to grow your channel faster and more effectively.
            </p>
        </section>
      </div>

      {/* Why Choose Section */}
      <div className="animate-section" style={{animationDelay: '600ms'}}>
        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Creators Love TubeBoost AI</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              title="Smart Keyword Insights"
              description="Stop guessing. Uncover high-demand, low-competition keywords that viewers are actually searching for, giving your videos a competitive edge."
            />
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Save Dozens of Hours"
              description="Automate your SEO workflow. Instantly generate title ideas, descriptions, and tags, freeing up your time to focus on creating amazing content."
            />
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              title="Outsmart Competitors"
              description="Analyze top-performing videos in your niche. See the keywords they rank for and their strategies to find opportunities and outperform them."
            />
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zM9 9l-2.07-2.07a1 1 0 010-1.414L9 3l3.5 3.5" /></svg>}
              title="Boost Your CTR"
              description="Generate stunning, AI-powered thumbnail ideas. Get data-backed suggestions to create visuals that grab attention and drive more clicks."
            />
          </div>
        </section>
      </div>

    </div>
  );
};

export default Homepage;