import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PageView, SkillCategory, SellerListing, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../translations';
import { BotanicalCorner, BotanicalDivider } from './BotanicalAccents';
import heroIllustration from '../assets/images/indian_women_folk_art_hero_1788506998271.jpg';
import { SellerCard3D } from './SellerCard3D';
import { 
  Scissors, 
  UtensilsCrossed, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  CheckCircle,
  Users,
  Mic,
  Building2
} from 'lucide-react';

interface HomePageProps {
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  onSelectCategory: (category: SkillCategory) => void;
  onSelectListing: (listing: SellerListing) => void;
  featuredListings: SellerListing[];
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  onNavigate,
  onSelectCategory,
  onSelectListing,
  featuredListings,
}) => {
  const t = TRANSLATIONS[language];

  // 3D Parallax & Tilt for Hero Section
  const heroRef = useRef<HTMLElement>(null);
  const [heroTilt, setHeroTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    // Normalized tilt (-1 to +1)
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setHeroTilt({
      x: Number(nx.toFixed(3)),
      y: Number(ny.toFixed(3)),
    });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setHeroTilt({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY < 1000) {
            setScrollY(window.scrollY);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCategoryIcon = (cat: SkillCategory) => {
    switch (cat) {
      case 'Tailoring':
        return <Scissors className="w-3.5 h-3.5 text-[#C2542D]" />;
      case 'Cooking':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-[#D49B24]" />;
      case 'Tutoring':
        return <GraduationCap className="w-3.5 h-3.5 text-[#1E4D38]" />;
      case 'Mehendi':
        return <Sparkles className="w-3.5 h-3.5 text-[#A13D19]" />;
      default:
        return <Scissors className="w-3.5 h-3.5 text-[#C2542D]" />;
    }
  };

  const categoryConfigs: {
    category: SkillCategory;
    icon: React.ElementType;
    color: string;
    bg: string;
    borderColor: string;
  }[] = [
    {
      category: 'Tailoring',
      icon: Scissors,
      color: '#C2542D',
      bg: '#FBEEE8',
      borderColor: '#F3D2C4',
    },
    {
      category: 'Cooking',
      icon: UtensilsCrossed,
      color: '#D49B24',
      bg: '#FDF6E8',
      borderColor: '#F6E4BA',
    },
    {
      category: 'Tutoring',
      icon: GraduationCap,
      color: '#1E4D38',
      bg: '#EEF6F2',
      borderColor: '#C7E4D3',
    },
    {
      category: 'Mehendi',
      icon: Sparkles,
      color: '#A13D19',
      bg: '#FDF1EC',
      borderColor: '#F7CEBF',
    },
  ];

  return (
    <div className="w-full pb-20 bg-[#FAF5EB] text-[#2A221E]">
      {/* Heritage-Inspired Hero Section with Full-Width Illustration Background and 3D Parallax Tilt */}
      <section 
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#EADBCE] preserve-3d"
        style={{ perspective: '1200px' }}
      >
        {/* Full-Width Heritage Illustration Background Layer with 3D Depth Parallax */}
        <div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none hero-parallax-bg"
          style={{
            transform: `translate3d(${-heroTilt.x * 16}px, ${-heroTilt.y * 12 + scrollY * 0.22}px, -30px) scale(1.10)`,
            transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <img
            src={heroIllustration}
            alt="Indian heritage folk art illustration of women artisans"
            className="w-full h-full object-cover object-center"
          />
          {/* Semi-transparent cream overlay (45-50% opacity for optimal legibility) */}
          <div 
            className="absolute inset-0 bg-[#FAF5EB]/50 backdrop-blur-[1px]" 
            aria-hidden="true" 
          />
          {/* Subtle gradient framing for pristine contrast and smooth border transition */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[#FAF5EB]/50 via-transparent to-[#FAF5EB]/80" 
            aria-hidden="true" 
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center preserve-3d">
          {/* Trust Badge with Botanical Leaf Icon (Middle Parallax Layer) */}
          <div 
            className="hero-parallax-mid inline-block"
            style={{
              transform: `translate3d(${heroTilt.x * 7}px, ${heroTilt.y * 5 - scrollY * 0.04}px, 15px)`,
              transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs border border-[#C7E4D3] text-[#1E4D38] text-xs sm:text-sm font-bold mb-5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#1E4D38]" />
              <span>{t.home.heroBadge}</span>
            </div>
          </div>

          {/* Large Elegant Serif Heading & Tagline (Foreground Parallax Layer) */}
          <div
            className="hero-parallax-fore"
            style={{
              transform: `translate3d(${heroTilt.x * 12}px, ${heroTilt.y * 9 - scrollY * 0.08}px, 30px)`,
              transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            {/* SkillSetu Official App Logo Emblem */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-lg border-2 border-[#C2542D]/30 bg-[#FAF5EB] p-1 ring-4 ring-[#FBEEE8]">
                <img 
                  src="/app-logo.png" 
                  alt="SkillSetu Logo" 
                  className="w-full h-full object-contain rounded-2xl" 
                />
              </div>
            </div>

            <h1 className="font-heritage text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#2B1B12] mb-3 drop-shadow-sm">
              Skill<span className="text-[#C2542D]">Setu</span>
            </h1>

            {/* Tagline Below in Smaller Elegant Text (single occurrence, no quotation marks) */}
            <p 
              className="text-base sm:text-2xl lg:text-3xl text-[#3D2517] tracking-wide mb-6 drop-shadow-xs font-bold not-italic"
              style={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 'bold', fontStyle: 'normal' }}
            >
              {t.appTagline}
            </p>
          </div>

          {/* Decorative Botanical Divider & Skill Highlights (Mid Parallax Layer) */}
          <div
            className="hero-parallax-mid"
            style={{
              transform: `translate3d(${heroTilt.x * 9}px, ${heroTilt.y * 7 - scrollY * 0.05}px, 20px)`,
              transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            <BotanicalDivider className="mb-6 sm:mb-8" />

            {/* Four Traditional Women's Skills Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[#3D2B1F] text-xs sm:text-sm font-semibold border border-[#EADBCE] shadow-xs">
                <Scissors className="w-3.5 h-3.5 text-[#C2542D]" />
                <span>{t.categories.Tailoring?.title}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[#3D2B1F] text-xs sm:text-sm font-semibold border border-[#EADBCE] shadow-xs">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#D49B24]" />
                <span>{t.categories.Cooking?.title}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[#3D2B1F] text-xs sm:text-sm font-semibold border border-[#EADBCE] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C2542D]" />
                <span>{t.categories.Mehendi?.title}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs text-[#3D2B1F] text-xs sm:text-sm font-semibold border border-[#EADBCE] shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-[#1E4D38]" />
                <span>{t.categories.Tutoring?.title}</span>
              </span>
            </div>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-[#3D2517] font-medium max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-2xs">
              {t.home.heroSubtitle}
            </p>
          </div>

          {/* TWO CLEAR CALL-TO-ACTION BUTTONS (Terracotta & Gold Tones with 3D Depth) */}
          <div 
            className="hero-parallax-fore grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 preserve-3d"
            style={{
              transform: `translate3d(${heroTilt.x * 16}px, ${heroTilt.y * 11 - scrollY * 0.1}px, 40px)`,
              transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            {/* Button 1: I offer a service (Terracotta Tone) */}
            <button
              id="hero-offer-service-btn"
              onClick={() => onNavigate('seller-listing')}
              className="group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl bg-[#C2542D] hover:bg-[#A13D19] text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1.5 active:translate-y-0.5 active:scale-[0.98] border-2 border-[#A13D19] text-left cursor-pointer preserve-3d"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Scissors className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold font-heritage text-center text-white">
                {t.home.btnOffer}
              </span>
              <span className="text-xs sm:text-sm text-white/95 font-medium text-center mt-1">
                {t.home.btnOfferSub}
              </span>
              <span className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full text-white">
                {t.home.btnOfferAction} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Button 2: I need a service (Mustard Gold Tone) */}
            <button
              id="hero-need-service-btn"
              onClick={() => onNavigate('buyer-search')}
              className="group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl bg-[#D49B24] hover:bg-[#B57E12] text-[#24170F] shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1.5 active:translate-y-0.5 active:scale-[0.98] border-2 border-[#B57E12] text-left cursor-pointer preserve-3d"
            >
              <div className="w-14 h-14 rounded-full bg-[#24170F]/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-[#24170F]" />
              </div>
              <span className="text-xl sm:text-2xl font-bold font-heritage text-center text-[#24170F]">
                {t.home.btnNeed}
              </span>
              <span className="text-xs sm:text-sm text-[#24170F]/90 font-semibold text-center mt-1">
                {t.home.btnNeedSub}
              </span>
              <span className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[#24170F]/15 px-3.5 py-1 rounded-full text-[#24170F]">
                {t.home.btnNeedAction} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Quick Voice Assistant Callout */}
          <div 
            className="hero-parallax-mid inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3D2517] font-semibold bg-[#FFFDF9]/95 backdrop-blur-xs px-4 py-2 rounded-full border border-[#EADBCE] shadow-sm"
            style={{
              transform: `translate3d(${heroTilt.x * 6}px, ${heroTilt.y * 4 - scrollY * 0.03}px, 20px)`,
              transition: 'transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            <Mic className="w-4 h-4 text-[#C2542D]" />
            <span>{t.home.voiceTip}</span>
          </div>
        </div>
      </section>

      {/* Community Spotlight & Registration Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1E4D38] via-[#245C44] to-[#1E4D38] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border-2 border-[#163829]">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-[#DDA74F] text-[#3D2B1F] text-xs font-bold uppercase tracking-wider mb-2">
              For SHG Leaders & Village Collectives
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heritage text-white mb-2">
              Register Your Community on SkillSetu
            </h2>
            <p className="text-xs sm:text-sm text-[#E2EFE7] leading-relaxed">
              Bring your self-help group, cooperative, or women's collective onto the platform. Enroll members via 4-step wizard or CSV upload, generate verified trust badges, and track local transactions.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('community-wizard')}
              className="px-5 py-3.5 rounded-2xl bg-[#DDA74F] hover:bg-[#C9943E] text-[#2A1E17] font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Register Community</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('community-dashboard')}
              className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/30 backdrop-blur-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Community Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C2542D] mb-1">
              <span>Heritage Livelihoods</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heritage text-[#3D2B1F]">
              {t.home.categoriesTitle}
            </h2>
            <p className="text-base text-[#6B5749] mt-1">
              {t.home.categoriesSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('buyer-search')}
            className="mt-3 sm:mt-0 text-[#C2542D] font-bold text-base hover:text-[#A13D19] inline-flex items-center gap-1 cursor-pointer"
          >
            {t.home.viewAllCategories} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryConfigs.map((item) => {
            const Icon = item.icon;
            const categoryData = t.categories[item.category];
            return (
              <button
                key={item.category}
                onClick={() => {
                  onSelectCategory(item.category);
                  onNavigate('buyer-search');
                }}
                className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] text-left hover:border-[#C2542D] hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-[#3D2B1F] mb-1">
                    {categoryData?.title || item.category}
                  </h3>
                  <p className="text-xs font-bold text-[#D49B24] mb-2">
                    {categoryData?.subtitle || ''}
                  </p>
                  <p className="text-sm text-[#6B5749] leading-relaxed">
                    {categoryData?.desc || ''}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-[#F1E6D8] flex items-center justify-between text-xs font-bold text-[#C2542D]">
                  <span>{t.home.findInArea}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Verified Women Providers */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1E4D38] mb-1">
                <span>Verified Micro-Entrepreneurs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heritage text-[#3D2B1F]">
                {t.home.featuredTitle}
              </h2>
              <p className="text-base text-[#6B5749] mt-1">
                {t.home.featuredSubtitle}
              </p>
            </div>
            <button
              onClick={() => onNavigate('buyer-search')}
              className="text-sm sm:text-base font-bold text-[#1E4D38] hover:text-[#143526] inline-flex items-center gap-1 bg-[#EEF6F2] border border-[#C7E4D3] px-3.5 py-1.5 rounded-xl cursor-pointer"
            >
              {t.home.seeAll} ({featuredListings.length}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredListings.slice(0, 3).map((seller) => (
              <SellerCard3D
                key={seller.id}
                seller={seller}
                language={language}
                onSelect={onSelectListing}
                categoryIcon={getCategoryIcon(seller.category)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Simple 3-Step Guide with Heritage Framing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border-2 border-[#EADBCE] shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <BotanicalDivider className="mb-4" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heritage text-[#3D2B1F]">
              {t.home.howItWorksTitle}
            </h2>
            <p className="text-base text-[#6B5749] mt-1">
              {t.home.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Terracotta Accent */}
            <div className="bg-[#FAF5EB] rounded-2xl p-6 border border-[#EADBCE] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FBEEE8] text-[#C2542D] border border-[#F3D2C4] font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-lg font-bold font-display text-[#3D2B1F] mb-2">
                {t.home.step1Title}
              </h3>
              <p className="text-sm text-[#5C4433] leading-relaxed">
                {t.home.step1Desc}
              </p>
            </div>

            {/* Step 2: Forest Green Accent */}
            <div className="bg-[#FAF5EB] rounded-2xl p-6 border border-[#EADBCE] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-lg font-bold font-display text-[#3D2B1F] mb-2">
                {t.home.step2Title}
              </h3>
              <p className="text-sm text-[#5C4433] leading-relaxed">
                {t.home.step2Desc}
              </p>
            </div>

            {/* Step 3: Mustard Gold Accent */}
            <div className="bg-[#FAF5EB] rounded-2xl p-6 border border-[#EADBCE] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FDF6E8] text-[#D49B24] border border-[#F6E4BA] font-bold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-lg font-bold font-display text-[#3D2B1F] mb-2">
                {t.home.step3Title}
              </h3>
              <p className="text-sm text-[#5C4433] leading-relaxed">
                {t.home.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
