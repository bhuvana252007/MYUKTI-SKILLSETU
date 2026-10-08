export type SkillCategory = 'Tailoring' | 'Cooking' | 'Tutoring' | 'Mehendi' | 'Other';

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export interface LanguageConfig {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  greeting: string;
  speechCode: string;
}

export type MemberVerificationStatus = 
  | 'Pending' 
  | 'Community Verified' 
  | 'Reference Verified' 
  | 'Fully Verified' 
  | 'Suspended';

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
  // Trust Indicators
  communityName?: string;
  memberSince?: string;
  verificationStatus?: MemberVerificationStatus;
  completedTransactions?: number;
  rating?: number;
  reviewCount?: number;
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

export type PageView = 
  | 'language-select' 
  | 'role-select' 
  | 'home' 
  | 'seller-listing' 
  | 'buyer-search' 
  | 'seller-profile' 
  | 'my-listings' 
  | 'assistant'
  | 'community-wizard'
  | 'community-dashboard'
  | 'community-transactions'
  | 'transaction-detail';

export type UserRole = 'buyer' | 'provider';
export type ProviderType = 'shg_member' | 'independent' | 'community';

export interface MockUser {
  name: string;
  phone: string;
  role: UserRole;
  providerType?: ProviderType;
  signedInAt: number;
}

export type CommunityType = 
  | 'Self Help Group' 
  | "Women's Collective" 
  | 'Village Community' 
  | 'Producer Group' 
  | 'Cooperative' 
  | 'Other';

export type RepresentativeRole = 
  | 'SHG Leader' 
  | 'Coordinator' 
  | 'President' 
  | 'Secretary' 
  | 'Authorized Representative' 
  | 'Other';

export type MemberType = 
  | 'SHG Member' 
  | 'Artisan' 
  | 'Service Provider' 
  | 'Producer' 
  | 'Other';

export interface CommunityMember {
  id: string;
  name: string;
  mobile: string;
  village: string;
  memberType: MemberType;
  skills: string;
  experience: string;
  status: MemberVerificationStatus;
  invitationCode: string;
  invitationLink?: string;
  joinedDate: string;
  transactionCount: number;
  rating?: number;
  listingId?: string;
}

export interface CommunityProfile {
  id: string;
  name: string;
  type: CommunityType;
  village: string;
  district: string;
  state: string;
  description: string;
  contactNumber: string;
  representative: {
    name: string;
    phone: string;
    role: RepresentativeRole;
    yearsInvolved: number;
  };
  members: CommunityMember[];
  createdAt: number;
}

export type TransactionStatus = 
  | 'Created' 
  | 'Accepted' 
  | 'Paid' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Refunded' 
  | 'Disputed';

export interface TransactionTimelineEvent {
  stage: 'Order created' | 'Provider accepted' | 'Payment confirmed' | 'Delivered' | 'Completed';
  timestamp: string;
  done: boolean;
  note?: string;
}

export interface CommunityTransaction {
  id: string;
  date: string;
  buyerAbbr: string;
  providerAbbr: string;
  providerMemberId?: string;
  serviceOrProduct: string;
  amount: number;
  status: TransactionStatus;
  timeline: TransactionTimelineEvent[];
  disputeReason?: string;
  disputeExplanation?: string;
  disputeRaisedAt?: string;
}

export type ChatRole = 'general' | 'advisor' | 'fast';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MapPlace {
  title: string;
  uri: string;
  address?: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  modelUsed?: string;
  sources?: GroundingSource[];
  mapPlaces?: MapPlace[];
}

