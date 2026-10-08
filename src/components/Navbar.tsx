import React from 'react';
import { PageView, SupportedLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../translations';
import { Search, PlusCircle, Home, HeartHandshake, Globe, BookmarkCheck, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentPage: PageView;
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  onOpenLanguageSelect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  language,
  onNavigate,
  onOpenLanguageSelect,
}) => {
  const t = TRANSLATIONS[language];
  const currentLangConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5EB]/95 backdrop-blur-sm border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-1.5 sm:gap-2">
          {/* Brand Logo & Name */}
          <button
            id="nav-brand-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#C2542D] text-white flex items-center justify-center shadow-sm group-hover:bg-[#A13D19] transition-colors border border-[#A13D19]/30">
              <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold font-heritage tracking-tight text-[#3D2B1F]">
                  Skill<span className="text-[#C2542D]">Setu</span>
                </span>
                <span className="hidden md:inline-block px-2.5 py-0.5 text-xs font-semibold bg-[#EEF6F2] text-[#1E4D38] rounded-full border border-[#C7E4D3]">
                  {t.shgBadge}
                </span>
              </div>
              <p className="hidden sm:block text-[11px] sm:text-xs text-[#7A6455] font-medium tracking-wide max-w-xs truncate">
                {t.taglineHero || t.appTagline}
              </p>
            </div>
          </button>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            {/* Language Switcher Button */}
            <button
              id="nav-language-btn"
              onClick={onOpenLanguageSelect}
              className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FFFDF9] hover:bg-[#F5EAD9] text-[#3D2B1F] border border-[#EADBCE] flex items-center gap-1 sm:gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-4 h-4 text-[#D49B24]" />
              <span className="font-semibold">{currentLangConfig.nativeName}</span>
            </button>

            {/* Home */}
            <button
              id="nav-home-btn"
              onClick={() => onNavigate('home')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-[#EFE4D3] text-[#3D2B1F] font-semibold'
                  : 'text-[#6B5749] hover:bg-[#F3E7D6] hover:text-[#3D2B1F]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.home}</span>
            </button>

            {/* Buyer Search (Find Services) */}
            <button
              id="nav-buyer-btn"
              onClick={() => onNavigate('buyer-search')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentPage === 'buyer-search'
                  ? 'bg-[#1E4D38] text-white border-[#1E4D38]'
                  : 'bg-[#EEF6F2] text-[#1E4D38] border-[#C7E4D3] hover:bg-[#E1EFE7]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden xs:inline">{t.nav.findServices}</span>
            </button>

            {/* Setu AI Assistant */}
            <button
              id="nav-assistant-btn"
              onClick={() => onNavigate('assistant')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentPage === 'assistant'
                  ? 'bg-[#1E4D38] text-white border-[#1E4D38] shadow-xs'
                  : 'bg-gradient-to-r from-[#FFFDF9] to-[#FAF3E8] text-[#1E4D38] border-[#DDA74F]/50 hover:bg-[#F5EAD9]'
              }`}
              title="Setu AI Multi-turn Assistant & Voice"
            >
              <Sparkles className="w-4 h-4 text-[#DDA74F]" />
              <span className="hidden md:inline">AI Assistant</span>
            </button>

            {/* My Listings */}
            <button
              id="nav-my-listings-btn"
              onClick={() => onNavigate('my-listings')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentPage === 'my-listings'
                  ? 'bg-[#EFE4D3] text-[#3D2B1F] border-[#D8C7B4] font-semibold'
                  : 'bg-[#FFFDF9] text-[#5C4533] border-[#EADBCE] hover:bg-[#F5EAD9]'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-[#C2542D]" />
              <span className="hidden md:inline">{t.nav.myListings}</span>
            </button>

            {/* Seller Listing (Offer Service) */}
            <button
              id="nav-seller-btn"
              onClick={() => onNavigate('seller-listing')}
              className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                currentPage === 'seller-listing'
                  ? 'bg-[#A13D19] text-white'
                  : 'bg-[#C2542D] text-white hover:bg-[#A13D19]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.nav.offerService}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
