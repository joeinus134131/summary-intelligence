"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, Square, Download, Loader2, Maximize, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMeetingRecorder } from "@/hooks/useMeetingRecorder";
import { db } from "@/lib/db";
import { useLanguage } from "@/lib/i18n";

export default function MeetingRecorder({ selectedMeetingId }: { selectedMeetingId?: number | null }) {
    const { t, language } = useLanguage();
    const { isRecording, startRecording, stopRecording, audioBlob, audioUrl, sourceName } = useMeetingRecorder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [meetingData, setMeetingData] = useState<{
        id?: number;
        transcript: string;
        summary: string;
        actionItems: string[];
        source?: string;
    } | null>(null);

    // Fetch meeting data if a history item is selected
    useEffect(() => {
        if (selectedMeetingId) {
            setIsProcessing(true);
            db.meetings.get(selectedMeetingId).then(data => {
                if (data) {
                    setMeetingData(data);
                    setIsEditing(false);
                    setErrorMsg(null);
                }
            }).finally(() => {
                setIsProcessing(false);
            });
        } else {
            // Reset if deselected
            setMeetingData(null);
            setIsEditing(false);
            setErrorMsg(null);
        }
    }, [selectedMeetingId]);

    const processAudioBlob = useCallback(async (blob: Blob) => {
        setIsProcessing(true);
        setErrorMsg(null);
        try {
            const formData = new FormData();
            formData.append("audio", blob, "meeting.webm");
            formData.append("source", sourceName);
            formData.append("language", language);

            const response = await fetch("/api/process-meeting", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t("recorder.error.process_failed"));
            }

            const data = await response.json();
            const meetingId = await db.meetings.add({
                date: new Date().toISOString(),
                transcript: data.transcript || "",
                summary: data.summary,
                actionItems: data.actionItems,
                source: sourceName
            });

            setMeetingData({
                id: meetingId,
                transcript: data.transcript || "",
                summary: data.summary,
                actionItems: data.actionItems,
                source: sourceName
            });
            setIsEditing(false);
        } catch (error: unknown) {
            setErrorMsg(error instanceof Error ? error.message : t("recorder.error.process_failed"));
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    }, [sourceName, language, t]);

    useEffect(() => {
        if (audioBlob) {
            processAudioBlob(audioBlob);
        }
    }, [audioBlob, processAudioBlob]);

    const handleSaveEdit = async () => {
        if (!meetingData || !meetingData.id) return;
        try {
            await db.meetings.update(meetingData.id, {
                summary: meetingData.summary,
                actionItems: meetingData.actionItems,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update meeting:", error);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">

            {/* Recorder Panel - Hide if looking at history */}
            {!selectedMeetingId && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />

                    <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                            <h2 className="text-2xl font-bold tracking-tight text-white">{t("recorder.title")}</h2>
                            <p className="text-sm tracking-wide text-zinc-400">{t("recorder.subtitle")}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {errorMsg && (
                                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mr-4">
                                    <AlertCircle className="h-4 w-4" />
                                    {errorMsg}
                                </div>
                            )}

                            {!isRecording && !isProcessing && (
                                <button
                                    onClick={startRecording}
                                    className="group relative flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95"
                                >
                                    <Mic className="h-5 w-5" />
                                    <span>{t("recorder.start")}</span>
                                </button>
                            )}

                            {isRecording && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                                        <span className="relative flex h-3 w-3">
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        <span className="text-sm font-semibold tracking-wider">REC</span>
                                    </div>
                                    <button
                                        onClick={stopRecording}
                                        className="group relative flex items-center justify-center gap-2 rounded-full bg-zinc-800 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-zinc-700 active:scale-95"
                                    >
                                        <Square className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                                        <span>{t("recorder.stop")}</span>
                                    </button>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="font-medium">{t("recorder.processing")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Results Panel */}
            <AnimatePresence>
                {meetingData && !isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col md:flex-row gap-6"
                    >
                        {/* Summary & Action Items */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 text-indigo-400 mb-1">
                                            <Maximize className="h-5 w-5" />
                                            <h3 className="text-lg font-semibold text-white">{t("recorder.summary.title")}</h3>
                                        </div>
                                        {meetingData.source && (
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 self-start border border-zinc-700">
                                                {t("common.source")}: {meetingData.source}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
                                        className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                                    >
                                        {isEditing ? t("common.save") : t("common.edit")}
                                    </button>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={meetingData.summary}
                                        onChange={(e) => setMeetingData({ ...meetingData, summary: e.target.value })}
                                        className="w-full bg-black/30 text-zinc-300 border border-white/10 rounded-lg p-3 min-h-[150px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                        {meetingData.summary}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-md">
                                <h3 className="text-lg font-semibold text-white mb-4">{t("recorder.action_items.title")}</h3>
                                <div className="space-y-3">
                                    {meetingData.actionItems.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                                                {idx + 1}
                                            </div>
                                            {isEditing ? (
                                                <input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...meetingData.actionItems];
                                                        newItems[idx] = e.target.value;
                                                        setMeetingData({ ...meetingData, actionItems: newItems });
                                                    }}
                                                    className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                            ) : (
                                                <span className="text-zinc-300 mt-0.5">{item}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Transcript */}
                        <div className="flex-1 rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-md max-h-[500px] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">{t("recorder.transcript.title")}</h3>
                                {audioUrl && (
                                    <a href={audioUrl} download="meeting-recording.webm" className="text-zinc-400 hover:text-white transition-colors flex gap-2 items-center text-sm font-medium">
                                        <Download className="h-4 w-4" /> {t("recorder.download")}
                                    </a>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm text-zinc-400">
                                {meetingData.transcript.split('\n').map((line, idx) => {
                                    const parts = line.split(':');
                                    if (parts.length > 1) {
                                        const speaker = parts[0];
                                        const text = parts.slice(1).join(':');
                                        return (
                                            <div key={idx} className="bg-white/5 rounded-lg p-3">
                                                <span className="font-semibold text-white">{speaker}:</span>
                                                <span className="ml-2">{text}</span>
                                            </div>
                                        );
                                    }
                                    return <div key={idx} className="bg-white/5 rounded-lg p-3 leading-relaxed">{line}</div>;
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
