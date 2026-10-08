import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SellerListing } from '../types';

// Supabase project credentials provided by the user
export const SUPABASE_PROJECT_ID = 'hoeusmefmobavdxphyyl';
export const SUPABASE_URL = 
  import.meta.env?.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = 
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_76xuAe2LYj-dVVDHjSPetg_eDf5NEJo';

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_SCHEMA_SQL = `-- Run this in your Supabase Dashboard -> SQL Editor (New Query -> Run)
-- Project: ${SUPABASE_PROJECT_ID}

create table if not exists public.profiles (
  id text primary key,
  name text not null,
  category text not null,
  price text,
  location text,
  description text,
  photo text,
  phone text,
  whatsapp text,
  is_shg_verified boolean default false,
  shg_group_name text,
  original_language text default 'hi',
  english_base jsonb,
  translations jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Set up permissive policies so users can create and view profiles
drop policy if exists "Allow public read access on profiles" on public.profiles;
create policy "Allow public read access on profiles"
  on public.profiles for select
  using (true);

drop policy if exists "Allow public insert access on profiles" on public.profiles;
create policy "Allow public insert access on profiles"
  on public.profiles for insert
  with check (true);

drop policy if exists "Allow public update access on profiles" on public.profiles;
create policy "Allow public update access on profiles"
  on public.profiles for update
  using (true);

drop policy if exists "Allow public delete access on profiles" on public.profiles;
create policy "Allow public delete access on profiles"
  on public.profiles for delete
  using (true);
`;

export interface SupabaseHealthResult {
  connected: boolean;
  projectId: string;
  url: string;
  tableFound: boolean;
  activeTable?: string;
  error?: string;
  schemaNeeded: boolean;
}

/**
 * Checks connection health and whether the profiles table exists in Supabase
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  try {
    // Try querying 'profiles' table first
    const { error: profileError } = await supabase.from('profiles').select('id').limit(1);

    if (!profileError) {
      return {
        connected: true,
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        tableFound: true,
        activeTable: 'profiles',
        schemaNeeded: false,
      };
    }

    // If 'profiles' not found, check 'seller_profiles' or 'listings'
    if (profileError.code === 'PGRST205') {
      const { error: sellerProfileError } = await supabase.from('seller_profiles').select('id').limit(1);
      if (!sellerProfileError) {
        return {
          connected: true,
          projectId: SUPABASE_PROJECT_ID,
          url: SUPABASE_URL,
          tableFound: true,
          activeTable: 'seller_profiles',
          schemaNeeded: false,
        };
      }

      const { error: listingsError } = await supabase.from('listings').select('id').limit(1);
      if (!listingsError) {
        return {
          connected: true,
          projectId: SUPABASE_PROJECT_ID,
          url: SUPABASE_URL,
          tableFound: true,
          activeTable: 'listings',
          schemaNeeded: false,
        };
      }

      return {
        connected: true,
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        tableFound: false,
        error: "Table 'public.profiles' does not exist yet in Supabase schema cache.",
        schemaNeeded: true,
      };
    }

    return {
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      tableFound: false,
      error: profileError.message || profileError.details,
      schemaNeeded: profileError.code === 'PGRST205' || profileError.message?.includes('schema cache'),
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      tableFound: false,
      error: err?.message || 'Network error connecting to Supabase',
      schemaNeeded: false,
    };
  }
}

/**
 * Converts a frontend SellerListing into a Supabase database profile record
 */
export function formatListingForSupabase(listing: SellerListing): Record<string, any> {
  return {
    id: listing.id,
    name: listing.name,
    category: listing.category,
    price: listing.price,
    location: listing.location,
    description: listing.description,
    photo: listing.photo,
    phone: listing.phone || '',
    whatsapp: listing.whatsapp || '',
    is_shg_verified: Boolean(listing.isShgVerified),
    shg_group_name: listing.shgGroupName || '',
    original_language: listing.originalLanguage || 'hi',
    english_base: listing.englishBase || null,
    translations: listing.translations || null,
    created_at: listing.createdAt ? new Date(listing.createdAt).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Converts a Supabase profile row back into a frontend SellerListing
 */
export function formatSupabaseRowToListing(row: Record<string, any>, isMyListing = false): SellerListing {
  const createdAtNum = row.created_at ? new Date(row.created_at).getTime() : Date.now();
  return {
    id: row.id,
    name: row.name || 'Unnamed Artisan',
    category: row.category || 'Other',
    price: row.price || '',
    location: row.location || '',
    description: row.description || '',
    photo: row.photo || '',
    isShgVerified: Boolean(row.is_shg_verified ?? row.isShgVerified),
    shgGroupName: row.shg_group_name ?? row.shgGroupName,
    phone: row.phone || undefined,
    whatsapp: row.whatsapp || undefined,
    originalLanguage: row.original_language ?? row.originalLanguage ?? 'hi',
    englishBase: row.english_base ?? row.englishBase,
    translations: row.translations,
    createdAt: createdAtNum,
    isMyListing,
  };
}

/**
 * Automatically saves a new profile to Supabase database
 */
export async function saveProfileToSupabase(listing: SellerListing): Promise<{
  success: boolean;
  tableUsed?: string;
  error?: string;
  isSchemaMissing?: boolean;
}> {
  const payload = formatListingForSupabase(listing);
  const candidateTables = ['profiles', 'seller_profiles', 'listings'];

  for (const table of candidateTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (!error) {
        console.log(`[Supabase]: Successfully saved profile to '${table}' table in project ${SUPABASE_PROJECT_ID}`);
        return { success: true, tableUsed: table };
      }

      // If table doesn't exist, try the next candidate
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        continue;
      }

      // Other database error (e.g. column mismatch or RLS)
      console.warn(`[Supabase Error on '${table}']:`, error.message);
      return { success: false, error: error.message, tableUsed: table };
    } catch (err: any) {
      console.warn(`[Supabase Request Error on '${table}']:`, err?.message);
    }
  }

  return {
    success: false,
    isSchemaMissing: true,
    error: `Could not find 'profiles' table in Supabase project '${SUPABASE_PROJECT_ID}'. Please run the SQL schema setup in Supabase SQL editor.`,
  };
}

/**
 * Updates an existing profile in Supabase database
 */
export async function updateProfileInSupabase(listing: SellerListing): Promise<{
  success: boolean;
  tableUsed?: string;
  error?: string;
}> {
  return saveProfileToSupabase(listing);
}

/**
 * Deletes a profile from Supabase database
 */
export async function deleteProfileFromSupabase(listingId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const candidateTables = ['profiles', 'seller_profiles', 'listings'];

  for (const table of candidateTables) {
    try {
      const { error } = await supabase.from(table).delete().eq('id', listingId);
      if (!error) {
        console.log(`[Supabase]: Deleted profile '${listingId}' from '${table}' table`);
        return { success: true };
      }
      if (error.code === 'PGRST205') continue;
    } catch (err) {
      // Continue to next candidate
    }
  }

  return { success: true };
}

/**
 * Fetches all profiles saved in Supabase database
 */
export async function fetchProfilesFromSupabase(): Promise<{
  success: boolean;
  profiles: SellerListing[];
  tableUsed?: string;
  error?: string;
}> {
  const candidateTables = ['profiles', 'seller_profiles', 'listings'];

  for (const table of candidateTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted = data.map((row) => formatSupabaseRowToListing(row));
        return { success: true, profiles: formatted, tableUsed: table };
      }

      if (!error && Array.isArray(data) && data.length === 0) {
        return { success: true, profiles: [], tableUsed: table };
      }

      if (error?.code === 'PGRST205') continue;
    } catch (err: any) {
      // Continue to next candidate
    }
  }

  return { success: false, profiles: [], error: 'No profiles table found or error fetching data' };
}
