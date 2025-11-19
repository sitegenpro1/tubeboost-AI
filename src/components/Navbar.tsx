import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../App';

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NavLink: React.FC<{
  label: string;
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
  className?: string;
}> = ({ label, page, activePage, onClick, className = '' }) => (
  <button
    onClick={() => onClick(page)}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 w-full text-left ${
      activePage === page
        ? 'text-cyan-400'
        : 'text-gray-400 hover:text-white'
    } ${className}`}
  >
    {label}
  </button>
);

const ToolsDropdown: React.FC<NavbarProps & { onLinkClick?: () => void }> = ({ activePage, onNavigate, onLinkClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigateAndClose = (page: Page) => {
        onNavigate(page);
        setIsOpen(false);
        if (onLinkClick) onLinkClick();
    };

    const toolPages: { label: string; page: Page }[] = [
        { label: 'Keyword Finder', page: 'KEYWORD_FINDER' },
        { label: 'Content Ideation', page: 'CONTENT_IDEATION' },
        { label: 'Video Script Helper', page: 'VIDEO_SCRIPT_HELPER' },
        { label: 'Thumbnail Maker', page: 'THUMBNAIL_MAKER' },
        { label: 'Thumbnail Comparer', page: 'THUMBNAIL_COMPARER' },
        { label: 'Upload Time Suggester', page: 'UPLOAD_TIME_SUGGESTER' },
    ];

    const isToolActive = toolPages.some(p => p.page === activePage);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 flex items-center justify-between w-full md:w-auto ${
                    isToolActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
            >
                <span>Tools</span>
                <svg className={`w-4 h-4 transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="md:absolute top-full right-0 mt-2 w-full md:w-56 bg-slate-800 md:border md:border-slate-700 rounded-md md:shadow-lg py-2 z-50">
                    {toolPages.map(({ label, page }) => (
                        <button
                            key={page}
                            onClick={() => navigateAndClose(page)}
                            className={`block w-full text-left px-4 py-2 text-sm ${activePage === page ? 'text-cyan-400 bg-slate-700' : 'text-gray-300 hover:bg-slate-700/50'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateAndCloseMobile = (page: Page) => {
      onNavigate(page);
      setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-[#0A0D1F]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateAndCloseMobile('HOME')} className="flex items-center space-x-2">
               <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="currentColor"/>
               </svg>
              <span className="text-white font-bold text-lg">TubeBoost AI</span>
            </button>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink label="Home" page="HOME" activePage={activePage} onClick={onNavigate} />
            <ToolsDropdown activePage={activePage} onNavigate={onNavigate} />
            <NavLink label="About" page="ABOUT" activePage={activePage} onClick={onNavigate} />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('KEYWORD_FINDER')}
              className="bg-cyan-500 text-slate-900 font-bold text-sm px-5 py-2 rounded-md hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/20">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
          </div>
        </div>
        
        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
            <div className="md:hidden pt-2 pb-4 space-y-2">
                <NavLink label="Home" page="HOME" activePage={activePage} onClick={navigateAndCloseMobile} />
                <ToolsDropdown activePage={activePage} onNavigate={onNavigate} onLinkClick={() => setIsMobileMenuOpen(false)}/>
                <NavLink label="About" page="ABOUT" activePage={activePage} onClick={navigateAndCloseMobile} />
                <div className="border-t border-slate-700 my-4"></div>
                <button onClick={() => navigateAndCloseMobile('KEYWORD_FINDER')} className="w-full mt-2 text-left bg-cyan-500 text-slate-900 font-bold text-sm px-4 py-2 rounded-md hover:bg-cyan-400 transition-all duration-300">
                    Get Started
                </button>
            </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;