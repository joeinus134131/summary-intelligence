"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useHasMounted } from "@/hooks/useHasMounted";





export default function TermsAndConditions() {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t("home.footer.terms")}</h1>
                    <p className="text-sm text-zinc-500">
                        {t("terms.last_updated")}: {mounted ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "..."}
                    </p>
                </div>

                <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("terms.sections.1.title")}</h2>
                        <p>
                            {t("terms.sections.1.content")}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("terms.sections.2.title")}</h2>
                        <p>
                            {t("terms.sections.2.content")}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("terms.sections.3.title")}</h2>
                        <p>
                            {t("terms.sections.3.content")}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("terms.sections.4.title")}</h2>
                        <p>
                            {t("terms.sections.4.content")}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("terms.sections.5.title")}</h2>
                        <p>
                            {t("terms.sections.5.content")}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-zinc-100">{t("terms.sections.6.title")}</h2>
                        <p>
                            {t("terms.sections.6.content")}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
