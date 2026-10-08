import React from 'react';
import { PageView, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../translations';
import { HeartHandshake, ShieldCheck, RefreshCw, Scissors, UtensilsCrossed, GraduationCap, Sparkles, Database } from 'lucide-react';

interface FooterProps {
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  onResetData: () => void;
  onOpenSupabaseModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate, onResetData, onOpenSupabaseModal }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-[#F5EAD9]/80 border-t border-[#EADBCE] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C2542D] text-white flex items-center justify-center shadow-xs border border-[#A13D19]/30">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold font-heritage text-[#3D2B1F]">
                Skill<span className="text-[#C2542D]">Setu</span>
              </span>
            </div>
            <p className="text-sm text-[#5C4433] max-w-sm leading-relaxed mb-4">
              {t.footer?.mission || t.footer?.aboutText || t.appTagline}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#1E4D38] font-semibold bg-[#EEF6F2] px-3 py-1 rounded-full border border-[#C7E4D3]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.footer?.shgSupport || t.footer?.shgSupportBadge || t.shgBadge}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#5C4433] uppercase tracking-wider mb-3">
              {t.footer?.exploreTitle || 'Explore'}
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-[#6B5749] hover:text-[#C2542D] transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('buyer-search')}
                  className="text-[#6B5749] hover:text-[#C2542D] transition-colors cursor-pointer"
                >
                  {t.nav.findServices}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('seller-listing')}
                  className="text-[#6B5749] hover:text-[#C2542D] transition-colors cursor-pointer"
                >
                  {t.nav.offerService}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-listings')}
                  className="text-[#6B5749] hover:text-[#C2542D] transition-colors cursor-pointer"
                >
                  {t.nav.myListings}
                </button>
              </li>
            </ul>
          </div>

          {/* Service Skills */}
          <div>
            <h4 className="text-xs font-bold text-[#5C4433] uppercase tracking-wider mb-3">
              {t.footer?.localSkillsTitle || 'Local Skills'}
            </h4>
            <ul className="space-y-2 text-sm text-[#6B5749]">
              <li className="flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#C2542D]" /> {t.categories.Tailoring?.title}
              </li>
              <li className="flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#D49B24]" /> {t.categories.Cooking?.title}
              </li>
              <li className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#1E4D38]" /> {t.categories.Tutoring?.title}
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A13D19]" /> {t.categories.Mehendi?.title}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6455]">
          <p>© {new Date().getFullYear()} SkillSetu. {t.taglineHero || 'Empowering Skills, Enriching Lives'}</p>
          <div className="flex items-center gap-4">
            {onOpenSupabaseModal && (
              <button
                onClick={onOpenSupabaseModal}
                className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold hover:text-emerald-950 transition-colors cursor-pointer"
                title="Supabase Database Status & Schema Setup"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase DB (hoeusmefmobavdxphyyl)</span>
              </button>
            )}
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1 text-[#7A6455] hover:text-[#C2542D] transition-colors cursor-pointer"
              title="Reset listings to original sample providers"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.footer?.resetData || t.footer?.resetDataBtn || 'Reset Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
