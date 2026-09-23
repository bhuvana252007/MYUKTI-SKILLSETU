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
  Languages
} from 'lucide-react';

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
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.buyerSearch.searchPlaceholder}
                className="w-full px-4 py-3 pr-9 rounded-xl border border-[#D8C7B5] focus:border-[#1E4D38] focus:ring-2 focus:ring-[#EEF6F2] text-sm sm:text-base text-[#3D2B1F] bg-[#FFFDF9] outline-none transition-all placeholder:text-[#9F9185]"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-[#8C7E74] hover:text-[#3D2B1F] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="absolute right-3 top-3.5 w-4 h-4 text-[#8C7E74]" />
              )}
            </div>
          </div>
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

      {/* LISTINGS GRID */}
      {filteredListings.length > 0 ? (
        <div 
          id="buyer-listings-grid" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredListings.map((seller) => (
            <div
              key={seller.id}
              id={`seller-card-${seller.id}`}
              onClick={() => onSelectListing(seller)}
              className="group bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EADBCE] hover:border-[#1E4D38] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              {/* Card Top: Photo, Badge, Category */}
              <div>
                <div className="relative h-56 w-full bg-[#EFE4D3] overflow-hidden">
                  <img
                    src={seller.photo}
                    alt={seller.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* SHG Verified Badge with Checkmark icon */}
                  {seller.isShgVerified && (
                    <div className="absolute top-3 left-3 bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-4 h-4 fill-[#1E4D38] text-white" />
                      <span>{t.shgBadge}</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute bottom-3 right-3 bg-[#3D2B1F]/90 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                    {getCategoryIcon(seller.category)}
                    <span>{t.categories[seller.category]?.title || seller.category}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Name and Price */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F] group-hover:text-[#1E4D38] transition-colors leading-snug">
                      {seller.name}
                    </h2>
                    <span className="text-base sm:text-lg font-extrabold text-[#C2542D] shrink-0">
                      {seller.price}
                    </span>
                  </div>

                  {/* Location with Icon */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B5749] mb-3 font-medium">
                    <MapPin className="w-4 h-4 text-[#C2542D] shrink-0" />
                    <span className="truncate">{seller.location}</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-[#5C4433] line-clamp-3 leading-relaxed mb-4">
                    {seller.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: View Details & Contact CTA */}
              <div className="p-5 pt-0 mt-auto border-t border-[#EADBCE] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E4D38] group-hover:underline">
                  {t.buyerSearch.viewProfileBtn} &rarr;
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FAF5EB] text-[#5C4433] group-hover:bg-[#1E4D38] group-hover:text-white transition-colors border border-[#EADBCE]/60">
                  {t.sellerProfile.contactBtn}
                </span>
              </div>
            </div>
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
