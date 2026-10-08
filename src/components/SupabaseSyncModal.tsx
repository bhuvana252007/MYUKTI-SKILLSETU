import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Sparkles, 
  ShieldCheck,
  Server,
  Layers
} from 'lucide-react';
import { 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_SCHEMA_SQL, 
  checkSupabaseHealth,
  saveProfileToSupabase,
  SupabaseHealthResult 
} from '../utils/supabaseClient';
import { syncListingsWithSupabase } from '../utils/storage';
import { SellerListing } from '../types';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: (listings: SellerListing[]) => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
}) => {
  const [health, setHealth] = useState<SupabaseHealthResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [testInsertStatus, setTestInsertStatus] = useState<string | null>(null);

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const res = await checkSupabaseHealth();
      setHealth(res);
    } catch (e: any) {
      setHealth({
        connected: false,
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        tableFound: false,
        error: e?.message || 'Check failed',
        schemaNeeded: false,
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runHealthCheck();
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSyncCloudData = async () => {
    setIsSyncingData(true);
    try {
      const res = await syncListingsWithSupabase();
      if (res.success && onSyncComplete) {
        onSyncComplete(res.listings);
      }
      runHealthCheck();
    } finally {
      setIsSyncingData(false);
    }
  };

  const handleTestInsert = async () => {
    setTestInsertStatus('Inserting sample test profile...');
    const testListing: SellerListing = {
      id: `test-profile-${Date.now()}`,
      name: 'Anandi Devi',
      category: 'Tailoring',
      price: '₹250 per blouse',
      location: 'Kengeri, Bengaluru',
      description: 'Specialist in custom designer blouses, embroidery work, and cotton salwar kameez.',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
      isShgVerified: true,
      shgGroupName: 'Pragati Mahila Bachat Gat',
      phone: '+91 98765 43210',
      whatsapp: '919876543210',
      createdAt: Date.now(),
      originalLanguage: 'hi',
    };

    const res = await saveProfileToSupabase(testListing);
    if (res.success) {
      setTestInsertStatus(`✓ Successfully saved to table '${res.tableUsed}' in Supabase!`);
      runHealthCheck();
    } else {
      setTestInsertStatus(`Error: ${res.error || 'Failed to insert'}`);
    }
  };

  if (!isOpen) return null;

  const sqlEditorUrl = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`;
  const tableEditorUrl = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFFDF9] rounded-3xl w-full max-w-2xl shadow-2xl border-2 border-[#1E4D38]/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1E4D38] text-white px-6 py-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight flex items-center gap-2">
                Supabase Backend Connection
                <span className="text-xs bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono border border-emerald-400/30">
                  {SUPABASE_PROJECT_ID}
                </span>
              </h2>
              <p className="text-xs text-white/80">Auto-saves profiles & artisan listings to your PostgreSQL database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Overview Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8DED2] shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-[#1E4D38]" />
                <span className="text-sm font-bold text-[#2A221E]">Live Connection Status</span>
              </div>
              <button
                onClick={runHealthCheck}
                disabled={isChecking}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Check Now</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF5EB] border border-[#EADBCE]">
                <span className="block text-[#6B5749] text-[11px] font-medium">Project ID:</span>
                <span className="font-mono font-bold text-[#1E4D38]">{SUPABASE_PROJECT_ID}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF5EB] border border-[#EADBCE]">
                <span className="block text-[#6B5749] text-[11px] font-medium">Backend REST Endpoint:</span>
                <span className="font-mono font-bold text-[#1E4D38] truncate block">{SUPABASE_URL}</span>
              </div>
            </div>

            {/* Health result banner */}
            {health && (
              <div className="mt-3">
                {health.tableFound ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-800">
                        Database Connected & Ready! (Table: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">{health.activeTable}</code>)
                      </p>
                      <p className="text-emerald-700 mt-0.5">
                        Every profile added or updated in SkillSetu automatically saves directly into your Supabase database.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-amber-800">
                        Connected to Supabase project, but table <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">profiles</code> needs to be created.
                      </p>
                      <p className="text-amber-700 mt-0.5">
                        SkillSetu is working and storing data locally right now. Run the quick SQL below in your Supabase SQL Editor to enable persistent cloud storage!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SQL Setup Instruction Box */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8DED2] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C2542D]" />
                <span className="text-sm font-bold text-[#2A221E]">1-Click SQL Schema Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E4D38] hover:bg-[#163829] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>
                <a
                  href={sqlEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF9] hover:bg-[#F5EAD9] text-[#1E4D38] border border-[#1E4D38]/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Supabase SQL Editor</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-[#6B5749]">
              To see profiles appear in your Supabase Table Editor, copy this SQL and paste it into your Supabase Dashboard:
            </p>

            {/* SQL Snippet Viewer */}
            <div className="relative rounded-xl overflow-hidden border border-stone-300 bg-stone-900 text-stone-100 text-xs font-mono p-3.5 max-h-48 overflow-y-auto">
              <pre className="whitespace-pre-wrap leading-relaxed">{SUPABASE_SCHEMA_SQL}</pre>
            </div>
          </div>

          {/* Action & Verification Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncCloudData}
                disabled={isSyncingData}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E4D38] hover:bg-[#163829] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingData ? 'animate-spin' : ''}`} />
                <span>{isSyncingData ? 'Syncing...' : 'Sync Data from Supabase'}</span>
              </button>

              <button
                onClick={handleTestInsert}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FBEEE8] hover:bg-[#F5DBD0] text-[#C2542D] border border-[#F3D2C4] text-xs font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Sample Profile Insert</span>
              </button>
            </div>

            <a
              href={tableEditorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4D38] hover:underline"
            >
              <span>View Table in Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {testInsertStatus && (
            <div className={`p-2.5 rounded-xl text-xs font-medium border ${
              testInsertStatus.startsWith('✓') 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : testInsertStatus.startsWith('Error')
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-stone-50 text-stone-700 border-stone-300'
            }`}>
              {testInsertStatus}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF5EB] border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-[#6B5749] shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Connected to Supabase Project: <strong className="text-[#1E4D38]">{SUPABASE_PROJECT_ID}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
