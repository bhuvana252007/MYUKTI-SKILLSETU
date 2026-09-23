import { SellerListing } from '../types';
import { INITIAL_LISTINGS } from '../data/seedListings';

const STORAGE_KEY = 'skillsetu_seller_listings_v1';
const MY_LISTINGS_IDS_KEY = 'skillsetu_my_listing_ids_v1';

export function getMyListingIds(): string[] {
  try {
    const raw = localStorage.getItem(MY_LISTINGS_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

export function isMyListing(id: string): boolean {
  const ids = getMyListingIds();
  return ids.includes(id);
}

export function markAsMyListing(id: string): void {
  try {
    const ids = getMyListingIds();
    if (!ids.includes(id)) {
      localStorage.setItem(MY_LISTINGS_IDS_KEY, JSON.stringify([id, ...ids]));
    }
  } catch (_) {}
}

export function unmarkAsMyListing(id: string): void {
  try {
    const ids = getMyListingIds().filter((i) => i !== id);
    localStorage.setItem(MY_LISTINGS_IDS_KEY, JSON.stringify(ids));
  } catch (_) {}
}

export function getStoredListings(): SellerListing[] {
  try {
    const myIds = getMyListingIds();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with seed listings
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS.map((l) => ({ ...l, isMyListing: myIds.includes(l.id) }));
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((l: SellerListing) => ({
        ...l,
        isMyListing: l.isMyListing || myIds.includes(l.id),
      }));
    }
    return INITIAL_LISTINGS.map((l) => ({ ...l, isMyListing: myIds.includes(l.id) }));
  } catch (err) {
    console.error('Failed to read listings from localStorage', err);
    return INITIAL_LISTINGS;
  }
}

export function saveNewListing(listing: SellerListing): SellerListing[] {
  try {
    markAsMyListing(listing.id);
    const listingWithMyFlag: SellerListing = { ...listing, isMyListing: true };
    const current = getStoredListings();
    const updated = [listingWithMyFlag, ...current.filter((l) => l.id !== listing.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save listing to localStorage', err);
    return getStoredListings();
  }
}

export function updateListing(updatedListing: SellerListing): SellerListing[] {
  try {
    const current = getStoredListings();
    const updated = current.map((item) =>
      item.id === updatedListing.id ? { ...updatedListing, isMyListing: true } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update listing in localStorage', err);
    return getStoredListings();
  }
}

export function deleteListing(listingId: string): SellerListing[] {
  try {
    unmarkAsMyListing(listingId);
    const current = getStoredListings();
    const updated = current.filter((item) => item.id !== listingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete listing from localStorage', err);
    return getStoredListings();
  }
}

export function resetToSeedListings(): SellerListing[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LISTINGS));
    localStorage.removeItem(MY_LISTINGS_IDS_KEY);
    return INITIAL_LISTINGS;
  } catch (err) {
    console.error('Failed to reset listings', err);
    return INITIAL_LISTINGS;
  }
}
