import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { TRANSLATIONS } from '../translations';
import { SupportedLanguage } from '../types';
import { Download, Smartphone, X, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'floating' | 'banner';
  language?: SupportedLanguage;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar', language = 'en' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // If already running as an installed PWA / standalone, suppress the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'navbar') {
      return (
        <button
          id="pwa-install-nav-btn"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
          title="Install SkillSetu app for instant offline access"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Install SkillSetu App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F2E6D5] text-[#3D2B1F] border border-[#EADBCE] font-bold text-xs transition-colors cursor-pointer"
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#C2542D]" />
          <span className="hidden sm:inline">Install on iOS</span>
          <span className="sm:hidden">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-[#FFFDF9] border-2 border-[#EADBCE] p-6 shadow-2xl text-[#2B1B12] relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* SkillSetu Brand Logo Tile */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-[#C2542D]/30 shrink-0 bg-[#FAF5EB]">
                  <img 
                    src="/app-logo.png" 
                    alt="SkillSetu Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heritage text-[#3D2B1F] leading-tight">
                    Skill<span className="text-[#C2542D]">Setu</span>
                  </h3>
                  <p className="text-[11px] text-[#C2542D] font-medium not-italic">{t.appTagline}</p>
                </div>
              </div>

              <p className="text-xs text-[#6B5749] mb-4">
                Enjoy full offline listings & quick access directly from your phone's home screen:
              </p>

              <div className="space-y-3 text-xs text-[#3D2B1F]">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF5EB] border border-[#EADBCE]">
                  <span className="w-5 h-5 rounded-full bg-[#C2542D] text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Tap the <strong>Share</strong> button at the bottom of Safari (square with an up arrow).</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF5EB] border border-[#EADBCE]">
                  <span className="w-5 h-5 rounded-full bg-[#C2542D] text-white flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>Scroll down the menu and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF5EB] border border-[#EADBCE]">
                  <span className="w-5 h-5 rounded-full bg-[#1E4D38] text-white flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <span>Tap <strong>Add</strong> in the top-right corner to finish.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#C2542D] hover:bg-[#A13D19] py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
