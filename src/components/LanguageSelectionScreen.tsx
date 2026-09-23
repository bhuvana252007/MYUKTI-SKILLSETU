import React from 'react';
import { SupportedLanguage } from '../types';
import { LANGUAGE_OPTIONS } from '../translations';
import { HeartHandshake, Globe, ArrowRight, Sparkles, Check } from 'lucide-react';

interface LanguageSelectionScreenProps {
  onSelectLanguage: (lang: SupportedLanguage) => void;
  currentLanguage?: SupportedLanguage;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onSelectLanguage,
  currentLanguage = 'hi',
}) => {
  // Visual decoration & script indicators for each language
  const languageDecorations: Record<
    SupportedLanguage,
    {
      badge: string;
      icon: string;
      accentBg: string;
      borderColor: string;
      textColor: string;
      stateName: string;
    }
  > = {
    en: {
      badge: 'A',
      icon: '🌐',
      accentBg: '#FBEEE8',
      borderColor: '#E8DED2',
      textColor: '#C2542D',
      stateName: 'English (Pan-India / General)',
    },
    hi: {
      badge: 'अ',
      icon: '🇮🇳',
      accentBg: '#FDF5EA',
      borderColor: '#E8DED2',
      textColor: '#D9822B',
      stateName: 'हिन्दी (Hindi / उत्तर व मध्य भारत)',
    },
    kn: {
      badge: 'ಅ',
      icon: '🏛️',
      accentBg: '#EEF6F2',
      borderColor: '#E8DED2',
      textColor: '#1E4D38',
      stateName: 'ಕನ್ನಡ (Kannada / ಕರ್ನಾಟಕ)',
    },
    ta: {
      badge: 'அ',
      icon: '🪔',
      accentBg: '#FDF1EC',
      borderColor: '#E8DED2',
      textColor: '#A13D19',
      stateName: 'தமிழ் (Tamil / தமிழ்நாடு)',
    },
    te: {
      badge: 'అ',
      icon: '🌾',
      accentBg: '#F5F0EB',
      borderColor: '#E8DED2',
      textColor: '#7C3E1D',
      stateName: 'తెలుగు (Telugu / ఆంధ్రప్రదేశ్ & తెలంగాణ)',
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] shadow-xl p-6 sm:p-10 my-6 animate-fadeIn">
        {/* App Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C2542D] text-white shadow-md mb-4 ring-4 ring-[#FBEEE8]">
            <HeartHandshake className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-heritage text-[#3D2B1F] tracking-tight mb-2">
            Skill<span className="text-[#C2542D]">Setu</span>
          </h1>

          <p className="text-xs sm:text-sm font-serif italic text-[#D49B24] mb-4">
            Empowering Skills, Enriching Lives • गाँव और शहर का हुनर सेतु
          </p>

          <div className="h-px w-24 bg-[#EADBCE] mx-auto mb-6"></div>

          {/* Multilingual Heading as requested */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D2B1F] leading-snug mb-2 font-heritage">
            Choose your language / अपनी भाषा चुनें / ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ
          </h2>
          <p className="text-sm sm:text-base text-[#6B5749]">
            உங்கள் மொழியைத் தேர்ந்தெடுக்கவும் • మీ భాషను ఎంచుకోండి
          </p>
        </div>

        {/* LARGE LANGUAGE BUTTONS GRID */}
        <div className="space-y-3.5 sm:space-y-4">
          {LANGUAGE_OPTIONS.map((lang) => {
            const deco = languageDecorations[lang.id];
            const isSelected = currentLanguage === lang.id;

            return (
              <button
                key={lang.id}
                id={`lang-btn-${lang.id}`}
                onClick={() => onSelectLanguage(lang.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between group active:scale-[0.99] shadow-xs hover:shadow-md cursor-pointer ${
                  isSelected
                    ? 'border-[#C2542D] bg-[#FBEEE8] ring-2 ring-[#C2542D]/30'
                    : 'border-[#EADBCE] bg-[#FFFDF9] hover:border-[#C2542D] hover:bg-[#FAF5EB]'
                }`}
              >
                {/* Left: Native Script Letter & Names */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: deco.accentBg, color: deco.textColor }}
                  >
                    {deco.badge}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{deco.icon}</span>
                      <span className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F]">
                        {lang.nativeName}
                      </span>
                      {lang.id !== 'en' && (
                        <span className="text-sm font-semibold text-[#8C7E74]">
                          ({lang.name})
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#6B5749] font-medium mt-0.5">
                      {deco.stateName} • <span className="font-semibold text-[#C2542D]">{lang.greeting}!</span>
                    </p>
                  </div>
                </div>

                {/* Right: Select indicator */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF5EB] text-[#5C4433] border border-[#EADBCE] group-hover:border-[#C2542D] group-hover:text-[#C2542D] transition-colors">
                    {lang.greeting}
                  </span>
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#C2542D] text-white'
                        : 'bg-[#FAF5EB] text-[#8C7E74] group-hover:bg-[#C2542D] group-hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Hint for First-Time Users */}
        <div className="mt-8 pt-6 border-t border-[#EADBCE] text-center">
          <p className="text-xs sm:text-sm text-[#6B5749] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D49B24]" />
            <span>You can change your language anytime from the top bar • आप ऊपर दिए बटन से कभी भी भाषा बदल सकते हैं</span>
          </p>
        </div>
      </div>
    </div>
  );
};
