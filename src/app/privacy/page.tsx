"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useHasMounted } from "@/hooks/useHasMounted";





export default function PrivacyPolicy() {
    const { t } = useLanguage();
    const mounted = useHasMounted();


    return (
        <div className="min-h-screen bg-[#030712] text-zinc-300 font-sans selection:bg-indigo-500/30 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("common.back")}
                </Link>

                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t("home.footer.privacy")}</h1>
                    <p className="text-sm text-zinc-500">{t("terms.last_updated")}: {mounted ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "..."}</p>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("privacy.sections.1.title")}</h2>
                        <p>
                            {t("privacy.sections.1.content")}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("privacy.sections.2.title")}</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>{t("privacy.sections.2.item_1")}</strong></li>
                            <li><strong>{t("privacy.sections.2.item_2")}</strong></li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("privacy.sections.3.title")}</h2>
                        <p>
                            {t("privacy.sections.3.content")}
                        </p>
                        <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li>{t("privacy.sections.3.item_1")}</li>
                            <li>{t("privacy.sections.3.item_2")}</li>
                            <li>{t("privacy.sections.3.item_3")}</li>
                            <li>{t("privacy.sections.3.item_4")}</li>
                        </ol>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("privacy.sections.4.title")}</h2>
                        <p>
                            {t("privacy.sections.4.content")}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("privacy.sections.5.title")}</h2>
                        <p>
                            {t("privacy.sections.5.content")}
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>{t("privacy.sections.5.item_1")}</li>
                            <li>{t("privacy.sections.5.item_2")}</li>
                            <li>{t("privacy.sections.5.item_3")}</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("privacy.sections.6.title")}</h2>
                        <p>
                            {t("privacy.sections.6.content")}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
