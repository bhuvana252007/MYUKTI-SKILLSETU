import { SellerListing, SupportedLanguage } from '../types';
import { INITIAL_LISTINGS } from '../data/seedListings';
import { 
  saveProfileToSupabase, 
  updateProfileInSupabase, 
  deleteProfileFromSupabase, 
  fetchProfilesFromSupabase,
  SUPABASE_PROJECT_ID 
} from './supabaseClient';

const STORAGE_KEY = 'skillsetu_seller_listings_v1';
const MY_LISTINGS_IDS_KEY = 'skillsetu_my_listing_ids_v1';
const OFFLINE_QUEUE_KEY = 'skillsetu_offline_sync_queue_v1';
const LANGUAGE_PREF_KEY = 'skillsetu_language_preference_v1';
const LISTING_DRAFT_KEY = 'skillsetu_listing_form_draft_v1';

export interface QueuedSyncAction {
  id: string;
  action: 'save' | 'update' | 'delete';
  listing?: SellerListing;
  listingId?: string;
  timestamp: number;
  retryCount: number;
}

export interface SupabaseSyncState {
  isSyncing: boolean;
  lastSyncedAt?: number;
  offlineQueueCount?: number;
  lastResult?: {
    success: boolean;
    tableUsed?: string;
    error?: string;
    isSchemaMissing?: boolean;
    profileId?: string;
    action?: 'save' | 'update' | 'delete' | 'fetch' | 'offline_flush';
    isOfflineQueued?: boolean;
  };
}

let currentSyncState: SupabaseSyncState = {
  isSyncing: false,
};

export function getOfflineSyncQueue(): QueuedSyncAction[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function saveOfflineSyncQueue(queue: QueuedSyncAction[]): void {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    notifySyncUpdate({
      ...currentSyncState,
      offlineQueueCount: queue.length,
    });
  } catch (_) {}
}

export function enqueueOfflineAction(action: 'save' | 'update' | 'delete', listing?: SellerListing, listingId?: string): void {
  const queue = getOfflineSyncQueue();
  const item: QueuedSyncAction = {
    id: `${action}-${listingId || listing?.id || Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action,
    listing,
    listingId: listingId || listing?.id,
    timestamp: Date.now(),
    retryCount: 0,
  };
  // De-duplicate if same listingId was already queued
  const filtered = queue.filter(q => q.listingId !== item.listingId || q.action !== item.action);
  saveOfflineSyncQueue([...filtered, item]);
}

let isFlushingQueue = false;

export async function flushOfflineSyncQueue(): Promise<{ processed: number; succeeded: number }> {
  if (isFlushingQueue) return { processed: 0, succeeded: 0 };
  const queue = getOfflineSyncQueue();
  if (queue.length === 0) return { processed: 0, succeeded: 0 };

  isFlushingQueue = true;
  notifySyncUpdate({ isSyncing: true, offlineQueueCount: queue.length });

  let succeeded = 0;
  const remaining: QueuedSyncAction[] = [];

  for (const item of queue) {
    try {
      if (item.action === 'save' && item.listing) {
        const res = await saveProfileToSupabase(item.listing);
        if (res.success) {
          succeeded++;
        } else {
          item.retryCount += 1;
          if (item.retryCount < 5) remaining.push(item);
        }
      } else if (item.action === 'update' && item.listing) {
        const res = await updateProfileInSupabase(item.listing);
        if (res.success) {
          succeeded++;
        } else {
          item.retryCount += 1;
          if (item.retryCount < 5) remaining.push(item);
        }
      } else if (item.action === 'delete' && item.listingId) {
        const res = await deleteProfileFromSupabase(item.listingId);
        if (res.success) {
          succeeded++;
        } else {
          item.retryCount += 1;
          if (item.retryCount < 5) remaining.push(item);
        }
      }
    } catch (err) {
      item.retryCount += 1;
      if (item.retryCount < 5) remaining.push(item);
    }
  }

  saveOfflineSyncQueue(remaining);
  isFlushingQueue = false;

  notifySyncUpdate({
    isSyncing: false,
    lastSyncedAt: Date.now(),
    offlineQueueCount: remaining.length,
    lastResult: {
      success: succeeded > 0,
      action: 'offline_flush',
    }
  });

  return { processed: queue.length, succeeded };
}

// Auto-sync pending queue when internet connection restores
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[SkillSetu] Internet connection detected. Flushing offline queue...');
    flushOfflineSyncQueue();
    syncListingsWithSupabase();
  });
}

export function getStoredLanguagePreference(): SupportedLanguage | null {
  try {
    const raw = localStorage.getItem(LANGUAGE_PREF_KEY);
    if (raw && ['en', 'hi', 'kn', 'ta', 'te'].includes(raw)) {
      return raw as SupportedLanguage;
    }
    return null;
  } catch (_) {
    return null;
  }
}

export function saveStoredLanguagePreference(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_PREF_KEY, lang);
  } catch (_) {}
}

export function saveListingDraft(draft: any): void {
  try {
    localStorage.setItem(LISTING_DRAFT_KEY, JSON.stringify(draft));
  } catch (_) {}
}

export function getListingDraft(): any | null {
  try {
    const raw = localStorage.getItem(LISTING_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function clearListingDraft(): void {
  try {
    localStorage.removeItem(LISTING_DRAFT_KEY);
  } catch (_) {}
}

export function getSupabaseSyncState(): SupabaseSyncState {
  return {
    ...currentSyncState,
    offlineQueueCount: getOfflineSyncQueue().length,
  };
}

function notifySyncUpdate(state: SupabaseSyncState) {
  currentSyncState = state;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('skillsetu:supabase-sync', { detail: state }));
  }
}

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
      const seedMap = new Map(INITIAL_LISTINGS.map((s) => [s.id, s]));
      const refreshed = parsed.map((l: SellerListing) => {
        const seed = seedMap.get(l.id);
        const photo = seed && !l.isMyListing ? seed.photo : (l.photo || seed?.photo || '');
        return {
          ...l,
          photo,
          isMyListing: l.isMyListing || myIds.includes(l.id),
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
      return refreshed;
    }
    return INITIAL_LISTINGS.map((l) => ({ ...l, isMyListing: myIds.includes(l.id) }));
  } catch (err) {
    console.error('Failed to read listings from localStorage', err);
    return INITIAL_LISTINGS;
  }
}

/**
 * Saves a new listing locally and asynchronously syncs to Supabase database (with offline queueing)
 */
export function saveNewListing(listing: SellerListing): SellerListing[] {
  try {
    markAsMyListing(listing.id);
    const listingWithMyFlag: SellerListing = { ...listing, isMyListing: true };
    const current = getStoredListings();
    const updated = [listingWithMyFlag, ...current.filter((l) => l.id !== listing.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Clear any draft in progress since listing is published
    clearListingDraft();

    // Check if offline
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      enqueueOfflineAction('save', listingWithMyFlag);
      notifySyncUpdate({
        isSyncing: false,
        lastSyncedAt: Date.now(),
        lastResult: {
          success: true,
          action: 'save',
          profileId: listing.id,
          isOfflineQueued: true,
        },
      });
      return updated;
    }

    // Asynchronously send to Supabase database
    notifySyncUpdate({
      isSyncing: true,
      lastSyncedAt: Date.now(),
      lastResult: { success: false, action: 'save', profileId: listing.id }
    });

    saveProfileToSupabase(listingWithMyFlag)
      .then((res) => {
        if (!res.success) {
          enqueueOfflineAction('save', listingWithMyFlag);
        }
        notifySyncUpdate({
          isSyncing: false,
          lastSyncedAt: Date.now(),
          lastResult: {
            success: res.success,
            tableUsed: res.tableUsed,
            error: res.error,
            isSchemaMissing: res.isSchemaMissing,
            profileId: listing.id,
            action: 'save',
            isOfflineQueued: !res.success,
          },
        });
      })
      .catch((err) => {
        enqueueOfflineAction('save', listingWithMyFlag);
        notifySyncUpdate({
          isSyncing: false,
          lastSyncedAt: Date.now(),
          lastResult: {
            success: false,
            error: err?.message || 'Error saving to Supabase (queued offline)',
            profileId: listing.id,
            action: 'save',
            isOfflineQueued: true,
          },
        });
      });

    return updated;
  } catch (err) {
    console.error('Failed to save listing to localStorage', err);
    return getStoredListings();
  }
}

/**
 * Updates an existing listing locally and in Supabase database (with offline queueing)
 */
export function updateListing(updatedListing: SellerListing): SellerListing[] {
  try {
    const current = getStoredListings();
    const updated = current.map((item) =>
      item.id === updatedListing.id ? { ...updatedListing, isMyListing: true } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      enqueueOfflineAction('update', { ...updatedListing, isMyListing: true });
      notifySyncUpdate({
        isSyncing: false,
        lastSyncedAt: Date.now(),
        lastResult: {
          success: true,
          action: 'update',
          profileId: updatedListing.id,
          isOfflineQueued: true,
        },
      });
      return updated;
    }

    // Asynchronously update in Supabase
    notifySyncUpdate({
      isSyncing: true,
      lastSyncedAt: Date.now(),
      lastResult: { success: false, action: 'update', profileId: updatedListing.id }
    });

    updateProfileInSupabase({ ...updatedListing, isMyListing: true })
      .then((res) => {
        if (!res.success) {
          enqueueOfflineAction('update', { ...updatedListing, isMyListing: true });
        }
        notifySyncUpdate({
          isSyncing: false,
          lastSyncedAt: Date.now(),
          lastResult: {
            success: res.success,
            tableUsed: res.tableUsed,
            error: res.error,
            profileId: updatedListing.id,
            action: 'update',
            isOfflineQueued: !res.success,
          },
        });
      })
      .catch((err) => {
        enqueueOfflineAction('update', { ...updatedListing, isMyListing: true });
        notifySyncUpdate({
          isSyncing: false,
          lastSyncedAt: Date.now(),
          lastResult: {
            success: false,
            error: err?.message || 'Error updating in Supabase (queued offline)',
            profileId: updatedListing.id,
            action: 'update',
            isOfflineQueued: true,
          },
        });
      });

    return updated;
  } catch (err) {
    console.error('Failed to update listing in localStorage', err);
    return getStoredListings();
  }
}

/**
 * Deletes a listing locally and in Supabase database (with offline queueing)
 */
export function deleteListing(listingId: string): SellerListing[] {
  try {
    unmarkAsMyListing(listingId);
    const current = getStoredListings();
    const updated = current.filter((item) => item.id !== listingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      enqueueOfflineAction('delete', undefined, listingId);
      return updated;
    }

    // Delete in Supabase in background
    deleteProfileFromSupabase(listingId).catch(() => {
      enqueueOfflineAction('delete', undefined, listingId);
    });

    return updated;
  } catch (err) {
    console.error('Failed to delete listing from localStorage', err);
    return getStoredListings();
  }
}

/**
 * Syncs listings with Supabase database:
 * Fetches cloud records from Supabase and merges them with locally created listings.
 */
export async function syncListingsWithSupabase(): Promise<{
  success: boolean;
  listings: SellerListing[];
  count: number;
  tableUsed?: string;
  error?: string;
}> {
  try {
    notifySyncUpdate({ isSyncing: true });
    const res = await fetchProfilesFromSupabase();

    if (res.success && res.profiles.length > 0) {
      const myIds = getMyListingIds();
      const currentLocal = getStoredListings();
      const localMap = new Map(currentLocal.map((l) => [l.id, l]));

      // Merge Supabase profiles
      res.profiles.forEach((p) => {
        const isMine = myIds.includes(p.id) || localMap.get(p.id)?.isMyListing || false;
        localMap.set(p.id, { ...p, isMyListing: isMine });
      });

      const mergedList = Array.from(localMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));

      notifySyncUpdate({
        isSyncing: false,
        lastSyncedAt: Date.now(),
        lastResult: {
          success: true,
          tableUsed: res.tableUsed,
          action: 'fetch',
        },
      });

      return {
        success: true,
        listings: mergedList,
        count: res.profiles.length,
        tableUsed: res.tableUsed,
      };
    }

    notifySyncUpdate({
      isSyncing: false,
      lastSyncedAt: Date.now(),
      lastResult: {
        success: res.success,
        tableUsed: res.tableUsed,
        error: res.error,
        action: 'fetch',
      },
    });

    return {
      success: res.success,
      listings: getStoredListings(),
      count: 0,
      tableUsed: res.tableUsed,
      error: res.error,
    };
  } catch (err: any) {
    notifySyncUpdate({
      isSyncing: false,
      lastSyncedAt: Date.now(),
      lastResult: {
        success: false,
        error: err?.message || 'Error syncing with Supabase',
        action: 'fetch',
      },
    });
    return {
      success: false,
      listings: getStoredListings(),
      count: 0,
      error: err?.message,
    };
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
