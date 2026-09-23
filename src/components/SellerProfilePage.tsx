import React, { useState, useEffect } from 'react';
import { PageView, SellerListing, SupportedLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../translations';
import { getTranslatedListing } from '../utils/translationService';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Award, 
  Share2, 
  Sparkles,
  Scissors,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Languages,
  Loader2
} from 'lucide-react';
import { ContactModal } from './ContactModal';
import { QuickCallModal } from './QuickCallModal';

interface SellerProfilePageProps {
  seller: SellerListing;
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
}

export const SellerProfilePage: React.FC<SellerProfilePageProps> = ({
  seller,
  language,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const langConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isQuickCallOpen, setIsQuickCallOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Dynamic Translation of Seller Profile based on Buyer's selected language
  const [displaySeller, setDisplaySeller] = useState<SellerListing>(seller);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (language === 'en') {
      setDisplaySeller({
        ...seller,
        name: seller.englishBase?.name || seller.name,
        location: seller.englishBase?.location || seller.location,
        description: seller.englishBase?.description || seller.description,
      });
      return;
    }

    // Check pre-stored translations
    const existing = seller.translations?.[language];
    if (existing) {
      setDisplaySeller({
        ...seller,
        name: existing.name,
        location: existing.location,
        description: existing.description,
      });
      return;
    }

    // Translate dynamically using Gemini API
    setIsTranslating(true);
    getTranslatedListing(seller, language)
      .then((res) => {
        if (isMounted) {
          setDisplaySeller(res);
          setIsTranslating(false);
        }
      })
      .catch((err) => {
        console.warn('Error translating seller profile:', err);
        if (isMounted) setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [seller, language]);

  const activeName = showOriginal ? (seller.originalText?.name || seller.name) : displaySeller.name;
  const activeLocation = showOriginal ? (seller.originalText?.location || seller.location) : displaySeller.location;
  const activeDescription = showOriginal ? (seller.originalText?.description || seller.description) : displaySeller.description;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tailoring':
        return <Scissors className="w-5 h-5" />;
      case 'Cooking':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'Tutoring':
        return <GraduationCap className="w-5 h-5" />;
      case 'Mehendi':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${activeName} - ${seller.category} on SkillSetu`,
        text: `Connect with ${activeName} for ${seller.category} services in ${activeLocation} on SkillSetu!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28">
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          id="profile-back-search-btn"
          onClick={() => onNavigate('buyer-search')}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#6B5749] hover:text-[#3D2B1F] px-3.5 py-2 rounded-xl hover:bg-[#EFE4D3] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.sellerProfile.backToSearch}</span>
        </button>

        <button
          id="profile-share-btn"
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B5749] hover:text-[#3D2B1F] bg-[#FFFDF9] border border-[#EADBCE] px-3.5 py-2 rounded-xl hover:bg-[#FAF5EB] transition-colors shadow-2xs cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#C2542D]" />
          <span>{copiedLink ? t.sellerProfile.linkCopied : t.sellerProfile.shareProfile}</span>
        </button>
      </div>

      {/* Translation & Multilingual Bar */}
      {language !== 'en' && (
        <div className="mb-4 p-3 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#3D2B1F]">
            {isTranslating ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C2542D]" />
            ) : (
              <Languages className="w-4 h-4 text-[#1E4D38]" />
            )}
            <span>
              {isTranslating
                ? `Translating profile to ${langConfig.nativeName}...`
                : `Translated to ${langConfig.nativeName} from English base (Gemini AI)`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="font-bold text-[#C2542D] hover:underline cursor-pointer"
          >
            {showOriginal ? `Show ${langConfig.nativeName} Translation` : 'View Original Language'}
          </button>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] overflow-hidden shadow-sm">
        {/* LARGE PHOTO BANNER */}
        <div className="relative w-full h-72 sm:h-96 bg-[#EFE4D3]">
          <img
            src={seller.photo}
            alt={activeName}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Floating Badges over Photo */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {seller.isShgVerified && (
              <div 
                id="profile-shg-badge"
                className="bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm backdrop-blur-xs"
              >
                <CheckCircle className="w-4 h-4 fill-[#1E4D38] text-white" />
                <span>{t.sellerProfile.shgVerifiedMember}</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C2542D] text-white text-xs sm:text-sm font-bold mb-2 shadow-xs">
                {getCategoryIcon(seller.category)}
                <span>{t.categories[seller.category]?.title || seller.category}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-heritage text-white drop-shadow-sm">
                {activeName}
              </h1>
            </div>

            <div className="bg-[#FFFDF9]/95 text-[#3D2B1F] px-4 py-2 rounded-xl backdrop-blur-xs shadow-sm text-right border border-[#EADBCE]">
              <span className="block text-[11px] font-bold text-[#6B5749] uppercase">{t.sellerProfile.priceRates}</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#C2542D]">
                {seller.price}
              </span>
            </div>
          </div>
        </div>

        {/* PROFILE DETAILS CONTENT */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Key Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE]">
            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FBEEE8] text-[#C2542D] flex items-center justify-center shrink-0 border border-[#F3D2C4]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#6B5749] uppercase">{t.sellerProfile.locationLabel}</span>
                <span className="text-sm font-semibold text-[#3D2B1F]">{activeLocation}</span>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF6F2] text-[#1E4D38] flex items-center justify-center shrink-0 border border-[#C7E4D3]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#6B5749] uppercase">{t.sellerProfile.experienceLabel}</span>
                <span className="text-sm font-semibold text-[#3D2B1F]">
                  {seller.experienceYears ? `${seller.experienceYears}+ ${t.sellerProfile.yearsPracticalSkill}` : t.sellerProfile.experiencedArtisan}
                </span>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDF5EA] text-[#D49B24] flex items-center justify-center shrink-0 border border-[#F2E0BA]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#6B5749] uppercase">{t.sellerProfile.availabilityLabel}</span>
                <span className="text-sm font-semibold text-[#3D2B1F]">
                  {seller.availableDays || 'Mon - Sat (Call to confirm)'}
                </span>
              </div>
            </div>
          </div>

          {/* SHG Verification Explainer Box */}
          {seller.isShgVerified && (
            <div className="p-5 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-7 h-7 text-[#1E4D38] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-bold text-[#1E4D38]">
                    {t.sellerProfile.shgBoxTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#385B49] mt-0.5 leading-relaxed">
                    {t.sellerProfile.shgBoxDesc(seller.shgGroupName)}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-[#1E4D38] text-white shadow-2xs">
                {t.sellerProfile.trusted100}
              </span>
            </div>
          )}

          {/* Full Description Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F] mb-3">
              {t.sellerProfile.aboutTitle}
            </h2>
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF5EB] border border-[#EADBCE]">
              <p className="text-base sm:text-lg text-[#3D2B1F] leading-relaxed whitespace-pre-line">
                {activeDescription}
              </p>
            </div>
          </div>

          {/* Service Highlights / Tags */}
          <div>
            <h2 className="text-sm font-bold text-[#6B5749] uppercase tracking-wider mb-3">
              {t.sellerProfile.highlightsTitle}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3.5 py-1.5 rounded-xl bg-[#FBEEE8] text-[#C2542D] text-sm font-semibold border border-[#F3D2C4]">
                ✓ {t.sellerProfile.hlDirectDelivery}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#EEF6F2] text-[#1E4D38] text-sm font-semibold border border-[#C7E4D3]">
                ✓ {t.sellerProfile.hlFairPricing}: {seller.price}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#FDF5EA] text-[#D49B24] text-sm font-semibold border border-[#F2E0BA]">
                ✓ {t.sellerProfile.hlNoCommission}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF5EB] text-[#6B5749] text-sm font-semibold border border-[#EADBCE]">
                ✓ {t.sellerProfile.hlDirectPay}
              </span>
            </div>
          </div>

          {/* Contact Seller Button at bottom of card */}
          <div className="pt-6 border-t border-[#EADBCE]">
            <button
              id="contact-seller-bottom-btn"
              onClick={() => setIsContactOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-[#1E4D38] hover:bg-[#143526] text-white font-bold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] border-2 border-[#143526] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{t.sellerProfile.contactSellerBtn}</span>
            </button>
            <p className="text-xs text-center text-[#6B5749] mt-2.5">
              {t.sellerProfile.contactSubtext}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar for Mobile View */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FAF5EB]/95 backdrop-blur-md border-t border-[#EADBCE] sm:hidden z-30 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="block text-[10px] uppercase font-bold text-[#6B5749]">{t.sellerProfile.priceRates}</span>
          <span className="text-base font-extrabold text-[#C2542D]">{seller.price}</span>
        </div>
        <button
          id="mobile-contact-bar-btn"
          onClick={() => setIsContactOpen(true)}
          className="px-6 py-3 rounded-xl bg-[#1E4D38] text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>{t.sellerProfile.contactSellerBtn}</span>
        </button>
      </div>

      {/* Floating Quick Call Action Button (Simulated Phone Call) */}
      <div className="fixed bottom-24 sm:bottom-8 right-5 sm:right-8 z-40">
        <button
          id="floating-quick-call-btn"
          type="button"
          onClick={() => setIsQuickCallOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#1E4D38] hover:bg-[#143526] text-white font-bold text-sm sm:text-base shadow-2xl hover:shadow-[#1E4D38]/30 transition-all duration-200 border-2 border-[#FAF5EB] active:scale-95 cursor-pointer ring-4 ring-[#1E4D38]/20"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D49B24] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D49B24]"></span>
          </span>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Phone className="w-4 h-4 animate-bounce text-white" />
          </div>

          <div className="text-left">
            <span className="block leading-tight font-heritage">
              {language === 'hi' ? 'तुरंत कॉल करें' : language === 'kn' ? 'ತ್ವರಿತ ಕರೆ' : language === 'ta' ? 'உடனடி அழைப்பு' : language === 'te' ? 'త్వరిత కాల్' : 'Quick Call'}
            </span>
            <span className="block text-[10px] font-normal text-[#C7E4D3] leading-none">
              {language === 'hi' ? 'सीधा संपर्क' : language === 'kn' ? 'ನೇರ ಸಂಪರ್ಕ' : 'Simulated Voice'}
            </span>
          </div>
        </button>
      </div>

      {/* Contact Modal */}
      <ContactModal
        seller={{
          ...displaySeller,
          name: activeName,
          location: activeLocation,
          description: activeDescription,
        }}
        language={language}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Simulated Quick Call Modal */}
      <QuickCallModal
        seller={{
          ...displaySeller,
          name: activeName,
          location: activeLocation,
          description: activeDescription,
        }}
        language={language}
        isOpen={isQuickCallOpen}
        onClose={() => setIsQuickCallOpen(false)}
        onOpenWhatsApp={() => setIsContactOpen(true)}
      />
    </div>
  );
};
