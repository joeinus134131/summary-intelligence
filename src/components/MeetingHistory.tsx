"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { History, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { id as localeId } from "date-fns/locale";

export function MeetingHistory({ onSelect }: { onSelect: (id: number) => void }) {
    const { t, language } = useLanguage();
    const meetings = useLiveQuery(() => db.meetings.orderBy('date').reverse().toArray());

    return (
        <div className="w-full lg:w-80 flex-shrink-0 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-xl p-5 flex flex-col h-full max-h-[800px]">
            <div className="flex items-center gap-2 text-white mb-6">
                <History className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold tracking-tight">{t("history.title")}</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {!meetings && (
                    <div className="text-center text-zinc-500 text-sm mt-10">
                        {t("common.loading")}
                    </div>
                )}

                {meetings?.length === 0 && (
                    <div className="text-center text-zinc-500 text-sm mt-10">
                        {t("history.empty")}
                    </div>
                )}

                {meetings?.map((meeting) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={meeting.id}
                        onClick={() => meeting.id && onSelect(meeting.id)}
                        className="group cursor-pointer p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-indigo-500/30 transition-all flex flex-col gap-2 relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-indigo-400">
                                {formatDistanceToNow(new Date(meeting.date), {
                                    addSuffix: true,
                                    locale: language === 'id' ? localeId : undefined
                                })}
                            </span>
                            <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                        </div>

                        <p className="text-sm text-zinc-200 font-medium line-clamp-2 leading-relaxed">
                            {meeting.summary}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                                <FileText className="h-3 w-3" />
                                <span>{meeting.actionItems.length} {t("history.tasks")}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
