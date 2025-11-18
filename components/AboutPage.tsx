import React from 'react';
import { Page } from '../App';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

const FeatureListItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
    <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </div>
);

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12 space-y-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          Empowering YouTube Creators with <span className="text-cyan-400">AI</span>
        </h1>
        <p className="max-w-3xl mx-auto text-gray-400 md:text-lg">
          Our mission is to level the playing field for YouTube creators. We believe that everyone, from beginners to seasoned professionals, should have access to the data-driven tools needed to succeed. TubeBoost AI was built to demystify the algorithm and turn your creative passion into a thriving channel.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-white text-center mb-8">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureListItem title="AI Keyword Research">
            Go beyond basic tools. Our AI finds high-impact keywords and content gaps in your niche, giving you a clear roadmap for what videos to create next.
          </FeatureListItem>
          <FeatureListItem title="AI Thumbnail Generation">
            Your thumbnail is your video's billboard. Generate dozens of unique, eye-catching thumbnail ideas in seconds to maximize your click-through rate (CTR).
          </FeatureListItem>
          <FeatureListItem title="Competitor Analysis">
            Success leaves clues. We help you analyze what's working for the top channels, so you can adapt their strategies and carve out your own space.
          </FeatureListItem>
          <FeatureListItem title="Content Strategy & Ideation">
            Never run out of ideas again. Get AI-powered suggestions for video titles, talking points, and tags that are engineered to rank and engage.
          </FeatureListItem>
        </div>
      </section>

      <section className="text-center bg-slate-800/50 p-8 rounded-lg border border-cyan-500/30">
        <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          We're constantly evolving and adding new tools based on feedback from creators like you. Try our tools today and start your journey to YouTube growth.
        </p>
        <button 
            onClick={() => onNavigate('KEYWORD_FINDER')}
            className="bg-cyan-500 text-slate-900 font-bold px-8 py-3 rounded-md hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 transform hover:scale-105">
            Try a Free Tool
        </button>
      </section>
    </div>
  );
};

export default AboutPage;
