export type SkillCategory = 'Tailoring' | 'Cooking' | 'Tutoring' | 'Mehendi' | 'Other';

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export interface LanguageConfig {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  greeting: string;
  speechCode: string;
}

export interface SellerListing {
  id: string;
  name: string;
  category: SkillCategory;
  price: string;
  location: string;
  description: string;
  photo: string;
  isShgVerified: boolean;
  shgGroupName?: string;
  phone?: string;
  whatsapp?: string;
  experienceYears?: number;
  createdAt: number;
  availableDays?: string;
  isMyListing?: boolean;
  originalLanguage?: SupportedLanguage;
  originalText?: {
    name: string;
    location: string;
    description: string;
  };
  englishBase?: {
    name: string;
    location: string;
    description: string;
  };
  translations?: Partial<Record<SupportedLanguage, {
    name: string;
    location: string;
    description: string;
  }>>;
}

export type PageView = 'language-select' | 'home' | 'seller-listing' | 'buyer-search' | 'seller-profile' | 'my-listings';

