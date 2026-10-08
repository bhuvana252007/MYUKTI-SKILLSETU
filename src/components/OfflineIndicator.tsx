import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getOfflineSyncQueue, flushOfflineSyncQueue, syncListingsWithSupabase } from '../utils/storage';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, HardDriveDownload } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const updateQueue = () => {
      setOfflineQueueCount(getOfflineSyncQueue().length);
    };

    updateQueue();

    const handleSyncEvent = () => {
      updateQueue();
    };

    window.addEventListener('skillsetu:supabase-sync', handleSyncEvent);
    return () => {
      window.removeEventListener('skillsetu:supabase-sync', handleSyncEvent);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setJustReconnected(false);
    } else if (wasOffline) {
      // Reconnected
      setJustReconnected(true);
      handleManualSync();
      const timer = setTimeout(() => {
        setJustReconnected(false);
        setWasOffline(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await flushOfflineSyncQueue();
      await syncListingsWithSupabase();
      setOfflineQueueCount(getOfflineSyncQueue().length);
    } catch (err) {
      console.warn('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Reconnected banner (brief 5 second success notification)
  if (isOnline && justReconnected) {
    return (
      <div 
        id="reconnected-indicator"
        className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#1E4D38] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#2D7254] flex items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in"
      >
        <div className="flex items-center gap-2.5">
          <Wifi className="w-4 h-4 text-emerald-300 shrink-0" />
          <div>
            <p className="font-bold">Back Online</p>
            <p className="text-emerald-100/90 text-xs">All local offline changes are now synced with cloud.</p>
          </div>
        </div>
        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
      </div>
    );
  }

  // Offline status banner
  if (!isOnline) {
    return (
      <div 
        id="offline-indicator"
        className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#3D2B1F] text-[#FAF5EB] px-4 py-3 rounded-2xl shadow-2xl border-2 border-[#D49B24] flex items-center justify-between gap-3 text-xs sm:text-sm"
      >
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>Rural Offline Mode</span>
              {offlineQueueCount > 0 && (
                <span className="bg-amber-400 text-[#2B1B12] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {offlineQueueCount} pending
                </span>
              )}
            </p>
            <p className="text-stone-300 text-[11px] leading-tight mt-0.5">
              Listings & searches run offline from device storage. Will auto-sync when connection restores.
            </p>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="shrink-0 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Retry sync"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  // If online but there are still items pending in queue
  if (offlineQueueCount > 0) {
    return (
      <div 
        id="pending-queue-indicator"
        className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#FFFDF9] text-[#3D2B1F] px-4 py-3 rounded-2xl shadow-lg border border-[#EADBCE] flex items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2">
          <HardDriveDownload className="w-4 h-4 text-[#C2542D] shrink-0" />
          <span><strong>{offlineQueueCount} offline update{offlineQueueCount > 1 ? 's' : ''}</strong> pending upload.</span>
        </div>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-3 py-1.5 rounded-xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Sync Now</span>
        </button>
      </div>
    );
  }

  return null;
};
