/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView, SkillCategory, SellerListing, SupportedLanguage } from './types';
import { 
  getStoredListings, 
  saveNewListing, 
  updateListing, 
  deleteListing, 
  resetToSeedListings,
  syncListingsWithSupabase 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { SellerListingPage } from './components/SellerListingPage';
import { BuyerSearchPage } from './components/BuyerSearchPage';
import { SellerProfilePage } from './components/SellerProfilePage';
import { MyListingsPage } from './components/MyListingsPage';
import { LanguageSelectionScreen } from './components/LanguageSelectionScreen';
import { GeminiChatAssistant } from './components/GeminiChatAssistant';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';
import { Sparkles, Radio } from 'lucide-react';

const PREFERRED_LANG_KEY = 'skillsetu_preferred_lang';

export default function App() {
  // Check if user has already picked a language saved in localStorage
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(PREFERRED_LANG_KEY);
      if (saved && ['en', 'hi', 'kn', 'ta', 'te'].includes(saved)) {
        return saved as SupportedLanguage;
      }
    } catch (_) {}
    return 'hi'; // Default friendly vernacular start if not yet set
  });

  // If no language has been saved in localStorage yet, start on the Language Selection screen
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    try {
      const saved = localStorage.getItem(PREFERRED_LANG_KEY);
      if (saved && ['en', 'hi', 'kn', 'ta', 'te'].includes(saved)) {
        return 'home'; // Skip language selection screen on future loads if already saved
      }
    } catch (_) {}
    return 'language-select';
  });

  const [previousPage, setPreviousPage] = useState<PageView>('home');
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<SellerListing | null>(null);
  const [editingListing, setEditingListing] = useState<SellerListing | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  // Load listings on mount & sync with Supabase in background
  useEffect(() => {
    const loaded = getStoredListings();
    setListings(loaded);

    // Asynchronously fetch profiles from Supabase cloud database
    syncListingsWithSupabase()
      .then((res) => {
        if (res.success && res.listings && res.listings.length > 0) {
          setListings(res.listings);
        }
      })
      .catch((err) => {
        console.warn('Background Supabase sync info:', err);
      });
  }, []);

  // Scroll to top on page change
  const navigateTo = (page: PageView) => {
    if (currentPage !== 'language-select') {
      setPreviousPage(currentPage);
    }
    // If navigating to create listing normally, clear any existing editing state
    if (page === 'seller-listing' && currentPage !== 'my-listings') {
      setEditingListing(null);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLanguage = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(PREFERRED_LANG_KEY, newLang);
    } catch (_) {}

    // If coming from initial landing, go to home; otherwise go back to where the user was
    if (currentPage === 'language-select') {
      const target = previousPage === 'language-select' ? 'home' : previousPage;
      setCurrentPage(target);
    }
  };

  const handleSelectListing = (listing: SellerListing) => {
    setSelectedListing(listing);
    navigateTo('seller-profile');
  };

  const handleSelectCategory = (category: SkillCategory) => {
    setSelectedCategory(category);
    navigateTo('buyer-search');
  };

  const handleListingCreated = (newListing: SellerListing) => {
    const updated = saveNewListing(newListing);
    setListings(updated);
    setSelectedListing(newListing);
  };

  const handleListingUpdated = (updatedListing: SellerListing) => {
    const updated = updateListing(updatedListing);
    setListings(updated);
    setSelectedListing(updatedListing);
    setEditingListing(null);
  };

  const handleEditListing = (listing: SellerListing) => {
    setEditingListing(listing);
    setCurrentPage('seller-listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteListing = (listingId: string) => {
    const updated = deleteListing(listingId);
    setListings(updated);
    if (selectedListing?.id === listingId) {
      setSelectedListing(null);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all listings to default sample data?')) {
      const reset = resetToSeedListings();
      setListings(reset);
      if (selectedListing) {
        setSelectedListing(reset[0] || null);
      }
    }
  };

  // If on the initial language selection screen, display clean fullscreen picker
  if (currentPage === 'language-select') {
    return (
      <LanguageSelectionScreen
        onSelectLanguage={handleSelectLanguage}
        currentLanguage={language}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EB] text-[#2A221E] selection:bg-[#FBEEE8] selection:text-[#C2542D]">
      {/* Top Navigation */}
      <Navbar 
        currentPage={currentPage} 
        language={language}
        onNavigate={(page) => {
          if (page === 'seller-listing') {
            setEditingListing(null);
          }
          navigateTo(page);
        }} 
        onOpenLanguageSelect={() => {
          setPreviousPage(currentPage);
          setCurrentPage('language-select');
        }}
      />

      {/* Main Content View with 3D Depth Page Transition */}
      <main className="flex-1 w-full preserve-3d" style={{ perspective: '1200px' }}>
        <div
          key={currentPage + (currentPage === 'seller-profile' && selectedListing ? `-${selectedListing.id}` : '')}
          className="page-3d-transition w-full h-full"
        >
          {currentPage === 'home' && (
            <HomePage
              language={language}
              onNavigate={navigateTo}
              onSelectCategory={handleSelectCategory}
              onSelectListing={handleSelectListing}
              featuredListings={listings}
            />
          )}

          {currentPage === 'seller-listing' && (
            <SellerListingPage
              language={language}
              onNavigate={navigateTo}
              onListingCreated={handleListingCreated}
              editingListing={editingListing}
              onListingUpdated={handleListingUpdated}
            />
          )}

          {currentPage === 'my-listings' && (
            <MyListingsPage
              listings={listings}
              language={language}
              onNavigate={navigateTo}
              onEditListing={handleEditListing}
              onDeleteListing={handleDeleteListing}
              onSelectSeller={handleSelectListing}
            />
          )}

          {currentPage === 'buyer-search' && (
            <BuyerSearchPage
              language={language}
              listings={listings}
              onNavigate={navigateTo}
              onSelectListing={handleSelectListing}
              initialCategory={selectedCategory}
            />
          )}

          {currentPage === 'assistant' && (
            <GeminiChatAssistant
              language={language}
              onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
              onNavigateHome={() => navigateTo('home')}
            />
          )}

          {currentPage === 'seller-profile' && selectedListing && (
            <SellerProfilePage
              seller={selectedListing}
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'seller-profile' && !selectedListing && (
            <div className="max-w-md mx-auto py-20 px-4 text-center">
              <p className="text-base text-[#6A5D54] mb-4">No seller profile selected.</p>
              <button
                onClick={() => navigateTo('buyer-search')}
                className="px-6 py-3 rounded-xl bg-[#1E4D38] text-white font-bold text-base cursor-pointer"
              >
                Go to Buyer Search
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Instant AI & Live Voice Access */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setIsLiveVoiceOpen(true)}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#1E4D38] to-[#2E7254] text-white font-bold text-xs shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-[#DDA74F] cursor-pointer"
          title="Start real-time voice call with gemini-3.8-live"
        >
          <Radio className="w-4 h-4 text-[#DDA74F] animate-pulse" />
          <span className="hidden sm:inline">Live Voice Call</span>
          <span className="sm:hidden">Voice</span>
        </button>

        <button
          onClick={() => navigateTo('assistant')}
          className={`px-4 py-3 rounded-full text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer ${
            currentPage === 'assistant'
              ? 'bg-[#C2542D] ring-4 ring-[#C2542D]/20'
              : 'bg-[#1E4D38] hover:bg-[#163829]'
          }`}
          title="Open Setu Saheli AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-[#DDA74F]" />
          <span>Ask Setu AI</span>
        </button>
      </div>

      {/* Live Voice Conversation Modal (gemini-3.8-live) */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        language={language}
        onNavigateToAssistant={() => {
          setIsLiveVoiceOpen(false);
          navigateTo('assistant');
        }}
      />

      {/* Rural Offline & Intermittent Network Connectivity Indicator */}
      <OfflineIndicator />

      {/* Earthy Footer */}
      <Footer 
        language={language}
        onNavigate={navigateTo} 
        onResetData={handleResetData}
      />
    </div>
  );
}
