import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get("audio") as File;
        const source = formData.get("source") as string || "Unknown Source";
        const language = formData.get("language") as string || "en";

        if (!audioFile) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            return NextResponse.json({ error: "GROQ_API_KEY is not set in environment variables" }, { status: 500 });
        }

        // 1. Transcribe with Groq Whisper
        const transcriptFormData = new FormData();
        transcriptFormData.append("file", audioFile);
        transcriptFormData.append("model", "whisper-large-v3");
        transcriptFormData.append("response_format", "json");
        transcriptFormData.append("language", language === "id" ? "id" : "en"); // Whisper hint

        const transcribeRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${groqApiKey}`,
            },
            body: transcriptFormData as unknown as BodyInit,
        });

        if (!transcribeRes.ok) {
            const err = await transcribeRes.text();
            console.error("Transcription failed", err);
            return NextResponse.json({ error: "Transcription failed via Groq API" }, { status: 500 });
        }

        const transcriptData = await transcribeRes.json();
        const transcriptText = transcriptData.text;

        // 2. Summarize with Groq Llama-3 (Single API Key for everything)
        const targetLangName = language === "id" ? "Indonesian (Bahasa Indonesia)" : "English";
        const prompt = `
You are an expert assistant. Below is the transcript of a meeting, video, or content.
This content was recorded from the following source: ${source}

CRITICAL: You MUST generate the final JSON output (summary and action items) in ${targetLangName}. 

Please generate a well-structured JSON output containing the summary of the content and any action items (if applicable).

Transcript:
"""
${transcriptText}
"""

Output JSON format exactly like this, without any markdown formatting around it:
{
  "summary": "Full cohesive summary of the meeting...",
  "actionItems": [
    "Task 1 assigned to someone",
    "Task 2..."
  ]
}`;

        const llmRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${groqApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.2
            })
        });

        if (!llmRes.ok) {
            const err = await llmRes.text();
            console.error("LLM failed", err);
            return NextResponse.json({ error: "Summarization failed via Llama3" }, { status: 500 });
        }

        const llmData = await llmRes.json();
        const resultObj = JSON.parse(llmData.choices[0].message.content);

        return NextResponse.json({
            transcript: transcriptText,
            summary: resultObj.summary,
            actionItems: resultObj.actionItems || []
        });

    } catch (error: unknown) {
        console.error("API error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
    }
}
