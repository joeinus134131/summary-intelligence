"use client";

import { useState, useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";

import MeetingRecorder from "@/components/MeetingRecorder";
import { MeetingHistory } from "@/components/MeetingHistory";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [storageUsage, setStorageUsage] = useState<string>("0.00");

  useEffect(() => {
    const checkStorageUsage = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const usageInMB = (estimate.usage || 0) / (1024 * 1024);
          const quotaInMB = (estimate.quota || 1) / (1024 * 1024);
          const percentage = (usageInMB / quotaInMB) * 100;
          // It's often very small, so we might show 4 decimal places if it's < 0.01
          setStorageUsage(percentage < 0.01 && percentage > 0 ? percentage.toFixed(4) : percentage.toFixed(2));
        } catch (error) {
          console.error("Error estimating storage:", error);
        }
      }
    };

    // Check initially
    checkStorageUsage();

    // Check every 30 seconds
    const interval = setInterval(checkStorageUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  const mounted = useHasMounted();

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-50 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* ... existing dynamic background code ... */}
      <div className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Top Header with Language Toggle */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 py-6 flex justify-end">
        <div className="flex bg-white/5 border border-white/10 rounded-full p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${(!mounted || language === 'en') ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("id")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${(mounted && language === 'id') ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            ID
          </button>
        </div>
      </header>


      <main className="relative z-10 flex flex-1 flex-col items-center p-4 md:p-10 w-full">
        {/* Header Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-medium text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse" />
            {t("home.hero.badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500 mb-4 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedMeetingId(null)}>
            {t("app.name")}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
            {t("home.hero.subtitle")}
          </p>
        </div>

        {/* Main Work Area */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start mb-20 flex-1">
          <div className="flex-1 w-full">
            <MeetingRecorder selectedMeetingId={selectedMeetingId} />
          </div>

          <MeetingHistory onSelect={(id) => {
            setSelectedMeetingId(id);
          }} />
        </div>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto mt-auto pt-6 pb-2 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm gap-4">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} {t("home.footer.copyright")}</p>
            <p className="text-xs text-zinc-600">{t("app.version")}: 1.2.0</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-4 text-xs font-medium">
              <a href="/terms" className="hover:text-zinc-300 transition-colors uppercase tracking-wider">{t("home.footer.terms")}</a>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <a href="/privacy" className="hover:text-zinc-300 transition-colors uppercase tracking-wider">{t("home.footer.privacy")}</a>
            </div>
            <div className="flex items-center gap-2 text-xs bg-black/40 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </div>
              <span>{t("home.footer.storage")}: {storageUsage}%</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
