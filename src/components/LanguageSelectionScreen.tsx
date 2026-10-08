import React from 'react';
import { SupportedLanguage } from '../types';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../translations';
import { Globe, ArrowRight, Sparkles, Check } from 'lucide-react';

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
      stateName: 'Pan-India',
    },
    hi: {
      badge: 'अ',
      icon: '🇮🇳',
      accentBg: '#FDF5EA',
      borderColor: '#E8DED2',
      textColor: '#D9822B',
      stateName: 'उत्तर व मध्य भारत',
    },
    kn: {
      badge: 'ಅ',
      icon: '🏛️',
      accentBg: '#EEF6F2',
      borderColor: '#E8DED2',
      textColor: '#1E4D38',
      stateName: 'ಕರ್ನಾಟಕ',
    },
    ta: {
      badge: 'அ',
      icon: '🪔',
      accentBg: '#FDF1EC',
      borderColor: '#E8DED2',
      textColor: '#A13D19',
      stateName: 'தமிழ்நாடு',
    },
    te: {
      badge: 'అ',
      icon: '🌾',
      accentBg: '#F5F0EB',
      borderColor: '#E8DED2',
      textColor: '#7C3E1D',
      stateName: 'ఆంధ్రప్రదేశ్ & తెలంగాణ',
    },
  };

  const screenTexts: Record<
    SupportedLanguage,
    { heading: string; subheading: string; footerHint: string }
  > = {
    en: {
      heading: 'Choose Your Language',
      subheading: 'Select the language you are most comfortable using',
      footerHint: 'You can change your language anytime from the top bar',
    },
    hi: {
      heading: 'अपनी भाषा चुनें',
      subheading: 'जिस भाषा में आप सबसे सहज महसूस करें उसे चुनें',
      footerHint: 'आप ऊपर दिए गए बटन से कभी भी भाषा बदल सकते हैं',
    },
    kn: {
      heading: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
      subheading: 'ನಿಮಗೆ ಸುಲಭವಾದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      footerHint: 'ನೀವು ಮೇಲಿನ ಬಟನ್ ಬಳಸಿ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು',
    },
    ta: {
      heading: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
      subheading: 'உங்களுக்கு வசதியான மொழியைத் தேர்வுசெய்யவும்',
      footerHint: 'மேலே உள்ள பொத்தானைப் பயன்படுத்தி எப்போது வேண்டுமானாலும் மொழியை மாற்றலாம்',
    },
    te: {
      heading: 'మీ భాషను ఎంచుకోండి',
      subheading: 'మీకు అనుకూలమైన భాషను ఎంచుకోండి',
      footerHint: 'మీరు పై బటన్ నుండి ఎప్పుడైనా భాషను మార్చవచ్చు',
    },
  };

  const texts = screenTexts[currentLanguage] || screenTexts.en;

  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] shadow-xl p-6 sm:p-10 my-6 animate-fadeIn">
        {/* App Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-md mb-4 ring-4 ring-[#FBEEE8] bg-[#FAF5EB] border border-[#C2542D]/20">
            <img 
              src="/app-logo.png" 
              alt="SkillSetu Logo" 
              className="w-full h-full object-contain" 
            />
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-heritage text-[#3D2B1F] tracking-tight mb-2">
            Skill<span className="text-[#C2542D]">Setu</span>
          </h1>

          <p className="text-xs sm:text-sm font-serif not-italic text-[#C2542D] font-semibold mb-4 tracking-wide">
            {TRANSLATIONS[currentLanguage]?.appTagline || TRANSLATIONS.en.appTagline}
          </p>

          <div className="h-px w-24 bg-[#EADBCE] mx-auto mb-6"></div>

          {/* Localized Heading in selected language only */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D2B1F] leading-snug mb-2 font-heritage">
            {texts.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#6B5749]">
            {texts.subheading}
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
                    </div>
                    <p className="text-xs sm:text-sm text-[#6B5749] font-medium mt-0.5">
                      {deco.stateName}
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
            <span>{texts.footerHint}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
