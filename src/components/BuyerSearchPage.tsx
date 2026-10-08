import React, { useState, useMemo, useEffect } from 'react';
import { PageView, SkillCategory, SellerListing, SupportedLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../translations';
import { getTranslatedListing } from '../utils/translationService';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  CheckCircle, 
  Filter, 
  X, 
  PlusCircle,
  Scissors,
  UtensilsCrossed,
  GraduationCap,
  Sparkles,
  Briefcase,
  Loader2,
  Languages,
  Mic,
  MicOff
} from 'lucide-react';
import { MicAudioRecorder, transcribeAudioWithGemini } from '../utils/audioUtils';
import { SellerCard3D } from './SellerCard3D';

interface BuyerSearchPageProps {
  language: SupportedLanguage;
  listings: SellerListing[];
  onNavigate: (page: PageView) => void;
  onSelectListing: (listing: SellerListing) => void;
  initialCategory?: SkillCategory | 'All';
}

export const BuyerSearchPage: React.FC<BuyerSearchPageProps> = ({
  language,
  listings,
  onNavigate,
  onSelectListing,
  initialCategory = 'All',
}) => {
  const t = TRANSLATIONS[language];
  const langConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Voice Search via gemini-3.5-transcribe
  const [isRecordingVoiceSearch, setIsRecordingVoiceSearch] = useState(false);
  const [isTranscribingSearch, setIsTranscribingSearch] = useState(false);
  const searchRecorderRef = React.useRef<MicAudioRecorder | null>(null);

  const handleToggleVoiceSearch = async () => {
    if (isRecordingVoiceSearch) {
      setIsRecordingVoiceSearch(false);
      setIsTranscribingSearch(true);
      try {
        if (!searchRecorderRef.current) return;
        const { base64, mimeType } = await searchRecorderRef.current.stop();
        const text = await transcribeAudioWithGemini(
          base64,
          mimeType,
          'Transcribe this short search query spoken in Hindi, Kannada, Tamil, Telugu, or English.'
        );
        if (text.trim()) {
          setSearchQuery(text.trim());
        }
      } catch (err: any) {
        console.error('Voice search transcription error:', err);
      } finally {
        setIsTranscribingSearch(false);
        searchRecorderRef.current = null;
      }
    } else {
      try {
        const rec = new MicAudioRecorder();
        await rec.start();
        searchRecorderRef.current = rec;
        setIsRecordingVoiceSearch(true);
      } catch (err: any) {
        console.error('Mic access failed:', err);
        alert(err?.message || 'Please connect a microphone or allow microphone permissions.');
      }
    }
  };

  // Translations State for Listings
  const [displayListings, setDisplayListings] = useState<SellerListing[]>(listings);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const translateListings = async () => {
      if (language === 'en') {
        setDisplayListings(
          listings.map((l) => ({
            ...l,
            name: l.englishBase?.name || l.name,
            location: l.englishBase?.location || l.location,
            description: l.englishBase?.description || l.description,
          }))
        );
        return;
      }

      // Fast initial pass with pre-stored translations
      const fastList = listings.map((l) => {
        const trans = l.translations?.[language];
        if (trans) {
          return {
            ...l,
            name: trans.name,
            location: trans.location,
            description: trans.description,
          };
        }
        return l;
      });
      setDisplayListings(fastList);

      // Check if any listing lacks this language translation
      const missing = listings.some((l) => !l.translations?.[language]);
      if (missing) {
        setIsTranslating(true);
        try {
          const fullyTranslated = await Promise.all(
            listings.map((l) => getTranslatedListing(l, language))
          );
          if (!isCancelled) {
            setDisplayListings(fullyTranslated);
          }
        } catch (err) {
          console.warn('Listing translation error:', err);
        } finally {
          if (!isCancelled) setIsTranslating(false);
        }
      }
    };

    translateListings();

    return () => {
      isCancelled = true;
    };
  }, [listings, language]);

  // Extract unique locations from current display listings
  const uniqueLocations = useMemo(() => {
    const locSet = new Set<string>();
    displayListings.forEach((item) => {
      if (item.location) {
        const parts = item.location.split(',');
        const primary = parts[0]?.trim() || item.location;
        locSet.add(primary);
      }
    });
    return Array.from(locSet).sort();
  }, [displayListings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    return displayListings.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Location filter
      if (selectedLocation !== 'All') {
        const matchesLocation = item.location
          .toLowerCase()
          .includes(selectedLocation.toLowerCase());
        if (!matchesLocation) return false;
      }
      // Search text query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesLoc && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [displayListings, selectedCategory, selectedLocation, searchQuery]);

  const getCategoryIcon = (cat: SkillCategory) => {
    switch (cat) {
      case 'Tailoring':
        return <Scissors className="w-4 h-4" />;
      case 'Cooking':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'Tutoring':
        return <GraduationCap className="w-4 h-4" />;
      case 'Mehendi':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Top Breadcrumb / Navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          id="buyer-back-home-btn"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#6B5749] hover:text-[#3D2B1F] px-3.5 py-1.5 rounded-xl hover:bg-[#EFE4D3] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.buyerSearch.backToHome}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Translation Status Badge */}
          {language !== 'en' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#EADBCE] text-xs font-semibold text-[#6B5749]">
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C2542D]" />
                  <span>Translating listings to {langConfig.nativeName}...</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5 text-[#1E4D38]" />
                  <span>Translated into {langConfig.nativeName} (via Gemini)</span>
                </>
              )}
            </div>
          )}

          <button
            id="buyer-add-service-btn"
            onClick={() => onNavigate('seller-listing')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2542D] hover:text-[#A13D19] bg-[#FBEEE8] hover:bg-[#F8E2D7] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#F3D2C4]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.buyerSearch.offerOwnService}</span>
          </button>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-[#3D2B1F] tracking-tight">
          {t.buyerSearch.title}
        </h1>
        <p className="text-base text-[#6B5749] mt-2 max-w-2xl">
          {t.buyerSearch.subtitle}
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-6 border-2 border-[#EADBCE] shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Category Dropdown */}
          <div className="lg:col-span-4">
            <label htmlFor="filter-category" className="block text-xs font-bold text-[#6B5749] uppercase tracking-wider mb-1.5">
              {t.buyerSearch.categoryFilterLabel}
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-[#D8C7B5] focus:border-[#1E4D38] focus:ring-2 focus:ring-[#EEF6F2] text-sm sm:text-base font-medium text-[#3D2B1F] bg-[#FFFDF9] outline-none transition-all cursor-pointer"
            >
              <option value="All">{t.buyerSearch.allCategories}</option>
              <option value="Tailoring">{t.categories.Tailoring?.title}</option>
              <option value="Cooking">{t.categories.Cooking?.title}</option>
              <option value="Tutoring">{t.categories.Tutoring?.title}</option>
              <option value="Mehendi">{t.categories.Mehendi?.title}</option>
              <option value="Other">{t.categories.Other?.title}</option>
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="lg:col-span-4">
            <label htmlFor="filter-location" className="block text-xs font-bold text-[#6B5749] uppercase tracking-wider mb-1.5">
              {t.buyerSearch.locationFilterLabel}
            </label>
            <select
              id="filter-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-[#D8C7B5] focus:border-[#1E4D38] focus:ring-2 focus:ring-[#EEF6F2] text-sm sm:text-base font-medium text-[#3D2B1F] bg-[#FFFDF9] outline-none transition-all cursor-pointer"
            >
              <option value="All">{t.buyerSearch.allAreas}</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Free Text Search */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label htmlFor="search-input" className="block text-xs font-bold text-[#6B5749] uppercase tracking-wider mb-1.5">
              {t.buyerSearch.searchKeywordLabel}
            </label>
            <div className="relative flex items-center">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isRecordingVoiceSearch
                    ? 'Listening... speak now'
                    : isTranscribingSearch
                    ? 'Transcribing search...'
                    : t.buyerSearch.searchPlaceholder
                }
                className="w-full px-4 py-3 pr-20 rounded-xl border border-[#D8C7B5] focus:border-[#1E4D38] focus:ring-2 focus:ring-[#EEF6F2] text-sm sm:text-base text-[#3D2B1F] bg-[#FFFDF9] outline-none transition-all placeholder:text-[#9F9185]"
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#8C7E74] hover:text-[#3D2B1F] cursor-pointer p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <Search className="w-4 h-4 text-[#8C7E74]" />
                )}

                {/* Voice search button via gemini-3.5-transcribe */}
                <button
                  type="button"
                  onClick={handleToggleVoiceSearch}
                  disabled={isTranscribingSearch}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isRecordingVoiceSearch
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'hover:bg-stone-100 text-[#1E4D38]'
                  }`}
                  title="Voice search using gemini-3.5-transcribe"
                >
                  {isRecordingVoiceSearch ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Exploration Banner */}
        <div className="mt-4 pt-3 border-t border-[#EADBCE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF5EB] p-3.5 rounded-2xl">
          <div className="flex items-center gap-2.5 text-xs text-[#3D2B1F]">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Need tailoring materials, packaging supplies, or training centers?</p>
              <p className="text-[#6B5749]">Find real-world places nearby using Google Maps Grounding with Gemini 3.5 Flash.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('assistant')}
            className="px-3.5 py-1.5 rounded-xl bg-[#1E4D38] hover:bg-[#163829] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DDA74F]" />
            <span>Search Nearby Places</span>
          </button>
        </div>

        {/* Active Filter summary & clear */}
        {(selectedCategory !== 'All' || selectedLocation !== 'All' || searchQuery) && (
          <div className="mt-3 pt-3 border-t border-[#EADBCE] flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#6B5749]">
              <Filter className="w-3.5 h-3.5 text-[#D49B24]" />
              <span>
                {t.buyerSearch.showing} <strong className="text-[#3D2B1F]">{filteredListings.length}</strong> {t.buyerSearch.matchingResults}
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="text-[#C2542D] hover:text-[#A13D19] font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              {t.buyerSearch.resetFilters} <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* LISTINGS GRID WITH 3D CARD EFFECTS */}
      {filteredListings.length > 0 ? (
        <div 
          id="buyer-listings-grid" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredListings.map((seller) => (
            <SellerCard3D
              key={seller.id}
              seller={seller}
              language={language}
              onSelect={onSelectListing}
              categoryIcon={getCategoryIcon(seller.category)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FFFDF9] rounded-3xl p-10 sm:p-14 text-center border-2 border-[#EADBCE] max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-[#FBEEE8] text-[#C2542D] flex items-center justify-center mx-auto mb-4 border border-[#F3D2C4]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heritage text-[#3D2B1F] mb-2">
            {t.buyerSearch.noResultsTitle}
          </h3>
          <p className="text-sm text-[#6A5D54] mb-6">
            {t.buyerSearch.noResultsDesc}
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-[#1E4D38] text-white font-bold text-sm hover:bg-[#143526] transition-colors cursor-pointer"
          >
            {t.buyerSearch.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
