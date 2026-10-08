import React, { useState, useRef, useEffect } from 'react';
import { PageView, SkillCategory, SellerListing, SupportedLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../translations';
import { TypeSpeakControl } from './TypeSpeakControl';
import { CasualSpeechAssistant } from './CasualSpeechAssistant';
import { prepareListingWithEnglishBase, ExtractedListingData } from '../utils/translationService';
import { saveListingDraft, getListingDraft, clearListingDraft } from '../utils/storage';
import sunitaPhoto from '../assets/images/sunita_devi_tailoring_1790172574404.jpg';
import parvatiPhoto from '../assets/images/parvati_bai_cooking_1790172589819.jpg';
import shabanaPhoto from '../assets/images/shabana_khatun_mehendi_1790172606382.jpg';
import meenaPhoto from '../assets/images/meena_sharma_classroom_1790173638138.jpg';
import kamalaPhoto from '../assets/images/kamala_ben_tailor_1790173670403.jpg';
import rekhaPhoto from '../assets/images/rekha_verma_kitchen_1790173655636.jpg';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  Check, 
  AlertCircle,
  Sparkles,
  Loader2,
  Languages,
  Info,
  CheckCheck,
  Database
} from 'lucide-react';

interface SellerListingPageProps {
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  onListingCreated: (listing: SellerListing) => void;
  editingListing?: SellerListing | null;
  onListingUpdated?: (listing: SellerListing) => void;
  onOpenSupabaseModal?: () => void;
}

// Sample photo presets if the user doesn't have a photo on device
const SAMPLE_PHOTOS: { category: SkillCategory; label: string; url: string }[] = [
  {
    category: 'Tailoring',
    label: 'Tailoring Work',
    url: sunitaPhoto,
  },
  {
    category: 'Cooking',
    label: 'Home Cooking',
    url: parvatiPhoto,
  },
  {
    category: 'Tutoring',
    label: 'Classroom & Tutoring',
    url: meenaPhoto,
  },
  {
    category: 'Mehendi',
    label: 'Mehendi Art',
    url: shabanaPhoto,
  },
  {
    category: 'Other',
    label: 'Stitching & Crafts',
    url: kamalaPhoto,
  },
];

export const SellerListingPage: React.FC<SellerListingPageProps> = ({
  language,
  onNavigate,
  onListingCreated,
  editingListing,
  onListingUpdated,
  onOpenSupabaseModal,
}) => {
  const t = TRANSLATIONS[language];
  const currentLangConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];
  const isEditMode = Boolean(editingListing);

  const [name, setName] = useState(editingListing?.name || '');
  const [category, setCategory] = useState<SkillCategory>(editingListing?.category || 'Tailoring');
  const [price, setPrice] = useState(editingListing?.price || '');
  const [location, setLocation] = useState(editingListing?.location || '');
  const [description, setDescription] = useState(editingListing?.description || '');
  const [photo, setPhoto] = useState<string>(editingListing?.photo || '');
  const [isShgVerified, setIsShgVerified] = useState(editingListing ? editingListing.isShgVerified : true);
  const [shgGroupName, setShgGroupName] = useState(editingListing?.shgGroupName || '');
  const [phone, setPhone] = useState(editingListing?.phone || '');
  const [autoFilledFromSpeech, setAutoFilledFromSpeech] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<SellerListing | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Restore draft from localStorage if user was disconnected or reloaded
  useEffect(() => {
    if (!isEditMode) {
      const draft = getListingDraft();
      if (draft && (draft.name || draft.price || draft.location || draft.description)) {
        if (draft.name) setName(draft.name);
        if (draft.category) setCategory(draft.category);
        if (draft.price) setPrice(draft.price);
        if (draft.location) setLocation(draft.location);
        if (draft.description) setDescription(draft.description);
        if (draft.phone) setPhone(draft.phone);
        if (draft.shgGroupName) setShgGroupName(draft.shgGroupName);
        if (draft.photo) setPhoto(draft.photo);
        setHasRestoredDraft(true);
      }
    }
  }, [isEditMode]);

  // Auto-save draft changes to localStorage for offline protection
  useEffect(() => {
    if (!isEditMode && !submittedListing) {
      if (name || price || location || description || phone) {
        saveListingDraft({ name, category, price, location, description, phone, shgGroupName, photo });
      }
    }
  }, [name, category, price, location, description, phone, shgGroupName, photo, isEditMode, submittedListing]);

  const handleCasualSpeechExtracted = (data: ExtractedListingData) => {
    if (data.name) setName(data.name);
    if (data.category) setCategory(data.category);
    if (data.price) setPrice(data.price);
    if (data.location) setLocation(data.location);
    if (data.description) setDescription(data.description);

    setAutoFilledFromSpeech(true);
    setFormError(null);

    // Auto-select a matching preset photo if user has not picked one yet
    if (!photo && data.category) {
      const matchingPreset = SAMPLE_PHOTOS.find((p) => p.category === data.category);
      if (matchingPreset) {
        setPhoto(matchingPreset.url);
      }
    }
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Submission & Translation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError(t.sellerListing.errorFile);
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setFormError(t.sellerListing.errorFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setPhoto(result);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetPhoto = (url: string) => {
    setPhoto(url);
    setFormError(null);
  };

  // Handle Form Submission with Gemini Auto-Translation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError(t.sellerListing.errorName);
      return;
    }
    if (!price.trim()) {
      setFormError(t.sellerListing.errorPrice);
      return;
    }
    if (!location.trim()) {
      setFormError(t.sellerListing.errorLocation);
      return;
    }
    if (!description.trim()) {
      setFormError(t.sellerListing.errorDesc);
      return;
    }

    // Fallback photo if none provided
    const finalPhoto =
      photo ||
      SAMPLE_PHOTOS.find((p) => p.category === category)?.url ||
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80';

    setIsSubmitting(true);
    setTranslationStatus(
      isEditMode
        ? 'Saving updates & refreshing English common base with Gemini AI...'
        : 'Saving listing & generating English common base with Gemini AI...'
    );

    const baseListing: SellerListing = {
      id: editingListing?.id || `listing-${Date.now()}`,
      name: name.trim(),
      category,
      price: price.trim(),
      location: location.trim(),
      description: description.trim(),
      photo: finalPhoto,
      isShgVerified,
      shgGroupName: isShgVerified ? (shgGroupName.trim() || 'Local Mahila Bachat Gat') : undefined,
      phone: phone.trim() || '+91 98765 43210',
      whatsapp: phone.trim().replace(/\D/g, '') || '919876543210',
      createdAt: editingListing?.createdAt || Date.now(),
      originalLanguage: language,
      isMyListing: true,
    };

    try {
      // Auto-translate entered text to English base using Gemini API
      const preparedListing = await prepareListingWithEnglishBase(baseListing, language);
      if (isEditMode && onListingUpdated) {
        onListingUpdated(preparedListing);
      } else {
        onListingCreated(preparedListing);
      }
      setSubmittedListing(preparedListing);
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback: save anyway so user work is never lost
      if (isEditMode && onListingUpdated) {
        onListingUpdated(baseListing);
      } else {
        onListingCreated(baseListing);
      }
      setSubmittedListing(baseListing);
    } finally {
      setIsSubmitting(false);
      setTranslationStatus(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back to Home / My Listings Button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          id="seller-back-btn"
          onClick={() => onNavigate(isEditMode ? 'my-listings' : 'home')}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#6B5749] hover:text-[#3D2B1F] px-3.5 py-1.5 rounded-xl hover:bg-[#EFE4D3] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEditMode ? (t.nav.myListings || 'Back to My Listings') : t.sellerListing.backToHome}</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenSupabaseModal && (
            <button
              type="button"
              onClick={onOpenSupabaseModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-800 transition-colors cursor-pointer shadow-2xs"
              title="Connected to Supabase PostgreSQL Database (hoeusmefmobavdxphyyl)"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Supabase DB:</span>
              <span className="font-mono text-[11px] font-bold">hoeusmefmobavdxphyyl</span>
            </button>
          )}

          {isEditMode && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FBEEE8] text-[#C2542D] border border-[#F3D2C4]">
              Editing Mode • {editingListing?.name}
            </span>
          )}
        </div>
      </div>

      {/* Success Modal / Banner */}
      {submittedListing && (
        <div className="mb-8 p-6 sm:p-8 bg-[#EEF6F2] border-2 border-[#1E4D38] rounded-3xl text-center shadow-md animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#1E4D38] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heritage text-[#1E4D38] mb-2">
            {t.sellerListing.successTitle}
          </h2>
          <p className="text-base text-[#3D2B1F] max-w-md mx-auto mb-4">
            {t.sellerListing.successDesc(
              submittedListing.name,
              t.categories[submittedListing.category]?.title || submittedListing.category
            )}
          </p>

          {/* Stored Bilingual Base Card */}
          <div className="my-6 p-4 rounded-2xl bg-[#FFFDF9] border border-[#C7E4D3] text-left max-w-lg mx-auto shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D38] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D49B24]" />
              <span>Multi-Language Storage (Gemini AI)</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-2.5 rounded-xl bg-[#FAF5EB] border border-[#EADBCE]">
                <span className="block font-bold text-[#6B5749] mb-0.5">
                  Original Entered Text ({currentLangConfig.nativeName}):
                </span>
                <p className="text-[#3D2B1F] font-medium italic">"{submittedListing.description}"</p>
              </div>

              {submittedListing.englishBase && submittedListing.originalLanguage !== 'en' && (
                <div className="p-2.5 rounded-xl bg-[#EEF6F2] border border-[#C7E4D3]">
                  <span className="block font-bold text-[#1E4D38] mb-0.5">
                    ✓ Common English Base (Stored for Auto-Translation to Buyers):
                  </span>
                  <p className="text-[#1E4D38] font-medium">"{submittedListing.englishBase.description}"</p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#426653] mt-2.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#1E4D38]" />
              <span>Buyers can now discover your service in Hindi, Kannada, Tamil, Telugu, or English!</span>
            </p>
          </div>

          {/* Supabase Auto-Save Status */}
          <div className="my-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-left max-w-lg mx-auto shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-emerald-900">
                  ✓ Profile Auto-Saved to Supabase Backend
                </span>
                <span className="text-[11px] text-emerald-700 font-mono">
                  Project: hoeusmefmobavdxphyyl • Table: profiles
                </span>
              </div>
            </div>
            {onOpenSupabaseModal && (
              <button
                type="button"
                onClick={onOpenSupabaseModal}
                className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                View Database
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="view-search-after-submit-btn"
              onClick={() => onNavigate('buyer-search')}
              className="px-6 py-3.5 rounded-xl bg-[#1E4D38] hover:bg-[#143526] text-white font-bold text-base transition-colors shadow-sm cursor-pointer"
            >
              {t.sellerListing.viewOnSearchBtn}
            </button>
            <button
              id="view-my-listings-after-submit-btn"
              onClick={() => onNavigate('my-listings')}
              className="px-6 py-3.5 rounded-xl bg-[#FFFDF9] border-2 border-[#C2542D] text-[#C2542D] font-bold text-base hover:bg-[#FBEEE8] transition-colors cursor-pointer"
            >
              {t.nav.myListings || 'Go to My Listings'} →
            </button>
            <button
              id="add-another-listing-btn"
              onClick={() => {
                setSubmittedListing(null);
                setName('');
                setPrice('');
                setLocation('');
                setDescription('');
                setPhoto('');
                setShgGroupName('');
              }}
              className="px-6 py-3.5 rounded-xl bg-[#FFFDF9] border-2 border-[#1E4D38] text-[#1E4D38] font-bold text-base hover:bg-[#EEF6F2] transition-colors cursor-pointer"
            >
              {t.sellerListing.addAnotherBtn}
            </button>
          </div>
        </div>
      )}

      {/* Main Listing Form Card */}
      {!submittedListing && (
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] shadow-sm p-6 sm:p-10">
          {/* Header */}
          <div className="mb-8 border-b border-[#EADBCE] pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FBEEE8] text-[#C2542D] border border-[#F3D2C4] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C2542D]" />
              <span>{t.nav.offerService}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-[#3D2B1F] tracking-tight">
              {isEditMode ? (t.sellerListing.editTitle || 'Edit Your Service Listing') : t.sellerListing.createTitle}
            </h1>
            <p className="text-base text-[#6B5749] mt-2">
              {isEditMode ? (t.sellerListing.editSubtitle || 'Update your service details, rates, or contact information below.') : t.sellerListing.createSubtitle}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF5EB] border border-[#EADBCE] text-xs text-[#6B5749]">
              <Languages className="w-3.5 h-3.5 text-[#C2542D]" />
              <span>
                Active speech language: <strong className="text-[#3D2B1F]">{currentLangConfig.nativeName} ({currentLangConfig.speechCode})</strong>. You can type or speak in any field.
              </span>
            </div>
          </div>

          {/* Smart Casual Voice Extraction Hero Assistant */}
          <CasualSpeechAssistant
            language={language}
            onExtracted={handleCasualSpeechExtracted}
            onScrollToForm={handleScrollToForm}
          />

          {hasRestoredDraft && !submittedListing && (
            <div 
              id="draft-restored-notification"
              className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Restored Unsaved Draft:</strong> Your previous in-progress details were safely recovered from device storage.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearListingDraft();
                  setName('');
                  setPrice('');
                  setLocation('');
                  setDescription('');
                  setPhone('');
                  setShgGroupName('');
                  setPhoto('');
                  setHasRestoredDraft(false);
                }}
                className="text-xs text-amber-800 underline hover:text-amber-950 font-bold shrink-0 cursor-pointer"
              >
                Clear Draft
              </button>
            </div>
          )}

          {autoFilledFromSpeech && (
            <div 
              id="speech-autofill-notification-banner"
              className="mb-6 p-4 rounded-2xl bg-[#EEF6F2] border border-[#BDE0CE] flex items-center justify-between gap-3 text-xs sm:text-sm text-[#1E4D38] animate-fadeIn"
            >
              <div className="flex items-center gap-2.5">
                <CheckCheck className="w-5 h-5 text-[#1E4D38] shrink-0" />
                <span>
                  <strong>Form Auto-Filled by Gemini:</strong> Please review your details below, make any changes if needed, and submit when ready.
                </span>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white text-[#1E4D38] font-bold text-xs border border-[#BDE0CE]">
                Editable
              </span>
            </div>
          )}

          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-[#FDF1EC] border border-[#F5C2AF] text-[#C2542D] flex items-start gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Full Name (Type / Speak Toggle) */}
            <TypeSpeakControl
              id="seller-name"
              label={t.sellerListing.nameLabel}
              helperText={t.sellerListing.nameHelper}
              value={name}
              onChange={setName}
              placeholder={t.sellerListing.namePlaceholder}
              language={language}
              required
            />

            {/* 2. Skill Category */}
            <div>
              <label htmlFor="seller-category" className="block text-base font-bold text-[#3D2B1F] mb-1.5">
                {t.sellerListing.categoryLabel} <span className="text-[#C2542D]">*</span>
              </label>
              <p className="text-xs text-[#6B5749] mb-2">{t.sellerListing.categoryHelper}</p>
              <div className="relative">
                <select
                  id="seller-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#D8C7B5] focus:border-[#C2542D] focus:ring-2 focus:ring-[#FBEEE8] text-base font-medium text-[#3D2B1F] bg-[#FFFDF9] outline-none transition-all cursor-pointer"
                >
                  <option value="Tailoring">
                    {t.categories.Tailoring?.title} ({t.categories.Tailoring?.subtitle})
                  </option>
                  <option value="Cooking">
                    {t.categories.Cooking?.title} ({t.categories.Cooking?.subtitle})
                  </option>
                  <option value="Tutoring">
                    {t.categories.Tutoring?.title} ({t.categories.Tutoring?.subtitle})
                  </option>
                  <option value="Mehendi">
                    {t.categories.Mehendi?.title} ({t.categories.Mehendi?.subtitle})
                  </option>
                  <option value="Other">
                    {t.categories.Other?.title} ({t.categories.Other?.subtitle})
                  </option>
                </select>
              </div>
            </div>

            {/* 3. Price */}
            <div>
              <label htmlFor="seller-price" className="block text-base font-bold text-[#3D2B1F] mb-1.5">
                {t.sellerListing.priceLabel} <span className="text-[#C2542D]">*</span>
              </label>
              <p className="text-xs text-[#6B5749] mb-2">{t.sellerListing.priceHelper}</p>
              <input
                id="seller-price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t.sellerListing.pricePlaceholder}
                className="w-full px-4 py-3.5 rounded-xl border border-[#D8C7B5] focus:border-[#C2542D] focus:ring-2 focus:ring-[#FBEEE8] text-base text-[#3D2B1F] bg-[#FFFDF9] outline-none transition-all placeholder:text-[#9F9185]"
                required
              />
            </div>

            {/* 4. Location/Area (Type / Speak Toggle) */}
            <TypeSpeakControl
              id="seller-location"
              label={t.sellerListing.locationLabel}
              helperText={t.sellerListing.locationHelper}
              value={location}
              onChange={setLocation}
              placeholder={t.sellerListing.locationPlaceholder}
              language={language}
              required
            />

            {/* 5. Short Description / "About your work" (Type / Speak Toggle) */}
            <TypeSpeakControl
              id="seller-description"
              label={t.sellerListing.descLabel}
              helperText={t.sellerListing.descHelper}
              value={description}
              onChange={setDescription}
              placeholder={t.sellerListing.descPlaceholder}
              language={language}
              isTextarea
              rows={4}
              required
            />

            {/* 6. Photo Upload & Presets */}
            <div>
              <label className="block text-base font-bold text-[#2A221E] mb-1.5">
                {t.sellerListing.photoLabel}
              </label>
              <p className="text-xs text-[#6A5D54] mb-3">
                {t.sellerListing.photoHelper}
              </p>

              {/* Upload Drop Area */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <input
                  type="file"
                  id="photo-upload-input"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload-input"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-dashed border-[#C2542D] bg-[#FBEEE8] text-[#C2542D] font-bold text-sm hover:bg-[#F8E2D7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{t.sellerListing.uploadCustomPhoto}</span>
                </label>
                <span className="text-xs text-[#6A5D54] font-medium">{t.sellerListing.orChoosePreset}</span>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {SAMPLE_PHOTOS.map((p) => {
                  const isSelected = photo === p.url;
                  return (
                    <button
                      type="button"
                      key={p.category}
                      onClick={() => handleSelectPresetPhoto(p.url)}
                      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all p-1 group cursor-pointer ${
                        isSelected
                          ? 'border-[#C2542D] ring-2 ring-[#C2542D]/20 bg-[#FAF6F0]'
                          : 'border-[#E8DED2] hover:border-[#D5C7B8] bg-white'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.label}
                        className="w-full h-20 object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-[11px] font-semibold text-[#2A221E] mt-1.5 truncate px-1">
                        {p.label}
                      </p>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C2542D] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Photo Preview if set */}
              {photo && (
                <div className="mt-4 p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DED2] flex items-center gap-3">
                  <img
                    src={photo}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border border-[#D5C7B8]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1E4D38] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {t.sellerListing.selectedPhotoActive}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="text-xs text-[#C2542D] hover:underline mt-0.5 cursor-pointer"
                    >
                      {t.sellerListing.removePhoto}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Phone / WhatsApp Number */}
            <div>
              <label htmlFor="seller-phone" className="block text-base font-bold text-[#3D2B1F] mb-1.5">
                {t.sellerListing.phoneLabel}
              </label>
              <p className="text-xs text-[#6B5749] mb-2">
                {t.sellerListing.phoneHelper}
              </p>
              <input
                id="seller-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3.5 rounded-xl border border-[#D8C7B5] focus:border-[#C2542D] focus:ring-2 focus:ring-[#FBEEE8] text-base text-[#3D2B1F] bg-[#FFFDF9] outline-none transition-all placeholder:text-[#9F9185]"
              />
            </div>

            {/* 8. SHG Verification Option */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3]">
              <div className="flex items-start gap-3">
                <input
                  id="seller-shg-checkbox"
                  type="checkbox"
                  checked={isShgVerified}
                  onChange={(e) => setIsShgVerified(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-[#1E4D38] focus:ring-[#1E4D38] cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="seller-shg-checkbox" className="text-sm sm:text-base font-bold text-[#1E4D38] cursor-pointer">
                    {t.sellerListing.shgCheckbox}
                  </label>
                  <p className="text-xs text-[#426653] mt-1">
                    {t.sellerListing.shgHelper}
                  </p>

                  {isShgVerified && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={shgGroupName}
                        onChange={(e) => setShgGroupName(e.target.value)}
                        placeholder={t.sellerListing.shgGroupPlaceholder}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FFFDF9] border border-[#C7E4D3] focus:border-[#1E4D38] outline-none text-[#3D2B1F]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                id="submit-listing-btn"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#C2542D] hover:bg-[#A13D19] disabled:bg-[#C2542D]/70 text-white font-bold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] border-2 border-[#A13D19] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>{translationStatus || 'Saving & Translating...'}</span>
                  </>
                ) : (
                  <span>{isEditMode ? (t.sellerListing.saveChangesBtn || 'Save Changes • सुरक्षित करें') : t.sellerListing.submitBtn}</span>
                )}
              </button>
              <p className="text-xs text-center text-[#6A5D54] mt-2.5">
                {t.sellerListing.submitSubtext}
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
