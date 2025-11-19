import React from 'react';
import { Page } from '../App';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {

  return (
    <footer className="bg-[#060814] border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <button onClick={() => onNavigate('HOME')} className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="currentColor"/>
              </svg>
              <span className="text-white font-bold text-xl">TubeBoost AI</span>
            </button>
            <p className="text-gray-400 text-sm">
              An AI-powered YouTube SEO assistant to help creators optimize their content for discoverability and engagement.
            </p>
          </div>

          {/* Column 2: Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('KEYWORD_FINDER')} className="text-gray-400 hover:text-cyan-400 transition-colors">Keyword Finder</button></li>
              <li><button onClick={() => onNavigate('THUMBNAIL_MAKER')} className="text-gray-400 hover:text-cyan-400 transition-colors">Thumbnail Maker</button></li>
              <li><button onClick={() => onNavigate('ABOUT')} className="text-gray-400 hover:text-cyan-400 transition-colors">About</button></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><button className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</button></li>
              <li><button className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Use</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} TubeBoost AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;