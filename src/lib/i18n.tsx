"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";


type Language = "en" | "id";

interface Translations {
    [key: string]: {
        en: string;
        id: string;
    };
}

export const translations: Translations = {
    // Common
    "app.name": {
        en: "Summary Intelligence",
        id: "Summary Intelligence",
    },
    "app.version": {
        en: "Version",
        id: "Versi",
    },
    "common.loading": {
        en: "Loading...",
        id: "Memuat...",
    },
    "common.save": {
        en: "Save Changes",
        id: "Simpan Perubahan",
    },
    "common.edit": {
        en: "Edit Details",
        id: "Ubah Detail",
    },
    "common.back": {
        en: "Back to Home",
        id: "Kembali ke Beranda",
    },
    "common.source": {
        en: "Source",
        id: "Sumber",
    },
    "common.unknown_source": {
        en: "Unknown Source",
        id: "Sumber Tidak Diketahui",
    },

    // Home Page
    "home.hero.badge": {
        en: "V1.2 - Source Detection",
        id: "V1.2 - Deteksi Sumber",
    },
    "home.hero.subtitle": {
        en: "Capture everything, type nothing. Let AI summarize your YouTube, Discord, and Meetings instantly without any bot permissions.",
        id: "Tangkap semua, tanpa mengetik. Biarkan AI merangkum YouTube, Discord, dan Rapat Anda secara instan tanpa izin bot.",
    },
    "home.footer.copyright": {
        en: "Summary Intelligence. All rights reserved.",
        id: "Summary Intelligence. Hak cipta dilindungi undang-undang.",
    },
    "home.footer.terms": {
        en: "Terms & Conditions",
        id: "Syarat & Ketentuan",
    },
    "home.footer.privacy": {
        en: "Privacy Policy",
        id: "Kebijakan Privasi",
    },
    "home.footer.storage": {
        en: "Storage Usage",
        id: "Penggunaan Penyimpanan",
    },

    // Meeting Recorder
    "recorder.title": {
        en: "Summary Intelligence",
        id: "Summary Intelligence",
    },
    "recorder.subtitle": {
        en: "Record your tabs (YouTube, Discord, etc) & mic. AI will handle the rest.",
        id: "Rekam tab Anda (YouTube, Discord, dll) & mikrofon. AI akan menangani sisanya.",
    },
    "recorder.start": {
        en: "Start Recording",
        id: "Mulai Rekaman",
    },
    "recorder.stop": {
        en: "Stop & Summarize",
        id: "Berhenti & Rangkum",
    },
    "recorder.processing": {
        en: "AI is generating summary...",
        id: "AI sedang membuat ringkasan...",
    },
    "recorder.summary.title": {
        en: "Executive Summary",
        id: "Ringkasan Eksekutif",
    },
    "recorder.action_items.title": {
        en: "Action Items",
        id: "Daftar Tugas",
    },
    "recorder.transcript.title": {
        en: "Transcription",
        id: "Transkripsi",
    },
    "recorder.download": {
        en: "Download Audio",
        id: "Unduh Audio",
    },
    "recorder.error.no_audio": {
        en: "No audio file provided",
        id: "Tidak ada file audio yang disediakan",
    },
    "recorder.error.process_failed": {
        en: "Failed to process the recording. Please try again.",
        id: "Gagal memproses rekaman. Silakan coba lagi.",
    },

    // Meeting History
    "history.title": {
        en: "Meeting History",
        id: "Riwayat Rapat",
    },
    "history.empty": {
        en: "No past meetings recorded yet.",
        id: "Belum ada rekaman rapat terdahulu.",
    },
    "history.tasks": {
        en: "tasks",
        id: "tugas",
    },

    // Terms & Conditions
    "terms.last_updated": {
        en: "Last updated",
        id: "Terakhir diperbarui",
    },
    "terms.sections.1.title": {
        en: "1. Acceptance of Terms",
        id: "1. Penerimaan Ketentuan",
    },
    "terms.sections.1.content": {
        en: "By accessing and using Summary Intelligence (\"the Application\"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not use our service.",
        id: "Dengan mengakses dan menggunakan Summary Intelligence (&quot;Aplikasi&quot;), Anda setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak boleh menggunakan layanan kami.",
    },
    "terms.sections.2.title": {
        en: "2. Service Description",
        id: "2. Deskripsi Layanan",
    },
    "terms.sections.2.content": {
        en: "Summary Intelligence provides local transcription and summarization services utilizing browser-based APIs and third-party AI models. The Application relies on your browser's capabilities to capture audio streams (such as microphone or specific tabs like YouTube, Discord, or Meeting applications).",
        id: "Summary Intelligence menyediakan layanan transkripsi dan perangkuman lokal menggunakan API berbasis browser dan model AI pihak ketiga. Aplikasi bergantung pada kemampuan browser Anda untuk menangkap aliran audio (seperti mikrofon atau tab tertentu seperti YouTube, Discord, atau aplikasi Rapat).",
    },
    "terms.sections.3.title": {
        en: "3. User Responsibilities & Consent",
        id: "3. Tanggung Jawab & Persetujuan Pengguna",
    },
    "terms.sections.3.content": {
        en: "You are solely responsible for ensuring you have the legal right and necessary consent from all participants before recording or transcribing any conversation, meeting, or content. Summary Intelligence is not liable for unauthorized recordings made by the user.",
        id: "Anda bertanggung jawab penuh untuk memastikan Anda memiliki hak hukum dan persetujuan yang diperlukan dari semua peserta sebelum merekam atau mentranskripsikan percakapan, rapat, atau konten apa pun. Summary Intelligence tidak bertanggung jawab atas rekaman yang tidak sah yang dibuat oleh pengguna.",
    },
    "terms.sections.4.title": {
        en: "4. Data Processing & Storage",
        id: "4. Pemrosesan & Penyimpanan Data",
    },
    "terms.sections.4.content": {
        en: "We prioritize your privacy. The Application is designed to process audio through your local environment and sends data strictly out to configured AI providers (e.g., Groq) for summarization. The resulting transcripts and summaries are saved exclusively in your browser's local storage utilizing IndexedDB. We do not maintain centralized backend databases of your recordings.",
        id: "Kami memprioritaskan privasi Anda. Aplikasi ini dirancang untuk memproses audio melalui lingkungan lokal Anda dan mengirimkan data secara ketat ke penyedia AI yang dikonfigurasi (misalnya, Groq) untuk perangkuman. Transkrip dan ringkasan yang dihasilkan disimpan secara eksklusif di penyimpanan lokal browser Anda menggunakan IndexedDB. Kami tidak mengelola database backend terpusat untuk rekaman Anda.",
    },
    "terms.sections.5.title": {
        en: "5. Limitation of Liability",
        id: "5. Batasan Tanggung Jawab",
    },
    "terms.sections.5.content": {
        en: "The Application and its AI-generated summaries are provided \"as is\". We make no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of transcription and summarization results. AI models can hallucinate or omit details. You should always verify critical information.",
        id: "Aplikasi dan ringkasan yang dihasilkan AI disediakan &quot;sebagaimana adanya&quot;. Kami tidak memberikan jaminan, tersurat maupun tersirat, mengenai keakuratan, keandalan, atau kelengkapan hasil transkripsi dan perangkuman. Model AI dapat mengalami halusinasi atau mengabaikan detail. Anda harus selalu memverifikasi informasi penting.",
    },
    "terms.sections.6.title": {
        en: "6. Changes to Terms",
        id: "6. Perubahan Ketentuan",
    },
    "terms.sections.6.content": {
        en: "We reserve the right to modify these terms at any time. We will indicate that changes have been made by updating the \"Last updated\" date at the top of this page. Your continued use of the Application constitutes acceptance of those changes.",
        id: "Kami berhak mengubah ketentuan ini kapan saja. Kami akan menunjukkan bahwa perubahan telah dilakukan dengan memperbarui tanggal &quot;Terakhir diperbarui&quot; di bagian atas halaman ini. Penggunaan berkelanjutan Anda atas Aplikasi merupakan penerimaan atas perubahan tersebut.",
    },

    // Privacy Policy
    "privacy.sections.1.title": {
        en: "1. Introduction",
        id: "1. Pendahuluan",
    },
    "privacy.sections.1.content": {
        en: "At Summary Intelligence, your privacy is our primary concern. This Privacy Policy explains how we handle data when you use our Application to transcribe and summarize browser tabs or microphone audio.",
        id: "Di Summary Intelligence, privasi Anda adalah fokus utama kami. Kebijakan Privasi ini menjelaskan bagaimana kami menangani data saat Anda menggunakan Aplikasi kami untuk mentranskripsi dan merangkum tab browser atau audio mikrofon.",
    },
    "privacy.sections.2.title": {
        en: "2. Data We Collect",
        id: "2. Data yang Kami Kumpulkan",
    },
    "privacy.sections.2.item_1": {
        en: "Audio Data: When you initiate a recording, the Application captures audio from your selected microphone and screen/tab.",
        id: "Data Audio: Saat Anda memulai rekaman, Aplikasi menangkap audio dari mikrofon dan layar/tab yang Anda pilih.",
    },
    "privacy.sections.2.item_2": {
        en: "Local Storage Data: We store transcripts, summaries, and action items locally in your browser's IndexedDB.",
        id: "Data Penyimpanan Lokal: Kami menyimpan transkrip, ringkasan, dan daftar tugas secara lokal di IndexedDB browser Anda.",
    },
    "privacy.sections.3.title": {
        en: "3. How Your Data is Processed",
        id: "3. Bagaimana Data Anda Diproses",
    },
    "privacy.sections.3.content": {
        en: "We do not own a central database to store your recordings. Here is exactly what happens to your audio:",
        id: "Kami tidak memiliki database pusat untuk menyimpan rekaman Anda. Berikut adalah apa yang terjadi pada audio Anda:",
    },
    "privacy.sections.3.item_1": {
        en: "Your audio blob is sent directly to the serverless AI API endpoints (e.g., Groq Whisper model) for immediate transcription.",
        id: "Audio blob Anda dikirim langsung ke endpoint API AI serverless (misalnya model Groq Whisper) untuk transkripsi segera.",
    },
    "privacy.sections.3.item_2": {
        en: "The resulting text transcript is sent to a Large Language Model (e.g., Llama-3) to generate a summary.",
        id: "Hasil transkrip teks kemudian dikirim ke Model Bahasa Besar (misalnya Llama-3) untuk menghasilkan ringkasan.",
    },
    "privacy.sections.3.item_3": {
        en: "The final structured text is immediately returned to your browser and saved inside your local storage (IndexedDB).",
        id: "Teks terstruktur akhir segera dikembalikan ke browser Anda dan disimpan di dalam penyimpanan lokal Anda (IndexedDB).",
    },
    "privacy.sections.3.item_4": {
        en: "We do not record, store, or eavesdrop on any of the audio blobs or transcripts outside of passing them directly to the AI provider.",
        id: "Kami tidak merekam, menyimpan, atau menguping audio blob atau transkrip apa pun selain menyampaikannya langsung ke penyedia AI.",
    },
    "privacy.sections.4.title": {
        en: "4. Third-Party Services",
        id: "4. Layanan Pihak Ketiga",
    },
    "privacy.sections.4.content": {
        en: "While the Application itself does not store your data on external servers, it utilizes third-party AI APIs (like Groq) to process audio and text. Their use of data is governed by their respective privacy policies. We highly recommend reviewing API provider policies to understand how they handle temporary data processing.",
        id: "Meskipun Aplikasi itu sendiri tidak menyimpan data Anda di server eksternal, ia menggunakan API AI pihak ketiga (seperti Groq) untuk memproses audio dan teks. Penggunaan data mereka diatur oleh kebijakan privasi masing-masing. Kami sangat menyarankan untuk meninjau kebijakan penyedia API guna memahami cara mereka menangani pemrosesan data sementara.",
    },
    "privacy.sections.5.title": {
        en: "5. Your Control",
        id: "5. Kendali Anda",
    },
    "privacy.sections.5.content": {
        en: "Because your meeting history is saved locally in your browser:",
        id: "Karena riwayat rapat Anda disimpan secara lokal di browser Anda:",
    },
    "privacy.sections.5.item_1": {
        en: "You have full control over your data.",
        id: "Anda memiliki kendali penuh atas data Anda.",
    },
    "privacy.sections.5.item_2": {
        en: "You can delete your summaries anytime by clearing your browser's site data or interacting with the delete functionalities in the UI.",
        id: "Anda dapat menghapus ringkasan kapan saja dengan membersihkan data situs browser Anda atau berinteraksi dengan fitur hapus di antarmuka pengguna.",
    },
    "privacy.sections.5.item_3": {
        en: "If you switch devices or browsers, your meeting history will not automatically sync unless you manually export and import it.",
        id: "Jika Anda berpindah perangkat atau browser, riwayat rapat tidak akan tersedia secara otomatis kecuali Anda mengekspor dan mengimpornya secara manual.",
    },
    "privacy.sections.6.title": {
        en: "6. Contact Us",
        id: "6. Hubungi Kami",
    },
    "privacy.sections.6.content": {
        en: "If you have any questions or suggestions regarding our Privacy Policy, please contact the developer or repository maintainer.",
        id: "Jika Anda memiliki pertanyaan atau saran mengenai Kebijakan Privasi kami, silakan hubungi pengembang atau pemelihara repositori.",
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== "undefined") {
            const savedLang = localStorage.getItem("app_lang") as Language;
            if (savedLang === "en" || savedLang === "id") return savedLang;
        }
        return "en";
    });
    const mounted = useHasMounted();

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        if (typeof window !== "undefined") {
            localStorage.setItem("app_lang", lang);
        }
    };

    const t = (key: string): string => {
        if (!translations[key]) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
        // During SSR and first hydration, always use "en" to match server
        if (!mounted) return translations[key]["en"];
        return translations[key][language];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
